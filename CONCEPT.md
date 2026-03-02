# White-Label Sports Community Platform - Concept

## Vision

Eine skalierbare White-Label Plattform für Sport-Communities (Gyms, Coaches, Studios). Jeder Anbieter kann seine eigene gebrandete Community betreiben mit eigenen Mitgliedern, Kursen und Inhalten.

---

## Architektur-Übersicht

### Multi-Tenant Modell

```
┌─────────────────────────────────────────────────────────┐
│                    PLATFORM (SaaS)                       │
├─────────────────────────────────────────────────────────┤
│  Tenant: KRIA      │  Tenant: GymX      │  Tenant: ...  │
│  kria.app          │  gymx.app          │  custom.app   │
│  ├─ Members        │  ├─ Members        │  ├─ Members   │
│  ├─ Coaches        │  ├─ Coaches        │  ├─ Coaches   │
│  ├─ Courses        │  ├─ Courses        │  ├─ Courses   │
│  └─ Branding       │  └─ Branding       │  └─ Branding  │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Zweck |
|-------|------------|-------|
| Frontend | Next.js 14 (App Router) | React Server Components, SSR |
| Styling | Tailwind CSS + CSS Variables | Dynamic Theming pro Tenant |
| Auth | Clerk | Multi-Tenant User Management |
| Database | Supabase (PostgreSQL) | Data Layer, RLS für Isolation |
| Payments | Stripe Connect | Separate Accounts pro Gym |
| Email | Sendgrid | Transaktionale E-Mails |
| Storage | Supabase Storage | Logos, Bilder |
| Hosting | Vercel | Edge Functions, Preview Deploys |

---

## Datenbank-Schema (Multi-Tenant)

### Core Tables

```sql
-- Tenants (Gyms/Studios)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,              -- URL identifier (z.B. "kria", "gymx")
    name TEXT NOT NULL,
    domain TEXT UNIQUE,                      -- Custom domain (optional)

    -- Branding
    primary_color TEXT DEFAULT '#0891b2',    -- Tailwind cyan-600
    logo_url TEXT,
    favicon_url TEXT,

    -- Stripe
    stripe_account_id TEXT,                  -- Stripe Connect Account
    stripe_onboarding_complete BOOLEAN DEFAULT false,

    -- Settings
    settings JSONB DEFAULT '{}',             -- Flexible config

    -- Meta
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (managed by Clerk, synced to DB)
CREATE TABLE users (
    id TEXT PRIMARY KEY,                     -- Clerk User ID
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,

    -- Role within tenant
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'coach', 'admin', 'owner')),

    -- Profile data
    bio TEXT,
    athlete_info JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tenant_id, email)
);

-- Courses (belong to tenant)
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,                       -- Flexible types per tenant
    image_url TEXT,

    instructor_id TEXT REFERENCES users(id),
    max_participants INTEGER DEFAULT 10,
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'EUR',
    duration_minutes INTEGER DEFAULT 60,

    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Schedules
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,

    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,

    available_spots INTEGER,
    is_cancelled BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,

    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,

    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded')),
    amount DECIMAL(10,2),
    currency TEXT DEFAULT 'EUR',

    booked_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,

    UNIQUE(user_id, schedule_id)
);

-- Content Pages (CMS)
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

    slug TEXT NOT NULL,                       -- URL path
    title TEXT NOT NULL,
    content JSONB NOT NULL,                   -- Structured content blocks

    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tenant_id, slug)
);
```

### Row Level Security (RLS)

```sql
-- Tenant isolation policy template
CREATE POLICY "tenant_isolation" ON {table}
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

---

## URL-Struktur

### Subdomain-basiert (Primary)
```
kria.sportsplatform.com     → tenant: kria
gymx.sportsplatform.com     → tenant: gymx
```

### Custom Domain Support
```
www.kria-training.de        → tenant: kria (via tenant.domain)
```

### Route-Struktur
```
/                           → Landing Page (tenant-specific)
/schedule                   → Kurskalender
/courses                    → Kursübersicht
/courses/[id]               → Kursdetails
/profile                    → User Profile
/bookings                   → Meine Buchungen

/admin                      → Admin Dashboard
/admin/courses              → Kursverwaltung
/admin/schedules            → Stundenplan
/admin/members              → Mitgliederverwaltung
/admin/settings             → Einstellungen (Branding, etc.)
/admin/pages                → CMS

/onboard                    → Neues Gym anlegen (Public)
```

---

## Clerk Integration

### Multi-Tenant Setup

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboard(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Extract tenant from subdomain/domain
  const tenant = getTenantFromRequest(req)

  // Set tenant context for RLS
  // Clerk handles auth, we sync user to our users table
})
```

### User Sync Webhook

Bei Clerk User Events → Sync zu `users` Tabelle mit `tenant_id`.

---

## Stripe Connect Flow

```
1. Gym registriert sich → tenant wird erstellt
2. Gym startet Stripe Connect Onboarding
3. Stripe Account wird verknüpft (stripe_account_id)
4. Bei Kursbuchung: Payment geht an Gym's Stripe Account
5. Platform Fee: 5-10% (configurable)
```

---

## Branding System

### CSS Variables (Dynamic)

```css
:root {
  --primary: var(--tenant-primary, #0891b2);
  --primary-foreground: #ffffff;
  /* ... */
}
```

### Logo Handling

- Square Logo: 256x256px minimum
- Displayed in: Header, Favicon, E-Mails
- Stored in: Supabase Storage `/tenants/{tenant_id}/logo.png`

---

## Admin Features

### Dashboard
- Übersicht: Bookings today, Revenue, Members
- Quick Actions

### Kursverwaltung
- CRUD für Courses
- Instructor zuweisen
- Pricing

### Stundenplan
- Kalender-View
- Recurring Events
- Cancellations

### Mitglieder
- Liste aller Members
- Role Management
- Booking History

### Einstellungen
- Branding (Farbe, Logo)
- Stripe Connect Status
- Domain Setup

### CMS / Pages
- Content-Blöcke editieren
- Preview
- Publish/Unpublish

---

## Gym Onboarding Flow

```
/onboard
├── Step 1: Gym Details (Name, Slug)
├── Step 2: Owner Account (Clerk Sign-Up)
├── Step 3: Branding (Color, Logo)
├── Step 4: Stripe Connect
└── Step 5: Ready! → /admin
```

---

## Project Structure

```
/kria-community
├── app/
│   ├── (public)/                 # Public routes
│   │   ├── page.tsx              # Landing
│   │   ├── schedule/
│   │   ├── courses/
│   │   └── ...
│   ├── (auth)/                   # Auth routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/              # Protected member routes
│   │   ├── profile/
│   │   └── bookings/
│   ├── admin/                    # Admin routes (coach/admin only)
│   │   ├── page.tsx
│   │   ├── courses/
│   │   ├── schedules/
│   │   ├── members/
│   │   ├── settings/
│   │   └── pages/
│   ├── onboard/                  # Gym onboarding
│   ├── api/
│   │   ├── webhooks/
│   │   │   ├── clerk/
│   │   │   └── stripe/
│   │   └── ...
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # Base UI components
│   ├── layout/                   # Header, Footer, Sidebar
│   ├── forms/                    # Form components
│   ├── calendar/                 # Calendar components
│   └── admin/                    # Admin-specific components
├── lib/
│   ├── supabase/
│   ├── clerk/
│   ├── stripe/
│   └── utils/
├── types/
├── hooks/
├── contexts/
├── public/
├── supabase/
│   └── migrations/
└── ...
```

---

## Migration Plan

1. **Phase 1: Setup**
   - Neuer Branch ✓
   - Agent OS Installation
   - Codebase Cleanup
   - Neue Dependencies (Clerk)

2. **Phase 2: Database**
   - Neues Multi-Tenant Schema
   - RLS Policies
   - Migration Scripts

3. **Phase 3: Auth**
   - Clerk Integration
   - User Sync
   - Role-based Access

4. **Phase 4: Core Features**
   - Tenant Resolution (Subdomain/Domain)
   - Dynamic Theming
   - Course/Schedule CRUD
   - Booking Flow

5. **Phase 5: Admin**
   - Admin Dashboard
   - Settings/Branding
   - CMS

6. **Phase 6: Payments**
   - Stripe Connect Setup
   - Checkout Flow
   - Webhooks

7. **Phase 7: Onboarding**
   - Gym Registration Route
   - Stripe Onboarding
   - First-time Setup

---

## Offene Entscheidungen

- [ ] Platform Domain Name?
- [ ] Pricing Model für Platform (per Booking fee vs. Monthly)?
- [ ] Default Course Types oder komplett frei?
- [ ] Support für Recurring Schedules?
- [ ] Multi-Language (i18n)?

---

> Dieses Dokument dient als Grundlage für die Implementierung der White-Label Platform.
