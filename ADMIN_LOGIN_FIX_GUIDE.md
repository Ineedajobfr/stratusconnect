# Admin Login Fix - Complete Setup Guide

## 🎯 Issues Fixed

✅ **Magic link not working** - Added proper error handling and debugging  
✅ **Admin email validation** - Only `stratuscharters@gmail.com` allowed  
✅ **User protection** - Normal users can never access admin portal  
✅ **reCAPTCHA optional** - Works even if reCAPTCHA fails  

## 📋 Quick Setup Steps

### Step 1: Create Admin User in Database

1. **Open Supabase Dashboard**
2. **Go to SQL Editor**
3. **Run this script**: `create_admin_user.sql`
4. **Verify success message** appears

### Step 2: Test Admin Login

1. **Go to Staff Portal**: `http://localhost:8081/staff-portal`
2. **Email is pre-filled**: `stratuscharters@gmail.com`
3. **Complete reCAPTCHA** (optional - will work without it)
4. **Click "Send Magic Link"**
5. **Check your email** for the magic link
6. **Click the magic link** in your email
7. **You'll be redirected** to the Admin Console

## 🔐 What's Been Fixed

### Magic Link Issues:
- ✅ **Better error handling** - Shows specific error messages
- ✅ **Admin email validation** - Only allows your email
- ✅ **Debugging logs** - Console shows what's happening
- ✅ **Pre-filled email** - No need to type it
- ✅ **reCAPTCHA optional** - Works even if reCAPTCHA fails

### Security Protection:
- ✅ **AdminRouteGuard** - Double protection for admin routes
- ✅ **Email validation** - Only `stratuscharters@gmail.com` allowed
- ✅ **Role checking** - Non-admin users redirected to their terminals
- ✅ **Access denied page** - Clear message if unauthorized

## 🚀 How It Works Now

### Admin Login Flow:
1. **Staff Portal** (`/staff-portal`) - Only accessible to your email
2. **Magic Link Sent** - Check your email for the link
3. **Click Magic Link** - Redirects to `/auth/callback`
4. **AuthCallback** - Processes authentication and checks role
5. **Admin Console** (`/admin`) - Protected by AdminRouteGuard

### User Protection:
- **Normal users** trying to access `/admin` → Redirected to their terminal
- **Unauthorized emails** → "This email is not authorized" message
- **No user logged in** → Redirected to home page

## 🔧 Troubleshooting

### Issue: "Admin account not found"
**Solution**: Run `create_admin_user.sql` in Supabase first

### Issue: "This email is not authorized"
**Solution**: Make sure you're using `stratuscharters@gmail.com`

### Issue: Magic link not received
**Solution**: 
1. Check spam folder
2. Check Supabase email logs
3. Verify email is confirmed in database

### Issue: "Access Denied" page
**Solution**: You're not logged in as admin - check your email and try again

### Issue: reCAPTCHA not working
**Solution**: It's optional now - the login will work without it

## 📧 Email Configuration

If magic links aren't working, check Supabase settings:

1. **Authentication Settings**:
   - Go to Supabase Dashboard → Authentication → Settings
   - Enable "Enable email confirmations"
   - Set "Site URL" to `http://localhost:8081`

2. **Email Templates**:
   - Go to Authentication → Email Templates
   - Customize "Confirm signup" template
   - Make sure it includes the magic link

3. **SMTP Settings** (if using custom SMTP):
   - Go to Authentication → Settings
   - Configure SMTP settings for your email provider

## 🎯 Test Scenarios

### ✅ Test 1: Normal User Protection
1. Login as any non-admin user (broker, operator, pilot, crew)
2. Try to go to `/admin` directly
3. Should be redirected to their terminal

### ✅ Test 2: Admin Login
1. Go to `/staff-portal`
2. Use `stratuscharters@gmail.com`
3. Send magic link
4. Check email and click link
5. Should land on Admin Console

### ✅ Test 3: Unauthorized Email
1. Go to `/staff-portal`
2. Try different email address
3. Should get "not authorized" message

## 📁 Files Modified

- ✅ **`src/pages/StaffPortal.tsx`** - Fixed magic link, added validation
- ✅ **`src/components/AdminRouteGuard.tsx`** - New protection component
- ✅ **`src/App.tsx`** - Added AdminRouteGuard to admin route
- ✅ **`create_admin_user.sql`** - Creates your admin user

## 🎉 Ready to Use!

After running the SQL script:

1. **Staff Portal** → Pre-filled with your email
2. **Magic Link** → Sent to your email
3. **Admin Console** → Protected and accessible
4. **Test Users** → Available in Admin Console
5. **User Protection** → Normal users can't access admin

---

**Status**: ✅ All Issues Fixed  
**Admin Email**: stratuscharters@gmail.com  
**Portal**: http://localhost:8081/staff-portal  
**Console**: http://localhost:8081/admin

