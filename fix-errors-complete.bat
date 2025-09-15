@echo off
echo ========================================
echo  Complete Error Fix and Restart
echo ========================================

echo Step 1: Stop all Node processes...
taskkill /f /im node.exe 2>nul

echo Step 2: Clear browser cache and restart...
echo Please clear your browser cache (Ctrl+Shift+R) after this completes

echo Step 3: Remove node_modules and reinstall...
rmdir /s /q node_modules 2>nul
npm install

echo Step 4: Clear Vite cache...
rmdir /s /q .vite 2>nul

echo Step 5: Start fresh development server...
npm run dev

echo ========================================
echo  Complete Restart Finished
echo ========================================
echo Please refresh your browser with Ctrl+Shift+R
pause
