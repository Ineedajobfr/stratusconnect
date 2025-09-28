# Demo Bots Runner Script - Beta Terminal Testing
# FCA Compliant Aviation Platform - Automated Demo Execution

param(
    [Parameter(Position=0)]
    [ValidateSet("video", "broker", "operator", "pilot", "full", "all")]
    [string]$TestType = "all",
    
    [switch]$Help
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = $White
    )
    Write-Host $Message -ForegroundColor $Color
}

function Show-Help {
    Write-ColorOutput "Demo Bots Runner - StratusConnect Aviation Platform" $Blue
    Write-Host ""
    Write-Host "Usage: .\run-demo-bots.ps1 [TestType]"
    Write-Host ""
    Write-Host "Test types:"
    Write-Host "  video    - Run video recording demo"
    Write-Host "  broker   - Run broker terminal demo"
    Write-Host "  operator - Run operator terminal demo"
    Write-Host "  pilot    - Run pilot terminal demo"
    Write-Host "  full     - Run full workflow demo"
    Write-Host "  all      - Run all demos (default)"
    Write-Host ""
    Write-Host "Environment variables required:"
    Write-Host "  STRATUS_URL"
    Write-Host "  SUPABASE_EVENTS_URL"
    Write-Host "  SUPABASE_URL"
    Write-Host "  SUPABASE_SERVICE_ROLE_KEY"
}

if ($Help) {
    Show-Help
    exit 0
}

Write-ColorOutput "🎬 Demo Bots Runner - StratusConnect Aviation Platform" $Blue
Write-Host "=================================================="

# Configuration
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$PlaywrightDir = Join-Path $ProjectRoot "demo-bots\playwright"

# Check if we're in the right directory
if (-not (Test-Path $PlaywrightDir)) {
    Write-ColorOutput "❌ Error: Playwright directory not found at $PlaywrightDir" $Red
    exit 1
}

# Function to check environment variables
function Test-EnvironmentVariables {
    Write-ColorOutput "🔍 Checking environment variables..." $Yellow
    
    $missingVars = @()
    
    if (-not $env:STRATUS_URL) { $missingVars += "STRATUS_URL" }
    if (-not $env:SUPABASE_EVENTS_URL) { $missingVars += "SUPABASE_EVENTS_URL" }
    if (-not $env:SUPABASE_URL) { $missingVars += "SUPABASE_URL" }
    if (-not $env:SUPABASE_SERVICE_ROLE_KEY) { $missingVars += "SUPABASE_SERVICE_ROLE_KEY" }
    
    if ($missingVars.Count -gt 0) {
        Write-ColorOutput "❌ Missing required environment variables: $($missingVars -join ', ')" $Red
        Write-Host ""
        Write-ColorOutput "💡 Set them with:" $Yellow
        Write-Host '$env:STRATUS_URL = "http://localhost:8080"'
        Write-Host '$env:SUPABASE_EVENTS_URL = "https://your-project.functions.supabase.co/events-recorder"'
        Write-Host '$env:SUPABASE_URL = "https://your-project.supabase.co"'
        Write-Host '$env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"'
        exit 1
    }
    
    Write-ColorOutput "✅ All environment variables set" $Green
}

# Function to install dependencies
function Install-Dependencies {
    Write-ColorOutput "📦 Installing dependencies..." $Yellow
    Set-Location $PlaywrightDir
    
    if (-not (Test-Path "node_modules")) {
        npm install
    } else {
        Write-ColorOutput "✅ Dependencies already installed" $Green
    }
    
    # Install Playwright browsers if not already installed
    try {
        $null = npx playwright --version 2>$null
        Write-ColorOutput "✅ Playwright browsers already installed" $Green
    } catch {
        Write-ColorOutput "🎭 Installing Playwright browsers..." $Yellow
        npx playwright install
    }
}

# Function to run tests
function Start-Tests {
    param([string]$Type)
    
    Write-ColorOutput "🧪 Running demo tests..." $Yellow
    Write-Host "Test type: $Type"
    
    Set-Location $PlaywrightDir
    
    switch ($Type) {
        "video" {
            Write-ColorOutput "🎥 Running video demo test..." $Blue
            npx playwright test demo-video.spec.ts --headed
        }
        "broker" {
            Write-ColorOutput "🏢 Running broker demo test..." $Blue
            npx playwright test broker.spec.ts
        }
        "operator" {
            Write-ColorOutput "✈️ Running operator demo test..." $Blue
            npx playwright test operator.spec.ts
        }
        "pilot" {
            Write-ColorOutput "👨‍✈️ Running pilot demo test..." $Blue
            npx playwright test pilot.spec.ts
        }
        "full" {
            Write-ColorOutput "🔄 Running full workflow test..." $Blue
            npx playwright test full-workflow.spec.ts
        }
        "all" {
            Write-ColorOutput "🎯 Running all demo tests..." $Blue
            npx playwright test
        }
        default {
            Write-ColorOutput "❌ Unknown test type: $Type" $Red
            Write-Host "Available types: video, broker, operator, pilot, full, all"
            exit 1
        }
    }
}

# Function to show results
function Show-Results {
    Write-ColorOutput "📊 Test Results Summary" $Yellow
    Write-Host "====================="
    
    Set-Location $PlaywrightDir
    
    if (Test-Path "test-results") {
        Write-ColorOutput "✅ Test results directory exists" $Green
        
        # Count test files
        $testCount = (Get-ChildItem "test-results" -Filter "*.png" -ErrorAction SilentlyContinue | Measure-Object).Count
        Write-Host "📸 Screenshots: $testCount"
        
        # Count videos
        if (Test-Path "test-results\videos") {
            $videoCount = (Get-ChildItem "test-results\videos" -Filter "*.webm" -ErrorAction SilentlyContinue | Measure-Object).Count
            Write-Host "🎥 Videos: $videoCount"
        }
        
        Write-Host ""
        Write-ColorOutput "📁 Results location: $PlaywrightDir\test-results\" $Blue
    } else {
        Write-ColorOutput "⚠️ No test results found" $Yellow
    }
    
    if (Test-Path "playwright-report") {
        Write-ColorOutput "📋 HTML Report: $PlaywrightDir\playwright-report\index.html" $Blue
    }
}

# Main execution
try {
    Write-ColorOutput "🚀 Starting demo bots execution..." $Blue
    Write-Host ""
    
    Test-EnvironmentVariables
    Install-Dependencies
    Start-Tests -Type $TestType
    Show-Results
    
    Write-Host ""
    Write-ColorOutput "🎉 Demo bots execution completed successfully!" $Green
    Write-ColorOutput "📋 Check the results in: $PlaywrightDir\test-results\" $Blue
} catch {
    Write-ColorOutput "❌ Error during execution: $($_.Exception.Message)" $Red
    exit 1
} finally {
    # Return to original directory
    Set-Location $PSScriptRoot
}
