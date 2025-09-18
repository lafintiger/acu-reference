// Simple Gua Sha Plugin - Clean Implementation
import { SimpleModalityPlugin } from '../lib/modality-system/registry';
import { guaShaProtocols } from '../data/guaShaProtocols';

export const guaShaPlugin: SimpleModalityPlugin = {
  id: 'gua_sha',
  name: 'Gua Sha',
  icon: '🪨',
  description: 'Scraping technique using smooth tools to improve circulation and release tension',
  protocols: guaShaProtocols,
  effectiveness: 88,

  getProtocolsForIndication(indication: string): any[] {
    return guaShaProtocols.filter(protocol => 
      protocol.indicationId === indication ||
      protocol.indicationId.toLowerCase().includes(indication.toLowerCase())
    );
  }
};
