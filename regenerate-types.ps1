# Supabase Type Regeneration Script
# Run this to update your TypeScript types after migration

$PROJECT_ID = "pvgqfqkrtflpvajhddhr"
$OUTPUT_FILE = "src/integrations/supabase/types.ts"

Write-Host "🔄 Regenerating Supabase TypeScript types..." -ForegroundColor Cyan
Write-Host "Project ID: $PROJECT_ID" -ForegroundColor Yellow
Write-Host ""

# Try using local node_modules first
if (Test-Path ".\node_modules\.bin\supabase") {
    Write-Host "Using local Supabase CLI..." -ForegroundColor Green
    .\node_modules\.bin\supabase gen types typescript --project-id $PROJECT_ID > $OUTPUT_FILE
} else {
    Write-Host "Using npx..." -ForegroundColor Green
    npx --yes supabase@1.200.3 gen types typescript --project-id $PROJECT_ID > $OUTPUT_FILE
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Types regenerated successfully!" -ForegroundColor Green
    Write-Host "📄 Output: $OUTPUT_FILE" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎉 All TypeScript errors should now be resolved!" -ForegroundColor Green
} else {
    Write-Host "❌ Error regenerating types" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please try manually:" -ForegroundColor Yellow
    Write-Host "npx supabase gen types typescript --project-id $PROJECT_ID > $OUTPUT_FILE" -ForegroundColor White
}

