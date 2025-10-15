# Manual User Confirmation Guide

## Issue Fixed
The `confirmed_at` column in Supabase Auth is a generated column that can't be updated manually via SQL.

## ✅ Solution Applied

### 1. **Code Changes Made**
- ✅ Staff Portal now accepts `stratuscharters@gmail.com`
- ✅ Authorization logic updated to allow both admin emails
- ✅ Default email changed to `stratuscharters@gmail.com`

### 2. **Database Setup**
Run the `FIXED_MAIN_ADMIN_SETUP.sql` script - it skips the problematic `confirmed_at` update.

### 3. **Manual User Confirmation (if needed)**

If `stratuscharters@gmail.com` is not confirmed in Supabase Auth:

#### Option A: Via Supabase Dashboard
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find `stratuscharters@gmail.com`
3. If not confirmed, click **"Send confirmation email"**
4. Check email and click confirmation link

#### Option B: Via Supabase Dashboard (Direct)
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find `stratuscharters@gmail.com`
3. Click **"Edit"** button
4. Check **"Email Confirmed"** checkbox
5. Click **"Save"**

#### Option C: Create New User (if doesn't exist)
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"**
3. Fill in:
   - **Email**: `stratuscharters@gmail.com`
   - **Password**: `admin123`
   - **Check**: "Email Confirmed"
4. Click **"Create User"**

## 🎯 **Test Login**

After running the SQL script and confirming the user:

1. **Go to**: http://localhost:8080/staff-portal
2. **Login with**:
   - Email: `stratuscharters@gmail.com`
   - Password: `admin123`
3. **Should redirect to admin console**

## 🔧 **What the Fixed SQL Does**

1. ✅ Creates `platform_admins` table
2. ✅ Adds user to `platform_admins` table
3. ✅ Sets admin role in `public.users`
4. ✅ Creates secondary admin (`admin@stratusconnect.com`)
5. ✅ Skips problematic `confirmed_at` update
6. ✅ Verifies setup

## 🚀 **Result**

- ✅ `stratuscharters@gmail.com` is authorized for staff portal
- ✅ Admin role set in database
- ✅ Platform admin privileges granted
- ✅ Ready to access admin console

**The user confirmation will be handled by Supabase Auth automatically or manually via dashboard!**
