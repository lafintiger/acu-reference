// Simple Plugin System Initialization
// Clean, minimal setup for modality plugins

import { modalityRegistry } from './registry';
import { acupressurePlugin } from '../../plugins/simple-acupressure';
import { cuppingPlugin } from '../../plugins/simple-cupping';
import { guaShaPlugin } from '../../plugins/simple-gua-sha';
import { appliedKinesiologyPlugin } from '../../plugins/simple-applied-kinesiology';

export const initializeModalitySystem = async (): Promise<void> => {
  console.log('🔧 Initializing simple modality system...');
  
  try {
    // Register all modality plugins
    modalityRegistry.register(acupressurePlugin);
    modalityRegistry.register(cuppingPlugin);
    modalityRegistry.register(guaShaPlugin);
    modalityRegistry.register(appliedKinesiologyPlugin);
    
    const stats = modalityRegistry.getStats();
    console.log('✅ Modality system initialized:', stats);
  } catch (error) {
    console.error('❌ Failed to initialize modality system:', error);
  }
};
