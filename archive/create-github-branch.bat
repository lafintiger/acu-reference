@echo off
echo ========================================
echo  Creating v0.3 Branch on GitHub
echo ========================================

echo Step 1: Clean any problematic files...
git rm --cached *.bat 2>nul
git rm --cached push-to-github.bat 2>nul

echo Step 2: Add only safe files...
git add src/
git add package.json
git add README.md
git add .gitignore

echo Step 3: Commit clean v0.3 foundation...
git commit -m "v0.3 Clinical Workflow Foundation

Professional clinical architecture with:
- Assessment vs Treatment separation
- Diagnostic point systems (Chapman, Ridler, Bennett)
- Signs/Symptoms vs Diagnoses distinction
- Modular plugin architecture
- Clinical workflow integration"

echo Step 4: Push v0.3 branch to GitHub...
git push -u origin v0.3-clinical-workflow

echo ========================================
echo  v0.3 Branch Should Now Be on GitHub!
echo ========================================
echo Check: https://github.com/lafintiger/acu-reference/branches
pause
