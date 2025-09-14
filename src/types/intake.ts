// Patient Intake System Types
// This file defines the data structure for patient intake information

export interface PatientIntake {
  id: string;
  createdAt: string;
  updatedAt: string;
  
  // Basic Information
  basicInfo: {
    initials: string; // Only initials for privacy
    age: number;
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    occupation?: string;
    referralSource?: string;
  };

  // Chief Complaint
  chiefComplaint: {
    primaryConcern: string;
    duration: string;
    severity: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    onsetType: 'gradual' | 'sudden' | 'unknown';
    triggers?: string[];
    previousTreatments?: string[];
  };

  // Health History
  healthHistory: {
    currentMedications?: string[];
    allergies?: string[];
    surgeries?: string[];
    chronicConditions?: string[];
    familyHistory?: string[];
    pregnancyStatus?: 'pregnant' | 'trying' | 'not_applicable' | 'unknown';
  };

  // TCM Assessment
  tcmAssessment: {
    constitution: 'hot' | 'cold' | 'damp' | 'dry' | 'mixed' | 'unknown';
    tongueDescription?: {
      color: 'pale' | 'normal' | 'red' | 'purple' | 'other';
      coating: 'none' | 'thin_white' | 'thick_white' | 'yellow' | 'other';
      texture: 'normal' | 'swollen' | 'thin' | 'cracked' | 'other';
    };
    pulseQuality?: {
      rate: 'slow' | 'normal' | 'fast';
      strength: 'weak' | 'normal' | 'strong';
      quality: 'slippery' | 'wiry' | 'choppy' | 'floating' | 'deep' | 'other';
    };
    emotionalState?: string[];
    sleepPattern?: 'good' | 'difficulty_falling_asleep' | 'frequent_waking' | 'early_waking' | 'restless';
    digestiveHealth?: 'good' | 'constipation' | 'diarrhea' | 'irregular' | 'bloating' | 'nausea';
    energyLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  };

  // Physical Assessment
  physicalAssessment: {
    posture?: string;
    gait?: string;
    skinCondition?: string;
    temperaturePreference?: 'prefers_warm' | 'prefers_cool' | 'no_preference';
    painAreas?: {
      location: string;
      type: 'sharp' | 'dull' | 'burning' | 'tingling' | 'cramping' | 'other';
      intensity: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
      timing: 'constant' | 'intermittent' | 'morning' | 'evening' | 'activity_related';
    }[];
  };

  // Lifestyle Factors
  lifestyle: {
    stressLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    exerciseFrequency?: 'none' | 'occasional' | 'regular' | 'intensive';
    dietType?: 'balanced' | 'vegetarian' | 'vegan' | 'high_protein' | 'processed' | 'other';
    smokingStatus?: 'never' | 'former' | 'current_light' | 'current_heavy';
    alcoholConsumption?: 'none' | 'occasional' | 'moderate' | 'heavy';
    waterIntake?: 'low' | 'adequate' | 'high';
    workEnvironment?: 'sedentary' | 'active' | 'stressful' | 'toxic_exposure';
  };

  // Treatment Goals & Preferences
  treatmentPreferences: {
    primaryGoals: string[];
    modalityPreferences?: ('acupressure' | 'cupping' | 'gua_sha' | 'applied_kinesiology')[];
    pressurePreference?: 'light' | 'moderate' | 'firm' | 'varies';
    sessionFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'as_needed';
    contraindications?: string[];
    concerns?: string[];
  };

  // Clinical Notes
  clinicalNotes?: {
    practitionerObservations?: string;
    recommendedTests?: string[];
    treatmentPlan?: string;
    followUpNeeded?: boolean;
    additionalNotes?: string;
  };
}

export interface IntakeFormSection {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export interface TreatmentRecommendation {
  modality: 'acupressure' | 'cupping' | 'gua_sha' | 'applied_kinesiology';
  points: string[];
  techniques: string[];
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  contraindications?: string[];
}

export interface IntakeAnalysis {
  patientId: string;
  tcmPattern?: string;
  primaryIndications: string[];
  secondaryIndications: string[];
  recommendedTreatments: TreatmentRecommendation[];
  safetyConsiderations: string[];
  lifestyleRecommendations: string[];
  followUpSuggestions: string[];
}
