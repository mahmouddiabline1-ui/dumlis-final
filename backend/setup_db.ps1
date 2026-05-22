# DUMLIS Database Setup Script
param(
    [string]$PgPassword = "",
    [string]$DbPassword = "dumlis_pass",
    [string]$DbUser     = "dumlis_user",
    [string]$DbName     = "dumlis_db",
    [string]$DbHost     = "localhost",
    [string]$DbPort     = "5432",
    [int]$Students      = 500,
    [switch]$Clear
)

$PSQL   = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$PYTHON = "D:\desktop\dumlis\.venv\Scripts\python.exe"

Write-Host "Setting up PostgreSQL database..." -ForegroundColor Cyan

if ($PgPassword -ne "") {
    $env:PGPASSWORD = $PgPassword
}

# Create user (ignore if already exists)
$createUser = "DO `$`$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DbUser') THEN CREATE USER $DbUser WITH PASSWORD '$DbPassword'; END IF; END `$`$;"
& $PSQL -U postgres -h $DbHost -p $DbPort -c $createUser 2>&1

# Create database (ignore if already exists)
$checkDb = "SELECT 'CREATE DATABASE $DbName OWNER $DbUser' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DbName')"
& $PSQL -U postgres -h $DbHost -p $DbPort -c $checkDb 2>&1 | ForEach-Object {
    if ($_ -match "CREATE DATABASE") {
        & $PSQL -U postgres -h $DbHost -p $DbPort -c "CREATE DATABASE $DbName OWNER $DbUser" 2>&1
    }
}

Write-Host "Database ready." -ForegroundColor Green

# Update .env
$envPath = Join-Path $PSScriptRoot ".env"
$dbUrl = "postgresql://${DbUser}:${DbPassword}@${DbHost}:${DbPort}/${DbName}"
(Get-Content $envPath) -replace "DATABASE_URL=.*", "DATABASE_URL=$dbUrl" | Set-Content $envPath
Write-Host ".env updated: $dbUrl" -ForegroundColor Green

# Run Alembic migration
Write-Host "Running Alembic migration..." -ForegroundColor Cyan
& $PYTHON -m alembic upgrade head
if ($LASTEXITCODE -ne 0) {
    Write-Host "Alembic migration failed." -ForegroundColor Red
    exit 1
}
Write-Host "Migration complete." -ForegroundColor Green

# Seed the database
Write-Host "Seeding database..." -ForegroundColor Cyan
$seedArgs = @("seed.py", "--students", "$Students")
if ($Clear) { $seedArgs += "--clear" }
& $PYTHON @seedArgs
if ($LASTEXITCODE -ne 0) {
    Write-Host "Seeding failed." -ForegroundColor Red
    exit 1
}

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Frontend:    http://localhost:5173" -ForegroundColor Cyan
