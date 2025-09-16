@echo off
echo ========================================
echo  Updating AcuReference Repository
echo ========================================

echo Adding new intake system files...
git add .

echo Committing changes...
git commit -m "✨ Add comprehensive patient intake system

🏥 Features:
- Complete patient intake form with multi-step wizard
- Privacy-protected data storage (local only)
- AI-powered treatment analysis and recommendations
- TCM pattern recognition and assessment
- Multi-modal treatment suggestions
- Safety considerations and contraindications
- Lifestyle and follow-up recommendations

🔒 Privacy:
- Only patient initials stored (no personal info)
- Local storage only (never uploaded)
- Gitignore protection for patient data
- Separate database for intake records

🎯 Clinical Value:
- Evidence-based treatment recommendations
- WHO standard point integration
- Safety-first approach with contraindications
- Comprehensive assessment workflow
- Professional treatment planning tools"

echo Pushing to GitHub...
git push origin main

echo ========================================
echo  Repository Updated Successfully!
echo ========================================
echo Repository: https://github.com/lafintiger/acu-reference
pause
