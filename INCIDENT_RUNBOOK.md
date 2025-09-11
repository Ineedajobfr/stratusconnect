# StratusConnect Incident Runbook
## FCA Compliant Aviation Platform

### Incident Response Process

#### 1. DECLARE
**Within 5 minutes of detection:**

- **Title:** Clear, descriptive incident title
- **Scope:** What services are affected (API, Web, Webhooks, Database)
- **Start Time:** Exact timestamp when incident began
- **Impact:** Minor, Major, or Critical
- **Affected Services:** List of specific services impacted

**Example:**
```
Title: Payment Processing API Down
Scope: API, Webhooks, Payment Processing
Start Time: 2024-01-16T14:30:00Z
Impact: Critical
Affected Services: Stripe Connect API, Payment Intents, Webhook Processing
```

#### 2. TRIAGE
**Within 10 minutes of declaration:**

**Check these systems in order:**

1. **API Health**
   - Check `/api/health` endpoint
   - Verify response times and error rates
   - Check API logs for errors

2. **Webhook Status**
   - Verify Stripe webhook delivery
   - Check webhook processing logs
   - Test webhook endpoint manually

3. **Database Connectivity**
   - Check Supabase connection status
   - Verify RLS policies are active
   - Check for connection pool exhaustion

4. **External Dependencies**
   - Stripe Connect API status
   - UptimeRobot monitoring
   - CDN and hosting provider status

**Triage Decision:**
- **Internal Issue:** Proceed to mitigation
- **External Dependency:** Contact provider, implement workaround
- **Unknown:** Escalate to senior team member

#### 3. COMMUNICATE
**Within 15 minutes of declaration:**

**Status Page Update:**
1. Go to admin panel
2. Update incident status to "Investigating"
3. Add initial description and scope
4. Set estimated resolution time

**Communication Template:**
```
We are currently investigating an issue affecting [SERVICE]. 
We will provide updates every 30 minutes until resolved.

Affected Services: [LIST]
Impact: [MINOR/MAJOR/CRITICAL]
Started: [TIME]
```

**Stakeholder Notification:**
- **Critical:** All users, brokers, operators
- **Major:** Affected user groups
- **Minor:** Internal team only

#### 4. MITIGATE
**Based on triage results:**

**API Issues:**
1. Check application logs
2. Restart application if needed
3. Scale up resources if overloaded
4. Roll back to last known good version

**Webhook Issues:**
1. Check Stripe webhook logs
2. Replay failed webhooks
3. Verify webhook signature validation
4. Test webhook endpoint manually

**Database Issues:**
1. Check connection pool status
2. Verify RLS policies
3. Check for deadlocks or long-running queries
4. Restart database if necessary

**External Dependencies:**
1. Check provider status pages
2. Implement rate limiting
3. Switch to backup providers if available
4. Contact provider support

**Rate Limiting:**
- Implement temporary rate limits
- Block suspicious traffic
- Prioritize critical operations

#### 5. CLOSE
**When incident is resolved:**

**Root Cause Analysis:**
1. Document what happened
2. Identify root cause
3. List contributing factors
4. Note what went well

**Fix Implementation:**
1. Deploy permanent fix
2. Update monitoring
3. Improve alerting
4. Update runbook if needed

**Service Credits:**
1. Calculate based on actual uptime
2. Apply credits to affected accounts
3. Document credit calculations
4. Notify affected users

**Lessons Learned:**
1. What could have prevented this?
2. How can we detect it faster?
3. What processes need improvement?
4. Update documentation

**Close Template:**
```
Incident resolved at [TIME]. 

Root Cause: [DESCRIPTION]
Fix Applied: [DESCRIPTION]
Service Credits: [CALCULATION]

We apologize for any inconvenience caused.
```

### Escalation Matrix

| Severity | Response Time | Escalation |
|----------|---------------|------------|
| Critical | 5 minutes | CTO, Head of Engineering |
| Major | 15 minutes | Engineering Lead |
| Minor | 1 hour | On-call Engineer |

### Contact Information

**Primary On-Call:** [Phone] [Email]
**Secondary On-Call:** [Phone] [Email]
**CTO:** [Phone] [Email]
**Stripe Support:** [Support Portal]
**Supabase Support:** [Support Portal]

### Monitoring Dashboards

- **Main Dashboard:** [URL]
- **API Metrics:** [URL]
- **Database Metrics:** [URL]
- **Payment Metrics:** [URL]
- **Status Page:** [URL]

### Common Issues and Solutions

#### Payment Processing Down
1. Check Stripe Connect API status
2. Verify webhook signatures
3. Check application logs for errors
4. Test payment intent creation manually

#### Database Connection Issues
1. Check connection pool status
2. Verify RLS policies
3. Check for long-running queries
4. Restart application if needed

#### Webhook Processing Failed
1. Check Stripe webhook logs
2. Verify webhook signature validation
3. Replay failed webhooks
4. Check application logs

#### High Error Rates
1. Check application logs
2. Verify external dependencies
3. Check for rate limiting
4. Scale up resources if needed

### Post-Incident Review

**Within 48 hours of resolution:**

1. **Incident Timeline**
   - Detection time
   - Response time
   - Resolution time
   - Communication timeline

2. **Impact Assessment**
   - Number of affected users
   - Financial impact
   - Reputation impact
   - Service credits issued

3. **Root Cause Analysis**
   - What happened?
   - Why did it happen?
   - What could have prevented it?

4. **Action Items**
   - Immediate fixes
   - Process improvements
   - Monitoring improvements
   - Documentation updates

5. **Follow-up**
   - Schedule review meeting
   - Assign action items
   - Set deadlines
   - Track progress

### Emergency Contacts

**24/7 On-Call:** +44 20 1234 5678
**Emergency Email:** emergency@stratusconnect.com
**Stripe Emergency:** [Emergency Contact]
**Hosting Provider:** [Emergency Contact]

---

**Remember:** 
- Communicate early and often
- Be transparent about what you know
- Focus on resolution, not blame
- Learn from every incident
- Update this runbook based on learnings

**There can be no doubt. When the lion is hungry, he eats.**
