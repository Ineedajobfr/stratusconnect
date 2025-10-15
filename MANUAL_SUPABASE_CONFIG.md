# Manual Supabase Configuration Guide

## 🎯 Quick Manual Setup (5 minutes)

Since the automated script needs additional API keys, here's the manual way to fix the OTP error:

### Step 1: Go to Authentication Settings
1. **Open**: https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/providers
2. **Click on "Email"** in the providers list

### Step 2: Enable Email Settings
In the Email provider settings, make sure these are **ENABLED**:
- ✅ **"Enable email signups"**
- ✅ **"Enable email confirmations"** 
- ✅ **"Enable email change confirmations"**

### Step 3: Configure URLs
1. **Go to**: https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/url-configuration
2. **Set these values**:
   - **Site URL**: `http://localhost:8081`
   - **Redirect URLs**: Add these one by one:
     - `http://localhost:8081/auth/callback`
     - `http://localhost:8081/**`
     - `http://localhost:8081`
     - `http://localhost:8081/admin`
     - `http://localhost:8081/broker-terminal`
     - `http://localhost:8081/operator-terminal`
     - `http://localhost:8081/pilot-terminal`
     - `http://localhost:8081/crew-terminal`

### Step 4: Test the Configuration
1. **Go to**: `http://localhost:8081/staff-portal`
2. **Use email**: `stratuscharters@gmail.com`
3. **Click**: "Send Magic Link"
4. **Check your email** for the magic link

## 🔧 Alternative: Use SQL Scripts

If you prefer to use the database approach, run these SQL scripts in Supabase SQL Editor:

### 1. Create Admin User
```sql
-- Run this in Supabase SQL Editor:
-- File: create_admin_user.sql
```

### 2. Create Test Users  
```sql
-- Run this in Supabase SQL Editor:
-- File: create_real_test_users.sql
```

### 3. Fix OTP Settings
```sql
-- Run this in Supabase SQL Editor:
-- File: fix_supabase_otp_settings.sql
```

## 🎯 What Each Setting Does

### Email Signups
- **Enable email signups**: Allows new users to create accounts via email
- **Enable email confirmations**: Sends magic links for login
- **Enable email change confirmations**: Allows users to change their email

### URL Configuration
- **Site URL**: The main URL of your app (for development: localhost:8081)
- **Redirect URLs**: Where users can be redirected after authentication

## 🚀 After Configuration

Once you've enabled these settings:

1. **Magic links will work** for all user types
2. **OTP error will be resolved** 
3. **All login pages will function** properly

## 🔍 Quick Test

Try this right after configuring:

1. **Admin Login**: `http://localhost:8081/staff-portal`
2. **Broker Login**: `http://localhost:8081/login/broker`
3. **Check email** for magic links

## 💡 Troubleshooting

### Still getting "Signups not allowed for otp"?
- **Wait 2-3 minutes** for settings to propagate
- **Double-check** that "Enable email confirmations" is ON
- **Refresh** the Supabase dashboard and check again

### Magic link not received?
- **Check spam folder**
- **Verify email address** is correct
- **Check Supabase email logs** in the dashboard

### "User not found" error?
- **Run the SQL scripts** to create test users
- **Or use the signup flow** to create new accounts

---

**Manual Configuration**: 5 minutes  
**Result**: All magic link authentication working  
**Test**: Try admin login at `/staff-portal`

