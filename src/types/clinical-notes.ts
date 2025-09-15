// Clinical Notes System Types
// Personal practitioner notes and customizations

export interface ClinicalNote {
  id: string;
  type: 'point' | 'indication' | 'protocol' | 'patient' | 'general';
  referenceId: string; // ID of the point, indication, protocol, etc.
  title: string;
  content: string;
  tags: string[];
  category: 'observation' | 'modification' | 'reminder' | 'research' | 'personal';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  practitionerId?: string; // For multi-practitioner setups
  isPrivate: boolean;
  attachments?: NoteAttachment[];
}

export interface NoteAttachment {
  id: string;
  type: 'image' | 'audio' | 'document' | 'link';
  name: string;
  url: string;
  size?: number;
  description?: string;
}

export interface PointCustomization {
  pointId: string;
  personalName?: string; // Your own name for the point
  personalLocation?: string; // Your location description
  personalTechnique?: string; // Your preferred technique
  personalNotes?: string;
  effectivenessRating?: number; // 1-10 based on your experience
  frequencyUsed?: number; // How often you use this point
  lastUsed?: string;
  patientFeedback?: string[];
  modifications?: {
    condition: string;
    modification: string;
    reasoning: string;
  }[];
}

export interface ProtocolCustomization {
  protocolId: string;
  personalName?: string;
  modifications: ProtocolModification[];
  successRate?: number; // Your success rate with this protocol
  averageDuration?: string; // Your typical duration
  personalNotes?: string;
  patientTypes?: string[]; // Which patients this works best for
  seasonalAdjustments?: {
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    adjustments: string;
  }[];
}

export interface ProtocolModification {
  id: string;
  type: 'point_addition' | 'point_removal' | 'technique_change' | 'duration_change' | 'sequence_change';
  description: string;
  reasoning: string;
  effectivenessChange?: number; // -10 to +10
  appliedDate: string;
}

export interface TreatmentOutcome {
  id: string;
  patientId: string;
  protocolId: string;
  modalityUsed: string;
  pointsUsed: string[];
  treatmentDate: string;
  duration: string;
  patientResponse: 'poor' | 'fair' | 'good' | 'excellent';
  symptomsBeforeTreatment: number; // 1-10 scale
  symptomsAfterTreatment: number; // 1-10 scale
  symptomsFollowUp?: number; // 1-10 scale (24-48 hours later)
  sideEffects?: string[];
  modifications?: string[];
  practitionerNotes?: string;
  patientFeedback?: string;
  followUpNeeded?: boolean;
  nextTreatmentDate?: string;
}

export interface ClinicalInsight {
  id: string;
  type: 'pattern' | 'correlation' | 'effectiveness' | 'safety';
  title: string;
  description: string;
  dataPoints: number; // Number of treatments this is based on
  confidence: number; // 0-100
  recommendation: string;
  generatedAt: string;
  verified?: boolean; // Practitioner has verified this insight
}

export interface PractitionerPreferences {
  id: string;
  pointPressureDefaults: {
    [pointId: string]: 'light' | 'moderate' | 'firm';
  };
  treatmentDurationDefaults: {
    [modalityId: string]: string;
  };
  favoriteProtocols: string[];
  customProtocolTemplates: {
    name: string;
    template: any;
  }[];
  voiceCommandPreferences: {
    autoSpeak: boolean;
    speechRate: number;
    preferredVoice?: string;
  };
  aiAssistantSettings: {
    model: string;
    systemPromptCustomizations?: string;
    autoSuggestTreatments: boolean;
  };
  clinicalDisplayPreferences: {
    showChineseCharacters: boolean;
    showPinyin: boolean;
    defaultMeasurementUnit: 'bcun' | 'inches' | 'cm';
    showContraindications: 'always' | 'hover' | 'click';
  };
}
