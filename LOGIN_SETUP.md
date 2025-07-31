# Login Setup for KRIA Training App

## Current Issue

The login functionality is currently hanging because the seed data only creates profile entries but doesn't create corresponding users in Supabase's auth.users table with proper password hashes.

## Solution Options

### Option 1: Use Registration Flow (Recommended)
1. Go to `/auth/register` 
2. Create a new account with email and password
3. This will properly create both the auth.users entry and profile entry
4. You can then login normally

### Option 2: Create Demo Accounts via Supabase Dashboard (For Development)
1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Click "Add user" 
4. Create users with these details:

**Regular User:**
- Email: demo@kria.com
- Password: demo123456
- User Metadata: `{"full_name": "Demo User"}`

**Admin User:**
- Email: admin@kria.com
- Password: demo123456  
- User Metadata: `{"full_name": "Admin User", "role": "admin"}`

### Option 3: Use SQL Script (Advanced)
Run the `create_demo_accounts.sql` script in your Supabase SQL editor, but note that direct insertion into auth.users may not work in all Supabase configurations.

## Why This Happens

Supabase's authentication system requires users to be created through proper auth flows that:
1. Hash passwords correctly
2. Set up proper session management
3. Trigger profile creation via database triggers

The seed data only creates profiles directly, skipping the auth.users table which is managed by Supabase's auth system.

## Recommended Fix for Production

Update the seed data to work with a proper user creation flow or provide clear onboarding instructions for new users to register accounts.