@echo off
echo ========================================
echo  Starting Clean v0.2 Development
echo ========================================

echo Checking current branch...
git branch

echo Starting development server...
npm run dev

echo ========================================
echo  v0.2 Development Ready!
echo ========================================
echo Branch: v0.2-clean (local development)
echo App: http://localhost:5173
echo Ready to add features incrementally!
pause
