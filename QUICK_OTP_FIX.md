# 🚀 QUICK OTP FIX - Step by Step

## 🎯 **The Problem:**
Console shows: `"Signups not allowed for otp"` - This means Supabase email signups are disabled.

## ✅ **The Solution (2 minutes):**

### Step 1: Go to Supabase Dashboard
1. **Open**: https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/providers
2. **Click on "Email"** (not Google)

### Step 2: Enable Email Signups
1. **Find**: "Enable email signups" toggle
2. **Turn it ON** ✅
3. **Find**: "Enable email confirmations" toggle  
4. **Turn it ON** ✅
5. **Click "Save"**

### Step 3: Update URLs (Important!)
1. **Site URL**: Change to `http://localhost:8080`
2. **Redirect URLs**: Add `http://localhost:8080/auth/callback`
3. **Click "Save"**

### Step 4: Test
1. **Go to**: `http://localhost:8080/staff-portal`
2. **Email**: `stratuscharters@gmail.com` (already filled)
3. **Click**: "Send Magic Link"
4. **Should work!** ✅

## 🔍 **Alternative: Check Google OAuth**

If Step 2 doesn't work:
1. **Go to**: https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/providers
2. **Look for "Google"** provider
3. **If Google is ENABLED**: Disable it temporarily
4. **Save and test again**

## 🎯 **Why This Happens:**
- Supabase disables email signups by default for security
- Google OAuth can interfere with Gmail magic links
- Wrong URLs cause redirect failures

## ✅ **Expected Result:**
After these changes, you should see:
- ✅ No more "Signups not allowed for otp" errors
- ✅ Magic link email sent successfully
- ✅ Clicking magic link logs you into admin portal

---

**This should fix the main authentication issue!** 🎉

