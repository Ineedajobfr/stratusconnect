-- Fix URL Configuration for Port 8080
-- Run this in Supabase SQL Editor

-- Check current auth settings
SELECT 
    key,
    value
FROM auth.config 
WHERE key LIKE '%URL%';

-- Update to use correct port 8080
UPDATE auth.config 
SET value = 'http://localhost:8080'
WHERE key = 'SITE_URL';

-- Update redirect URLs for port 8080
UPDATE auth.config 
SET value = '["http://localhost:8080/auth/callback", "http://localhost:8080/**"]'
WHERE key = 'REDIRECT_URLS';

-- Verify the changes
SELECT 
    key,
    value
FROM auth.config 
WHERE key LIKE '%URL%';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Updated URLs to use port 8080';
    RAISE NOTICE '🌐 Site URL: http://localhost:8080';
    RAISE NOTICE '🔄 Redirect URLs: http://localhost:8080/auth/callback';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: You still need to enable OTP in Supabase Dashboard:';
    RAISE NOTICE '   1. Go to Authentication → Settings → Auth Providers → Email';
    RAISE NOTICE '   2. Enable "Enable email confirmations"';
    RAISE NOTICE '   3. Enable "Enable email signups"';
END $$;

