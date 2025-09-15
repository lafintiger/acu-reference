@echo off
echo ========================================
echo  Committing v0.2 and Creating v0.3
echo ========================================

echo Step 1: Add all v0.2 changes...
git add .

echo Step 2: Commit v0.2 experimental work...
git commit -m "🧪 v0.2 Experimental - AI Integration and Plugin System

✅ Features Completed:
- Local AI integration with Meditron medical model
- Working Ollama connectivity and chat interface
- Basic plugin system with 4 modality conversions
- Voice control foundation (Speech-to-Text/Text-to-Speech)
- Dynamic modality cards auto-generated from plugins
- Template system for easy modality addition

🔬 Experimental Learnings:
- Plugin architecture concepts validated
- AI integration patterns established
- Voice control feasibility confirmed
- Clinical workflow insights gained

📋 Ready for v0.3:
- Proper clinical workflow architecture
- Assessment vs Treatment separation
- Diagnostic point systems (Chapman, Ridler, Bennett)
- Signs/Symptoms vs Diagnoses distinction
- Professional clinical decision support"

echo Step 3: Switch back to stable main...
git checkout main

echo Step 4: Create clean v0.3 branch...
git checkout -b v0.3-clinical-workflow

echo Step 5: Push v0.3 branch to GitHub...
git push -u origin v0.3-clinical-workflow

echo ========================================
echo  v0.3 Clinical Workflow Branch Ready!
echo ========================================
echo Previous: v0.2-clean (experimental AI and plugins)
echo Current: v0.3-clinical-workflow (professional architecture)
echo Stable: main (production-ready v0.1)
echo Ready for proper clinical workflow development!
pause
