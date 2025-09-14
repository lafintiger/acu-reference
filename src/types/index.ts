// Core data types for AcuReference app
export type ViewName = 'front' | 'back' | 'left' | 'right';
export type ModalityId = 'acupressure' | 'cupping' | 'gua_sha' | 'applied_kinesiology';
export type PointCategory = 'standard' | 'extra' | 'auricular' | 'extraordinary';
export type StepType = 'point' | 'technique' | 'herb' | 'diet' | 'note';

export interface Meridian {
  id: string;           // e.g., 'LI', 'GB', 'DU', 'REN'
  name: string;         // 'Large Intestine', 'Gall Bladder'
  description?: string;
  element?: string;     // Five Element theory
  yinYang?: 'yin' | 'yang';
}

export interface Point {
  id: string;                    // e.g., 'LI4', 'GB20'
  meridianId?: string;           // FK to meridians.id (nullable for extra/auricular)
  nameEn: string;               // 'Hegu', 'Fengchi'
  namePinyin?: string;          // 'He Gu', 'Feng Chi'
  nameCharacters?: string;       // Chinese characters
  category: PointCategory;
  location: string;             // anatomical description
  indications: string[];        // array of condition IDs/labels
  contraindications?: string[]; // array of warnings
  acupressureDepth?: string;    // pressure guidance
  notes?: string;
}

export interface Indication {
  id: string;        // slug: 'headache', 'neck_stiffness'
  label: string;     // 'Headache', 'Neck Stiffness'
  synonyms?: string[]; // ['cephalalgia', 'head pain']
  category?: string;  // 'pain', 'digestive', 'emotional', etc.
}

export interface Modality {
  id: ModalityId;
  label: string;
  description?: string;
}

export interface Technique {
  id: string;              // e.g., 'cupping_upper_back'
  modalityId: ModalityId;
  name: string;
  description?: string;
  cautions?: string;
  duration?: string;       // e.g., '5-8 minutes'
  equipment?: string[];    // tools needed
}

export interface Herb {
  id: string;
  name: string;
  nameChinese?: string;
  properties?: string;     // TCM properties (warm, cool, etc.)
  meridians?: string[];    // meridians it affects
  cautions?: string;
  dosage?: string;
}

export interface DietItem {
  id: string;
  name: string;
  guidance?: string;
  properties?: string;     // TCM dietary properties
  category?: 'food' | 'avoid' | 'drink';
}

export interface BodyRegion {
  id: string;              // 'neck', 'hand_dorsum', 'face'
  label: string;
}

export interface PointCoordinate {
  id: number;
  pointId: string;
  view: ViewName;
  x: number;               // 0..1 normalized
  y: number;               // 0..1 normalized
  regionId?: string;       // optional FK to body_regions
}

export interface MediaAsset {
  id: string;
  kind: 'image' | 'svg' | 'video';
  path: string;            // local path or data URL
  title?: string;
  attribution?: string;
  license?: string;        // e.g., 'CC0', 'CC-BY'
}

export interface Protocol {
  id: string;
  name: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProtocolStep {
  id: number;
  protocolId: string;
  stepIndex: number;
  stepType: StepType;
  refId?: string;          // id of referenced entity (nullable for note)
  details?: string;        // free-text notes or parameters
  durationSeconds?: number;
}

// Cross-reference tables
export interface PointIndication {
  pointId: string;
  indicationId: string;
}

export interface PointTechnique {
  pointId: string;
  techniqueId: string;
}

export interface IndicationTechnique {
  indicationId: string;
  techniqueId: string;
}

export interface IndicationHerb {
  indicationId: string;
  herbId: string;
}

export interface IndicationDiet {
  indicationId: string;
  dietId: string;
}

export interface EntityMedia {
  entityType: 'point' | 'technique' | 'region' | 'indication' | 'herb' | 'diet';
  entityId: string;
  mediaId: string;
}

// Search and UI types
export interface SearchResult {
  type: 'point' | 'indication' | 'technique' | 'herb' | 'diet';
  id: string;
  title: string;
  subtitle?: string;
  snippet?: string;
  score: number;
  data: Point | Indication | Technique | Herb | DietItem;
}

export interface SearchFilters {
  meridian?: string;
  bodyRegion?: string;
  modality?: ModalityId;
  category?: string;
}

// Database schema version for migrations
export interface SchemaVersion {
  version: number;
  appliedAt: string;
}
