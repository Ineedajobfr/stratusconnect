# 🧪 Testing Checklist for StratusConnect

## Quick Manual Test Guide

Run through these tests to ensure everything works perfectly:

---

## 1. **Navigation Flow Tests**

### Landing Page (`/`)
- [ ] Click "Sign up" → Should go to `/role-selection` ✅
- [ ] Click "About Us" → Should go to `/about` and scroll to top ✅
- [ ] Click footer links → All pages should start at top ✅

### Role Selection (`/role-selection`)
- [ ] Click "Back to Home" (unauthenticated) → Should go to `/` ✅
- [ ] Select Broker → Goes to broker signup
- [ ] Select Operator → Goes to operator signup
- [ ] Select Pilot → Goes to pilot signup
- [ ] Select Crew → Goes to crew signup

### Demo Terminals
- [ ] Navigate to any demo → Page starts at top ✅
- [ ] Scroll down, click link → New page starts at top ✅

---

## 2. **Contact Information Tests**

Check these pages show `@stratusconnect.org` emails:

- [ ] Help Center: `support@stratusconnect.org` ✅
- [ ] Privacy Policy: `privacy@stratusconnect.org` ✅
- [ ] Privacy Page: `dpo@stratusconnect.org` ✅
- [ ] Terms: `legal@stratusconnect.org` ✅
- [ ] Cookie Policy: `privacy@stratusconnect.org` ✅
- [ ] SLA: `support@stratusconnect.org` ✅
- [ ] Status Page: `support@stratusconnect.org` ✅

---

## 3. **Cookie Policy Tests**

Go to `/cookie-policy`:

- [ ] No mention of "Analytics Cookies" ✅
- [ ] No mention of "Marketing Cookies" ✅
- [ ] No mention of "Google Analytics" ✅
- [ ] Shows "How We Use Your Data" section ✅
- [ ] States "We never sell your data" ✅
- [ ] Shows Essential and Functional cookies only ✅

---

## 4. **Help Center Tests**

Go to `/help`:

- [ ] No phone support mentioned ✅
- [ ] No live chat mentioned ✅
- [ ] Shows "Email Support" with stratusconnect.org email ✅
- [ ] Shows "24 hours" response time ✅
- [ ] Contact button opens email client ✅

---

## 5. **System Status Page Tests**

Go to `/status`:

- [ ] No user count metrics shown ✅
- [ ] No transaction data shown ✅
- [ ] Shows component status cards ✅
- [ ] Shows: Application, Database, API, Authentication ✅
- [ ] Shows last updated timestamp ✅
- [ ] No version/environment info shown ✅

---

## 6. **Demo Terminal Tests**

### Crew Demo (`/demo/crew`)
- [ ] Page starts at top ✅
- [ ] No "Real-Time Flight Tracking" section ✅
- [ ] No flight map component ✅
- [ ] All other sections work properly ✅

### All Demo Terminals
- [ ] Broker demo starts at top ✅
- [ ] Operator demo starts at top ✅
- [ ] Pilot demo starts at top ✅

---

## 7. **API Documentation Tests**

- [ ] API Docs link NOT in footer ✅
- [ ] Navigating to `/api-docs` shows nothing (route commented) ✅
- [ ] File still exists at `src/pages/ApiDocumentation.tsx` ✅

---

## 8. **About Page Tests**

Go to `/about`:

- [ ] Page starts at top ✅
- [ ] Click "Get in Touch" → Goes to `/contact` ✅
- [ ] Click "Try StratusConnect" → Goes to `/roles` ✅
- [ ] Scroll down and click "Back" → Returns to previous page ✅

---

## 9. **Authentication Flow Tests**

### Unauthenticated Users
- [ ] Visit `/` → See landing page
- [ ] Click "Back to Home" on any page → Goes to `/`
- [ ] All navigation works correctly

### Authenticated Users (Login with test account)
- [ ] Login as Broker → Can access broker terminal
- [ ] Click "Back to Home" → Goes to `/home` ✅
- [ ] All terminal features accessible

---

## 10. **Console/Error Tests**

Open browser DevTools console:

### On Page Load
- [ ] No errors in console
- [ ] No warnings about TensorFlow (commented out) ✅
- [ ] No 404 errors for missing resources
- [ ] No CORS errors

### During Navigation
- [ ] No errors when clicking between pages
- [ ] Smooth page transitions
- [ ] No flickering or layout shifts

### On Form Submission
- [ ] Contact form works (if implemented)
- [ ] Signup forms work
- [ ] Error messages display properly

---

## 11. **Mobile Responsiveness Tests**

Test on mobile device or DevTools mobile emulation:

- [ ] Landing page responsive
- [ ] Demo terminals responsive
- [ ] Legal pages readable
- [ ] Navigation menu works on mobile
- [ ] Forms usable on mobile
- [ ] Status page responsive

---

## 12. **Performance Tests**

### Page Load Speed
- [ ] Landing page loads in < 3 seconds
- [ ] Demo terminals load in < 3 seconds
- [ ] No unnecessary re-renders
- [ ] Images optimized

### Lighthouse Audit (Chrome DevTools)
- [ ] Performance: > 80
- [ ] Accessibility: > 90
- [ ] Best Practices: > 80
- [ ] SEO: > 80

---

## 13. **Accessibility Tests**

- [ ] All images have alt text
- [ ] Buttons have descriptive labels
- [ ] Forms have proper labels
- [ ] Color contrast sufficient
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

---

## 14. **Legal Page Tests**

### Privacy Policy (`/privacy-policy`)
- [ ] Starts at top ✅
- [ ] Contact email correct ✅
- [ ] All sections complete

### Terms of Service (`/terms-of-service`)
- [ ] Starts at top ✅
- [ ] Legal email correct ✅
- [ ] Fee structure mentioned

### Cookie Policy (`/cookie-policy`)
- [ ] Starts at top ✅
- [ ] Privacy-focused content ✅
- [ ] No analytics/marketing sections ✅

---

## 15. **Database Connection Tests**

If database is configured:

- [ ] User registration works
- [ ] Login works
- [ ] Marketplace loads
- [ ] Operator listings work
- [ ] Broker quotes work

If database NOT configured:
- [ ] Test users from localStorage work
- [ ] Demo data displays
- [ ] No 500 errors

---

## 🐛 **Known Issues (Optional Enhancements)**

### TensorFlow.js (AI Image Moderation)
- **Status**: Commented out (not installed)
- **Impact**: Basic file validation only
- **To Enable**: Install package and uncomment code
- **Priority**: Low (not blocking)

### API Documentation
- **Status**: Hidden but kept
- **Impact**: None (as requested)
- **To Enable**: Uncomment route in App.tsx
- **Priority**: Low

---

## ✅ **Quick Pass/Fail Checklist**

### Must Pass (Blocking Issues)
- [ ] No console errors on landing page
- [ ] Sign up button works
- [ ] All pages start at top
- [ ] Contact emails all @stratusconnect.org
- [ ] TypeScript compiles: `npm run type-check`
- [ ] Linter passes (no errors)

### Should Pass (Quality Issues)
- [ ] Cookie policy accurate
- [ ] Help center accurate
- [ ] Status page simplified
- [ ] Demo terminals clean

### Nice to Have (Future)
- [ ] Lighthouse score > 80
- [ ] Full accessibility audit
- [ ] TensorFlow AI installed
- [ ] Database fully configured

---

## 🚀 **Ready for Beta Launch?**

If all "Must Pass" items are ✅, you're ready to launch!

**Recommended Order:**
1. Test locally: `npm run dev`
2. Test all navigation flows
3. Verify contact information
4. Check legal pages
5. Apply database migrations
6. Deploy to staging
7. Final smoke test
8. Launch to beta users! 🎉

---

## 📞 **Support**

If you find any issues:
1. Check this checklist first
2. Review `UX_FIXES_COMPLETE.md`
3. Check terminal for errors
4. Review browser console

**Remember**: You've built an impressive £2-5 million platform for just £25/month! 🎯

