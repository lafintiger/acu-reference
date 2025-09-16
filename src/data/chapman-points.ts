// Chapman Points - Neurolymphatic Reflex Points
// Osteopathic diagnostic points for lymphatic and organ function assessment

import { DiagnosticPoint } from '../types/clinical-workflow';

export const chapmanPoints: DiagnosticPoint[] = [
  // Anterior Chapman Points
  {
    id: 'chapman_heart_anterior',
    system: 'chapman',
    name: 'Heart (Anterior)',
    location: '2nd intercostal space, near sternum, right side',
    anatomicalLandmarks: ['2nd_rib', 'sternum', 'right_parasternal'],
    associatedOrgan: 'heart',
    associatedMeridian: 'HT', // Heart meridian
    testingMethod: 'Light palpation for tender, pea-sized nodule',
    positiveFindings: ['tenderness', 'nodular_texture', 'tissue_congestion'],
    clinicalSignificance: 'Indicates lymphatic congestion affecting cardiac function',
    relatedConditions: ['heart_palpitations', 'chest_tightness', 'anxiety', 'circulatory_issues']
  },
  {
    id: 'chapman_lung_anterior',
    system: 'chapman',
    name: 'Lung (Anterior)',
    location: '3rd and 4th intercostal spaces, lateral to sternum',
    anatomicalLandmarks: ['3rd_rib', '4th_rib', 'lateral_sternum'],
    associatedOrgan: 'lungs',
    associatedMeridian: 'LU', // Lung meridian
    testingMethod: 'Gentle palpation for tissue texture changes',
    positiveFindings: ['tenderness', 'tissue_thickening', 'nodular_areas'],
    clinicalSignificance: 'Indicates lymphatic drainage issues affecting respiratory function',
    relatedConditions: ['asthma', 'bronchitis', 'shortness_of_breath', 'chest_congestion']
  },
  {
    id: 'chapman_liver_anterior',
    system: 'chapman',
    name: 'Liver (Anterior)',
    location: '6th intercostal space, right side, midclavicular line',
    anatomicalLandmarks: ['6th_rib', 'right_midclavicular_line'],
    associatedOrgan: 'liver',
    associatedMeridian: 'LV', // Liver meridian
    testingMethod: 'Firm palpation for tender nodules',
    positiveFindings: ['sharp_tenderness', 'nodular_texture', 'tissue_congestion'],
    clinicalSignificance: 'Indicates hepatic lymphatic congestion and liver dysfunction',
    relatedConditions: ['digestive_issues', 'fatigue', 'irritability', 'hormonal_imbalances']
  },
  {
    id: 'chapman_stomach_anterior',
    system: 'chapman',
    name: 'Stomach (Anterior)',
    location: '6th intercostal space, left side, midclavicular line',
    anatomicalLandmarks: ['6th_rib', 'left_midclavicular_line'],
    associatedOrgan: 'stomach',
    associatedMeridian: 'ST', // Stomach meridian
    testingMethod: 'Gentle to moderate palpation',
    positiveFindings: ['tenderness', 'tissue_changes', 'referred_discomfort'],
    clinicalSignificance: 'Indicates gastric lymphatic congestion and digestive dysfunction',
    relatedConditions: ['indigestion', 'nausea', 'stomach_pain', 'appetite_issues']
  },
  {
    id: 'chapman_kidney_anterior',
    name: 'Kidney (Anterior)',
    system: 'chapman',
    location: '1 inch superior and 1 inch lateral to umbilicus',
    anatomicalLandmarks: ['umbilicus', 'anterior_superior_iliac_spine'],
    associatedOrgan: 'kidneys',
    associatedMeridian: 'KI', // Kidney meridian
    testingMethod: 'Deep palpation for tender areas',
    positiveFindings: ['deep_tenderness', 'tissue_congestion', 'referred_pain'],
    clinicalSignificance: 'Indicates renal lymphatic congestion and kidney dysfunction',
    relatedConditions: ['urinary_issues', 'lower_back_pain', 'fatigue', 'fluid_retention']
  },

  // Posterior Chapman Points
  {
    id: 'chapman_heart_posterior',
    system: 'chapman',
    name: 'Heart (Posterior)',
    location: 'T2 transverse process, right side',
    anatomicalLandmarks: ['T2_vertebra', 'transverse_process'],
    associatedOrgan: 'heart',
    associatedMeridian: 'HT',
    testingMethod: 'Firm pressure on transverse process',
    positiveFindings: ['tenderness', 'tissue_tension', 'referred_sensation'],
    clinicalSignificance: 'Posterior reflex for cardiac lymphatic drainage',
    relatedConditions: ['heart_palpitations', 'chest_pain', 'anxiety', 'upper_back_tension']
  },
  {
    id: 'chapman_lung_posterior',
    system: 'chapman',
    name: 'Lung (Posterior)',
    location: 'T3 and T4 transverse processes',
    anatomicalLandmarks: ['T3_vertebra', 'T4_vertebra', 'transverse_processes'],
    associatedOrgan: 'lungs',
    associatedMeridian: 'LU',
    testingMethod: 'Bilateral palpation of transverse processes',
    positiveFindings: ['tenderness', 'asymmetry', 'tissue_changes'],
    clinicalSignificance: 'Posterior reflex for pulmonary lymphatic drainage',
    relatedConditions: ['respiratory_issues', 'upper_back_tension', 'shoulder_problems']
  },
  {
    id: 'chapman_liver_posterior',
    system: 'chapman',
    name: 'Liver (Posterior)',
    location: 'T6 transverse process, right side',
    anatomicalLandmarks: ['T6_vertebra', 'right_transverse_process'],
    associatedOrgan: 'liver',
    associatedMeridian: 'LV',
    testingMethod: 'Deep pressure on transverse process',
    positiveFindings: ['sharp_tenderness', 'muscle_guarding', 'referred_pain'],
    clinicalSignificance: 'Posterior reflex for hepatic lymphatic function',
    relatedConditions: ['digestive_disorders', 'right_shoulder_pain', 'fatigue']
  },
  {
    id: 'chapman_kidney_posterior',
    system: 'chapman',
    name: 'Kidney (Posterior)',
    location: 'T12-L1 transverse processes',
    anatomicalLandmarks: ['T12_vertebra', 'L1_vertebra', 'transverse_processes'],
    associatedOrgan: 'kidneys',
    associatedMeridian: 'KI',
    testingMethod: 'Bilateral pressure on transverse processes',
    positiveFindings: ['tenderness', 'muscle_tension', 'asymmetry'],
    clinicalSignificance: 'Posterior reflex for renal lymphatic drainage',
    relatedConditions: ['lower_back_pain', 'urinary_dysfunction', 'fatigue', 'fluid_retention']
  },
  {
    id: 'chapman_adrenal_anterior',
    system: 'chapman',
    name: 'Adrenal (Anterior)',
    location: '2 inches superior and 1 inch lateral to umbilicus',
    anatomicalLandmarks: ['umbilicus', 'anterior_abdominal_wall'],
    associatedOrgan: 'adrenal_glands',
    testingMethod: 'Deep palpation for tender nodules',
    positiveFindings: ['deep_tenderness', 'nodular_texture', 'guarding'],
    clinicalSignificance: 'Indicates adrenal stress and lymphatic congestion',
    relatedConditions: ['chronic_fatigue', 'stress', 'hormonal_imbalances', 'immune_dysfunction']
  },
  {
    id: 'chapman_thyroid_anterior',
    system: 'chapman',
    name: 'Thyroid (Anterior)',
    location: '2nd intercostal space, between ribs and sternum',
    anatomicalLandmarks: ['2nd_rib', 'sternum', 'intercostal_space'],
    associatedOrgan: 'thyroid',
    testingMethod: 'Light palpation for tissue changes',
    positiveFindings: ['tenderness', 'tissue_thickening', 'temperature_changes'],
    clinicalSignificance: 'Indicates thyroid dysfunction and metabolic issues',
    relatedConditions: ['fatigue', 'weight_changes', 'temperature_sensitivity', 'mood_changes']
  }
];

// Helper functions for Chapman point assessment
export const getChapmanPointsByOrgan = (organ: string): DiagnosticPoint[] => {
  return chapmanPoints.filter(point => point.associatedOrgan === organ);
};

export const getChapmanPointsByMeridian = (meridian: string): DiagnosticPoint[] => {
  return chapmanPoints.filter(point => point.associatedMeridian === meridian);
};

export const getChapmanPointsForCondition = (condition: string): DiagnosticPoint[] => {
  return chapmanPoints.filter(point => 
    point.relatedConditions.some(relatedCondition => 
      relatedCondition.toLowerCase().includes(condition.toLowerCase()) ||
      condition.toLowerCase().includes(relatedCondition.toLowerCase())
    )
  );
};
