@echo off
echo ========================================
echo  NUCLEAR FIX - Back to Stable Version
echo ========================================

echo Step 1: Stop all Node processes...
taskkill /f /im node.exe 2>nul

echo Step 2: Switch to stable main branch...
git checkout main

echo Step 3: Clean any uncommitted changes...
git reset --hard HEAD

echo Step 4: Start stable development server...
npm run dev

echo ========================================
echo  NUCLEAR FIX COMPLETE!
echo ========================================
echo You are now on the STABLE main branch
echo App should be working at: http://localhost:5173
echo Ready to rebuild v0.2 properly!
pause
