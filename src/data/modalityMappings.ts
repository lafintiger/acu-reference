// Condition-specific technique recommendations for each modality
export interface ConditionTreatment {
  conditionId: string;
  modalityId: 'acupressure' | 'cupping' | 'gua_sha' | 'applied_kinesiology';
  recommendedTechniques: string[];
  specificInstructions: string;
  contraindications?: string[];
  modifications?: string;
}

export const conditionTreatments: ConditionTreatment[] = [
  // Headache Treatments
  {
    conditionId: 'headache',
    modalityId: 'acupressure',
    recommendedTechniques: ['acupressure_bilateral', 'acupressure_sustained'],
    specificInstructions: 'Focus on LI4, GB20, and Taiyang. Apply bilateral pressure for 2-3 minutes each.',
    modifications: 'Use lighter pressure for tension headaches, firmer for migraines'
  },
  {
    conditionId: 'headache',
    modalityId: 'cupping',
    recommendedTechniques: ['cupping_upper_back', 'cupping_sliding'],
    specificInstructions: 'Apply cups to upper trapezius and GB21 area. Use sliding technique along neck.',
    contraindications: ['acute migraine with aura'],
    modifications: 'Light suction for tension headaches'
  },
  {
    conditionId: 'headache',
    modalityId: 'gua_sha',
    recommendedTechniques: ['gua_sha_neck_shoulders', 'gua_sha_headache'],
    specificInstructions: 'Gentle scraping from occiput down to shoulders, following GB meridian.',
    cautions: 'Very light pressure on head, moderate on neck/shoulders'
  },
  {
    conditionId: 'headache',
    modalityId: 'applied_kinesiology',
    recommendedTechniques: ['ak_stress_release', 'ak_neurovascular'],
    specificInstructions: 'Test neck muscles, address cervical dysfunction, ESR for emotional component.',
    modifications: 'Focus on suboccipital muscles for tension headaches'
  },

  // Digestive Disorder Treatments
  {
    conditionId: 'digestive_disorders',
    modalityId: 'acupressure',
    recommendedTechniques: ['acupressure_circular', 'acupressure_sustained'],
    specificInstructions: 'Focus on ST36, SP6, CV12. Use clockwise circular motion on abdomen.',
    modifications: 'Lighter pressure for acute conditions'
  },
  {
    conditionId: 'digestive_disorders',
    modalityId: 'cupping',
    recommendedTechniques: ['cupping_digestive'],
    specificInstructions: 'Light cupping around umbilicus and stomach area. Avoid deep suction.',
    contraindications: ['acute abdominal pain', 'recent surgery'],
    modifications: 'Very light suction for sensitive patients'
  },
  {
    conditionId: 'digestive_disorders',
    modalityId: 'gua_sha',
    recommendedTechniques: ['gua_sha_back_bladder'],
    specificInstructions: 'Focus on BL20 (Spleen Shu) and BL21 (Stomach Shu) areas.',
    modifications: 'Gentle pressure, follow meridian direction'
  },
  {
    conditionId: 'digestive_disorders',
    modalityId: 'applied_kinesiology',
    recommendedTechniques: ['ak_neurolymphatic', 'ak_muscle_testing'],
    specificInstructions: 'Test psoas and abdominal muscles. Address neurolymphatic reflexes for digestive organs.',
    modifications: 'Include food sensitivity testing if appropriate'
  },

  // Anxiety Treatments
  {
    conditionId: 'anxiety',
    modalityId: 'acupressure',
    recommendedTechniques: ['acupressure_sustained', 'acupressure_bilateral'],
    specificInstructions: 'Focus on HT7, PC6, and Yintang. Hold points for calming effect.',
    modifications: 'Longer duration (3-5 minutes) for severe anxiety'
  },
  {
    conditionId: 'anxiety',
    modalityId: 'cupping',
    recommendedTechniques: ['cupping_upper_back'],
    specificInstructions: 'Light cupping on upper back to release tension. Focus on heart and lung areas.',
    modifications: 'Very gentle approach for anxious patients'
  },
  {
    conditionId: 'anxiety',
    modalityId: 'gua_sha',
    recommendedTechniques: ['gua_sha_neck_shoulders'],
    specificInstructions: 'Gentle scraping to release neck and shoulder tension associated with anxiety.',
    modifications: 'Extra gentle for stress-sensitive patients'
  },
  {
    conditionId: 'anxiety',
    modalityId: 'applied_kinesiology',
    recommendedTechniques: ['ak_stress_release', 'ak_neurovascular'],
    specificInstructions: 'ESR for emotional trauma, neurovascular points for circulation.',
    cautions: 'Ensure patient emotional safety throughout treatment'
  },

  // Back Pain Treatments
  {
    conditionId: 'back_pain',
    modalityId: 'acupressure',
    recommendedTechniques: ['acupressure_sustained', 'acupressure_tool_assisted'],
    specificInstructions: 'Focus on BL23, BL40, and local ashi points. Use firm pressure.',
    modifications: 'Adjust pressure based on acute vs chronic pain'
  },
  {
    conditionId: 'back_pain',
    modalityId: 'cupping',
    recommendedTechniques: ['cupping_stationary', 'cupping_sliding'],
    specificInstructions: 'Apply cups along bladder meridian lines. Use sliding technique for muscle tension.',
    contraindications: ['acute disc herniation'],
    modifications: 'Medium to strong suction for chronic pain'
  },
  {
    conditionId: 'back_pain',
    modalityId: 'gua_sha',
    recommendedTechniques: ['gua_sha_back_bladder'],
    specificInstructions: 'Systematic scraping along entire back, focusing on tender areas.',
    modifications: 'Adjust pressure based on patient tolerance'
  },
  {
    conditionId: 'back_pain',
    modalityId: 'applied_kinesiology',
    recommendedTechniques: ['ak_muscle_testing', 'ak_reactive_muscle'],
    specificInstructions: 'Test core stabilizers, address muscle imbalances and reactive patterns.',
    modifications: 'Include postural assessment and correction'
  },

  // Insomnia Treatments
  {
    conditionId: 'insomnia',
    modalityId: 'acupressure',
    recommendedTechniques: ['acupressure_sustained', 'acupressure_circular'],
    specificInstructions: 'Focus on HT7, KI1, and Yintang. Use calming, slow circular motions.',
    modifications: 'Perform before bedtime for best results'
  },
  {
    conditionId: 'insomnia',
    modalityId: 'cupping',
    recommendedTechniques: ['cupping_upper_back'],
    specificInstructions: 'Light cupping on upper back to calm nervous system.',
    modifications: 'Very gentle approach, focus on relaxation'
  },
  {
    conditionId: 'insomnia',
    modalityId: 'gua_sha',
    recommendedTechniques: ['gua_sha_neck_shoulders'],
    specificInstructions: 'Gentle scraping to release tension that may interfere with sleep.',
    modifications: 'Very light pressure, focus on relaxation'
  },
  {
    conditionId: 'insomnia',
    modalityId: 'applied_kinesiology',
    recommendedTechniques: ['ak_stress_release', 'ak_neurovascular'],
    specificInstructions: 'Address emotional stress patterns, balance autonomic nervous system.',
    modifications: 'Include lifestyle and sleep hygiene assessment'
  },

  // Neck Stiffness Treatments
  {
    conditionId: 'neck_stiffness',
    modalityId: 'acupressure',
    recommendedTechniques: ['acupressure_sustained', 'acupressure_circular'],
    specificInstructions: 'Focus on GB20, BL10, and local tender points. Use moderate pressure.',
    modifications: 'Include gentle neck movements during treatment'
  },
  {
    conditionId: 'neck_stiffness',
    modalityId: 'cupping',
    recommendedTechniques: ['cupping_stationary', 'cupping_sliding'],
    specificInstructions: 'Apply cups to neck and upper shoulder region. Use sliding technique.',
    cautions: 'Avoid anterior neck, focus on posterior and lateral aspects'
  },
  {
    conditionId: 'neck_stiffness',
    modalityId: 'gua_sha',
    recommendedTechniques: ['gua_sha_neck_shoulders'],
    specificInstructions: 'Systematic scraping of neck and shoulder muscles, following meridian lines.',
    modifications: 'Start gently and increase pressure as tolerated'
  },
  {
    conditionId: 'neck_stiffness',
    modalityId: 'applied_kinesiology',
    recommendedTechniques: ['ak_muscle_testing', 'ak_neurolymphatic'],
    specificInstructions: 'Test neck muscles, address cervical spine dysfunction and muscle imbalances.',
    modifications: 'Include postural correction and ergonomic advice'
  }
];

// Get recommended techniques for a specific condition and modality
export const getTechniquesForCondition = (conditionId: string, modalityId?: string) => {
  if (modalityId) {
    return conditionTreatments.filter(ct => 
      ct.conditionId === conditionId && ct.modalityId === modalityId
    );
  }
  return conditionTreatments.filter(ct => ct.conditionId === conditionId);
};

// Get all conditions that a modality can treat
export const getConditionsForModality = (modalityId: string) => {
  return conditionTreatments
    .filter(ct => ct.modalityId === modalityId)
    .map(ct => ct.conditionId);
};
