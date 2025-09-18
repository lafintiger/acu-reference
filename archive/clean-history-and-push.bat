@echo off
echo ========================================
echo  Cleaning Git History and Creating Branch
echo ========================================

echo Step 1: Remove token file from all git history...
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch push-to-github.bat" --prune-empty --tag-name-filter cat -- --all

echo Step 2: Clean up refs...
git for-each-ref --format="delete %%(refname)" refs/original | git update-ref --stdin

echo Step 3: Expire reflog and garbage collect...
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo Step 4: Add security improvements...
git add .gitignore

echo Step 5: Commit clean version...
git commit -m "🔒 Security: Remove all traces of access tokens

- Complete removal of tokens from git history
- Enhanced .gitignore for future protection
- Clean repository ready for v0.2 development"

echo Step 6: Force push clean history...
git push origin main --force

echo Step 7: Create and push v0.2 branch...
git checkout -b v0.2-modular-architecture
git push -u origin v0.2-modular-architecture

echo ========================================
echo  Clean Branch Created Successfully!
echo ========================================
echo Main: Clean stable version
echo v0.2: Ready for modular development
pause
