-- Debug Admin Console Access
-- Run this to check permissions and policies

-- 1. Check if you're in the users table and marked as admin
SELECT 
  '👤 Your User Info' as check_type,
  id,
  email,
  username,
  role,
  status,
  verification_status,
  is_active
FROM public.users
WHERE email = 'Stratuscharters@gmail.com';

-- 2. Check all users exist
SELECT 
  '📊 All Users Count' as check_type,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_count,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count
FROM public.users;

-- 3. Check RLS policies on users table
SELECT 
  '🔒 RLS Policies' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users';

-- 4. Check if RLS is enabled
SELECT 
  '🛡️ RLS Status' as check_type,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'users';

-- 5. Test query as authenticated user (this should work for admins)
SELECT 
  '✅ Test Query' as check_type,
  COUNT(*) as users_you_can_see
FROM public.users;

-- 6. Check your auth.users entry
SELECT 
  '🔑 Auth Entry' as check_type,
  id,
  email,
  raw_user_meta_data->>'role' as metadata_role,
  email_confirmed_at,
  last_sign_in_at,
  created_at
FROM auth.users
WHERE email = 'Stratuscharters@gmail.com';

-- 7. If you can't see users, temporarily disable RLS to test
-- UNCOMMENT THESE LINES TO TEST (then re-enable after):
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
-- SELECT 'RLS DISABLED - Check admin console now' as message;














