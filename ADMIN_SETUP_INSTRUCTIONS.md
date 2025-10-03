# 🛡️ STRATUSCONNECT ADMIN SETUP

## 📋 **Quick Setup for Stratuscharters@gmail.com**

### **Step 1: Run the Setup Script** 🗄️

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: `pvgqfqkrtflpvajhddhr`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `setup_admin.sql`
6. Click **Run** (or press F5)

This will:
- ✅ Make `Stratuscharters@gmail.com` the **main admin**
- ✅ Set your status to **active**
- ✅ Add 7 test users (brokers, operators, pilots, crew)
- ✅ Add 2 pending users (to test approval feature)
- ✅ Add 1 suspended user (to test suspension feature)

---

### **Step 2: Access the Admin Console** 🖥️

1. Make sure you're signed in as `Stratuscharters@gmail.com`
2. Navigate to: **`http://localhost:8080/admin-console`**
3. You should now see:
   - **Total Users**: 8+ users
   - **Pending Approval**: 2 users
   - **Admin Users**: 1 (you!)
   - **Active Today**: 3 users

---

## 🎯 **What You Can Do:**

### **1. View All Users** 👥
- See complete list in the table
- View email, name, role, status
- See creation date and last sign-in

### **2. Search & Filter** 🔍
- **Search** by email, name, or ID
- **Filter by Role**: All/Broker/Operator/Pilot/Crew/Admin
- **Filter by Status**: All/Active/Pending/Suspended/Inactive

### **3. Approve Pending Users** ✅
- Find users with **Pending** status
- Click the green **"Approve"** button
- They become **Active** instantly

### **4. Change User Roles** 🔄
- Use the dropdown in the **Actions** column
- Select: Broker/Operator/Pilot/Crew/Admin
- Changes apply immediately

### **5. Delete Users** 🗑️
- Click the red trash icon
- Confirm deletion
- User is removed from the system

---

## 🧪 **Test Data Included:**

### **Active Users:**
- `test.broker@stratusconnect.com` - Broker
- `test.operator@stratusconnect.com` - Operator
- `test.pilot@stratusconnect.com` - Pilot
- `test.crew@stratusconnect.com` - Crew

### **Pending Approval:**
- `pending.broker@stratusconnect.com` - Broker (needs approval)
- `pending.operator@stratusconnect.com` - Operator (needs approval)

### **Suspended:**
- `suspended.user@stratusconnect.com` - Broker (suspended)

---

## 🚀 **Quick Test Workflow:**

1. **Approve a pending user:**
   - Find `pending.broker@stratusconnect.com`
   - Click **"Approve"** button
   - See status change to **Active**
   - Watch stats update (Pending Approval decreases)

2. **Change a user's role:**
   - Find `test.pilot@stratusconnect.com`
   - Use dropdown → select **Crew**
   - Role changes instantly

3. **Search for a user:**
   - Type "operator" in search box
   - See only operator users

4. **Filter by status:**
   - Select **"Pending"** from status dropdown
   - See only pending users

---

## 📊 **Expected Stats After Setup:**

```
Total Users:        8-10 users
Pending Approval:   2 users
Admin Users:        1 user (you)
Active Today:       3 users
```

---

## 🔒 **Security:**

- ✅ Only users with `role = 'admin'` can access `/admin-console`
- ✅ Non-admin users are automatically redirected to home
- ✅ All actions are logged to Supabase
- ✅ Toast notifications confirm all actions

---

## 🎉 **You're All Set!**

After running `setup_admin.sql`, your admin console will be **fully functional** with:
- Real user data
- Pending approvals to test
- Different roles to manage
- Active/inactive users
- Search and filter capabilities

**Your admin console is production-ready!** 🛡️✨

---

## 📞 **Need More Users?**

To add real users:
1. Share the signup link: `http://localhost:8080/auth`
2. Users sign up with Google
3. They appear in your admin console
4. You can approve/manage them!

Or manually add via SQL:
```sql
INSERT INTO public.users (id, email, full_name, role, status, created_at)
VALUES (
  gen_random_uuid(),
  'newuser@example.com',
  'New User Name',
  'broker',
  'pending',
  NOW()
);
```






