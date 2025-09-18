// Modular Modality System - Core Types
// Simple, clean type definitions for the plugin architecture

export interface ModalityMetadata {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  description: string;
  version: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  equipmentRequired: boolean;
  selfAdministered: boolean;
  author?: string; // Optional author field
}

export interface ModalityPlugin {
  metadata: ModalityMetadata;
  protocols: any[]; // Will be typed more specifically later
  techniques: any[]; // Will be typed more specifically later
  
  // Core methods
  getProtocolsForIndication(indication: string): any[];
  getEffectivenessScore(): number;
}

export interface ModalityRegistry {
  register(plugin: ModalityPlugin): void;
  get(modalityId: string): ModalityPlugin | null;
  getAll(): ModalityPlugin[];
  getForIndication(indication: string): ModalityPlugin[];
}

// Additional types that plugins are expecting
export interface ModalityProtocol {
  id: string;
  indication: string;
  name: string;
  description: string;
  points: string[];
  steps?: any[];
  contraindications?: string[];
  duration?: string;
  expectedOutcomes?: string[];
  techniques?: string[];
  notes?: string;
}

export interface ModalityTechnique {
  name: string;
  description: string;
  instructions: string[];
  duration?: string;
  pressure?: string;
  equipment?: string[];
}

export interface ModalityEffectiveness {
  condition: string;
  effectivenessScore: number;
  evidenceLevel: string;
  notes?: string;
}

export interface ModalityContraindications {
  absolute: string[];
  relative: string[];
  medications?: string[];
  conditions?: string[];
}

export interface ModalityComponents {
  assessment?: any;
  treatment?: any;
  monitoring?: any;
}