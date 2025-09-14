// Comprehensive Gua Sha treatment protocols for each indication
export interface GuaShaProtocol {
  indicationId: string;
  protocolName: string;
  primaryAreas: {
    areaName: string;
    anatomicalLocation: string;
    scrapingDirection: string;
    pressure: 'light' | 'moderate' | 'firm';
    strokeLength: string;
    duration: string;
    toolType: 'smooth_edge' | 'coin_edge' | 'horn' | 'jade' | 'stainless_steel';
    oilRequired: boolean;
    notes?: string;
  }[];
  secondaryAreas?: {
    areaName: string;
    condition: string; // When to use this area
    technique: string;
    toolType: string;
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
  expectedShaMarking: string;
  clinicalNotes: string;
  followUpGuidance: string;
}

export const guaShaProtocols: GuaShaProtocol[] = [
  {
    indicationId: 'neck_stiffness',
    protocolName: 'Neck & Shoulder Tension Release Gua Sha Protocol',
    primaryAreas: [
      {
        areaName: 'Posterior Neck',
        anatomicalLocation: 'Occiput to C7, along GB meridian pathway',
        scrapingDirection: 'Downward from occiput to base of neck',
        pressure: 'light',
        strokeLength: '4-6 inches',
        duration: '3-5 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Very gentle on neck. Follow natural cervical curve. Avoid anterior neck completely.'
      },
      {
        areaName: 'Upper Trapezius',
        anatomicalLocation: 'From neck to shoulder, GB21 area',
        scrapingDirection: 'From neck laterally toward shoulder',
        pressure: 'moderate',
        strokeLength: '6-8 inches',
        duration: '5-8 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Can use moderate pressure on trapezius. Avoid GB21 in pregnancy.'
      },
      {
        areaName: 'Upper Back and Rhomboids',
        anatomicalLocation: 'Between shoulder blades, T1-T6 region',
        scrapingDirection: 'Downward along bladder meridian lines',
        pressure: 'moderate',
        strokeLength: '6-10 inches',
        duration: '5-8 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Follow bladder meridian pathways. Focus on tender areas and knots.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Lateral Neck',
        condition: 'For lateral neck tension or torticollis',
        technique: 'Very gentle scraping along side of neck',
        toolType: 'Smooth edge with minimal pressure'
      },
      {
        areaName: 'Suboccipital Region',
        condition: 'For occipital headaches with neck involvement',
        technique: 'Gentle horizontal strokes at skull base',
        toolType: 'Small smooth tool'
      }
    ],
    treatmentSequence: [
      '1. Patient seated or prone, neck in neutral position',
      '2. Apply adequate massage oil to entire treatment area',
      '3. Begin with gentle warming strokes without tool',
      '4. Start posterior neck - very gentle downward strokes (3-5 min)',
      '5. Move to upper trapezius - moderate pressure laterally (5-8 min)',
      '6. Finish with upper back rhomboids - downward strokes (5-8 min)',
      '7. Add secondary areas if indicated',
      '8. Clean oil and apply post-treatment care'
    ],
    totalDuration: '15-25 minutes',
    frequency: '2-3 times per week for acute stiffness, weekly for chronic tension',
    contraindications: [
      'Pregnancy (avoid GB21 and strong neck pressure)',
      'Cervical spine instability or recent injury',
      'Severe cervical arthritis',
      'Bleeding disorders or anticoagulants',
      'Skin conditions on neck/shoulders',
      'Recent neck surgery',
      'Severe hypertension',
      'Carotid artery disease'
    ],
    modifications: [
      {
        condition: 'Acute torticollis',
        modification: 'Extremely gentle pressure, focus on less affected side first, very short strokes'
      },
      {
        condition: 'Chronic computer neck',
        modification: 'Include postural education, focus on upper trapezius and rhomboids'
      },
      {
        condition: 'Stress-related tension',
        modification: 'Slower, more meditative approach, include relaxation time'
      },
      {
        condition: 'Elderly patients',
        modification: 'Very gentle pressure, shorter duration, monitor skin integrity'
      }
    ],
    postTreatmentCare: 'Keep neck and shoulders warm and covered. Avoid wind and cold exposure for 2-4 hours. Gentle neck movements encouraged. Apply heat if comfortable. Stay hydrated.',
    expectedShaMarking: 'Light to moderate red marks (sha) indicating released stagnation. Marks should be pink to red, not dark purple. Should fade within 2-5 days.',
    clinicalNotes: 'Gua Sha for neck stiffness works by releasing fascial restrictions, improving circulation, and reducing inflammation. The technique follows meridian pathways, particularly the Gall Bladder meridian which traverses the lateral neck and shoulders. Always use gentle pressure on the neck area.',
    followUpGuidance: 'Monitor neck mobility and pain levels. Recommend neck stretches and posture awareness. Address ergonomic factors and stress management. Follow up in 3-5 days to assess response.'
  },

  {
    indicationId: 'headache',
    protocolName: 'Headache Relief Gua Sha Protocol',
    primaryAreas: [
      {
        areaName: 'Temporal Region',
        anatomicalLocation: 'Temple area, following GB meridian pathway',
        scrapingDirection: 'From temple backward toward ear',
        pressure: 'light',
        strokeLength: '2-3 inches',
        duration: '2-3 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Very gentle on head. Use smooth, rounded tool. Avoid excessive pressure.'
      },
      {
        areaName: 'Occipital Region',
        anatomicalLocation: 'Base of skull, suboccipital muscles',
        scrapingDirection: 'Horizontal strokes along skull base',
        pressure: 'light',
        strokeLength: '3-4 inches',
        duration: '3-5 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Focus on GB20 area. Use gentle pressure to avoid discomfort.'
      },
      {
        areaName: 'Upper Trapezius',
        anatomicalLocation: 'Neck to shoulder region',
        scrapingDirection: 'From neck laterally toward shoulder',
        pressure: 'moderate',
        strokeLength: '6-8 inches',
        duration: '5-8 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Can use moderate pressure on trapezius. Address muscle tension contributing to headaches.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Forehead',
        condition: 'For frontal headaches (experienced practitioners only)',
        technique: 'Extremely gentle upward strokes from eyebrows to hairline',
        toolType: 'Very smooth, rounded tool only'
      },
      {
        areaName: 'Upper Back',
        condition: 'For tension headaches with back involvement',
        technique: 'Downward strokes along bladder meridian',
        toolType: 'Standard gua sha tool'
      }
    ],
    treatmentSequence: [
      '1. Patient seated comfortably, head supported',
      '2. Apply oil to head, neck, and shoulder areas',
      '3. Begin with gentle warming massage',
      '4. Start with occipital region - gentle horizontal strokes (3-5 min)',
      '5. Move to temporal areas - light backward strokes (2-3 min each side)',
      '6. Finish with upper trapezius - moderate lateral strokes (5-8 min)',
      '7. Add secondary areas only if appropriate',
      '8. Clean oil, apply cooling if desired'
    ],
    totalDuration: '15-25 minutes',
    frequency: '2-3 times per week during acute episodes, weekly for prevention',
    contraindications: [
      'Pregnancy (avoid strong neck pressure)',
      'Severe hypertension (>180/110)',
      'Recent head trauma or concussion',
      'Bleeding disorders',
      'Severe migraines during acute episode',
      'Scalp conditions or hair loss',
      'Cervical spine instability'
    ],
    modifications: [
      {
        condition: 'Migraine headaches',
        modification: 'Extremely gentle approach, avoid during acute migraine, focus on prevention between episodes'
      },
      {
        condition: 'Tension headaches',
        modification: 'Can use moderate pressure on neck/shoulders, emphasize muscle release'
      },
      {
        condition: 'Sinus headaches',
        modification: 'Include gentle facial techniques, focus on drainage pathways'
      },
      {
        condition: 'Stress headaches',
        modification: 'Slower, more relaxing approach, include stress management discussion'
      }
    ],
    postTreatmentCare: 'Keep head and neck warm. Avoid wind exposure. Rest in quiet environment for 30 minutes. Stay hydrated. Avoid alcohol and stimulants.',
    expectedShaMarking: 'Light pink to red marks on neck and shoulders. Head should show minimal marking. Marks should fade within 2-4 days.',
    clinicalNotes: 'Gua Sha for headaches works by releasing wind-cold pathogenic factors, improving circulation, and reducing muscle tension. The technique is particularly effective for tension and wind-type headaches. Always use very gentle pressure on the head and avoid excessive marking.',
    followUpGuidance: 'Monitor headache frequency and intensity. Recommend stress management and proper sleep hygiene. Address posture and ergonomic factors. Follow up weekly during treatment phase.'
  },

  {
    indicationId: 'back_pain',
    protocolName: 'Back Pain Relief & Circulation Gua Sha Protocol',
    primaryAreas: [
      {
        areaName: 'Bladder Meridian Lines',
        anatomicalLocation: 'Paravertebral muscles, 1.5 cun lateral to spine T1-L5',
        scrapingDirection: 'Downward along meridian pathways',
        pressure: 'moderate',
        strokeLength: '8-12 inches',
        duration: '8-12 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Follow bladder meridian lines. Focus on Back-Shu points and tender areas.'
      },
      {
        areaName: 'Lower Back Focus',
        anatomicalLocation: 'Lumbar region, kidney and bladder Shu areas',
        scrapingDirection: 'Horizontal and diagonal strokes over lower back',
        pressure: 'moderate',
        strokeLength: '4-6 inches',
        duration: '6-10 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Target BL23 (Kidney Shu) and surrounding areas. Use crossing stroke patterns.'
      },
      {
        areaName: 'Lateral Back Muscles',
        anatomicalLocation: 'Latissimus dorsi and quadratus lumborum areas',
        scrapingDirection: 'Diagonal strokes following muscle fiber direction',
        pressure: 'moderate',
        strokeLength: '6-8 inches',
        duration: '5-8 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Address lateral muscle chains that contribute to back pain.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Hip and Glute Region',
        condition: 'For sciatic involvement or hip pain',
        technique: 'Firm scraping over glute muscles and GB30 area',
        toolType: 'Larger tool for broader muscle coverage'
      },
      {
        areaName: 'Upper Back Extension',
        condition: 'For upper back and neck involvement',
        technique: 'Upward continuation to upper trapezius',
        toolType: 'Standard smooth edge tool'
      }
    ],
    treatmentSequence: [
      '1. Patient prone, comfortable with pillow support',
      '2. Apply generous massage oil to entire back',
      '3. Begin with gentle warming massage',
      '4. Start upper back - downward strokes along bladder lines (8-12 min)',
      '5. Focus on lower back - horizontal and diagonal patterns (6-10 min)',
      '6. Address lateral muscles - diagonal strokes (5-8 min)',
      '7. Add hip/glute areas if indicated',
      '8. Clean oil, apply warming liniment if available'
    ],
    totalDuration: '25-35 minutes',
    frequency: '2-3 times per week for acute pain, weekly for chronic conditions',
    contraindications: [
      'Pregnancy (avoid lower back and strong pressure)',
      'Bleeding disorders or anticoagulants',
      'Recent back surgery or spinal procedures',
      'Acute disc herniation',
      'Severe osteoporosis',
      'Skin conditions or infections on back',
      'Open wounds or recent injuries'
    ],
    modifications: [
      {
        condition: 'Acute back pain',
        modification: 'Lighter pressure initially, shorter strokes, focus on circulation rather than deep release'
      },
      {
        condition: 'Chronic back pain',
        modification: 'Can use firmer pressure, longer sessions, include hip and leg extensions'
      },
      {
        condition: 'Sciatica',
        modification: 'Include hip and glute work, follow leg meridian pathways, avoid aggravating positions'
      },
      {
        condition: 'Upper back tension',
        modification: 'Extend treatment to neck and shoulders, include rhomboid and trapezius work'
      }
    ],
    postTreatmentCare: 'Keep back warm and covered for 2-4 hours. Avoid cold exposure and wind. Gentle movement encouraged. Apply heat if comfortable. Stay well hydrated.',
    expectedShaMarking: 'Moderate red marks (sha) indicating released blood stagnation. Darker marks show more stagnation. Should fade within 3-7 days as circulation improves.',
    clinicalNotes: 'Gua Sha for back pain works by breaking up fascial adhesions, improving circulation, and reducing inflammation. The technique follows meridian pathways and addresses both local muscle tension and systemic qi stagnation. The bladder meridian contains all Back-Shu points, making it ideal for organ-related back issues.',
    followUpGuidance: 'Monitor pain levels and functional improvement. Recommend gentle stretching and strengthening exercises. Address posture and ergonomics. Follow up in 3-5 days to assess response and adjust treatment.'
  },

  {
    indicationId: 'common_cold',
    protocolName: 'Wind-Cold Release Gua Sha Protocol',
    primaryAreas: [
      {
        areaName: 'Upper Back Wind Gate',
        anatomicalLocation: 'T1-T6 region, BL12 (Wind Gate) and BL13 (Lung Shu)',
        scrapingDirection: 'Downward strokes along bladder meridian',
        pressure: 'moderate',
        strokeLength: '6-8 inches',
        duration: '5-8 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Focus on releasing external wind-cold pathogen. Target Wind Gate and Lung Shu areas.'
      },
      {
        areaName: 'Upper Trapezius and Neck',
        anatomicalLocation: 'GB20, GB21 areas where wind enters',
        scrapingDirection: 'Downward from neck to shoulders',
        pressure: 'light',
        strokeLength: '4-6 inches',
        duration: '3-5 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Gentle approach to release wind without depleting patient energy.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Chest and Upper Ribs',
        condition: 'For chest congestion (experienced practitioners)',
        technique: 'Very gentle downward strokes over upper chest',
        toolType: 'Smooth, rounded tool with minimal pressure'
      }
    ],
    treatmentSequence: [
      '1. Patient prone or seated leaning forward',
      '2. Apply light oil (less oil for wind conditions)',
      '3. Begin with gentle warming massage',
      '4. Start upper back wind gate area - moderate downward strokes (5-8 min)',
      '5. Move to neck/trapezius - gentle downward release (3-5 min)',
      '6. Add chest work only if experienced and appropriate',
      '7. Keep patient very warm after treatment',
      '8. Encourage light sweating if appropriate'
    ],
    totalDuration: '10-20 minutes',
    frequency: 'Daily during early stage (first 3 days), then every other day',
    contraindications: [
      'High fever (>102°F/39°C)',
      'Severe respiratory distress',
      'Bleeding disorders',
      'Pregnancy (modify pressure and areas)',
      'Immunocompromised patients',
      'Skin rashes or infections'
    ],
    modifications: [
      {
        condition: 'Early stage wind-cold',
        modification: 'Moderate pressure to expel pathogen, encourage mild sweating'
      },
      {
        condition: 'Later stage with congestion',
        modification: 'Gentler approach, focus on lung support areas, include chest if appropriate'
      },
      {
        condition: 'Wind-heat type cold',
        modification: 'Lighter pressure, shorter duration, focus on clearing heat rather than warming'
      },
      {
        condition: 'Weak constitution',
        modification: 'Very gentle approach, shorter sessions, focus on supporting rather than dispersing'
      }
    ],
    postTreatmentCare: 'Keep very warm and avoid wind/cold exposure for 4-6 hours. Drink warm ginger tea. Rest and avoid strenuous activity. Light sweating is beneficial for pathogen release.',
    expectedShaMarking: 'Moderate to strong sha marks expected as pathogen is expelled. Darker marks indicate stronger pathogenic factor. Marks should fade as cold symptoms resolve.',
    clinicalNotes: 'Gua Sha for common cold works by opening the pores, promoting sweating, and expelling external pathogenic factors. The technique is most effective in the early stages of wind-cold invasion. Timing and keeping the patient warm afterward are crucial for success.',
    followUpGuidance: 'Monitor cold symptoms and recovery progress. Recommend continued warmth, rest, and immune-supporting foods. If symptoms worsen or persist beyond 7 days, refer for medical evaluation.'
  },

  {
    indicationId: 'facial_paralysis',
    protocolName: 'Facial Nerve Recovery Gua Sha Protocol',
    primaryAreas: [
      {
        areaName: 'Affected Side of Face',
        anatomicalLocation: 'Along facial meridian pathways, ST and LI points',
        scrapingDirection: 'Upward strokes from jaw to temple',
        pressure: 'light',
        strokeLength: '2-3 inches',
        duration: '3-5 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Extremely gentle on face. Use upward strokes to lift and stimulate. Avoid downward pressure.'
      },
      {
        areaName: 'Lateral Neck',
        anatomicalLocation: 'Side of neck, behind ear, mastoid area',
        scrapingDirection: 'Downward from ear to shoulder',
        pressure: 'light',
        strokeLength: '3-4 inches',
        duration: '3-5 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Address neck tension that may contribute to facial nerve issues.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Opposite Side Balance',
        condition: 'To balance facial muscle tension',
        technique: 'Very gentle scraping on unaffected side for symmetry',
        toolType: 'Smooth edge with minimal pressure'
      }
    ],
    treatmentSequence: [
      '1. Patient seated comfortably, face relaxed',
      '2. Apply light facial oil or serum',
      '3. Begin with gentle facial massage without tool',
      '4. Start lateral neck - gentle downward strokes (3-5 min)',
      '5. Move to affected facial area - upward lifting strokes (3-5 min)',
      '6. Include opposite side gently for balance if appropriate',
      '7. End with gentle facial massage',
      '8. Apply appropriate facial care products'
    ],
    totalDuration: '10-15 minutes',
    frequency: 'Daily for acute cases, 3-4 times per week for recovery phase',
    contraindications: [
      'Acute Bell\'s palsy in first 48 hours',
      'Facial skin conditions or infections',
      'Recent facial surgery',
      'Severe facial swelling',
      'Bleeding disorders',
      'Facial nerve tumors'
    ],
    modifications: [
      {
        condition: 'Acute facial paralysis',
        modification: 'Extremely gentle, focus on circulation rather than muscle stimulation'
      },
      {
        condition: 'Chronic facial weakness',
        modification: 'Can use slightly more pressure, include muscle re-education exercises'
      },
      {
        condition: 'Post-stroke facial involvement',
        modification: 'Very gentle approach, coordinate with medical team, focus on circulation'
      }
    ],
    postTreatmentCare: 'Protect face from wind and cold. Use gentle facial exercises as tolerated. Apply appropriate moisturizer. Avoid extreme facial expressions initially.',
    expectedShaMarking: 'Minimal to light marking on face preferred. Neck may show light sha. Facial marking should be barely visible and fade within 1-2 days.',
    clinicalNotes: 'Facial Gua Sha works by improving circulation to facial nerves and muscles, reducing inflammation, and promoting nerve regeneration. The technique must be extremely gentle and focus on lifting and circulation rather than deep tissue work. Always coordinate with medical treatment for facial paralysis.',
    followUpGuidance: 'Monitor facial function and symmetry daily. Recommend facial exercises and speech therapy if appropriate. Address underlying causes and coordinate with healthcare team. Follow up every 2-3 days initially.'
  },

  {
    indicationId: 'skin_conditions',
    protocolName: 'Skin Health & Detoxification Gua Sha Protocol',
    primaryAreas: [
      {
        areaName: 'Upper Back Lung Area',
        anatomicalLocation: 'T1-T6 region, BL13 (Lung Shu) focus',
        scrapingDirection: 'Downward along bladder meridian lines',
        pressure: 'light',
        strokeLength: '6-8 inches',
        duration: '5-8 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Lung governs skin in TCM. Focus on lung Shu point area for skin health.'
      },
      {
        areaName: 'Large Intestine Shu Area',
        anatomicalLocation: 'L4 region, BL25 (Large Intestine Shu)',
        scrapingDirection: 'Horizontal strokes over lower back',
        pressure: 'light',
        strokeLength: '4-6 inches',
        duration: '3-5 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Large intestine elimination supports skin detoxification.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Affected Skin Areas',
        condition: 'For localized skin conditions (if skin intact)',
        technique: 'Very gentle scraping around affected areas, not directly over',
        toolType: 'Smooth, clean tool with light pressure'
      }
    ],
    treatmentSequence: [
      '1. Patient prone, ensure clean treatment environment',
      '2. Apply clean, appropriate oil (avoid allergens)',
      '3. Begin with gentle massage to assess skin condition',
      '4. Start upper back lung area - gentle downward strokes (5-8 min)',
      '5. Move to lower back elimination support (3-5 min)',
      '6. Address local areas only if skin is intact',
      '7. Clean thoroughly, apply appropriate post-care'
    ],
    totalDuration: '10-20 minutes',
    frequency: '1-2 times per week, monitor skin response carefully',
    contraindications: [
      'Open wounds or broken skin',
      'Active skin infections',
      'Severe eczema or psoriasis flare',
      'Allergic skin reactions',
      'Recent skin treatments or procedures',
      'Bleeding disorders',
      'Immunocompromised conditions'
    ],
    modifications: [
      {
        condition: 'Sensitive skin',
        modification: 'Extremely light pressure, shorter duration, test small area first'
      },
      {
        condition: 'Chronic skin conditions',
        modification: 'Focus on constitutional support areas, avoid direct treatment of affected skin'
      },
      {
        condition: 'Allergic conditions',
        modification: 'Use hypoallergenic oils, avoid potential allergens, very gentle approach'
      }
    ],
    postTreatmentCare: 'Keep skin clean and moisturized. Avoid harsh chemicals or irritants for 24 hours. Use gentle, natural skin care products. Monitor for any reactions.',
    expectedShaMarking: 'Light marking preferred for skin conditions. Heavy marking may stress already compromised skin. Focus on circulation improvement rather than strong sha.',
    clinicalNotes: 'Gua Sha for skin conditions works by improving circulation, supporting detoxification, and strengthening the lung and large intestine systems that govern skin health in TCM. The approach must be very gentle and focus on constitutional support rather than aggressive local treatment.',
    followUpGuidance: 'Monitor skin condition daily. Recommend appropriate diet and lifestyle modifications for skin health. Address potential allergens and irritants. Follow up weekly to assess skin response.'
  },

  {
    indicationId: 'muscle_tension',
    protocolName: 'Muscle Release & Fascial Gua Sha Protocol',
    primaryAreas: [
      {
        areaName: 'Primary Tension Area',
        anatomicalLocation: 'Specific muscle groups showing tension (customizable)',
        scrapingDirection: 'Along muscle fiber direction',
        pressure: 'moderate',
        strokeLength: '6-10 inches',
        duration: '8-12 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Customize based on individual tension patterns. Follow muscle fiber direction for optimal release.'
      },
      {
        areaName: 'Connecting Fascial Lines',
        anatomicalLocation: 'Myofascial chains connecting to primary tension',
        scrapingDirection: 'Following fascial line continuity',
        pressure: 'moderate',
        strokeLength: '8-12 inches',
        duration: '5-8 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Address fascial connections to prevent tension recurrence.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Trigger Point Areas',
        condition: 'For specific knots and adhesions',
        technique: 'Cross-fiber scraping over trigger points',
        toolType: 'Smaller tool for precise work'
      },
      {
        areaName: 'Meridian Pathways',
        condition: 'For systemic tension patterns',
        technique: 'Long strokes following complete meridian pathways',
        toolType: 'Standard smooth edge tool'
      }
    ],
    treatmentSequence: [
      '1. Assess tension patterns and fascial restrictions',
      '2. Patient positioned for optimal access to tension areas',
      '3. Apply adequate oil for smooth gliding',
      '4. Begin with warming massage to prepare tissues',
      '5. Start primary tension area - moderate pressure along fibers (8-12 min)',
      '6. Address connecting fascial lines (5-8 min)',
      '7. Target specific trigger points if present',
      '8. End with integrative strokes and gentle movement'
    ],
    totalDuration: '20-30 minutes',
    frequency: '2-3 times per week for acute tension, weekly for maintenance',
    contraindications: [
      'Acute muscle strain or tear',
      'Bleeding disorders',
      'Recent muscle injury or surgery',
      'Severe muscle inflammation',
      'Skin conditions over treatment area',
      'Pregnancy (modify areas and pressure)'
    ],
    modifications: [
      {
        condition: 'Acute muscle tension',
        modification: 'Lighter pressure initially, shorter strokes, focus on circulation'
      },
      {
        condition: 'Chronic muscle tension',
        modification: 'Can use firmer pressure, longer sessions, include trigger point work'
      },
      {
        condition: 'Fibromyalgia',
        modification: 'Very gentle approach, shorter sessions, monitor for flare reactions'
      },
      {
        condition: 'Athletic tension',
        modification: 'Can use stronger techniques, include performance areas, coordinate with training'
      }
    ],
    postTreatmentCare: 'Gentle movement and stretching encouraged. Keep muscles warm. Avoid strenuous activity for 2-4 hours. Apply heat if comfortable. Stay well hydrated.',
    expectedShaMarking: 'Moderate to strong sha marks depending on tension level and stagnation. Darker marks indicate more fascial restriction. Should fade within 3-7 days.',
    clinicalNotes: 'Gua Sha for muscle tension works by breaking up fascial adhesions, improving tissue hydration, and reducing inflammation. The technique addresses both local restrictions and systemic fascial patterns. The scraping action stimulates mechanoreceptors and promotes healing response.',
    followUpGuidance: 'Monitor muscle tension and range of motion. Recommend specific stretches and movement patterns. Address postural and ergonomic factors. Consider massage or other bodywork as needed.'
  },

  {
    indicationId: 'hypertension',
    protocolName: 'Blood Pressure Regulation Gua Sha Protocol',
    primaryAreas: [
      {
        areaName: 'Upper Back Heart/Liver Area',
        anatomicalLocation: 'T5-T9 region, BL15 (Heart) and BL18 (Liver Shu)',
        scrapingDirection: 'Gentle downward strokes',
        pressure: 'light',
        strokeLength: '4-6 inches',
        duration: '5-8 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Very gentle approach for hypertension. Focus on heart and liver support.'
      },
      {
        areaName: 'Neck and Shoulders',
        anatomicalLocation: 'Upper trapezius, avoiding carotid area',
        scrapingDirection: 'Lateral strokes from neck to shoulders',
        pressure: 'light',
        strokeLength: '4-6 inches',
        duration: '3-5 minutes',
        toolType: 'smooth_edge',
        oilRequired: true,
        notes: 'Release neck tension that contributes to blood pressure elevation.'
      }
    ],
    secondaryAreas: [
      {
        areaName: 'Lower Back Kidney Area',
        condition: 'For kidney-related hypertension',
        technique: 'Gentle horizontal strokes over kidney Shu points',
        toolType: 'Smooth edge with light pressure'
      }
    ],
    treatmentSequence: [
      '1. Monitor blood pressure before treatment if possible',
      '2. Patient prone or seated, very comfortable and relaxed',
      '3. Apply oil with calming, slow movements',
      '4. Begin with gentle massage for relaxation',
      '5. Start upper back heart/liver area - very gentle strokes (5-8 min)',
      '6. Move to neck/shoulders - light lateral strokes (3-5 min)',
      '7. Add kidney support if indicated',
      '8. End with calming, integrative strokes'
    ],
    totalDuration: '15-25 minutes',
    frequency: '1-2 times per week, monitor blood pressure response',
    contraindications: [
      'Severe hypertension (>200/120) without medical supervision',
      'Recent stroke or TIA',
      'Severe cardiovascular disease',
      'Bleeding disorders or anticoagulants',
      'Carotid artery disease',
      'Pregnancy (modify approach)'
    ],
    modifications: [
      {
        condition: 'Mild hypertension',
        modification: 'Focus on relaxation and stress reduction, include lifestyle counseling'
      },
      {
        condition: 'Stress-induced hypertension',
        modification: 'Emphasize calming approach, include emotional support areas'
      },
      {
        condition: 'Elderly patients',
        modification: 'Extra gentle pressure, shorter sessions, monitor for dizziness'
      }
    ],
    postTreatmentCare: 'Rest in quiet environment for 15-30 minutes. Avoid sudden position changes. Stay hydrated. Monitor for dizziness. Practice relaxation techniques.',
    expectedShaMarking: 'Very light marking preferred for hypertension. Focus on circulation improvement rather than strong sha release. Light pink marks that fade within 1-3 days.',
    clinicalNotes: 'Gua Sha for hypertension works by promoting relaxation, improving circulation, and supporting liver and kidney function. The approach must be very gentle to avoid stimulating yang qi excessively. Always coordinate with medical management and monitor blood pressure response.',
    followUpGuidance: 'Monitor blood pressure regularly and coordinate with healthcare provider. Recommend stress management, appropriate exercise, and dietary modifications. Follow up weekly to assess response.'
  }
];

// Helper function to get Gua Sha protocol for specific indication
export const getGuaShaProtocol = (indicationId: string): GuaShaProtocol | undefined => {
  return guaShaProtocols.find(protocol => protocol.indicationId === indicationId);
};
