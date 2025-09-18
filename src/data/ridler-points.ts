// Ridler Points - Neurovascular Reflex Points
// Second diagnostic system for vascular circulation assessment

import { DiagnosticPoint } from '../types/clinical-workflow';

export const ridlerPoints: DiagnosticPoint[] = [
  {
    id: 'ridler_frontal_eminences',
    system: 'ridler',
    name: 'Frontal Eminences',
    location: 'Bilateral frontal bone prominences, approximately 1 inch above the eyebrows',
    anatomicalLandmarks: ['frontal_bone', 'eyebrow_ridge', 'temporal_line'],
    associatedOrgan: 'adrenal_glands',
    associatedMeridian: 'KI',
    testingMethod: 'Light fingertip contact, hold for 20-30 seconds until pulse synchronization',
    positiveFindings: ['weak_pulse', 'asynchronous_pulse', 'delayed_response'],
    clinicalSignificance: 'Indicates adrenal stress, fight-or-flight response activation',
    relatedConditions: ['stress', 'anxiety', 'adrenal_fatigue', 'insomnia', 'blood_pressure_irregularities']
  },
  {
    id: 'ridler_sphenoid',
    system: 'ridler',
    name: 'Sphenoid (Temporal)',
    location: 'Above and slightly forward of the ears, on the temporal bones',
    anatomicalLandmarks: ['temporal_bone', 'sphenoid_bone', 'ear_auricle'],
    associatedOrgan: 'pituitary_gland',
    associatedMeridian: 'GV',
    testingMethod: 'Gentle contact with fingertips, monitor pulse rhythm and strength',
    positiveFindings: ['irregular_pulse', 'weak_amplitude', 'temperature_difference'],
    clinicalSignificance: 'Pituitary function, hormonal regulation, master gland activity',
    relatedConditions: ['hormonal_imbalances', 'growth_disorders', 'reproductive_issues', 'thyroid_dysfunction']
  },
  {
    id: 'ridler_occipital',
    system: 'ridler',
    name: 'Occipital',
    location: 'Base of the skull, bilateral points on the occiput near the hairline',
    anatomicalLandmarks: ['occipital_bone', 'superior_nuchal_line', 'hairline'],
    associatedOrgan: 'reproductive_organs',
    associatedMeridian: 'REN',
    testingMethod: 'Light pressure with fingertips, assess pulse quality and rhythm',
    positiveFindings: ['thready_pulse', 'rapid_pulse', 'absent_pulse'],
    clinicalSignificance: 'Reproductive system health, sexual vitality, hormonal balance',
    relatedConditions: ['fertility_issues', 'menstrual_irregularities', 'sexual_dysfunction', 'prostate_problems']
  },
  {
    id: 'ridler_parietal',
    system: 'ridler',
    name: 'Parietal',
    location: 'Top of the head, bilateral points on the parietal bones',
    anatomicalLandmarks: ['parietal_bone', 'sagittal_suture', 'vertex'],
    associatedOrgan: 'kidneys',
    associatedMeridian: 'KI',
    testingMethod: 'Gentle contact, assess pulse strength and regularity',
    positiveFindings: ['weak_pulse', 'irregular_rhythm', 'cold_sensation'],
    clinicalSignificance: 'Kidney function, fluid balance, elimination processes',
    relatedConditions: ['kidney_dysfunction', 'urinary_issues', 'fluid_retention', 'blood_pressure_problems']
  },
  {
    id: 'ridler_lambda',
    system: 'ridler',
    name: 'Lambda',
    location: 'Junction of the occipital and parietal bones, posterior fontanelle area',
    anatomicalLandmarks: ['lambdoid_suture', 'occipital_bone', 'parietal_bone'],
    associatedOrgan: 'small_intestine',
    associatedMeridian: 'SI',
    testingMethod: 'Light fingertip contact, monitor pulse characteristics',
    positiveFindings: ['rapid_pulse', 'weak_amplitude', 'inconsistent_rhythm'],
    clinicalSignificance: 'Small intestine function, nutrient absorption, digestive health',
    relatedConditions: ['malabsorption', 'digestive_disorders', 'nutritional_deficiencies', 'intestinal_inflammation']
  },
  {
    id: 'ridler_maxilla',
    system: 'ridler',
    name: 'Maxilla',
    location: 'Upper jaw area, bilateral points on the maxillary bones',
    anatomicalLandmarks: ['maxilla', 'zygomatic_process', 'nasal_cavity'],
    associatedOrgan: 'stomach',
    associatedMeridian: 'ST',
    testingMethod: 'Gentle pressure on maxillary prominences, assess pulse response',
    positiveFindings: ['bounding_pulse', 'irregular_rhythm', 'heat_sensation'],
    clinicalSignificance: 'Stomach function, digestion, acid-base balance',
    relatedConditions: ['gastritis', 'acid_reflux', 'digestive_upset', 'appetite_disorders']
  },
  {
    id: 'ridler_mandible',
    system: 'ridler',
    name: 'Mandible',
    location: 'Lower jaw area, bilateral points on the mandible',
    anatomicalLandmarks: ['mandible', 'jaw_angle', 'masseter_muscle'],
    associatedOrgan: 'pancreas',
    associatedMeridian: 'SP',
    testingMethod: 'Light contact on mandibular angles, monitor pulse quality',
    positiveFindings: ['weak_pulse', 'delayed_response', 'temperature_variation'],
    clinicalSignificance: 'Pancreatic function, blood sugar regulation, enzyme production',
    relatedConditions: ['diabetes', 'hypoglycemia', 'digestive_enzyme_deficiency', 'blood_sugar_instability']
  },
  {
    id: 'ridler_nasal',
    system: 'ridler',
    name: 'Nasal',
    location: 'Sides of the nose, bilateral points on the nasal bones',
    anatomicalLandmarks: ['nasal_bone', 'maxilla', 'nasion'],
    associatedOrgan: 'heart',
    associatedMeridian: 'HT',
    testingMethod: 'Gentle fingertip contact, assess pulse strength and rhythm',
    positiveFindings: ['irregular_pulse', 'weak_amplitude', 'racing_pulse'],
    clinicalSignificance: 'Cardiovascular health, heart rhythm, circulation',
    relatedConditions: ['heart_palpitations', 'arrhythmias', 'circulation_problems', 'cardiovascular_stress']
  },
  {
    id: 'ridler_positive_negative',
    system: 'ridler',
    name: 'Positive/Negative (Emotional)',
    location: 'Bilateral temporal areas, above the ears',
    anatomicalLandmarks: ['temporal_bone', 'ear_auricle', 'temporal_muscle'],
    associatedOrgan: 'emotional_centers',
    associatedMeridian: 'PC',
    testingMethod: 'Light contact while assessing emotional state and pulse response',
    positiveFindings: ['erratic_pulse', 'emotional_reactivity', 'pulse_changes_with_emotion'],
    clinicalSignificance: 'Emotional balance, stress response, mental-emotional integration',
    relatedConditions: ['emotional_instability', 'stress_disorders', 'anxiety', 'depression']
  },
  {
    id: 'ridler_central',
    system: 'ridler',
    name: 'Central (Integration)',
    location: 'Center of the forehead, between the eyebrows',
    anatomicalLandmarks: ['frontal_bone', 'glabella', 'third_eye_area'],
    associatedOrgan: 'nervous_system',
    associatedMeridian: 'GV',
    testingMethod: 'Single point contact, assess overall pulse integration and nervous system response',
    positiveFindings: ['chaotic_pulse', 'nervous_system_reactivity', 'integration_difficulties'],
    clinicalSignificance: 'Nervous system integration, overall systemic balance, stress adaptation',
    relatedConditions: ['nervous_system_disorders', 'integration_problems', 'systemic_stress', 'adaptation_difficulties']
  }
];

// Helper functions for Ridler Points
export const getRidlerPointsByOrgan = (organ: string): DiagnosticPoint[] => {
  return ridlerPoints.filter(point => point.associatedOrgan === organ);
};

export const getRidlerPointsByMeridian = (meridian: string): DiagnosticPoint[] => {
  return ridlerPoints.filter(point => point.associatedMeridian === meridian);
};

export const getRidlerPointsForCondition = (condition: string): DiagnosticPoint[] => {
  return ridlerPoints.filter(point => 
    point.relatedConditions.includes(condition) ||
    point.relatedConditions.some(cond => cond.includes(condition))
  );
};
