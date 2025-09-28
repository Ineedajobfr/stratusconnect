# Demo Bots Scheduler Setup - Beta Terminal Testing
# FCA Compliant Aviation Platform - Automated Demo Scheduling

param(
    [switch]$Remove,
    [switch]$Help
)

function Show-Help {
    Write-Host "Demo Bots Scheduler Setup - StratusConnect Aviation Platform"
    Write-Host ""
    Write-Host "Usage: .\setup-demo-scheduler.ps1 [-Remove] [-Help]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Remove    Remove existing scheduled tasks"
    Write-Host "  -Help      Show this help message"
    Write-Host ""
    Write-Host "This script creates Windows Task Scheduler tasks to run demo bots automatically."
}

if ($Help) {
    Show-Help
    exit 0
}

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires administrator privileges to create scheduled tasks." -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$DemoRunnerScript = Join-Path $ScriptDir "run-demo-bots.ps1"

if ($Remove) {
    Write-Host "🗑️ Removing existing demo bot scheduled tasks..." -ForegroundColor Yellow
    
    # Remove existing tasks
    $taskNames = @(
        "StratusConnect-DemoBots-Hourly",
        "StratusConnect-DemoBots-Daily",
        "StratusConnect-DemoBots-Weekly"
    )
    
    foreach ($taskName in $taskNames) {
        try {
            $task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
            if ($task) {
                Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
                Write-Host "✅ Removed task: $taskName" -ForegroundColor Green
            }
        } catch {
            Write-Host "⚠️ Could not remove task: $taskName" -ForegroundColor Yellow
        }
    }
    
    Write-Host "🎉 Demo bot scheduled tasks removed!" -ForegroundColor Green
    exit 0
}

Write-Host "🎬 Setting up Demo Bots Scheduler - StratusConnect Aviation Platform" -ForegroundColor Blue
Write-Host "================================================================="

# Create action for running the demo script
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$DemoRunnerScript`""

# Create trigger for hourly execution (every 2 hours during business hours)
$hourlyTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 2) -RepetitionDuration (New-TimeSpan -Days 1)

# Create trigger for daily execution at 2 AM
$dailyTrigger = New-ScheduledTaskTrigger -Daily -At 2:00AM

# Create trigger for weekly execution on Monday at 9 AM
$weeklyTrigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 9:00AM

# Create settings
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable

# Create principal (run as SYSTEM with highest privileges)
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Write-Host "📅 Creating scheduled tasks..." -ForegroundColor Yellow

try {
    # Create hourly task
    Register-ScheduledTask -TaskName "StratusConnect-DemoBots-Hourly" -Action $action -Trigger $hourlyTrigger -Settings $settings -Principal $principal -Description "Run StratusConnect Demo Bots every 2 hours during business hours"
    Write-Host "✅ Created hourly demo task" -ForegroundColor Green
    
    # Create daily task
    Register-ScheduledTask -TaskName "StratusConnect-DemoBots-Daily" -Action $action -Trigger $dailyTrigger -Settings $settings -Principal $principal -Description "Run StratusConnect Demo Bots daily at 2 AM"
    Write-Host "✅ Created daily demo task" -ForegroundColor Green
    
    # Create weekly task
    Register-ScheduledTask -TaskName "StratusConnect-DemoBots-Weekly" -Action $action -Trigger $weeklyTrigger -Settings $settings -Principal $principal -Description "Run StratusConnect Demo Bots weekly on Monday at 9 AM"
    Write-Host "✅ Created weekly demo task" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🎉 Demo Bots Scheduler Setup Complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Created Tasks:" -ForegroundColor Blue
    Write-Host "  • StratusConnect-DemoBots-Hourly  - Every 2 hours during business hours"
    Write-Host "  • StratusConnect-DemoBots-Daily   - Daily at 2:00 AM"
    Write-Host "  • StratusConnect-DemoBots-Weekly  - Weekly on Monday at 9:00 AM"
    Write-Host ""
    Write-Host "🔧 To manage tasks:" -ForegroundColor Yellow
    Write-Host "  • Open Task Scheduler (taskschd.msc)"
    Write-Host "  • Look for 'StratusConnect-DemoBots-*' tasks"
    Write-Host "  • Run this script with -Remove to delete tasks"
    Write-Host ""
    Write-Host "⚠️ Remember to set environment variables before tasks run:" -ForegroundColor Yellow
    Write-Host "  • STRATUS_URL"
    Write-Host "  • SUPABASE_EVENTS_URL"
    Write-Host "  • SUPABASE_URL"
    Write-Host "  • SUPABASE_SERVICE_ROLE_KEY"
    
} catch {
    Write-Host "❌ Error creating scheduled tasks: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
