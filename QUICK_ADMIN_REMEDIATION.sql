-- QUICK ADMIN REMEDIATION - COPY/PASTE INTO SUPABASE SQL EDITOR
-- This will make stratuscharters@gmail.com a full admin

-- Step 1: Check if user exists
SELECT id, email, confirmed_at IS NOT NULL AS is_confirmed FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1;

-- Step 2: Create platform_admins table
CREATE TABLE IF NOT EXISTS public.platform_admins ( user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, created_at timestamptz DEFAULT now() );

-- Step 3: Create index
CREATE INDEX IF NOT EXISTS idx_platform_admins_user_id ON public.platform_admins(user_id);

-- Step 4: Confirm user if not confirmed
UPDATE auth.users SET confirmed_at = now() WHERE email = 'stratuscharters@gmail.com' AND confirmed_at IS NULL RETURNING id AS user_id, confirmed_at;

-- Step 5: Add to platform_admins
INSERT INTO public.platform_admins(user_id) SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' ON CONFLICT (user_id) DO NOTHING RETURNING user_id;

-- Step 6: Update public.users with admin role
INSERT INTO public.users ( id, email, username, role, verification_status, created_at, updated_at ) SELECT id, email, COALESCE(username, split_part(email, '@', 1)), 'admin', 'approved', NOW(), NOW() FROM auth.users WHERE email = 'stratuscharters@gmail.com' ON CONFLICT (id) DO UPDATE SET role = 'admin', verification_status = 'approved', updated_at = NOW();

-- Step 7: Final verification
SELECT 'REMEDIATION COMPLETE' as status, au.email, au.confirmed_at IS NOT NULL as is_confirmed, pu.role as user_role, EXISTS(SELECT 1 FROM public.platform_admins pa WHERE pa.user_id = au.id) as in_platform_admins FROM auth.users au LEFT JOIN public.users pu ON au.id = pu.id WHERE au.email = 'stratuscharters@gmail.com';
