-- SIMPLE ADMIN UPDATE (NO INSERTS)
-- This script only updates the existing admin user

-- ============================================================================
-- STEP 1: Check current admin user
-- ============================================================================

SELECT 'BEFORE UPDATE' as status, email, username, role, verification_status, status
FROM public.users 
WHERE LOWER(email) = 'stratuscharters@gmail.com';

-- ============================================================================
-- STEP 2: Update existing admin user
-- ============================================================================

UPDATE public.users 
SET 
    role = 'admin',
    status = 'active',
    verification_status = 'approved',
    updated_at = NOW()
WHERE LOWER(email) = 'stratuscharters@gmail.com';

-- ============================================================================
-- STEP 3: Verify update
-- ============================================================================

SELECT 'AFTER UPDATE' as status, email, username, role, verification_status, status, updated_at
FROM public.users 
WHERE LOWER(email) = 'stratuscharters@gmail.com';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
DECLARE
    admin_exists BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM public.users 
        WHERE LOWER(email) = 'stratuscharters@gmail.com' 
          AND role = 'admin' 
          AND status = 'active'
    ) INTO admin_exists;
    
    IF admin_exists THEN
        RAISE NOTICE '✅ ADMIN USER UPDATED SUCCESSFULLY!';
        RAISE NOTICE '👑 Email: stratuscharters@gmail.com';
        RAISE NOTICE '🎯 Status: active, Role: admin';
        RAISE NOTICE '🚀 Ready for login!';
    ELSE
        RAISE NOTICE '❌ ERROR: Admin user not found or not properly updated';
    END IF;
END $$;