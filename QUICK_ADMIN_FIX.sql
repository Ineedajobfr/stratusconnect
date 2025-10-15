-- QUICK ADMIN FIX
-- Create the admin user that the Staff Portal expects

-- Insert admin user with the email the portal expects
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

-- Also create the original admin user we had
INSERT INTO public.users (
    email,
    username,
    role,
    verification_status,
    created_at,
    updated_at
)
VALUES (
    'Stratuscharters@gmail.com',
    'stratusadmin',
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

-- Show all admin users
SELECT 
    email,
    username,
    role,
    verification_status,
    created_at
FROM public.users
WHERE role = 'admin'
ORDER BY created_at DESC;

DO $$
BEGIN
    RAISE NOTICE '✅ Admin users created!';
    RAISE NOTICE '🔐 Use: admin@stratusconnect.com with password: admin123';
    RAISE NOTICE '🔐 Or: Stratuscharters@gmail.com';
END $$;
