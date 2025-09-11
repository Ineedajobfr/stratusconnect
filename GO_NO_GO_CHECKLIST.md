# StratusConnect Go/No-Go Checklist
## FCA Compliant Aviation Platform

### Pre-Launch Verification

#### ✅ Payments
- [ ] **Fees enforced in code**
  - [ ] 7% platform commission on broker-operator deals
  - [ ] 10% hiring fee on operator pilot/crew hires
  - [ ] 0% fees for pilots and crew
  - [ ] Fee calculations tested with real amounts

- [ ] **Webhooks resilient to retries and duplicates**
  - [ ] Idempotency implemented
  - [ ] SHA256 payload hashing
  - [ ] Provider ID storage
  - [ ] Retry logic with exponential backoff

- [ ] **Payout blocking until KYC**
  - [ ] KYC verification required before payouts
  - [ ] Payout blocking tested
  - [ ] KYC pass/fail workflow working

#### ✅ Legal
- [ ] **Terms, Privacy, Cookies, SLA, Security published**
  - [ ] All pages have Last Updated dates
  - [ ] No ISO claims without certification
  - [ ] "Aligned with ISO 27001" used instead
  - [ ] No "escrow" claims - using "Stripe Connect" with clear wording

#### ✅ Data and GDPR
- [ ] **DSAR export downloads JSON bundle**
  - [ ] Complete data export working
  - [ ] JSON format with all required fields
  - [ ] Download functionality tested

- [ ] **Erasure and rectification create logged tickets**
  - [ ] 30-day timer implemented
  - [ ] Ticket logging working
  - [ ] Status tracking functional

- [ ] **Retention rules exist**
  - [ ] Financial records: 6 years
  - [ ] AML records: as required by law
  - [ ] Expired licenses: 30 days (unless law requires longer)

#### ✅ Monitoring
- [ ] **UptimeRobot monitors active**
  - [ ] App endpoint monitored
  - [ ] API endpoint monitored
  - [ ] Webhook endpoint monitored

- [ ] **Status page shows live data**
  - [ ] P50, P90, P99 response times
  - [ ] Rolling uptime display
  - [ ] Shows "N/A" when no data available
  - [ ] No static claims

- [ ] **Two test incidents opened and closed**
  - [ ] Incident creation working
  - [ ] Status page updates
  - [ ] Incident resolution working
  - [ ] Service credits can be calculated

#### ✅ Security
- [ ] **RLS on every table**
  - [ ] Row-level security policies active
  - [ ] Users can only access their own data
  - [ ] Admin access properly configured

- [ ] **Least privilege on service keys**
  - [ ] Service keys have minimal required permissions
  - [ ] Key rotation schedule established

- [ ] **MFA available and admin switch**
  - [ ] Multi-factor authentication implemented
  - [ ] Admin can require MFA for all users
  - [ ] MFA enforcement working

- [ ] **File uploads scanned**
  - [ ] Malware scanning enabled
  - [ ] Executable files blocked
  - [ ] File type validation working

- [ ] **Rate limits on public routes**
  - [ ] API rate limiting active
  - [ ] Friendly error messages
  - [ ] Rate limit headers included

- [ ] **Tokens rotated**
  - [ ] API keys rotated
  - [ ] Webhook secrets rotated
  - [ ] Database credentials rotated

#### ✅ Operational
- [ ] **Contact sharing only after confirmed deal**
  - [ ] Contact details hidden until deal confirmed
  - [ ] Sharing mechanism working
  - [ ] Audit trail for contact sharing

- [ ] **Receipts and audit hashes download**
  - [ ] Receipt generation working
  - [ ] Audit hash calculation correct
  - [ ] Download from deal view working

- [ ] **KYC review panel works**
  - [ ] Admin can review KYC submissions
  - [ ] Approve/reject workflow functional
  - [ ] Status updates working

- [ ] **Sanctions hits block payouts**
  - [ ] Sanctions screening working
  - [ ] Hits properly block payouts
  - [ ] Manual review process for hits

### Day One Smoke Tests

#### ✅ Test 1: Charter Deal
- [ ] Create £10,000 charter deal
- [ ] Verify £700 platform fee (7%)
- [ ] Confirm receipt generation
- [ ] Verify audit hash

#### ✅ Test 2: KYC Blocking
- [ ] Try payout before KYC (should fail)
- [ ] Submit KYC verification
- [ ] Payout succeeds after KYC
- [ ] Verify blocking mechanism

#### ✅ Test 3: Hiring Flow
- [ ] Create £3,000 pilot hire
- [ ] Verify £300 operator fee (10%)
- [ ] Confirm receipt generation
- [ ] Verify audit hash

#### ✅ Test 4: Status Page
- [ ] Open test incident
- [ ] Verify appears on status page
- [ ] Close incident
- [ ] Verify resolution

#### ✅ Test 5: DSAR Export
- [ ] Run DSAR export for own account
- [ ] Download JSON file
- [ ] Verify complete data export
- [ ] Check data structure

#### ✅ Test 6: Access Control
- [ ] Try to access another user's deal
- [ ] Verify access denied cleanly
- [ ] Check error message
- [ ] Verify audit logging

### Final Verification

#### ✅ Code Verification
- [ ] `VITE_SC_DEMO_MODE=false` in production
- [ ] No hardcoded secrets in code
- [ ] All environment variables set
- [ ] Database migrations applied

#### ✅ Infrastructure Verification
- [ ] Backups enabled and tested
- [ ] Restore procedure tested
- [ ] Monitoring alerts configured
- [ ] Status page publicly accessible

#### ✅ Legal Verification
- [ ] Terms match actual platform behavior
- [ ] Privacy notice covers all data processing
- [ ] SLA based on real monitoring data
- [ ] Security overview accurate

### Go/No-Go Decision

**GO Criteria (All must be true):**
- [ ] Fees are enforced in code
- [ ] Webhooks are resilient to retries and duplicates
- [ ] Status page is live and public
- [ ] DSAR export and erasure both work
- [ ] Backups and restore have been tested
- [ ] All day one smoke tests pass
- [ ] Legal pages published and accurate
- [ ] Security controls active and tested

**If ANY item is not checked, DO NOT GO LIVE.**

### Emergency Contacts

**24/7 On-Call:** +44 20 1234 5678
**Emergency Email:** emergency@stratusconnect.com
**Stripe Support:** [Support Portal]
**Supabase Support:** [Support Portal]

### Post-Launch Monitoring

**First 24 Hours:**
- Monitor all metrics continuously
- Watch for any errors or issues
- Be ready to rollback if needed
- Communicate status every 2 hours

**First Week:**
- Daily metrics review
- Weekly team standup
- Address any issues immediately
- Document lessons learned

---

**Remember:**
- It's better to delay launch than to launch with issues
- Every item on this checklist is critical
- When in doubt, don't go live
- Test everything twice

**There can be no doubt. When the lion is hungry, he eats.**

**Final Decision:** [ ] GO [ ] NO-GO

**Signed:** _________________ **Date:** _________________
