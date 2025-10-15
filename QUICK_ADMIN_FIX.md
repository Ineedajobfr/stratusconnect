# 🚀 QUICK ADMIN LOGIN FIX

## ❌ **Current Error:**
`Invalid login credentials` - Admin user doesn't exist or password is wrong.

## ✅ **Simple Solution:**

### Step 1: Run the New SQL Script
1. **Go to**: https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/sql
2. **Copy and paste** the contents of `simple_admin_setup.sql`
3. **Click "Run"**

### Step 2: Login with Simple Credentials
- **Email**: `stratuscharters@gmail.com`
- **Password**: `admin123` (much simpler!)

### Step 3: Test Login
1. **Go to**: `http://localhost:8080/staff-portal`
2. **Email**: `stratuscharters@gmail.com` (pre-filled)
3. **Password**: `admin123`
4. **Click**: "Sign In"

## 🔧 **What the New Script Does:**
- ✅ **Deletes any existing admin user** (fresh start)
- ✅ **Creates new admin user** with simple password
- ✅ **Creates profile** with admin role
- ✅ **Verifies** the user was created successfully

## 🎯 **Why This Should Work:**
- ✅ **Simple password** (`admin123`) - no special characters issues
- ✅ **Fresh user creation** - no conflicts with existing data
- ✅ **Proper encryption** - uses `crypt()` with `gen_salt('bf')`
- ✅ **Email confirmed** - sets `email_confirmed_at` to NOW()

## 🔍 **If It Still Fails:**
1. **Check**: Did the SQL script run without errors?
2. **Check**: Are you using the exact email `stratuscharters@gmail.com`?
3. **Check**: Are you using the exact password `admin123`?
4. **Check**: Did you refresh the page after running the SQL?

---

**This should fix the "Invalid login credentials" error!** 🎉

