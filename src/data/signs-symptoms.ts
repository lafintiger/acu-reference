// Signs and Symptoms Database
// Observable clinical data for assessment phase

import { Sign, Symptom } from '../types/clinical-workflow';

export const clinicalSigns: Sign[] = [
  // Vital Signs
  {
    id: 'hypertension',
    name: 'Elevated Blood Pressure',
    category: 'vital_signs',
    description: 'Blood pressure consistently above normal range',
    measurable: true,
    normalRange: 'Systolic: 90-120 mmHg, Diastolic: 60-80 mmHg',
    clinicalSignificance: 'May indicate cardiovascular stress, kidney issues, or stress-related disorders'
  },
  {
    id: 'tachycardia',
    name: 'Rapid Heart Rate',
    category: 'vital_signs',
    description: 'Heart rate above normal resting range',
    measurable: true,
    normalRange: '60-100 beats per minute',
    clinicalSignificance: 'May indicate stress, anxiety, hyperthyroidism, or cardiovascular issues'
  },

  // Physical Examination Signs
  {
    id: 'muscle_tension_neck',
    name: 'Neck Muscle Tension',
    category: 'palpation',
    description: 'Palpable tension and tightness in cervical muscles',
    measurable: false,
    clinicalSignificance: 'Often indicates stress, poor posture, or cervical spine dysfunction'
  },
  {
    id: 'trigger_points_shoulders',
    name: 'Shoulder Trigger Points',
    category: 'palpation',
    description: 'Tender, tight spots in shoulder muscles that refer pain',
    measurable: false,
    clinicalSignificance: 'Indicates muscle overuse, stress, or postural dysfunction'
  },
  {
    id: 'edema_lower_extremities',
    name: 'Lower Extremity Swelling',
    category: 'observation',
    description: 'Visible swelling in feet, ankles, or legs',
    measurable: true,
    normalRange: 'No visible swelling',
    clinicalSignificance: 'May indicate heart failure, kidney dysfunction, or circulatory issues'
  },

  // TCM-Specific Signs
  {
    id: 'tongue_pale',
    name: 'Pale Tongue',
    category: 'observation',
    description: 'Tongue color lighter than normal pink',
    measurable: false,
    clinicalSignificance: 'TCM: Indicates Blood deficiency or Yang deficiency'
  },
  {
    id: 'tongue_red',
    name: 'Red Tongue',
    category: 'observation',
    description: 'Tongue color darker red than normal',
    measurable: false,
    clinicalSignificance: 'TCM: Indicates Heat condition or Yin deficiency'
  },
  {
    id: 'pulse_wiry',
    name: 'Wiry Pulse',
    category: 'palpation',
    description: 'Pulse feels tight and string-like under finger pressure',
    measurable: false,
    clinicalSignificance: 'TCM: Indicates Liver Qi Stagnation or stress'
  },
  {
    id: 'pulse_weak',
    name: 'Weak Pulse',
    category: 'palpation',
    description: 'Pulse lacks strength and feels soft or thready',
    measurable: false,
    clinicalSignificance: 'TCM: Indicates Qi or Blood deficiency'
  }
];

export const clinicalSymptoms: Symptom[] = [
  // Pain Symptoms
  {
    id: 'headache_tension',
    name: 'Tension Headache',
    category: 'pain',
    description: 'Band-like pressure around head, often bilateral',
    severity: 5,
    duration: 'hours to days',
    frequency: 'episodic',
    triggers: ['stress', 'poor_posture', 'eye_strain'],
    alleviatingFactors: ['rest', 'massage', 'stress_reduction']
  },
  {
    id: 'headache_migraine',
    name: 'Migraine Headache',
    category: 'pain',
    description: 'Severe, often unilateral, throbbing headache',
    severity: 8,
    duration: '4-72 hours',
    frequency: 'episodic',
    triggers: ['hormonal_changes', 'certain_foods', 'stress', 'bright_lights'],
    alleviatingFactors: ['dark_room', 'quiet', 'sleep']
  },
  {
    id: 'neck_pain',
    name: 'Neck Pain',
    category: 'pain',
    description: 'Pain and stiffness in cervical region',
    severity: 6,
    duration: 'days to weeks',
    frequency: 'constant',
    triggers: ['poor_posture', 'stress', 'sleeping_position'],
    alleviatingFactors: ['heat', 'gentle_movement', 'massage']
  },
  {
    id: 'lower_back_pain',
    name: 'Lower Back Pain',
    category: 'pain',
    description: 'Pain in lumbar region, may radiate',
    severity: 7,
    duration: 'acute to chronic',
    frequency: 'constant',
    triggers: ['lifting', 'prolonged_sitting', 'poor_posture'],
    alleviatingFactors: ['rest', 'heat', 'gentle_exercise']
  },

  // Functional Symptoms
  {
    id: 'insomnia',
    name: 'Insomnia',
    category: 'functional',
    description: 'Difficulty falling asleep or staying asleep',
    severity: 6,
    duration: 'weeks to months',
    frequency: 'nightly',
    triggers: ['stress', 'caffeine', 'screen_time', 'anxiety'],
    alleviatingFactors: ['relaxation_techniques', 'regular_schedule', 'dark_room']
  },
  {
    id: 'digestive_issues',
    name: 'Digestive Discomfort',
    category: 'functional',
    description: 'Bloating, gas, irregular bowel movements',
    severity: 4,
    duration: 'days to weeks',
    frequency: 'intermittent',
    triggers: ['certain_foods', 'stress', 'irregular_eating'],
    alleviatingFactors: ['dietary_changes', 'stress_reduction', 'regular_meals']
  },
  {
    id: 'chronic_fatigue',
    name: 'Chronic Fatigue',
    category: 'systemic',
    description: 'Persistent exhaustion not relieved by rest',
    severity: 7,
    duration: 'months to years',
    frequency: 'constant',
    triggers: ['overexertion', 'stress', 'poor_sleep'],
    alleviatingFactors: ['pacing', 'stress_management', 'gentle_exercise']
  },

  // Emotional Symptoms
  {
    id: 'anxiety',
    name: 'Anxiety',
    category: 'emotional',
    description: 'Excessive worry, nervousness, or fear',
    severity: 6,
    duration: 'weeks to months',
    frequency: 'episodic',
    triggers: ['stress', 'caffeine', 'social_situations'],
    alleviatingFactors: ['breathing_exercises', 'relaxation', 'support']
  },
  {
    id: 'depression_mood',
    name: 'Depressed Mood',
    category: 'emotional',
    description: 'Persistent sadness, hopelessness, or low mood',
    severity: 6,
    duration: 'weeks to months',
    frequency: 'constant',
    triggers: ['life_events', 'seasonal_changes', 'isolation'],
    alleviatingFactors: ['social_support', 'exercise', 'sunlight', 'purpose']
  },
  {
    id: 'irritability',
    name: 'Irritability',
    category: 'emotional',
    description: 'Increased tendency to anger or frustration',
    severity: 5,
    duration: 'days to weeks',
    frequency: 'episodic',
    triggers: ['stress', 'hormonal_changes', 'pain', 'fatigue'],
    alleviatingFactors: ['stress_reduction', 'exercise', 'adequate_sleep']
  },

  // Sensory Symptoms
  {
    id: 'tinnitus',
    name: 'Tinnitus',
    category: 'sensory',
    description: 'Ringing, buzzing, or humming in ears',
    severity: 4,
    duration: 'constant or intermittent',
    frequency: 'constant',
    triggers: ['loud_noise', 'stress', 'certain_medications'],
    alleviatingFactors: ['quiet_environment', 'stress_reduction', 'masking_sounds']
  },
  {
    id: 'dizziness',
    name: 'Dizziness',
    category: 'sensory',
    description: 'Feeling unsteady, lightheaded, or off-balance',
    severity: 5,
    duration: 'minutes to hours',
    frequency: 'episodic',
    triggers: ['standing_quickly', 'dehydration', 'stress'],
    alleviatingFactors: ['sitting_down', 'hydration', 'slow_movements']
  }
];

// Helper functions for clinical assessment
export const getSignsByCategory = (category: Sign['category']): Sign[] => {
  return clinicalSigns.filter(sign => sign.category === category);
};

export const getSymptomsByCategory = (category: Symptom['category']): Symptom[] => {
  return clinicalSymptoms.filter(symptom => symptom.category === category);
};

export const getSignsForCondition = (condition: string): Sign[] => {
  return clinicalSigns.filter(sign => 
    sign.clinicalSignificance.toLowerCase().includes(condition.toLowerCase())
  );
};

export const getSymptomsForCondition = (condition: string): Symptom[] => {
  return clinicalSymptoms.filter(symptom => 
    symptom.triggers?.some(trigger => trigger.toLowerCase().includes(condition.toLowerCase())) ||
    symptom.description.toLowerCase().includes(condition.toLowerCase())
  );
};
