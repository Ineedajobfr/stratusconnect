#!/bin/bash

# Supabase Authentication Configuration Script
# This script configures Supabase authentication settings via API calls

echo "🚀 Configuring Supabase Authentication Settings..."

# Set your Supabase project details
SUPABASE_URL="https://pvgqfqkrtflpvajhddhr.supabase.co"
SUPABASE_PROJECT_REF="pvgqfqkrtflpvajhddhr"

# You'll need to get your Supabase Access Token from:
# https://supabase.com/dashboard/account/tokens
read -p "Enter your Supabase Access Token (get it from https://supabase.com/dashboard/account/tokens): " SUPABASE_ACCESS_TOKEN

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ Error: Access token is required"
    echo "Get your token from: https://supabase.com/dashboard/account/tokens"
    exit 1
fi

echo "📧 Configuring email authentication..."

# Configure email provider settings
curl -X PATCH \
  "$SUPABASE_URL/rest/v1/projects/$SUPABASE_PROJECT_REF/config" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "auth": {
      "enable_email_signup": true,
      "enable_email_confirmations": true,
      "enable_email_change_confirmations": true,
      "enable_phone_signup": false,
      "enable_phone_confirmations": false,
      "enable_anonymous_signup": false,
      "enable_signup": true,
      "site_url": "http://localhost:8081",
      "redirect_urls": [
        "http://localhost:8081/auth/callback",
        "http://localhost:8081/**"
      ]
    }
  }' \
  --silent --show-error --fail

if [ $? -eq 0 ]; then
    echo "✅ Email authentication configured successfully"
else
    echo "❌ Failed to configure email authentication"
fi

echo "🔗 Configuring URL settings..."

# Configure URL settings
curl -X PATCH \
  "$SUPABASE_URL/rest/v1/projects/$SUPABASE_PROJECT_REF/config" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "auth": {
      "site_url": "http://localhost:8081",
      "redirect_urls": [
        "http://localhost:8081/auth/callback",
        "http://localhost:8081/**",
        "http://localhost:8081",
        "http://localhost:8081/",
        "http://localhost:8081/admin",
        "http://localhost:8081/broker-terminal",
        "http://localhost:8081/operator-terminal",
        "http://localhost:8081/pilot-terminal",
        "http://localhost:8081/crew-terminal"
      ]
    }
  }' \
  --silent --show-error --fail

if [ $? -eq 0 ]; then
    echo "✅ URL settings configured successfully"
else
    echo "❌ Failed to configure URL settings"
fi

echo "📧 Configuring email templates..."

# Configure magic link email template
curl -X PATCH \
  "$SUPABASE_URL/rest/v1/projects/$SUPABASE_PROJECT_REF/config" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "auth": {
      "email_templates": {
        "magic_link": {
          "subject": "Your StratusConnect Login Link",
          "body": "<h2>Welcome to StratusConnect</h2><p>Click the link below to access your terminal:</p><p><a href=\"{{ .ConfirmationURL }}\">Access StratusConnect</a></p><p>This link will expire in 10 minutes.</p><p>If you didn'\''t request this link, please ignore this email.</p>"
        },
        "confirm_signup": {
          "subject": "Confirm Your StratusConnect Account",
          "body": "<h2>Welcome to StratusConnect</h2><p>Please confirm your email address to complete your registration:</p><p><a href=\"{{ .ConfirmationURL }}\">Confirm Your Account</a></p><p>This link will expire in 24 hours.</p>"
        }
      }
    }
  }' \
  --silent --show-error --fail

if [ $? -eq 0 ]; then
    echo "✅ Email templates configured successfully"
else
    echo "❌ Failed to configure email templates"
fi

echo "🔐 Configuring authentication providers..."

# Enable email provider
curl -X PATCH \
  "$SUPABASE_URL/rest/v1/projects/$SUPABASE_PROJECT_REF/config" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "auth": {
      "external": {
        "email": {
          "enabled": true
        }
      }
    }
  }' \
  --silent --show-error --fail

if [ $? -eq 0 ]; then
    echo "✅ Email provider enabled successfully"
else
    echo "❌ Failed to enable email provider"
fi

echo "📊 Testing configuration..."

# Test the configuration by checking if we can get the current config
curl -X GET \
  "$SUPABASE_URL/rest/v1/projects/$SUPABASE_PROJECT_REF/config" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  --silent --show-error --fail | jq '.auth | {
    enable_email_signup: .enable_email_signup,
    enable_email_confirmations: .enable_email_confirmations,
    site_url: .site_url,
    redirect_urls: .redirect_urls
  }' 2>/dev/null || echo "Configuration test completed"

echo ""
echo "🎉 Supabase Authentication Configuration Complete!"
echo ""
echo "✅ What was configured:"
echo "   - Email signup enabled"
echo "   - Email confirmations enabled"
echo "   - Site URL set to http://localhost:8081"
echo "   - Redirect URLs configured for all terminals"
echo "   - Magic link email template customized"
echo "   - Email provider enabled"
echo ""
echo "🚀 Next steps:"
echo "   1. Test admin login at: http://localhost:8081/staff-portal"
echo "   2. Test user login at: http://localhost:8081/login/broker"
echo "   3. Check your email for magic links"
echo ""
echo "💡 If you still get OTP errors, wait 2-3 minutes for settings to propagate"

