# Fix OTP Error - Manual Steps

## 🎯 **The SQL approach failed because `auth.config` table doesn't exist**

Let's fix this manually in the Supabase Dashboard:

## 📋 **Step-by-Step Manual Fix:**

### Step 1: Go to Authentication Settings
1. **Open**: https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/providers
2. **You should see a list of providers** (Email, Google, GitHub, etc.)

### Step 2: Configure Email Provider
1. **Click on "Email"** in the providers list
2. **Make sure these settings are ENABLED**:
   - ✅ **"Enable email signups"** - MUST be ON
   - ✅ **"Enable email confirmations"** - MUST be ON
   - ✅ **"Enable email change confirmations"** - Should be ON

### Step 3: Configure URLs
1. **Go to**: https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/url-configuration
2. **Set these values**:
   - **Site URL**: `http://localhost:8080` (note: port 8080, not 8081)
   - **Redirect URLs**: Add these URLs:
     - `http://localhost:8080/auth/callback`
     - `http://localhost:8080/**`

### Step 4: Save and Test
1. **Click "Save"** on each page
2. **Wait 2-3 minutes** for settings to propagate
3. **Test the magic link**:
   - Go to: `http://localhost:8080/staff-portal`
   - Use: `stratuscharters@gmail.com`
   - Click: "Send Magic Link"

## 🔍 **Important Notes:**

### Port Number Issue
- Your dev server is running on **port 8080**, not 8081
- Make sure to use `http://localhost:8080` in Supabase settings

### If Settings Don't Save
1. **Refresh the page** and try again
2. **Check if you have admin permissions** on the Supabase project
3. **Try disabling and re-enabling** the email provider

### Alternative: Check Current Settings
1. **Go to**: https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/providers
2. **Look at the Email provider** - what does it show?
3. **Take a screenshot** if you need help

## 🚀 **Quick Test:**

After making these changes:

1. **Wait 2-3 minutes** for settings to propagate
2. **Go to**: `http://localhost:8080/staff-portal`
3. **Use email**: `stratuscharters@gmail.com`
4. **Click**: "Send Magic Link"
5. **Check your email** for the magic link

## ❌ **If Still Not Working:**

### Check Supabase Dashboard Again
1. **Verify** the email provider settings are actually saved
2. **Check** if there are any error messages in the dashboard
3. **Look** at the URL configuration page

### Alternative: Create Admin User First
1. **Run**: `create_admin_user.sql` in Supabase SQL Editor
2. **Then try** the magic link again

### Debug Steps
1. **Check browser console** for any new errors
2. **Check Supabase logs** in the dashboard
3. **Try a different email** to test

---

**Key Points:**
- ✅ Use port **8080** (not 8081)
- ✅ Enable **"Enable email signups"** in Supabase Dashboard
- ✅ Enable **"Enable email confirmations"** in Supabase Dashboard
- ✅ Wait 2-3 minutes after saving settings

**Dashboard URLs:**
- Providers: https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/providers
- URL Config: https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/url-configuration

