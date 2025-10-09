# BASIC STRATUSCONNECT BOT TEST
# Simple bot testing system without emojis

param(
    [int]$BotCount = 10,
    [string]$BaseUrl = "http://localhost:8082"
)

Write-Host "STRATUSCONNECT BOT TEST" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host "Testing with $BotCount bots" -ForegroundColor Yellow
Write-Host "URL: $BaseUrl" -ForegroundColor Yellow
Write-Host ""

$Terminals = @(
    "/",
    "/demo/broker",
    "/demo/operator", 
    "/demo/pilot",
    "/demo/crew",
    "/beta/broker",
    "/beta/operator",
    "/beta/pilot",
    "/beta/crew"
)

$Results = @{
    TotalTests = 0
    SuccessfulTests = 0
    FailedTests = 0
    StartTime = Get-Date
}

Write-Host "Starting bot tests..." -ForegroundColor Green

for ($BotId = 1; $BotId -le $BotCount; $BotId++) {
    Write-Host "Bot $BotId starting..." -ForegroundColor Yellow
    
    foreach ($Terminal in $Terminals) {
        $Results.TotalTests++
        
        try {
            $Response = Invoke-WebRequest -Uri "$BaseUrl$Terminal" -TimeoutSec 15 -UseBasicParsing
            
            if ($Response.StatusCode -eq 200) {
                $Results.SuccessfulTests++
                Write-Host "  SUCCESS: $Terminal - Status 200" -ForegroundColor Green
            } else {
                $Results.FailedTests++
                Write-Host "  FAILED: $Terminal - Status $($Response.StatusCode)" -ForegroundColor Red
            }
        } catch {
            $Results.FailedTests++
            Write-Host "  ERROR: $Terminal - $($_.Exception.Message)" -ForegroundColor Red
        }
        
        Start-Sleep -Milliseconds 500
    }
    
    Write-Host "Bot $BotId complete" -ForegroundColor Cyan
    Write-Host ""
}

$TotalTime = (Get-Date) - $Results.StartTime
$SuccessRate = $Results.SuccessfulTests / $Results.TotalTests

Write-Host "RESULTS" -ForegroundColor Magenta
Write-Host "=======" -ForegroundColor Magenta
Write-Host "Total Tests: $($Results.TotalTests)" -ForegroundColor White
Write-Host "Successful: $($Results.SuccessfulTests)" -ForegroundColor White
Write-Host "Failed: $($Results.FailedTests)" -ForegroundColor White
Write-Host "Success Rate: $($SuccessRate.ToString('P1'))" -ForegroundColor White
Write-Host "Total Time: $($TotalTime.TotalSeconds.ToString('F1'))s" -ForegroundColor White
Write-Host ""

if ($SuccessRate -gt 0.95) {
    Write-Host "EXCELLENT: System handled the load very well!" -ForegroundColor Green
} elseif ($SuccessRate -gt 0.8) {
    Write-Host "GOOD: System handled the load well!" -ForegroundColor Yellow
} else {
    Write-Host "NEEDS ATTENTION: System struggled with the load" -ForegroundColor Red
}

Write-Host ""
Write-Host "Bot testing complete!" -ForegroundColor Cyan


