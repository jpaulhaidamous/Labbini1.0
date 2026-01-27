@echo off
echo ========================================
echo Labbini Setup Script
echo ========================================
echo.

echo Step 1: Installing dependencies...
call pnpm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    exit /b %errorlevel%
)
echo.

echo Step 2: Starting Docker services...
call pnpm docker:up
if %errorlevel% neq 0 (
    echo ERROR: Failed to start Docker services
    exit /b %errorlevel%
)
echo.

echo Waiting for databases to be ready...
timeout /t 5 /nobreak > nul
echo.

echo Step 3: Setting up backend environment...
if not exist "apps\backend\.env" (
    copy "apps\backend\.env.example" "apps\backend\.env"
    echo Created apps\backend\.env from example
) else (
    echo apps\backend\.env already exists, skipping...
)
echo.

echo Step 4: Setting up frontend environment...
if not exist "apps\frontend\.env" (
    copy "apps\frontend\.env.example" "apps\frontend\.env"
    echo Created apps\frontend\.env from example
) else (
    echo apps\frontend\.env already exists, skipping...
)
echo.

echo Step 5: Running database migrations...
call pnpm db:migrate
if %errorlevel% neq 0 (
    echo ERROR: Failed to run migrations
    exit /b %errorlevel%
)
echo.

echo Step 6: Seeding database...
call pnpm db:seed
if %errorlevel% neq 0 (
    echo ERROR: Failed to seed database
    exit /b %errorlevel%
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Test Accounts:
echo   Client: client@labbini.com / password123
echo   Freelancer: freelancer1@labbini.com / password123
echo.
echo To start development:
echo   pnpm dev
echo.
echo Frontend will be at: http://localhost:3000
echo Backend will be at: http://localhost:3001/api
echo.
pause
