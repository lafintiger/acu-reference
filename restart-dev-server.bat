@echo off
echo ========================================
echo  Restarting Development Server
echo ========================================

echo Stopping any running dev servers...
taskkill /f /im node.exe 2>nul

echo Clearing npm cache...
npm cache clean --force

echo Starting fresh development server...
npm run dev

echo ========================================
echo  Development Server Restarted
echo ========================================
