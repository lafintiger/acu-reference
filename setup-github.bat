@echo off
echo ========================================
echo  AcuReference GitHub Repository Setup
echo ========================================
echo.

echo Step 1: Checking git status...
git status
echo.

echo Step 2: Adding remote origin...
git remote add origin https://github.com/lafintiger/acu-reference.git
echo.

echo Step 3: Renaming branch to main...
git branch -M main
echo.

echo Step 4: Pushing to GitHub...
git push -u origin main
echo.

echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Your repository will be available at:
echo https://github.com/lafintiger/acu-reference
echo.
echo Next steps:
echo 1. Go to your repository on GitHub
echo 2. Go to Settings ^> Pages
echo 3. Set Source to "Deploy from a branch"
echo 4. Select "gh-pages" branch
echo 5. Click Save
echo.
echo Your app will be live at:
echo https://lafintiger.github.io/acu-reference/
echo.
pause
