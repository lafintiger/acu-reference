// Clinical Diagnoses Database
// Professional diagnostic conclusions based on assessment findings

import { Diagnosis, TCMPattern } from '../types/clinical-workflow';

export const clinicalDiagnoses: Diagnosis[] = [
  // Primary Diagnoses - Western Medicine
  {
    id: 'tension_headache_syndrome',
    name: 'Tension Headache Syndrome',
    category: 'primary',
    type: 'western',
    description: 'Recurrent bilateral headaches with muscle tension component',
    diagnosticCriteria: [
      'Bilateral pressure or tightness',
      'Mild to moderate intensity',
      'Not aggravated by routine physical activity',
      'Associated with neck/shoulder muscle tension'
    ],
    associatedSigns: ['muscle_tension_neck', 'trigger_points_shoulders'],
    associatedSymptoms: ['headache_tension', 'neck_pain'],
    prognosis: 'good',
    treatmentApproach: 'Multi-modal therapy focusing on muscle tension relief and stress management'
  },
  {
    id: 'chronic_fatigue_syndrome',
    name: 'Chronic Fatigue Syndrome',
    category: 'primary',
    type: 'western',
    description: 'Persistent fatigue not relieved by rest, lasting >6 months',
    diagnosticCriteria: [
      'Severe fatigue for >6 months',
      'Post-exertional malaise',
      'Unrefreshing sleep',
      'Cognitive difficulties'
    ],
    associatedSigns: ['pulse_weak', 'tongue_pale'],
    associatedSymptoms: ['chronic_fatigue', 'insomnia', 'depression_mood'],
    prognosis: 'fair',
    treatmentApproach: 'Constitutional strengthening with gentle modalities and lifestyle modification'
  },
  {
    id: 'anxiety_disorder',
    name: 'Generalized Anxiety Disorder',
    category: 'primary',
    type: 'western',
    description: 'Excessive worry and anxiety affecting daily functioning',
    diagnosticCriteria: [
      'Excessive worry for >6 months',
      'Difficulty controlling worry',
      'Physical symptoms (tension, fatigue)',
      'Functional impairment'
    ],
    associatedSigns: ['tachycardia', 'muscle_tension_neck', 'pulse_wiry'],
    associatedSymptoms: ['anxiety', 'insomnia', 'irritability'],
    prognosis: 'good',
    treatmentApproach: 'Calming techniques with stress reduction and nervous system support'
  },

  // Secondary Diagnoses
  {
    id: 'stress_related_disorder',
    name: 'Stress-Related Disorder',
    category: 'secondary',
    type: 'functional',
    description: 'Physical and emotional symptoms primarily caused by chronic stress',
    diagnosticCriteria: [
      'Multiple stress-related symptoms',
      'Identifiable stressors',
      'Symptoms improve with stress reduction',
      'No primary organic pathology'
    ],
    associatedSigns: ['hypertension', 'muscle_tension_neck', 'pulse_wiry'],
    associatedSymptoms: ['anxiety', 'insomnia', 'digestive_issues', 'irritability'],
    prognosis: 'excellent',
    treatmentApproach: 'Stress management with calming modalities and lifestyle counseling'
  },
  {
    id: 'digestive_dysfunction',
    name: 'Functional Digestive Dysfunction',
    category: 'secondary',
    type: 'functional',
    description: 'Digestive symptoms without clear organic pathology',
    diagnosticCriteria: [
      'Chronic digestive symptoms',
      'Normal diagnostic tests',
      'Stress or dietary triggers',
      'Functional impairment'
    ],
    associatedSigns: ['tongue_pale', 'pulse_weak'],
    associatedSymptoms: ['digestive_issues', 'fatigue'],
    prognosis: 'good',
    treatmentApproach: 'Digestive support with dietary guidance and gentle stimulation'
  }
];

export const tcmPatterns: TCMPattern[] = [
  // Qi and Blood Patterns
  {
    id: 'liver_qi_stagnation',
    name: 'Liver Qi Stagnation',
    chineseName: '肝气郁结',
    category: 'qi_blood',
    description: 'Blocked flow of Liver Qi causing emotional and physical symptoms',
    keySymptoms: ['irritability', 'stress', 'headache', 'digestive_issues', 'mood_swings'],
    tonguePresentation: 'Normal or slightly red with thin coating',
    pulseQuality: 'Wiry (tight, string-like)',
    treatmentPrinciple: 'Soothe Liver Qi, promote smooth flow',
    recommendedPoints: ['LV3', 'LV14', 'GB34', 'PC6', 'EX-HN3'],
    recommendedHerbs: ['Xiao Yao San', 'Gan Mai Da Zao Tang'],
    lifestyleRecommendations: [
      'Stress management techniques',
      'Regular exercise',
      'Avoid excessive alcohol',
      'Emotional expression and support'
    ]
  },
  {
    id: 'kidney_yang_deficiency',
    name: 'Kidney Yang Deficiency',
    chineseName: '肾阳虚',
    category: 'organ_system',
    description: 'Insufficient Kidney Yang leading to cold, fatigue, and fluid retention',
    keySymptoms: ['chronic_fatigue', 'cold_extremities', 'lower_back_pain', 'urinary_frequency'],
    tonguePresentation: 'Pale, swollen with white coating',
    pulseQuality: 'Deep, slow, weak',
    treatmentPrinciple: 'Tonify Kidney Yang, warm the body',
    recommendedPoints: ['KI3', 'KI7', 'GV4', 'GV20', 'ST36', 'REN4'],
    recommendedHerbs: ['Jin Gui Shen Qi Wan', 'You Gui Wan'],
    lifestyleRecommendations: [
      'Warm foods and drinks',
      'Gentle exercise (tai chi, qigong)',
      'Adequate rest and sleep',
      'Avoid cold and raw foods'
    ]
  },
  {
    id: 'spleen_qi_deficiency',
    name: 'Spleen Qi Deficiency',
    chineseName: '脾气虚',
    category: 'organ_system',
    description: 'Weak Spleen function affecting digestion and energy production',
    keySymptoms: ['digestive_issues', 'fatigue', 'loose_stools', 'poor_appetite', 'bloating'],
    tonguePresentation: 'Pale with thick white coating, tooth marks',
    pulseQuality: 'Weak, especially in right middle position',
    treatmentPrinciple: 'Tonify Spleen Qi, strengthen digestion',
    recommendedPoints: ['ST36', 'SP3', 'SP6', 'REN12', 'REN6'],
    recommendedHerbs: ['Si Jun Zi Tang', 'Bu Zhong Yi Qi Tang'],
    lifestyleRecommendations: [
      'Regular meal times',
      'Warm, cooked foods',
      'Avoid excessive worry',
      'Gentle exercise after meals'
    ]
  },
  {
    id: 'heart_blood_deficiency',
    name: 'Heart Blood Deficiency',
    chineseName: '心血虚',
    category: 'qi_blood',
    description: 'Insufficient Heart Blood causing emotional and sleep disturbances',
    keySymptoms: ['insomnia', 'anxiety', 'palpitations', 'poor_memory', 'vivid_dreams'],
    tonguePresentation: 'Pale, thin, dry',
    pulseQuality: 'Thin, weak, especially in left front position',
    treatmentPrinciple: 'Nourish Heart Blood, calm the mind',
    recommendedPoints: ['HT7', 'PC6', 'SP6', 'ST36', 'GV20', 'EX-HN3'],
    recommendedHerbs: ['Gan Mai Da Zao Tang', 'Ding Zhi Wan'],
    lifestyleRecommendations: [
      'Regular sleep schedule',
      'Meditation or relaxation practices',
      'Avoid excessive stimulation',
      'Nourishing foods (dates, longan, spinach)'
    ]
  },
  {
    id: 'lung_qi_deficiency',
    name: 'Lung Qi Deficiency',
    chineseName: '肺气虚',
    category: 'organ_system',
    description: 'Weak Lung function affecting breathing and immune response',
    keySymptoms: ['shortness_of_breath', 'weak_voice', 'frequent_colds', 'fatigue', 'sweating'],
    tonguePresentation: 'Pale with white coating',
    pulseQuality: 'Weak, especially in right front position',
    treatmentPrinciple: 'Tonify Lung Qi, strengthen respiratory function',
    recommendedPoints: ['LU9', 'LU1', 'ST36', 'KI3', 'GV20', 'REN17'],
    recommendedHerbs: ['Bu Fei Tang', 'Jade Screen Powder'],
    lifestyleRecommendations: [
      'Deep breathing exercises',
      'Avoid cold and wind exposure',
      'Moderate exercise',
      'Immune-supporting foods'
    ]
  }
];

// Helper functions for diagnosis
export const getDiagnosesByCategory = (category: Diagnosis['category']): Diagnosis[] => {
  return clinicalDiagnoses.filter(diagnosis => diagnosis.category === category);
};

export const getDiagnosesByType = (type: Diagnosis['type']): Diagnosis[] => {
  return clinicalDiagnoses.filter(diagnosis => diagnosis.type === type);
};

export const getTCMPatternsByCategory = (category: TCMPattern['category']): TCMPattern[] => {
  return tcmPatterns.filter(pattern => pattern.category === category);
};

export const getDiagnosesForSigns = (signIds: string[]): Diagnosis[] => {
  return clinicalDiagnoses.filter(diagnosis =>
    diagnosis.associatedSigns.some(sign => signIds.includes(sign))
  );
};

export const getDiagnosesForSymptoms = (symptomIds: string[]): Diagnosis[] => {
  return clinicalDiagnoses.filter(diagnosis =>
    diagnosis.associatedSymptoms.some(symptom => symptomIds.includes(symptom))
  );
};

export const getTCMPatternsForSymptoms = (symptomIds: string[]): TCMPattern[] => {
  return tcmPatterns.filter(pattern =>
    pattern.keySymptoms.some(symptom => symptomIds.includes(symptom))
  );
};
