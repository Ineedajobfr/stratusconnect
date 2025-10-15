-- Fix Supabase OTP Settings
-- Run this in Supabase SQL Editor to enable magic links for existing users

-- This script enables OTP (magic link) authentication for existing users
-- without allowing new user signups

-- 1. Enable OTP authentication for existing users
-- Note: This needs to be done in Supabase Dashboard, not SQL
-- Go to: Authentication → Settings → Auth Providers → Email
-- Enable: "Enable email confirmations"
-- Enable: "Enable email change confirmations"

-- 2. Make sure the admin user exists and is confirmed
UPDATE auth.users 
SET 
    email_confirmed_at = NOW(),
    confirmation_sent_at = NOW()
WHERE email = 'stratuscharters@gmail.com';

-- 3. Verify the admin user status
SELECT 
    email,
    email_confirmed_at,
    confirmation_sent_at,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com';

-- 4. Check if profile exists
SELECT 
    p.email,
    p.role,
    p.verification_status,
    p.verified_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'stratuscharters@gmail.com';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Admin user confirmed for OTP authentication';
    RAISE NOTICE '📧 Email: stratuscharters@gmail.com';
    RAISE NOTICE '🔐 Status: Ready for magic link authentication';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: You must also enable these settings in Supabase Dashboard:';
    RAISE NOTICE '   1. Go to Authentication → Settings → Auth Providers → Email';
    RAISE NOTICE '   2. Enable "Enable email confirmations"';
    RAISE NOTICE '   3. Enable "Enable email change confirmations"';
    RAISE NOTICE '   4. Set "Site URL" to: http://localhost:8081';
    RAISE NOTICE '   5. Set "Redirect URLs" to include: http://localhost:8081/auth/callback';
END $$;

