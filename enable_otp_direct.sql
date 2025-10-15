-- Direct OTP Configuration for Supabase
-- Run this in Supabase SQL Editor to force enable OTP

-- First, let's check current auth settings
SELECT 
    key,
    value
FROM auth.config 
WHERE key IN (
    'ENABLE_EMAIL_SIGNUP',
    'ENABLE_EMAIL_CONFIRMATIONS', 
    'ENABLE_EMAIL_CHANGE_CONFIRMATIONS',
    'SITE_URL',
    'REDIRECT_URLS'
);

-- Update auth configuration to enable OTP
-- Note: This might need to be done through the dashboard, but let's try direct SQL

-- Check if we can update auth.config directly
UPDATE auth.config 
SET value = 'true'
WHERE key = 'ENABLE_EMAIL_SIGNUP'
AND value != 'true';

UPDATE auth.config 
SET value = 'true'  
WHERE key = 'ENABLE_EMAIL_CONFIRMATIONS'
AND value != 'true';

UPDATE auth.config 
SET value = 'true'
WHERE key = 'ENABLE_EMAIL_CHANGE_CONFIRMATIONS' 
AND value != 'true';

-- Set site URL
UPDATE auth.config 
SET value = 'http://localhost:8081'
WHERE key = 'SITE_URL';

-- Set redirect URLs (this might need JSON format)
UPDATE auth.config 
SET value = '["http://localhost:8081/auth/callback", "http://localhost:8081/**"]'
WHERE key = 'REDIRECT_URLS';

-- Verify the changes
SELECT 
    key,
    value
FROM auth.config 
WHERE key IN (
    'ENABLE_EMAIL_SIGNUP',
    'ENABLE_EMAIL_CONFIRMATIONS', 
    'ENABLE_EMAIL_CHANGE_CONFIRMATIONS',
    'SITE_URL',
    'REDIRECT_URLS'
);

-- Alternative approach: Check if there are any auth policies blocking OTP
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'auth' 
AND tablename = 'users';

-- Check auth.users table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Attempted to enable OTP settings directly';
    RAISE NOTICE '📧 If this didnt work, you may need to:';
    RAISE NOTICE '   1. Go to Supabase Dashboard → Authentication → Settings';
    RAISE NOTICE '   2. Enable "Enable email confirmations"';
    RAISE NOTICE '   3. Enable "Enable email signups"';
    RAISE NOTICE '   4. Set Site URL to: http://localhost:8081';
    RAISE NOTICE '   5. Add redirect URL: http://localhost:8081/auth/callback';
END $$;

