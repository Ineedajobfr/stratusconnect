# Supabase Email Template Configuration Guide

This guide explains how to configure Supabase email templates for the Magic Link authentication system.

## Overview

The Magic Link authentication system uses Supabase's built-in email functionality to send secure login links. This guide covers:

1. **Email Template Configuration** - Customizing the magic link emails
2. **SMTP Setup** - Optional custom SMTP configuration
3. **Email Settings** - OTP expiry, rate limiting, etc.

## 1. Email Template Configuration

### Access Email Templates

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Select **Magic Link** template

### Customize Magic Link Email Template

Replace the default template with this custom template:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to StratusConnect</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: linear-gradient(135deg, #8b4513 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%);
            border-radius: 12px;
            padding: 40px;
            color: white;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #ff8c00;
            margin-bottom: 10px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #ff8c00;
        }
        .content {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #ff8c00, #ff6b00);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 16px rgba(255, 140, 0, 0.3);
            transition: all 0.3s ease;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 140, 0, 0.4);
        }
        .warning {
            background: rgba(255, 165, 0, 0.2);
            border-left: 4px solid #ff8c00;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            color: #ccc;
            font-size: 14px;
        }
        .security-info {
            background: rgba(0, 0, 0, 0.3);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .security-info h3 {
            color: #ff8c00;
            margin-bottom: 10px;
        }
        .security-info ul {
            margin: 0;
            padding-left: 20px;
        }
        .security-info li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">STRATUSCONNECT</div>
            <h1 class="title">Welcome to StratusConnect</h1>
        </div>
        
        <div class="content">
            <p>Dear {{ .Email }},</p>
            
            <p>We've received a request to {{ if .TokenHash }}sign in to{{ else }}create{{ end }} your StratusConnect account. Please use the secure link below to verify your email and access your account:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    {{ if .TokenHash }}Sign In to StratusConnect{{ else }}Verify Email & Create Account{{ end }}
                </a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Important Security Information:</strong>
                <ul>
                    <li>This link is valid for <strong>10 minutes</strong> only</li>
                    <li>This link can only be used <strong>once</strong></li>
                    <li>Do not share this link with anyone</li>
                    <li>If you didn't request this, please contact us immediately</li>
                </ul>
            </div>
            
            <div class="security-info">
                <h3>🛡️ Security Features</h3>
                <ul>
                    <li>Passwordless authentication for enhanced security</li>
                    <li>Magic links expire automatically</li>
                    <li>One-time use only</li>
                    <li>Encrypted transmission</li>
                </ul>
            </div>
            
            <p>If the link has expired, you can request a new one by visiting our signup portal.</p>
            
            <p>If you did not request this {{ if .TokenHash }}sign-in{{ else }}account creation{{ end }}, please contact us immediately at <a href="mailto:support@stratusconnect.com" style="color: #ff8c00;">support@stratusconnect.com</a>.</p>
            
            <p>Best regards,<br>
            <strong>The StratusConnect Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This email was sent from StratusConnect - The SAP system of private aviation</p>
            <p>© 2024 StratusConnect. All rights reserved.</p>
            <p>For support, contact us at <a href="mailto:support@stratusconnect.com" style="color: #ff8c00;">support@stratusconnect.com</a></p>
        </div>
    </div>
</body>
</html>
```

### Template Variables

The template uses these Supabase variables:
- `{{ .Email }}` - User's email address
- `{{ .ConfirmationURL }}` - The magic link URL
- `{{ .TokenHash }}` - Present for login, absent for signup

## 2. SMTP Configuration (Optional)

### Using Custom SMTP

If you want to use your own SMTP server instead of Supabase's default:

1. Go to **Authentication** → **Settings**
2. Scroll to **SMTP Settings**
3. Configure your SMTP provider:

```json
{
  "host": "smtp.your-provider.com",
  "port": 587,
  "user": "your-smtp-username",
  "pass": "your-smtp-password",
  "admin_email": "admin@stratusconnect.com",
  "sender_name": "StratusConnect"
}
```

### Recommended SMTP Providers

1. **SendGrid** - Reliable, good deliverability
2. **Mailgun** - Developer-friendly
3. **AWS SES** - Cost-effective for high volume
4. **Postmark** - Excellent deliverability

## 3. Email Settings Configuration

### OTP Expiry Settings

1. Go to **Authentication** → **Settings**
2. Find **Auth** section
3. Set **JWT expiry** to `600` (10 minutes)

### Rate Limiting

Configure rate limiting to prevent abuse:

1. Go to **Authentication** → **Settings**
2. Find **Rate Limiting** section
3. Set these values:
   - **Magic Link requests**: 5 per hour per email
   - **Password reset requests**: 3 per hour per email

## 4. Email Verification Flow

### Signup Flow
1. User enters email on signup page
2. Supabase sends magic link email
3. User clicks link → redirected to `/auth/callback`
4. System checks if user exists:
   - New user → redirect to `/upload-documents`
   - Existing user → check verification status

### Login Flow
1. User enters email on login page
2. Supabase sends magic link email
3. User clicks link → redirected to `/auth/callback`
4. System checks verification status:
   - `pending_documents` → `/upload-documents`
   - `pending_verification` → `/verification-pending`
   - `approved` → role-specific terminal
   - `rejected` → `/verification-rejected`

## 5. Testing Email Templates

### Test Magic Link Email

1. Use the Supabase Dashboard **Authentication** → **Users**
2. Click **Send Magic Link** for a test user
3. Check the email content and formatting

### Test in Development

1. Use the signup flow in your development environment
2. Check email delivery in Supabase logs
3. Verify link functionality

## 6. Monitoring and Analytics

### Email Delivery Monitoring

1. Go to **Authentication** → **Logs**
2. Monitor **Auth** events for email delivery
3. Check for failed deliveries or bounces

### Custom Analytics

Track email engagement:
- Open rates
- Click-through rates
- Conversion rates

## 7. Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check SMTP configuration
   - Verify domain authentication
   - Check rate limiting settings

2. **Magic links not working**
   - Verify redirect URL configuration
   - Check JWT expiry settings
   - Ensure proper URL encoding

3. **Email formatting issues**
   - Test HTML rendering
   - Check CSS compatibility
   - Verify template variables

### Debug Steps

1. Check Supabase logs for errors
2. Test with different email providers
3. Verify template syntax
4. Check browser developer tools for errors

## 8. Security Best Practices

1. **Rate Limiting**: Prevent abuse with appropriate limits
2. **Link Expiry**: Keep magic links short-lived (10 minutes)
3. **One-time Use**: Ensure links are single-use only
4. **HTTPS Only**: Use secure connections for all links
5. **Monitoring**: Track suspicious activity patterns

## 9. Environment Variables

Add these to your `.env` file for development:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Configuration (if using custom SMTP)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# reCAPTCHA (for signup/login forms)
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

## 10. Production Checklist

Before going live:

- [ ] Email templates tested and customized
- [ ] SMTP provider configured (if custom)
- [ ] Rate limiting configured
- [ ] OTP expiry set to 10 minutes
- [ ] Domain authentication verified
- [ ] Email deliverability tested
- [ ] Monitoring and logging enabled
- [ ] Security settings reviewed
- [ ] Backup email provider configured
- [ ] Support contact information updated

---

## Support

For issues with email configuration:

1. Check Supabase documentation
2. Review email provider logs
3. Contact Supabase support
4. Contact StratusConnect support at support@stratusconnect.com

---

*Last updated: January 2025*

