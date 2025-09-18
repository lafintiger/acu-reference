// Treatment Service
// Centralized treatment planning and management logic

import { simpleDb } from '../lib/simpleDatabase';
import { validationService, TreatmentPlan } from './ValidationService';
import { AssessmentData } from './AssessmentService';

export interface TreatmentProtocol {
  id: string;
  name: string;
  indication: string;
  points: string[];
  modalities: string[];
  duration: string;
  frequency: string;
  expectedOutcomes: string[];
  contraindications: string[];
  clinicalNotes: string;
}

export interface TreatmentSession {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  date: string;
  pointsUsed: string[];
  modalitiesApplied: string[];
  duration: number; // minutes
  patientResponse: 'excellent' | 'good' | 'fair' | 'poor' | 'adverse';
  notes: string;
  nextSessionDate?: string;
}

export class TreatmentService {
  private storage = localStorage;
  private treatmentPlansKey = 'acu_treatment_plans';
  private treatmentSessionsKey = 'acu_treatment_sessions';

  /**
   * Generate treatment plan from assessment data
   */
  async generateTreatmentPlan(
    assessmentData: AssessmentData,
    selectedDiagnosis?: string,
    tcmPattern?: string
  ): Promise<TreatmentPlan> {
    try {
      const plan: TreatmentPlan = {
        diagnosis: selectedDiagnosis,
        tcmPattern: tcmPattern,
        selectedPoints: [],
        modalities: [],
        goals: [],
        contraindications: []
      };

      // Generate points based on TCM pattern
      if (tcmPattern) {
        const points = await this.getPointsForTCMPattern(tcmPattern);
        plan.selectedPoints.push(...points);
      }

      // Generate points based on symptoms
      if (assessmentData.symptoms && assessmentData.symptoms.length > 0) {
        const symptomPoints = await this.getPointsForSymptoms(assessmentData.symptoms);
        plan.selectedPoints.push(...symptomPoints);
      }

      // Add Chapman point recommendations
      if (assessmentData.chapmanFindings && assessmentData.chapmanFindings.length > 0) {
        const chapmanRecommendations = this.getChapmanBasedRecommendations(assessmentData.chapmanFindings);
        plan.selectedPoints.push(...chapmanRecommendations);
      }

      // Remove duplicates and limit to reasonable number
      plan.selectedPoints = [...new Set(plan.selectedPoints)].slice(0, 12);

      // Suggest modalities based on condition
      plan.modalities = this.suggestModalities(assessmentData, selectedDiagnosis);

      // Generate treatment goals
      plan.goals = this.generateTreatmentGoals(assessmentData, selectedDiagnosis);

      // Check for contraindications
      plan.contraindications = await this.checkContraindications(plan.selectedPoints);

      return plan;
    } catch (error) {
      console.error('❌ Failed to generate treatment plan:', error);
      throw error;
    }
  }

  /**
   * Save treatment plan with validation
   */
  async saveTreatmentPlan(plan: TreatmentPlan, patientId: string = 'current'): Promise<string> {
    try {
      // Validate treatment plan
      const validation = validationService.validateTreatmentPlan(plan);
      if (!validation.isValid) {
        throw new Error(`Treatment plan validation failed: ${validation.errors.join(', ')}`);
      }

      // Log warnings
      if (validation.warnings && validation.warnings.length > 0) {
        console.warn('Treatment plan warnings:', validation.warnings);
      }

      // Create plan record
      const planId = `plan_${Date.now()}`;
      const planRecord = {
        id: planId,
        patientId,
        ...plan,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: 'active' as const
      };

      // Save to storage
      const existingPlans = this.getStoredTreatmentPlans();
      existingPlans[planId] = planRecord;
      
      this.storage.setItem(this.treatmentPlansKey, JSON.stringify(existingPlans));
      console.log('✅ Treatment plan saved successfully');
      
      return planId;
    } catch (error) {
      console.error('❌ Failed to save treatment plan:', error);
      throw error;
    }
  }

  /**
   * Load treatment plan
   */
  loadTreatmentPlan(planId: string): TreatmentPlan | null {
    try {
      const storedPlans = this.getStoredTreatmentPlans();
      return storedPlans[planId] || null;
    } catch (error) {
      console.error('❌ Failed to load treatment plan:', error);
      return null;
    }
  }

  /**
   * Record treatment session
   */
  async recordTreatmentSession(session: Omit<TreatmentSession, 'id'>): Promise<string> {
    try {
      const sessionId = `session_${Date.now()}`;
      const sessionRecord = {
        id: sessionId,
        ...session
      };

      const existingSessions = this.getStoredTreatmentSessions();
      existingSessions[sessionId] = sessionRecord;
      
      this.storage.setItem(this.treatmentSessionsKey, JSON.stringify(existingSessions));
      console.log('✅ Treatment session recorded successfully');
      
      return sessionId;
    } catch (error) {
      console.error('❌ Failed to record treatment session:', error);
      throw error;
    }
  }

  /**
   * Get treatment recommendations based on condition
   */
  async getTreatmentRecommendations(condition: string): Promise<string[]> {
    const recommendations: string[] = [];

    // Common recommendations based on condition
    const conditionRecommendations: Record<string, string[]> = {
      'headache': [
        'Start with LI4 and GB20 for immediate relief',
        'Consider cupping for muscle tension',
        'Monitor patient response after 15-20 minutes'
      ],
      'anxiety': [
        'Use HT7 and PC6 for calming effect',
        'Apply gentle pressure for 2-3 minutes',
        'Consider ear acupressure for ongoing support'
      ],
      'back_pain': [
        'Use local and distal points',
        'Gua sha may be effective for muscle tension',
        'Avoid deep pressure in acute cases'
      ]
    };

    const normalizedCondition = condition.toLowerCase().replace(/\s+/g, '_');
    if (conditionRecommendations[normalizedCondition]) {
      recommendations.push(...conditionRecommendations[normalizedCondition]);
    }

    // General recommendations
    recommendations.push(
      'Monitor patient comfort throughout treatment',
      'Document patient response for future sessions',
      'Provide aftercare instructions'
    );

    return recommendations;
  }

  /**
   * Private helper methods
   */
  private async getPointsForTCMPattern(pattern: string): Promise<string[]> {
    // This would integrate with TCM pattern database
    // For now, return common points for major patterns
    const patternPoints: Record<string, string[]> = {
      'liver_qi_stagnation': ['LV3', 'LV14', 'GB34', 'PC6'],
      'kidney_yang_deficiency': ['KI3', 'KI7', 'BL23', 'GV4'],
      'spleen_qi_deficiency': ['ST36', 'SP6', 'SP3', 'BL20']
    };

    return patternPoints[pattern] || [];
  }

  private async getPointsForSymptoms(symptoms: string[]): Promise<string[]> {
    const points: string[] = [];
    
    for (const symptom of symptoms) {
      try {
        // This would query the database for points related to symptoms
        // For now, use static mapping
        const symptomPoints = await this.getStaticSymptomPoints(symptom);
        points.push(...symptomPoints);
      } catch (error) {
        console.error(`Failed to get points for symptom ${symptom}:`, error);
      }
    }

    return [...new Set(points)]; // Remove duplicates
  }

  private async getStaticSymptomPoints(symptom: string): Promise<string[]> {
    const symptomPointMap: Record<string, string[]> = {
      'headache_tension': ['LI4', 'GB20', 'GV20', 'EX-HN3'],
      'anxiety': ['HT7', 'PC6', 'GV20', 'EX-HN3'],
      'neck_pain': ['GB20', 'GB21', 'SI3', 'BL10'],
      'back_pain': ['BL23', 'BL25', 'GV3', 'KI3'],
      'insomnia': ['HT7', 'PC6', 'SP6', 'KI3']
    };

    return symptomPointMap[symptom] || [];
  }

  private getChapmanBasedRecommendations(findings: any[]): string[] {
    const recommendations: string[] = [];
    
    // High severity findings suggest related acupuncture points
    findings.forEach(finding => {
      if (finding.severity >= 7) {
        // Map Chapman points to related acupuncture points
        const chapmanToAcuMap: Record<string, string[]> = {
          'chapman_liver_anterior': ['LV3', 'LV14'],
          'chapman_heart_anterior': ['HT7', 'PC6'],
          'chapman_lung_anterior': ['LU9', 'LU5'],
          'chapman_kidney_anterior': ['KI3', 'KI7']
        };

        const relatedPoints = chapmanToAcuMap[finding.pointId] || [];
        recommendations.push(...relatedPoints);
      }
    });

    return recommendations;
  }

  private suggestModalities(assessmentData: AssessmentData, diagnosis?: string): string[] {
    const modalities: string[] = [];

    // Based on Chapman findings
    if (assessmentData.chapmanFindings && assessmentData.chapmanFindings.length > 0) {
      modalities.push('acupressure'); // Always good for Chapman points
      
      const highSeverityCount = assessmentData.chapmanFindings.filter(f => f.severity >= 7).length;
      if (highSeverityCount > 2) {
        modalities.push('applied_kinesiology'); // For complex patterns
      }
    }

    // Based on diagnosis
    if (diagnosis) {
      if (diagnosis.includes('pain') || diagnosis.includes('tension')) {
        modalities.push('cupping', 'gua_sha');
      }
      if (diagnosis.includes('stress') || diagnosis.includes('anxiety')) {
        modalities.push('acupressure');
      }
    }

    return [...new Set(modalities)];
  }

  private generateTreatmentGoals(assessmentData: AssessmentData, diagnosis?: string): string[] {
    const goals: string[] = [];

    // Based on symptoms
    if (assessmentData.symptoms) {
      if (assessmentData.symptoms.includes('headache_tension')) {
        goals.push('Reduce headache frequency and intensity');
      }
      if (assessmentData.symptoms.includes('anxiety')) {
        goals.push('Improve emotional balance and reduce anxiety');
      }
      if (assessmentData.symptoms.includes('insomnia')) {
        goals.push('Improve sleep quality and duration');
      }
    }

    // Based on Chapman findings
    if (assessmentData.chapmanFindings && assessmentData.chapmanFindings.length > 0) {
      goals.push('Improve lymphatic circulation');
      goals.push('Reduce organ system congestion');
    }

    // General goals
    goals.push('Enhance overall well-being');
    goals.push('Prevent symptom recurrence');

    return goals;
  }

  private async checkContraindications(points: string[]): Promise<string[]> {
    const contraindications: string[] = [];
    
    // Check for pregnancy contraindications
    const pregnancyPoints = ['LI4', 'SP6', 'BL60', 'BL67'];
    const hasPregnancyPoints = points.some(point => pregnancyPoints.includes(point));
    
    if (hasPregnancyPoints) {
      contraindications.push('pregnancy');
    }

    // Add other contraindication checks as needed
    
    return contraindications;
  }

  private getStoredTreatmentPlans(): Record<string, any> {
    try {
      const stored = this.storage.getItem(this.treatmentPlansKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse stored treatment plans:', error);
      return {};
    }
  }

  private getStoredTreatmentSessions(): Record<string, TreatmentSession> {
    try {
      const stored = this.storage.getItem(this.treatmentSessionsKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse stored treatment sessions:', error);
      return {};
    }
  }
}

// Singleton instance
export const treatmentService = new TreatmentService();

// Convenience functions
export const generateTreatmentPlan = (assessmentData: AssessmentData, diagnosis?: string, tcmPattern?: string) =>
  treatmentService.generateTreatmentPlan(assessmentData, diagnosis, tcmPattern);

export const saveTreatmentPlan = (plan: TreatmentPlan, patientId?: string) =>
  treatmentService.saveTreatmentPlan(plan, patientId);
