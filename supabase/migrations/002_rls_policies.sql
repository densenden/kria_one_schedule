-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_participants ENABLE ROW LEVEL SECURITY;

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
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can manage courses"
    ON public.courses FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- Course schedules policies
CREATE POLICY "Course schedules are viewable by everyone"
    ON public.course_schedules FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can manage schedules"
    ON public.course_schedules FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

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
    USING (
        is_visible = true 
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = course_participants.user_id 
            AND profiles.is_public = true
        )
    );

-- Function to automatically create profile on signup
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

-- Trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();