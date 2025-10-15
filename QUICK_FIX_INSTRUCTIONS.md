# 🚨 QUICK FIX - ADMIN LOGIN NOT WORKING

## Option 1: Use Supabase Dashboard (EASIEST)

1. **Go to**: https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/users
2. **Click**: "Add User" button
3. **Fill in**:
   - Email: `stratuscharters@gmail.com`
   - Password: `admin123`
   - Auto Confirm: ✅ (check this)
4. **Click**: "Create User"
5. **Go to**: User details → Edit → Add metadata:
   - `role`: `admin`
   - `username`: `admin`
   - `verification_status`: `approved`

## Option 2: Use Admin API (if you have service key)

1. **Get Service Key**: Dashboard → Settings → API → service_role key
2. **Replace** `YOUR_SERVICE_ROLE_KEY` in `SUPABASE_ADMIN_API_CREATE.js`
3. **Run** in browser console or Node.js

## Option 3: Nuclear Option - Reset Everything

```sql
-- Run this in Supabase SQL Editor
DELETE FROM auth.identities WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%stratuscharters%'
);
DELETE FROM auth.users WHERE email LIKE '%stratuscharters%';
DELETE FROM public.users WHERE email LIKE '%stratuscharters%';
DELETE FROM public.profiles WHERE email LIKE '%stratuscharters%';
```

Then use Option 1 to create user via Dashboard.

## Test Login:
- URL: http://localhost:8080/staff-portal
- Email: `stratuscharters@gmail.com`
- Password: `admin123`

**The Dashboard method (Option 1) should work 100%!** 🎉

