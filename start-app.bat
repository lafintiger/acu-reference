@echo off
echo ========================================
echo  Starting AcuReference Development Server
echo ========================================

echo Checking if server is already running...
netstat -an | find "5173" >nul
if %errorlevel% == 0 (
    echo Server already running on port 5173
    echo Open: http://localhost:5173
    pause
    exit
)

echo Starting development server...
npm run dev

echo ========================================
echo  Server Started
echo ========================================
echo Open: http://localhost:5173
pause
