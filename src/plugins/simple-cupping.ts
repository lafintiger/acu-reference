// Simple Cupping Plugin - Clean Implementation
import { SimpleModalityPlugin } from '../lib/modality-system/registry';
import { cuppingProtocols } from '../data/cuppingProtocols';

export const cuppingPlugin: SimpleModalityPlugin = {
  id: 'cupping',
  name: 'Cupping Therapy',
  icon: '🥤',
  description: 'Suction therapy using cups to improve circulation and reduce muscle tension',
  protocols: cuppingProtocols,
  effectiveness: 90,

  getProtocolsForIndication(indication: string): any[] {
    return cuppingProtocols.filter(protocol => 
      protocol.indicationId === indication ||
      protocol.indicationId.toLowerCase().includes(indication.toLowerCase())
    );
  }
};
