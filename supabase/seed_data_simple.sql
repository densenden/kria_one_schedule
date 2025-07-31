-- Simple seed data for KRIA Training App
-- Run this AFTER setup_database.sql

-- First, let's check if we have any users and create a test instructor profile
DO $$
DECLARE
    instructor_id UUID;
BEGIN
    -- Try to get an existing user or create a placeholder UUID
    SELECT id INTO instructor_id FROM auth.users LIMIT 1;
    
    IF instructor_id IS NULL THEN
        instructor_id := 'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID;
    END IF;
    
    -- Insert instructor profile if it doesn't exist
    INSERT INTO public.profiles (id, username, full_name, bio, is_public)
    VALUES (
        instructor_id, 
        'sarah_j', 
        'Sarah Johnson', 
        'Certified fitness instructor with 10 years experience',
        true
    ) ON CONFLICT (id) DO NOTHING;
    
    -- Insert test courses
    INSERT INTO public.courses (id, title, description, type, instructor_id, max_participants, price, duration_minutes, image_url)
    VALUES 
        ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Morning Swim', 'Start your day with an energizing swim session', 'swimming', instructor_id, 8, 25.00, 60, '/assets/images/bg_swimming1.png'),
        ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Animal Movement Flow', 'Explore natural movement patterns inspired by animals', 'animal_movement', instructor_id, 12, 30.00, 75, '/assets/images/bg_movement1.png'),
        ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Functional Strength', 'Build real-world strength through functional exercises', 'functional_training', instructor_id, 10, 35.00, 60, '/assets/images/bg_fitness1.png'),
        ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'HIIT Conditioning', 'High-intensity interval training for maximum results', 'conditioning', instructor_id, 15, 25.00, 45, '/assets/images/bg_conditioning1.png')
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Insert course schedules for the next 14 days
DO $$
DECLARE
    current_date DATE := CURRENT_DATE;
    end_date DATE := CURRENT_DATE + INTERVAL '14 days';
    day_counter DATE;
BEGIN
    day_counter := current_date;
    
    WHILE day_counter <= end_date LOOP
        -- Skip Sundays
        IF EXTRACT(DOW FROM day_counter) != 0 THEN
            -- Morning Swim (Mon, Wed, Fri)
            IF EXTRACT(DOW FROM day_counter) IN (1, 3, 5) THEN
                INSERT INTO public.course_schedules (course_id, start_time, end_time, location, available_spots)
                VALUES (
                    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                    day_counter + TIME '06:30',
                    day_counter + TIME '07:30',
                    'Pool Area',
                    8
                );
            END IF;
            
            -- Animal Movement (Tue, Thu)
            IF EXTRACT(DOW FROM day_counter) IN (2, 4) THEN
                INSERT INTO public.course_schedules (course_id, start_time, end_time, location, available_spots)
                VALUES (
                    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
                    day_counter + TIME '18:00',
                    day_counter + TIME '19:15',
                    'Studio A',
                    12
                );
            END IF;
            
            -- Functional Strength (Mon, Wed, Fri)
            IF EXTRACT(DOW FROM day_counter) IN (1, 3, 5) THEN
                INSERT INTO public.course_schedules (course_id, start_time, end_time, location, available_spots)
                VALUES (
                    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
                    day_counter + TIME '17:00',
                    day_counter + TIME '18:00',
                    'Gym Floor',
                    10
                );
            END IF;
            
            -- HIIT Conditioning (Daily except Sunday)
            INSERT INTO public.course_schedules (course_id, start_time, end_time, location, available_spots)
            VALUES (
                'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
                day_counter + TIME '12:00',
                day_counter + TIME '12:45',
                'Studio B',
                15
            );
        END IF;
        
        day_counter := day_counter + INTERVAL '1 day';
    END LOOP;
END $$;

-- Success message
SELECT 'Database seeded successfully! You should now have:
- 4 courses
- ~50 course schedules over the next 2 weeks' as message;