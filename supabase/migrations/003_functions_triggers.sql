-- Function to update available spots when booking is made
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

CREATE TRIGGER update_spots_on_booking
    AFTER INSERT OR UPDATE OR DELETE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_available_spots();

-- Function to add participant when booking confirmed
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

CREATE TRIGGER manage_course_participants
    AFTER INSERT OR UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION add_course_participant();

-- Function to get upcoming schedules with participant count
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

-- Function to check if user can book a schedule
CREATE OR REPLACE FUNCTION can_user_book_schedule(
    p_user_id UUID,
    p_schedule_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_available_spots INTEGER;
    v_existing_booking INTEGER;
BEGIN
    -- Check if spots are available
    SELECT available_spots INTO v_available_spots
    FROM public.course_schedules
    WHERE id = p_schedule_id;
    
    IF v_available_spots IS NULL OR v_available_spots <= 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user already has a booking
    SELECT COUNT(*) INTO v_existing_booking
    FROM public.bookings
    WHERE user_id = p_user_id 
        AND schedule_id = p_schedule_id
        AND status IN ('pending', 'confirmed');
    
    RETURN v_existing_booking = 0;
END;
$$ LANGUAGE plpgsql;