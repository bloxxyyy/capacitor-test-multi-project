$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "Starting FastAPI backend..."
docker compose up --build -d
Write-Host "FastAPI backend is running at http://localhost:8000"
