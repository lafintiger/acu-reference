@echo off
echo ========================================
echo  Checking Git Branch Status
echo ========================================

echo Current branch:
git branch

echo All branches:
git branch -a

echo Remote branches:
git branch -r

echo Git status:
git status

echo ========================================
echo  Branch Status Complete
echo ========================================
pause
