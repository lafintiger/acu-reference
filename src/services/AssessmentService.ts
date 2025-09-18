// Assessment Service
// Centralized assessment data management and business logic

import { simpleDb } from '../lib/simpleDatabase';
import { chapmanPointsPlugin } from '../plugins/diagnostic/chapman-points-plugin';
import { validationService, AssessmentData, ChapmanFinding } from './ValidationService';

export interface AssessmentFinding {
  id: string;
  patientId: string;
  findingType: 'sign' | 'symptom' | 'diagnostic_point';
  referenceId: string;
  severity?: number;
  notes?: string;
  dateRecorded: string;
}

export interface AssessmentSummary {
  totalFindings: number;
  signsCount: number;
  symptomsCount: number;
  chapmanCount: number;
  highSeverityCount: number;
  interpretation?: string;
}

export class AssessmentService {
  private storage = localStorage;
  private storageKey = 'acu_assessment_data';

  /**
   * Save assessment data with validation
   */
  async saveAssessmentData(data: AssessmentData, patientId: string = 'current'): Promise<void> {
    try {
      // Validate data first
      const validation = validationService.validateAssessmentData(data);
      if (!validation.isValid) {
        throw new Error(`Assessment validation failed: ${validation.errors.join(', ')}`);
      }

      // Log warnings if any
      if (validation.warnings && validation.warnings.length > 0) {
        console.warn('Assessment warnings:', validation.warnings);
      }

      // Add metadata
      const assessmentRecord = {
        ...data,
        patientId,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      // Save to storage
      const existingData = this.getStoredAssessments();
      existingData[patientId] = assessmentRecord;
      
      this.storage.setItem(this.storageKey, JSON.stringify(existingData));
      console.log('✅ Assessment data saved successfully');
      
    } catch (error) {
      console.error('❌ Failed to save assessment data:', error);
      throw error;
    }
  }

  /**
   * Load assessment data for a patient
   */
  loadAssessmentData(patientId: string = 'current'): AssessmentData | null {
    try {
      const storedData = this.getStoredAssessments();
      return storedData[patientId] || null;
    } catch (error) {
      console.error('❌ Failed to load assessment data:', error);
      return null;
    }
  }

  /**
   * Generate assessment summary with interpretation
   */
  generateAssessmentSummary(data: AssessmentData): AssessmentSummary {
    const signsCount = data.signs?.length || 0;
    const symptomsCount = data.symptoms?.length || 0;
    const chapmanCount = data.chapmanFindings?.length || 0;
    
    const highSeverityCount = data.chapmanFindings?.filter(
      finding => finding.severity >= 7
    ).length || 0;

    let interpretation: string | undefined;
    
    // Generate Chapman points interpretation if available
    if (data.chapmanFindings && data.chapmanFindings.length > 0) {
      try {
        const findings = data.chapmanFindings.map(f => ({
          id: f.pointId,
          patientId: 'current',
          findingType: 'diagnostic_point' as const,
          referenceId: f.pointId,
          severity: f.severity,
          notes: f.notes,
          dateRecorded: f.dateRecorded
        }));
        
        interpretation = chapmanPointsPlugin.interpretFindings(findings);
      } catch (error) {
        console.error('Chapman interpretation error:', error);
        interpretation = 'Unable to interpret Chapman point findings';
      }
    }

    return {
      totalFindings: signsCount + symptomsCount + chapmanCount,
      signsCount,
      symptomsCount,
      chapmanCount,
      highSeverityCount,
      interpretation
    };
  }

  /**
   * Add Chapman point finding with validation
   */
  addChapmanFinding(
    assessmentData: AssessmentData,
    pointId: string,
    severity: number,
    notes: string = ''
  ): AssessmentData {
    // Validate severity
    if (severity < 1 || severity > 10) {
      throw new Error(`Invalid severity rating: ${severity}. Must be between 1-10.`);
    }

    // Validate point ID exists
    const chapmanPoint = chapmanPointsPlugin.points?.find(p => p.id === pointId);
    if (!chapmanPoint) {
      throw new Error(`Invalid Chapman point ID: ${pointId}`);
    }

    const finding: ChapmanFinding = {
      pointId,
      severity,
      notes,
      dateRecorded: new Date().toISOString()
    };

    // Check for duplicates
    const existingIndex = assessmentData.chapmanFindings?.findIndex(
      f => f.pointId === pointId
    ) ?? -1;

    if (existingIndex >= 0) {
      // Update existing finding
      const updatedFindings = [...(assessmentData.chapmanFindings || [])];
      updatedFindings[existingIndex] = finding;
      
      return {
        ...assessmentData,
        chapmanFindings: updatedFindings
      };
    } else {
      // Add new finding
      return {
        ...assessmentData,
        chapmanFindings: [...(assessmentData.chapmanFindings || []), finding]
      };
    }
  }

  /**
   * Remove Chapman point finding
   */
  removeChapmanFinding(assessmentData: AssessmentData, pointId: string): AssessmentData {
    return {
      ...assessmentData,
      chapmanFindings: assessmentData.chapmanFindings?.filter(
        f => f.pointId !== pointId
      ) || []
    };
  }

  /**
   * Get assessment recommendations based on findings
   */
  async getAssessmentRecommendations(data: AssessmentData): Promise<string[]> {
    const recommendations: string[] = [];

    // Chapman point recommendations
    if (data.chapmanFindings && data.chapmanFindings.length > 0) {
      const highSeverityPoints = data.chapmanFindings.filter(f => f.severity >= 7);
      
      if (highSeverityPoints.length > 0) {
        recommendations.push(
          `High severity Chapman points detected (${highSeverityPoints.length}). Consider prioritizing lymphatic drainage.`
        );
      }

      // Organ system analysis
      const organSystems = new Set(
        data.chapmanFindings.map(f => {
          const point = chapmanPointsPlugin.points?.find(p => p.id === f.pointId);
          return point?.associatedOrgan;
        }).filter(Boolean)
      );

      if (organSystems.size > 0) {
        recommendations.push(
          `Multiple organ systems affected: ${Array.from(organSystems).join(', ')}. Consider systemic approach.`
        );
      }
    }

    // Signs and symptoms analysis
    if (data.signs && data.signs.length > 5) {
      recommendations.push('Multiple clinical signs present. Consider comprehensive differential diagnosis.');
    }

    if (data.symptoms && data.symptoms.length > 5) {
      recommendations.push('Multiple symptoms reported. Prioritize primary complaints for initial treatment.');
    }

    // Suggest further assessment if minimal findings
    if ((data.signs?.length || 0) + (data.symptoms?.length || 0) + (data.chapmanFindings?.length || 0) < 3) {
      recommendations.push('Limited assessment data. Consider additional diagnostic procedures.');
    }

    return recommendations;
  }

  /**
   * Export assessment data for backup or transfer
   */
  exportAssessmentData(patientId: string = 'current'): string {
    const data = this.loadAssessmentData(patientId);
    if (!data) {
      throw new Error('No assessment data found for export');
    }

    return JSON.stringify({
      exportDate: new Date().toISOString(),
      patientId,
      assessmentData: data,
      version: '1.0'
    }, null, 2);
  }

  /**
   * Clear assessment data for a patient
   */
  clearAssessmentData(patientId: string = 'current'): void {
    try {
      const existingData = this.getStoredAssessments();
      delete existingData[patientId];
      
      this.storage.setItem(this.storageKey, JSON.stringify(existingData));
      console.log('✅ Assessment data cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear assessment data:', error);
      throw error;
    }
  }

  /**
   * Get all stored assessments
   */
  private getStoredAssessments(): Record<string, AssessmentData> {
    try {
      const stored = this.storage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse stored assessment data:', error);
      return {};
    }
  }
}

// Singleton instance
export const assessmentService = new AssessmentService();

// Convenience functions
export const saveAssessment = (data: AssessmentData, patientId?: string) =>
  assessmentService.saveAssessmentData(data, patientId);

export const loadAssessment = (patientId?: string) =>
  assessmentService.loadAssessmentData(patientId);

export const getAssessmentSummary = (data: AssessmentData) =>
  assessmentService.generateAssessmentSummary(data);
