// ValidationService Tests
import { ClinicalValidationService, AssessmentData, TreatmentPlan, ChapmanFinding } from '../ValidationService';

describe('ClinicalValidationService', () => {
  let validationService: ClinicalValidationService;

  beforeEach(() => {
    validationService = new ClinicalValidationService();
  });

  describe('validateAssessmentData', () => {
    it('should validate correct assessment data', () => {
      const validAssessment: AssessmentData = {
        signs: ['muscle_tension_neck'],
        symptoms: ['headache_tension'],
        chapmanFindings: [{
          pointId: 'chapman_liver_anterior',
          severity: 7,
          notes: 'Tender nodule detected',
          dateRecorded: new Date().toISOString()
        }],
        notes: 'Patient assessment completed'
      };

      const result = validationService.validateAssessmentData(validAssessment);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid Chapman point severity', () => {
      const invalidAssessment: AssessmentData = {
        signs: [],
        symptoms: [],
        chapmanFindings: [{
          pointId: 'chapman_liver_anterior',
          severity: 15, // Invalid: > 10
          notes: 'Test',
          dateRecorded: new Date().toISOString()
        }]
      };

      const result = validationService.validateAssessmentData(invalidAssessment);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => 
        error.includes('Invalid severity rating (15)')
      )).toBe(true);
    });

    it('should warn about high severity findings', () => {
      const highSeverityAssessment: AssessmentData = {
        signs: ['muscle_tension_neck'],
        symptoms: [],
        chapmanFindings: [{
          pointId: 'chapman_liver_anterior',
          severity: 9, // High severity
          notes: 'Severe tenderness',
          dateRecorded: new Date().toISOString()
        }]
      };

      const result = validationService.validateAssessmentData(highSeverityAssessment);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(warning => 
        warning.includes('High severity (9)')
      )).toBe(true);
    });

    it('should require minimum assessment data', () => {
      const emptyAssessment: AssessmentData = {
        signs: [],
        symptoms: [],
        chapmanFindings: []
      };

      const result = validationService.validateAssessmentData(emptyAssessment);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Assessment must include at least one sign, symptom, or Chapman point finding.'
      );
    });

    it('should validate Chapman finding dates', () => {
      const invalidDateAssessment: AssessmentData = {
        signs: [],
        symptoms: [],
        chapmanFindings: [{
          pointId: 'chapman_liver_anterior',
          severity: 5,
          notes: 'Test',
          dateRecorded: 'invalid-date'
        }]
      };

      const result = validationService.validateAssessmentData(invalidDateAssessment);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => 
        error.includes('Invalid or missing date')
      )).toBe(true);
    });
  });

  describe('validateTreatmentPlan', () => {
    it('should validate correct treatment plan', () => {
      const validPlan: TreatmentPlan = {
        diagnosis: 'tension_headache_syndrome',
        selectedPoints: ['LI4', 'GB20', 'GV20'],
        modalities: ['acupressure'],
        goals: ['Reduce headache frequency'],
        contraindications: []
      };

      const result = validationService.validateTreatmentPlan(validPlan);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require diagnosis or TCM pattern', () => {
      const incompletePlan: TreatmentPlan = {
        selectedPoints: ['LI4'],
        modalities: ['acupressure'],
        goals: []
      };

      const result = validationService.validateTreatmentPlan(incompletePlan);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Treatment plan must include either a clinical diagnosis or TCM pattern.'
      );
    });

    it('should require at least one treatment point', () => {
      const noPointsPlan: TreatmentPlan = {
        diagnosis: 'tension_headache_syndrome',
        selectedPoints: [],
        modalities: ['acupressure'],
        goals: ['Reduce pain']
      };

      const result = validationService.validateTreatmentPlan(noPointsPlan);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Treatment plan must include at least one acupuncture point.'
      );
    });

    it('should warn about too many points', () => {
      const manyPointsPlan: TreatmentPlan = {
        diagnosis: 'complex_condition',
        selectedPoints: Array.from({length: 25}, (_, i) => `Point${i}`),
        modalities: ['acupressure'],
        goals: ['Comprehensive treatment']
      };

      const result = validationService.validateTreatmentPlan(manyPointsPlan);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(warning => 
        warning.includes('Large number of points selected (25)')
      )).toBe(true);
    });

    it('should warn about contraindications', () => {
      const contraindicatedPlan: TreatmentPlan = {
        diagnosis: 'tension_headache_syndrome',
        selectedPoints: ['LI4', 'SP6'], // SP6 contraindicated in pregnancy
        modalities: ['acupressure'],
        goals: ['Reduce pain'],
        contraindications: ['pregnancy']
      };

      const result = validationService.validateTreatmentPlan(contraindicatedPlan);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(warning => 
        warning.includes('Contraindications noted: pregnancy')
      )).toBe(true);
    });
  });

  describe('validateWHOCompliance', () => {
    it('should validate WHO compliant point', () => {
      const whoPoint = {
        id: 'LI4',
        nameEn: 'Hegu',
        location: 'Between the 1st and 2nd metacarpal bones, closer to the 2nd metacarpal bone'
      };

      const result = validationService.validateWHOCompliance(whoPoint);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const incompletePoint = {
        id: 'LI4'
        // Missing nameEn and location
      };

      const result = validationService.validateWHOCompliance(incompletePoint);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing or invalid required field: nameEn');
      expect(result.errors).toContain('Missing or invalid required field: location');
    });

    it('should warn about non-standard point ID format', () => {
      const nonStandardPoint = {
        id: 'CUSTOM1', // Non-standard format
        nameEn: 'Custom Point',
        location: 'Custom location description'
      };

      const result = validationService.validateWHOCompliance(nonStandardPoint);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(warning => 
        warning.includes('may not follow WHO standard format')
      )).toBe(true);
    });

    it('should warn about brief location descriptions', () => {
      const briefPoint = {
        id: 'LI4',
        nameEn: 'Hegu',
        location: 'Hand' // Too brief
      };

      const result = validationService.validateWHOCompliance(briefPoint);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings).toContain(
        'Location description may be too brief for clinical use.'
      );
    });
  });

  describe('validateDataIntegrity', () => {
    it('should validate good data integrity', () => {
      const goodData = {
        id: 'test123',
        content: 'Some content',
        dateCreated: new Date().toISOString()
      };

      const result = validationService.validateDataIntegrity(goodData, 'Test Data');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect null data', () => {
      const result = validationService.validateDataIntegrity(null, 'Test Data');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Test Data data is null or undefined.');
    });

    it('should warn about large data size', () => {
      const largeData = {
        content: 'x'.repeat(1500000) // > 1MB
      };

      const result = validationService.validateDataIntegrity(largeData, 'Large Data');
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(warning => 
        warning.includes('Large data size')
      )).toBe(true);
    });
  });

  describe('validateWorkshopContent', () => {
    it('should validate good workshop content', () => {
      const goodContent = {
        protocols: [
          {
            name: 'Test Protocol',
            indication: 'headache',
            technique: 'Apply gentle pressure',
            contraindications: ['pregnancy']
          }
        ]
      };

      const result = validationService.validateWorkshopContent(goodContent);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing protocol name', () => {
      const badContent = {
        protocols: [
          {
            indication: 'headache',
            technique: 'Apply pressure'
          }
        ]
      };

      const result = validationService.validateWorkshopContent(badContent);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Protocol 1: Missing or invalid name.'
      );
    });

    it('should warn about missing safety information', () => {
      const unsafeContent = {
        protocols: [
          {
            name: 'Test Protocol',
            indication: 'headache',
            technique: 'Apply pressure'
            // Missing contraindications
          }
        ]
      };

      const result = validationService.validateWorkshopContent(unsafeContent);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(warning => 
        warning.includes('No contraindications specified')
      )).toBe(true);
    });
  });
});
