// Clinical Notes Database - Personal practitioner notes and customizations
// Separate from patient data, focused on practitioner knowledge building

import { 
  ClinicalNote, 
  PointCustomization, 
  ProtocolCustomization, 
  TreatmentOutcome, 
  ClinicalInsight,
  PractitionerPreferences 
} from '../../types/clinical-notes';

class ClinicalNotesDatabase {
  private readonly NOTES_KEY = 'acu_clinical_notes';
  private readonly POINT_CUSTOMIZATIONS_KEY = 'acu_point_customizations';
  private readonly PROTOCOL_CUSTOMIZATIONS_KEY = 'acu_protocol_customizations';
  private readonly TREATMENT_OUTCOMES_KEY = 'acu_treatment_outcomes';
  private readonly CLINICAL_INSIGHTS_KEY = 'acu_clinical_insights';
  private readonly PREFERENCES_KEY = 'acu_practitioner_preferences';

  // Clinical Notes Management
  saveNote(note: ClinicalNote): void {
    try {
      const notes = this.getAllNotes();
      const existingIndex = notes.findIndex(n => n.id === note.id);
      
      if (existingIndex >= 0) {
        notes[existingIndex] = { ...note, updatedAt: new Date().toISOString() };
      } else {
        notes.push(note);
      }
      
      localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
      console.log('Clinical note saved');
    } catch (error) {
      console.error('Failed to save clinical note:', error);
    }
  }

  getAllNotes(): ClinicalNote[] {
    try {
      const data = localStorage.getItem(this.NOTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load clinical notes:', error);
      return [];
    }
  }

  getNotesByType(type: ClinicalNote['type']): ClinicalNote[] {
    return this.getAllNotes().filter(note => note.type === type);
  }

  getNotesByReference(referenceId: string): ClinicalNote[] {
    return this.getAllNotes().filter(note => note.referenceId === referenceId);
  }

  deleteNote(noteId: string): void {
    try {
      const notes = this.getAllNotes().filter(note => note.id !== noteId);
      localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to delete clinical note:', error);
    }
  }

  // Point Customizations
  savePointCustomization(customization: PointCustomization): void {
    try {
      const customizations = this.getAllPointCustomizations();
      const existingIndex = customizations.findIndex(c => c.pointId === customization.pointId);
      
      if (existingIndex >= 0) {
        customizations[existingIndex] = customization;
      } else {
        customizations.push(customization);
      }
      
      localStorage.setItem(this.POINT_CUSTOMIZATIONS_KEY, JSON.stringify(customizations));
    } catch (error) {
      console.error('Failed to save point customization:', error);
    }
  }

  getAllPointCustomizations(): PointCustomization[] {
    try {
      const data = localStorage.getItem(this.POINT_CUSTOMIZATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load point customizations:', error);
      return [];
    }
  }

  getPointCustomization(pointId: string): PointCustomization | null {
    const customizations = this.getAllPointCustomizations();
    return customizations.find(c => c.pointId === pointId) || null;
  }

  // Protocol Customizations
  saveProtocolCustomization(customization: ProtocolCustomization): void {
    try {
      const customizations = this.getAllProtocolCustomizations();
      const existingIndex = customizations.findIndex(c => c.protocolId === customization.protocolId);
      
      if (existingIndex >= 0) {
        customizations[existingIndex] = customization;
      } else {
        customizations.push(customization);
      }
      
      localStorage.setItem(this.PROTOCOL_CUSTOMIZATIONS_KEY, JSON.stringify(customizations));
    } catch (error) {
      console.error('Failed to save protocol customization:', error);
    }
  }

  getAllProtocolCustomizations(): ProtocolCustomization[] {
    try {
      const data = localStorage.getItem(this.PROTOCOL_CUSTOMIZATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load protocol customizations:', error);
      return [];
    }
  }

  // Treatment Outcomes Tracking
  saveTreatmentOutcome(outcome: TreatmentOutcome): void {
    try {
      const outcomes = this.getAllTreatmentOutcomes();
      const existingIndex = outcomes.findIndex(o => o.id === outcome.id);
      
      if (existingIndex >= 0) {
        outcomes[existingIndex] = outcome;
      } else {
        outcomes.push(outcome);
      }
      
      localStorage.setItem(this.TREATMENT_OUTCOMES_KEY, JSON.stringify(outcomes));
      
      // Generate insights from new data
      this.generateInsights();
    } catch (error) {
      console.error('Failed to save treatment outcome:', error);
    }
  }

  getAllTreatmentOutcomes(): TreatmentOutcome[] {
    try {
      const data = localStorage.getItem(this.TREATMENT_OUTCOMES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load treatment outcomes:', error);
      return [];
    }
  }

  getTreatmentOutcomesForProtocol(protocolId: string): TreatmentOutcome[] {
    return this.getAllTreatmentOutcomes().filter(outcome => outcome.protocolId === protocolId);
  }

  // Clinical Insights Generation
  generateInsights(): void {
    try {
      const outcomes = this.getAllTreatmentOutcomes();
      const insights: ClinicalInsight[] = [];

      // Analyze effectiveness patterns
      const protocolEffectiveness = this.analyzeProtocolEffectiveness(outcomes);
      protocolEffectiveness.forEach(analysis => {
        if (analysis.dataPoints >= 3 && analysis.avgImprovement >= 3) {
          insights.push({
            id: `effectiveness_${analysis.protocolId}_${Date.now()}`,
            type: 'effectiveness',
            title: `${analysis.protocolName} shows consistent results`,
            description: `Based on ${analysis.dataPoints} treatments, average improvement: ${analysis.avgImprovement.toFixed(1)} points`,
            dataPoints: analysis.dataPoints,
            confidence: Math.min(95, analysis.dataPoints * 15),
            recommendation: `Consider using this protocol more frequently for similar cases`,
            generatedAt: new Date().toISOString()
          });
        }
      });

      // Analyze point usage patterns
      const pointUsage = this.analyzePointUsage(outcomes);
      pointUsage.forEach(analysis => {
        if (analysis.dataPoints >= 5 && analysis.successRate >= 0.8) {
          insights.push({
            id: `pattern_${analysis.pointId}_${Date.now()}`,
            type: 'pattern',
            title: `${analysis.pointId} highly effective in your practice`,
            description: `Success rate: ${(analysis.successRate * 100).toFixed(0)}% across ${analysis.dataPoints} treatments`,
            dataPoints: analysis.dataPoints,
            confidence: Math.min(90, analysis.dataPoints * 10),
            recommendation: `Consider this point as a primary choice for relevant conditions`,
            generatedAt: new Date().toISOString()
          });
        }
      });

      // Save insights
      const existingInsights = this.getAllClinicalInsights();
      const newInsights = [...existingInsights, ...insights];
      localStorage.setItem(this.CLINICAL_INSIGHTS_KEY, JSON.stringify(newInsights));
      
      console.log(`Generated ${insights.length} new clinical insights`);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    }
  }

  getAllClinicalInsights(): ClinicalInsight[] {
    try {
      const data = localStorage.getItem(this.CLINICAL_INSIGHTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load clinical insights:', error);
      return [];
    }
  }

  // Practitioner Preferences
  savePractitionerPreferences(preferences: PractitionerPreferences): void {
    try {
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save practitioner preferences:', error);
    }
  }

  getPractitionerPreferences(): PractitionerPreferences | null {
    try {
      const data = localStorage.getItem(this.PREFERENCES_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load practitioner preferences:', error);
      return null;
    }
  }

  // Analytics and Insights
  private analyzeProtocolEffectiveness(outcomes: TreatmentOutcome[]): any[] {
    const protocolGroups = outcomes.reduce((groups, outcome) => {
      if (!groups[outcome.protocolId]) {
        groups[outcome.protocolId] = [];
      }
      groups[outcome.protocolId].push(outcome);
      return groups;
    }, {} as { [key: string]: TreatmentOutcome[] });

    return Object.entries(protocolGroups).map(([protocolId, protocolOutcomes]) => {
      const improvements = protocolOutcomes.map(outcome => 
        outcome.symptomsBeforeTreatment - outcome.symptomsAfterTreatment
      );
      
      const avgImprovement = improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
      
      return {
        protocolId,
        protocolName: protocolId.replace('_', ' '),
        dataPoints: protocolOutcomes.length,
        avgImprovement,
        successRate: protocolOutcomes.filter(o => o.patientResponse === 'good' || o.patientResponse === 'excellent').length / protocolOutcomes.length
      };
    });
  }

  private analyzePointUsage(outcomes: TreatmentOutcome[]): any[] {
    const pointUsage = new Map<string, { successes: number; total: number }>();

    outcomes.forEach(outcome => {
      outcome.pointsUsed.forEach(pointId => {
        const current = pointUsage.get(pointId) || { successes: 0, total: 0 };
        current.total++;
        
        if (outcome.patientResponse === 'good' || outcome.patientResponse === 'excellent') {
          current.successes++;
        }
        
        pointUsage.set(pointId, current);
      });
    });

    return Array.from(pointUsage.entries()).map(([pointId, usage]) => ({
      pointId,
      dataPoints: usage.total,
      successRate: usage.successes / usage.total
    }));
  }

  // Export/Import for backup
  exportClinicalData(): string {
    try {
      const data = {
        notes: this.getAllNotes(),
        pointCustomizations: this.getAllPointCustomizations(),
        protocolCustomizations: this.getAllProtocolCustomizations(),
        treatmentOutcomes: this.getAllTreatmentOutcomes(),
        clinicalInsights: this.getAllClinicalInsights(),
        preferences: this.getPractitionerPreferences(),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export clinical data:', error);
      return '{}';
    }
  }

  importClinicalData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.notes) localStorage.setItem(this.NOTES_KEY, JSON.stringify(data.notes));
      if (data.pointCustomizations) localStorage.setItem(this.POINT_CUSTOMIZATIONS_KEY, JSON.stringify(data.pointCustomizations));
      if (data.protocolCustomizations) localStorage.setItem(this.PROTOCOL_CUSTOMIZATIONS_KEY, JSON.stringify(data.protocolCustomizations));
      if (data.treatmentOutcomes) localStorage.setItem(this.TREATMENT_OUTCOMES_KEY, JSON.stringify(data.treatmentOutcomes));
      if (data.clinicalInsights) localStorage.setItem(this.CLINICAL_INSIGHTS_KEY, JSON.stringify(data.clinicalInsights));
      if (data.preferences) localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(data.preferences));
      
      console.log('Clinical data imported successfully');
    } catch (error) {
      console.error('Failed to import clinical data:', error);
      throw new Error('Invalid clinical data format');
    }
  }

  // Clear all clinical data
  clearAllClinicalData(): void {
    try {
      localStorage.removeItem(this.NOTES_KEY);
      localStorage.removeItem(this.POINT_CUSTOMIZATIONS_KEY);
      localStorage.removeItem(this.PROTOCOL_CUSTOMIZATIONS_KEY);
      localStorage.removeItem(this.TREATMENT_OUTCOMES_KEY);
      localStorage.removeItem(this.CLINICAL_INSIGHTS_KEY);
      localStorage.removeItem(this.PREFERENCES_KEY);
      console.log('All clinical data cleared');
    } catch (error) {
      console.error('Failed to clear clinical data:', error);
    }
  }
}

export const clinicalNotesDb = new ClinicalNotesDatabase();
