// Simple Acupressure Plugin - Clean Implementation
// Converts existing acupressure data to plugin format

import { SimpleModalityPlugin } from '../lib/modality-system/registry';
import { acupressureProtocols } from '../data/acupressureProtocols';

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
