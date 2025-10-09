# ⚡ SUPABASE MANUAL CONFIGURATION - QUICK CHECKLIST

## 5-Minute Security Configuration

**After running the SQL migration, complete these 2 manual steps:**

---

## ✅ STEP 1: Fix Email OTP Expiry (2 minutes)

### Location:
```
Supabase Dashboard → Authentication → Providers → Email
```

### Action:
1. Scroll to **Email OTP Settings** section
2. Find **OTP Expiry** field
3. Change from current value (> 1 hour) to: **`3600`** (1 hour)
   - Or use **`1800`** (30 minutes - RECOMMENDED)
4. Click **Save**

### Why:
- ⚠️ Current: OTP valid for > 1 hour (security risk)
- ✅ Recommended: OTP valid for 15-30 minutes
- Reduces window for OTP theft/interception

---

## ✅ STEP 2: Enable Password Protection (3 minutes)

### Location:
```
Supabase Dashboard → Authentication → Policies
```

### Action:
1. Scroll to **Password Protection** section
2. Find **Check against HaveIBeenPwned** toggle
3. **Turn ON** the toggle
4. Click **Save**

### Why:
- Prevents users from using 600M+ compromised passwords
- Free service, no API key needed
- Blocks credential stuffing attacks

---

## 🎯 VERIFICATION

### After Completing Both Steps:

**Check Dashboard Warnings:**
- Go to **Database** → **Advisors**
- Should see NO security warnings
- All items should be ✅ green

**Check Authentication Settings:**
- Go to **Authentication** → **Providers** → **Email**
- OTP Expiry should show: `3600` or `1800`
- Go to **Authentication** → **Policies**
- HaveIBeenPwned should show: **Enabled**

---

## 📋 COMPLETE CHECKLIST

Copy and paste this to track your progress:

```markdown
## Security Configuration Checklist

### Automated (SQL Migration):
- [ ] Run migration: `20250110000001_fix_security_issues.sql`
- [ ] Verify all tables have RLS enabled
- [ ] Check extensions moved to `extensions` schema
- [ ] Confirm `api.users` view updated

### Manual (Dashboard):
- [ ] Set Email OTP expiry to ≤ 3600 seconds
- [ ] Enable HaveIBeenPwned password checking
- [ ] Verify no warnings in Database → Advisors
- [ ] Test login with new OTP expiry
- [ ] Test password validation with weak password

### Testing:
- [ ] Test RLS policies with different roles
- [ ] Test user signup flow
- [ ] Test password reset flow
- [ ] Verify OTP emails arrive quickly
- [ ] Confirm weak passwords are rejected

### Final:
- [ ] Document changes in team wiki
- [ ] Update deployment checklist
- [ ] Notify team of new security settings
- [ ] Schedule security review
```

---

## 🚨 QUICK TROUBLESHOOTING

### OTP Expiry Setting Not Saving:
- **Check**: Admin permissions in Supabase
- **Try**: Refresh dashboard and try again
- **Alternative**: Use Supabase CLI to set config

### HaveIBeenPwned Toggle Not Visible:
- **Check**: Supabase plan (should work on free tier)
- **Try**: Update Supabase project to latest version
- **Note**: Feature available since Supabase v2.0+

### Still Seeing Warnings After Config:
- **Wait**: Dashboard advisors update every ~5 minutes
- **Refresh**: Hard refresh browser (Ctrl+Shift+R)
- **Verify**: Check settings were actually saved

---

## ⏱️ TIME ESTIMATE

**Total time: ~5 minutes**

- Step 1 (OTP Expiry): 2 minutes
- Step 2 (Password Check): 3 minutes
- Verification: Automatic (refresh warnings)

---

## 🎉 COMPLETION

**When both steps are complete:**
- ✅ Database fully secured with RLS
- ✅ Extensions in correct schema
- ✅ API views using safe permissions
- ✅ OTP expiry < 1 hour
- ✅ Compromised passwords blocked
- ✅ **ZERO security warnings!**

**YOU'RE PRODUCTION READY!** 🚀🔒

---

## 📞 SUPPORT

### If Issues Arise:
1. Check `SUPABASE_SECURITY_FIX_GUIDE.md` for detailed troubleshooting
2. Review Supabase documentation
3. Check Supabase Discord/Support
4. Verify all migration steps completed

### Common Mistakes:
- ❌ Forgetting to click "Save" after changes
- ❌ Setting OTP expiry in wrong format (use seconds, not minutes)
- ❌ Not waiting for dashboard advisors to refresh
- ❌ Testing with cached auth tokens (clear browser cache)

---

## 🧙‍♂️ NEXT STEPS

After completing this checklist:

1. **Test Everything**:
   - User signup
   - Login/logout
   - Password reset
   - Different role access

2. **Document**:
   - Add to deployment docs
   - Update security policies
   - Note in changelog

3. **Monitor**:
   - Watch for auth issues
   - Check error logs
   - Monitor failed login attempts

4. **Celebrate**:
   - You've secured the platform! 🎊
   - No more security warnings! ✨
   - Production-ready database! 🚀

---

**LET'S GO! FIX THOSE LAST 2 ITEMS AND YOU'RE GOLDEN!** ⚡✅

