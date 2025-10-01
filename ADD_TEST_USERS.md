# 🧪 HOW TO ADD TEST USERS TO YOUR ADMIN CONSOLE

Your admin console is **working perfectly** - you just have **0 users** in the database!

## 🎯 **Quick Ways to Add Users:**

### **Option 1: Sign Up Through the App** ⚡ (EASIEST)

1. Navigate to: `http://localhost:8080/auth`
2. Sign up with Google (or magic link)
3. The user will appear in your admin console!
4. Repeat for multiple test accounts

---

### **Option 2: Run SQL Directly in Supabase** 🗄️

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Go to **SQL Editor**
3. Run this SQL to create test users:

```sql
-- Create test users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES 
  (
    gen_random_uuid(),
    'broker@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"role": "broker", "full_name": "Test Broker"}'::jsonb
  ),
  (
    gen_random_uuid(),
    'operator@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"role": "operator", "full_name": "Test Operator"}'::jsonb
  ),
  (
    gen_random_uuid(),
    'pilot@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"role": "pilot", "full_name": "Test Pilot"}'::jsonb
  ),
  (
    gen_random_uuid(),
    'crew@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"role": "crew", "full_name": "Test Crew"}'::jsonb
  );

-- Add them to the public users table
INSERT INTO public.users (id, email, full_name, role, status, created_at)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'role',
  'active',
  created_at
FROM auth.users
WHERE email LIKE '%@test.com';
```

---

### **Option 3: Add Pending Users** 🕐

Add users that need approval:

```sql
INSERT INTO public.users (
  id,
  email,
  full_name,
  role,
  status,
  created_at
) VALUES 
  (gen_random_uuid(), 'pending1@test.com', 'Pending Broker', 'broker', 'pending', NOW()),
  (gen_random_uuid(), 'pending2@test.com', 'Pending Operator', 'operator', 'pending', NOW());
```

---

## 🔍 **Why You See 0 Users:**

Your admin console is checking both:
1. `auth.users` table (Supabase Auth)
2. `public.users` table (Your custom user data)

If **both are empty**, you'll see:
- Total Users: 0
- Pending Approval: 0
- Admin Users: 0
- Active Today: 0
- "No users found"

---

## ✅ **After Adding Users:**

1. Refresh the admin console page
2. You'll see all your test users!
3. You can now:
   - ✅ Approve pending users
   - ✅ Change roles
   - ✅ Delete users
   - ✅ Search and filter
   - ✅ View activity

---

## 🚀 **Quick Test:**

**Easiest way right now:**

1. Open a new incognito window
2. Go to `http://localhost:8080/auth`
3. Click "Continue with Google"
4. Sign in with a Google account
5. Return to admin console
6. **BAM!** You'll see your first user! 🎉

---

## 🛡️ **Make Yourself an Admin:**

After signing up, run this in Supabase SQL Editor (replace YOUR_EMAIL):

```sql
UPDATE public.users 
SET role = 'admin', status = 'active'
WHERE email = 'YOUR_EMAIL@gmail.com';
```

---

**Your admin console is 100% functional - you just need users!** 🚀

