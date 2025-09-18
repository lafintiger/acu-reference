// Applied Kinesiology Modality Plugin
// Fourth modality converted to the new plugin system

import { BaseModalityPlugin } from '../../lib/modality-system/base-plugin';
import { ModalityMetadata, ModalityProtocol, ModalityTechnique, ModalityEffectiveness, ModalityContraindications, ModalityComponents } from '../../lib/modality-system/types';
import { appliedKinesiologyProtocols } from '../../data/appliedKinesiologyProtocols';
import AppliedKinesiologyProtocolPage from './components/AppliedKinesiologyProtocolPage';
import AppliedKinesiologyProtocolCard from './components/AppliedKinesiologyProtocolCard';
import AppliedKinesiologyTechniquesList from './components/AppliedKinesiologyTechniquesList';
import AppliedKinesiologySafetyWarnings from './components/AppliedKinesiologySafetyWarnings';
import AppliedKinesiologyComparisonMetrics from './components/AppliedKinesiologyComparisonMetrics';

export class AppliedKinesiologyPlugin extends BaseModalityPlugin {
  metadata: ModalityMetadata = {
    id: 'applied_kinesiology',
    name: 'applied_kinesiology',
    displayName: 'Applied Kinesiology',
    icon: '💪',
    description: 'Muscle testing technique to assess body function and identify imbalances for targeted treatment.',
    version: '1.0.0',
    author: 'AcuReference Core',
    category: 'diagnostic',
    skillLevel: 'advanced',
    equipmentRequired: false,
    selfAdministered: false
  };

  protocols: ModalityProtocol[] = this.convertLegacyProtocols();
  
  techniques: ModalityTechnique[] = [
    {
      id: 'manual_muscle_testing',
      modalityId: 'applied_kinesiology',
      name: 'Manual Muscle Testing',
      description: 'Basic muscle strength testing to assess neurological function',
      instructions: [
        'Position patient in optimal testing position',
        'Isolate specific muscle group',
        'Apply gradual pressure against muscle contraction',
        'Assess strength response and quality',
        'Document findings and correlate with symptoms'
      ],
      duration: '2-5 minutes per muscle',
      intensity: 'variable',
      contraindications: ['acute_injuries', 'severe_pain']
    },
    {
      id: 'challenge_testing',
      modalityId: 'applied_kinesiology',
      name: 'Challenge Testing',
      description: 'Testing muscle response to various stimuli or substances',
      instructions: [
        'Establish baseline muscle strength',
        'Introduce challenge stimulus',
        'Retest muscle strength',
        'Compare pre and post challenge responses',
        'Identify positive or negative responses'
      ],
      duration: '5-10 minutes',
      intensity: 'light',
      contraindications: ['known_allergies', 'severe_sensitivities']
    }
  ];

  effectiveness: ModalityEffectiveness[] = [
    {
      indication: 'functional_disorders',
      effectivenessScore: 92,
      evidenceLevel: 'moderate',
      clinicalNotes: 'Excellent for identifying functional imbalances and root causes'
    },
    {
      indication: 'nutritional_assessment',
      effectivenessScore: 88,
      evidenceLevel: 'low',
      clinicalNotes: 'Useful for identifying nutritional needs and sensitivities'
    },
    {
      indication: 'structural_imbalances',
      effectivenessScore: 85,
      evidenceLevel: 'moderate',
      clinicalNotes: 'Effective for postural and structural assessment'
    }
  ];

  contraindications: ModalityContraindications = {
    absolute: ['severe_neurological_conditions', 'inability_to_contract_muscles'],
    relative: ['acute_injuries', 'severe_fatigue', 'medication_effects'],
    pregnancy: 'safe',
    ageRestrictions: {
      minAge: 5,
      specialConsiderations: 'Requires patient cooperation and ability to follow instructions'
    },
    medications: ['muscle_relaxants', 'sedatives'],
    conditions: ['severe_depression', 'cognitive_impairment']
  };

  components: ModalityComponents = {
    ProtocolPage: AppliedKinesiologyProtocolPage,
    ProtocolCard: AppliedKinesiologyProtocolCard,
    TechniquesList: AppliedKinesiologyTechniquesList,
    SafetyWarnings: AppliedKinesiologySafetyWarnings,
    ComparisonMetrics: AppliedKinesiologyComparisonMetrics
  };

  private convertLegacyProtocols(): ModalityProtocol[] {
    return appliedKinesiologyProtocols.map(protocol => ({
      id: `ak_${protocol.indicationId}`,
      modalityId: 'applied_kinesiology',
      indication: protocol.indicationId,
      name: `AK Assessment for ${protocol.indicationId.replace('_', ' ')}`,
      description: `Applied Kinesiology assessment and correction protocol for ${protocol.indicationId.replace('_', ' ')}`,
      steps: [
        {
          id: 'assessment',
          order: 1,
          type: 'assessment',
          title: 'Muscle Assessment',
          description: 'Test primary muscle groups',
          duration: '10-15 minutes',
          points: protocol.primaryAssessments.map(assessment => assessment.muscleName),
          techniques: ['manual_muscle_testing'],
          notes: `Primary assessments: ${protocol.primaryAssessments.map(a => a.muscleName).join(', ')}`
        },
        {
          id: 'treatment',
          order: 2,
          type: 'treatment',
          title: 'Correction Techniques',
          description: protocol.clinicalNotes,
          duration: '10-20 minutes',
          techniques: protocol.corrections.map(c => c.correctionType),
          notes: `Corrections: ${protocol.corrections.map(c => c.targetArea).join(', ')}`
        }
      ],
      duration: '30-45 minutes',
      frequency: 'As needed for assessment',
      difficulty: 'advanced',
      contraindications: protocol.contraindications || [],
      precautions: ['Ensure patient cooperation', 'Avoid muscle fatigue', 'Document findings'],
      expectedOutcomes: ['Identify muscle weaknesses', 'Correct imbalances', 'Improve function'],
      clinicalNotes: protocol.clinicalNotes
    }));
  }

  getComparisonData() {
    return {
      duration: '30-45 minutes',
      frequency: 'As needed',
      effectiveness: 92,
      easeOfUse: 60,
      safetyProfile: 95,
      cost: 'Free',
      equipment: 'None required'
    };
  }
}

export const appliedKinesiologyPlugin = new AppliedKinesiologyPlugin();
