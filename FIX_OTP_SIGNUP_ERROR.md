# Fix OTP Signup Error - Complete Guide

## 🚨 Problem
Error: **"Signups not allowed for otp"**

This error occurs when Supabase has OTP (magic link) authentication disabled. This affects ALL users trying to use magic link authentication.

## ✅ Solution

### Step 1: Enable OTP in Supabase Dashboard

1. **Go to Supabase Dashboard**
2. **Navigate to**: Authentication → Settings → Auth Providers → Email
3. **Enable these settings**:
   - ✅ **"Enable email confirmations"**
   - ✅ **"Enable email change confirmations"**
   - ✅ **"Enable email signups"** (if you want new users to be able to signup)

### Step 2: Configure Site URLs

1. **Set Site URL**: `http://localhost:8081`
2. **Add Redirect URLs**:
   - `http://localhost:8081/auth/callback`
   - `http://localhost:8081/**` (for development)

### Step 3: Run SQL Scripts

Run these scripts in Supabase SQL Editor:

```sql
-- 1. Create admin user
-- Run: create_admin_user.sql

-- 2. Create test users  
-- Run: create_real_test_users.sql

-- 3. Fix OTP settings
-- Run: fix_supabase_otp_settings.sql
```

## 🔧 What's Been Fixed

### ✅ All Login Pages Updated:
- **Staff Portal** (`/staff-portal`) - Admin login
- **Broker Login** (`/login/broker`) - Broker terminal access
- **Operator Login** (`/login/operator`) - Operator terminal access
- **Pilot Login** (`/login/pilot`) - Pilot terminal access
- **Crew Login** (`/login/crew`) - Crew terminal access
- **General Login** (`/login`) - General user login

### ✅ Error Handling Added:
- **Specific OTP Error** - Clear message about enabling email confirmations
- **User Not Found** - Helpful message about signing up first
- **Rate Limiting** - Wait message for too many requests
- **Better Success Messages** - Clear confirmation when magic link is sent

### ✅ AuthContext Updated:
- **Global OTP Error Handling** - Handles OTP errors across the entire app
- **Consistent Error Messages** - Same helpful error messages everywhere

## 🎯 How to Test

### Test Admin Login:
1. Go to `/staff-portal`
2. Use `stratuscharters@gmail.com`
3. Should get magic link (after enabling OTP in Supabase)

### Test User Login:
1. Go to `/login/broker` (or any role)
2. Use `broker@test.com` (or any test user email)
3. Should get magic link

### Test Error Handling:
1. Try with OTP disabled → Should show helpful error message
2. Try with non-existent email → Should show "Account not found"
3. Try too many times → Should show rate limit message

## 📋 Supabase Settings Checklist

### Authentication → Settings → Auth Providers → Email:
- ✅ Enable email confirmations
- ✅ Enable email change confirmations
- ✅ Enable email signups (optional)

### Authentication → Settings → General:
- ✅ Site URL: `http://localhost:8081`
- ✅ Redirect URLs: `http://localhost:8081/auth/callback`

### Authentication → Settings → Auth Providers:
- ✅ Email provider enabled
- ✅ Magic link enabled

## 🔍 Troubleshooting

### Issue: Still getting "Signups not allowed for otp"
**Solution**: 
1. Double-check Supabase Dashboard settings
2. Make sure "Enable email confirmations" is ON
3. Wait a few minutes for settings to propagate

### Issue: Magic link not received
**Solution**:
1. Check spam folder
2. Verify email is confirmed in database
3. Check Supabase email logs

### Issue: "User not found" error
**Solution**:
1. Run `create_admin_user.sql` for admin
2. Run `create_real_test_users.sql` for test users
3. Or use the signup flow to create new users

### Issue: Rate limit exceeded
**Solution**:
1. Wait 5-10 minutes
2. Check Supabase rate limiting settings
3. Try from different IP if testing

## 📁 Files Updated

### Login Pages:
- ✅ `src/pages/StaffPortal.tsx`
- ✅ `src/pages/BrokerLogin.tsx`
- ✅ `src/pages/OperatorLogin.tsx`
- ✅ `src/pages/PilotLogin.tsx`
- ✅ `src/pages/CrewLogin.tsx`
- ✅ `src/pages/Login.tsx`

### Core Files:
- ✅ `src/contexts/AuthContext.tsx`
- ✅ `fix_supabase_otp_settings.sql`

## 🎉 After Fixing

Once you enable OTP in Supabase:

1. **All magic links will work** for existing users
2. **Clear error messages** when things go wrong
3. **Consistent experience** across all login pages
4. **Better debugging** with helpful error messages

## 🚀 Quick Fix Commands

```bash
# 1. Enable OTP in Supabase Dashboard (manual step)
# 2. Run these SQL scripts:

-- In Supabase SQL Editor:
create_admin_user.sql
create_real_test_users.sql  
fix_supabase_otp_settings.sql
```

---

**Status**: ✅ All Login Pages Fixed  
**Error**: "Signups not allowed for otp" → Resolved  
**Scope**: Admin + All User Types  
**Next**: Enable OTP in Supabase Dashboard

