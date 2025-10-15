-- FIX EXISTING ADMIN USER (UPDATE INSTEAD OF INSERT)
-- This script updates the existing admin user instead of creating duplicates

-- ============================================================================
-- STEP 1: Check current admin users
-- ============================================================================

SELECT 'CURRENT ADMIN USERS' as status, email, username, role, verification_status, status, created_at
FROM public.users 
WHERE LOWER(email) = 'stratuscharters@gmail.com'
ORDER BY created_at;

-- ============================================================================
-- STEP 2: Update existing admin user (UPSERT approach)
-- ============================================================================

-- Update the existing admin user with proper configuration
UPDATE public.users 
SET 
    role = 'admin',
    status = 'active',
    verification_status = 'approved',
    updated_at = NOW()
WHERE LOWER(email) = 'stratuscharters@gmail.com';

-- ============================================================================
-- STEP 3: If no user exists, insert one (should not happen based on error)
-- ============================================================================

-- Only insert if no user exists (this should not run based on the error)
INSERT INTO public.users (
    id, 
    email, 
    username, 
    role, 
    status, 
    verification_status, 
    full_name,
    password_hash,
    access_code_hash,
    created_at, 
    updated_at,
    is_active
)
SELECT 
    gen_random_uuid(),
    'stratuscharters@gmail.com',
    'stratuscharters',
    'admin',
    'active',
    'approved',
    'Stratus Admin',
    'ADMIN_PASSWORD_PLACEHOLDER',
    'ADMIN_ACCESS_CODE_PLACEHOLDER',
    NOW(),
    NOW(),
    true
WHERE NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE LOWER(email) = 'stratuscharters@gmail.com'
);

-- ============================================================================
-- STEP 4: Verify the admin user
-- ============================================================================

SELECT 'UPDATED ADMIN USER' as status, email, username, role, verification_status, status, updated_at
FROM public.users 
WHERE LOWER(email) = 'stratuscharters@gmail.com';

-- ============================================================================
-- STEP 5: Check all admin users
-- ============================================================================

SELECT 'ALL ADMIN USERS' as status, email, username, role, verification_status, status, created_at
FROM public.users 
WHERE role = 'admin'
ORDER BY email, created_at;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
DECLARE
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count 
    FROM public.users 
    WHERE LOWER(email) = 'stratuscharters@gmail.com' AND role = 'admin';
    
    IF admin_count > 0 THEN
        RAISE NOTICE '✅ ADMIN USER UPDATED SUCCESSFULLY!';
        RAISE NOTICE '👑 Email: stratuscharters@gmail.com';
        RAISE NOTICE '🎯 Role: admin, Status: active, Verification: approved';
        RAISE NOTICE '🚀 Ready for login with new password!';
    ELSE
        RAISE NOTICE '❌ ERROR: Admin user not found after update';
    END IF;
END $$;