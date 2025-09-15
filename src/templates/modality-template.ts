// Modality Template - Easy New Modality Creation
// Fill out this template to create a complete new modality plugin

import { SimpleModalityPlugin } from '../lib/modality-system/registry';

// TEMPLATE: Replace all TEMPLATE_ values with your modality information
export const TEMPLATE_modalityPlugin: SimpleModalityPlugin = {
  // BASIC INFORMATION - Replace these values
  id: 'TEMPLATE_modality_id', // e.g., 'reflexology', 'aromatherapy', 'sound_therapy'
  name: 'TEMPLATE_Modality_Name', // e.g., 'Reflexology', 'Aromatherapy', 'Sound Therapy'
  icon: 'TEMPLATE_🔧', // e.g., '🦶', '🌸', '🎵'
  description: 'TEMPLATE_Description of your modality and how it works',
  effectiveness: 85, // 0-100 based on your experience/research

  // PROTOCOLS - Add your treatment protocols here
  protocols: [
    {
      indication: 'TEMPLATE_condition1', // e.g., 'headache', 'stress', 'back_pain'
      primaryPoints: ['TEMPLATE_point1', 'TEMPLATE_point2'], // Your specific points/areas
      technique: 'TEMPLATE_technique_description', // How you apply the treatment
      duration: 'TEMPLATE_duration', // e.g., '15-20 minutes', '30 minutes'
      frequency: 'TEMPLATE_frequency', // e.g., '2-3 times per week', 'daily'
      pressure: 'TEMPLATE_pressure', // e.g., 'light', 'moderate', 'firm'
      equipment: ['TEMPLATE_equipment'], // e.g., ['essential_oils'], ['crystals'], ['tuning_forks']
      contraindications: ['TEMPLATE_contraindication'], // e.g., ['pregnancy'], ['skin_sensitivity']
      clinicalNotes: 'TEMPLATE_clinical_notes', // Your professional observations
      sequence: ['TEMPLATE_step1', 'TEMPLATE_step2'], // Treatment sequence
      totalDuration: 'TEMPLATE_total_time' // Total session time
    },
    {
      indication: 'TEMPLATE_condition2',
      primaryPoints: ['TEMPLATE_point3', 'TEMPLATE_point4'],
      technique: 'TEMPLATE_technique2',
      duration: 'TEMPLATE_duration2',
      frequency: 'TEMPLATE_frequency2',
      pressure: 'TEMPLATE_pressure2',
      equipment: ['TEMPLATE_equipment2'],
      contraindications: ['TEMPLATE_contraindication2'],
      clinicalNotes: 'TEMPLATE_clinical_notes2',
      sequence: ['TEMPLATE_step1', 'TEMPLATE_step2'],
      totalDuration: 'TEMPLATE_total_time2'
    }
    // Add more protocols as needed...
  ],

  // INDICATION MATCHING - This function determines which protocols apply to which conditions
  getProtocolsForIndication(indication: string): any[] {
    return this.protocols.filter(protocol => 
      protocol.indication === indication ||
      protocol.indication.toLowerCase().includes(indication.toLowerCase()) ||
      indication.toLowerCase().includes(protocol.indication.toLowerCase())
    );
  }
};

/* 
USAGE INSTRUCTIONS:

1. COPY this template to a new file: src/plugins/your-modality.ts

2. REPLACE all TEMPLATE_ values with your modality information:
   - Change TEMPLATE_modalityPlugin to yourModalityPlugin
   - Fill in your modality details (id, name, icon, description)
   - Add your treatment protocols with real data
   - Specify your points, techniques, and clinical notes

3. REGISTER your modality in src/lib/modality-system/init.ts:
   - Import: import { yourModalityPlugin } from '../../plugins/your-modality';
   - Register: modalityRegistry.register(yourModalityPlugin);

4. RESTART the app - your modality will automatically appear:
   - In the Plugin System page
   - On all relevant indication pages
   - In treatment comparisons
   - Available for AI recommendations

EXAMPLE - Reflexology Modality:

export const reflexologyPlugin: SimpleModalityPlugin = {
  id: 'reflexology',
  name: 'Reflexology',
  icon: '🦶',
  description: 'Foot pressure point therapy using reflex zones corresponding to body organs',
  effectiveness: 78,
  
  protocols: [
    {
      indication: 'headache',
      primaryPoints: ['big_toe_tip', 'toe_base_area', 'neck_reflex_zone'],
      technique: 'Apply firm pressure with thumb in circular motions',
      duration: '2-3 minutes per point',
      frequency: '2-3 times per week',
      pressure: 'firm',
      equipment: ['hands_only'],
      contraindications: ['foot_injuries', 'severe_diabetes'],
      clinicalNotes: 'Focus on head reflex areas on big toes and base of toes',
      sequence: ['preparation', 'toe_tips', 'neck_zone', 'integration'],
      totalDuration: '15-20 minutes'
    }
  ],
  
  getProtocolsForIndication(indication: string): any[] {
    return this.protocols.filter(protocol => 
      protocol.indication === indication ||
      protocol.indication.toLowerCase().includes(indication.toLowerCase())
    );
  }
};

Your new modality will then automatically:
✅ Appear in Plugin System page
✅ Show on relevant indication pages  
✅ Include in treatment comparisons
✅ Work with AI recommendations
✅ Support voice commands
✅ Integrate with patient intake analysis

*/
