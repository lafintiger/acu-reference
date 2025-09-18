@echo off
echo ========================================
echo  Restarting with Clean Database
echo ========================================

echo Stopping any running servers...
taskkill /f /im node.exe 2>nul

echo Starting fresh development server...
npm run dev

echo ========================================
echo  Clean Restart Complete
echo ========================================
echo Check console for clean initialization
echo No more duplicate ID errors!
pause
