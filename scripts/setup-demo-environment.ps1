# Demo Bots Environment Setup - Beta Terminal Testing
# FCA Compliant Aviation Platform - Environment Configuration

param(
    [string]$StratusUrl = "http://localhost:8080",
    [string]$SupabaseEventsUrl,
    [string]$SupabaseUrl,
    [string]$SupabaseServiceKey,
    [switch]$Help
)

function Show-Help {
    Write-Host "Demo Bots Environment Setup - StratusConnect Aviation Platform"
    Write-Host ""
    Write-Host "Usage: .\setup-demo-environment.ps1 [-StratusUrl <url>] [-SupabaseEventsUrl <url>] [-SupabaseUrl <url>] [-SupabaseServiceKey <key>] [-Help]"
    Write-Host ""
    Write-Host "Parameters:"
    Write-Host "  -StratusUrl           StratusConnect application URL (default: http://localhost:8080)"
    Write-Host "  -SupabaseEventsUrl    Supabase Edge Function URL for events recording"
    Write-Host "  -SupabaseUrl          Supabase project URL"
    Write-Host "  -SupabaseServiceKey   Supabase service role key"
    Write-Host "  -Help                 Show this help message"
    Write-Host ""
    Write-Host "This script sets up environment variables for demo bots testing."
}

if ($Help) {
    Show-Help
    exit 0
}

Write-Host "🔧 Demo Bots Environment Setup - StratusConnect Aviation Platform" -ForegroundColor Blue
Write-Host "============================================================="

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️ Running without administrator privileges. Environment variables will be set for current session only." -ForegroundColor Yellow
    Write-Host "For permanent environment variables, run PowerShell as Administrator." -ForegroundColor Yellow
    Write-Host ""
}

# Function to set environment variable
function Set-EnvironmentVariable {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Scope = "Process"
    )
    
    if ([string]::IsNullOrEmpty($Value)) {
        Write-Host "❌ $Name is required but not provided" -ForegroundColor Red
        return $false
    }
    
    try {
        if ($isAdmin) {
            [Environment]::SetEnvironmentVariable($Name, $Value, "Machine")
            [Environment]::SetEnvironmentVariable($Name, $Value, "User")
        }
        [Environment]::SetEnvironmentVariable($Name, $Value, $Scope)
        Set-Item -Path "env:$Name" -Value $Value
        Write-Host "✅ Set $Name" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Failed to set $Name : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to prompt for missing values
function Get-UserInput {
    param(
        [string]$Prompt,
        [string]$DefaultValue = ""
    )
    
    if ($DefaultValue) {
        $input = Read-Host "$Prompt [$DefaultValue]"
        if ([string]::IsNullOrEmpty($input)) {
            return $DefaultValue
        }
        return $input
    } else {
        return Read-Host $Prompt
    }
}

Write-Host "📝 Setting up environment variables..." -ForegroundColor Yellow
Write-Host ""

# Set StratusConnect URL
if (-not (Set-EnvironmentVariable -Name "STRATUS_URL" -Value $StratusUrl)) {
    $StratusUrl = Get-UserInput -Prompt "Enter StratusConnect URL" -DefaultValue "http://localhost:8080"
    Set-EnvironmentVariable -Name "STRATUS_URL" -Value $StratusUrl
}

# Set Supabase Events URL
if ([string]::IsNullOrEmpty($SupabaseEventsUrl)) {
    $SupabaseEventsUrl = Get-UserInput -Prompt "Enter Supabase Events URL (Edge Function)"
}
if (-not (Set-EnvironmentVariable -Name "SUPABASE_EVENTS_URL" -Value $SupabaseEventsUrl)) {
    exit 1
}

# Set Supabase URL
if ([string]::IsNullOrEmpty($SupabaseUrl)) {
    $SupabaseUrl = Get-UserInput -Prompt "Enter Supabase Project URL"
}
if (-not (Set-EnvironmentVariable -Name "SUPABASE_URL" -Value $SupabaseUrl)) {
    exit 1
}

# Set Supabase Service Key
if ([string]::IsNullOrEmpty($SupabaseServiceKey)) {
    $SupabaseServiceKey = Get-UserInput -Prompt "Enter Supabase Service Role Key"
}
if (-not (Set-EnvironmentVariable -Name "SUPABASE_SERVICE_ROLE_KEY" -Value $SupabaseServiceKey)) {
    exit 1
}

Write-Host ""
Write-Host "🎉 Environment Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Current Environment Variables:" -ForegroundColor Blue
Write-Host "  STRATUS_URL: $env:STRATUS_URL"
Write-Host "  SUPABASE_EVENTS_URL: $env:SUPABASE_EVENTS_URL"
Write-Host "  SUPABASE_URL: $env:SUPABASE_URL"
Write-Host "  SUPABASE_SERVICE_ROLE_KEY: $($env:SUPABASE_SERVICE_ROLE_KEY.Substring(0, [Math]::Min(20, $env:SUPABASE_SERVICE_ROLE_KEY.Length)))..."
Write-Host ""
Write-Host "🚀 You can now run demo bots:" -ForegroundColor Yellow
Write-Host "  .\scripts\run-demo-bots.ps1"
Write-Host ""

# Test the environment
Write-Host "🧪 Testing environment..." -ForegroundColor Yellow

$testResults = @()

# Test StratusConnect URL
try {
    $response = Invoke-WebRequest -Uri $env:STRATUS_URL -Method Head -TimeoutSec 10 -ErrorAction Stop
    $testResults += "✅ StratusConnect URL is accessible"
} catch {
    $testResults += "❌ StratusConnect URL is not accessible: $($_.Exception.Message)"
}

# Test Supabase Events URL
try {
    $testBody = @{
        actor_role = "test"
        action = "environment_test"
        payload = @{ timestamp = (Get-Date).ToString() }
        client_tz = "Europe/London"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri $env:SUPABASE_EVENTS_URL -Method Post -Body $testBody -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
    $testResults += "✅ Supabase Events URL is accessible"
} catch {
    $testResults += "❌ Supabase Events URL is not accessible: $($_.Exception.Message)"
}

Write-Host ""
foreach ($result in $testResults) {
    if ($result.StartsWith("✅")) {
        Write-Host $result -ForegroundColor Green
    } else {
        Write-Host $result -ForegroundColor Red
    }
}

Write-Host ""
if ($testResults -match "❌") {
    Write-Host "⚠️ Some tests failed. Please check your URLs and keys." -ForegroundColor Yellow
} else {
    Write-Host "🎉 All environment tests passed! Demo bots are ready to run." -ForegroundColor Green
}
