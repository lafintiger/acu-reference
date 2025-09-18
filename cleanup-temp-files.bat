@echo off
echo ========================================
echo  Cleaning Temporary Development Files
echo ========================================

echo Creating archive folder for temporary files...
mkdir archive 2>nul

echo Moving temporary batch files to archive...
move check-duplicates.bat archive\ 2>nul
move check-errors.bat archive\ 2>nul
move clean-history-and-push.bat archive\ 2>nul
move commit-v02-and-create-v03.bat archive\ 2>nul
move create-github-branch.bat archive\ 2>nul
move create-v02-clean.bat archive\ 2>nul
move create-v03-branch-clean.bat archive\ 2>nul
move fix-errors-complete.bat archive\ 2>nul
move fix-security-and-push.bat archive\ 2>nul
move nuclear-fix.bat archive\ 2>nul
move restart-clean.bat archive\ 2>nul
move restart-dev-server.bat archive\ 2>nul
move start-v02-development.bat archive\ 2>nul
move sync-v03-and-start.bat archive\ 2>nul

echo Moving temporary JavaScript files to archive...
move fix-duplicate-points.js archive\ 2>nul

echo Keeping essential files:
echo - start-app.bat (useful for starting development)
echo - push-v03-complete.bat (for deployment)
echo - check-embedding-models.bat (for AI setup)

echo Checking what's left in root directory...
dir *.bat *.js

echo ========================================
echo  Cleanup Complete
echo ========================================
echo Temporary files moved to archive folder
echo Essential development files kept in root
pause
