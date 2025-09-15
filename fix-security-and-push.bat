@echo off
echo ========================================
echo  Fixing Security Issue and Pushing
echo ========================================

echo Removing token file from git history...
git rm push-to-github.bat

echo Adding security improvements to gitignore...
git add .gitignore

echo Committing security fix...
git commit -m "🔒 Security fix: Remove access token from repository

- Remove push-to-github.bat containing access token
- Update .gitignore to prevent future token commits
- Maintain repository security best practices"

echo Pushing security fix...
git push -u origin v0.2-modular-architecture

echo ========================================
echo  Security Fixed - Branch Created!
echo ========================================
echo Branch: v0.2-modular-architecture
echo Repository: https://github.com/lafintiger/acu-reference
pause
