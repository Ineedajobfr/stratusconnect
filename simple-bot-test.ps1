# STRATUSCONNECT SIMPLE BOT TESTING SYSTEM
# Simulates real users testing all terminals

param(
    [int]$BotCount = 25,
    [string]$BaseUrl = "http://localhost:8082"
)

Write-Host "🎯 STRATUSCONNECT BOT TESTING SYSTEM" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "🤖 Deploying $BotCount bots to test $BaseUrl" -ForegroundColor Yellow
Write-Host "⏰ Started at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Yellow
Write-Host ""

# Terminal definitions
$Terminals = @(
    @{ Path = "/"; Name = "Home Page" },
    @{ Path = "/demo/broker"; Name = "Demo Broker Terminal" },
    @{ Path = "/demo/operator"; Name = "Demo Operator Terminal" },
    @{ Path = "/demo/pilot"; Name = "Demo Pilot Terminal" },
    @{ Path = "/demo/crew"; Name = "Demo Crew Terminal" },
    @{ Path = "/beta/broker"; Name = "Beta Broker Terminal" },
    @{ Path = "/beta/operator"; Name = "Beta Operator Terminal" },
    @{ Path = "/beta/pilot"; Name = "Beta Pilot Terminal" },
    @{ Path = "/beta/crew"; Name = "Beta Crew Terminal" }
)

# Results tracking
$Results = @{
    TotalBots = $BotCount
    StartTime = Get-Date
    BotResults = @()
    Summary = @{}
}

# Bot function
function Test-Bot {
    param(
        [int]$BotId,
        [string]$BaseUrl,
        [array]$Terminals
    )
    
    $BotResults = @{
        BotId = $BotId
        TerminalTests = @()
        Errors = @()
        StartTime = Get-Date
    }
    
    Write-Host "🚀 Bot $BotId`: Starting test suite..." -ForegroundColor Green
    
    foreach ($Terminal in $Terminals) {
        $TestStart = Get-Date
        
        try {
            Write-Host "🔍 Bot $BotId`: Testing $($Terminal.Name)..." -ForegroundColor Yellow
            
            $Response = Invoke-WebRequest -Uri "$BaseUrl$($Terminal.Path)" -TimeoutSec 30 -UseBasicParsing
            
            $TestEnd = Get-Date
            $LoadTime = ($TestEnd - $TestStart).TotalMilliseconds
            
            # Analyze response
            $IsSuccess = $Response.StatusCode -eq 200
            $HasContent = $Response.Content.Length -gt 1000
            $HasStratusContent = $Response.Content -match "stratus|terminal|broker|pilot|operator|crew"
            
            $TestResult = @{
                Terminal = $Terminal.Name
                Path = $Terminal.Path
                Success = $IsSuccess -and $HasContent -and $HasStratusContent
                StatusCode = $Response.StatusCode
                LoadTime = [math]::Round($LoadTime)
                ContentLength = $Response.Content.Length
                HasStratusContent = $HasStratusContent
                Timestamp = Get-Date
            }
            
            $BotResults.TerminalTests += $TestResult
            
            if ($TestResult.Success) {
                $LoadTimeStr = $LoadTime.ToString('F0')
                $ContentStr = $Response.Content.Length
                Write-Host "✅ Bot $BotId`: $($Terminal.Name) - SUCCESS (${LoadTimeStr}ms, ${ContentStr} bytes)" -ForegroundColor Green
            } else {
                $StatusStr = $Response.StatusCode
                $ContentStr = $Response.Content.Length
                Write-Host "❌ Bot $BotId`: $($Terminal.Name) - FAILED (Status: ${StatusStr}, Content: ${ContentStr} bytes)" -ForegroundColor Red
            }
            
        } catch {
            $TestEnd = Get-Date
            $LoadTime = ($TestEnd - $TestStart).TotalMilliseconds
            
            Write-Host "❌ Bot $BotId`: $($Terminal.Name) - ERROR - $($_.Exception.Message)" -ForegroundColor Red
            
            $TestResult = @{
                Terminal = $Terminal.Name
                Path = $Terminal.Path
                Success = $false
                Error = $_.Exception.Message
                LoadTime = [math]::Round($LoadTime)
                Timestamp = Get-Date
            }
            
            $BotResults.TerminalTests += $TestResult
            $BotResults.Errors += @{
                Terminal = $Terminal.Name
                Path = $Terminal.Path
                Error = $_.Exception.Message
                Timestamp = Get-Date
            }
        }
        
        # Random delay between requests (1-3 seconds)
        $Delay = Get-Random -Minimum 1000 -Maximum 3000
        Start-Sleep -Milliseconds $Delay
    }
    
    $TotalTime = (Get-Date) - $BotResults.StartTime
    $SuccessCount = ($BotResults.TerminalTests | Where-Object { $_.Success }).Count
    $SuccessRate = $SuccessCount / $BotResults.TerminalTests.Count
    $SuccessRateStr = $SuccessRate.ToString('P1')
    $TotalTimeStr = $TotalTime.TotalSeconds.ToString('F1')
    
    Write-Host "🏁 Bot $BotId`: Test complete - ${SuccessRateStr} success rate (${TotalTimeStr}s)" -ForegroundColor Cyan
    
    return $BotResults
}

# Run bots in batches
Write-Host "✅ Created $BotCount bots" -ForegroundColor Green
Write-Host ""

$BatchSize = 5
for ($i = 1; $i -le $BotCount; $i += $BatchSize) {
    $BatchEnd = [math]::Min($i + $BatchSize - 1, $BotCount)
    $Batch = $i..$BatchEnd
    
    Write-Host "🚀 Running batch $([math]::Ceiling($i / $BatchSize))/$([math]::Ceiling($BotCount / $BatchSize)) (Bots $i-$BatchEnd)" -ForegroundColor Magenta
    
    $BatchJobs = @()
    foreach ($BotId in $Batch) {
        $Job = Start-Job -ScriptBlock ${function:Test-Bot} -ArgumentList $BotId, $BaseUrl, $Terminals
        $BatchJobs += $Job
    }
    
    # Wait for batch to complete
    $BatchJobs | Wait-Job | Out-Null
    
    # Collect results
    foreach ($Job in $BatchJobs) {
        $BotResult = Receive-Job -Job $Job
        $Results.BotResults += $BotResult
        Remove-Job -Job $Job
    }
    
    # Brief pause between batches
    if ($i + $BatchSize -le $BotCount) {
        Write-Host "⏸️  Pausing between batches..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

# Generate summary
$AllTests = $Results.BotResults | ForEach-Object { $_.TerminalTests } | ForEach-Object { $_ }
$AllErrors = $Results.BotResults | ForEach-Object { $_.Errors } | ForEach-Object { $_ }

$TerminalStats = @{}
$AllTests | ForEach-Object {
    if (-not $TerminalStats.ContainsKey($_.Terminal)) {
        $TerminalStats[$_.Terminal] = @{
            Total = 0
            Successful = 0
            AvgLoadTime = 0
            AvgContentLength = 0
            StatusCodes = @{}
        }
    }
    
    $TerminalStats[$_.Terminal].Total++
    if ($_.Success) { $TerminalStats[$_.Terminal].Successful++ }
    $TerminalStats[$_.Terminal].AvgLoadTime += $_.LoadTime
    $TerminalStats[$_.Terminal].AvgContentLength += $_.ContentLength
    
    $Status = if ($_.StatusCode) { $_.StatusCode.ToString() } else { "error" }
    if (-not $TerminalStats[$_.Terminal].StatusCodes.ContainsKey($Status)) {
        $TerminalStats[$_.Terminal].StatusCodes[$Status] = 0
    }
    $TerminalStats[$_.Terminal].StatusCodes[$Status]++
}

# Calculate averages
$TerminalStats.Keys | ForEach-Object {
    $Terminal = $_
    $TerminalStats[$Terminal].AvgLoadTime = [math]::Round($TerminalStats[$Terminal].AvgLoadTime / $TerminalStats[$Terminal].Total)
    $TerminalStats[$Terminal].AvgContentLength = [math]::Round($TerminalStats[$Terminal].AvgContentLength / $TerminalStats[$Terminal].Total)
    $TerminalStats[$Terminal].SuccessRate = $TerminalStats[$Terminal].Successful / $TerminalStats[$Terminal].Total
}

$TotalTime = (Get-Date) - $Results.StartTime
$Results.Summary = @{
    TotalTests = $AllTests.Count
    SuccessfulTests = ($AllTests | Where-Object { $_.Success }).Count
    FailedTests = ($AllTests | Where-Object { -not $_.Success }).Count
    TotalErrors = $AllErrors.Count
    OverallSuccessRate = ($AllTests | Where-Object { $_.Success }).Count / $AllTests.Count
    TerminalStats = $TerminalStats
    TotalTime = $TotalTime
    AvgLoadTime = ($AllTests | Measure-Object -Property LoadTime -Average).Average
    RequestsPerSecond = $AllTests.Count / $TotalTime.TotalSeconds
}

# Print results
Write-Host ""
Write-Host "📊 BOT TESTING RESULTS" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host "🤖 Total Bots: $($Results.Summary.TotalTests / 9)" -ForegroundColor White
Write-Host "🧪 Total Tests: $($Results.Summary.TotalTests)" -ForegroundColor White
Write-Host "✅ Successful: $($Results.Summary.SuccessfulTests)" -ForegroundColor White
Write-Host "❌ Failed: $($Results.Summary.FailedTests)" -ForegroundColor White
Write-Host "📈 Success Rate: $($Results.Summary.OverallSuccessRate.ToString('P1'))" -ForegroundColor White
Write-Host "⏱️  Average Load Time: $($Results.Summary.AvgLoadTime.ToString('F0'))ms" -ForegroundColor White
Write-Host "🕐 Total Test Time: $($Results.Summary.TotalTime.TotalSeconds.ToString('F1'))s" -ForegroundColor White
Write-Host "📊 Requests/Second: $($Results.Summary.RequestsPerSecond.ToString('F1'))" -ForegroundColor White
Write-Host ""

Write-Host "📋 TERMINAL PERFORMANCE:" -ForegroundColor Yellow
$TerminalStats.Keys | ForEach-Object {
    $Terminal = $_
    $Stats = $TerminalStats[$Terminal]
    Write-Host "   $Terminal`:" -ForegroundColor White
    Write-Host "     Success Rate: $($Stats.SuccessRate.ToString('P1'))" -ForegroundColor White
    Write-Host "     Avg Load Time: $($Stats.AvgLoadTime)ms" -ForegroundColor White
    Write-Host "     Avg Content: $($Stats.AvgContentLength) bytes" -ForegroundColor White
    Write-Host "     Tests: $($Stats.Successful)/$($Stats.Total)" -ForegroundColor White
    Write-Host "     Status Codes: $($Stats.StatusCodes | ConvertTo-Json -Compress)" -ForegroundColor White
}

if ($Results.Summary.TotalErrors -gt 0) {
    Write-Host ""
    Write-Host "❌ ERROR SUMMARY:" -ForegroundColor Red
    $ErrorTypes = @{}
    $AllErrors | ForEach-Object {
        $Type = $_.Error.Split(':')[0]
        if (-not $ErrorTypes.ContainsKey($Type)) {
            $ErrorTypes[$Type] = 0
        }
        $ErrorTypes[$Type]++
    }
    $ErrorTypes.Keys | ForEach-Object {
        Write-Host "   $_`: $($ErrorTypes[$_]) occurrences" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "🎯 STRESS TEST COMPLETE!" -ForegroundColor Green
Write-Host "   StratusConnect handled $($Results.Summary.TotalTests) concurrent requests" -ForegroundColor White
Write-Host "   with $($Results.Summary.OverallSuccessRate.ToString('P1')) success rate" -ForegroundColor White
Write-Host "   at $($Results.Summary.RequestsPerSecond.ToString('F1')) requests/second" -ForegroundColor White

if ($Results.Summary.OverallSuccessRate -gt 0.95) {
    Write-Host "🏆 EXCELLENT: System handled the load very well!" -ForegroundColor Green
} elseif ($Results.Summary.OverallSuccessRate -gt 0.8) {
    Write-Host "✅ GOOD: System handled the load well with minor issues" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  NEEDS ATTENTION: System struggled with the load" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Bot testing complete! Check the results above." -ForegroundColor Cyan





