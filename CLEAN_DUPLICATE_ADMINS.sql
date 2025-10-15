-- CLEAN UP DUPLICATE ADMIN USERS
-- This removes duplicates and ensures only one admin user per email

-- ============================================================================
-- STEP 1: Check current admin users
-- ============================================================================

SELECT 
    'BEFORE CLEANUP' as status,
    email,
    username,
    role,
    verification_status,
    created_at
FROM public.users 
WHERE role = 'admin'
ORDER BY email, created_at;

-- ============================================================================
-- STEP 2: Remove duplicate admin users (keep the latest one)
-- ============================================================================

-- Remove duplicates for stratuscharters@gmail.com (keep the latest)
DELETE FROM public.users 
WHERE email = 'stratuscharters@gmail.com' 
  AND role = 'admin'
  AND id NOT IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn
      FROM public.users 
      WHERE email = 'stratuscharters@gmail.com' AND role = 'admin'
    ) ranked
    WHERE rn = 1
  );

-- Remove duplicates for admin@stratusconnect.com (keep the latest)
DELETE FROM public.users 
WHERE email = 'admin@stratusconnect.com' 
  AND role = 'admin'
  AND id NOT IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn
      FROM public.users 
      WHERE email = 'admin@stratusconnect.com' AND role = 'admin'
    ) ranked
    WHERE rn = 1
  );

-- ============================================================================
-- STEP 3: Ensure both admin users are properly configured
-- ============================================================================

-- Update stratuscharters@gmail.com admin user
UPDATE public.users 
SET 
    role = 'admin',
    status = 'active',
    verification_status = 'approved',
    updated_at = NOW()
WHERE email = 'stratuscharters@gmail.com' AND role = 'admin';

-- Update admin@stratusconnect.com admin user
UPDATE public.users 
SET 
    role = 'admin',
    status = 'active',
    verification_status = 'approved',
    updated_at = NOW()
WHERE email = 'admin@stratusconnect.com' AND role = 'admin';

-- ============================================================================
-- STEP 4: Final verification
-- ============================================================================

SELECT 
    'AFTER CLEANUP' as status,
    email,
    username,
    role,
    verification_status,
    status,
    created_at
FROM public.users 
WHERE role = 'admin'
ORDER BY email;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ DUPLICATE ADMIN CLEANUP COMPLETE!';
    RAISE NOTICE '👑 Admin users cleaned and verified';
    RAISE NOTICE '🎯 Ready for login with: stratuscharters@gmail.com';
END $$;
