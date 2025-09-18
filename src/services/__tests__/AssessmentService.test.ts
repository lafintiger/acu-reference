// AssessmentService Tests
import { AssessmentService, AssessmentData } from '../AssessmentService';

// Mock the validation service
jest.mock('../ValidationService', () => ({
  validationService: {
    validateAssessmentData: jest.fn().mockReturnValue({
      isValid: true,
      errors: [],
      warnings: []
    })
  }
}));

// Mock the Chapman points plugin
jest.mock('../../plugins/diagnostic/chapman-points-plugin', () => ({
  chapmanPointsPlugin: {
    interpretFindings: jest.fn().mockReturnValue('Liver congestion detected'),
    points: [
      {
        id: 'chapman_liver_anterior',
        name: 'Liver (Anterior)',
        associatedOrgan: 'liver'
      }
    ]
  }
}));

describe('AssessmentService', () => {
  let assessmentService: AssessmentService;
  let mockLocalStorage: any;

  beforeEach(() => {
    assessmentService = new AssessmentService();
    
    // Mock localStorage
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(assessmentService, 'storage', {
      value: mockLocalStorage,
      writable: true
    });

    jest.clearAllMocks();
  });

  describe('saveAssessmentData', () => {
    it('should save valid assessment data', async () => {
      const assessmentData: AssessmentData = {
        signs: ['muscle_tension_neck'],
        symptoms: ['headache_tension'],
        chapmanFindings: [{
          pointId: 'chapman_liver_anterior',
          severity: 7,
          notes: 'Tender nodule',
          dateRecorded: new Date().toISOString()
        }]
      };

      mockLocalStorage.getItem.mockReturnValue('{}');

      await assessmentService.saveAssessmentData(assessmentData, 'test-patient');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'acu_assessment_data',
        expect.stringContaining('test-patient')
      );
    });

    it('should throw error for invalid assessment data', async () => {
      const { validationService } = require('../ValidationService');
      validationService.validateAssessmentData.mockReturnValue({
        isValid: false,
        errors: ['Invalid severity rating'],
        warnings: []
      });

      const invalidData: AssessmentData = {
        signs: [],
        symptoms: [],
        chapmanFindings: []
      };

      await expect(
        assessmentService.saveAssessmentData(invalidData)
      ).rejects.toThrow('Assessment validation failed');
    });
  });

  describe('loadAssessmentData', () => {
    it('should load existing assessment data', () => {
      const storedData = {
        'test-patient': {
          signs: ['muscle_tension_neck'],
          symptoms: ['headache_tension'],
          chapmanFindings: []
        }
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

      const result = assessmentService.loadAssessmentData('test-patient');

      expect(result).toEqual(storedData['test-patient']);
    });

    it('should return null for non-existent patient', () => {
      mockLocalStorage.getItem.mockReturnValue('{}');

      const result = assessmentService.loadAssessmentData('non-existent');

      expect(result).toBeNull();
    });

    it('should handle storage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = assessmentService.loadAssessmentData('test-patient');

      expect(result).toBeNull();
    });
  });

  describe('generateAssessmentSummary', () => {
    it('should generate correct summary for complete assessment', () => {
      const assessmentData: AssessmentData = {
        signs: ['sign1', 'sign2'],
        symptoms: ['symptom1', 'symptom2', 'symptom3'],
        chapmanFindings: [
          {
            pointId: 'chapman_liver_anterior',
            severity: 8,
            notes: 'High severity',
            dateRecorded: new Date().toISOString()
          },
          {
            pointId: 'chapman_heart_anterior',
            severity: 5,
            notes: 'Moderate',
            dateRecorded: new Date().toISOString()
          }
        ]
      };

      const summary = assessmentService.generateAssessmentSummary(assessmentData);

      expect(summary.totalFindings).toBe(7); // 2 signs + 3 symptoms + 2 chapman
      expect(summary.signsCount).toBe(2);
      expect(summary.symptomsCount).toBe(3);
      expect(summary.chapmanCount).toBe(2);
      expect(summary.highSeverityCount).toBe(1); // Only severity 8
      expect(summary.interpretation).toBe('Liver congestion detected');
    });

    it('should handle empty assessment data', () => {
      const emptyData: AssessmentData = {
        signs: [],
        symptoms: [],
        chapmanFindings: []
      };

      const summary = assessmentService.generateAssessmentSummary(emptyData);

      expect(summary.totalFindings).toBe(0);
      expect(summary.signsCount).toBe(0);
      expect(summary.symptomsCount).toBe(0);
      expect(summary.chapmanCount).toBe(0);
      expect(summary.highSeverityCount).toBe(0);
      expect(summary.interpretation).toBeUndefined();
    });
  });

  describe('addChapmanFinding', () => {
    it('should add new Chapman finding', () => {
      const initialData: AssessmentData = {
        signs: [],
        symptoms: [],
        chapmanFindings: []
      };

      const result = assessmentService.addChapmanFinding(
        initialData,
        'chapman_liver_anterior',
        7,
        'Tender nodule detected'
      );

      expect(result.chapmanFindings).toHaveLength(1);
      expect(result.chapmanFindings[0].pointId).toBe('chapman_liver_anterior');
      expect(result.chapmanFindings[0].severity).toBe(7);
      expect(result.chapmanFindings[0].notes).toBe('Tender nodule detected');
    });

    it('should update existing Chapman finding', () => {
      const initialData: AssessmentData = {
        signs: [],
        symptoms: [],
        chapmanFindings: [{
          pointId: 'chapman_liver_anterior',
          severity: 5,
          notes: 'Initial finding',
          dateRecorded: '2023-01-01T00:00:00.000Z'
        }]
      };

      const result = assessmentService.addChapmanFinding(
        initialData,
        'chapman_liver_anterior',
        8,
        'Updated finding'
      );

      expect(result.chapmanFindings).toHaveLength(1);
      expect(result.chapmanFindings[0].severity).toBe(8);
      expect(result.chapmanFindings[0].notes).toBe('Updated finding');
    });

    it('should validate severity range', () => {
      const initialData: AssessmentData = {
        signs: [],
        symptoms: [],
        chapmanFindings: []
      };

      expect(() => {
        assessmentService.addChapmanFinding(
          initialData,
          'chapman_liver_anterior',
          15, // Invalid severity
          'Test'
        );
      }).toThrow('Invalid severity rating: 15');
    });

    it('should validate point ID exists', () => {
      const initialData: AssessmentData = {
        signs: [],
        symptoms: [],
        chapmanFindings: []
      };

      expect(() => {
        assessmentService.addChapmanFinding(
          initialData,
          'invalid_point_id',
          7,
          'Test'
        );
      }).toThrow('Invalid Chapman point ID: invalid_point_id');
    });
  });

  describe('removeChapmanFinding', () => {
    it('should remove Chapman finding', () => {
      const initialData: AssessmentData = {
        signs: [],
        symptoms: [],
        chapmanFindings: [
          {
            pointId: 'chapman_liver_anterior',
            severity: 7,
            notes: 'Finding 1',
            dateRecorded: new Date().toISOString()
          },
          {
            pointId: 'chapman_heart_anterior',
            severity: 6,
            notes: 'Finding 2',
            dateRecorded: new Date().toISOString()
          }
        ]
      };

      const result = assessmentService.removeChapmanFinding(
        initialData,
        'chapman_liver_anterior'
      );

      expect(result.chapmanFindings).toHaveLength(1);
      expect(result.chapmanFindings[0].pointId).toBe('chapman_heart_anterior');
    });
  });

  describe('getAssessmentRecommendations', () => {
    it('should provide recommendations for high severity findings', async () => {
      const assessmentData: AssessmentData = {
        signs: [],
        symptoms: [],
        chapmanFindings: [
          {
            pointId: 'chapman_liver_anterior',
            severity: 9,
            notes: 'Very tender',
            dateRecorded: new Date().toISOString()
          }
        ]
      };

      const recommendations = await assessmentService.getAssessmentRecommendations(assessmentData);

      expect(recommendations.some(rec => 
        rec.includes('High severity Chapman points detected')
      )).toBe(true);
    });

    it('should recommend comprehensive diagnosis for multiple signs', async () => {
      const assessmentData: AssessmentData = {
        signs: ['sign1', 'sign2', 'sign3', 'sign4', 'sign5', 'sign6'],
        symptoms: [],
        chapmanFindings: []
      };

      const recommendations = await assessmentService.getAssessmentRecommendations(assessmentData);

      expect(recommendations).toContain(
        'Multiple clinical signs present. Consider comprehensive differential diagnosis.'
      );
    });

    it('should suggest additional assessment for minimal data', async () => {
      const assessmentData: AssessmentData = {
        signs: ['one_sign'],
        symptoms: [],
        chapmanFindings: []
      };

      const recommendations = await assessmentService.getAssessmentRecommendations(assessmentData);

      expect(recommendations).toContain(
        'Limited assessment data. Consider additional diagnostic procedures.'
      );
    });
  });

  describe('exportAssessmentData', () => {
    it('should export assessment data as JSON', () => {
      const storedData = {
        'test-patient': {
          signs: ['muscle_tension_neck'],
          symptoms: ['headache_tension'],
          chapmanFindings: []
        }
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

      const exported = assessmentService.exportAssessmentData('test-patient');
      const parsedExport = JSON.parse(exported);

      expect(parsedExport.patientId).toBe('test-patient');
      expect(parsedExport.assessmentData).toEqual(storedData['test-patient']);
      expect(parsedExport.version).toBe('1.0');
      expect(parsedExport.exportDate).toBeDefined();
    });

    it('should throw error for non-existent patient', () => {
      mockLocalStorage.getItem.mockReturnValue('{}');

      expect(() => {
        assessmentService.exportAssessmentData('non-existent');
      }).toThrow('No assessment data found for export');
    });
  });

  describe('clearAssessmentData', () => {
    it('should clear assessment data for specific patient', () => {
      const storedData = {
        'patient1': { signs: [], symptoms: [], chapmanFindings: [] },
        'patient2': { signs: [], symptoms: [], chapmanFindings: [] }
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

      assessmentService.clearAssessmentData('patient1');

      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData).not.toHaveProperty('patient1');
      expect(savedData).toHaveProperty('patient2');
    });
  });
});
