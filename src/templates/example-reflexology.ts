// Example: Reflexology Modality Plugin
// Complete example of how to use the modality template

import { SimpleModalityPlugin } from '../lib/modality-system/registry';

export const reflexologyPlugin: SimpleModalityPlugin = {
  // Basic Information
  id: 'reflexology',
  name: 'Reflexology',
  icon: '🦶',
  description: 'Foot pressure point therapy using reflex zones corresponding to body organs and systems',
  effectiveness: 78,

  // Treatment Protocols
  protocols: [
    {
      indication: 'headache',
      primaryPoints: ['big_toe_tip', 'toe_base_area', 'neck_reflex_zone'],
      technique: 'Apply firm pressure with thumb in circular motions on head reflex areas',
      duration: '2-3 minutes per point',
      frequency: '2-3 times per week',
      pressure: 'firm',
      equipment: ['hands_only'],
      contraindications: ['foot_injuries', 'severe_diabetes', 'open_wounds'],
      clinicalNotes: 'Focus on head reflex areas located on big toes and base of all toes. Work systematically.',
      sequence: ['foot_preparation', 'toe_tips_pressure', 'neck_reflex_zone', 'integration_massage'],
      totalDuration: '15-20 minutes'
    },
    {
      indication: 'stress',
      primaryPoints: ['solar_plexus_reflex', 'adrenal_reflex', 'heart_reflex'],
      technique: 'Gentle to moderate pressure with thumb and finger walking technique',
      duration: '3-5 minutes per area',
      frequency: 'daily for acute stress, 3x/week for maintenance',
      pressure: 'moderate',
      equipment: ['hands_only', 'foot_cream_optional'],
      contraindications: ['pregnancy_first_trimester', 'severe_hypertension'],
      clinicalNotes: 'Work on stress-related reflex points. Include breathing guidance for patient.',
      sequence: ['relaxation_induction', 'solar_plexus_work', 'adrenal_support', 'heart_calming'],
      totalDuration: '20-25 minutes'
    },
    {
      indication: 'digestive_disorders',
      primaryPoints: ['stomach_reflex', 'liver_reflex', 'intestine_reflex', 'pancreas_reflex'],
      technique: 'Gentle pressure with circular motions, follow digestive tract pathway',
      duration: '2-4 minutes per organ reflex',
      frequency: '3-4 times per week',
      pressure: 'light_to_moderate',
      equipment: ['hands_only'],
      contraindications: ['acute_abdominal_pain', 'foot_infections'],
      clinicalNotes: 'Work digestive reflexes in anatomical order. Monitor patient comfort.',
      sequence: ['stomach_area', 'liver_support', 'intestinal_pathway', 'pancreatic_balance'],
      totalDuration: '25-30 minutes'
    },
    {
      indication: 'insomnia',
      primaryPoints: ['pineal_reflex', 'brain_stem_reflex', 'nervous_system_reflex'],
      technique: 'Very gentle pressure with soothing, slow movements',
      duration: '3-5 minutes per area',
      frequency: 'nightly before bed',
      pressure: 'light',
      equipment: ['hands_only', 'relaxing_music_optional'],
      contraindications: ['restless_leg_syndrome'],
      clinicalNotes: 'Use calming, rhythmic pressure. Include relaxation breathing techniques.',
      sequence: ['general_relaxation', 'nervous_system_calming', 'pineal_stimulation', 'integration'],
      totalDuration: '20-30 minutes'
    }
  ],

  // Protocol Matching Function
  getProtocolsForIndication(indication: string): any[] {
    return this.protocols.filter(protocol => 
      protocol.indication === indication ||
      protocol.indication.toLowerCase().includes(indication.toLowerCase()) ||
      indication.toLowerCase().includes(protocol.indication.toLowerCase())
    );
  }
};

/*
TO USE THIS EXAMPLE:

1. Copy this file to: src/plugins/reflexology.ts
2. Import in src/lib/modality-system/init.ts:
   import { reflexologyPlugin } from '../../plugins/reflexology';
3. Register: modalityRegistry.register(reflexologyPlugin);
4. Restart app - Reflexology will automatically appear everywhere!

The reflexology modality will then:
✅ Show in Plugin System page
✅ Appear on Headache, Stress, Digestive Disorders, and Insomnia indication pages
✅ Include in treatment comparisons with 78% effectiveness rating
✅ Work with AI recommendations
✅ Support voice commands like "Show me reflexology for headache"
✅ Integrate with patient intake analysis
*/
