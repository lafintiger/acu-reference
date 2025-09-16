# AcuReference v0.3 - Code Documentation
## Comprehensive Developer Guide

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Core Systems](#core-systems)
3. [Clinical Workflow](#clinical-workflow)
4. [AI Integration](#ai-integration)
5. [RAG System](#rag-system)
6. [Plugin Architecture](#plugin-architecture)
7. [Data Models](#data-models)
8. [Component Documentation](#component-documentation)
9. [API Reference](#api-reference)
10. [Development Guidelines](#development-guidelines)

---

## Architecture Overview

### System Design Principles
```typescript
// 1. Modular Architecture
// Each system (assessment, treatment, AI, RAG) is self-contained
// Can be modified without affecting other systems

// 2. Clinical Workflow Driven
// UI and data flow follows actual clinical practice
// Assessment → Diagnosis → Treatment → Monitoring

// 3. Privacy First
// All processing local, no cloud dependencies
// Patient data anonymized and encrypted

// 4. Plugin-Based Expansion
// New modalities, diagnostic systems, AI models can be added as plugins
// Template system for easy expansion
```

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.8.1",
  "typescript": "^5.0.2",
  "vite": "^4.4.5",
  "tailwindcss": "^3.3.0",
  "lucide-react": "^0.263.1",
  "minisearch": "^6.1.0"
}
```

---

## Core Systems

### 1. Database System (`src/lib/simpleDatabase.ts`)
```typescript
class SimpleDatabase {
  private initialized = false;
  private data = {
    meridians: [] as Meridian[],
    points: [] as Point[],
    indications: [] as Indication[],
    techniques: [] as Technique[]
  };

  // Initialize database with seed data
  async initialize(): Promise<void> {
    // Always reload from seed data for development
    this.data.meridians = [...meridians];
    this.data.points = points.map(point => validatePointAgainstWHO(point));
    this.data.indications = [...indications];
    this.data.techniques = [...techniques];
    this.saveData();
  }

  // Core data access methods
  getAllPoints(): Point[] { return this.data.points; }
  getPointById(id: string): Point | null { /* ... */ }
  getAllMeridians(): Meridian[] { return this.data.meridians; }
  // ... additional methods
}
```

### 2. Search System (`src/lib/searchService.ts`)
```typescript
class SearchService {
  private miniSearch: MiniSearch;

  // Initialize search indexes
  initializeSearch(points: Point[], indications: Indication[], techniques: Technique[]): void {
    this.miniSearch = new MiniSearch({
      fields: ['nameEn', 'namePinyin', 'location', 'indications'],
      storeFields: ['id', 'nameEn', 'location', 'type']
    });

    // Index all searchable content
    this.indexPoints(points);
    this.indexIndications(indications);
    this.indexTechniques(techniques);
  }

  // Perform search with fuzzy matching
  search(query: string, limit: number = 10): SearchResult[] {
    return this.miniSearch.search(query, { 
      fuzzy: 0.2, 
      boost: { nameEn: 2, indications: 1.5 } 
    });
  }
}
```

---

## Clinical Workflow

### Assessment Phase (`src/pages/Assessment.tsx`)
```typescript
const Assessment = () => {
  // State management for clinical findings
  const [selectedSigns, setSelectedSigns] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [chapmanFindings, setChapmanFindings] = useState<any[]>([]);

  // Chapman point assessment
  const addChapmanFinding = (pointId: string, severity: number, notes: string) => {
    const finding = {
      pointId,
      severity,
      notes,
      dateRecorded: new Date().toISOString()
    };
    setChapmanFindings(prev => [...prev, finding]);
  };

  // Clinical interpretation
  const interpretFindings = () => {
    return chapmanPointsPlugin.interpretFindings(
      chapmanFindings.map(f => ({
        id: f.pointId,
        patientId: 'current',
        findingType: 'diagnostic_point' as const,
        referenceId: f.pointId,
        severity: f.severity,
        notes: f.notes,
        dateRecorded: f.dateRecorded
      }))
    );
  };
};
```

### Treatment Planning (`src/pages/TreatmentPlanning.tsx`)
```typescript
const TreatmentPlanning = () => {
  // Generate diagnostic suggestions from assessment data
  useEffect(() => {
    const diagnosesFromSigns = getDiagnosesForSigns(mockAssessmentData.signs);
    const diagnosesFromSymptoms = getDiagnosesForSymptoms(mockAssessmentData.symptoms);
    const tcmPatternsFromSymptoms = getTCMPatternsForSymptoms(mockAssessmentData.symptoms);

    // Score and rank suggestions
    const scoredDiagnoses = allSuggestions.map(diagnosis => {
      const signMatches = diagnosis.associatedSigns.filter(sign => 
        mockAssessmentData.signs.includes(sign)
      ).length;
      const symptomMatches = diagnosis.associatedSymptoms.filter(symptom => 
        mockAssessmentData.symptoms.includes(symptom)
      ).length;
      
      return {
        ...diagnosis,
        matchScore: signMatches + symptomMatches,
        confidence: Math.min(95, (signMatches + symptomMatches) * 25)
      };
    });

    setSuggestedDiagnoses(scoredDiagnoses.sort((a, b) => b.matchScore - a.matchScore));
  }, []);
};
```

---

## AI Integration

### Ollama Client (`src/lib/ai/ollama-client.ts`)
```typescript
export class OllamaClient {
  private config: OllamaConfig;
  private conversationHistory: ChatMessage[] = [];

  // Send chat message to local AI
  async chat(message: string, systemPrompt?: string): Promise<string> {
    // Add system prompt and user message to history
    if (systemPrompt) {
      this.conversationHistory.unshift({
        role: 'system',
        content: systemPrompt,
        timestamp: new Date().toISOString()
      });
    }

    this.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    // Make API call with timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    const response = await fetch(`${this.config.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.model,
        messages: this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: false
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    // ... handle response
  }
}
```

### TCM Assistant (`src/lib/ai/tcm-assistant.ts`)
```typescript
export class TCMAssistant {
  private readonly systemPrompt = `You are a knowledgeable Traditional Chinese Medicine (TCM) assistant...`;

  // Analyze patient intake data
  async analyzePatientIntake(intake: PatientIntake): Promise<string> {
    const context = await this.buildClinicalContext(intake.chiefComplaint.primaryConcern, intake);
    
    const prompt = `Based on the following clinical information, provide comprehensive treatment recommendations:
    
    Patient Info: ${JSON.stringify(intake, null, 2)}
    Clinical Context: ${context}
    
    Please provide:
    1. Primary acupuncture points to use
    2. Recommended modalities
    3. Treatment sequence and timing
    4. Safety considerations
    5. Expected outcomes`;

    return await ollamaClient.chat(prompt, this.systemPrompt);
  }
}
```

---

## RAG System

### Document Store (`src/lib/rag/document-store.ts`)
```typescript
export class DocumentStore {
  // Store document with semantic embeddings
  async storeDocument(fileName: string, extractedText: string): Promise<string> {
    const documentId = `doc_${Date.now()}`;
    const pages = extractedText.split(/--- Page \d+ ---/);
    
    // Create searchable chunks
    const chunks = this.createDocumentChunks(documentId, fileName, pages);
    
    // Create embeddings for semantic search
    await this.createEmbeddingsForChunks(chunks);
    
    // Store with compression
    this.saveDocument(document);
    this.saveChunks(chunks);
    this.updateSearchIndex(chunks);
    
    return documentId;
  }

  // Semantic search with embeddings
  async searchDocuments(query: string, limit: number = 5): Promise<DocumentChunk[]> {
    const allChunks = this.getAllChunks();
    const chunksWithEmbeddings = allChunks.filter(chunk => chunk.embedding);
    
    if (chunksWithEmbeddings.length > 0) {
      return await this.semanticSearch(query, chunksWithEmbeddings, limit);
    } else {
      return this.keywordSearch(query, allChunks, limit);
    }
  }

  // Provide context for AI assistant
  async getContextForQuery(query: string): Promise<string> {
    const relevantChunks = await this.searchDocuments(query, 3);
    
    if (relevantChunks.length === 0) {
      return 'No relevant content found in manual library.';
    }
    
    return relevantChunks.map(chunk => 
      `[${chunk.documentTitle}, Page ${chunk.pageNumber}]\n${chunk.content}`
    ).join('\n\n---\n\n');
  }
}
```

### Embedding Service (`src/lib/rag/embedding-service.ts`)
```typescript
export class EmbeddingService {
  // Create semantic embedding using Qwen3
  async createEmbedding(text: string): Promise<EmbeddingResult> {
    const response = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.embeddingModel, // 'ZimaBlueAI/Qwen3-Embedding-8B:Q5_K_M'
        prompt: text
      })
    });

    const data = await response.json();
    return {
      embedding: data.embedding, // 4096-dimensional vector
      success: true
    };
  }

  // Calculate semantic similarity
  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    // Cosine similarity calculation
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }
}
```

---

## Workshop Content Processing

### PDF Processor (`src/lib/knowledge-management/pdf-processor.ts`)
```typescript
export class PDFProcessor {
  // Extract text from PDF using PDF.js
  async processPDF(file: File): Promise<PDFProcessingResult> {
    const pdfjsLib = await this.loadPDFJS();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
    }
    
    return {
      success: true,
      text: fullText.trim(),
      pageCount: pdf.numPages,
      fileName: file.name,
      fileSize: file.size,
      processingTime: Date.now() - startTime
    };
  }
}
```

### Protocol Extraction (`src/components/WorkshopUploader.tsx`)
```typescript
// Direct text extraction without AI dependency
const extractProtocolsDirectly = (text: string, fileName: string) => {
  const protocols = [];
  const pages = text.split(/--- Page \d+ ---/);
  
  pages.forEach((pageContent, pageIndex) => {
    const pageNumber = pageIndex + 1;
    
    // Pattern 1: Explicit test procedures
    const testPattern = /Test for ([^:]+):\s*([^\.]+(?:\.[^\.]*){0,5})/gi;
    let match;
    while ((match = testPattern.exec(pageContent)) !== null) {
      const [fullMatch, testName, description] = match;
      
      protocols.push({
        name: `${testName.trim()} Test`,
        indication: testName.toLowerCase().replace(/\s+/g, '_'),
        points: extractPointsFromText(description),
        technique: description.trim(),
        clinicalNotes: `Source: ${fileName}, Page ${pageNumber}\nProcedure: ${description.trim()}`,
        confidence: 95,
        sourceText: fullMatch
      });
    }
    
    // Pattern 2: Specific AK manual formats
    const procedureTitles = [
      'Acupressure Points to Correct Switching',
      'GENERAL NEUROLYMPHATIC TECHNIQUE',
      'RELEASING MUSCLE CRAMPS',
      'Emotional Stress Release',
      'EAR UNROLLING PROCEDURE',
      'Injury Recall',
      'Testing the ICV',
      'Meridian Trace'
    ];
    
    procedureTitles.forEach(title => {
      const titleIndex = pageContent.indexOf(title);
      if (titleIndex !== -1) {
        const contentAfterTitle = pageContent.substring(titleIndex);
        const nextSectionMatch = contentAfterTitle.match(/\n[A-Z\s]{10,}/);
        const endIndex = nextSectionMatch ? nextSectionMatch.index : Math.min(2000, contentAfterTitle.length);
        const procedureContent = contentAfterTitle.substring(0, endIndex);
        
        if (procedureContent.length > title.length + 100) {
          const clinicalContext = extractClinicalContext(beforeTitle, procedureContent, title);
          const timing = extractTiming(procedureContent);
          
          protocols.push({
            name: title,
            indication: clinicalContext.indication,
            points: extractPointsFromText(procedureContent),
            technique: procedureContent.trim(),
            duration: timing.duration || undefined,
            frequency: timing.frequency || undefined,
            clinicalNotes: `Source: ${fileName}, Page ${pageNumber}\n${clinicalContext.purpose}\nProcedure: ${title}`,
            confidence: 95,
            sourceText: procedureContent
          });
        }
      }
    });
  });
  
  return { protocols, techniques, pointCombinations: [], clinicalInsights: [] };
};
```

---

## Plugin Architecture

### Modality Plugin System (`src/lib/modality-system/`)
```typescript
interface SimpleModalityPlugin {
  id: string;
  name: string;
  icon: string;
  description: string;
  protocols: any[];
  effectiveness: number; // 0-100
  getProtocolsForIndication(indication: string): any[];
}

// Example: Acupressure Plugin
export const acupressurePlugin: SimpleModalityPlugin = {
  id: 'acupressure',
  name: 'Acupressure',
  icon: '👆',
  description: 'Gentle finger pressure applied to specific acupuncture points',
  protocols: acupressureProtocols,
  effectiveness: 85,

  getProtocolsForIndication(indication: string): any[] {
    return acupressureProtocols.filter(protocol => 
      protocol.indication === indication ||
      protocol.indication.toLowerCase().includes(indication.toLowerCase())
    );
  }
};

// Plugin Registration
modalityRegistry.register(acupressurePlugin);
modalityRegistry.register(cuppingPlugin);
modalityRegistry.register(guaShaPlugin);
modalityRegistry.register(appliedKinesiologyPlugin);
```

### Diagnostic Plugin System (`src/plugins/diagnostic/`)
```typescript
interface DiagnosticPlugin {
  id: string;
  name: string;
  type: 'point_system' | 'pattern_recognition' | 'assessment_tool';
  points?: DiagnosticPoint[];
  
  performAssessment(patientData: any): AssessmentFinding[];
  interpretFindings(findings: AssessmentFinding[]): string;
  getSuggestedDiagnoses(findings: AssessmentFinding[]): string[];
}

// Chapman Points Plugin Implementation
export class ChapmanPointsPlugin implements DiagnosticPlugin {
  id = 'chapman_points';
  name = 'Chapman Neurolymphatic Points';
  type = 'point_system' as const;
  points = chapmanPoints;

  performAssessment(patientData: any): AssessmentFinding[] {
    // Implementation for patient-specific assessment
  }

  interpretFindings(findings: AssessmentFinding[]): string {
    const positivePoints = findings.filter(f => f.severity && f.severity >= 5);
    const organSystems = positivePoints.map(finding => {
      const point = this.points?.find(p => p.id === finding.referenceId);
      return point?.associatedOrgan || 'unknown';
    });
    
    return `Chapman point assessment: Lymphatic congestion detected in ${organSystems.join(', ')} systems.`;
  }
}
```

---

## Component Documentation

### Layout Component (`src/components/Layout.tsx`)
```typescript
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Navigation organized by clinical workflow
  const navigation = [
    // Clinical Workflow (Primary)
    { name: 'Home', href: '/', icon: Home },
    { name: 'Patient Intake', href: '/intake', icon: FileText },
    { name: 'Clinical Assessment', href: '/assessment', icon: Stethoscope },
    { name: 'Treatment Planning', href: '/treatment', icon: Activity },
    { name: 'Monitoring', href: '/monitoring', icon: List },
    
    // Reference & Tools
    { name: 'Points Database', href: '/points', icon: MapPin },
    { name: 'Body Map', href: '/body-map', icon: User },
    // ... additional navigation items
  ];

  // Global search functionality
  const handleSearch = async (query: string) => {
    if (!searchInitialized) await initializeSearch();
    const results = searchService.search(query, 10);
    setSearchResults(results.map(result => ({
      id: result.id,
      title: result.nameEn || result.name,
      type: result.type,
      subtitle: result.location || result.description,
      snippet: result.indications?.join(', ') || ''
    })));
    setShowResults(true);
  };
};
```

### AI Assistant Component (`src/components/LocalAIAssistant.tsx`)
```typescript
const LocalAIAssistant: React.FC<LocalAIAssistantProps> = ({ 
  patientData, 
  currentCondition, 
  compact = false 
}) => {
  // Model selection and management
  const handleModelChange = (newModel: string) => {
    setSelectedModel(newModel);
    ollamaClient.setModel(newModel);
  };

  // Enhanced message handling with RAG context
  const handleSendMessage = async () => {
    // Get relevant context from manual library
    const ragContext = await documentStore.getContextForQuery(message);
    const enhancedMessage = ragContext !== 'No relevant content found in manual library.' 
      ? `${message}\n\nRelevant context from your manuals:\n${ragContext}`
      : message;

    // Send to AI with context
    const aiResponse = await ollamaClient.chat(enhancedMessage);
    setResponse(aiResponse);
  };

  // Quick action buttons for common clinical queries
  const quickActions = [
    { label: 'Analyze Patient', enabled: !!patientData },
    { label: 'Best Points for Headache', enabled: true },
    { label: 'Safety Check', enabled: true },
    { label: 'Modality Selection', enabled: true }
  ];
};
```

---

## Data Models

### Clinical Assessment Data
```typescript
// Signs and Symptoms (src/data/signs-symptoms.ts)
export const clinicalSigns: Sign[] = [
  {
    id: 'hypertension',
    name: 'Elevated Blood Pressure',
    category: 'vital_signs',
    description: 'Blood pressure consistently above normal range',
    measurable: true,
    normalRange: 'Systolic: 90-120 mmHg, Diastolic: 60-80 mmHg',
    clinicalSignificance: 'May indicate cardiovascular stress, kidney issues, or stress-related disorders'
  },
  // ... additional signs
];

export const clinicalSymptoms: Symptom[] = [
  {
    id: 'headache_tension',
    name: 'Tension Headache',
    category: 'pain',
    description: 'Band-like pressure around head, often bilateral',
    severity: 5,
    duration: 'hours to days',
    frequency: 'episodic',
    triggers: ['stress', 'poor_posture', 'eye_strain'],
    alleviatingFactors: ['rest', 'massage', 'stress_reduction']
  },
  // ... additional symptoms
];
```

### Chapman Points Data
```typescript
// Chapman Points (src/data/chapman-points.ts)
export const chapmanPoints: DiagnosticPoint[] = [
  {
    id: 'chapman_heart_anterior',
    system: 'chapman',
    name: 'Heart (Anterior)',
    location: '2nd intercostal space, near sternum, right side',
    anatomicalLandmarks: ['2nd_rib', 'sternum', 'right_parasternal'],
    associatedOrgan: 'heart',
    associatedMeridian: 'HT',
    testingMethod: 'Light palpation for tender, pea-sized nodule',
    positiveFindings: ['tenderness', 'nodular_texture', 'tissue_congestion'],
    clinicalSignificance: 'Indicates lymphatic congestion affecting cardiac function',
    relatedConditions: ['heart_palpitations', 'chest_tightness', 'anxiety', 'circulatory_issues']
  },
  // ... additional Chapman points
];
```

### Clinical Diagnoses and TCM Patterns
```typescript
// Diagnoses (src/data/clinical-diagnoses.ts)
export const clinicalDiagnoses: Diagnosis[] = [
  {
    id: 'tension_headache_syndrome',
    name: 'Tension Headache Syndrome',
    category: 'primary',
    type: 'western',
    description: 'Recurrent bilateral headaches with muscle tension component',
    diagnosticCriteria: [
      'Bilateral pressure or tightness',
      'Mild to moderate intensity',
      'Not aggravated by routine physical activity',
      'Associated with neck/shoulder muscle tension'
    ],
    associatedSigns: ['muscle_tension_neck', 'trigger_points_shoulders'],
    associatedSymptoms: ['headache_tension', 'neck_pain'],
    prognosis: 'good',
    treatmentApproach: 'Multi-modal therapy focusing on muscle tension relief and stress management'
  },
  // ... additional diagnoses
];

export const tcmPatterns: TCMPattern[] = [
  {
    id: 'liver_qi_stagnation',
    name: 'Liver Qi Stagnation',
    chineseName: '肝气郁结',
    category: 'qi_blood',
    description: 'Blocked flow of Liver Qi causing emotional and physical symptoms',
    keySymptoms: ['irritability', 'stress', 'headache', 'digestive_issues'],
    tonguePresentation: 'Normal or slightly red with thin coating',
    pulseQuality: 'Wiry (tight, string-like)',
    treatmentPrinciple: 'Soothe Liver Qi, promote smooth flow',
    recommendedPoints: ['LV3', 'LV14', 'GB34', 'PC6', 'EX-HN3'],
    lifestyleRecommendations: [
      'Stress management techniques',
      'Regular exercise',
      'Avoid excessive alcohol',
      'Emotional expression and support'
    ]
  },
  // ... additional TCM patterns
];
```

---

## API Reference

### Core Database API
```typescript
// Simple Database (src/lib/simpleDatabase.ts)
simpleDb.initialize()                    // Initialize database
simpleDb.getAllPoints()                  // Get all acupuncture points
simpleDb.getPointById(id)               // Get specific point
simpleDb.getAllMeridians()              // Get all meridians
simpleDb.getIndicationById(id)          // Get specific indication
```

### Search API
```typescript
// Search Service (src/lib/searchService.ts)
searchService.initializeSearch(points, indications, techniques)  // Initialize indexes
searchService.search(query, limit)                              // Perform search
searchService.indexData(data)                                   // Index new data
```

### AI API
```typescript
// Ollama Client (src/lib/ai/ollama-client.ts)
ollamaClient.isAvailable()                    // Check if Ollama is running
ollamaClient.getAvailableModels()            // List available models
ollamaClient.chat(message, systemPrompt)     // Send chat message
ollamaClient.setModel(modelName)             // Change active model
ollamaClient.clearHistory()                  // Clear conversation

// TCM Assistant (src/lib/ai/tcm-assistant.ts)
tcmAssistant.analyzePatientIntake(intake)           // Analyze patient data
tcmAssistant.getTreatmentRecommendations(condition) // Get treatment suggestions
tcmAssistant.getPointGuidance(pointId)              // Get point-specific guidance
```

### RAG API
```typescript
// Document Store (src/lib/rag/document-store.ts)
documentStore.storeDocument(fileName, text, type)     // Store document with embeddings
documentStore.searchDocuments(query, limit)          // Semantic search
documentStore.getContextForQuery(query)              // Get AI context
documentStore.deleteDocument(documentId)             // Delete document
documentStore.clearAll()                             // Clear all documents

// Embedding Service (src/lib/rag/embedding-service.ts)
embeddingService.createEmbedding(text)                    // Create single embedding
embeddingService.createBatchEmbeddings(texts)            // Batch processing
embeddingService.calculateSimilarity(emb1, emb2)         // Cosine similarity
embeddingService.isEmbeddingModelAvailable()             // Check model availability
```

---

## Development Guidelines

### Code Standards
1. **TypeScript**: Strict typing for all components and functions
2. **React Hooks**: Functional components with hooks pattern
3. **Error Handling**: Comprehensive try-catch with user feedback
4. **Logging**: Console logging for debugging and monitoring
5. **Privacy**: No external API calls, all processing local

### File Naming Conventions
- **Pages**: PascalCase (e.g., `TreatmentPlanning.tsx`)
- **Components**: PascalCase (e.g., `LocalAIAssistant.tsx`)
- **Utilities**: camelCase (e.g., `simpleDatabase.ts`)
- **Data**: kebab-case (e.g., `signs-symptoms.ts`)
- **Types**: kebab-case (e.g., `clinical-workflow.ts`)

### Component Structure
```typescript
// Standard component structure
import React, { useState, useEffect } from 'react';
import { IconName } from 'lucide-react';
import { DataImports } from '../data/file';

interface ComponentProps {
  // Prop definitions with TypeScript
}

const ComponentName: React.FC<ComponentProps> = ({ props }) => {
  // State management
  const [state, setState] = useState<Type>(initialValue);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Event logic
  };
  
  // Render helpers
  const renderSection = () => (
    <div>Content</div>
  );
  
  // Main render
  return (
    <div className="tailwind-classes">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### State Management Patterns
```typescript
// Local state for UI
const [loading, setLoading] = useState(false);
const [data, setData] = useState<Type[]>([]);
const [error, setError] = useState<string | null>(null);

// Async operations
const handleAsyncOperation = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await someAsyncFunction();
    setData(result);
  } catch (error) {
    console.error('Operation failed:', error);
    setError(`Operation failed: ${error}`);
  } finally {
    setLoading(false);
  }
};
```

---

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Components load on demand
2. **Memoization**: Expensive calculations cached
3. **Batch Processing**: Large operations split into batches
4. **Compression**: Embeddings compressed for storage efficiency
5. **Indexing**: Search indexes for fast queries

### Storage Management
```typescript
// Embedding compression for storage efficiency
private compressEmbedding(embedding: number[]): number[] {
  return embedding.map(val => Math.round(val * 100) / 100);
}

// Storage size monitoring
const dataSize = JSON.stringify(data).length;
if (dataSize > 5000000) { // 5MB limit
  console.warn('Large dataset detected, compressing...');
}
```

### Memory Management
- **Cleanup effects**: Remove event listeners and timers
- **Garbage collection**: Clear large objects when done
- **Batch processing**: Avoid loading entire datasets at once

---

## Security and Privacy

### Privacy Protection
```typescript
// Patient data anonymization
interface PatientIntake {
  basicInfo: {
    initials: string; // Only initials, never full names
    age: number;
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  };
  // ... no personally identifiable information
}

// Local-only storage
const INTAKE_STORAGE_KEY = 'acu_intake_data'; // localStorage only
const RAG_STORAGE_KEY = 'rag_documents';       // localStorage only
```

### Data Protection Measures
1. **No external transmission**: All data stays local
2. **Anonymized identifiers**: UUIDs and initials only
3. **Secure storage**: localStorage with compression
4. **Access control**: No network exposure of patient data

---

## Error Handling and Logging

### Error Handling Patterns
```typescript
// Comprehensive error handling
try {
  const result = await riskyOperation();
  console.log('✅ Operation successful:', result);
  return result;
} catch (error) {
  console.error('❌ Operation failed:', error);
  
  // User-friendly error messages
  if (error.message.includes('network')) {
    throw new Error('Network connection required for this feature');
  } else if (error.message.includes('model')) {
    throw new Error('AI model not available. Please check Ollama installation.');
  } else {
    throw new Error(`Operation failed: ${error.message}`);
  }
}
```

### Logging Standards
```typescript
// Consistent logging format
console.log('🚀 System initializing...');     // Startup
console.log('✅ Operation successful');        // Success
console.warn('⚠️ Warning condition');         // Warnings
console.error('❌ Operation failed');         // Errors
console.log('🔍 Debug information');          // Debug
console.log('📊 Statistics:', data);          // Data
```

---

## Testing Strategy

### Manual Testing Checklist
```markdown
## Clinical Workflow Testing
- [ ] Patient intake form completion and persistence
- [ ] Clinical assessment with signs, symptoms, Chapman points
- [ ] Treatment planning with AI diagnostic suggestions
- [ ] Monitoring with progress visualization

## Workshop Content Testing
- [ ] PDF upload and text extraction
- [ ] Protocol extraction with page references
- [ ] Duplicate detection and prevention
- [ ] Selective import functionality

## RAG System Testing
- [ ] Document upload to RAG library
- [ ] Semantic search with embedding models
- [ ] AI context enhancement
- [ ] Document management and deletion

## AI Integration Testing
- [ ] Model selection and switching
- [ ] Clinical question answering
- [ ] RAG context utilization
- [ ] Safety consideration warnings
```

### Automated Testing (Future)
```typescript
// Unit tests for core functions
describe('Chapman Points Plugin', () => {
  test('should interpret findings correctly', () => {
    const findings = [/* test data */];
    const interpretation = chapmanPointsPlugin.interpretFindings(findings);
    expect(interpretation).toContain('lymphatic congestion');
  });
});

// Integration tests for workflow
describe('Clinical Workflow', () => {
  test('should connect assessment to treatment', () => {
    const assessment = createMockAssessment();
    const treatment = generateTreatmentPlan(assessment);
    expect(treatment.protocols).toHaveLength(greaterThan(0));
  });
});
```

---

## Deployment and Maintenance

### Build Process
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality

# Deployment
git push origin v0.3-clinical-workflow  # Push to GitHub
# GitHub Actions automatically deploys to Pages
```

### Maintenance Tasks
1. **Regular Updates**
   - Update WHO point data as standards evolve
   - Add new Chapman/Ridler/Bennett points as discovered
   - Enhance protocol extraction patterns

2. **Performance Monitoring**
   - Monitor localStorage usage
   - Optimize embedding storage
   - Profile search performance

3. **Content Management**
   - Curate workshop protocol extractions
   - Validate clinical accuracy
   - Update AI system prompts

---

## Future Development Notes

### Immediate Priorities
1. **Complete diagnostic systems**: Add Ridler and Bennett points
2. **Enhanced protocol extraction**: Improve pattern matching
3. **Voice control integration**: Hands-free clinical workflow
4. **Advanced AI prompts**: Better clinical reasoning

### Long-term Vision
1. **Multi-practitioner support**: User management and collaboration
2. **Research integration**: Evidence-based protocol validation
3. **Practice management**: Scheduling, billing, reporting
4. **Mobile application**: Native iOS/Android apps

---

*This documentation represents the complete v0.3 system state and provides comprehensive guidance for continued development and maintenance.*
