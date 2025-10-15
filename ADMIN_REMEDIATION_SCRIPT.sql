-- ADMIN REMEDIATION SCRIPT
-- Full remediation for stratuscharters@gmail.com
-- Execute each step sequentially

-- ============================================================================
-- STEP 1: Check user existence and state
-- ============================================================================

SELECT 
    id, 
    email, 
    confirmed_at IS NOT NULL AS is_confirmed, 
    raw_user_meta_data ->> 'provider' AS provider 
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com' 
LIMIT 1;

-- ============================================================================
-- STEP 2: Create platform_admins table if missing
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.platform_admins (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- STEP 3: Ensure index for fast lookups
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_platform_admins_user_id ON public.platform_admins(user_id);

-- ============================================================================
-- STEP 4: Confirm user (set confirmed_at) — only updates if not already confirmed
-- ============================================================================

UPDATE auth.users 
SET confirmed_at = now() 
WHERE email = 'stratuscharters@gmail.com' 
    AND confirmed_at IS NULL 
RETURNING id AS user_id, confirmed_at;

-- ============================================================================
-- STEP 5: Insert into platform_admins if missing
-- ============================================================================

INSERT INTO public.platform_admins(user_id) 
SELECT id 
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com' 
ON CONFLICT (user_id) DO NOTHING 
RETURNING user_id;

-- ============================================================================
-- STEP 6: Final verification read-only check
-- ============================================================================

WITH user_row AS (
    SELECT id, email, raw_user_meta_data, confirmed_at 
    FROM auth.users 
    WHERE email = 'stratuscharters@gmail.com' 
    LIMIT 1
)
SELECT 
    (SELECT COUNT(*) FROM user_row) AS found_count,
    (SELECT id FROM user_row) AS user_id,
    (SELECT email FROM user_row) AS email,
    (SELECT confirmed_at IS NOT NULL FROM user_row) AS is_confirmed,
    (SELECT raw_user_meta_data ->> 'provider' FROM user_row) AS provider,
    (SELECT EXISTS(SELECT 1 FROM public.platform_admins pa WHERE pa.user_id = (SELECT id FROM user_row))) AS in_platform_admins,
    (SELECT COUNT(*) FROM public.platform_admins) AS total_platform_admins;

-- ============================================================================
-- ADDITIONAL: Update public.users table to ensure admin role
-- ============================================================================

-- Update the user in public.users table to have admin role
INSERT INTO public.users (
    id,
    email,
    username,
    role,
    verification_status,
    created_at,
    updated_at
)
SELECT 
    id,
    email,
    COALESCE(username, split_part(email, '@', 1)),
    'admin',
    'approved',
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET
    role = 'admin',
    verification_status = 'approved',
    updated_at = NOW();

-- ============================================================================
-- FINAL STATUS CHECK
-- ============================================================================

SELECT 
    'REMEDIATION COMPLETE' as status,
    au.email,
    au.confirmed_at IS NOT NULL as is_confirmed,
    pu.role as user_role,
    pu.verification_status,
    EXISTS(SELECT 1 FROM public.platform_admins pa WHERE pa.user_id = au.id) as in_platform_admins
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'stratuscharters@gmail.com';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ ADMIN REMEDIATION COMPLETE!';
    RAISE NOTICE '📧 User: stratuscharters@gmail.com';
    RAISE NOTICE '🔐 Status: Confirmed and added to platform_admins';
    RAISE NOTICE '👑 Role: Admin with full access';
    RAISE NOTICE '🎯 Ready to access admin console';
END $$;
