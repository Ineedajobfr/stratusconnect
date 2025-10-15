# Admin Test System Setup - Complete

## 🎉 System Ready!

Your test user impersonation system is now fully implemented and ready to use.

## 📋 Quick Setup Steps

### Step 1: Create Test Users in Database

1. Open **Supabase Dashboard**
2. Go to **SQL Editor**
3. Run the script: `create_real_test_users.sql`
4. Verify users were created successfully

### Step 2: Login as Admin

1. Navigate to: `http://localhost:8081/staff-portal`
2. Login with: `stratuscharters@gmail.com`
3. You'll be taken to the Admin Console

### Step 3: Access Test Users

1. Click the **"Test Users"** tab in the Admin Console
2. You'll see 4 test user cards:
   - 🔵 Alex Broker (Elite Aviation Brokers)
   - 🟢 Sarah Operator (SkyHigh Operations)
   - 🟣 Mike Pilot (ATP License, 8,500 hours)
   - 🟠 Emma Crew (Senior Cabin Crew)

### Step 4: Start Testing

1. **Click any test user card** to impersonate them
2. You'll be taken to their **real terminal** with **clean data**
3. Create real workflows and test interactions
4. **Logout** to return to admin console

## 🎯 What's Included

### Files Created/Modified:

1. ✅ **`create_real_test_users.sql`** - SQL script to create test users
2. ✅ **`TEST_USERS_GUIDE.md`** - Complete usage guide
3. ✅ **`src/pages/AdminConsole.tsx`** - Added "Test Users" tab with impersonation
4. ✅ **`src/contexts/AuthContext.tsx`** - Updated to handle test user authentication
5. ✅ **`src/App.tsx`** - Cleaned up test login routes

### Features Implemented:

- ✅ **Admin-only test user access** (secure, no public access)
- ✅ **One-click impersonation** (no manual login required)
- ✅ **Clean terminals** (no dummy data)
- ✅ **Real database integration** (persistent data)
- ✅ **Cross-user workflows** (test complete processes)
- ✅ **Alternative direct login** (with passwords for flexibility)

## 🔐 Test User Credentials

### Admin Account
- **Email**: `stratuscharters@gmail.com`
- **Portal**: `/staff-portal`

### Test Accounts (after running SQL script)

| Role | Email | Password | Terminal |
|------|-------|----------|----------|
| Broker | `broker@test.com` | `TestBroker123!` | `/broker-terminal` |
| Operator | `operator@test.com` | `TestOperator123!` | `/operator-terminal` |
| Pilot | `pilot@test.com` | `TestPilot123!` | `/pilot-terminal` |
| Crew | `crew@test.com` | `TestCrew123!` | `/crew-terminal` |

## 🚀 Testing Workflows

### Recommended Test Scenarios:

1. **Charter Booking Flow**
   - Operator posts aircraft
   - Broker creates RFQ
   - Operator sends quote
   - Broker accepts booking

2. **Crew Hiring Flow**
   - Operator posts job
   - Crew applies
   - Operator reviews & hires

3. **Pilot Recruitment Flow**
   - Operator posts position
   - Pilot applies
   - Operator schedules interview

4. **Cross-Platform Testing**
   - Create requests as one user
   - Switch to another user
   - Verify data visibility
   - Complete transactions

## 📊 Verification Checklist

After running the SQL script, verify:

- ✅ All 4 users created in `auth.users`
- ✅ All 4 profiles created in `public.profiles`
- ✅ All users have `verification_status = 'approved'`
- ✅ All users verified by `stratuscharters@gmail.com`
- ✅ Can login with test credentials
- ✅ Can impersonate from admin console
- ✅ Terminals load with clean data
- ✅ Can create real data in terminals
- ✅ Data persists between user switches

## 💡 Pro Tips

1. **Use Admin Impersonation** - Faster than logging out/in
2. **Keep Admin Tab Open** - Easy to switch between users
3. **Document Workflows** - Note any bugs or issues
4. **Test Edge Cases** - Invalid data, cancellations, disputes
5. **Check Cross-User Visibility** - Ensure data shows correctly

## 🔧 Troubleshooting

### Issue: Test users not showing in Admin Console
- **Solution**: Make sure you're logged in as admin (`stratuscharters@gmail.com`)

### Issue: Can't impersonate users
- **Solution**: Run `create_real_test_users.sql` in Supabase first

### Issue: Terminal shows "not authorized"
- **Solution**: Check that user's `verification_status` is `'approved'` in database

### Issue: Can't logout from test user
- **Solution**: Click logout button in top right, or clear `localStorage`

## 📚 Additional Resources

- **Full Guide**: See `TEST_USERS_GUIDE.md`
- **SQL Script**: Run `create_real_test_users.sql`
- **Support**: Contact via `/help` or admin console

## ✨ Next Steps

1. Run the SQL script to create test users
2. Login to admin console
3. Navigate to Test Users tab
4. Click a user card to start testing
5. Explore all terminal features with clean data

---

**System Status**: ✅ Ready to Use  
**Created**: 2025-01-10  
**Admin**: stratuscharters@gmail.com  
**Environment**: http://localhost:8081


