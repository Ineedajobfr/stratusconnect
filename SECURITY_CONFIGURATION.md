# Security Configuration Guide

## Critical Security Settings for Supabase Dashboard

### 1. Authentication Settings
Navigate to **Authentication > Settings** in your Supabase dashboard:

#### OTP Configuration
- **OTP Expiry**: Set to `3600` seconds (1 hour) - NOT longer
- **Enable Leaked Password Protection**: ✅ ENABLED
- **Password Minimum Length**: 12 characters
- **Password Requirements**: 
  - Uppercase letters
  - Lowercase letters  
  - Numbers
  - Special characters

#### Session Management
- **Session Timeout**: 60 minutes
- **Refresh Token Rotation**: ✅ ENABLED
- **Multi-Factor Authentication**: ✅ ENABLED (recommended)

### 2. Database Security Settings
Navigate to **Database > Settings**:

#### Row Level Security (RLS)
- ✅ Ensure RLS is enabled on ALL tables
- ✅ No public access policies
- ✅ All data access requires authentication

#### Connection Security
- **SSL Mode**: `require` (not `prefer`)
- **Connection Pooling**: ✅ ENABLED
- **Max Connections**: Set appropriate limit

### 3. API Security Settings
Navigate to **API > Settings**:

#### CORS Configuration
```json
{
  "allowed_origins": [
    "https://yourdomain.com",
    "https://www.yourdomain.com"
  ],
  "allowed_methods": ["GET", "POST", "PUT", "DELETE"],
  "allowed_headers": ["*"],
  "expose_headers": ["*"],
  "max_age": 86400
}
```

#### Rate Limiting
- **API Rate Limit**: 1000 requests per hour per user
- **Auth Rate Limit**: 10 attempts per minute per IP

### 4. Storage Security
Navigate to **Storage > Settings**:

#### Bucket Policies
- ✅ All buckets require authentication
- ✅ No public read access
- ✅ Signed URLs for temporary access only

### 5. Edge Functions Security
Navigate to **Edge Functions > Settings**:

#### Function Security
- ✅ All functions require authentication
- ✅ Rate limiting enabled
- ✅ Input validation required

## Security Checklist

### ✅ Completed
- [x] OTP expiry set to 1 hour
- [x] Leaked password protection enabled
- [x] RLS enabled on all tables
- [x] Public access policies removed
- [x] Password strength requirements implemented
- [x] Security audit logging added
- [x] Rate limiting implemented
- [x] Session management secured

### ⚠️ Requires Manual Configuration
- [ ] **PostgreSQL Version Update**: Contact Supabase support to update to latest PostgreSQL version
- [ ] **SSL Certificate**: Ensure valid SSL certificate is active
- [ ] **Backup Encryption**: Enable encrypted backups
- [ ] **Monitoring Alerts**: Set up security monitoring alerts

## Security Monitoring

### Daily Checks
1. Review security audit logs
2. Check for failed login attempts
3. Monitor API usage patterns
4. Verify RLS policies are active

### Weekly Checks
1. Review user access patterns
2. Check for suspicious activity
3. Verify backup integrity
4. Update security configurations if needed

### Monthly Checks
1. Full security audit
2. Review and rotate API keys
3. Update dependencies
4. Test disaster recovery procedures

## Emergency Response

### If Security Breach Detected
1. **Immediate**: Disable affected user accounts
2. **Within 1 hour**: Review audit logs
3. **Within 4 hours**: Notify affected users
4. **Within 24 hours**: Full security assessment

### Contact Information
- **Security Team**: security@yourdomain.com
- **Emergency**: +1-XXX-XXX-XXXX
- **Supabase Support**: support@supabase.com

## Compliance Notes

### FCA Compliance
- All financial data encrypted at rest
- Audit trail maintained for 7 years
- Data retention policies implemented
- User consent tracking enabled

### GDPR Compliance
- Data processing logs maintained
- User data export functionality
- Right to be forgotten implemented
- Privacy by design principles followed

## Testing Security

### Automated Tests
```bash
# Run security tests
npm run test:security

# Check for vulnerabilities
npm audit

# Test RLS policies
npm run test:rls
```

### Manual Testing
1. Test public access (should fail)
2. Test unauthenticated access (should fail)
3. Test cross-user data access (should fail)
4. Test rate limiting (should throttle)
5. Test session timeout (should expire)

## Security Updates

### Regular Updates
- **Weekly**: Security patches
- **Monthly**: Dependency updates
- **Quarterly**: Security audit
- **Annually**: Penetration testing

### Emergency Updates
- **Critical vulnerabilities**: Within 24 hours
- **High vulnerabilities**: Within 1 week
- **Medium vulnerabilities**: Within 1 month

---

**Last Updated**: January 15, 2025
**Next Review**: February 15, 2025
**Security Level**: HIGH
