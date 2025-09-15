// Plugin Loader - Discovers and Initializes All Modality Plugins
// This automatically loads all available plugins and registers them

import { modalityRegistry } from './registry';
import { acupressurePlugin } from '../../plugins/acupressure';
import { cuppingPlugin } from '../../plugins/cupping';
import { guaShaPlugin } from '../../plugins/gua-sha/gua-sha-plugin';
import { appliedKinesiologyPlugin } from '../../plugins/applied-kinesiology/applied-kinesiology-plugin';

export class PluginLoader {
  private static initialized = false;

  // Load and register all available plugins
  static async loadAllPlugins(): Promise<void> {
    if (this.initialized) {
      console.log('Plugins already loaded');
      return;
    }

    console.log('🚀 Loading modality plugins...');

    try {
      // Initialize the registry
      await modalityRegistry.initialize();

      // Register available plugins
      await this.registerCorePlugins();

      // Future: Auto-discover plugins from plugins directory
      // await this.autoDiscoverPlugins();

      this.initialized = true;
      console.log('✅ All modality plugins loaded successfully');
      
      // Log plugin statistics
      const stats = modalityRegistry.getStats();
      console.log('📊 Plugin Statistics:', stats);
      
    } catch (error) {
      console.error('❌ Failed to load plugins:', error);
      throw error;
    }
  }

  // Register core modality plugins
  private static async registerCorePlugins(): Promise<void> {
    console.log('📦 Registering core modality plugins...');

    // Register Acupressure Plugin
    try {
      modalityRegistry.register(acupressurePlugin);
      console.log('✅ Acupressure plugin registered');
    } catch (error) {
      console.error('❌ Failed to register acupressure plugin:', error);
    }

    // Register Cupping Plugin
    try {
      modalityRegistry.register(cuppingPlugin);
      console.log('✅ Cupping plugin registered');
    } catch (error) {
      console.error('❌ Failed to register cupping plugin:', error);
    }

    // Register Gua Sha Plugin
    try {
      modalityRegistry.register(guaShaPlugin);
      console.log('✅ Gua Sha plugin registered');
    } catch (error) {
      console.error('❌ Failed to register Gua Sha plugin:', error);
    }

    // Register Applied Kinesiology Plugin
    try {
      modalityRegistry.register(appliedKinesiologyPlugin);
      console.log('✅ Applied Kinesiology plugin registered');
    } catch (error) {
      console.error('❌ Failed to register Applied Kinesiology plugin:', error);
    }
  }

  // Future: Auto-discover plugins from file system
  private static async autoDiscoverPlugins(): Promise<void> {
    console.log('🔍 Auto-discovering plugins...');
    
    // This would scan the plugins directory and automatically
    // load any valid plugin modules found
    // Implementation depends on build system capabilities
  }

  // Get initialization status
  static isInitialized(): boolean {
    return this.initialized;
  }

  // Force reload all plugins (for development)
  static async reloadPlugins(): Promise<void> {
    console.log('🔄 Reloading all plugins...');
    this.initialized = false;
    await this.loadAllPlugins();
  }

  // Get plugin loading status
  static getLoadingStatus(): {
    initialized: boolean;
    pluginCount: number;
    errors: string[];
  } {
    const stats = modalityRegistry.getStats();
    
    return {
      initialized: this.initialized,
      pluginCount: stats.totalPlugins,
      errors: [] // TODO: Track loading errors
    };
  }
}

// Export for app initialization
export default PluginLoader;
