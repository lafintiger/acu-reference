// Comprehensive acupressure treatment protocols for each indication
export interface AcupressureProtocol {
  indicationId: string;
  protocolName: string;
  primaryPoints: {
    pointId: string;
    pointName: string;
    location: string;
    technique: string;
    pressure: 'light' | 'moderate' | 'firm';
    duration: string;
    bilateralTreatment: boolean;
    notes?: string;
  }[];
  secondaryPoints?: {
    pointId: string;
    pointName: string;
    condition: string; // When to use this point
    technique: string;
  }[];
  treatmentSequence: string[];
  totalDuration: string;
  frequency: string;
  contraindications?: string[];
  modifications?: {
    condition: string;
    modification: string;
  }[];
  clinicalNotes: string;
  followUpGuidance: string;
}

export const acupressureProtocols: AcupressureProtocol[] = [
  {
    indicationId: 'headache',
    protocolName: 'Comprehensive Headache Relief Protocol',
    primaryPoints: [
      {
        pointId: 'LI4',
        pointName: 'Hegu',
        location: 'Web between thumb and index finger',
        technique: 'Sustained pressure with circular motions',
        pressure: 'firm',
        duration: '2-3 minutes',
        bilateralTreatment: true,
        notes: 'Most important point for headache relief. Contraindicated in pregnancy.'
      },
      {
        pointId: 'GB20',
        pointName: 'Fengchi',
        location: 'Base of skull, between neck muscles',
        technique: 'Sustained pressure directed toward opposite eye',
        pressure: 'moderate',
        duration: '2-3 minutes',
        bilateralTreatment: true,
        notes: 'Excellent for occipital and tension headaches.'
      },
      {
        pointId: 'LV3',
        pointName: 'Taichong',
        location: 'Foot dorsum, between 1st and 2nd metatarsals',
        technique: 'Sustained pressure with gentle circular motions',
        pressure: 'moderate',
        duration: '2-3 minutes',
        bilateralTreatment: true,
        notes: 'Pairs with LI4 for Four Gates treatment. Excellent for stress headaches.'
      }
    ],
    secondaryPoints: [
      {
        pointId: 'TH5',
        pointName: 'Waiguan',
        condition: 'For temporal or migraine headaches',
        technique: 'Moderate pressure with circular motions'
      },
      {
        pointId: 'GB14',
        pointName: 'Yangbai',
        condition: 'For frontal headaches',
        technique: 'Light pressure with gentle circular motions'
      },
      {
        pointId: 'BL2',
        pointName: 'Zanzhu',
        condition: 'For frontal headaches and sinus pressure',
        technique: 'Very light pressure with upward motions'
      }
    ],
    treatmentSequence: [
      '1. Begin with LI4 bilateral (2-3 min each)',
      '2. Move to LV3 bilateral (2-3 min each)',
      '3. Apply pressure to GB20 bilateral (2-3 min each)',
      '4. Add secondary points based on headache location',
      '5. Return to LI4 for final integration (1 min bilateral)'
    ],
    totalDuration: '15-20 minutes',
    frequency: 'Every 4-6 hours during acute episodes, daily for prevention',
    contraindications: ['Pregnancy (avoid LI4)', 'Severe hypertension', 'Recent head trauma'],
    modifications: [
      {
        condition: 'Pregnancy',
        modification: 'Omit LI4, use GB20 and LV3 only with lighter pressure'
      },
      {
        condition: 'Children under 12',
        modification: 'Use light pressure only, reduce duration to 1-2 minutes per point'
      },
      {
        condition: 'Elderly patients',
        modification: 'Use gentle pressure, monitor for dizziness, shorter sessions'
      }
    ],
    clinicalNotes: 'The Four Gates combination (LI4 + LV3) is the most powerful point combination for headaches. GB20 addresses the local neck tension that often contributes to headaches. Always check for underlying causes like dehydration, stress, or cervical dysfunction.',
    followUpGuidance: 'Teach patient self-treatment on LI4 and LV3. Recommend stress management techniques. If headaches persist beyond 3 days or worsen, refer for further evaluation.'
  },

  {
    indicationId: 'digestive_disorders',
    protocolName: 'Digestive Health & Stomach Harmony Protocol',
    primaryPoints: [
      {
        pointId: 'ST36',
        pointName: 'Zusanli',
        location: '3 cun below kneecap, lateral to shin bone',
        technique: 'Firm sustained pressure with clockwise circular motions',
        pressure: 'firm',
        duration: '3-5 minutes',
        bilateralTreatment: true,
        notes: 'Master point for digestive health and overall tonification.'
      },
      {
        pointId: 'SP6',
        pointName: 'Sanyinjiao',
        location: '3 cun above inner ankle, behind shin bone',
        technique: 'Moderate sustained pressure',
        pressure: 'moderate',
        duration: '2-3 minutes',
        bilateralTreatment: true,
        notes: 'Harmonizes spleen, liver, and kidney. Contraindicated in pregnancy.'
      },
      {
        pointId: 'CV12',
        pointName: 'Zhongwan',
        location: 'Midline, 4 cun above navel',
        technique: 'Gentle circular motions clockwise',
        pressure: 'light',
        duration: '3-4 minutes',
        bilateralTreatment: false,
        notes: 'Mu point of stomach. Use gentle pressure on sensitive abdomen.'
      }
    ],
    secondaryPoints: [
      {
        pointId: 'PC6',
        pointName: 'Neiguan',
        condition: 'For nausea and vomiting',
        technique: 'Sustained pressure between forearm tendons'
      },
      {
        pointId: 'SP3',
        pointName: 'Taibai',
        condition: 'For chronic digestive weakness',
        technique: 'Gentle sustained pressure on foot arch'
      },
      {
        pointId: 'LI4',
        pointName: 'Hegu',
        condition: 'For constipation',
        technique: 'Firm pressure toward second metacarpal'
      }
    ],
    treatmentSequence: [
      '1. Begin with CV12 - gentle clockwise circles (3-4 min)',
      '2. ST36 bilateral - firm pressure with circles (3-5 min each)',
      '3. SP6 bilateral - moderate sustained pressure (2-3 min each)',
      '4. Add secondary points based on specific symptoms',
      '5. Return to CV12 for integration (1-2 min)'
    ],
    totalDuration: '20-25 minutes',
    frequency: '2-3 times daily, preferably before meals',
    contraindications: ['Pregnancy (avoid SP6)', 'Acute abdominal pain requiring medical attention', 'Recent abdominal surgery'],
    modifications: [
      {
        condition: 'Acute nausea',
        modification: 'Focus on PC6 first, then add CV12 with very light pressure'
      },
      {
        condition: 'Chronic fatigue with poor digestion',
        modification: 'Emphasize ST36 with longer duration (5-7 minutes), add moxa if available'
      },
      {
        condition: 'Stress-related digestive issues',
        modification: 'Include HT7 for calming, use gentler pressure overall'
      }
    ],
    clinicalNotes: 'ST36 is the most important point for digestive health and should be the foundation of any digestive treatment. The combination of ST36, SP6, and CV12 addresses the complete digestive system from different TCM perspectives. Always treat gently on the abdomen.',
    followUpGuidance: 'Teach patient self-treatment on ST36 and PC6. Recommend eating habits: smaller meals, chew slowly, avoid cold drinks. Monitor symptoms and adjust pressure/frequency as needed.'
  },

  {
    indicationId: 'anxiety',
    protocolName: 'Emotional Calming & Heart-Spirit Protocol',
    primaryPoints: [
      {
        pointId: 'HT7',
        pointName: 'Shenmen',
        location: 'Wrist crease, ulnar side near pisiform bone',
        technique: 'Gentle sustained pressure with slow breathing',
        pressure: 'light',
        duration: '3-5 minutes',
        bilateralTreatment: true,
        notes: 'Master point for emotional disorders and spirit calming.'
      },
      {
        pointId: 'PC6',
        pointName: 'Neiguan',
        location: '2 cun above wrist crease, between tendons',
        technique: 'Sustained pressure with deep breathing coordination',
        pressure: 'moderate',
        duration: '3-4 minutes',
        bilateralTreatment: true,
        notes: 'Excellent for anxiety, chest tightness, and emotional regulation.'
      },
      {
        pointId: 'CV17',
        pointName: 'Shanzhong',
        location: 'Center of chest, between nipples',
        technique: 'Light circular motions with slow, deep breathing',
        pressure: 'light',
        duration: '2-3 minutes',
        bilateralTreatment: false,
        notes: 'Influential point for qi. Helps release emotional blockages.'
      }
    ],
    secondaryPoints: [
      {
        pointId: 'KI1',
        pointName: 'Yongquan',
        condition: 'For grounding and severe anxiety',
        technique: 'Firm pressure on sole of foot'
      },
      {
        pointId: 'LV3',
        pointName: 'Taichong',
        condition: 'For anger-related anxiety',
        technique: 'Moderate pressure with circular motions'
      },
      {
        pointId: 'GV20',
        pointName: 'Baihui',
        condition: 'For mental clarity and focus',
        technique: 'Light pressure on top of head'
      }
    ],
    treatmentSequence: [
      '1. Begin with deep breathing and centering',
      '2. HT7 bilateral - gentle, calming pressure (3-5 min each)',
      '3. PC6 bilateral - coordinate with breathing (3-4 min each)',
      '4. CV17 - light circles with deep breathing (2-3 min)',
      '5. Add grounding points (KI1) if needed',
      '6. End with calming breath work'
    ],
    totalDuration: '15-25 minutes',
    frequency: '2-3 times daily, especially during anxious episodes',
    contraindications: ['Severe depression requiring medical intervention', 'Active psychosis'],
    modifications: [
      {
        condition: 'Panic attacks',
        modification: 'Focus on PC6 first for immediate relief, add grounding with KI1'
      },
      {
        condition: 'Chronic anxiety',
        modification: 'Longer sessions (25-30 min), include lifestyle counseling'
      },
      {
        condition: 'Sleep anxiety',
        modification: 'Perform before bedtime, add HT7 with longer duration'
      }
    ],
    clinicalNotes: 'Heart 7 is the most important point for emotional regulation and should be included in all anxiety treatments. The combination with PC6 addresses both the heart and pericardium for comprehensive emotional support. Always maintain a calm, supportive environment during treatment.',
    followUpGuidance: 'Teach patient self-treatment on HT7 and PC6 for daily use. Recommend breathing exercises, meditation, and stress management techniques. Follow up weekly to monitor progress and adjust treatment.'
  },

  {
    indicationId: 'back_pain',
    protocolName: 'Lower Back Pain Relief Protocol',
    primaryPoints: [
      {
        pointId: 'BL23',
        pointName: 'Shenshu',
        location: 'Lower back, 1.5 cun lateral to L2 vertebra',
        technique: 'Firm sustained pressure or circular motions',
        pressure: 'firm',
        duration: '3-4 minutes',
        bilateralTreatment: true,
        notes: 'Kidney Shu point. Master point for lower back pain and kidney tonification.'
      },
      {
        pointId: 'BL40',
        pointName: 'Weizhong',
        location: 'Center of knee crease, between tendons',
        technique: 'Moderate pressure with gentle circular motions',
        pressure: 'moderate',
        duration: '2-3 minutes',
        bilateralTreatment: true,
        notes: 'He-Sea point of Bladder. One of Four Command Points for back pain.'
      },
      {
        pointId: 'GV4',
        pointName: 'Mingmen',
        location: 'Lower back midline, below L2 vertebra',
        technique: 'Moderate sustained pressure',
        pressure: 'moderate',
        duration: '3-4 minutes',
        bilateralTreatment: false,
        notes: 'Gate of Life point. Strengthens kidney yang and lower back.'
      }
    ],
    secondaryPoints: [
      {
        pointId: 'GB30',
        pointName: 'Huantiao',
        condition: 'For hip and sciatic pain',
        technique: 'Firm pressure in hip depression'
      },
      {
        pointId: 'BL60',
        pointName: 'Kunlun',
        condition: 'For acute back pain',
        technique: 'Moderate pressure behind ankle'
      },
      {
        pointId: 'KI3',
        pointName: 'Taixi',
        condition: 'For chronic weakness',
        technique: 'Gentle sustained pressure behind inner ankle'
      }
    ],
    treatmentSequence: [
      '1. Patient lying prone or sitting comfortably',
      '2. GV4 - warm up lower back with moderate pressure (3-4 min)',
      '3. BL23 bilateral - firm pressure for kidney support (3-4 min each)',
      '4. BL40 bilateral - moderate pressure for back relief (2-3 min each)',
      '5. Add secondary points based on pain pattern',
      '6. Return to GV4 for integration (1-2 min)'
    ],
    totalDuration: '20-30 minutes',
    frequency: '2-3 times daily for acute pain, daily for chronic conditions',
    contraindications: ['Acute disc herniation', 'Spinal fracture', 'Severe osteoporosis', 'Pregnancy (modify pressure)'],
    modifications: [
      {
        condition: 'Acute pain',
        modification: 'Use lighter pressure initially, focus on BL40 for immediate relief'
      },
      {
        condition: 'Chronic pain',
        modification: 'Longer sessions with emphasis on tonification points (BL23, KI3)'
      },
      {
        condition: 'Sciatica',
        modification: 'Add GB30 and follow leg meridian points, avoid aggravating positions'
      }
    ],
    clinicalNotes: 'BL40 is traditionally one of the Four Command Points and should be included in all back pain treatments. The combination of local points (BL23, GV4) with distal points (BL40) follows traditional TCM principles. Always assess for underlying structural issues.',
    followUpGuidance: 'Teach patient self-treatment on accessible points (BL40, KI3). Recommend gentle movement, proper posture, and strengthening exercises. Monitor pain levels and functional improvement.'
  },

  {
    indicationId: 'insomnia',
    protocolName: 'Sleep Restoration & Spirit Calming Protocol',
    primaryPoints: [
      {
        pointId: 'HT7',
        pointName: 'Shenmen',
        location: 'Wrist crease, ulnar side near pisiform bone',
        technique: 'Gentle sustained pressure with slow, rhythmic breathing',
        pressure: 'light',
        duration: '3-5 minutes',
        bilateralTreatment: true,
        notes: 'Master point for sleep disorders and emotional calming.'
      },
      {
        pointId: 'KI1',
        pointName: 'Yongquan',
        location: 'Sole of foot, in depression when toes are curled',
        technique: 'Firm pressure with slow circular motions',
        pressure: 'firm',
        duration: '3-4 minutes',
        bilateralTreatment: true,
        notes: 'Grounding point. Brings energy downward for sleep preparation.'
      },
      {
        pointId: 'KI6',
        pointName: 'Zhaohai',
        location: 'Below inner ankle bone',
        technique: 'Gentle sustained pressure',
        pressure: 'moderate',
        duration: '2-3 minutes',
        bilateralTreatment: true,
        notes: 'Master point of Yin Qiao Mai. Excellent for insomnia and throat issues.'
      }
    ],
    secondaryPoints: [
      {
        pointId: 'PC6',
        pointName: 'Neiguan',
        condition: 'For anxiety-related insomnia',
        technique: 'Sustained pressure with deep breathing'
      },
      {
        pointId: 'SP6',
        pointName: 'Sanyinjiao',
        condition: 'For hormonal sleep disturbances',
        technique: 'Gentle circular pressure'
      },
      {
        pointId: 'LV3',
        pointName: 'Taichong',
        condition: 'For stress and anger affecting sleep',
        technique: 'Moderate pressure with calming intention'
      }
    ],
    treatmentSequence: [
      '1. Create calm environment, dim lights',
      '2. Begin with grounding - KI1 bilateral (3-4 min each)',
      '3. HT7 bilateral - gentle, rhythmic pressure (3-5 min each)',
      '4. KI6 bilateral - calming pressure (2-3 min each)',
      '5. Add emotional support points if needed',
      '6. End with slow, deep breathing'
    ],
    totalDuration: '20-30 minutes',
    frequency: 'Evening before bedtime, can repeat if awakening at night',
    contraindications: ['Pregnancy (avoid SP6)', 'Severe sleep apnea without medical management'],
    modifications: [
      {
        condition: 'Early awakening',
        modification: 'Focus on kidney points (KI1, KI6) for deeper sleep'
      },
      {
        condition: 'Difficulty falling asleep',
        modification: 'Emphasize heart points (HT7) and add PC6 for anxiety'
      },
      {
        condition: 'Stress-related insomnia',
        modification: 'Include LV3 and extend heart point treatment'
      }
    ],
    clinicalNotes: 'Sleep disorders often involve both heart (spirit housing) and kidney (essence storage) systems. The combination of heart calming (HT7) with kidney grounding (KI1, KI6) addresses both aspects. Treatment timing is crucial - perform 30-60 minutes before desired sleep time.',
    followUpGuidance: 'Teach patient bedtime self-treatment routine. Recommend sleep hygiene: consistent bedtime, cool room, no screens 1 hour before bed. Consider underlying stress factors and address accordingly.'
  },

  {
    indicationId: 'neck_stiffness',
    protocolName: 'Neck Tension Release & Mobility Protocol',
    primaryPoints: [
      {
        pointId: 'GB20',
        pointName: 'Fengchi',
        location: 'Base of skull, between neck muscles',
        technique: 'Sustained pressure directed toward opposite eye',
        pressure: 'moderate',
        duration: '2-4 minutes',
        bilateralTreatment: true,
        notes: 'Master point for neck tension and occipital headaches.'
      },
      {
        pointId: 'BL10',
        pointName: 'Tianzhu',
        location: 'Base of skull, lateral to trapezius muscle',
        technique: 'Moderate pressure with small circular motions',
        pressure: 'moderate',
        duration: '2-3 minutes',
        bilateralTreatment: true,
        notes: 'Window of Heaven point. Excellent for neck stiffness and mental clarity.'
      },
      {
        pointId: 'SI3',
        pointName: 'Houxi',
        location: 'Outer edge of hand, below pinky finger',
        technique: 'Firm pressure with circular motions',
        pressure: 'firm',
        duration: '2-3 minutes',
        bilateralTreatment: true,
        notes: 'Master point of Governing Vessel. Connects to neck and spine.'
      }
    ],
    secondaryPoints: [
      {
        pointId: 'GB21',
        pointName: 'Jianjing',
        condition: 'For shoulder and upper trap tension',
        technique: 'Moderate to firm pressure on shoulder well'
      },
      {
        pointId: 'LI4',
        pointName: 'Hegu',
        condition: 'For general pain relief',
        technique: 'Firm pressure toward second metacarpal'
      },
      {
        pointId: 'TH5',
        pointName: 'Waiguan',
        condition: 'For lateral neck tension',
        technique: 'Moderate pressure on back of forearm'
      }
    ],
    treatmentSequence: [
      '1. Patient seated comfortably with neck supported',
      '2. SI3 bilateral - establish spine connection (2-3 min each)',
      '3. GB20 bilateral - release occipital tension (2-4 min each)',
      '4. BL10 bilateral - address deeper neck muscles (2-3 min each)',
      '5. Add shoulder points (GB21) if needed',
      '6. Gentle neck movements to integrate'
    ],
    totalDuration: '15-25 minutes',
    frequency: '2-3 times daily for acute stiffness, daily for chronic tension',
    contraindications: ['Cervical spine instability', 'Recent neck injury', 'Severe cervical arthritis'],
    modifications: [
      {
        condition: 'Acute torticollis',
        modification: 'Very gentle pressure, focus on distal points first (SI3, LI4)'
      },
      {
        condition: 'Chronic tension from computer work',
        modification: 'Include postural education, emphasize GB20 and BL10'
      },
      {
        condition: 'Stress-related neck tension',
        modification: 'Add emotional calming points (HT7, PC6) and stress management'
      }
    ],
    clinicalNotes: 'Neck stiffness often involves both local muscle tension and systemic qi stagnation. The combination of local points (GB20, BL10) with distal governing vessel points (SI3) addresses both aspects. Always assess for postural and ergonomic factors.',
    followUpGuidance: 'Teach patient self-treatment on accessible points (SI3, LI4). Recommend neck stretches, posture awareness, and ergonomic improvements. Address underlying stress and work habits.'
  },

  {
    indicationId: 'nausea',
    protocolName: 'Anti-Nausea & Stomach Settling Protocol',
    primaryPoints: [
      {
        pointId: 'PC6',
        pointName: 'Neiguan',
        location: '2 cun above wrist crease, between tendons',
        technique: 'Sustained pressure with slow, deep breathing',
        pressure: 'moderate',
        duration: '2-5 minutes',
        bilateralTreatment: true,
        notes: 'Most famous point for nausea. Works within minutes for most patients.'
      },
      {
        pointId: 'ST36',
        pointName: 'Zusanli',
        location: '3 cun below kneecap, lateral to shin bone',
        technique: 'Moderate pressure with downward direction',
        pressure: 'moderate',
        duration: '2-3 minutes',
        bilateralTreatment: true,
        notes: 'Harmonizes stomach qi and supports digestive function.'
      },
      {
        pointId: 'CV12',
        pointName: 'Zhongwan',
        location: 'Midline, 4 cun above navel',
        technique: 'Very gentle clockwise circular motions',
        pressure: 'light',
        duration: '2-3 minutes',
        bilateralTreatment: false,
        notes: 'Mu point of stomach. Use very gentle pressure to avoid aggravating nausea.'
      }
    ],
    secondaryPoints: [
      {
        pointId: 'SP4',
        pointName: 'Gongsun',
        condition: 'For chronic nausea and digestive weakness',
        technique: 'Gentle sustained pressure on foot arch'
      },
      {
        pointId: 'HT7',
        pointName: 'Shenmen',
        condition: 'For anxiety-related nausea',
        technique: 'Light calming pressure'
      },
      {
        pointId: 'LV3',
        pointName: 'Taichong',
        condition: 'For stress or anger-related nausea',
        technique: 'Moderate pressure with calming intention'
      }
    ],
    treatmentSequence: [
      '1. Patient in comfortable position, avoid movement',
      '2. PC6 bilateral immediately - sustained pressure (2-5 min each)',
      '3. Wait for initial relief before proceeding',
      '4. CV12 - very gentle circles if tolerated (2-3 min)',
      '5. ST36 bilateral - moderate downward pressure (2-3 min each)',
      '6. Add emotional support points if stress-related'
    ],
    totalDuration: '10-20 minutes',
    frequency: 'As needed for acute episodes, preventively before triggering activities',
    contraindications: ['Severe vomiting requiring medical attention', 'Bowel obstruction', 'Pregnancy (use with caution)'],
    modifications: [
      {
        condition: 'Morning sickness',
        modification: 'Focus on PC6, very gentle pressure, avoid abdominal points initially'
      },
      {
        condition: 'Motion sickness',
        modification: 'Treat PC6 preventively, teach self-treatment for travel'
      },
      {
        condition: 'Chemotherapy-related nausea',
        modification: 'Very gentle approach, coordinate with medical team, focus on PC6'
      }
    ],
    clinicalNotes: 'PC6 is remarkably effective for nausea and should be the first point treated. The effect is often immediate and dramatic. For chronic nausea, address underlying digestive weakness with tonification points like ST36 and SP4.',
    followUpGuidance: 'Teach patient PC6 self-treatment - this is one of the most important self-help techniques. Provide wristbands with PC6 location marked. Address dietary triggers and eating habits.'
  },

  {
    indicationId: 'hypertension',
    protocolName: 'Blood Pressure Regulation & Calming Protocol',
    primaryPoints: [
      {
        pointId: 'LV3',
        pointName: 'Taichong',
        location: 'Foot dorsum, between 1st and 2nd metatarsals',
        technique: 'Moderate sustained pressure with calming intention',
        pressure: 'moderate',
        duration: '3-5 minutes',
        bilateralTreatment: true,
        notes: 'Master point for liver qi regulation and blood pressure reduction.'
      },
      {
        pointId: 'KI1',
        pointName: 'Yongquan',
        location: 'Sole of foot, in depression when toes are curled',
        technique: 'Firm pressure with grounding visualization',
        pressure: 'firm',
        duration: '3-4 minutes',
        bilateralTreatment: true,
        notes: 'Brings yang energy downward. Excellent for hypertension and agitation.'
      },
      {
        pointId: 'GV20',
        pointName: 'Baihui',
        location: 'Top of head, intersection of ear apex lines',
        technique: 'Light sustained pressure',
        pressure: 'light',
        duration: '2-3 minutes',
        bilateralTreatment: false,
        notes: 'Regulates yang qi rising. Calms excessive yang energy.'
      }
    ],
    secondaryPoints: [
      {
        pointId: 'HT7',
        pointName: 'Shenmen',
        condition: 'For stress-related hypertension',
        technique: 'Gentle calming pressure'
      },
      {
        pointId: 'LI11',
        pointName: 'Quchi',
        condition: 'For heat-type hypertension',
        technique: 'Moderate to firm pressure'
      },
      {
        pointId: 'GB20',
        pointName: 'Fengchi',
        condition: 'For headaches with high blood pressure',
        technique: 'Moderate pressure directed downward'
      }
    ],
    treatmentSequence: [
      '1. Patient relaxed, monitor blood pressure if possible',
      '2. Begin with grounding - KI1 bilateral (3-4 min each)',
      '3. LV3 bilateral - liver qi regulation (3-5 min each)',
      '4. GV20 - calm rising yang (2-3 min)',
      '5. Add stress/emotional points if indicated',
      '6. End with deep breathing and relaxation'
    ],
    totalDuration: '20-30 minutes',
    frequency: '1-2 times daily, preferably morning and evening',
    contraindications: ['Hypotension', 'Severe cardiovascular disease without medical supervision', 'Recent stroke'],
    modifications: [
      {
        condition: 'Mild hypertension',
        modification: 'Focus on lifestyle points, longer sessions for relaxation'
      },
      {
        condition: 'Stress-induced hypertension',
        modification: 'Include emotional regulation points (HT7, PC6), stress management'
      },
      {
        condition: 'Elderly patients',
        modification: 'Gentler pressure, shorter sessions, monitor for dizziness'
      }
    ],
    clinicalNotes: 'Hypertension treatment requires both local blood pressure regulation (LV3, KI1) and systemic calming (HT7, GV20). The liver-kidney axis is crucial in blood pressure regulation. Always coordinate with medical management.',
    followUpGuidance: 'Teach patient daily self-treatment routine, especially KI1 and LV3. Emphasize lifestyle modifications: diet, exercise, stress management. Monitor blood pressure regularly and coordinate with healthcare provider.'
  }
];

// Helper function to get protocol for specific indication
export const getAcupressureProtocol = (indicationId: string): AcupressureProtocol | undefined => {
  return acupressureProtocols.find(protocol => protocol.indicationId === indicationId);
};
