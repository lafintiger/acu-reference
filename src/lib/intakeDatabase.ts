// Patient Intake Database - Separate from main app database
// This handles patient intake data with privacy protection

import { PatientIntake, IntakeAnalysis, TreatmentRecommendation } from '../types/intake';

class IntakeDatabase {
  private readonly INTAKE_STORAGE_KEY = 'acu_intake_data';
  private readonly ANALYSIS_STORAGE_KEY = 'acu_intake_analysis';
  
  // Get all intake records (anonymized IDs only)
  getAllIntakeRecords(): { id: string; initials: string; createdAt: string; updatedAt: string }[] {
    try {
      const data = localStorage.getItem(this.INTAKE_STORAGE_KEY);
      if (!data) return [];
      
      const intakes: PatientIntake[] = JSON.parse(data);
      return intakes.map(intake => ({
        id: intake.id,
        initials: intake.basicInfo.initials,
        createdAt: intake.createdAt,
        updatedAt: intake.updatedAt
      }));
    } catch (error) {
      console.error('Error loading intake records:', error);
      return [];
    }
  }

  // Save intake record
  saveIntakeRecord(intake: PatientIntake): void {
    try {
      const existingData = localStorage.getItem(this.INTAKE_STORAGE_KEY);
      const intakes: PatientIntake[] = existingData ? JSON.parse(existingData) : [];
      
      const existingIndex = intakes.findIndex(i => i.id === intake.id);
      if (existingIndex >= 0) {
        intakes[existingIndex] = { ...intake, updatedAt: new Date().toISOString() };
      } else {
        intakes.push(intake);
      }
      
      localStorage.setItem(this.INTAKE_STORAGE_KEY, JSON.stringify(intakes));
      console.log('Intake record saved locally');
    } catch (error) {
      console.error('Error saving intake record:', error);
      throw new Error('Failed to save intake record');
    }
  }

  // Get specific intake record
  getIntakeRecord(id: string): PatientIntake | null {
    try {
      const data = localStorage.getItem(this.INTAKE_STORAGE_KEY);
      if (!data) return null;
      
      const intakes: PatientIntake[] = JSON.parse(data);
      return intakes.find(intake => intake.id === id) || null;
    } catch (error) {
      console.error('Error loading intake record:', error);
      return null;
    }
  }

  // Delete intake record
  deleteIntakeRecord(id: string): void {
    try {
      const data = localStorage.getItem(this.INTAKE_STORAGE_KEY);
      if (!data) return;
      
      const intakes: PatientIntake[] = JSON.parse(data);
      const filteredIntakes = intakes.filter(intake => intake.id !== id);
      
      localStorage.setItem(this.INTAKE_STORAGE_KEY, JSON.stringify(filteredIntakes));
      
      // Also delete associated analysis
      this.deleteIntakeAnalysis(id);
      
      console.log('Intake record deleted');
    } catch (error) {
      console.error('Error deleting intake record:', error);
    }
  }

  // Save intake analysis
  saveIntakeAnalysis(analysis: IntakeAnalysis): void {
    try {
      const existingData = localStorage.getItem(this.ANALYSIS_STORAGE_KEY);
      const analyses: IntakeAnalysis[] = existingData ? JSON.parse(existingData) : [];
      
      const existingIndex = analyses.findIndex(a => a.patientId === analysis.patientId);
      if (existingIndex >= 0) {
        analyses[existingIndex] = analysis;
      } else {
        analyses.push(analysis);
      }
      
      localStorage.setItem(this.ANALYSIS_STORAGE_KEY, JSON.stringify(analyses));
    } catch (error) {
      console.error('Error saving intake analysis:', error);
    }
  }

  // Get intake analysis
  getIntakeAnalysis(patientId: string): IntakeAnalysis | null {
    try {
      const data = localStorage.getItem(this.ANALYSIS_STORAGE_KEY);
      if (!data) return null;
      
      const analyses: IntakeAnalysis[] = JSON.parse(data);
      return analyses.find(analysis => analysis.patientId === patientId) || null;
    } catch (error) {
      console.error('Error loading intake analysis:', error);
      return null;
    }
  }

  // Delete intake analysis
  deleteIntakeAnalysis(patientId: string): void {
    try {
      const data = localStorage.getItem(this.ANALYSIS_STORAGE_KEY);
      if (!data) return;
      
      const analyses: IntakeAnalysis[] = JSON.parse(data);
      const filteredAnalyses = analyses.filter(analysis => analysis.patientId !== patientId);
      
      localStorage.setItem(this.ANALYSIS_STORAGE_KEY, JSON.stringify(filteredAnalyses));
    } catch (error) {
      console.error('Error deleting intake analysis:', error);
    }
  }

  // Clear all intake data (for privacy/reset)
  clearAllIntakeData(): void {
    try {
      localStorage.removeItem(this.INTAKE_STORAGE_KEY);
      localStorage.removeItem(this.ANALYSIS_STORAGE_KEY);
      console.log('All intake data cleared');
    } catch (error) {
      console.error('Error clearing intake data:', error);
    }
  }

  // Export intake data (for backup - practitioner use only)
  exportIntakeData(): string {
    try {
      const intakes = localStorage.getItem(this.INTAKE_STORAGE_KEY) || '[]';
      const analyses = localStorage.getItem(this.ANALYSIS_STORAGE_KEY) || '[]';
      
      const exportData = {
        intakes: JSON.parse(intakes),
        analyses: JSON.parse(analyses),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting intake data:', error);
      return '{}';
    }
  }

  // Import intake data (for restore - practitioner use only)
  importIntakeData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.intakes) {
        localStorage.setItem(this.INTAKE_STORAGE_KEY, JSON.stringify(data.intakes));
      }
      
      if (data.analyses) {
        localStorage.setItem(this.ANALYSIS_STORAGE_KEY, JSON.stringify(data.analyses));
      }
      
      console.log('Intake data imported successfully');
    } catch (error) {
      console.error('Error importing intake data:', error);
      throw new Error('Invalid intake data format');
    }
  }
}

export const intakeDb = new IntakeDatabase();
