// Simple Modality Registry - Clean Implementation
// Central management for treatment modalities

export interface SimpleModalityPlugin {
  id: string;
  name: string;
  icon: string;
  description: string;
  protocols: any[];
  effectiveness: number; // 0-100
  
  getProtocolsForIndication(indication: string): any[];
}

class SimpleModalityRegistry {
  private plugins: Map<string, SimpleModalityPlugin> = new Map();

  // Register a modality plugin
  register(plugin: SimpleModalityPlugin): void {
    console.log(`Registering modality: ${plugin.name}`);
    this.plugins.set(plugin.id, plugin);
  }

  // Get specific modality
  get(modalityId: string): SimpleModalityPlugin | null {
    return this.plugins.get(modalityId) || null;
  }

  // Get all modalities
  getAll(): SimpleModalityPlugin[] {
    return Array.from(this.plugins.values());
  }

  // Get modalities for specific indication
  getForIndication(indication: string): SimpleModalityPlugin[] {
    return Array.from(this.plugins.values()).filter(plugin => {
      return plugin.getProtocolsForIndication(indication).length > 0;
    });
  }

  // Get comparison data
  getComparisonData(indication: string): any[] {
    const relevantPlugins = this.getForIndication(indication);
    
    return relevantPlugins.map(plugin => ({
      id: plugin.id,
      name: plugin.name,
      icon: plugin.icon,
      effectiveness: plugin.effectiveness,
      protocols: plugin.getProtocolsForIndication(indication).length
    }));
  }

  // Get statistics
  getStats(): { totalPlugins: number; totalProtocols: number } {
    const plugins = Array.from(this.plugins.values());
    const totalProtocols = plugins.reduce((sum, plugin) => sum + plugin.protocols.length, 0);
    
    return {
      totalPlugins: plugins.length,
      totalProtocols
    };
  }
}

export const modalityRegistry = new SimpleModalityRegistry();