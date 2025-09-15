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