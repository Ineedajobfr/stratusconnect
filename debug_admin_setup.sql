-- Debug Admin Setup Issues
-- Run these queries in your Supabase SQL Editor to diagnose the problem

-- 1. Check if the email already exists
SELECT id, email, is_sso_user, deleted_at, created_at
FROM auth.users
WHERE lower(email) = lower('admin@stratusconnect.org');

-- 2. Check all existing users with similar emails
SELECT id, email, is_sso_user, deleted_at, created_at
FROM auth.users
WHERE email ILIKE '%admin%stratusconnect%';

-- 3. Inspect existing indexes on auth.users
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'auth' AND tablename = 'users';

-- 4. Check if pgcrypto extension is available
SELECT * FROM pg_extension WHERE extname = 'pgcrypto';

-- 5. Test if crypt function works
SELECT crypt('test', gen_salt('bf'));

-- 6. Check if the specific IDs already exist
SELECT id, email, created_at
FROM auth.users
WHERE id IN (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b1fcc0a1-1d2e-4f3a-8b4c-5d6e7f8a9b0c'
);

-- 7. Check profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles';

-- 8. Check if profiles table exists and has data
SELECT COUNT(*) as profile_count FROM public.profiles;
