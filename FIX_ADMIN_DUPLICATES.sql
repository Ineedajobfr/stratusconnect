-- FIX ADMIN DUPLICATES AND STANDARDIZE EMAIL CASE
-- This script removes duplicates and ensures proper email case

-- ============================================================================
-- STEP 1: Check current admin users
-- ============================================================================

SELECT 'BEFORE CLEANUP' as status, email, username, role, created_at
FROM public.users 
WHERE role = 'admin'
ORDER BY email, created_at;

-- ============================================================================
-- STEP 2: Standardize email case for stratuscharters@gmail.com
-- ============================================================================

-- Update all variations of stratuscharters@gmail.com to lowercase
UPDATE public.users 
SET email = LOWER(email), updated_at = NOW()
WHERE LOWER(email) = 'stratuscharters@gmail.com' AND role = 'admin';

-- ============================================================================
-- STEP 3: Remove duplicate admin users (keep the latest one)
-- ============================================================================

-- Remove duplicates for stratuscharters@gmail.com (keep the latest)
DELETE FROM public.users 
WHERE LOWER(email) = 'stratuscharters@gmail.com' 
  AND role = 'admin'
  AND id NOT IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
      FROM public.users 
      WHERE LOWER(email) = 'stratuscharters@gmail.com' AND role = 'admin'
    ) ranked
    WHERE rn = 1
  );

-- ============================================================================
-- STEP 4: Ensure admin user has proper configuration
-- ============================================================================

-- Update the remaining admin user
UPDATE public.users 
SET 
    role = 'admin',
    status = 'active',
    verification_status = 'approved',
    updated_at = NOW()
WHERE LOWER(email) = 'stratuscharters@gmail.com' AND role = 'admin';

-- ============================================================================
-- STEP 5: Final verification
-- ============================================================================

SELECT 'AFTER CLEANUP' as status, email, username, role, verification_status, status, created_at
FROM public.users 
WHERE role = 'admin'
ORDER BY email;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ ADMIN DUPLICATES CLEANED!';
    RAISE NOTICE '👑 Single admin user: stratuscharters@gmail.com';
    RAISE NOTICE '🎯 Ready for login with new password';
END $$;
