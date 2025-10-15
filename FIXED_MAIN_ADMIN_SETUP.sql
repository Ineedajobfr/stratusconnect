-- FIXED MAIN ADMIN SETUP - NO MANUAL confirmed_at UPDATE
-- This handles the generated column issue properly

-- ============================================================================
-- STEP 1: Check if user exists in auth.users
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
-- STEP 3: Create index for fast lookups
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_platform_admins_user_id ON public.platform_admins(user_id);

-- ============================================================================
-- STEP 4: Add to platform_admins table (skip confirmed_at update)
-- ============================================================================

INSERT INTO public.platform_admins(user_id) 
SELECT id 
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com' 
ON CONFLICT (user_id) DO NOTHING 
RETURNING user_id;

-- ============================================================================
-- STEP 5: Create/Update user in public.users with admin role
-- ============================================================================

INSERT INTO public.users (
    id,
    email,
    username,
    access_code_hash,
    password_hash,
    role,
    status,
    verification_status,
    full_name,
    is_admin,
    is_active,
    created_at,
    updated_at
)
SELECT 
    id,
    email,
    COALESCE(username, split_part(email, '@', 1)),
    'ADMIN_ACCESS_CODE',
    'ADMIN_PASSWORD_HASH',
    'admin',
    'active',
    'approved',
    'Stratus Admin',
    TRUE,
    TRUE,
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET
    role = 'admin',
    status = 'active',
    verification_status = 'approved',
    is_admin = TRUE,
    is_active = TRUE,
    updated_at = NOW();

-- ============================================================================
-- STEP 6: Also create admin@stratusconnect.com as secondary admin
-- ============================================================================

INSERT INTO public.users (
    email,
    username,
    access_code_hash,
    password_hash,
    role,
    status,
    verification_status,
    full_name,
    is_admin,
    is_active,
    created_at,
    updated_at
)
VALUES (
    'admin@stratusconnect.com',
    'admin',
    'ADMIN_ACCESS_CODE',
    'ADMIN_PASSWORD_HASH',
    'admin',
    'active',
    'approved',
    'Secondary Admin',
    TRUE,
    TRUE,
    NOW(),
    NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
    role = 'admin',
    status = 'active',
    verification_status = 'approved',
    is_admin = TRUE,
    is_active = TRUE,
    updated_at = NOW();

-- ============================================================================
-- STEP 7: Final verification
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
-- STEP 8: Show all admin users
-- ============================================================================

SELECT 
    'FINAL STATUS' as check_type,
    pu.email,
    pu.role,
    pu.verification_status,
    pu.is_admin,
    pu.is_active,
    au.confirmed_at IS NOT NULL as is_confirmed,
    EXISTS(SELECT 1 FROM public.platform_admins pa WHERE pa.user_id = pu.id) as in_platform_admins
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
WHERE pu.role = 'admin'
ORDER BY pu.created_at;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ MAIN ADMIN SETUP COMPLETE!';
    RAISE NOTICE '👑 Primary Admin: stratuscharters@gmail.com';
    RAISE NOTICE '🔐 Secondary Admin: admin@stratusconnect.com';
    RAISE NOTICE '📧 Both emails now authorized for staff portal access';
    RAISE NOTICE '⚠️  Note: confirmed_at is managed by Supabase Auth automatically';
    RAISE NOTICE '🎯 Ready to login to admin console';
END $$;
