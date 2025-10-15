-- SIMPLE ADMIN SETUP - NO COMPLEX QUERIES
-- This avoids all COALESCE and complex column issues

-- Step 1: Check user exists
SELECT id, email, confirmed_at IS NOT NULL AS is_confirmed FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1;

-- Step 2: Create platform_admins table
CREATE TABLE IF NOT EXISTS public.platform_admins ( user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, created_at timestamptz DEFAULT now() );

-- Step 3: Create index
CREATE INDEX IF NOT EXISTS idx_platform_admins_user_id ON public.platform_admins(user_id);

-- Step 4: Add to platform_admins
INSERT INTO public.platform_admins(user_id) SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' ON CONFLICT (user_id) DO NOTHING RETURNING user_id;

-- Step 5: Insert stratuscharters@gmail.com admin user (simple approach)
INSERT INTO public.users ( id, email, username, access_code_hash, password_hash, role, status, verification_status, full_name, created_at, updated_at ) SELECT id, email, 'stratusadmin', 'ADMIN_ACCESS_CODE', 'ADMIN_PASSWORD_HASH', 'admin', 'active', 'approved', 'Stratus Admin', NOW(), NOW() FROM auth.users WHERE email = 'stratuscharters@gmail.com' ON CONFLICT (id) DO UPDATE SET role = 'admin', status = 'active', verification_status = 'approved', updated_at = NOW();

-- Step 6: Insert admin@stratusconnect.com admin user
INSERT INTO public.users ( email, username, access_code_hash, password_hash, role, status, verification_status, full_name, created_at, updated_at ) VALUES ( 'admin@stratusconnect.com', 'admin', 'ADMIN_ACCESS_CODE', 'ADMIN_PASSWORD_HASH', 'admin', 'active', 'approved', 'Secondary Admin', NOW(), NOW() ) ON CONFLICT (email) DO UPDATE SET role = 'admin', status = 'active', verification_status = 'approved', updated_at = NOW();

-- Step 7: Show results
SELECT 'ADMIN SETUP COMPLETE' as status, pu.email, pu.username, pu.role, pu.verification_status, au.confirmed_at IS NOT NULL as is_confirmed, EXISTS(SELECT 1 FROM public.platform_admins pa WHERE pa.user_id = pu.id) as in_platform_admins FROM public.users pu LEFT JOIN auth.users au ON pu.id = au.id WHERE pu.role = 'admin' ORDER BY pu.created_at;