# ci/stop.ps1
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "Stopping FastAPI backend..."
docker compose down
Write-Host "All containers stopped."
