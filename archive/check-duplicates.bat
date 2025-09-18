@echo off
echo ========================================
echo  Checking for Duplicate Point IDs
echo ========================================

echo Searching for duplicate IDs in seedData.ts...
findstr /n "id: '" src\data\seedData.ts | sort

echo ========================================
echo  Check Complete - Look for Duplicate IDs
echo ========================================
pause
