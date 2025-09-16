// Monitoring and Outcomes Database
// Track treatment progress and clinical outcomes

export interface OutcomeMetric {
  id: string;
  name: string;
  category: 'pain' | 'function' | 'quality_of_life' | 'objective' | 'subjective';
  description: string;
  scale: 'numeric_10' | 'numeric_100' | 'yes_no' | 'likert_5' | 'percentage';
  unit?: string;
  normalRange?: string;
  clinicalSignificance: string;
}

export interface ProgressIndicator {
  id: string;
  name: string;
  type: 'improvement' | 'maintenance' | 'decline' | 'stable';
  description: string;
  measurementMethod: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'per_session';
  targetValue?: number;
  minimumChange: number; // Minimum change considered clinically significant
}

export const outcomeMetrics: OutcomeMetric[] = [
  // Pain Metrics
  {
    id: 'pain_intensity',
    name: 'Pain Intensity Scale',
    category: 'pain',
    description: 'Subjective pain rating from patient',
    scale: 'numeric_10',
    unit: '/10',
    normalRange: '0-2',
    clinicalSignificance: 'Primary outcome measure for pain-related conditions'
  },
  {
    id: 'pain_frequency',
    name: 'Pain Frequency',
    category: 'pain',
    description: 'How often pain occurs',
    scale: 'percentage',
    unit: '% of time',
    normalRange: '0-10%',
    clinicalSignificance: 'Indicates treatment effectiveness and quality of life impact'
  },
  {
    id: 'pain_interference',
    name: 'Pain Interference with Activities',
    category: 'pain',
    description: 'How much pain interferes with daily activities',
    scale: 'numeric_10',
    unit: '/10',
    normalRange: '0-2',
    clinicalSignificance: 'Functional outcome measure for pain management'
  },

  // Functional Metrics
  {
    id: 'sleep_quality',
    name: 'Sleep Quality Index',
    category: 'function',
    description: 'Overall sleep quality and restfulness',
    scale: 'numeric_10',
    unit: '/10',
    normalRange: '7-10',
    clinicalSignificance: 'Key indicator for stress, pain, and overall health recovery'
  },
  {
    id: 'energy_level',
    name: 'Daily Energy Level',
    category: 'function',
    description: 'Patient-reported energy and vitality',
    scale: 'numeric_10',
    unit: '/10',
    normalRange: '7-9',
    clinicalSignificance: 'Indicates constitutional strength and treatment response'
  },
  {
    id: 'stress_level',
    name: 'Perceived Stress Level',
    category: 'subjective',
    description: 'Patient-reported stress and anxiety levels',
    scale: 'numeric_10',
    unit: '/10',
    normalRange: '0-3',
    clinicalSignificance: 'Important for stress-related conditions and treatment planning'
  },
  {
    id: 'functional_capacity',
    name: 'Functional Capacity',
    category: 'function',
    description: 'Ability to perform daily activities',
    scale: 'percentage',
    unit: '% of normal',
    normalRange: '90-100%',
    clinicalSignificance: 'Overall treatment effectiveness and quality of life measure'
  },

  // Quality of Life Metrics
  {
    id: 'mood_rating',
    name: 'Mood Rating',
    category: 'quality_of_life',
    description: 'Overall emotional well-being',
    scale: 'numeric_10',
    unit: '/10',
    normalRange: '7-9',
    clinicalSignificance: 'Indicates emotional health and treatment response'
  },
  {
    id: 'treatment_satisfaction',
    name: 'Treatment Satisfaction',
    category: 'subjective',
    description: 'Patient satisfaction with treatment approach',
    scale: 'likert_5',
    unit: 'scale',
    normalRange: '4-5',
    clinicalSignificance: 'Important for treatment compliance and continuation'
  },

  // Objective Metrics
  {
    id: 'range_of_motion',
    name: 'Range of Motion',
    category: 'objective',
    description: 'Measured joint mobility and flexibility',
    scale: 'numeric_100',
    unit: '% of normal',
    normalRange: '90-100%',
    clinicalSignificance: 'Objective measure of musculoskeletal improvement'
  },
  {
    id: 'muscle_tension',
    name: 'Muscle Tension Assessment',
    category: 'objective',
    description: 'Palpable muscle tension and trigger point activity',
    scale: 'numeric_10',
    unit: '/10',
    normalRange: '0-2',
    clinicalSignificance: 'Objective measure of soft tissue treatment response'
  }
];

export const progressIndicators: ProgressIndicator[] = [
  {
    id: 'pain_reduction',
    name: 'Pain Level Reduction',
    type: 'improvement',
    description: 'Decrease in reported pain intensity',
    measurementMethod: 'Numeric pain scale comparison',
    frequency: 'per_session',
    targetValue: 3, // Target pain level of 3/10 or below
    minimumChange: 2 // At least 2-point reduction considered significant
  },
  {
    id: 'sleep_improvement',
    name: 'Sleep Quality Improvement',
    type: 'improvement',
    description: 'Better sleep quality and duration',
    measurementMethod: 'Sleep quality index and duration tracking',
    frequency: 'weekly',
    targetValue: 8, // Target sleep quality of 8/10
    minimumChange: 1 // At least 1-point improvement significant
  },
  {
    id: 'stress_reduction',
    name: 'Stress Level Reduction',
    type: 'improvement',
    description: 'Decreased perceived stress and anxiety',
    measurementMethod: 'Stress scale assessment',
    frequency: 'weekly',
    targetValue: 3, // Target stress level of 3/10 or below
    minimumChange: 2 // At least 2-point reduction significant
  },
  {
    id: 'functional_restoration',
    name: 'Functional Capacity Restoration',
    type: 'improvement',
    description: 'Return to normal daily activities',
    measurementMethod: 'Functional capacity percentage',
    frequency: 'biweekly',
    targetValue: 90, // Target 90% functional capacity
    minimumChange: 10 // At least 10% improvement significant
  },
  {
    id: 'symptom_stability',
    name: 'Symptom Stabilization',
    type: 'maintenance',
    description: 'Maintaining improvement without regression',
    measurementMethod: 'Symptom tracking over time',
    frequency: 'monthly',
    minimumChange: 5 // Less than 5% variation considered stable
  }
];

// Helper functions for monitoring
export const getMetricsByCategory = (category: OutcomeMetric['category']): OutcomeMetric[] => {
  return outcomeMetrics.filter(metric => metric.category === category);
};

export const getIndicatorsByType = (type: ProgressIndicator['type']): ProgressIndicator[] => {
  return progressIndicators.filter(indicator => indicator.type === type);
};

export const calculateProgress = (
  baseline: number,
  current: number,
  target: number
): { percentage: number; status: 'excellent' | 'good' | 'fair' | 'poor' } => {
  const improvement = current - baseline;
  const targetImprovement = target - baseline;
  const percentage = Math.min(100, (improvement / targetImprovement) * 100);
  
  let status: 'excellent' | 'good' | 'fair' | 'poor';
  if (percentage >= 80) status = 'excellent';
  else if (percentage >= 60) status = 'good';
  else if (percentage >= 40) status = 'fair';
  else status = 'poor';
  
  return { percentage: Math.max(0, percentage), status };
};
