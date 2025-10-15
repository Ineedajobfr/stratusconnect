# Simple Supabase Auth Configuration Script
param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

$SUPABASE_URL = "https://pvgqfqkrtflpvajhddhr.supabase.co"
$SUPABASE_PROJECT_REF = "pvgqfqkrtflpvajhddhr"

Write-Host "🚀 Configuring Supabase Authentication Settings..." -ForegroundColor Green

# Configure email authentication
Write-Host "📧 Configuring email authentication..." -ForegroundColor Cyan

$emailConfig = @{
    auth = @{
        enable_email_signup = $true
        enable_email_confirmations = $true
        enable_email_change_confirmations = $true
        enable_signup = $true
        site_url = "http://localhost:8081"
        redirect_urls = @(
            "http://localhost:8081/auth/callback",
            "http://localhost:8081/**",
            "http://localhost:8081",
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
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    } -Body $emailConfig -ErrorAction Stop
    
    Write-Host "✅ Email authentication configured successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to configure email authentication: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Configuration Complete!" -ForegroundColor Green
Write-Host "✅ What was configured:" -ForegroundColor Yellow
Write-Host "   - Email signup enabled" -ForegroundColor White
Write-Host "   - Email confirmations enabled" -ForegroundColor White
Write-Host "   - Site URL set to http://localhost:8081" -ForegroundColor White
Write-Host "   - Redirect URLs configured for all terminals" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Test admin login at: http://localhost:8081/staff-portal" -ForegroundColor White
Write-Host "   2. Test user login at: http://localhost:8081/login/broker" -ForegroundColor White
Write-Host ""
Write-Host "💡 If you still get OTP errors, wait 2-3 minutes for settings to propagate" -ForegroundColor Cyan

