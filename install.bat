@echo off
echo.
echo ============================================
echo   Phat Phap Test - Cai dat du an
echo ============================================
echo.

echo [1/2] Cai dat Backend (Node.js + Express)...
cd /d "%~dp0backend"
call npm install
if %errorlevel% neq 0 (
    echo LOI: Cai dat backend that bai!
    pause
    exit /b 1
)

echo.
echo [2/2] Cai dat Frontend (Next.js 14)...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo LOI: Cai dat frontend that bai!
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Cai dat hoan tat!
echo   Chay: start.bat de khoi dong
echo   Backend:  http://localhost:5030
echo   Frontend: http://localhost:3030
echo ============================================
echo.
pause
