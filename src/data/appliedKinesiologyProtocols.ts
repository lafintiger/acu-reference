// Comprehensive Applied Kinesiology assessment and treatment protocols
export interface AppliedKinesiologyProtocol {
  indicationId: string;
  protocolName: string;
  primaryAssessments: {
    muscleName: string;
    anatomicalLocation: string;
    testingPosition: string;
    testingProcedure: string;
    normalResponse: string;
    weaknessIndicates: string;
    associatedMeridian?: string;
    associatedOrgan?: string;
    notes?: string;
  }[];
  corrections: {
    correctionType: 'neurolymphatic' | 'neurovascular' | 'meridian_tracing' | 'emotional_stress_release' | 'structural';
    targetArea: string;
    procedure: string;
    duration: string;
    expectedOutcome: string;
    retestProcedure: string;
    notes?: string;
  }[];
  treatmentSequence: string[];
  totalDuration: string;
  frequency: string;
  contraindications?: string[];
  modifications?: {
    condition: string;
    modification: string;
  }[];
  integrationExercises?: {
    exerciseName: string;
    description: string;
    duration: string;
  }[];
  clinicalNotes: string;
  followUpGuidance: string;
}

export const appliedKinesiologyProtocols: AppliedKinesiologyProtocol[] = [
  {
    indicationId: 'back_pain',
    protocolName: 'Structural Balance & Core Stability AK Protocol',
    primaryAssessments: [
      {
        muscleName: 'Psoas Major',
        anatomicalLocation: 'Hip flexor, deep abdominal muscle',
        testingPosition: 'Supine, hip and knee flexed to 90 degrees',
        testingProcedure: 'Resist hip flexion while patient maintains position',
        normalResponse: 'Strong, steady resistance without pain',
        weaknessIndicates: 'Kidney meridian imbalance, structural instability, emotional stress',
        associatedMeridian: 'Kidney',
        associatedOrgan: 'Kidneys',
        notes: 'Key muscle for core stability and lower back support. Often weak in chronic back pain.'
      },
      {
        muscleName: 'Gluteus Medius',
        anatomicalLocation: 'Lateral hip stabilizer',
        testingPosition: 'Side-lying, top leg slightly abducted',
        testingProcedure: 'Resist hip abduction while maintaining neutral spine',
        normalResponse: 'Strong, stable resistance without hip hiking',
        weaknessIndicates: 'Gall Bladder meridian imbalance, lateral chain dysfunction',
        associatedMeridian: 'Gall Bladder',
        associatedOrgan: 'Gall Bladder',
        notes: 'Critical for pelvic stability and preventing lower back compensation.'
      },
      {
        muscleName: 'Latissimus Dorsi',
        anatomicalLocation: 'Broad back muscle from spine to arm',
        testingPosition: 'Prone, arm extended overhead',
        testingProcedure: 'Resist arm adduction toward body',
        normalResponse: 'Strong, coordinated pull without substitution',
        weaknessIndicates: 'Spleen meridian imbalance, sugar metabolism issues',
        associatedMeridian: 'Spleen',
        associatedOrgan: 'Spleen/Pancreas',
        notes: 'Connects upper and lower body. Important for spinal stability.'
      },
      {
        muscleName: 'Erector Spinae',
        anatomicalLocation: 'Deep spinal muscles along entire spine',
        testingPosition: 'Prone, arms at sides',
        testingProcedure: 'Resist spinal extension while maintaining neutral',
        normalResponse: 'Strong, coordinated extension without strain',
        weaknessIndicates: 'Bladder meridian imbalance, kidney weakness, structural stress',
        associatedMeridian: 'Bladder',
        associatedOrgan: 'Bladder',
        notes: 'Primary spinal stabilizers. Weakness indicates deep structural issues.'
      }
    ],
    corrections: [
      {
        correctionType: 'neurolymphatic',
        targetArea: 'Kidney neurolymphatic reflexes (upper chest and back)',
        procedure: 'Firm circular massage on reflexes for 20-30 seconds each',
        duration: '2-3 minutes total',
        expectedOutcome: 'Psoas muscle strengthens, core stability improves',
        retestProcedure: 'Retest psoas and erector spinae strength',
        notes: 'Kidney reflexes support core stability and structural integrity.'
      },
      {
        correctionType: 'neurovascular',
        targetArea: 'Frontal eminences and temporal areas',
        procedure: 'Light contact on neurovascular points until pulse synchronizes',
        duration: '1-3 minutes per point',
        expectedOutcome: 'Improved muscle coordination and stability',
        retestProcedure: 'Retest all weak muscles for improved function',
        notes: 'Enhances circulation and neurological integration.'
      },
      {
        correctionType: 'meridian_tracing',
        targetArea: 'Kidney and Bladder meridian pathways',
        procedure: 'Trace meridian from start to end with intention',
        duration: '30-60 seconds per meridian',
        expectedOutcome: 'Strengthened associated muscles and energy flow',
        retestProcedure: 'Retest kidney and bladder associated muscles',
        notes: 'Reinforces energetic support for structural muscles.'
      },
      {
        correctionType: 'structural',
        targetArea: 'Sacroiliac joint and pelvic alignment',
        procedure: 'Gentle mobilization and alignment correction',
        duration: '2-5 minutes',
        expectedOutcome: 'Improved pelvic stability and muscle function',
        retestProcedure: 'Retest core muscles and check pelvic alignment',
        notes: 'Address structural foundation for muscle function.'
      }
    ],
    treatmentSequence: [
      '1. Initial postural and structural assessment',
      '2. Test primary core stability muscles (psoas, glutes, lats)',
      '3. Identify patterns of weakness and compensation',
      '4. Apply neurolymphatic corrections for weak muscles',
      '5. Perform neurovascular corrections for integration',
      '6. Trace relevant meridians to strengthen energy flow',
      '7. Address structural imbalances if present',
      '8. Retest all muscles to confirm corrections',
      '9. Provide integration exercises and home care'
    ],
    totalDuration: '30-45 minutes',
    frequency: '1-2 times per week initially, then monthly for maintenance',
    contraindications: [
      'Acute spinal injury or fracture',
      'Severe disc herniation with neurological symptoms',
      'Recent spinal surgery',
      'Severe osteoporosis',
      'Patient unable to cooperate with testing',
      'Acute inflammatory conditions'
    ],
    modifications: [
      {
        condition: 'Acute back pain',
        modification: 'Very gentle testing, focus on pain-free ranges, prioritize neurovascular corrections'
      },
      {
        condition: 'Chronic back pain',
        modification: 'Comprehensive assessment, include emotional stress patterns, longer correction phases'
      },
      {
        condition: 'Elderly patients',
        modification: 'Gentler testing pressure, longer rest periods, focus on functional movements'
      },
      {
        condition: 'Athletes',
        modification: 'Include sport-specific testing, performance optimization, injury prevention focus'
      }
    ],
    integrationExercises: [
      {
        exerciseName: 'Cross Crawl',
        description: 'Opposite arm and leg movements to integrate brain hemispheres',
        duration: '2-3 minutes'
      },
      {
        exerciseName: 'Core Breathing',
        description: 'Diaphragmatic breathing with pelvic floor engagement',
        duration: '5 minutes daily'
      },
      {
        exerciseName: 'Gait Integration',
        description: 'Walking with attention to proper muscle firing patterns',
        duration: '10 minutes daily'
      }
    ],
    clinicalNotes: 'Applied Kinesiology for back pain focuses on identifying and correcting the underlying muscle imbalances and energetic disruptions that contribute to structural problems. The approach addresses both biomechanical and energetic aspects of back pain, often revealing hidden patterns not apparent through conventional assessment.',
    followUpGuidance: 'Monitor muscle strength improvements and functional movement patterns. Recommend specific exercises to maintain corrections. Address lifestyle factors affecting posture and movement. Follow up in 1-2 weeks to assess holding patterns.'
  },

  {
    indicationId: 'digestive_disorders',
    protocolName: 'Digestive Function & Organ Support AK Protocol',
    primaryAssessments: [
      {
        muscleName: 'Latissimus Dorsi',
        anatomicalLocation: 'Broad back muscle from spine to arm',
        testingPosition: 'Prone, arm extended overhead',
        testingProcedure: 'Resist arm adduction toward body',
        normalResponse: 'Strong, steady resistance',
        weaknessIndicates: 'Spleen/pancreas dysfunction, blood sugar imbalances',
        associatedMeridian: 'Spleen',
        associatedOrgan: 'Spleen/Pancreas',
        notes: 'Primary muscle for spleen meridian. Often weak with digestive and sugar issues.'
      },
      {
        muscleName: 'Pectoralis Major Clavicular',
        anatomicalLocation: 'Upper chest, clavicular portion',
        testingPosition: 'Supine, arm flexed to 90 degrees',
        testingProcedure: 'Resist arm flexion and slight adduction',
        normalResponse: 'Strong resistance without shoulder elevation',
        weaknessIndicates: 'Stomach meridian imbalance, digestive acid issues',
        associatedMeridian: 'Stomach',
        associatedOrgan: 'Stomach',
        notes: 'Reflects stomach function and digestive fire strength.'
      },
      {
        muscleName: 'Tensor Fascia Lata',
        anatomicalLocation: 'Lateral hip and thigh',
        testingPosition: 'Side-lying, slight hip flexion and abduction',
        testingProcedure: 'Resist hip flexion with slight abduction',
        normalResponse: 'Firm, stable resistance',
        weaknessIndicates: 'Large Intestine meridian issues, elimination problems',
        associatedMeridian: 'Large Intestine',
        associatedOrgan: 'Large Intestine',
        notes: 'Related to elimination function and large intestine health.'
      }
    ],
    corrections: [
      {
        correctionType: 'neurolymphatic',
        targetArea: 'Spleen, stomach, and large intestine reflexes',
        procedure: 'Massage specific reflexes: spleen (left rib cage), stomach (left upper chest), LI (lateral thigh)',
        duration: '30-60 seconds per reflex',
        expectedOutcome: 'Strengthened digestive muscles and improved organ function',
        retestProcedure: 'Retest latissimus dorsi, pectoralis major, and TFL',
        notes: 'Neurolymphatic reflexes directly support organ function and associated muscles.'
      },
      {
        correctionType: 'meridian_tracing',
        targetArea: 'Stomach, Spleen, and Large Intestine meridians',
        procedure: 'Trace complete meridian pathways with healing intention',
        duration: '1-2 minutes per meridian',
        expectedOutcome: 'Enhanced energy flow and digestive function',
        retestProcedure: 'Retest associated muscles for strength improvement',
        notes: 'Meridian tracing supports energetic digestive function.'
      },
      {
        correctionType: 'emotional_stress_release',
        targetArea: 'Frontal eminences for digestive stress',
        procedure: 'Light contact while patient thinks about digestive concerns',
        duration: '2-5 minutes',
        expectedOutcome: 'Reduced emotional stress affecting digestion',
        retestProcedure: 'Retest muscles while thinking about stressful eating situations',
        notes: 'Emotional stress significantly affects digestive function.'
      }
    ],
    treatmentSequence: [
      '1. Initial digestive history and symptom assessment',
      '2. Test primary digestive muscles (lats, pec major, TFL)',
      '3. Identify patterns of digestive muscle weakness',
      '4. Apply neurolymphatic corrections for weak muscles',
      '5. Perform meridian tracing for digestive organs',
      '6. Address emotional stress patterns affecting digestion',
      '7. Retest all muscles to confirm corrections',
      '8. Provide dietary and lifestyle recommendations',
      '9. Teach self-care techniques and exercises'
    ],
    totalDuration: '35-50 minutes',
    frequency: 'Weekly for 4-6 sessions, then monthly for maintenance',
    contraindications: [
      'Acute abdominal emergency requiring medical attention',
      'Recent abdominal surgery',
      'Severe inflammatory bowel disease during flare',
      'Patient unable to cooperate with muscle testing',
      'Severe eating disorders without psychological support'
    ],
    modifications: [
      {
        condition: 'Acute digestive upset',
        modification: 'Focus on calming techniques, avoid deep muscle testing, emphasize neurovascular corrections'
      },
      {
        condition: 'Chronic digestive weakness',
        modification: 'Include nutritional assessment, longer correction phases, lifestyle counseling'
      },
      {
        condition: 'Stress-related digestive issues',
        modification: 'Emphasize emotional stress release, include stress management techniques'
      },
      {
        condition: 'Food sensitivities',
        modification: 'Include food sensitivity testing using muscle response, elimination diet guidance'
      }
    ],
    integrationExercises: [
      {
        exerciseName: 'Digestive Breathing',
        description: 'Deep diaphragmatic breathing to support digestive function',
        duration: '5 minutes before meals'
      },
      {
        exerciseName: 'Core Strengthening',
        description: 'Gentle core exercises to support digestive organs',
        duration: '10 minutes daily'
      },
      {
        exerciseName: 'Meridian Stretches',
        description: 'Specific stretches for stomach, spleen, and large intestine meridians',
        duration: '5-10 minutes daily'
      }
    ],
    clinicalNotes: 'Applied Kinesiology for digestive disorders reveals the neurological and energetic imbalances affecting digestive function. The muscle-organ-meridian relationships provide insight into both structural and energetic aspects of digestive health. Food sensitivities and emotional stress patterns often emerge through muscle testing.',
    followUpGuidance: 'Monitor digestive symptoms and muscle strength improvements. Recommend dietary modifications based on testing results. Address stress factors and eating habits. Follow up weekly initially, then monthly for maintenance.'
  },

  {
    indicationId: 'anxiety',
    protocolName: 'Emotional Balance & Nervous System AK Protocol',
    primaryAssessments: [
      {
        muscleName: 'Subscapularis',
        anatomicalLocation: 'Deep shoulder muscle, under shoulder blade',
        testingPosition: 'Arm behind back, elbow bent',
        testingProcedure: 'Resist internal rotation of arm',
        normalResponse: 'Strong, steady resistance',
        weaknessIndicates: 'Heart meridian imbalance, emotional stress, circulation issues',
        associatedMeridian: 'Heart',
        associatedOrgan: 'Heart',
        notes: 'Primary heart muscle. Often weak with anxiety and emotional stress.'
      },
      {
        muscleName: 'Anterior Deltoid',
        anatomicalLocation: 'Front of shoulder',
        testingPosition: 'Standing, arm forward flexed to 90 degrees',
        testingProcedure: 'Resist forward arm flexion',
        normalResponse: 'Strong resistance without shoulder elevation',
        weaknessIndicates: 'Lung meridian imbalance, grief, breathing issues',
        associatedMeridian: 'Lung',
        associatedOrgan: 'Lungs',
        notes: 'Lung meridian muscle. Weakness often indicates unresolved grief or breathing restrictions.'
      },
      {
        muscleName: 'Pectoralis Major Sternal',
        anatomicalLocation: 'Lower chest muscle',
        testingPosition: 'Supine, arm diagonally across chest',
        testingProcedure: 'Resist diagonal arm adduction',
        normalResponse: 'Strong, coordinated resistance',
        weaknessIndicates: 'Liver meridian imbalance, anger, frustration',
        associatedMeridian: 'Liver',
        associatedOrgan: 'Liver',
        notes: 'Liver meridian muscle. Often weak with suppressed anger and frustration.'
      }
    ],
    corrections: [
      {
        correctionType: 'emotional_stress_release',
        targetArea: 'Frontal eminences (forehead)',
        procedure: 'Light contact on frontal points while patient recalls stressful situation',
        duration: '3-8 minutes until emotional charge reduces',
        expectedOutcome: 'Reduced emotional stress response, muscle strengthening',
        retestProcedure: 'Retest muscles while thinking about previous stressor',
        notes: 'Most important technique for anxiety. Balances emotional stress patterns.'
      },
      {
        correctionType: 'neurovascular',
        targetArea: 'Heart, lung, and liver neurovascular points',
        procedure: 'Light contact on specific head points to enhance circulation',
        duration: '1-2 minutes per point set',
        expectedOutcome: 'Improved circulation and organ function',
        retestProcedure: 'Retest associated muscles for strength improvement',
        notes: 'Supports circulation to organs and reduces sympathetic nervous system activation.'
      },
      {
        correctionType: 'meridian_tracing',
        targetArea: 'Heart, Lung, and Liver meridian pathways',
        procedure: 'Trace meridians in correct direction with calming intention',
        duration: '1 minute per meridian',
        expectedOutcome: 'Balanced energy flow and emotional stability',
        retestProcedure: 'Retest emotional muscle responses',
        notes: 'Balances energetic aspects of emotional regulation.'
      }
    ],
    treatmentSequence: [
      '1. Create calm, safe environment for emotional work',
      '2. Test emotional indicator muscles (subscapularis, deltoids, pectorals)',
      '3. Identify emotional stress patterns through muscle responses',
      '4. Perform Emotional Stress Release on primary stressors',
      '5. Apply neurovascular corrections for nervous system balance',
      '6. Trace heart, lung, and liver meridians for emotional support',
      '7. Retest muscles to confirm emotional clearing',
      '8. Provide stress management tools and coping strategies',
      '9. Schedule follow-up for emotional integration'
    ],
    totalDuration: '40-60 minutes',
    frequency: 'Weekly for 6-8 sessions, then as needed for stress management',
    contraindications: [
      'Severe depression with suicidal ideation',
      'Active psychosis or severe mental illness',
      'Recent severe trauma without psychological support',
      'Patient unwilling to address emotional factors',
      'Severe PTSD without appropriate therapeutic support'
    ],
    modifications: [
      {
        condition: 'Panic disorder',
        modification: 'Very gentle approach, ensure patient feels in control, shorter sessions initially'
      },
      {
        condition: 'Chronic anxiety',
        modification: 'Include lifestyle assessment, longer ESR sessions, regular maintenance'
      },
      {
        condition: 'Work-related stress',
        modification: 'Include ergonomic assessment, stress management techniques, boundary setting'
      },
      {
        condition: 'Relationship stress',
        modification: 'Focus on communication patterns, boundary issues, self-care strategies'
      }
    ],
    integrationExercises: [
      {
        exerciseName: 'Heart Coherence Breathing',
        description: 'Rhythmic breathing to balance heart rate variability',
        duration: '5 minutes twice daily'
      },
      {
        exerciseName: 'Emotional Freedom Technique (EFT)',
        description: 'Tapping sequence for emotional regulation',
        duration: '10 minutes as needed'
      },
      {
        exerciseName: 'Grounding Exercises',
        description: 'Physical and energetic grounding techniques',
        duration: '5-10 minutes daily'
      }
    ],
    clinicalNotes: 'Applied Kinesiology for anxiety reveals the muscle-emotion connections and provides direct access to the nervous system through muscle testing. Emotional Stress Release is particularly powerful for anxiety as it directly addresses the stress patterns held in the nervous system. The approach is gentle yet profound.',
    followUpGuidance: 'Monitor anxiety levels and emotional regulation improvements. Practice recommended stress management techniques daily. Address lifestyle and relationship factors contributing to anxiety. Follow up weekly during active treatment phase.'
  },

  {
    indicationId: 'headache',
    protocolName: 'Cervical Function & Cranial Balance AK Protocol',
    primaryAssessments: [
      {
        muscleName: 'Upper Trapezius',
        anatomicalLocation: 'Neck and shoulder muscle',
        testingPosition: 'Seated, head in neutral position',
        testingProcedure: 'Resist shoulder elevation and neck side-bending',
        normalResponse: 'Strong, balanced resistance bilaterally',
        weaknessIndicates: 'Gall Bladder meridian imbalance, lateral neck dysfunction',
        associatedMeridian: 'Gall Bladder',
        associatedOrgan: 'Gall Bladder',
        notes: 'Often tight but weak with chronic headaches. Indicates GB meridian stress.'
      },
      {
        muscleName: 'Sternocleidomastoid',
        anatomicalLocation: 'Anterior and lateral neck',
        testingPosition: 'Supine, head slightly flexed and rotated',
        testingProcedure: 'Resist neck flexion and rotation',
        normalResponse: 'Coordinated resistance without strain',
        weaknessIndicates: 'Kidney meridian imbalance, structural neck problems',
        associatedMeridian: 'Kidney',
        associatedOrgan: 'Kidneys',
        notes: 'Important for head positioning and cervical stability.'
      },
      {
        muscleName: 'Suboccipital Muscles',
        anatomicalLocation: 'Base of skull, deep neck muscles',
        testingPosition: 'Prone, head in neutral',
        testingProcedure: 'Gentle resistance to head extension',
        normalResponse: 'Smooth, controlled resistance',
        weaknessIndicates: 'Bladder meridian imbalance, cranial tension',
        associatedMeridian: 'Bladder',
        associatedOrgan: 'Bladder',
        notes: 'Critical for headache patterns. Often hypertonic but functionally weak.'
      }
    ],
    corrections: [
      {
        correctionType: 'neurolymphatic',
        targetArea: 'Gall bladder, kidney, and bladder reflexes',
        procedure: 'Massage specific reflexes: GB (lateral ribs), kidney (upper chest), bladder (lower abdomen)',
        duration: '30-45 seconds per reflex',
        expectedOutcome: 'Improved neck muscle function and reduced headache tendency',
        retestProcedure: 'Retest neck muscles for improved strength and coordination',
        notes: 'Supports organ function that affects head and neck muscle balance.'
      },
      {
        correctionType: 'neurovascular',
        targetArea: 'Temporal and frontal neurovascular points',
        procedure: 'Light contact on temporal sphenoid line and frontal eminences',
        duration: '2-3 minutes per area',
        expectedOutcome: 'Improved cranial circulation and reduced head tension',
        retestProcedure: 'Retest neck muscles and check for head tension reduction',
        notes: 'Enhances circulation to head and neck, reduces vascular headache component.'
      },
      {
        correctionType: 'structural',
        targetArea: 'Cervical spine and cranial alignment',
        procedure: 'Gentle cervical mobilization and cranial decompression',
        duration: '3-5 minutes',
        expectedOutcome: 'Improved cervical function and reduced mechanical headache triggers',
        retestProcedure: 'Retest neck muscles and assess cervical range of motion',
        notes: 'Addresses structural component of headache patterns.'
      }
    ],
    treatmentSequence: [
      '1. Assess headache patterns and triggers',
      '2. Test cervical and cranial muscles',
      '3. Identify muscle weakness patterns',
      '4. Apply neurolymphatic corrections for weak muscles',
      '5. Perform neurovascular corrections for circulation',
      '6. Address structural cervical issues',
      '7. Provide cranial decompression if appropriate',
      '8. Retest muscles and assess head/neck tension',
      '9. Recommend exercises and ergonomic improvements'
    ],
    totalDuration: '30-45 minutes',
    frequency: '1-2 times per week for 4-6 sessions, then as needed',
    contraindications: [
      'Recent head trauma or concussion',
      'Severe cervical spine instability',
      'Vertebral artery insufficiency',
      'Severe hypertension (>200/120)',
      'Recent neck surgery',
      'Active migraine episode'
    ],
    modifications: [
      {
        condition: 'Migraine headaches',
        modification: 'Very gentle approach, avoid during acute episodes, focus on prevention between attacks'
      },
      {
        condition: 'Tension headaches',
        modification: 'Include stress assessment, ergonomic evaluation, longer ESR sessions'
      },
      {
        condition: 'Cervicogenic headaches',
        modification: 'Emphasize structural corrections, include upper cervical assessment'
      },
      {
        condition: 'Hormone-related headaches',
        modification: 'Include endocrine muscle testing, hormonal support recommendations'
      }
    ],
    integrationExercises: [
      {
        exerciseName: 'Neck Stabilization',
        description: 'Gentle isometric exercises for deep neck muscles',
        duration: '5 minutes daily'
      },
      {
        exerciseName: 'Postural Awareness',
        description: 'Exercises to improve head and neck positioning',
        duration: 'Throughout day'
      },
      {
        exerciseName: 'Stress Release Techniques',
        description: 'Self-applied ESR and relaxation methods',
        duration: '10 minutes as needed'
      }
    ],
    clinicalNotes: 'Applied Kinesiology for headaches reveals the complex relationships between cervical muscle function, organ meridian balance, and emotional stress patterns. Many chronic headaches have underlying muscle imbalances that create mechanical triggers. The approach addresses both structural and energetic components.',
    followUpGuidance: 'Monitor headache frequency, intensity, and triggers. Practice recommended exercises and stress management techniques. Address ergonomic and lifestyle factors. Follow up every 2 weeks during active treatment.'
  },

  {
    indicationId: 'fatigue',
    protocolName: 'Energy Assessment & Vitality Restoration AK Protocol',
    primaryAssessments: [
      {
        muscleName: 'Supraspinatus',
        anatomicalLocation: 'Top of shoulder blade',
        testingPosition: 'Standing, arm abducted to 90 degrees',
        testingProcedure: 'Resist arm abduction in scapular plane',
        normalResponse: 'Strong, sustained resistance',
        weaknessIndicates: 'Brain integration issues, central nervous system fatigue',
        notes: 'Indicator muscle for brain function and central integration.'
      },
      {
        muscleName: 'Sartorius',
        anatomicalLocation: 'Long muscle from hip to knee',
        testingPosition: 'Supine, hip flexed and externally rotated',
        testingProcedure: 'Resist hip flexion with external rotation',
        normalResponse: 'Coordinated resistance through full range',
        weaknessIndicates: 'Adrenal fatigue, stress adaptation problems',
        notes: 'Reflects adrenal function and stress adaptation capacity.'
      },
      {
        muscleName: 'Gracilis',
        anatomicalLocation: 'Inner thigh muscle',
        testingPosition: 'Supine, legs together',
        testingProcedure: 'Resist hip adduction',
        normalResponse: 'Strong, stable adduction',
        weaknessIndicates: 'Adrenal medulla dysfunction, fight-or-flight exhaustion',
        notes: 'Indicates adrenal medulla function and stress response capacity.'
      }
    ],
    corrections: [
      {
        correctionType: 'neurolymphatic',
        targetArea: 'Adrenal and brain circulation reflexes',
        procedure: 'Massage adrenal reflexes (upper back) and brain circulation points',
        duration: '1-2 minutes per reflex area',
        expectedOutcome: 'Improved energy levels and stress adaptation',
        retestProcedure: 'Retest sartorius and gracilis for adrenal support',
        notes: 'Supports adrenal function and brain circulation for energy restoration.'
      },
      {
        correctionType: 'neurovascular',
        targetArea: 'Frontal eminences and temporal areas',
        procedure: 'Light contact to enhance brain circulation and integration',
        duration: '3-5 minutes',
        expectedOutcome: 'Improved mental clarity and energy',
        retestProcedure: 'Retest supraspinatus for brain integration',
        notes: 'Enhances brain function and reduces mental fatigue.'
      },
      {
        correctionType: 'emotional_stress_release',
        targetArea: 'Stress patterns contributing to fatigue',
        procedure: 'ESR for overwhelm, burnout, and energy-draining situations',
        duration: '5-10 minutes',
        expectedOutcome: 'Reduced stress load and improved energy conservation',
        retestProcedure: 'Retest muscles while thinking about energy-draining situations',
        notes: 'Addresses emotional and mental patterns that deplete energy.'
      }
    ],
    treatmentSequence: [
      '1. Comprehensive energy and lifestyle assessment',
      '2. Test indicator muscles for energy systems',
      '3. Identify patterns of energy depletion',
      '4. Apply corrections for weak energy systems',
      '5. Address emotional stress patterns draining energy',
      '6. Provide nutritional and lifestyle recommendations',
      '7. Retest energy muscles for improvement',
      '8. Teach energy conservation and restoration techniques',
      '9. Plan graduated activity progression'
    ],
    totalDuration: '45-60 minutes',
    frequency: 'Weekly for 6-8 sessions, then bi-weekly for maintenance',
    contraindications: [
      'Severe chronic fatigue syndrome without medical management',
      'Active autoimmune flare',
      'Severe depression with energy depletion',
      'Undiagnosed fatigue requiring medical evaluation',
      'Patient unable to tolerate assessment procedures'
    ],
    modifications: [
      {
        condition: 'Chronic fatigue syndrome',
        modification: 'Very gentle testing, shorter sessions, focus on energy conservation'
      },
      {
        condition: 'Adrenal fatigue',
        modification: 'Include adrenal support recommendations, stress management, lifestyle modifications'
      },
      {
        condition: 'Post-viral fatigue',
        modification: 'Support immune system recovery, gradual activity progression'
      },
      {
        condition: 'Burnout',
        modification: 'Emphasize stress management, boundary setting, lifestyle restructuring'
      }
    ],
    integrationExercises: [
      {
        exerciseName: 'Energy Breathing',
        description: 'Specific breathing patterns to enhance energy and vitality',
        duration: '10 minutes morning and evening'
      },
      {
        exerciseName: 'Gentle Movement',
        description: 'Low-impact exercises to support energy without depletion',
        duration: '15-20 minutes daily'
      },
      {
        exerciseName: 'Stress Boundary Techniques',
        description: 'Methods to protect and conserve personal energy',
        duration: 'As needed throughout day'
      }
    ],
    clinicalNotes: 'Applied Kinesiology for fatigue reveals the complex interplay between physical, emotional, and energetic factors in energy depletion. The approach identifies specific systems that are compromised and provides targeted corrections. Adrenal function and stress adaptation are key factors in most fatigue patterns.',
    followUpGuidance: 'Monitor energy levels, sleep quality, and stress adaptation. Implement recommended lifestyle changes gradually. Address underlying health factors contributing to fatigue. Follow up weekly initially, then monthly for maintenance.'
  }
];

// Helper function to get Applied Kinesiology protocol for specific indication
export const getAppliedKinesiologyProtocol = (indicationId: string): AppliedKinesiologyProtocol | undefined => {
  return appliedKinesiologyProtocols.find(protocol => protocol.indicationId === indicationId);
};
