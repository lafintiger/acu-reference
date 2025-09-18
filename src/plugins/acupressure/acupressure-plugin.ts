// Acupressure Modality Plugin
// First implementation of the new modular system

import { BaseModalityPlugin } from '../../lib/modality-system/base-plugin';
import { ModalityMetadata, ModalityProtocol, ModalityTechnique, ModalityEffectiveness, ModalityContraindications, ModalityComponents } from '../../lib/modality-system/types';
import { acupressureProtocols } from '../../data/acupressureProtocols';
import AcupressureProtocolPage from './components/AcupressureProtocolPage';
import AcupressureProtocolCard from './components/AcupressureProtocolCard';
import AcupressureTechniquesList from './components/AcupressureTechniquesList';
import AcupressureSafetyWarnings from './components/AcupressureSafetyWarnings';
import AcupressureComparisonMetrics from './components/AcupressureComparisonMetrics';

export class AcupressurePlugin extends BaseModalityPlugin {
  metadata: ModalityMetadata = {
    id: 'acupressure',
    name: 'acupressure',
    displayName: 'Acupressure',
    icon: '👆',
    description: 'Gentle finger pressure applied to specific acupuncture points to stimulate healing and balance energy flow.',
    version: '1.0.0',
    author: 'AcuReference Core',
    category: 'physical',
    skillLevel: 'beginner',
    equipmentRequired: false,
    selfAdministered: true
  };

  protocols: ModalityProtocol[] = this.convertLegacyProtocols();
  
  techniques: ModalityTechnique[] = [
    {
      id: 'finger_pressure',
      modalityId: 'acupressure',
      name: 'Finger Pressure',
      description: 'Apply steady pressure using fingertips',
      instructions: [
        'Locate the acupuncture point accurately',
        'Apply steady, perpendicular pressure',
        'Gradually increase pressure to patient tolerance',
        'Hold for specified duration',
        'Release pressure slowly'
      ],
      duration: '30 seconds to 3 minutes',
      intensity: 'moderate',
      contraindications: ['open_wounds', 'severe_inflammation']
    },
    {
      id: 'circular_pressure',
      modalityId: 'acupressure',
      name: 'Circular Pressure',
      description: 'Apply pressure with small circular motions',
      instructions: [
        'Place finger on point with moderate pressure',
        'Make small clockwise circles',
        'Maintain consistent pressure',
        'Continue for specified duration'
      ],
      duration: '1-2 minutes',
      intensity: 'light',
      contraindications: ['skin_sensitivity']
    },
    {
      id: 'pulsing_pressure',
      modalityId: 'acupressure',
      name: 'Pulsing Pressure',
      description: 'Rhythmic pressure application and release',
      instructions: [
        'Apply pressure for 3-5 seconds',
        'Release for 1-2 seconds',
        'Repeat rhythmic pattern',
        'Continue for total duration'
      ],
      duration: '2-3 minutes',
      intensity: 'moderate',
      contraindications: ['acute_pain']
    }
  ];

  effectiveness: ModalityEffectiveness[] = [
    {
      indication: 'headache',
      effectivenessScore: 85,
      evidenceLevel: 'high',
      studyReferences: ['Clinical trials on acupressure for headache relief'],
      clinicalNotes: 'Particularly effective for tension headaches and migraines'
    },
    {
      indication: 'stress',
      effectivenessScore: 90,
      evidenceLevel: 'high',
      clinicalNotes: 'Excellent for stress reduction and relaxation'
    },
    {
      indication: 'chronic_pain',
      effectivenessScore: 80,
      evidenceLevel: 'moderate',
      clinicalNotes: 'Good for ongoing pain management, requires regular application'
    },
    {
      indication: 'insomnia',
      effectivenessScore: 75,
      evidenceLevel: 'moderate',
      clinicalNotes: 'Helps with sleep quality when applied before bedtime'
    }
  ];

  contraindications: ModalityContraindications = {
    absolute: ['severe_osteoporosis', 'blood_clotting_disorders'],
    relative: ['pregnancy_first_trimester', 'recent_surgery'],
    pregnancy: 'caution',
    ageRestrictions: {
      minAge: 3,
      specialConsiderations: 'Use gentle pressure for children and elderly'
    },
    medications: ['blood_thinners'],
    conditions: ['severe_hypertension', 'heart_conditions']
  };

  components: ModalityComponents = {
    ProtocolPage: AcupressureProtocolPage,
    ProtocolCard: AcupressureProtocolCard,
    TechniquesList: AcupressureTechniquesList,
    SafetyWarnings: AcupressureSafetyWarnings,
    ComparisonMetrics: AcupressureComparisonMetrics
  };

  // Convert existing acupressure protocols to new format
  private convertLegacyProtocols(): ModalityProtocol[] {
    return acupressureProtocols.map(protocol => ({
      id: `acupressure_${protocol.indicationId}`,
      modalityId: 'acupressure',
      indication: protocol.indicationId,
      name: `Acupressure for ${protocol.indicationId.replace('_', ' ')}`,
      description: `Acupressure treatment protocol for ${protocol.indicationId.replace('_', ' ')}`,
      steps: [
        {
          id: 'preparation',
          order: 1,
          type: 'preparation',
          title: 'Preparation',
          description: 'Prepare for acupressure treatment',
          duration: '2-3 minutes',
          instructions: ['Ensure comfortable position', 'Relax the patient', 'Locate primary points']
        },
        {
          id: 'treatment',
          order: 2,
          type: 'treatment',
          title: 'Acupressure Application',
          description: protocol.clinicalNotes,
          duration: protocol.totalDuration,
          points: protocol.primaryPoints.map(p => p.pointId),
          techniques: protocol.primaryPoints.map(p => p.technique),
          notes: `Primary points: ${protocol.primaryPoints.map(p => p.pointName).join(', ')}`
        },
        {
          id: 'evaluation',
          order: 3,
          type: 'evaluation',
          title: 'Evaluation',
          description: 'Assess treatment response',
          duration: '1-2 minutes',
          notes: 'Check for symptom improvement and patient comfort'
        }
      ],
      duration: protocol.totalDuration,
      frequency: protocol.frequency,
      difficulty: 'beginner',
      contraindications: protocol.contraindications || [],
      precautions: [],
      expectedOutcomes: [`Improvement in ${protocol.indicationId.replace('_', ' ')}`],
      clinicalNotes: protocol.clinicalNotes
    }));
  }

  // Override comparison data with acupressure-specific metrics
  getComparisonData() {
    return {
      duration: '15-30 minutes',
      frequency: '2-3 times per week',
      effectiveness: 85,
      easeOfUse: 95,
      safetyProfile: 98,
      cost: 'Free',
      equipment: 'None - hands only'
    };
  }

  // Override to provide acupressure-specific search terms
  registerSearchTerms(): string[] {
    const baseTerms = super.registerSearchTerms();
    const acupressureTerms = [
      'finger pressure',
      'point pressure',
      'meridian massage',
      'pressure therapy',
      'self-treatment',
      'non-invasive',
      'traditional chinese medicine',
      'tcm'
    ];
    
    return [...baseTerms, ...acupressureTerms];
  }
}

// Export singleton instance
export const acupressurePlugin = new AcupressurePlugin();
