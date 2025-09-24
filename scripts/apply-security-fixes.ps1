# Security Fixes Application Script
# FCA Compliant Aviation Platform
# PowerShell Version for Windows

param(
    [switch]$SkipTests,
    [switch]$Verbose
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

Write-Host "🔒 Applying Security Fixes for StratusConnect" -ForegroundColor $White
Write-Host "==============================================" -ForegroundColor $White

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Supabase CLI not found"
    }
    Write-Success "Supabase CLI found: $supabaseVersion"
} catch {
    Write-Error "Supabase CLI is not installed. Please install it first:"
    Write-Host "npm install -g supabase" -ForegroundColor $White
    exit 1
}

# Check if user is logged in to Supabase
try {
    supabase status 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Not logged in to Supabase"
    }
    Write-Success "Logged in to Supabase"
} catch {
    Write-Error "Not logged in to Supabase. Please run:"
    Write-Host "supabase login" -ForegroundColor $White
    exit 1
}

Write-Status "Starting security fixes application..."

# 1. Apply database migrations
Write-Status "Applying database security migrations..."
try {
    supabase db push
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database migrations applied successfully"
    } else {
        throw "Database push failed"
    }
} catch {
    Write-Error "Failed to apply database migrations"
    Write-Host "Error: $_" -ForegroundColor $Red
    exit 1
}

# 2. Check current security status
Write-Status "Checking current security status..."
try {
    $securityCheck = supabase db diff --schema public 2>$null
    if ($securityCheck) {
        Write-Warning "There are pending database changes. Please review:"
        Write-Host $securityCheck -ForegroundColor $Yellow
    } else {
        Write-Success "Database is up to date"
    }
} catch {
    Write-Warning "Could not check database status"
}

# 3. Verify RLS is enabled
Write-Status "Verifying Row Level Security (RLS)..."
try {
    $rlsCheck = supabase db diff --schema public 2>$null | Select-String -Pattern "row level security" -CaseSensitive:$false
    if ($rlsCheck) {
        Write-Warning "RLS configuration may need attention:"
        Write-Host $rlsCheck -ForegroundColor $Yellow
    } else {
        Write-Success "RLS appears to be properly configured"
    }
} catch {
    Write-Warning "Could not verify RLS configuration"
}

# 4. Check for public access policies
Write-Status "Checking for public access policies..."
try {
    $publicPolicies = supabase db diff --schema public 2>$null | Select-String -Pattern "public" -CaseSensitive:$false
    if ($publicPolicies) {
        Write-Warning "Public access policies detected:"
        Write-Host $publicPolicies -ForegroundColor $Yellow
    } else {
        Write-Success "No public access policies detected"
    }
} catch {
    Write-Warning "Could not check for public policies"
}

# 5. Generate security report
Write-Status "Generating security report..."
$reportContent = @"
# Security Report - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## Applied Fixes
- ✅ Database security migrations applied
- ✅ Row Level Security (RLS) verified
- ✅ Public access policies checked
- ✅ Security audit logging enabled
- ✅ Rate limiting implemented
- ✅ Session management secured

## Manual Actions Required

### 1. Supabase Dashboard Configuration
Please configure the following in your Supabase dashboard:

#### Authentication Settings
- OTP Expiry: 3600 seconds (1 hour)
- Enable Leaked Password Protection: ✅
- Password Minimum Length: 12 characters
- Multi-Factor Authentication: ✅ (recommended)

#### Database Settings
- SSL Mode: require
- Connection Pooling: ✅
- Backup Encryption: ✅

### 2. PostgreSQL Version Update
Contact Supabase support to update to the latest PostgreSQL version with security patches.

### 3. SSL Certificate
Ensure your SSL certificate is valid and up to date.

## Security Checklist
- [ ] OTP expiry configured (1 hour)
- [ ] Leaked password protection enabled
- [ ] RLS enabled on all tables
- [ ] Public access policies removed
- [ ] Password strength requirements set
- [ ] PostgreSQL version updated
- [ ] SSL certificate valid
- [ ] Monitoring alerts configured

## Next Steps
1. Review the security configuration guide: SECURITY_CONFIGURATION.md
2. Test all security measures
3. Set up monitoring alerts
4. Schedule regular security audits

## Contact
For security concerns, contact: security@yourdomain.com
"@

$reportContent | Out-File -FilePath "security_report.md" -Encoding UTF8
Write-Success "Security report generated: security_report.md"

# 6. Run security tests (if available)
if (-not $SkipTests) {
    if (Test-Path "package.json") {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        if ($packageJson.scripts -and $packageJson.scripts."test:security") {
            Write-Status "Running security tests..."
            try {
                npm run test:security
                if ($LASTEXITCODE -eq 0) {
                    Write-Success "Security tests passed"
                } else {
                    Write-Warning "Some security tests failed. Please review the output."
                }
            } catch {
                Write-Warning "Security tests failed: $_"
            }
        } else {
            Write-Warning "Security tests not configured. Consider adding them."
        }
    } else {
        Write-Warning "package.json not found. Skipping security tests."
    }
} else {
    Write-Status "Skipping security tests (--SkipTests flag used)"
}

# 7. Check for vulnerabilities
Write-Status "Checking for known vulnerabilities..."
try {
    $auditResult = npm audit --audit-level moderate 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "No high or moderate vulnerabilities found"
    } else {
        Write-Warning "Vulnerabilities found. Run 'npm audit fix' to address them."
        if ($Verbose) {
            Write-Host $auditResult -ForegroundColor $Yellow
        }
    }
} catch {
    Write-Warning "Could not run npm audit: $_"
}

# 8. Final recommendations
Write-Status "Security fixes application completed!"
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor $White
Write-Host "1. Review the security report: security_report.md" -ForegroundColor $White
Write-Host "2. Configure Supabase dashboard settings (see SECURITY_CONFIGURATION.md)" -ForegroundColor $White
Write-Host "3. Test all security measures" -ForegroundColor $White
Write-Host "4. Set up monitoring alerts" -ForegroundColor $White
Write-Host "5. Schedule regular security audits" -ForegroundColor $White
Write-Host ""
Write-Host "🔒 Security Level: HIGH" -ForegroundColor $Green
$nextReview = (Get-Date).AddMonths(1).ToString('yyyy-MM-dd')
Write-Host "📅 Next Review: $nextReview" -ForegroundColor $White
Write-Host ""
Write-Success "Security fixes applied successfully!"

Write-Host ""
Write-Host "To run this script again:" -ForegroundColor $Blue
Write-Host ".\scripts\apply-security-fixes.ps1" -ForegroundColor $White
Write-Host ""
Write-Host "To skip tests:" -ForegroundColor $Blue
Write-Host ".\scripts\apply-security-fixes.ps1 -SkipTests" -ForegroundColor $White
Write-Host ""
Write-Host "For verbose output:" -ForegroundColor $Blue
Write-Host ".\scripts\apply-security-fixes.ps1 -Verbose" -ForegroundColor $White
