// Base Modality Plugin - Abstract Base Class
// Provides common functionality that all modality plugins can extend

import { ModalityPlugin, ModalityMetadata, ModalityProtocol, ModalityTechnique, ModalityEffectiveness, ModalityContraindications, ModalityComponents } from './types';

export abstract class BaseModalityPlugin implements ModalityPlugin {
  abstract metadata: ModalityMetadata;
  abstract protocols: ModalityProtocol[];
  abstract techniques: ModalityTechnique[];
  abstract effectiveness: ModalityEffectiveness[];
  abstract contraindications: ModalityContraindications;
  abstract components: ModalityComponents;

  // Default implementation - can be overridden
  async initialize(): Promise<void> {
    console.log(`Initializing ${this.metadata.name} plugin...`);
    
    // Validate protocols
    this.validateProtocols();
    
    // Index search terms
    this.indexSearchTerms();
    
    console.log(`✅ ${this.metadata.name} plugin initialized`);
  }

  // Get protocols for a specific indication
  getProtocolsForIndication(indication: string): ModalityProtocol[] {
    return this.protocols.filter(protocol => 
      protocol.indication === indication ||
      protocol.indication.toLowerCase().includes(indication.toLowerCase())
    );
  }

  // Get techniques for a specific indication
  getTechniquesForIndication(indication: string): ModalityTechnique[] {
    const relevantProtocols = this.getProtocolsForIndication(indication);
    const techniqueIds = new Set<string>();
    
    relevantProtocols.forEach(protocol => {
      protocol.steps.forEach(step => {
        step.techniques?.forEach(techId => techniqueIds.add(techId));
      });
    });
    
    return this.techniques.filter(technique => 
      techniqueIds.has(technique.id)
    );
  }

  // Get effectiveness data for a specific indication
  getEffectivenessForIndication(indication: string): ModalityEffectiveness | null {
    return this.effectiveness.find(eff => 
      eff.indication === indication ||
      eff.indication.toLowerCase().includes(indication.toLowerCase())
    ) || null;
  }

  // Validate safety for a patient
  validateSafetyForPatient(patientData: any): { safe: boolean; warnings: string[] } {
    const warnings: string[] = [];
    let safe = true;

    // Check absolute contraindications
    this.contraindications.absolute.forEach(contraindication => {
      if (this.patientHasCondition(patientData, contraindication)) {
        warnings.push(`Absolute contraindication: ${contraindication}`);
        safe = false;
      }
    });

    // Check relative contraindications
    this.contraindications.relative.forEach(contraindication => {
      if (this.patientHasCondition(patientData, contraindication)) {
        warnings.push(`Use with caution: ${contraindication}`);
      }
    });

    // Check pregnancy
    if (patientData?.pregnancy && this.contraindications.pregnancy === 'avoid') {
      warnings.push('Avoid during pregnancy');
      safe = false;
    } else if (patientData?.pregnancy && this.contraindications.pregnancy === 'caution') {
      warnings.push('Use with caution during pregnancy');
    }

    // Check age restrictions
    if (this.contraindications.ageRestrictions) {
      const age = patientData?.age;
      const restrictions = this.contraindications.ageRestrictions;
      
      if (restrictions.minAge && age < restrictions.minAge) {
        warnings.push(`Not recommended for ages under ${restrictions.minAge}`);
        safe = false;
      }
      
      if (restrictions.maxAge && age > restrictions.maxAge) {
        warnings.push(`Use with caution for ages over ${restrictions.maxAge}`);
      }
    }

    return { safe, warnings };
  }

  // Get comparison data for treatment comparison pages
  getComparisonData(): {
    duration: string;
    frequency: string;
    effectiveness: number;
    easeOfUse: number;
    safetyProfile: number;
    cost: string;
    equipment: string;
  } {
    // Default implementation - plugins should override with specific data
    const avgEffectiveness = this.effectiveness.length > 0
      ? this.effectiveness.reduce((sum, eff) => sum + eff.effectivenessScore, 0) / this.effectiveness.length
      : 0;

    return {
      duration: this.getAverageDuration(),
      frequency: this.getTypicalFrequency(),
      effectiveness: avgEffectiveness,
      easeOfUse: this.metadata.skillLevel === 'beginner' ? 90 : 
                 this.metadata.skillLevel === 'intermediate' ? 70 : 50,
      safetyProfile: this.calculateSafetyProfile(),
      cost: this.metadata.equipmentRequired ? 'Low-Medium' : 'Free',
      equipment: this.metadata.equipmentRequired ? 'Required' : 'None'
    };
  }

  // Register routes for this modality
  registerRoutes(): { path: string; component: any }[] {
    return [
      {
        path: `/${this.metadata.id}`,
        component: this.components.ProtocolPage
      }
    ];
  }

  // Register navigation item
  registerNavigation(): { name: string; path: string; icon: string } {
    return {
      name: this.metadata.displayName,
      path: `/${this.metadata.id}`,
      icon: this.metadata.icon
    };
  }

  // Register search terms
  registerSearchTerms(): string[] {
    const terms = [
      this.metadata.name,
      this.metadata.displayName,
      ...this.protocols.map(p => p.name),
      ...this.techniques.map(t => t.name)
    ];
    
    return [...new Set(terms)]; // Remove duplicates
  }

  // Helper methods
  private validateProtocols(): void {
    this.protocols.forEach(protocol => {
      if (!protocol.id || !protocol.name || !protocol.indication) {
        throw new Error(`Invalid protocol in ${this.metadata.name} plugin`);
      }
    });
  }

  private indexSearchTerms(): void {
    // Index terms for search functionality
    const terms = this.registerSearchTerms();
    console.log(`Indexed ${terms.length} search terms for ${this.metadata.name}`);
  }

  private patientHasCondition(patientData: any, condition: string): boolean {
    // Simple condition checking - can be enhanced
    const conditions = patientData?.conditions || [];
    const medications = patientData?.medications || [];
    
    return conditions.some((c: string) => 
      c.toLowerCase().includes(condition.toLowerCase())
    ) || medications.some((m: string) => 
      m.toLowerCase().includes(condition.toLowerCase())
    );
  }

  private getAverageDuration(): string {
    if (this.protocols.length === 0) return 'Variable';
    
    // Simple duration calculation - can be enhanced
    const durations = this.protocols.map(p => p.duration);
    return durations[0] || 'Variable'; // Return first duration as representative
  }

  private getTypicalFrequency(): string {
    if (this.protocols.length === 0) return 'As needed';
    
    const frequencies = this.protocols.map(p => p.frequency);
    return frequencies[0] || 'As needed';
  }

  private calculateSafetyProfile(): number {
    // Calculate safety score based on contraindications
    const absoluteContras = this.contraindications.absolute.length;
    const relativeContras = this.contraindications.relative.length;
    
    // Higher score = safer (fewer contraindications)
    const baseScore = 100;
    const penalty = (absoluteContras * 10) + (relativeContras * 5);
    
    return Math.max(60, baseScore - penalty); // Minimum 60% safety score
  }
}

// Singleton registry instance
export const modalityRegistry = new ModalityRegistryImpl();

// Plugin discovery and auto-registration
export class PluginDiscovery {
  static async discoverAndRegisterAll(): Promise<void> {
    console.log('🔍 Discovering and registering modality plugins...');
    
    try {
      // Auto-register existing modalities as plugins
      // This will be implemented to convert existing data
      await this.registerLegacyModalities();
      
      console.log('✅ All modality plugins discovered and registered');
    } catch (error) {
      console.error('❌ Plugin discovery failed:', error);
    }
  }

  private static async registerLegacyModalities(): Promise<void> {
    // This will convert existing modalities to the new plugin format
    // Implementation will be added in the next phase
    console.log('📦 Converting legacy modalities to plugin format...');
  }
}

// Export for use in app initialization
export { modalityRegistry as default };
