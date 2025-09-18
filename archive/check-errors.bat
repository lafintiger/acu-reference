@echo off
echo ========================================
echo  Checking for TypeScript Errors
echo ========================================

echo Running TypeScript compiler check...
npx tsc --noEmit

echo ========================================
echo  Error Check Complete
echo ========================================
pause
