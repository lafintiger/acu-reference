@echo off
echo ========================================
echo  Creating Clean v0.2 Branch
echo ========================================

echo Creating new clean branch from stable main...
git checkout -b v0.2-clean

echo Pushing new branch to GitHub...
git push -u origin v0.2-clean

echo ========================================
echo  Clean v0.2 Branch Created!
echo ========================================
echo Branch: v0.2-clean
echo Ready for incremental feature development
pause
