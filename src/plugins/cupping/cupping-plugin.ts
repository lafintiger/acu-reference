// Cupping Modality Plugin
// Second modality converted to the new plugin system

import { BaseModalityPlugin } from '../../lib/modality-system/base-plugin';
import { ModalityMetadata, ModalityProtocol, ModalityTechnique, ModalityEffectiveness, ModalityContraindications, ModalityComponents } from '../../lib/modality-system/types';
import { cuppingProtocols } from '../../data/cuppingProtocols';
import CuppingProtocolPage from './components/CuppingProtocolPage';
import CuppingProtocolCard from './components/CuppingProtocolCard';
import CuppingTechniquesList from './components/CuppingTechniquesList';
import CuppingSafetyWarnings from './components/CuppingSafetyWarnings';
import CuppingComparisonMetrics from './components/CuppingComparisonMetrics';

export class CuppingPlugin extends BaseModalityPlugin {
  metadata: ModalityMetadata = {
    id: 'cupping',
    name: 'cupping',
    displayName: 'Cupping Therapy',
    icon: '🥤',
    description: 'Suction therapy using cups to improve circulation, reduce muscle tension, and promote healing.',
    version: '1.0.0',
    author: 'AcuReference Core',
    category: 'physical',
    skillLevel: 'intermediate',
    equipmentRequired: true,
    selfAdministered: false
  };

  protocols: ModalityProtocol[] = this.convertLegacyProtocols();
  
  techniques: ModalityTechnique[] = [
    {
      id: 'stationary_cupping',
      modalityId: 'cupping',
      name: 'Stationary Cupping',
      description: 'Cups placed and left in position for specified duration',
      instructions: [
        'Clean and prepare the treatment area',
        'Select appropriate cup size for the area',
        'Apply moderate suction to create seal',
        'Leave cups in place for specified duration',
        'Remove cups by releasing suction gradually'
      ],
      duration: '10-20 minutes',
      intensity: 'moderate',
      equipment: ['glass_cups', 'suction_pump'],
      contraindications: ['pregnancy', 'blood_thinners', 'skin_conditions']
    },
    {
      id: 'moving_cupping',
      modalityId: 'cupping',
      name: 'Moving Cupping',
      description: 'Cups moved along meridian lines or muscle groups',
      instructions: [
        'Apply oil to treatment area',
        'Create light suction with cup',
        'Move cup smoothly along meridian or muscle',
        'Maintain consistent suction pressure',
        'Complete treatment area systematically'
      ],
      duration: '15-25 minutes',
      intensity: 'light',
      equipment: ['glass_cups', 'massage_oil', 'suction_pump'],
      contraindications: ['skin_sensitivity', 'recent_injuries']
    },
    {
      id: 'flash_cupping',
      modalityId: 'cupping',
      name: 'Flash Cupping',
      description: 'Rapid application and removal of cups',
      instructions: [
        'Apply cup with light suction',
        'Hold for 1-2 seconds',
        'Release suction and remove',
        'Repeat 5-10 times per point',
        'Move to next treatment area'
      ],
      duration: '5-10 minutes',
      intensity: 'light',
      equipment: ['glass_cups', 'suction_pump'],
      contraindications: ['severe_hypertension']
    },
    {
      id: 'wet_cupping',
      modalityId: 'cupping',
      name: 'Wet Cupping (Hijama)',
      description: 'Cupping with controlled bloodletting for detoxification',
      instructions: [
        'Perform dry cupping first',
        'Make small superficial incisions',
        'Apply cups to draw small amount of blood',
        'Monitor closely for patient comfort',
        'Apply antiseptic and bandage after treatment'
      ],
      duration: '20-30 minutes',
      intensity: 'firm',
      equipment: ['sterile_lancets', 'glass_cups', 'antiseptic', 'bandages'],
      contraindications: ['blood_disorders', 'pregnancy', 'diabetes', 'immunocompromised'],
      modifications: [
        {
          condition: 'first_time_patient',
          modification: 'Start with dry cupping only to assess tolerance'
        }
      ]
    }
  ];

  effectiveness: ModalityEffectiveness[] = [
    {
      indication: 'back_pain',
      effectivenessScore: 92,
      evidenceLevel: 'high',
      studyReferences: ['Systematic review: Cupping for chronic back pain'],
      clinicalNotes: 'Excellent for deep muscle tension and chronic back pain'
    },
    {
      indication: 'muscle_tension',
      effectivenessScore: 90,
      evidenceLevel: 'high',
      clinicalNotes: 'Rapid relief of muscle knots and tension'
    },
    {
      indication: 'respiratory_conditions',
      effectivenessScore: 85,
      evidenceLevel: 'moderate',
      clinicalNotes: 'Helps with chest congestion and breathing difficulties'
    },
    {
      indication: 'headache',
      effectivenessScore: 78,
      evidenceLevel: 'moderate',
      clinicalNotes: 'Effective for tension headaches, less effective for migraines'
    },
    {
      indication: 'athletic_recovery',
      effectivenessScore: 88,
      evidenceLevel: 'moderate',
      clinicalNotes: 'Popular among athletes for muscle recovery and performance'
    }
  ];

  contraindications: ModalityContraindications = {
    absolute: ['pregnancy', 'blood_clotting_disorders', 'severe_heart_conditions', 'skin_cancer'],
    relative: ['diabetes', 'recent_surgery', 'blood_thinners', 'skin_sensitivity'],
    pregnancy: 'avoid',
    ageRestrictions: {
      minAge: 12,
      maxAge: 75,
      specialConsiderations: 'Use lighter suction for elderly patients and adolescents'
    },
    medications: ['warfarin', 'heparin', 'aspirin_high_dose'],
    conditions: ['eczema', 'psoriasis', 'open_wounds', 'severe_anemia']
  };

  components: ModalityComponents = {
    ProtocolPage: CuppingProtocolPage,
    ProtocolCard: CuppingProtocolCard,
    TechniquesList: CuppingTechniquesList,
    SafetyWarnings: CuppingSafetyWarnings,
    ComparisonMetrics: CuppingComparisonMetrics
  };

  // Convert existing cupping protocols to new format
  private convertLegacyProtocols(): ModalityProtocol[] {
    return cuppingProtocols.map(protocol => ({
      id: `cupping_${protocol.indication}`,
      modalityId: 'cupping',
      indication: protocol.indication,
      name: `Cupping Therapy for ${protocol.indication.replace('_', ' ')}`,
      description: `Professional cupping treatment protocol for ${protocol.indication.replace('_', ' ')}`,
      steps: [
        {
          id: 'preparation',
          order: 1,
          type: 'preparation',
          title: 'Preparation',
          description: 'Prepare equipment and treatment area',
          duration: '3-5 minutes',
          equipment: ['glass_cups', 'suction_pump', 'massage_oil'],
          instructions: ['Clean treatment area', 'Prepare cups and equipment', 'Position patient comfortably']
        },
        {
          id: 'treatment',
          order: 2,
          type: 'treatment',
          title: 'Cupping Application',
          description: protocol.clinicalNotes,
          duration: protocol.duration,
          points: protocol.primaryAreas,
          techniques: [protocol.technique, `${protocol.cupSize} cups`, `${protocol.suctionLevel} suction`],
          notes: `Cup sizes: ${protocol.cupSize} | Suction: ${protocol.suctionLevel}`
        },
        {
          id: 'evaluation',
          order: 3,
          type: 'evaluation',
          title: 'Post-Treatment Care',
          description: 'Remove cups and provide aftercare',
          duration: '2-3 minutes',
          instructions: ['Remove cups gradually', 'Check skin condition', 'Apply aftercare if needed'],
          notes: 'Explain normal skin discoloration and duration'
        }
      ],
      duration: protocol.duration,
      frequency: protocol.frequency,
      difficulty: 'intermediate',
      contraindications: protocol.contraindications || [],
      precautions: ['Monitor skin condition', 'Avoid over-suction', 'Educate patient about marks'],
      expectedOutcomes: [`Improved circulation in ${protocol.indication.replace('_', ' ')}`, 'Reduced muscle tension', 'Pain relief'],
      clinicalNotes: protocol.clinicalNotes
    }));
  }

  // Override comparison data with cupping-specific metrics
  getComparisonData() {
    return {
      duration: '20-30 minutes',
      frequency: '1-2 times per week',
      effectiveness: 90,
      easeOfUse: 75,
      safetyProfile: 85,
      cost: 'Low-Medium',
      equipment: 'Cups and suction pump required'
    };
  }

  // Override to provide cupping-specific search terms
  registerSearchTerms(): string[] {
    const baseTerms = super.registerSearchTerms();
    const cuppingTerms = [
      'suction therapy',
      'glass cups',
      'hijama',
      'wet cupping',
      'dry cupping',
      'moving cups',
      'circulation therapy',
      'muscle tension relief',
      'detoxification'
    ];
    
    return [...baseTerms, ...cuppingTerms];
  }
}

// Export singleton instance
export const cuppingPlugin = new CuppingPlugin();
