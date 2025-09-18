// Simple Applied Kinesiology Plugin - Clean Implementation
import { SimpleModalityPlugin } from '../lib/modality-system/registry';
import { appliedKinesiologyProtocols } from '../data/appliedKinesiologyProtocols';

export const appliedKinesiologyPlugin: SimpleModalityPlugin = {
  id: 'applied_kinesiology',
  name: 'Applied Kinesiology',
  icon: '💪',
  description: 'Muscle testing technique to assess body function and identify imbalances',
  protocols: appliedKinesiologyProtocols,
  effectiveness: 92,

  getProtocolsForIndication(indication: string): any[] {
    return appliedKinesiologyProtocols.filter(protocol => 
      protocol.indicationId === indication ||
      protocol.indicationId.toLowerCase().includes(indication.toLowerCase())
    );
  }
};
