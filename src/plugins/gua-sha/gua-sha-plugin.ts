// Gua Sha Modality Plugin
// Third modality converted to the new plugin system

import { BaseModalityPlugin } from '../../lib/modality-system/base-plugin';
import { ModalityMetadata, ModalityProtocol, ModalityTechnique, ModalityEffectiveness, ModalityContraindications, ModalityComponents } from '../../lib/modality-system/types';
import { guaShaProtocols } from '../../data/guaShaProtocols';
import GuaShaProtocolPage from './components/GuaShaProtocolPage';
import GuaShaProtocolCard from './components/GuaShaProtocolCard';
import GuaShaTechniquesList from './components/GuaShaTechniquesList';
import GuaShaSafetyWarnings from './components/GuaShaSafetyWarnings';
import GuaShaComparisonMetrics from './components/GuaShaComparisonMetrics';

export class GuaShaPlugin extends BaseModalityPlugin {
  metadata: ModalityMetadata = {
    id: 'gua_sha',
    name: 'gua_sha',
    displayName: 'Gua Sha',
    icon: '🪨',
    description: 'Scraping technique using smooth tools to improve circulation and release muscle tension.',
    version: '1.0.0',
    author: 'AcuReference Core',
    category: 'physical',
    skillLevel: 'intermediate',
    equipmentRequired: true,
    selfAdministered: true
  };

  protocols: ModalityProtocol[] = this.convertLegacyProtocols();
  
  techniques: ModalityTechnique[] = [
    {
      id: 'unidirectional_scraping',
      modalityId: 'gua_sha',
      name: 'Unidirectional Scraping',
      description: 'Scraping in one direction following meridian flow',
      instructions: [
        'Apply oil to treatment area',
        'Hold tool at 45-degree angle',
        'Apply moderate pressure',
        'Scrape in one direction 20-30 times',
        'Move to adjacent area systematically'
      ],
      duration: '15-20 minutes',
      intensity: 'moderate',
      equipment: ['gua_sha_tool', 'massage_oil'],
      contraindications: ['blood_thinners', 'skin_infections']
    },
    {
      id: 'facial_gua_sha',
      modalityId: 'gua_sha',
      name: 'Facial Gua Sha',
      description: 'Gentle scraping technique for facial rejuvenation',
      instructions: [
        'Apply facial oil or serum',
        'Use light pressure with smooth tool',
        'Follow facial contours and lymphatic pathways',
        'Scrape upward and outward motions',
        'Complete with gentle circular motions'
      ],
      duration: '10-15 minutes',
      intensity: 'light',
      equipment: ['jade_gua_sha_tool', 'facial_oil'],
      contraindications: ['active_acne', 'rosacea', 'recent_facial_procedures']
    }
  ];

  effectiveness: ModalityEffectiveness[] = [
    {
      indication: 'neck_pain',
      effectivenessScore: 88,
      evidenceLevel: 'high',
      clinicalNotes: 'Excellent for neck and shoulder tension relief'
    },
    {
      indication: 'lymphatic_congestion',
      effectivenessScore: 92,
      evidenceLevel: 'moderate',
      clinicalNotes: 'Superior lymphatic drainage and detoxification'
    },
    {
      indication: 'facial_rejuvenation',
      effectivenessScore: 85,
      evidenceLevel: 'moderate',
      clinicalNotes: 'Improves facial circulation and skin tone'
    }
  ];

  contraindications: ModalityContraindications = {
    absolute: ['blood_clotting_disorders', 'severe_cardiovascular_disease'],
    relative: ['pregnancy', 'recent_injuries', 'skin_sensitivity'],
    pregnancy: 'caution',
    ageRestrictions: {
      minAge: 8,
      specialConsiderations: 'Use very light pressure for children and elderly'
    },
    medications: ['blood_thinners', 'anticoagulants'],
    conditions: ['eczema', 'psoriasis', 'open_wounds']
  };

  components: ModalityComponents = {
    ProtocolPage: GuaShaProtocolPage,
    ProtocolCard: GuaShaProtocolCard,
    TechniquesList: GuaShaTechniquesList,
    SafetyWarnings: GuaShaSafetyWarnings,
    ComparisonMetrics: GuaShaComparisonMetrics
  };

  private convertLegacyProtocols(): ModalityProtocol[] {
    return guaShaProtocols.map(protocol => ({
      id: `gua_sha_${protocol.indication}`,
      modalityId: 'gua_sha',
      indication: protocol.indication,
      name: `Gua Sha for ${protocol.indication.replace('_', ' ')}`,
      description: `Gua Sha treatment protocol for ${protocol.indication.replace('_', ' ')}`,
      steps: [
        {
          id: 'preparation',
          order: 1,
          type: 'preparation',
          title: 'Preparation',
          description: 'Prepare tools and treatment area',
          duration: '2-3 minutes',
          equipment: [protocol.tool, 'massage_oil']
        },
        {
          id: 'treatment',
          order: 2,
          type: 'treatment',
          title: 'Gua Sha Application',
          description: protocol.clinicalNotes,
          duration: protocol.duration,
          points: protocol.primaryAreas,
          techniques: [protocol.pressure, protocol.scrapingDirection],
          notes: `Tool: ${protocol.tool} | Direction: ${protocol.scrapingDirection}`
        }
      ],
      duration: protocol.duration,
      frequency: protocol.frequency,
      difficulty: 'intermediate',
      contraindications: protocol.contraindications || [],
      precautions: ['Monitor skin response', 'Use appropriate pressure', 'Avoid broken skin'],
      expectedOutcomes: [`Improved circulation`, 'Reduced tension', 'Lymphatic drainage'],
      clinicalNotes: protocol.clinicalNotes
    }));
  }

  getComparisonData() {
    return {
      duration: '15-25 minutes',
      frequency: '2-3 times per week',
      effectiveness: 88,
      easeOfUse: 80,
      safetyProfile: 90,
      cost: 'Low',
      equipment: 'Gua sha tool required'
    };
  }
}

export const guaShaPlugin = new GuaShaPlugin();
