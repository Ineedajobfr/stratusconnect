-- COMPLETE FIX for Admin Console
-- Handles ALL required fields: username, access_code_hash, etc.
-- 100% SAFE - NON-DESTRUCTIVE

-- 1. Add status column if missing
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active','pending','suspended','inactive'));

-- 2. Migrate verification_status to status for existing users
UPDATE public.users 
SET status = CASE 
  WHEN verification_status = 'approved' THEN 'active'
  WHEN verification_status = 'pending' THEN 'pending'
  WHEN verification_status = 'rejected' THEN 'suspended'
  ELSE 'active'
END
WHERE status IS NULL;

-- 3. Add indexes
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 4. Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 5. Drop old policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;

-- 6. Create admin policies
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view their own data" ON public.users FOR SELECT TO authenticated 
USING (id = auth.uid());

CREATE POLICY "Admins can update users" ON public.users FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert users" ON public.users FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete users" ON public.users FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 7. Make Stratuscharters@gmail.com admin (with ALL required fields!)
UPDATE public.users
SET 
  role = 'admin', 
  status = 'active', 
  verification_status = 'approved',
  full_name = COALESCE(full_name, 'Stratus Admin'),
  username = COALESCE(username, 'stratusadmin'),
  access_code_hash = COALESCE(access_code_hash, 'ADMIN_NO_ACCESS_CODE'),
  updated_at = NOW()
WHERE email = 'Stratuscharters@gmail.com';

-- If doesn't exist, create with ALL required fields
INSERT INTO public.users (
  id, email, username, access_code_hash, full_name, role, status, 
  verification_status, created_at, updated_at, is_active
)
SELECT 
  gen_random_uuid(),
  'Stratuscharters@gmail.com',
  'stratusadmin',
  'ADMIN_NO_ACCESS_CODE',
  'Stratus Admin',
  'admin',
  'active',
  'approved',
  NOW(),
  NOW(),
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE email = 'Stratuscharters@gmail.com'
);

-- 8. Add test users WITH ALL required fields (username + access_code_hash)
INSERT INTO public.users (
  id, email, username, access_code_hash, full_name, role, status, 
  verification_status, created_at, last_login_at, is_active
)
SELECT 
  gen_random_uuid(),
  'test.broker@stratusconnect.com',
  'johnbroker',
  'TEST_ACCESS_CODE_1',
  'John Broker',
  'broker',
  'active',
  'approved',
  NOW() - INTERVAL '30 days',
  NOW(),
  true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test.broker@stratusconnect.com');

INSERT INTO public.users (
  id, email, username, access_code_hash, full_name, role, status, 
  verification_status, created_at, last_login_at, is_active
)
SELECT 
  gen_random_uuid(),
  'test.operator@stratusconnect.com',
  'sarahoperator',
  'TEST_ACCESS_CODE_2',
  'Sarah Operator',
  'operator',
  'active',
  'approved',
  NOW() - INTERVAL '25 days',
  NOW(),
  true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test.operator@stratusconnect.com');

INSERT INTO public.users (
  id, email, username, access_code_hash, full_name, role, status, 
  verification_status, created_at, is_active
)
SELECT 
  gen_random_uuid(),
  'test.pilot@stratusconnect.com',
  'mikepilot',
  'TEST_ACCESS_CODE_3',
  'Mike Pilot',
  'pilot',
  'active',
  'approved',
  NOW() - INTERVAL '20 days',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test.pilot@stratusconnect.com');

INSERT INTO public.users (
  id, email, username, access_code_hash, full_name, role, status, 
  verification_status, created_at, is_active
)
SELECT 
  gen_random_uuid(),
  'test.crew@stratusconnect.com',
  'lisacrew',
  'TEST_ACCESS_CODE_4',
  'Lisa Crew',
  'crew',
  'active',
  'approved',
  NOW() - INTERVAL '15 days',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test.crew@stratusconnect.com');

INSERT INTO public.users (
  id, email, username, access_code_hash, full_name, role, status, 
  verification_status, created_at, is_active
)
SELECT 
  gen_random_uuid(),
  'pending.broker@stratusconnect.com',
  'davidpending',
  'PENDING_ACCESS_CODE_1',
  'David Pending',
  'broker',
  'pending',
  'pending',
  NOW() - INTERVAL '2 days',
  false
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'pending.broker@stratusconnect.com');

INSERT INTO public.users (
  id, email, username, access_code_hash, full_name, role, status, 
  verification_status, created_at, is_active
)
SELECT 
  gen_random_uuid(),
  'pending.operator@stratusconnect.com',
  'emmapending',
  'PENDING_ACCESS_CODE_2',
  'Emma Pending',
  'operator',
  'pending',
  'pending',
  NOW() - INTERVAL '1 day',
  false
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'pending.operator@stratusconnect.com');

INSERT INTO public.users (
  id, email, username, access_code_hash, full_name, role, status, 
  verification_status, created_at, is_active
)
SELECT 
  gen_random_uuid(),
  'suspended.user@stratusconnect.com',
  'suspendeduser',
  'SUSPENDED_ACCESS_CODE',
  'Suspended User',
  'broker',
  'suspended',
  'rejected',
  NOW() - INTERVAL '45 days',
  false
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'suspended.user@stratusconnect.com');

-- 9. Show results
SELECT 
  '🎉 Admin Console Setup Complete!' as message,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_users,
  COUNT(*) FILTER (WHERE status = 'active') as active_users,
  COUNT(*) FILTER (WHERE last_login_at >= CURRENT_DATE) as logged_in_today
FROM public.users;

-- 10. List all users
SELECT 
  username,
  email,
  full_name,
  role,
  status,
  verification_status,
  is_active,
  last_login_at,
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
  created_at DESC
LIMIT 20;


