// Chapman Points Diagnostic Plugin
// Professional neurolymphatic reflex point assessment system

import { DiagnosticPlugin, AssessmentFinding } from '../../types/clinical-workflow';
import { chapmanPoints } from '../../data/chapman-points';
import { DiagnosticPoint } from '../../types/clinical-workflow';

export class ChapmanPointsPlugin implements DiagnosticPlugin {
  id = 'chapman_points';
  name = 'Chapman Neurolymphatic Points';
  type = 'point_system' as const;
  points = chapmanPoints;
  assessmentMethod = 'Light to moderate palpation for tender nodules and tissue texture changes';
  interpretation = 'Positive findings indicate lymphatic congestion affecting associated organ systems';
  clinicalApplications = [
    'Organ function assessment',
    'Lymphatic drainage evaluation', 
    'Viscerosomatic reflex testing',
    'Treatment monitoring',
    'Constitutional assessment'
  ];

  // Perform Chapman point assessment
  performAssessment(patientData: any): AssessmentFinding[] {
    // This would be implemented with actual patient testing
    // For now, return structure for demonstration
    const findings: AssessmentFinding[] = [];
    
    // Example: If patient has fatigue symptoms, check relevant Chapman points
    if (patientData?.symptoms?.includes('chronic_fatigue')) {
      findings.push({
        id: `assessment_${Date.now()}`,
        patientId: patientData.id,
        findingType: 'diagnostic_point',
        referenceId: 'chapman_adrenal_anterior',
        severity: 7, // Would be determined by palpation
        notes: 'Tender nodule found, suggests adrenal stress',
        dateRecorded: new Date().toISOString()
      });
    }
    
    return findings;
  }

  // Interpret Chapman point findings
  interpretFindings(findings: AssessmentFinding[]): string {
    const positivePoints = findings.filter(f => f.severity && f.severity >= 5);
    
    if (positivePoints.length === 0) {
      return 'Chapman point assessment: No significant lymphatic congestion detected.';
    }
    
    const organSystems = positivePoints.map(finding => {
      const point = this.points?.find(p => p.id === finding.referenceId);
      return point?.associatedOrgan || 'unknown';
    });
    
    const uniqueOrgans = [...new Set(organSystems)];
    
    return `Chapman point assessment: Lymphatic congestion detected in ${uniqueOrgans.join(', ')} systems. Consider lymphatic drainage techniques and organ-specific support.`;
  }

  // Suggest diagnoses based on Chapman point findings
  getSuggestedDiagnoses(findings: AssessmentFinding[]): string[] {
    const diagnoses: string[] = [];
    
    findings.forEach(finding => {
      const point = this.points?.find(p => p.id === finding.referenceId);
      if (point && finding.severity && finding.severity >= 6) {
        // High severity findings suggest specific patterns
        switch (point.associatedOrgan) {
          case 'liver':
            diagnoses.push('liver_qi_stagnation', 'digestive_dysfunction');
            break;
          case 'kidneys':
            diagnoses.push('kidney_yang_deficiency', 'fluid_metabolism_disorder');
            break;
          case 'heart':
            diagnoses.push('heart_qi_deficiency', 'circulation_disorder');
            break;
          case 'adrenal_glands':
            diagnoses.push('adrenal_fatigue', 'stress_adaptation_disorder');
            break;
          case 'lungs':
            diagnoses.push('lung_qi_deficiency', 'respiratory_dysfunction');
            break;
        }
      }
    });
    
    return [...new Set(diagnoses)]; // Remove duplicates
  }

  // Get Chapman points for specific assessment
  getPointsForAssessment(focus: 'organ_specific' | 'systemic' | 'targeted', target?: string): DiagnosticPoint[] {
    if (focus === 'organ_specific' && target) {
      return this.points?.filter(point => point.associatedOrgan === target) || [];
    }
    
    if (focus === 'systemic') {
      // Return key points for general assessment
      return this.points?.filter(point => 
        ['heart', 'liver', 'kidneys', 'adrenal_glands'].includes(point.associatedOrgan || '')
      ) || [];
    }
    
    return this.points || [];
  }

  // Validate Chapman point testing safety
  validateSafety(patientData: any): { safe: boolean; warnings: string[] } {
    const warnings: string[] = [];
    let safe = true;

    // Check for contraindications
    if (patientData?.conditions?.includes('pregnancy')) {
      warnings.push('Use gentle pressure during pregnancy');
    }
    
    if (patientData?.conditions?.includes('recent_surgery')) {
      warnings.push('Avoid Chapman points near surgical sites');
    }
    
    if (patientData?.medications?.some((med: string) => med.toLowerCase().includes('blood_thinner'))) {
      warnings.push('Use very light pressure with blood thinning medications');
    }
    
    if (patientData?.age && patientData.age >= 75) {
      warnings.push('Use gentle pressure for elderly patients');
    }

    return { safe, warnings };
  }
}

// Export singleton instance
export const chapmanPointsPlugin = new ChapmanPointsPlugin();
