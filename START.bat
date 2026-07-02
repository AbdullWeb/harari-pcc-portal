@echo off
title Harari PCC Portal
color 0A

echo.
echo =====================================================
echo    HARARI PCC PORTAL - Starting...
echo =====================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking database...
call npx prisma db push --skip-generate 2>nul
echo Done.

echo [2/3] Seeding demo data...
call npx tsx prisma/seed.ts 2>nul
echo Done.

echo [3/3] Starting development server...
echo.
echo =====================================================
echo    Open your browser and go to:
echo    http://localhost:3000
echo.
echo    Login accounts:
echo    Applicant : applicant@demo.com / password123
echo    Reviewer  : reviewer@demo.com  / password123
echo    Admin     : admin@demo.com     / password123
echo =====================================================
echo.

call npm run dev

pause
