-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('course-images', 'course-images', true),
    ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for course images
CREATE POLICY "Course images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'course-images');

CREATE POLICY "Only admins can upload course images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'course-images' 
        AND auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Only admins can update course images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'course-images' 
        AND auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Only admins can delete course images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'course-images' 
        AND auth.jwt() ->> 'role' = 'admin'
    );

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

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'user-avatars' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'user-avatars' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );