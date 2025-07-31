-- KRIA Training App Database Setup
-- Run this entire file in Supabase SQL Editor

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
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

CREATE TYPE course_type AS ENUM (
    'swimming',
    'functional_training', 
    'animal_movement',
    'conditioning',
    'fitness'
);

CREATE TABLE IF NOT EXISTS public.courses (
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

CREATE TABLE IF NOT EXISTS public.course_schedules (
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

CREATE TABLE IF NOT EXISTS public.bookings (
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

CREATE TABLE IF NOT EXISTS public.course_participants (
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES public.course_schedules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_visible BOOLEAN DEFAULT true,
    PRIMARY KEY (booking_id)
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_schedules_start_time ON public.course_schedules(start_time);
CREATE INDEX IF NOT EXISTS idx_schedules_course_id ON public.course_schedules(course_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_schedule_id ON public.bookings(schedule_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- 4. Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_schedules_updated_at ON public.course_schedules;
CREATE TRIGGER update_course_schedules_updated_at BEFORE UPDATE ON public.course_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_participants ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (is_public = true);

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Courses policies (public read)
CREATE POLICY "Courses are viewable by everyone"
    ON public.courses FOR SELECT
    TO authenticated, anon
    USING (true);

-- Course schedules policies
CREATE POLICY "Course schedules are viewable by everyone"
    ON public.course_schedules FOR SELECT
    TO authenticated, anon
    USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id);

-- Course participants policies
CREATE POLICY "Participants visible if profile is public"
    ON public.course_participants FOR SELECT
    TO authenticated, anon
    USING (
        is_visible = true 
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = course_participants.user_id 
            AND profiles.is_public = true
        )
    );

-- 8. Create helper functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Create business logic functions
CREATE OR REPLACE FUNCTION update_available_spots()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
        UPDATE public.course_schedules
        SET available_spots = available_spots - 1
        WHERE id = NEW.schedule_id AND available_spots > 0;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
        UPDATE public.course_schedules
        SET available_spots = available_spots - 1
        WHERE id = NEW.schedule_id AND available_spots > 0;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' AND NEW.status IN ('cancelled', 'refunded') THEN
        UPDATE public.course_schedules
        SET available_spots = available_spots + 1
        WHERE id = NEW.schedule_id;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
        UPDATE public.course_schedules
        SET available_spots = available_spots + 1
        WHERE id = OLD.schedule_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_spots_on_booking ON public.bookings;
CREATE TRIGGER update_spots_on_booking
    AFTER INSERT OR UPDATE OR DELETE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_available_spots();

CREATE OR REPLACE FUNCTION add_course_participant()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND (OLD IS NULL OR OLD.status != 'confirmed') THEN
        INSERT INTO public.course_participants (booking_id, schedule_id, user_id)
        VALUES (NEW.id, NEW.schedule_id, NEW.user_id)
        ON CONFLICT (booking_id) DO NOTHING;
    ELSIF NEW.status IN ('cancelled', 'refunded') AND OLD.status = 'confirmed' THEN
        DELETE FROM public.course_participants WHERE booking_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS manage_course_participants ON public.bookings;
CREATE TRIGGER manage_course_participants
    AFTER INSERT OR UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION add_course_participant();

-- 10. Create view function
CREATE OR REPLACE FUNCTION get_upcoming_schedules(
    from_date TIMESTAMPTZ DEFAULT NOW(),
    to_date TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
)
RETURNS TABLE (
    schedule_id UUID,
    course_id UUID,
    course_title TEXT,
    course_type course_type,
    course_image TEXT,
    instructor_name TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    location TEXT,
    available_spots INTEGER,
    total_spots INTEGER,
    participant_count BIGINT,
    price DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.id as schedule_id,
        c.id as course_id,
        c.title as course_title,
        c.type as course_type,
        c.image_url as course_image,
        p.full_name as instructor_name,
        cs.start_time,
        cs.end_time,
        cs.location,
        cs.available_spots,
        c.max_participants as total_spots,
        COUNT(cp.booking_id) as participant_count,
        c.price
    FROM public.course_schedules cs
    JOIN public.courses c ON cs.course_id = c.id
    LEFT JOIN public.profiles p ON c.instructor_id = p.id
    LEFT JOIN public.course_participants cp ON cs.id = cp.schedule_id
    WHERE cs.start_time >= from_date 
        AND cs.start_time <= to_date
        AND cs.is_cancelled = false
    GROUP BY cs.id, c.id, p.full_name
    ORDER BY cs.start_time;
END;
$$ LANGUAGE plpgsql;

-- 11. Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('course-images', 'course-images', true),
    ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for course images
CREATE POLICY "Course images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'course-images');

-- Storage policies for user avatars
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'user-avatars' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- DONE! Now run the seed data to add test content