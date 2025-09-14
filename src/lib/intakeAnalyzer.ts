// Intake Analysis Engine
// Analyzes patient intake data to suggest appropriate treatments

import { PatientIntake, IntakeAnalysis, TreatmentRecommendation } from '../types/intake';
import { simpleDb } from './simpleDatabase';

export class IntakeAnalyzer {
  
  // Main analysis function
  static analyzeIntake(intake: PatientIntake): IntakeAnalysis {
    const analysis: IntakeAnalysis = {
      patientId: intake.id,
      primaryIndications: this.identifyPrimaryIndications(intake),
      secondaryIndications: this.identifySecondaryIndications(intake),
      recommendedTreatments: [],
      safetyConsiderations: this.identifySafetyConsiderations(intake),
      lifestyleRecommendations: this.generateLifestyleRecommendations(intake),
      followUpSuggestions: this.generateFollowUpSuggestions(intake)
    };

    // Determine TCM pattern
    analysis.tcmPattern = this.determineTCMPattern(intake);
    
    // Generate treatment recommendations
    analysis.recommendedTreatments = this.generateTreatmentRecommendations(intake, analysis);
    
    return analysis;
  }

  // Identify primary indications based on chief complaint and symptoms
  private static identifyPrimaryIndications(intake: PatientIntake): string[] {
    const indications: string[] = [];
    const { chiefComplaint, physicalAssessment, tcmAssessment } = intake;
    
    // Map chief complaint to indications
    const complaint = chiefComplaint.primaryConcern.toLowerCase();
    
    if (complaint.includes('headache') || complaint.includes('migraine')) {
      indications.push('headache');
    }
    if (complaint.includes('back') || complaint.includes('spine')) {
      indications.push('back_pain');
    }
    if (complaint.includes('neck')) {
      indications.push('neck_pain');
    }
    if (complaint.includes('stress') || complaint.includes('anxiety')) {
      indications.push('stress');
      indications.push('anxiety');
    }
    if (complaint.includes('sleep') || complaint.includes('insomnia')) {
      indications.push('insomnia');
    }
    if (complaint.includes('digest') || complaint.includes('stomach')) {
      indications.push('digestive_disorders');
    }
    if (complaint.includes('fatigue') || complaint.includes('tired')) {
      indications.push('chronic_fatigue');
    }
    if (complaint.includes('pain')) {
      indications.push('chronic_pain');
    }

    // Add indications based on pain areas
    physicalAssessment.painAreas?.forEach(pain => {
      const location = pain.location.toLowerCase();
      if (location.includes('shoulder')) indications.push('shoulder_pain');
      if (location.includes('knee')) indications.push('knee_pain');
      if (location.includes('hip')) indications.push('hip_pain');
    });

    // Add indications based on TCM assessment
    if (tcmAssessment.sleepPattern && tcmAssessment.sleepPattern !== 'good') {
      indications.push('insomnia');
    }
    if (tcmAssessment.digestiveHealth && tcmAssessment.digestiveHealth !== 'good') {
      indications.push('digestive_disorders');
    }
    if (tcmAssessment.energyLevel && tcmAssessment.energyLevel <= 4) {
      indications.push('chronic_fatigue');
    }

    return [...new Set(indications)]; // Remove duplicates
  }

  // Identify secondary indications
  private static identifySecondaryIndications(intake: PatientIntake): string[] {
    const indications: string[] = [];
    const { healthHistory, lifestyle, tcmAssessment } = intake;

    // Based on health history
    healthHistory.chronicConditions?.forEach(condition => {
      const cond = condition.toLowerCase();
      if (cond.includes('hypertension') || cond.includes('blood pressure')) {
        indications.push('hypertension');
      }
      if (cond.includes('diabetes')) {
        indications.push('diabetes');
      }
      if (cond.includes('arthritis')) {
        indications.push('arthritis');
      }
    });

    // Based on lifestyle factors
    if (lifestyle.stressLevel && lifestyle.stressLevel >= 7) {
      indications.push('stress');
    }
    if (lifestyle.exerciseFrequency === 'none') {
      indications.push('sedentary_lifestyle');
    }

    // Based on emotional state
    tcmAssessment.emotionalState?.forEach(emotion => {
      const em = emotion.toLowerCase();
      if (em.includes('depressed') || em.includes('sad')) {
        indications.push('depression');
      }
      if (em.includes('anxious') || em.includes('worry')) {
        indications.push('anxiety');
      }
      if (em.includes('angry') || em.includes('irritable')) {
        indications.push('irritability');
      }
    });

    return [...new Set(indications)];
  }

  // Determine TCM pattern based on assessment
  private static determineTCMPattern(intake: PatientIntake): string {
    const { tcmAssessment } = intake;
    
    // Simple pattern recognition - can be expanded
    if (tcmAssessment.constitution === 'cold' && tcmAssessment.energyLevel && tcmAssessment.energyLevel <= 4) {
      return 'Yang Deficiency';
    }
    if (tcmAssessment.constitution === 'hot' && tcmAssessment.sleepPattern === 'restless') {
      return 'Yin Deficiency with Heat';
    }
    if (tcmAssessment.constitution === 'damp' && tcmAssessment.digestiveHealth === 'bloating') {
      return 'Spleen Qi Deficiency with Dampness';
    }
    if (tcmAssessment.pulseQuality?.quality === 'wiry') {
      return 'Liver Qi Stagnation';
    }
    
    return 'Mixed Pattern - Requires Further Assessment';
  }

  // Generate treatment recommendations
  private static generateTreatmentRecommendations(
    intake: PatientIntake, 
    analysis: IntakeAnalysis
  ): TreatmentRecommendation[] {
    const recommendations: TreatmentRecommendation[] = [];
    const { treatmentPreferences, chiefComplaint } = intake;
    
    // Get relevant points for primary indications
    const allPoints = simpleDb.getAllPoints();
    
    analysis.primaryIndications.forEach(indication => {
      const relevantPoints = allPoints.filter(point => 
        point.indications.includes(indication)
      ).slice(0, 5); // Top 5 points per indication
      
      // Acupressure recommendation
      if (!treatmentPreferences.modalityPreferences || 
          treatmentPreferences.modalityPreferences.includes('acupressure')) {
        recommendations.push({
          modality: 'acupressure',
          points: relevantPoints.map(p => p.id),
          techniques: this.getAcupressureTechniques(indication, chiefComplaint.severity),
          reasoning: `Acupressure treatment for ${indication} using gentle pressure techniques`,
          priority: this.getPriority(indication, analysis.primaryIndications),
          contraindications: this.getModalityContraindications('acupressure', intake)
        });
      }

      // Cupping recommendation for appropriate conditions
      if (this.isCuppingSuitable(indication, intake) &&
          (!treatmentPreferences.modalityPreferences || 
           treatmentPreferences.modalityPreferences.includes('cupping'))) {
        recommendations.push({
          modality: 'cupping',
          points: relevantPoints.map(p => p.id),
          techniques: this.getCuppingTechniques(indication),
          reasoning: `Cupping therapy to address ${indication} through improved circulation`,
          priority: this.getPriority(indication, analysis.primaryIndications),
          contraindications: this.getModalityContraindications('cupping', intake)
        });
      }

      // Gua Sha recommendation
      if (this.isGuaShaSuitable(indication, intake) &&
          (!treatmentPreferences.modalityPreferences || 
           treatmentPreferences.modalityPreferences.includes('gua_sha'))) {
        recommendations.push({
          modality: 'gua_sha',
          points: this.getGuaShaAreas(indication),
          techniques: this.getGuaShaTechniques(indication),
          reasoning: `Gua Sha treatment to release tension and improve qi flow for ${indication}`,
          priority: this.getPriority(indication, analysis.primaryIndications),
          contraindications: this.getModalityContraindications('gua_sha', intake)
        });
      }

      // Applied Kinesiology recommendation
      if (!treatmentPreferences.modalityPreferences || 
          treatmentPreferences.modalityPreferences.includes('applied_kinesiology')) {
        recommendations.push({
          modality: 'applied_kinesiology',
          points: this.getAKMuscleTests(indication),
          techniques: this.getAKTechniques(indication),
          reasoning: `Applied Kinesiology assessment and correction for ${indication}`,
          priority: this.getPriority(indication, analysis.primaryIndications),
          contraindications: this.getModalityContraindications('applied_kinesiology', intake)
        });
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Helper methods for treatment recommendations
  private static getAcupressureTechniques(indication: string, severity: number): string[] {
    const pressure = severity >= 7 ? 'firm' : severity >= 4 ? 'moderate' : 'light';
    const duration = severity >= 7 ? '2-3 minutes' : '1-2 minutes';
    
    return [`${pressure} pressure for ${duration}`, 'circular motions', 'hold and release'];
  }

  private static getCuppingTechniques(indication: string): string[] {
    if (indication.includes('pain')) {
      return ['stationary cupping', 'medium suction', '10-15 minutes'];
    }
    return ['light suction', 'moving cups', '5-10 minutes'];
  }

  private static getGuaShaTechniques(indication: string): string[] {
    return ['moderate pressure', 'unidirectional strokes', '20-30 strokes per area'];
  }

  private static getAKTechniques(indication: string): string[] {
    return ['muscle testing', 'correction techniques', 'retest for confirmation'];
  }

  private static getGuaShaAreas(indication: string): string[] {
    // Map indications to body areas for Gua Sha
    const areaMap: { [key: string]: string[] } = {
      'headache': ['neck', 'upper_back'],
      'back_pain': ['back', 'lumbar'],
      'neck_pain': ['neck', 'shoulders'],
      'stress': ['neck', 'shoulders', 'upper_back']
    };
    
    return areaMap[indication] || ['general'];
  }

  private static getAKMuscleTests(indication: string): string[] {
    // Map indications to relevant muscle tests
    const muscleMap: { [key: string]: string[] } = {
      'headache': ['neck_flexors', 'suboccipitals'],
      'back_pain': ['erector_spinae', 'psoas'],
      'digestive_disorders': ['abdominal_muscles']
    };
    
    return muscleMap[indication] || ['general_assessment'];
  }

  // Safety and suitability checks
  private static isCuppingSuitable(indication: string, intake: PatientIntake): boolean {
    // Check contraindications for cupping
    if (intake.healthHistory.pregnancyStatus === 'pregnant') return false;
    if (intake.healthHistory.allergies?.some(a => a.toLowerCase().includes('skin'))) return false;
    
    return true;
  }

  private static isGuaShaSuitable(indication: string, intake: PatientIntake): boolean {
    // Check contraindications for Gua Sha
    if (intake.healthHistory.pregnancyStatus === 'pregnant') return false;
    if (intake.healthHistory.currentMedications?.some(m => 
      m.toLowerCase().includes('blood thinner') || m.toLowerCase().includes('warfarin'))) return false;
    
    return true;
  }

  private static getPriority(indication: string, primaryIndications: string[]): 'high' | 'medium' | 'low' {
    if (primaryIndications.indexOf(indication) === 0) return 'high';
    if (primaryIndications.indexOf(indication) <= 2) return 'medium';
    return 'low';
  }

  private static getModalityContraindications(
    modality: string, 
    intake: PatientIntake
  ): string[] {
    const contraindications: string[] = [];
    
    if (intake.healthHistory.pregnancyStatus === 'pregnant') {
      contraindications.push('pregnancy');
    }
    
    if (modality === 'cupping' || modality === 'gua_sha') {
      if (intake.healthHistory.currentMedications?.some(m => 
        m.toLowerCase().includes('blood thinner'))) {
        contraindications.push('blood_thinners');
      }
    }
    
    return contraindications;
  }

  // Safety considerations
  private static identifySafetyConsiderations(intake: PatientIntake): string[] {
    const considerations: string[] = [];
    
    if (intake.healthHistory.pregnancyStatus === 'pregnant') {
      considerations.push('Pregnancy - avoid certain points and techniques');
    }
    
    if (intake.healthHistory.currentMedications?.length) {
      considerations.push('Current medications - check for interactions');
    }
    
    if (intake.chiefComplaint.severity >= 8) {
      considerations.push('High pain level - consider medical referral');
    }
    
    if (intake.basicInfo.age >= 65) {
      considerations.push('Senior patient - use gentler techniques');
    }
    
    if (intake.basicInfo.age <= 16) {
      considerations.push('Minor patient - parental consent required');
    }
    
    return considerations;
  }

  // Lifestyle recommendations
  private static generateLifestyleRecommendations(intake: PatientIntake): string[] {
    const recommendations: string[] = [];
    
    if (intake.lifestyle.stressLevel && intake.lifestyle.stressLevel >= 7) {
      recommendations.push('Stress management techniques - meditation, deep breathing');
    }
    
    if (intake.lifestyle.exerciseFrequency === 'none') {
      recommendations.push('Gentle exercise - walking, tai chi, yoga');
    }
    
    if (intake.lifestyle.waterIntake === 'low') {
      recommendations.push('Increase water intake to 8 glasses daily');
    }
    
    if (intake.tcmAssessment.sleepPattern !== 'good') {
      recommendations.push('Sleep hygiene - regular bedtime, dark room, no screens before bed');
    }
    
    return recommendations;
  }

  // Follow-up suggestions
  private static generateFollowUpSuggestions(intake: PatientIntake): string[] {
    const suggestions: string[] = [];
    
    suggestions.push('Schedule follow-up in 1-2 weeks to assess progress');
    
    if (intake.chiefComplaint.severity >= 7) {
      suggestions.push('Monitor pain levels daily');
    }
    
    if (intake.tcmAssessment.energyLevel && intake.tcmAssessment.energyLevel <= 4) {
      suggestions.push('Track energy levels and sleep quality');
    }
    
    suggestions.push('Document any changes in symptoms or new concerns');
    
    return suggestions;
  }
}
