@echo off
echo ========================================
echo  Switching to v0.3 Clinical Workflow
echo ========================================

echo Switching to v0.3 branch...
git checkout v0.3-clinical-workflow

echo Adding new clinical architecture files...
git add src/types/clinical-workflow.ts

echo Committing initial clinical architecture...
git commit -m "🏥 v0.3 Initial - Clinical Workflow Architecture Foundation

✅ Clinical Data Architecture:
- Signs & Symptoms (observable data)
- Diagnoses & TCM Patterns (clinical conclusions)  
- Diagnostic Points (Chapman, Ridler, Bennett systems)
- Treatment Points (WHO standard acupuncture points)
- Assessment vs Treatment separation

🔬 Professional Clinical Workflow:
- Assessment Phase: Signs/Symptoms → Diagnostic Points → Pattern Analysis
- Diagnosis Phase: Clinical conclusions and TCM pattern recognition
- Treatment Phase: Evidence-based protocols and point selection
- Monitoring Phase: Outcome tracking and progress assessment

🏗️ Modular Plugin Architecture:
- Diagnostic Plugins: Chapman Points, Ridler Points, Bennett Points
- Treatment Plugins: Acupressure, Cupping, Gua Sha, Applied Kinesiology
- Assessment Tools: Clinical evaluation and pattern recognition
- AI Integration: Workflow-aware clinical decision support"

echo Starting development server...
npm run dev

echo ========================================
echo  v0.3 Clinical Workflow Ready!
echo ========================================
echo Branch: v0.3-clinical-workflow
echo Architecture: Professional clinical workflow
echo Ready to build assessment and treatment systems!
pause
