// Ridler Points Diagnostic Plugin
// Neurovascular reflex point assessment system for circulation and organ function

import { DiagnosticPlugin, AssessmentFinding } from '../../types/clinical-workflow';
import { ridlerPoints } from '../../data/ridler-points';
import { DiagnosticPoint } from '../../types/clinical-workflow';

export class RidlerPointsPlugin implements DiagnosticPlugin {
  id = 'ridler_points';
  name = 'Ridler Neurovascular Points';
  type = 'point_system' as const;
  points = ridlerPoints;

  /**
   * Perform Ridler point assessment for a patient
   */
  performAssessment(patientData: any): AssessmentFinding[] {
    const findings: AssessmentFinding[] = [];
    
    // This would typically involve actual patient testing
    // For now, return example findings based on patient data
    if (patientData?.symptoms) {
      for (const symptom of patientData.symptoms) {
        const relevantPoints = this.getPointsForSymptom(symptom);
        
        relevantPoints.forEach(point => {
          findings.push({
            id: `finding_${point.id}_${Date.now()}`,
            patientId: patientData.id || 'current',
            findingType: 'diagnostic_point',
            referenceId: point.id,
            severity: this.estimateSeverityForSymptom(symptom),
            notes: `Ridler point assessment for ${symptom}`,
            dateRecorded: new Date().toISOString()
          });
        });
      }
    }

    return findings;
  }

  /**
   * Interpret Ridler point findings for clinical significance
   */
  interpretFindings(findings: AssessmentFinding[]): string {
    if (!findings || findings.length === 0) {
      return 'No Ridler point findings to interpret.';
    }

    const positivePoints = findings.filter(f => f.severity && f.severity >= 5);
    
    if (positivePoints.length === 0) {
      return 'Ridler point assessment: No significant neurovascular dysfunction detected.';
    }

    // Analyze organ systems affected
    const organSystems = positivePoints.map(finding => {
      const point = this.points?.find(p => p.id === finding.referenceId);
      return point?.associatedOrgan || 'unknown';
    });

    const uniqueOrgans = [...new Set(organSystems)].filter(organ => organ !== 'unknown');
    
    // Analyze severity distribution
    const highSeverityCount = positivePoints.filter(f => f.severity! >= 8).length;
    const moderateSeverityCount = positivePoints.filter(f => f.severity! >= 5 && f.severity! < 8).length;

    let interpretation = `Ridler point assessment: Neurovascular dysfunction detected in ${uniqueOrgans.length} system(s).`;
    
    if (uniqueOrgans.length > 0) {
      interpretation += ` Affected systems: ${uniqueOrgans.join(', ')}.`;
    }

    if (highSeverityCount > 0) {
      interpretation += ` ${highSeverityCount} high-severity finding(s) require immediate attention.`;
    }

    if (moderateSeverityCount > 0) {
      interpretation += ` ${moderateSeverityCount} moderate finding(s) indicate circulation stress.`;
    }

    // Add clinical recommendations
    if (uniqueOrgans.includes('adrenal_glands')) {
      interpretation += ' Consider stress management and adrenal support protocols.';
    }

    if (uniqueOrgans.includes('heart')) {
      interpretation += ' Cardiovascular assessment and circulation enhancement recommended.';
    }

    if (uniqueOrgans.includes('kidneys')) {
      interpretation += ' Kidney support and fluid balance optimization indicated.';
    }

    return interpretation;
  }

  /**
   * Get suggested diagnoses based on Ridler point findings
   */
  getSuggestedDiagnoses(findings: AssessmentFinding[]): string[] {
    const diagnoses: string[] = [];
    
    const positivePoints = findings.filter(f => f.severity && f.severity >= 5);
    
    positivePoints.forEach(finding => {
      const point = this.points?.find(p => p.id === finding.referenceId);
      if (point) {
        // Add related conditions as potential diagnoses
        diagnoses.push(...point.relatedConditions);
      }
    });

    // Remove duplicates and return most likely diagnoses
    return [...new Set(diagnoses)];
  }

  /**
   * Get Ridler points for specific assessment focus
   */
  getPointsForAssessment(focus: 'organ_specific' | 'systemic' | 'targeted', target?: string): DiagnosticPoint[] {
    if (focus === 'organ_specific' && target) {
      return this.points?.filter(point => point.associatedOrgan === target) || [];
    }
    
    if (focus === 'systemic') {
      // Return key systemic points for general assessment
      return this.points?.filter(point => 
        ['ridler_frontal_eminences', 'ridler_central', 'ridler_positive_negative'].includes(point.id)
      ) || [];
    }
    
    if (focus === 'targeted' && target) {
      // Return points related to specific condition
      return this.points?.filter(point => 
        point.relatedConditions.includes(target) ||
        point.relatedConditions.some(condition => condition.includes(target))
      ) || [];
    }

    return this.points || [];
  }

  /**
   * Get circulation assessment protocol
   */
  getCirculationAssessmentProtocol(): {
    points: DiagnosticPoint[];
    sequence: string[];
    duration: string;
    interpretation: string;
  } {
    const circulationPoints = this.points?.filter(point => 
      point.clinicalSignificance.toLowerCase().includes('circulation') ||
      point.associatedOrgan?.includes('heart') ||
      point.associatedOrgan?.includes('kidneys')
    ) || [];

    return {
      points: circulationPoints,
      sequence: [
        'Test frontal eminences for adrenal stress',
        'Check nasal points for heart function',
        'Assess parietal points for kidney function',
        'Evaluate central point for integration'
      ],
      duration: '10-15 minutes',
      interpretation: 'Comprehensive circulation and neurovascular assessment'
    };
  }

  /**
   * Get stress assessment protocol
   */
  getStressAssessmentProtocol(): {
    points: DiagnosticPoint[];
    sequence: string[];
    duration: string;
    interpretation: string;
  } {
    const stressPoints = this.points?.filter(point => 
      point.relatedConditions.includes('stress') ||
      point.relatedConditions.includes('anxiety') ||
      point.associatedOrgan === 'adrenal_glands'
    ) || [];

    return {
      points: stressPoints,
      sequence: [
        'Begin with frontal eminences for adrenal function',
        'Test positive/negative points for emotional balance',
        'Check central integration point',
        'Assess sphenoid for pituitary response'
      ],
      duration: '8-12 minutes',
      interpretation: 'Stress response and emotional balance assessment'
    };
  }

  /**
   * Private helper methods
   */
  private getPointsForSymptom(symptom: string): DiagnosticPoint[] {
    return this.points?.filter(point => 
      point.relatedConditions.includes(symptom) ||
      point.relatedConditions.some(condition => 
        condition.toLowerCase().includes(symptom.toLowerCase())
      )
    ) || [];
  }

  private estimateSeverityForSymptom(symptom: string): number {
    // Estimate severity based on symptom type
    const severityMap: Record<string, number> = {
      'stress': 7,
      'anxiety': 6,
      'insomnia': 6,
      'heart_palpitations': 8,
      'blood_pressure_irregularities': 8,
      'hormonal_imbalances': 7,
      'digestive_disorders': 6,
      'circulation_problems': 7
    };

    return severityMap[symptom] || 5; // Default moderate severity
  }
}

// Singleton instance
export const ridlerPointsPlugin = new RidlerPointsPlugin();

// Convenience functions
export const performRidlerAssessment = (patientData: any) =>
  ridlerPointsPlugin.performAssessment(patientData);

export const interpretRidlerFindings = (findings: AssessmentFinding[]) =>
  ridlerPointsPlugin.interpretFindings(findings);

export const getRidlerDiagnoses = (findings: AssessmentFinding[]) =>
  ridlerPointsPlugin.getSuggestedDiagnoses(findings);
