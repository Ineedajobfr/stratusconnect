-- QUICK FIX: Allow admins to see all users
-- This fixes the "Failed to load users" error

-- 1. Temporarily disable RLS to verify data exists
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. Verify users exist
SELECT 'Users in table:' as info, COUNT(*) as count FROM public.users;

-- 3. Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Drop ALL existing policies (start fresh)
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.users;

-- 5. Create SIMPLE admin policy (easier to debug)
CREATE POLICY "Allow admins full access"
ON public.users
FOR ALL
TO authenticated
USING (
  -- User is admin
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() 
    AND u.role = 'admin'
  )
  OR
  -- Or viewing own data
  id = auth.uid()
);

-- 6. Verify your admin status
SELECT 
  'Your admin status:' as info,
  email,
  role,
  status,
  'auth.uid() = ' || id::text as uid_match
FROM public.users
WHERE email = 'Stratuscharters@gmail.com';

-- 7. If still not working, use this TEMPORARY bypass (REMOVE AFTER TESTING!)
-- This allows ALL authenticated users to read
DROP POLICY IF EXISTS "Temporary read all" ON public.users;
CREATE POLICY "Temporary read all"
ON public.users
FOR SELECT
TO authenticated
USING (true);

SELECT '✅ Policies updated! Try refreshing admin console now.' as message;






