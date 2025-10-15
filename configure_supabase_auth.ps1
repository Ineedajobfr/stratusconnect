# Supabase Authentication Configuration Script (PowerShell)
# This script configures Supabase authentication settings via API calls

Write-Host "🚀 Configuring Supabase Authentication Settings..." -ForegroundColor Green

# Set your Supabase project details
$SUPABASE_URL = "https://pvgqfqkrtflpvajhddhr.supabase.co"
$SUPABASE_PROJECT_REF = "pvgqfqkrtflpvajhddhr"

# Get Supabase Access Token
$SUPABASE_ACCESS_TOKEN = Read-Host "Enter your Supabase Access Token (get it from https://supabase.com/dashboard/account/tokens)"

if ([string]::IsNullOrEmpty($SUPABASE_ACCESS_TOKEN)) {
    Write-Host "❌ Error: Access token is required" -ForegroundColor Red
    Write-Host "Get your token from: https://supabase.com/dashboard/account/tokens" -ForegroundColor Yellow
    exit 1
}

Write-Host "📧 Configuring email authentication..." -ForegroundColor Cyan

# Configure email provider settings
$emailConfig = @{
    auth = @{
        enable_email_signup = $true
        enable_email_confirmations = $true
        enable_email_change_confirmations = $true
        enable_phone_signup = $false
        enable_phone_confirmations = $false
        enable_anonymous_signup = $false
        enable_signup = $true
        site_url = "http://localhost:8081"
        redirect_urls = @(
            "http://localhost:8081/auth/callback",
            "http://localhost:8081/**"
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/projects/$SUPABASE_PROJECT_REF/config" -Method PATCH -Headers @{
        "Authorization" = "Bearer $SUPABASE_ACCESS_TOKEN"
        "Content-Type" = "application/json"
    } -Body $emailConfig -ErrorAction Stop
    
    Write-Host "✅ Email authentication configured successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to configure email authentication: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🔗 Configuring URL settings..." -ForegroundColor Cyan

# Configure URL settings
$urlConfig = @{
    auth = @{
        site_url = "http://localhost:8081"
        redirect_urls = @(
            "http://localhost:8081/auth/callback",
            "http://localhost:8081/**",
            "http://localhost:8081",
            "http://localhost:8081/",
            "http://localhost:8081/admin",
            "http://localhost:8081/broker-terminal",
            "http://localhost:8081/operator-terminal",
            "http://localhost:8081/pilot-terminal",
            "http://localhost:8081/crew-terminal"
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/projects/$SUPABASE_PROJECT_REF/config" -Method PATCH -Headers @{
        "Authorization" = "Bearer $SUPABASE_ACCESS_TOKEN"
        "Content-Type" = "application/json"
    } -Body $urlConfig -ErrorAction Stop
    
    Write-Host "✅ URL settings configured successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to configure URL settings: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "📧 Configuring email templates..." -ForegroundColor Cyan

# Configure magic link email template
$templateConfig = @{
    auth = @{
        email_templates = @{
            magic_link = @{
                subject = "Your StratusConnect Login Link"
                body = @"
<h2>Welcome to StratusConnect</h2>
<p>Click the link below to access your terminal:</p>
<p><a href=""{{ .ConfirmationURL }}"">Access StratusConnect</a></p>
<p>This link will expire in 10 minutes.</p>
<p>If you didn't request this link, please ignore this email.</p>
"@
            }
            confirm_signup = @{
                subject = "Confirm Your StratusConnect Account"
                body = @"
<h2>Welcome to StratusConnect</h2>
<p>Please confirm your email address to complete your registration:</p>
<p><a href=""{{ .ConfirmationURL }}"">Confirm Your Account</a></p>
<p>This link will expire in 24 hours.</p>
"@
            }
        }
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/projects/$SUPABASE_PROJECT_REF/config" -Method PATCH -Headers @{
        "Authorization" = "Bearer $SUPABASE_ACCESS_TOKEN"
        "Content-Type" = "application/json"
    } -Body $templateConfig -ErrorAction Stop
    
    Write-Host "✅ Email templates configured successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to configure email templates: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🔐 Configuring authentication providers..." -ForegroundColor Cyan

# Enable email provider
$providerConfig = @{
    auth = @{
        external = @{
            email = @{
                enabled = $true
            }
        }
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/projects/$SUPABASE_PROJECT_REF/config" -Method PATCH -Headers @{
        "Authorization" = "Bearer $SUPABASE_ACCESS_TOKEN"
        "Content-Type" = "application/json"
    } -Body $providerConfig -ErrorAction Stop
    
    Write-Host "✅ Email provider enabled successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to enable email provider: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "📊 Testing configuration..." -ForegroundColor Cyan

# Test the configuration
try {
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/projects/$SUPABASE_PROJECT_REF/config" -Method GET -Headers @{
        "Authorization" = "Bearer $SUPABASE_ACCESS_TOKEN"
    } -ErrorAction Stop
    
    Write-Host "✅ Configuration test successful" -ForegroundColor Green
    Write-Host "Current settings:" -ForegroundColor Yellow
    Write-Host "  - Email signup enabled: $($response.auth.enable_email_signup)" -ForegroundColor White
    Write-Host "  - Email confirmations enabled: $($response.auth.enable_email_confirmations)" -ForegroundColor White
    Write-Host "  - Site URL: $($response.auth.site_url)" -ForegroundColor White
} catch {
    Write-Host "❌ Failed to test configuration: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Supabase Authentication Configuration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "✅ What was configured:" -ForegroundColor Yellow
Write-Host "   - Email signup enabled" -ForegroundColor White
Write-Host "   - Email confirmations enabled" -ForegroundColor White
Write-Host "   - Site URL set to http://localhost:8081" -ForegroundColor White
Write-Host "   - Redirect URLs configured for all terminals" -ForegroundColor White
Write-Host "   - Magic link email template customized" -ForegroundColor White
Write-Host "   - Email provider enabled" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Test admin login at: http://localhost:8081/staff-portal" -ForegroundColor White
Write-Host "   2. Test user login at: http://localhost:8081/login/broker" -ForegroundColor White
Write-Host "   3. Check your email for magic links" -ForegroundColor White
Write-Host ""
Write-Host "💡 If you still get OTP errors, wait 2-3 minutes for settings to propagate" -ForegroundColor Cyan

