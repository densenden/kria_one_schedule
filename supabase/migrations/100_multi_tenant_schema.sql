-- ============================================================================
-- Multi-Tenant Schema for White-Label Sports Community Platform
-- ============================================================================

-- Drop existing tables if they exist (clean slate for new architecture)
DROP TABLE IF EXISTS public.course_participants CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.course_schedules CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS course_type CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TENANTS (Gyms/Studios)
-- ============================================================================
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,                    -- URL identifier (e.g., "kria", "gymx")
    name TEXT NOT NULL,
    domain TEXT UNIQUE,                           -- Custom domain (optional)

    -- Branding
    primary_color TEXT DEFAULT '#0891b2',         -- Tailwind cyan-600
    secondary_color TEXT DEFAULT '#1e40af',       -- Tailwind blue-800
    logo_url TEXT,
    favicon_url TEXT,

    -- Contact Info
    email TEXT,
    phone TEXT,
    address TEXT,

    -- Stripe Connect
    stripe_account_id TEXT,
    stripe_onboarding_complete BOOLEAN DEFAULT false,

    -- Settings (flexible JSON config)
    settings JSONB DEFAULT '{
        "currency": "EUR",
        "timezone": "Europe/Berlin",
        "booking_lead_time_hours": 2,
        "cancellation_hours": 24,
        "show_participant_count": true,
        "require_payment": true
    }'::jsonb,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Meta
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USERS (Clerk-synced, Multi-tenant)
-- ============================================================================
CREATE TABLE public.users (
    id TEXT PRIMARY KEY,                          -- Clerk User ID
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    clerk_user_id TEXT UNIQUE NOT NULL,

    -- Basic Info
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,

    -- Role within tenant
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'coach', 'admin', 'owner')),

    -- Profile
    bio TEXT,
    athlete_info JSONB DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,

    -- Preferences
    notification_preferences JSONB DEFAULT '{
        "email_bookings": true,
        "email_reminders": true,
        "email_marketing": false
    }'::jsonb,

    -- Meta
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tenant_id, email)
);

-- ============================================================================
-- COURSES (Per Tenant)
-- ============================================================================
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

    -- Basic Info
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,                       -- For cards/previews

    -- Categorization
    type TEXT NOT NULL,                           -- Flexible per tenant
    tags TEXT[] DEFAULT '{}',                     -- Additional categorization

    -- Media
    image_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',

    -- Instructor
    instructor_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,

    -- Capacity & Pricing
    max_participants INTEGER DEFAULT 10,
    min_participants INTEGER DEFAULT 1,
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'EUR',

    -- Duration
    duration_minutes INTEGER DEFAULT 60,

    -- Level & Requirements
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'all')),
    requirements TEXT,

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,

    -- SEO
    meta_title TEXT,
    meta_description TEXT,

    -- Meta
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SCHEDULES (Course Instances)
-- ============================================================================
CREATE TABLE public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,

    -- Timing
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,

    -- Location
    location TEXT NOT NULL,
    location_details TEXT,                        -- Room number, etc.

    -- Capacity
    available_spots INTEGER,                      -- Override course default

    -- Instructor (can override course default)
    instructor_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,

    -- Pricing (can override course default)
    price_override DECIMAL(10,2),

    -- Recurrence (for recurring schedules)
    recurrence_rule TEXT,                         -- RRULE format
    recurrence_parent_id UUID REFERENCES public.schedules(id),

    -- Status
    is_cancelled BOOLEAN DEFAULT false,
    cancellation_reason TEXT,

    -- Meta
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BOOKINGS
-- ============================================================================
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,

    -- Payment
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,
    amount DECIMAL(10,2),
    currency TEXT DEFAULT 'EUR',

    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending',          -- Awaiting payment
        'confirmed',        -- Paid and confirmed
        'cancelled',        -- Cancelled by user
        'refunded',         -- Refunded
        'no_show'           -- Did not attend
    )),

    -- Timestamps
    booked_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,

    -- Visibility in participant list
    is_visible BOOLEAN DEFAULT true,

    -- Notes
    user_notes TEXT,
    admin_notes TEXT,

    -- Prevent double booking
    UNIQUE(user_id, schedule_id)
);

-- ============================================================================
-- PAGES (CMS)
-- ============================================================================
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

    -- Identification
    slug TEXT NOT NULL,                           -- URL path

    -- Content
    title TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '[]',          -- Array of content blocks

    -- SEO
    meta_title TEXT,
    meta_description TEXT,

    -- Status
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,

    -- Navigation
    show_in_nav BOOLEAN DEFAULT false,
    nav_order INTEGER DEFAULT 0,

    -- Meta
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tenant_id, slug)
);

-- ============================================================================
-- WAITLIST (For full courses)
-- ============================================================================
CREATE TABLE public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,

    position INTEGER NOT NULL,
    notified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, schedule_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Tenants
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_domain ON public.tenants(domain);

-- Users
CREATE INDEX idx_users_tenant_id ON public.users(tenant_id);
CREATE INDEX idx_users_clerk_user_id ON public.users(clerk_user_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- Courses
CREATE INDEX idx_courses_tenant_id ON public.courses(tenant_id);
CREATE INDEX idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX idx_courses_type ON public.courses(type);
CREATE INDEX idx_courses_is_active ON public.courses(is_active);

-- Schedules
CREATE INDEX idx_schedules_tenant_id ON public.schedules(tenant_id);
CREATE INDEX idx_schedules_course_id ON public.schedules(course_id);
CREATE INDEX idx_schedules_start_time ON public.schedules(start_time);
CREATE INDEX idx_schedules_instructor_id ON public.schedules(instructor_id);

-- Bookings
CREATE INDEX idx_bookings_tenant_id ON public.bookings(tenant_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_schedule_id ON public.bookings(schedule_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);

-- Pages
CREATE INDEX idx_pages_tenant_id ON public.pages(tenant_id);
CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_pages_is_published ON public.pages(is_published);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
    BEFORE UPDATE ON public.schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Get upcoming schedules with full details
CREATE OR REPLACE FUNCTION get_tenant_schedules(
    p_tenant_id UUID,
    p_from_date TIMESTAMPTZ DEFAULT NOW(),
    p_to_date TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
)
RETURNS TABLE (
    schedule_id UUID,
    course_id UUID,
    course_title TEXT,
    course_type TEXT,
    course_image TEXT,
    instructor_name TEXT,
    instructor_avatar TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    location TEXT,
    available_spots INTEGER,
    total_spots INTEGER,
    booked_count BIGINT,
    price DECIMAL(10,2),
    is_cancelled BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id AS schedule_id,
        c.id AS course_id,
        c.title AS course_title,
        c.type AS course_type,
        c.image_url AS course_image,
        u.full_name AS instructor_name,
        u.avatar_url AS instructor_avatar,
        s.start_time,
        s.end_time,
        s.location,
        COALESCE(s.available_spots, c.max_participants) AS available_spots,
        c.max_participants AS total_spots,
        COUNT(b.id) FILTER (WHERE b.status = 'confirmed') AS booked_count,
        COALESCE(s.price_override, c.price) AS price,
        s.is_cancelled
    FROM public.schedules s
    JOIN public.courses c ON s.course_id = c.id
    LEFT JOIN public.users u ON COALESCE(s.instructor_id, c.instructor_id) = u.id
    LEFT JOIN public.bookings b ON s.id = b.schedule_id
    WHERE s.tenant_id = p_tenant_id
      AND s.start_time >= p_from_date
      AND s.start_time <= p_to_date
      AND c.is_active = true
    GROUP BY s.id, c.id, u.id
    ORDER BY s.start_time ASC;
END;
$$ LANGUAGE plpgsql;

-- Get schedule participants
CREATE OR REPLACE FUNCTION get_schedule_participants(p_schedule_id UUID)
RETURNS TABLE (
    user_id TEXT,
    full_name TEXT,
    avatar_url TEXT,
    is_visible BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id AS user_id,
        u.full_name,
        u.avatar_url,
        b.is_visible
    FROM public.bookings b
    JOIN public.users u ON b.user_id = u.id
    WHERE b.schedule_id = p_schedule_id
      AND b.status = 'confirmed'
      AND b.is_visible = true
      AND u.is_public = true
    ORDER BY b.booked_at ASC;
END;
$$ LANGUAGE plpgsql;
