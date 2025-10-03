-- Fix Admin Console for EXISTING Users Table
-- NON-DESTRUCTIVE: Works with your current schema
-- Run this in Supabase SQL Editor

-- 1. Add missing columns to existing users table (safe - only adds if missing)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active','pending','suspended','inactive'));

-- 2. Migrate existing verification_status to status column
UPDATE public.users 
SET status = CASE 
  WHEN verification_status = 'approved' THEN 'active'
  WHEN verification_status = 'pending' THEN 'pending'
  WHEN verification_status = 'rejected' THEN 'suspended'
  ELSE 'active'
END
WHERE status IS NULL OR status = 'active';

-- 3. Add indexes for admin console performance
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- 4. Enable Row Level Security (if not already enabled)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 5. Drop old policies and create new ones
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;

-- 6. Create admin-friendly policies
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Users can view their own data"
ON public.users FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admins can update users"
ON public.users FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can insert users"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete users"
ON public.users FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 7. Make Stratuscharters@gmail.com an admin
UPDATE public.users
SET 
  role = 'admin',
  status = 'active',
  verification_status = 'approved',
  full_name = COALESCE(full_name, 'Stratus Admin'),
  updated_at = NOW()
WHERE email = 'Stratuscharters@gmail.com';

-- If user doesn't exist yet, create them
INSERT INTO public.users (
  id, email, full_name, role, status, verification_status, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  'Stratuscharters@gmail.com',
  'Stratus Admin',
  'admin',
  'active',
  'approved',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE email = 'Stratuscharters@gmail.com'
);

-- 8. Add test users (only if they don't exist)
-- Test Broker
INSERT INTO public.users (id, email, full_name, role, status, verification_status, created_at, last_login_at)
SELECT 
  gen_random_uuid(),
  'test.broker@stratusconnect.com',
  'John Broker',
  'broker',
  'active',
  'approved',
  NOW() - INTERVAL '30 days',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test.broker@stratusconnect.com');

-- Test Operator
INSERT INTO public.users (id, email, full_name, role, status, verification_status, created_at, last_login_at)
SELECT 
  gen_random_uuid(),
  'test.operator@stratusconnect.com',
  'Sarah Operator',
  'operator',
  'active',
  'approved',
  NOW() - INTERVAL '25 days',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test.operator@stratusconnect.com');

-- Test Pilot
INSERT INTO public.users (id, email, full_name, role, status, verification_status, created_at)
SELECT 
  gen_random_uuid(),
  'test.pilot@stratusconnect.com',
  'Mike Pilot',
  'pilot',
  'active',
  'approved',
  NOW() - INTERVAL '20 days'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test.pilot@stratusconnect.com');

-- Test Crew
INSERT INTO public.users (id, email, full_name, role, status, verification_status, created_at)
SELECT 
  gen_random_uuid(),
  'test.crew@stratusconnect.com',
  'Lisa Crew',
  'crew',
  'active',
  'approved',
  NOW() - INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test.crew@stratusconnect.com');

-- Pending Broker
INSERT INTO public.users (id, email, full_name, role, status, verification_status, created_at)
SELECT 
  gen_random_uuid(),
  'pending.broker@stratusconnect.com',
  'David Pending',
  'broker',
  'pending',
  'pending',
  NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'pending.broker@stratusconnect.com');

-- Pending Operator
INSERT INTO public.users (id, email, full_name, role, status, verification_status, created_at)
SELECT 
  gen_random_uuid(),
  'pending.operator@stratusconnect.com',
  'Emma Pending',
  'operator',
  'pending',
  'pending',
  NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'pending.operator@stratusconnect.com');

-- Suspended User
INSERT INTO public.users (id, email, full_name, role, status, verification_status, created_at)
SELECT 
  gen_random_uuid(),
  'suspended.user@stratusconnect.com',
  'Suspended User',
  'broker',
  'suspended',
  'rejected',
  NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'suspended.user@stratusconnect.com');

-- 9. Show results
SELECT 
  'Setup complete!' as message,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_users
FROM public.users;

-- 10. List all users
SELECT 
  email,
  full_name,
  role,
  status,
  verification_status,
  created_at
FROM public.users
ORDER BY 
  CASE role 
    WHEN 'admin' THEN 1
    WHEN 'broker' THEN 2
    WHEN 'operator' THEN 3
    WHEN 'pilot' THEN 4
    WHEN 'crew' THEN 5
  END,
  created_at DESC;






