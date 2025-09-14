// Comprehensive cupping treatment protocols for each indication
export interface CuppingProtocol {
  indicationId: string;
  protocolName: string;
  primaryAreas: {
    areaName: string;
    anatomicalLocation: string;
    cupSize: 'small' | 'medium' | 'large';
    suctionLevel: 'light' | 'medium' | 'strong';
    technique: 'stationary' | 'sliding' | 'flash' | 'needle_retention';
    duration: string;
    numberOfCups: number;
    notes?: string;
  }[];
  secondaryAreas?: {
    areaName: string;
    condition: string; // When to use this area
    technique: string;
    cupSize: string;
  }[];
  treatmentSequence: string[];
  totalDuration: string;
  frequency: string;
  contraindications?: string[];
  modifications?: {
    condition: string;
    modification: string;
  }[];
  postTreatmentCare: string;
  expectedMarking: string;
  clinicalNotes: string;
  followUpGuidance: string;
}

export const cuppingProtocols: CuppingProtocol[] = [
  {
    indicationId: 'back_pain',
    protocolName: 'Comprehensive Back Pain Cupping Protocol',
    primaryAreas: [
      {
        areaName: 'Bladder Meridian Lines',
        anatomicalLocation: 'Paravertebral muscles, 1.5 cun lateral to spine T1-L5',
        cupSize: 'medium',
        suctionLevel: 'medium',
        technique: 'stationary',
        duration: '10-15 minutes',
        numberOfCups: '8-12 cups',
        notes: 'Focus on tender areas and Back-Shu points. Avoid direct placement over spine.'
      },
      {
        areaName: 'Lower Back Focus',
        anatomicalLocation: 'Lumbar region, kidney and bladder Shu point areas',
        cupSize: 'large',
        suctionLevel: 'medium',
        technique: 'stationary',
        duration: '12-15 minutes',
        numberOfCups: '4-6 cups',
        notes: 'Target BL23 (Kidney Shu) and BL25 (Large Intestine Shu) areas for lower back pain.'
      },
      {
        areaName: 'Upper Trapezius',
        anatomicalLocation: 'Shoulder well area, GB21 region',
        cupSize: 'medium',
        suctionLevel: 'light',
        technique: 'sliding',
        duration: '5-8 minutes',
        numberOfCups: '2-3 cups',
        notes: 'Use sliding technique from neck toward shoulders. Contraindicated in pregnancy.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Hip and Glute Region',
        condition: 'For sciatic pain or hip involvement',
        technique: 'Stationary cupping over GB30 area',
        cupSize: 'Large cups for deeper penetration'
      },
      {
        areaName: 'Lateral Thigh',
        condition: 'For referred pain down leg',
        technique: 'Sliding cupping along GB meridian',
        cupSize: 'Medium cups with moderate suction'
      }
    ],
    treatmentSequence: [
      '1. Patient prone, comfortable positioning with pillow support',
      '2. Apply massage oil to entire back',
      '3. Begin with upper trapezius sliding technique (5-8 min)',
      '4. Place stationary cups along bladder meridian lines (10-15 min)',
      '5. Focus additional cups on lower back tender areas (12-15 min)',
      '6. Add secondary areas if indicated',
      '7. Remove cups slowly, apply post-treatment care'
    ],
    totalDuration: '25-35 minutes',
    frequency: '2-3 times per week for acute pain, weekly for chronic conditions',
    contraindications: [
      'Pregnancy (avoid GB21 and lower back)',
      'Bleeding disorders or anticoagulant medications',
      'Severe osteoporosis',
      'Recent back surgery',
      'Acute disc herniation',
      'Skin conditions or open wounds',
      'Severe cardiovascular disease'
    ],
    modifications: [
      {
        condition: 'Acute pain',
        modification: 'Use lighter suction initially, shorter duration (8-10 min), focus on pain relief'
      },
      {
        condition: 'Chronic pain',
        modification: 'Stronger suction tolerated, longer sessions, include tonification areas'
      },
      {
        condition: 'Elderly patients',
        modification: 'Lighter suction, shorter duration, monitor skin integrity carefully'
      },
      {
        condition: 'Athletes',
        modification: 'Can use stronger suction, longer duration, include performance enhancement areas'
      }
    ],
    postTreatmentCare: 'Keep area warm and covered for 2-4 hours. Avoid cold exposure. Drink warm water. Gentle movement encouraged. Apply warming liniment if desired.',
    expectedMarking: 'Light to moderate circular marks that fade within 3-7 days. Dark purple indicates strong suction or stagnation. No marking suggests insufficient suction or good circulation.',
    clinicalNotes: 'Cupping is excellent for back pain as it addresses both local muscle tension and systemic qi stagnation. The Bladder meridian contains all the Back-Shu points, making it ideal for organ-related back pain. Always assess for underlying structural issues and coordinate with other treatments.',
    followUpGuidance: 'Monitor pain levels and functional improvement. Recommend gentle movement and stretching. Address posture and ergonomics. Follow up in 3-5 days to assess response and adjust treatment plan.'
  },

  {
    indicationId: 'headache',
    protocolName: 'Headache Relief Cupping Protocol',
    primaryAreas: [
      {
        areaName: 'Upper Trapezius and Neck',
        anatomicalLocation: 'GB20, GB21 areas and surrounding neck muscles',
        cupSize: 'small',
        suctionLevel: 'light',
        technique: 'stationary',
        duration: '8-12 minutes',
        numberOfCups: '4-6 cups',
        notes: 'Focus on suboccipital region and upper trapezius. Avoid anterior neck.'
      },
      {
        areaName: 'Upper Back and Shoulders',
        anatomicalLocation: 'T1-T7 paravertebral region, trapezius muscle',
        cupSize: 'medium',
        suctionLevel: 'medium',
        technique: 'sliding',
        duration: '6-10 minutes',
        numberOfCups: '3-4 cups',
        notes: 'Use sliding technique to release muscle tension contributing to headaches.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Temporal Region',
        condition: 'For temporal or migraine headaches',
        technique: 'Very light flash cupping',
        cupSize: 'Small cups with minimal suction'
      },
      {
        areaName: 'Forehead',
        condition: 'For frontal headaches (experienced practitioners only)',
        technique: 'Flash cupping with extreme caution',
        cupSize: 'Very small cups'
      }
    ],
    treatmentSequence: [
      '1. Patient seated or prone, head supported',
      '2. Apply light massage oil to neck and upper back',
      '3. Begin with sliding cupping on upper back (6-10 min)',
      '4. Place stationary cups on neck and trapezius (8-12 min)',
      '5. Add temporal areas only if experienced and appropriate',
      '6. Remove cups slowly and apply post-care'
    ],
    totalDuration: '15-25 minutes',
    frequency: '2-3 times per week during acute episodes, weekly for prevention',
    contraindications: [
      'Pregnancy (avoid GB21)',
      'Severe hypertension (>180/110)',
      'Recent head trauma',
      'Bleeding disorders',
      'Skin conditions on treatment areas',
      'Severe cervical spine instability'
    ],
    modifications: [
      {
        condition: 'Migraine headaches',
        modification: 'Very gentle approach, avoid during acute migraine, focus on prevention'
      },
      {
        condition: 'Tension headaches',
        modification: 'Can use moderate suction, emphasize muscle release techniques'
      },
      {
        condition: 'Stress-related headaches',
        modification: 'Include relaxation time, gentle approach, longer duration'
      }
    ],
    postTreatmentCare: 'Keep neck and shoulders warm. Avoid wind and cold exposure. Rest in quiet environment. Apply gentle heat if comfortable. Stay hydrated.',
    expectedMarking: 'Light pink to moderate red marks on neck and shoulders. Should fade within 2-5 days. Minimal marking on neck is normal and preferred.',
    clinicalNotes: 'Cupping for headaches works by releasing muscle tension in the neck and shoulders that often contributes to head pain. The technique also promotes local circulation and can help clear wind-cold pathogenic factors. Always start with lighter suction on the neck area.',
    followUpGuidance: 'Monitor headache frequency and intensity. Teach patient neck stretches and posture awareness. Address stress factors and sleep hygiene. Follow up weekly during treatment phase.'
  },

  {
    indicationId: 'cough',
    protocolName: 'Respiratory Support Cupping Protocol',
    primaryAreas: [
      {
        areaName: 'Upper Back Lung Area',
        anatomicalLocation: 'T1-T6 paravertebral, BL13 (Lung Shu) focus',
        cupSize: 'medium',
        suctionLevel: 'light',
        technique: 'stationary',
        duration: '10-15 minutes',
        numberOfCups: '6-8 cups',
        notes: 'Focus on Lung Shu (BL13) and surrounding area. Use gentle suction for respiratory conditions.'
      },
      {
        areaName: 'Upper Chest',
        anatomicalLocation: 'Below clavicle, avoiding nipple area',
        cupSize: 'small',
        suctionLevel: 'light',
        technique: 'stationary',
        duration: '5-8 minutes',
        numberOfCups: '2-4 cups',
        notes: 'Gentle suction only. Avoid if patient has difficulty breathing in prone position.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Intercostal Spaces',
        condition: 'For chest tightness and rib pain',
        technique: 'Light stationary cupping between ribs',
        cupSize: 'Small cups with very light suction'
      },
      {
        areaName: 'Lower Back Kidney Area',
        condition: 'For chronic cough with kidney involvement',
        technique: 'Stationary cupping over BL23 area',
        cupSize: 'Medium cups with light suction'
      }
    ],
    treatmentSequence: [
      '1. Patient seated leaning forward or prone (if comfortable)',
      '2. Apply minimal oil to back (less oil for respiratory conditions)',
      '3. Begin with upper back lung area stationary cupping (10-15 min)',
      '4. Add upper chest cups if tolerated (5-8 min)',
      '5. Include kidney support area for chronic conditions',
      '6. Remove cups gently, keep patient warm'
    ],
    totalDuration: '15-25 minutes',
    frequency: '2-3 times per week during acute phase, weekly for chronic cough',
    contraindications: [
      'Severe respiratory distress',
      'Pneumonia or active lung infection',
      'Pneumothorax history',
      'Severe asthma during acute episode',
      'Bleeding disorders',
      'Recent chest surgery',
      'Severe cardiac conditions'
    ],
    modifications: [
      {
        condition: 'Acute cough',
        modification: 'Very light suction, shorter sessions, focus on upper back only'
      },
      {
        condition: 'Chronic cough',
        modification: 'Can use slightly stronger suction, include kidney support areas'
      },
      {
        condition: 'Productive cough',
        modification: 'Encourage expectoration after treatment, keep warm'
      },
      {
        condition: 'Dry cough',
        modification: 'Very gentle approach, include yin nourishing areas, humidify environment'
      }
    ],
    postTreatmentCare: 'Keep chest and back warm and covered. Avoid cold air and wind. Stay hydrated with warm fluids. Rest voice if sore throat present. Gentle breathing exercises encouraged.',
    expectedMarking: 'Light to moderate marks on back. Chest should have minimal marking. Marks typically fade in 2-4 days for respiratory conditions.',
    clinicalNotes: 'Cupping for respiratory conditions works by promoting local circulation, reducing inflammation, and helping to expel pathogenic factors. The technique is particularly effective for external wind-cold invasions and chronic lung weakness. Always use gentle suction for respiratory conditions.',
    followUpGuidance: 'Monitor cough frequency and quality of sputum. Recommend breathing exercises and postural drainage if appropriate. Address environmental factors and lifestyle. Follow up every 3-5 days during acute phase.'
  },

  {
    indicationId: 'digestive_disorders',
    protocolName: 'Digestive Support Cupping Protocol',
    primaryAreas: [
      {
        areaName: 'Middle Back Digestive Shu Points',
        anatomicalLocation: 'T9-T12 region, BL18 (Liver), BL20 (Spleen), BL21 (Stomach)',
        cupSize: 'medium',
        suctionLevel: 'medium',
        technique: 'stationary',
        duration: '12-15 minutes',
        numberOfCups: '6-8 cups',
        notes: 'Focus on digestive organ Shu points for systemic digestive support.'
      },
      {
        areaName: 'Abdominal Region',
        anatomicalLocation: 'Around umbilicus, avoiding direct navel contact',
        cupSize: 'large',
        suctionLevel: 'light',
        technique: 'stationary',
        duration: '8-12 minutes',
        numberOfCups: '3-5 cups',
        notes: 'Very gentle suction on abdomen. Use larger cups for broader, gentler effect.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Lower Back',
        condition: 'For chronic digestive weakness',
        technique: 'Stationary cupping over kidney area',
        cupSize: 'Medium cups for kidney yang support'
      },
      {
        areaName: 'Upper Abdomen',
        condition: 'For stomach-specific issues',
        technique: 'Very light cupping over stomach area',
        cupSize: 'Large cups with minimal suction'
      }
    ],
    treatmentSequence: [
      '1. Patient prone for back treatment, supine for abdominal',
      '2. Apply light massage oil to treatment areas',
      '3. Begin with back Shu points - stationary cupping (12-15 min)',
      '4. Turn patient supine, ensure comfort',
      '5. Apply gentle abdominal cupping (8-12 min)',
      '6. Add secondary areas based on specific symptoms',
      '7. Remove cups slowly, keep patient warm'
    ],
    totalDuration: '25-35 minutes',
    frequency: '2-3 times per week, preferably not immediately after meals',
    contraindications: [
      'Acute abdominal pain requiring medical attention',
      'Recent abdominal surgery',
      'Pregnancy (modify abdominal treatment)',
      'Severe gastric ulcers',
      'Inflammatory bowel disease during acute flare',
      'Abdominal hernias',
      'Bleeding disorders'
    ],
    modifications: [
      {
        condition: 'Acute digestive upset',
        modification: 'Focus on back points only, avoid abdominal cupping during acute phase'
      },
      {
        condition: 'Chronic digestive weakness',
        modification: 'Include kidney support areas, use warming techniques, longer duration'
      },
      {
        condition: 'Stress-related digestive issues',
        modification: 'Include heart and liver Shu points, emphasize relaxation'
      },
      {
        condition: 'Pregnancy',
        modification: 'Back treatment only, avoid lower back and abdomen, very gentle approach'
      }
    ],
    postTreatmentCare: 'Keep abdomen and back warm. Eat warm, easily digestible foods. Avoid cold drinks and raw foods for 2-4 hours. Rest and avoid strenuous activity.',
    expectedMarking: 'Light to moderate marks on back, minimal marking on abdomen preferred. Marks should fade within 3-5 days.',
    clinicalNotes: 'Cupping for digestive disorders works by tonifying the digestive organs through their Back-Shu points and promoting local circulation in the abdominal region. The technique helps strengthen digestive fire and resolve food stagnation. Always use very gentle suction on the abdomen.',
    followUpGuidance: 'Monitor digestive symptoms and energy levels. Recommend dietary modifications and eating habits. Address stress factors affecting digestion. Follow up weekly to assess progress.'
  },

  {
    indicationId: 'shoulder_pain',
    protocolName: 'Shoulder Mobility & Pain Relief Cupping Protocol',
    primaryAreas: [
      {
        areaName: 'Shoulder Joint Area',
        anatomicalLocation: 'Around acromion, deltoid muscle, avoiding bony prominences',
        cupSize: 'medium',
        suctionLevel: 'medium',
        technique: 'stationary',
        duration: '10-12 minutes',
        numberOfCups: '4-6 cups',
        notes: 'Focus on LI15, TH14 areas. Adjust cup placement based on pain location.'
      },
      {
        areaName: 'Upper Trapezius',
        anatomicalLocation: 'GB21 area, upper shoulder region',
        cupSize: 'medium',
        suctionLevel: 'medium',
        technique: 'sliding',
        duration: '5-8 minutes',
        numberOfCups: '2-3 cups',
        notes: 'Use sliding technique from neck toward shoulder. Contraindicated in pregnancy.'
      },
      {
        areaName: 'Scapular Region',
        anatomicalLocation: 'Around shoulder blade, infraspinatus area',
        cupSize: 'medium',
        suctionLevel: 'medium',
        technique: 'stationary',
        duration: '8-10 minutes',
        numberOfCups: '3-4 cups',
        notes: 'Target SI11 area and trigger points around scapula.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Upper Arm',
        condition: 'For referred pain down arm',
        technique: 'Light sliding cupping along arm meridians',
        cupSize: 'Small to medium cups'
      },
      {
        areaName: 'Neck Extension',
        condition: 'For neck involvement in shoulder pain',
        technique: 'Very light stationary cupping on posterior neck',
        cupSize: 'Small cups only'
      }
    ],
    treatmentSequence: [
      '1. Patient seated or side-lying for access to shoulder',
      '2. Apply massage oil to shoulder and upper back',
      '3. Begin with sliding on upper trapezius (5-8 min)',
      '4. Place stationary cups around shoulder joint (10-12 min)',
      '5. Add scapular region cups (8-10 min)',
      '6. Include arm or neck if indicated',
      '7. Remove cups slowly, encourage gentle movement'
    ],
    totalDuration: '20-30 minutes',
    frequency: '2-3 times per week for acute pain, weekly for chronic conditions',
    contraindications: [
      'Pregnancy (avoid GB21)',
      'Recent shoulder surgery or dislocation',
      'Severe shoulder instability',
      'Acute rotator cuff tear',
      'Bleeding disorders',
      'Skin conditions on shoulder',
      'Severe adhesive capsulitis (frozen shoulder) in acute phase'
    ],
    modifications: [
      {
        condition: 'Acute shoulder injury',
        modification: 'Very light suction, focus on areas away from acute injury, shorter sessions'
      },
      {
        condition: 'Chronic shoulder stiffness',
        modification: 'Can use stronger suction, include mobility exercises during treatment'
      },
      {
        condition: 'Rotator cuff issues',
        modification: 'Focus on scapular stabilizers, avoid direct pressure on injured tendons'
      },
      {
        condition: 'Frozen shoulder',
        modification: 'Very gentle approach, focus on pain relief rather than aggressive mobilization'
      }
    ],
    postTreatmentCare: 'Keep shoulder warm and mobile with gentle range of motion. Avoid overhead activities for 2-4 hours. Apply heat if comfortable. Gentle stretching encouraged.',
    expectedMarking: 'Light to moderate circular marks around shoulder and upper back. Should fade within 3-6 days. Darker marks may indicate more stagnation.',
    clinicalNotes: 'Shoulder cupping is effective for both acute and chronic shoulder conditions by improving local circulation, reducing inflammation, and releasing muscle tension. The technique works well with acupressure and movement therapy. Always assess shoulder mechanics and posture.',
    followUpGuidance: 'Monitor pain levels and range of motion. Recommend specific shoulder exercises and posture correction. Address ergonomic factors. Follow up in 3-5 days to assess progress.'
  },

  {
    indicationId: 'anxiety',
    protocolName: 'Calming & Nervous System Support Cupping Protocol',
    primaryAreas: [
      {
        areaName: 'Upper Back Heart/Lung Region',
        anatomicalLocation: 'T3-T6 paravertebral, BL13 (Lung) and BL15 (Heart) areas',
        cupSize: 'medium',
        suctionLevel: 'light',
        technique: 'stationary',
        duration: '12-15 minutes',
        numberOfCups: '4-6 cups',
        notes: 'Very gentle approach for calming nervous system. Focus on heart and lung Shu points.'
      },
      {
        areaName: 'Upper Trapezius',
        anatomicalLocation: 'Neck and shoulder tension areas',
        cupSize: 'small',
        suctionLevel: 'light',
        technique: 'sliding',
        duration: '5-8 minutes',
        numberOfCups: '2-3 cups',
        notes: 'Release physical tension that accompanies anxiety. Very gentle sliding motions.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Lower Back Kidney Area',
        condition: 'For fear-based anxiety or chronic stress',
        technique: 'Light stationary cupping over kidney Shu points',
        cupSize: 'Medium cups with gentle suction'
      }
    ],
    treatmentSequence: [
      '1. Create calm, quiet environment',
      '2. Patient prone, ensure complete comfort and warmth',
      '3. Apply gentle massage oil with calming intention',
      '4. Begin with very gentle sliding on neck/shoulders (5-8 min)',
      '5. Place stationary cups on heart/lung areas (12-15 min)',
      '6. Add kidney support if chronic anxiety',
      '7. Remove cups very slowly, maintain calm atmosphere'
    ],
    totalDuration: '20-30 minutes',
    frequency: '1-2 times per week, focus on consistency rather than frequency',
    contraindications: [
      'Severe panic disorder during acute episode',
      'Claustrophobia or fear of cupping',
      'Bleeding disorders',
      'Severe depression with suicidal ideation',
      'Pregnancy (modify positioning and areas)'
    ],
    modifications: [
      {
        condition: 'Panic disorder',
        modification: 'Extremely gentle approach, ensure patient feels in control, shorter sessions'
      },
      {
        condition: 'Chronic anxiety',
        modification: 'Regular sessions, include kidney support, combine with relaxation techniques'
      },
      {
        condition: 'Sleep anxiety',
        modification: 'Evening treatments, focus on calming points, include heart support'
      }
    ],
    postTreatmentCare: 'Rest in quiet environment for 15-30 minutes. Keep warm and avoid stimulating activities. Practice deep breathing. Avoid caffeine for remainder of day.',
    expectedMarking: 'Very light marks preferred for anxiety treatment. Should be barely visible and fade within 1-3 days. Heavy marking not desired for emotional conditions.',
    clinicalNotes: 'Cupping for anxiety works by calming the nervous system through gentle stimulation of heart and lung areas. The technique promotes parasympathetic activation and releases physical tension that accompanies emotional stress. The treatment environment and practitioner demeanor are crucial for success.',
    followUpGuidance: 'Monitor anxiety levels and sleep quality. Recommend stress management techniques, breathing exercises, and lifestyle modifications. Consider combining with counseling or other stress management approaches. Follow up weekly.'
  },

  {
    indicationId: 'common_cold',
    protocolName: 'Wind-Cold Release Cupping Protocol',
    primaryAreas: [
      {
        areaName: 'Upper Back Wind Gate',
        anatomicalLocation: 'T1-T4 region, BL12 (Wind Gate) and BL13 (Lung Shu)',
        cupSize: 'medium',
        suctionLevel: 'medium',
        technique: 'stationary',
        duration: '8-12 minutes',
        numberOfCups: '4-6 cups',
        notes: 'Focus on releasing external wind-cold pathogen. Target Wind Gate and Lung Shu points.'
      },
      {
        areaName: 'Upper Trapezius and Neck',
        anatomicalLocation: 'GB20, GB21 areas where wind enters',
        cupSize: 'small',
        suctionLevel: 'light',
        technique: 'flash',
        duration: '3-5 minutes',
        numberOfCups: '3-4 cups',
        notes: 'Use flash cupping technique to expel wind. Quick application and removal.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Between Shoulder Blades',
        condition: 'For chest congestion',
        technique: 'Stationary cupping over lung areas',
        cupSize: 'Medium cups with light suction'
      }
    ],
    treatmentSequence: [
      '1. Patient prone, ensure warmth and comfort',
      '2. Apply minimal oil (wind conditions need less oil)',
      '3. Begin with flash cupping on neck/trapezius (3-5 min)',
      '4. Place stationary cups on wind gate and lung areas (8-12 min)',
      '5. Add chest support areas if needed',
      '6. Remove cups, keep patient very warm',
      '7. Encourage sweating if appropriate'
    ],
    totalDuration: '15-20 minutes',
    frequency: 'Daily during acute phase (first 3-5 days), then as needed',
    contraindications: [
      'High fever (>102°F/39°C)',
      'Severe respiratory distress',
      'Bleeding disorders',
      'Immunocompromised patients',
      'Pregnancy (modify approach)',
      'Skin conditions or rashes'
    ],
    modifications: [
      {
        condition: 'Early stage cold',
        modification: 'Stronger suction to expel pathogen, encourage mild sweating'
      },
      {
        condition: 'Later stage with congestion',
        modification: 'Focus on lung areas, gentler approach, include chest support'
      },
      {
        condition: 'Wind-heat type cold',
        modification: 'Lighter suction, shorter duration, focus on clearing heat'
      }
    ],
    postTreatmentCare: 'Keep very warm and avoid wind/cold exposure for 2-4 hours. Drink warm ginger tea or hot water. Rest and avoid strenuous activity. Light sweating is beneficial.',
    expectedMarking: 'Moderate marks expected as pathogen is expelled. Darker marks may indicate stronger pathogenic factor. Marks should fade as cold resolves (3-7 days).',
    clinicalNotes: 'Cupping for common cold works by expelling external pathogenic factors, particularly wind-cold. The technique opens the pores and promotes sweating to release the pathogen. Timing is crucial - most effective in early stages of cold. Always keep patient warm after treatment.',
    followUpGuidance: 'Monitor cold symptoms and body temperature. Recommend rest, warm fluids, and avoiding re-exposure to wind/cold. If symptoms worsen or persist beyond 7 days, refer for medical evaluation.'
  },

  {
    indicationId: 'muscle_tension',
    protocolName: 'Muscle Release & Circulation Cupping Protocol',
    primaryAreas: [
      {
        areaName: 'Primary Tension Area',
        anatomicalLocation: 'Specific muscle groups showing tension (varies by patient)',
        cupSize: 'medium',
        suctionLevel: 'medium',
        technique: 'stationary',
        duration: '10-15 minutes',
        numberOfCups: '4-8 cups',
        notes: 'Customize based on individual tension patterns. Common areas: trapezius, rhomboids, erector spinae.'
      },
      {
        areaName: 'Surrounding Support Areas',
        anatomicalLocation: 'Adjacent muscle groups and meridian pathways',
        cupSize: 'medium',
        suctionLevel: 'light',
        technique: 'sliding',
        duration: '5-10 minutes',
        numberOfCups: '2-4 cups',
        notes: 'Use sliding technique to connect treatment areas and promote overall circulation.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Trigger Point Areas',
        condition: 'For specific knots and trigger points',
        technique: 'Stationary cupping directly over trigger points',
        cupSize: 'Small cups for precise targeting'
      }
    ],
    treatmentSequence: [
      '1. Assess muscle tension patterns and trigger points',
      '2. Patient in comfortable position for access',
      '3. Apply adequate massage oil for sliding techniques',
      '4. Begin with sliding cupping to warm tissues (5-10 min)',
      '5. Place stationary cups on primary tension areas (10-15 min)',
      '6. Target specific trigger points if present',
      '7. Remove cups slowly, encourage gentle movement'
    ],
    totalDuration: '20-30 minutes',
    frequency: '2-3 times per week for acute tension, weekly for maintenance',
    contraindications: [
      'Acute muscle strain or tear',
      'Bleeding disorders',
      'Recent muscle injury',
      'Severe muscle inflammation',
      'Skin conditions over treatment area',
      'Pregnancy (avoid certain areas)'
    ],
    modifications: [
      {
        condition: 'Acute muscle tension',
        modification: 'Lighter suction initially, focus on pain relief and circulation'
      },
      {
        condition: 'Chronic muscle tension',
        modification: 'Can use stronger suction, longer duration, include trigger point work'
      },
      {
        condition: 'Stress-related tension',
        modification: 'Include calming areas, emphasize relaxation during treatment'
      },
      {
        condition: 'Athletic tension',
        modification: 'Can use stronger techniques, include performance enhancement areas'
      }
    ],
    postTreatmentCare: 'Gentle movement and stretching encouraged. Keep muscles warm. Avoid strenuous activity for 2-4 hours. Apply heat if comfortable. Stay hydrated.',
    expectedMarking: 'Moderate to strong marks depending on tension level. Darker marks indicate more stagnation. Should fade within 3-7 days as circulation improves.',
    clinicalNotes: 'Cupping for muscle tension works by improving local circulation, reducing inflammation, and releasing fascial restrictions. The negative pressure helps separate tissue layers and promote healing. Combine with stretching and movement for best results.',
    followUpGuidance: 'Monitor muscle tension and pain levels. Recommend specific stretches and strengthening exercises. Address postural and ergonomic factors. Follow up in 3-5 days to assess response.'
  }
];

// Helper function to get cupping protocol for specific indication
export const getCuppingProtocol = (indicationId: string): CuppingProtocol | undefined => {
  return cuppingProtocols.find(protocol => protocol.indicationId === indicationId);
};
