-- Create Demo Accounts with proper auth.users entries
-- Run this script in your Supabase SQL editor to create demo accounts

-- Note: This script uses the auth.users table which requires admin privileges
-- You should run this in the Supabase dashboard SQL editor

-- Demo user 1: Regular user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'demo-user-uuid-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'demo@kria.com',
    '$2a$10$rJpRtLgCi.gd2r4rBCjP9O5RqUrU/j12tpnqzCLJWOZlxj..jSWBm', -- password is "demo123456"
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Demo User"}',
    FALSE,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
) ON CONFLICT (id) DO NOTHING;

-- Demo user 2: Admin user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'admin-user-uuid-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'admin@kria.com',
    '$2a$10$rJpRtLgCi.gd2r4rBCjP9O5RqUrU/j12tpnqzCLJWOZlxj..jSWBm', -- password is "demo123456"
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Admin User", "role": "admin"}',
    FALSE,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
) ON CONFLICT (id) DO NOTHING;

-- Create corresponding profiles
INSERT INTO public.profiles (id, username, full_name, bio, is_public, created_at, updated_at)
VALUES 
    (
        'demo-user-uuid-1111-1111-111111111111',
        'demo_user',
        'Demo User',
        'Demo account for testing KRIA Training app',
        true,
        NOW(),
        NOW()
    ),
    (
        'admin-user-uuid-2222-2222-222222222222',
        'admin_user',
        'Admin User',
        'Administrator account for KRIA Training app',
        true,
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Demo accounts created successfully!

Regular User:
Email: demo@kria.com
Password: demo123456

Admin User:
Email: admin@kria.com  
Password: demo123456

You can now login with these accounts.' as message;