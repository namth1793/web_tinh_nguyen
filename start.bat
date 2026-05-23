@echo off
echo.
echo ============================================
echo   Phat Phap Test - Khoi dong
echo ============================================
echo.

echo Dang khoi dong Backend (port 5030)...
start "Phat Phap - Backend" cmd /k "cd /d %~dp0backend && node server.js"

timeout /t 2 /nobreak > nul

echo Dang khoi dong Frontend (port 3030)...
start "Phat Phap - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 5 /nobreak > nul

echo.
echo ============================================
echo   Da khoi dong thanh cong!
echo   Backend:  http://localhost:5030/api/health
echo   Frontend: http://localhost:3030
echo ============================================
echo.
start http://localhost:3030
