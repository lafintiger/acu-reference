@echo off
echo ========================================
echo  Creating v0.3 Branch Properly
echo ========================================

echo Step 1: Check current branch...
git branch

echo Step 2: Ensure we're on main...
git checkout main

echo Step 3: Create v0.3 branch locally...
git checkout -b v0.3-clinical-workflow

echo Step 4: Verify branch creation...
git branch

echo Step 5: Start development server...
npm run dev

echo ========================================
echo  v0.3 Branch Created Locally!
echo ========================================
echo Branch: v0.3-clinical-workflow
echo Status: Local development ready
echo Note: GitHub push will be done later after token cleanup
echo App: http://localhost:5173
pause
