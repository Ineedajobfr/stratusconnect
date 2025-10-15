-- CREATE SUPABASE AUTH ADMIN USER
-- This creates the admin user in Supabase Auth (auth.users table)

-- First, let's create the user in auth.users table
-- Note: This needs to be done through Supabase Dashboard or API, not SQL
-- But we can prepare the public.users record

-- Insert admin user in public.users (this will work)
INSERT INTO public.users (
    email,
    username,
    role,
    verification_status,
    created_at,
    updated_at
)
VALUES (
    'admin@stratusconnect.com',
    'admin',
    'admin',
    'approved',
    NOW(),
    NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
    role = 'admin',
    verification_status = 'approved',
    updated_at = NOW();

-- Show the user we created
SELECT 
    email,
    username,
    role,
    verification_status,
    created_at
FROM public.users
WHERE email = 'admin@stratusconnect.com';

DO $$
BEGIN
    RAISE NOTICE '✅ Admin user created in public.users!';
    RAISE NOTICE '⚠️  IMPORTANT: You also need to create this user in Supabase Auth';
    RAISE NOTICE '📝 Go to: Supabase Dashboard → Authentication → Users → Add User';
    RAISE NOTICE '📧 Email: admin@stratusconnect.com';
    RAISE NOTICE '🔑 Password: admin123';
    RAISE NOTICE '✅ Check "Email Confirmed"';
END $$;
