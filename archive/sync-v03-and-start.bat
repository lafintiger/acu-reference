@echo off
echo ========================================
echo  Syncing with GitHub v0.3 Branch
echo ========================================

echo Step 1: Fetch latest from GitHub...
git fetch origin

echo Step 2: Switch to v0.3 branch...
git checkout v0.3-clinical-workflow

echo Step 3: Pull any GitHub changes...
git pull origin v0.3-clinical-workflow

echo Step 4: Check branch status...
git branch

echo Step 5: Start development server...
npm run dev

echo ========================================
echo  v0.3 Clinical Workflow Ready!
echo ========================================
echo Branch: v0.3-clinical-workflow (synced with GitHub)
echo Ready to build professional clinical architecture!
echo App: http://localhost:5173
pause
