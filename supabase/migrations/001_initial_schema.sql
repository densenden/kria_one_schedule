-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    athlete_info JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course types enum
CREATE TYPE course_type AS ENUM (
    'swimming',
    'functional_training', 
    'animal_movement',
    'conditioning',
    'fitness'
);

-- Courses table (synced with Medusa products)
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medusa_product_id TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    type course_type NOT NULL,
    image_url TEXT,
    instructor_id UUID REFERENCES public.profiles(id),
    max_participants INTEGER DEFAULT 10,
    price DECIMAL(10,2),
    duration_minutes INTEGER DEFAULT 60,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course schedules/slots
CREATE TABLE public.course_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    available_spots INTEGER,
    is_cancelled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES public.course_schedules(id) ON DELETE CASCADE,
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded')),
    amount DECIMAL(10,2),
    booked_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    UNIQUE(user_id, schedule_id)
);

-- Participants view (for community feature)
CREATE TABLE public.course_participants (
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES public.course_schedules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_visible BOOLEAN DEFAULT true,
    PRIMARY KEY (booking_id)
);

-- Create indexes for performance
CREATE INDEX idx_schedules_start_time ON public.course_schedules(start_time);
CREATE INDEX idx_schedules_course_id ON public.course_schedules(course_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_schedule_id ON public.bookings(schedule_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_schedules_updated_at BEFORE UPDATE ON public.course_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();