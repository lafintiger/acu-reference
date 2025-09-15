// Clinical Workflow Types - Professional Architecture
// Separates assessment, diagnosis, and treatment as distinct clinical phases

// ========================================
// ASSESSMENT PHASE - Observable Data
// ========================================

export interface Sign {
  id: string;
  name: string;
  category: 'vital_signs' | 'physical_exam' | 'observation' | 'palpation';
  description: string;
  measurable: boolean;
  normalRange?: string;
  clinicalSignificance: string;
}

export interface Symptom {
  id: string;
  name: string;
  category: 'pain' | 'functional' | 'emotional' | 'sensory' | 'systemic';
  description: string;
  severity: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  duration: string;
  frequency: 'constant' | 'intermittent' | 'episodic' | 'progressive';
  triggers?: string[];
  alleviatingFactors?: string[];
}

export interface DiagnosticPoint {
  id: string;
  system: 'chapman' | 'ridler' | 'bennett' | 'trigger' | 'tender' | 'ah_shi';
  name: string;
  location: string;
  anatomicalLandmarks: string[];
  associatedOrgan?: string;
  associatedMeridian?: string;
  testingMethod: string;
  positiveFindings: string[];
  clinicalSignificance: string;
  relatedConditions: string[];
}

export interface AssessmentFinding {
  id: string;
  patientId: string;
  findingType: 'sign' | 'symptom' | 'diagnostic_point' | 'pattern';
  referenceId: string; // ID of the sign/symptom/point
  severity?: number;
  notes?: string;
  dateRecorded: string;
  practitionerId?: string;
}

// ========================================
// DIAGNOSIS PHASE - Clinical Conclusions
// ========================================

export interface Diagnosis {
  id: string;
  name: string;
  category: 'primary' | 'secondary' | 'differential' | 'working';
  type: 'western' | 'tcm_pattern' | 'functional' | 'constitutional';
  description: string;
  diagnosticCriteria: string[];
  associatedSigns: string[];
  associatedSymptoms: string[];
  prognosis: 'excellent' | 'good' | 'fair' | 'guarded' | 'poor';
  treatmentApproach: string;
}

export interface TCMPattern {
  id: string;
  name: string;
  chineseName?: string;
  category: 'qi_blood' | 'organ_system' | 'pathogen' | 'constitutional';
  description: string;
  keySymptoms: string[];
  tonguePresentation?: string;
  pulseQuality?: string;
  treatmentPrinciple: string;
  recommendedPoints: string[];
  recommendedHerbs?: string[];
  lifestyleRecommendations: string[];
}

export interface ClinicalConclusion {
  id: string;
  patientId: string;
  assessmentFindings: string[]; // Assessment finding IDs
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  tcmPattern?: string;
  confidence: number; // 0-100
  reasoning: string;
  differentialDiagnoses?: string[];
  dateFormulated: string;
  practitionerId?: string;
}

// ========================================
// TREATMENT PHASE - Therapeutic Interventions
// ========================================

export interface TreatmentPoint {
  id: string;
  type: 'acupuncture' | 'acupressure' | 'trigger' | 'motor' | 'master';
  name: string;
  location: string;
  indications: string[]; // Links to diagnosis IDs
  contraindications: string[];
  techniques: TreatmentTechnique[];
  evidenceLevel: 'high' | 'moderate' | 'low' | 'traditional';
  clinicalNotes: string;
}

export interface TreatmentTechnique {
  id: string;
  name: string;
  description: string;
  application: string;
  duration: string;
  intensity: 'light' | 'moderate' | 'firm' | 'variable';
  equipment?: string[];
  contraindications: string[];
  modifications: {
    condition: string;
    modification: string;
  }[];
}

export interface TreatmentProtocol {
  id: string;
  name: string;
  targetDiagnosis: string; // Links to diagnosis ID
  evidence: 'research_based' | 'clinical_experience' | 'traditional' | 'theoretical';
  phases: TreatmentPhase[];
  totalDuration: string;
  frequency: string;
  expectedOutcomes: string[];
  successRate?: number;
  contraindications: string[];
  monitoring: string[];
}

export interface TreatmentPhase {
  id: string;
  name: string;
  order: number;
  objective: string;
  duration: string;
  points: string[];
  techniques: string[];
  modalities: string[];
  assessmentCriteria: string[]; // How to know this phase is complete
  nextPhaseConditions: string[];
}

// ========================================
// MONITORING PHASE - Outcome Tracking
// ========================================

export interface TreatmentOutcome {
  id: string;
  patientId: string;
  treatmentProtocolId: string;
  sessionDate: string;
  preTreatmentAssessment: {
    symptoms: { id: string; severity: number }[];
    signs: { id: string; finding: string }[];
    diagnosticPoints: { id: string; positive: boolean }[];
  };
  postTreatmentAssessment: {
    symptoms: { id: string; severity: number }[];
    signs: { id: string; finding: string }[];
    patientResponse: 'excellent' | 'good' | 'fair' | 'poor' | 'adverse';
  };
  treatmentModifications?: string[];
  adverseEvents?: string[];
  practitionerNotes?: string;
  nextTreatmentPlan?: string;
}

// ========================================
// CLINICAL WORKFLOW - Integration
// ========================================

export interface ClinicalSession {
  id: string;
  patientId: string;
  sessionDate: string;
  sessionType: 'initial_assessment' | 'follow_up' | 'treatment_only' | 'reassessment';
  
  // Workflow phases
  assessment?: {
    signsSymptoms: AssessmentFinding[];
    diagnosticPointTests: AssessmentFinding[];
    clinicalObservations: string[];
  };
  
  diagnosis?: {
    clinicalConclusions: ClinicalConclusion[];
    differentialDiagnoses: string[];
    treatmentPlan: string;
  };
  
  treatment?: {
    protocolsUsed: string[];
    pointsActivated: string[];
    modalitiesApplied: string[];
    patientResponse: string;
  };
  
  monitoring?: {
    outcomeAssessment: TreatmentOutcome;
    progressNotes: string;
    nextSteps: string;
  };
  
  practitionerId?: string;
  duration: number; // Minutes
  notes: string;
}

// ========================================
// PLUGIN SYSTEM - Modular Components
// ========================================

export interface DiagnosticPlugin {
  id: string;
  name: string;
  type: 'point_system' | 'pattern_recognition' | 'assessment_tool';
  points?: DiagnosticPoint[];
  assessmentMethod: string;
  interpretation: string;
  clinicalApplications: string[];
  
  // Plugin methods
  performAssessment(patientData: any): AssessmentFinding[];
  interpretFindings(findings: AssessmentFinding[]): string;
  getSuggestedDiagnoses(findings: AssessmentFinding[]): string[];
}

export interface TreatmentPlugin {
  id: string;
  name: string;
  type: 'modality' | 'point_system' | 'protocol_set';
  protocols: TreatmentProtocol[];
  points?: TreatmentPoint[];
  techniques: TreatmentTechnique[];
  
  // Plugin methods
  getProtocolsForDiagnosis(diagnosisId: string): TreatmentProtocol[];
  getPointsForCondition(condition: string): TreatmentPoint[];
  validateSafety(patientData: any): { safe: boolean; warnings: string[] };
}
