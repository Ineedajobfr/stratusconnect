-- Fix Users Table for Admin Console
-- Run this in Supabase SQL Editor to fix permissions and structure

-- 1. Ensure users table exists with correct structure
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'broker' CHECK (role IN ('broker', 'operator', 'pilot', 'crew', 'admin')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended', 'inactive')),
    phone TEXT,
    company_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_sign_in_at TIMESTAMPTZ,
    email_confirmed_at TIMESTAMPTZ,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ
);

-- 2. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Anyone can view users" ON public.users;

-- 4. Create policies for admin access
-- Policy 1: Admins can view all users
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy 2: Users can view their own data
CREATE POLICY "Users can view their own data"
ON public.users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Policy 3: Admins can update any user
CREATE POLICY "Admins can update users"
ON public.users
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy 4: Admins can insert users
CREATE POLICY "Admins can insert users"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy 5: Admins can delete users
CREATE POLICY "Admins can delete users"
ON public.users
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 5. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- 6. Insert or update the main admin
INSERT INTO public.users (id, email, full_name, role, status, created_at, updated_at, email_confirmed_at)
VALUES (
  gen_random_uuid(),
  'Stratuscharters@gmail.com',
  'Stratus Admin',
  'admin',
  'active',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
  role = 'admin',
  status = 'active',
  full_name = 'Stratus Admin',
  updated_at = NOW();

-- 7. Verify the setup
SELECT 
  'Users table ready!' as message,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_users
FROM public.users;

-- 8. Show all current users
SELECT 
  email,
  full_name,
  role,
  status,
  created_at
FROM public.users
ORDER BY created_at DESC;










