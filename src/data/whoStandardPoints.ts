// WHO Standard Acupuncture Point Locations - Authoritative Data
// Based on WHO Standard Acupuncture Point Locations in the Western Pacific Region

import { Point } from '../types';

// Key corrections based on WHO Standard data
export const whoStandardPoints: Point[] = [
  // Lung Meridian - WHO Standard Locations
  {
    id: 'LU1',
    meridianId: 'LU',
    nameEn: 'Zhongfu',
    namePinyin: 'Zhōng Fǔ',
    nameCharacters: '中府',
    category: 'standard',
    location: 'On the anterior thoracic region, at the same level as the first intercostal space, lateral to the infraclavicular fossa, 6 B-cun lateral to the anterior median line. 1 B-cun inferior to LU2.',
    indications: ['cough', 'asthma', 'chest_pain', 'shoulder_pain', 'fullness_in_chest'],
    contraindications: ['deep_needling'],
    acupressureDepth: 'Light to moderate pressure, 30-60 seconds',
    notes: 'Mu point of the Lung. Meeting point with Spleen meridian. Location based on WHO Standard Acupuncture Point Locations.'
  },
  {
    id: 'LU2',
    meridianId: 'LU',
    nameEn: 'Yunmen',
    namePinyin: 'Yún Mén',
    nameCharacters: '雲門',
    category: 'standard',
    location: 'On the anterior thoracic region, in the depression of the infraclavicular fossa, medial to the coracoid process of the scapula, 6 B-cun lateral to the anterior median line.',
    indications: ['cough', 'asthma', 'chest_pain', 'shoulder_pain'],
    contraindications: ['deep_needling'],
    acupressureDepth: 'Light pressure, 30-60 seconds',
    notes: 'Caution: close to lung apex. Located on the transverse line along the inferior border of the clavicle. WHO Standard location.'
  },
  {
    id: 'LU5',
    meridianId: 'LU',
    nameEn: 'Chize',
    namePinyin: 'Chǐ Zé',
    nameCharacters: '尺澤',
    category: 'standard',
    location: 'On the anterior aspect of the elbow, at the cubital crease, in the depression lateral to the biceps brachii tendon. Located at the cubital crease, between LI11 and PC3.',
    indications: ['cough', 'asthma', 'elbow_pain', 'fever', 'hypertension'],
    acupressureDepth: 'Moderate pressure, 1-2 minutes',
    notes: 'He-Sea point of the Lung meridian. WHO Standard location between LI11 and PC3.'
  },
  {
    id: 'LU9',
    meridianId: 'LU',
    nameEn: 'Taiyuan',
    namePinyin: 'Tài Yuān',
    nameCharacters: '太淵',
    category: 'standard',
    location: 'On the anterolateral aspect of the wrist, between the radial styloid process and the scaphoid bone, in the depression ulnar to the abductor pollicis longus tendon.',
    indications: ['cough', 'asthma', 'wrist_pain', 'palpitations', 'chest_pain'],
    acupressureDepth: 'Light pressure over pulse, 1-2 minutes',
    notes: 'Yuan-Source point and Shu-Stream point. Located over the radial artery. WHO Standard location.'
  },

  // Large Intestine - WHO Standard Corrections
  {
    id: 'LI4',
    meridianId: 'LI',
    nameEn: 'Hegu',
    namePinyin: 'Hé Gǔ',
    nameCharacters: '合谷',
    category: 'standard',
    location: 'On the dorsum of the hand, radial to the midpoint of the second metacarpal bone.',
    indications: ['headache', 'toothache', 'facial_pain', 'constipation', 'diarrhea', 'labor_induction'],
    contraindications: ['pregnancy'],
    acupressureDepth: 'Firm pressure toward 2nd metacarpal, 1-3 minutes',
    notes: 'Yuan-Source point. Four Gates point (with LV3). WHO Standard location - radial to midpoint of 2nd metacarpal.'
  },
  {
    id: 'LI5',
    meridianId: 'LI',
    nameEn: 'Yangxi',
    namePinyin: 'Yáng Xī',
    nameCharacters: '陽谿',
    category: 'standard',
    location: 'On the posterolateral aspect of the wrist, at the radial side of the dorsal wrist crease, distal to the radial styloid process, in the depression of the anatomical snuffbox.',
    indications: ['wrist_pain', 'headache', 'toothache', 'tinnitus'],
    acupressureDepth: 'Light to moderate pressure, 1-2 minutes',
    notes: 'Jing-River point. WHO Standard location in anatomical snuffbox between extensor pollicis tendons.'
  },
  {
    id: 'LI11',
    meridianId: 'LI',
    nameEn: 'Quchi',
    namePinyin: 'Qū Chí',
    nameCharacters: '曲池',
    category: 'standard',
    location: 'On the lateral aspect of the elbow, at the midpoint of the line connecting LU5 with the lateral epicondyle of the humerus. Located in the depression on the lateral end of the cubital crease.',
    indications: ['fever', 'hypertension', 'skin_conditions', 'elbow_pain', 'arm_pain', 'hemiplegia'],
    acupressureDepth: 'Moderate to firm pressure, 1-3 minutes',
    notes: 'He-Sea point. WHO Standard location - midpoint between LU5 and lateral epicondyle.'
  },
  {
    id: 'LI15',
    meridianId: 'LI',
    nameEn: 'Jianyu',
    namePinyin: 'Jiān Yú',
    nameCharacters: '肩髃',
    category: 'standard',
    location: 'On the shoulder girdle, in the depression between the anterior end of lateral border of the acromion and the greater tubercle of the humerus.',
    indications: ['shoulder_pain', 'arm_pain', 'hemiplegia', 'hypertension'],
    acupressureDepth: 'Moderate to firm pressure, 1-3 minutes',
    notes: 'Master point for shoulder disorders. WHO Standard location - anterior depression to acromion.'
  },

  // Stomach Meridian - WHO Standard Locations
  {
    id: 'ST8',
    meridianId: 'ST',
    nameEn: 'Touwei',
    namePinyin: 'Tóu Wéi',
    nameCharacters: '头维',
    category: 'standard',
    location: 'On the head, 0.5 B-cun directly superior to the anterior hairline at the corner of the forehead, 4.5 B-cun lateral to the anterior median line.',
    indications: ['headache', 'dizziness', 'eye_problems', 'mental_disorders'],
    acupressureDepth: 'Light to moderate pressure, 1-2 minutes',
    notes: 'Meeting point with Gall Bladder meridian. WHO Standard location at forehead corner.'
  },
  {
    id: 'ST34',
    meridianId: 'ST',
    nameEn: 'Liangqiu',
    namePinyin: 'Liáng Qiū',
    nameCharacters: '梁丘',
    category: 'standard',
    location: 'On the anterolateral aspect of the thigh, between the vastus lateralis muscle and the lateral border of the rectus femoris tendon, 2 B-cun superior to the base of the patella.',
    indications: ['knee_pain', 'gastritis', 'mastitis', 'acute_stomach_pain'],
    acupressureDepth: 'Moderate pressure, 1-2 minutes',
    notes: 'Xi-Cleft point of Stomach. WHO Standard location between vastus lateralis and rectus femoris.'
  },
  {
    id: 'ST35',
    meridianId: 'ST',
    nameEn: 'Dubi',
    namePinyin: 'Dú Bí',
    nameCharacters: '犊鼻',
    category: 'standard',
    location: 'On the anterior aspect of the knee, in the depression lateral to the patellar ligament.',
    indications: ['knee_pain', 'leg_weakness', 'beriberi'],
    acupressureDepth: 'Moderate pressure, 1-2 minutes',
    notes: 'Local point for knee disorders. WHO Standard location lateral to patellar ligament.'
  },
  {
    id: 'ST41',
    meridianId: 'ST',
    nameEn: 'Jiexi',
    namePinyin: 'Jiě Xī',
    nameCharacters: '解溪',
    category: 'standard',
    location: 'On the anterior aspect of the ankle, in the depression at the centre of the front surface of the ankle joint, between the tendons of extensor hallucis longus and extensor digitorum longus.',
    indications: ['ankle_pain', 'headache', 'dizziness', 'mental_disorders'],
    acupressureDepth: 'Moderate pressure, 1-2 minutes',
    notes: 'Jing-River point. WHO Standard location between extensor tendons at ankle center.'
  },

  // Spleen Meridian - WHO Standard Locations
  {
    id: 'SP3',
    meridianId: 'SP',
    nameEn: 'Taibai',
    namePinyin: 'Tài Bái',
    nameCharacters: '太白',
    category: 'standard',
    location: 'On the medial aspect of the foot, in the depression proximal to the first metatarsophalangeal joint, at the border between the red and white flesh.',
    indications: ['digestive_disorders', 'abdominal_pain', 'diarrhea', 'vomiting'],
    acupressureDepth: 'Moderate pressure, 1-2 minutes',
    notes: 'Yuan-Source and Shu-Stream point of Spleen. WHO Standard location at red-white flesh border.'
  },
  {
    id: 'SP4',
    meridianId: 'SP',
    nameEn: 'Gongsun',
    namePinyin: 'Gōng Sūn',
    nameCharacters: '公孫',
    category: 'standard',
    location: 'On the medial aspect of the foot, anteroinferior to the base of the first metatarsal bone, at the border between the red and white flesh.',
    indications: ['digestive_disorders', 'abdominal_pain', 'diarrhea', 'vomiting', 'cardiac_pain'],
    acupressureDepth: 'Moderate pressure, 1-3 minutes',
    notes: 'Luo-Connecting point. Master point of Chong Mai. WHO Standard location at first metatarsal base.'
  },
  {
    id: 'SP6',
    meridianId: 'SP',
    nameEn: 'Sanyinjiao',
    namePinyin: 'Sān Yīn Jiāo',
    nameCharacters: '三陰交',
    category: 'standard',
    location: 'On the tibial aspect of the leg, posterior to the medial border of the tibia, 3 B-cun superior to the prominence of the medial malleolus.',
    indications: ['gynecological_disorders', 'digestive_disorders', 'insomnia', 'hypertension', 'diabetes'],
    contraindications: ['pregnancy'],
    acupressureDepth: 'Moderate to firm pressure, 1-3 minutes',
    notes: 'Meeting point of Spleen, Liver, and Kidney meridians. WHO Standard location 3 B-cun above medial malleolus.'
  },
  {
    id: 'SP9',
    meridianId: 'SP',
    nameEn: 'Yinlingquan',
    namePinyin: 'Yīn Líng Quán',
    nameCharacters: '陰陵泉',
    category: 'standard',
    location: 'On the tibial aspect of the leg, in the depression between the inferior border of the medial condyle of the tibia and the medial border of the tibia.',
    indications: ['water_retention', 'urinary_disorders', 'knee_pain', 'digestive_disorders'],
    acupressureDepth: 'Moderate to firm pressure, 2-3 minutes',
    notes: 'He-Sea point. WHO Standard location at tibial condyle depression.'
  },

  // Bladder Meridian - WHO Standard Locations
  {
    id: 'BL60',
    meridianId: 'BL',
    nameEn: 'Kunlun',
    namePinyin: 'Kūn Lún',
    nameCharacters: '崑崙',
    category: 'standard',
    location: 'On the posterolateral aspect of the ankle, in the depression between the prominence of the lateral malleolus and the calcaneal tendon.',
    indications: ['headache', 'neck_stiffness', 'back_pain', 'ankle_pain'],
    contraindications: ['pregnancy'],
    acupressureDepth: 'Moderate pressure, 1-2 minutes',
    notes: 'Jing-River point. WHO Standard location between lateral malleolus and Achilles tendon.'
  },
  {
    id: 'BL67',
    meridianId: 'BL',
    nameEn: 'Zhiyin',
    namePinyin: 'Zhì Yīn',
    nameCharacters: '至陰',
    category: 'standard',
    location: 'On the little toe, lateral to the distal phalanx, 0.1 f-cun proximal to the lateral corner of the toenail; at the intersection of the vertical line of the lateral side of the nail and the horizontal line of the base of the toenail.',
    indications: ['breech_presentation', 'headache', 'nasal_congestion', 'difficult_labor'],
    acupressureDepth: 'Light pressure with fingernail, 30-60 seconds',
    notes: 'Jing-Well point. Famous for turning breech babies. WHO Standard precise nail location.'
  },

  // Kidney Meridian - WHO Standard Locations
  {
    id: 'KI1',
    meridianId: 'KI',
    nameEn: 'Yongquan',
    namePinyin: 'Yǒng Quán',
    nameCharacters: '湧泉',
    category: 'standard',
    location: 'On the sole of the foot, in the deepest depression of the sole when the toes are flexed. Located approximately in the depression at the junction of the anterior one third and the posterior two thirds of the line connecting the heel with the web margin between the bases of the second and third toes.',
    indications: ['insomnia', 'hypertension', 'headache', 'dizziness', 'hot_flashes', 'mental_disorders'],
    acupressureDepth: 'Firm pressure, 1-3 minutes',
    notes: 'Jing-Well point. WHO Standard location - anterior 1/3 and posterior 2/3 junction of sole.'
  },
  {
    id: 'KI3',
    meridianId: 'KI',
    nameEn: 'Taixi',
    namePinyin: 'Tài Xī',
    nameCharacters: '太谿',
    category: 'standard',
    location: 'On the posteromedial aspect of the ankle, in the depression between the prominence of the medial malleolus and the calcaneal tendon.',
    indications: ['kidney_disorders', 'back_pain', 'tinnitus', 'impotence', 'chronic_fatigue', 'diabetes'],
    acupressureDepth: 'Moderate pressure, 1-3 minutes',
    notes: 'Yuan-Source point. Master tonification point for Kidney deficiency. WHO Standard location.'
  },
  {
    id: 'KI6',
    meridianId: 'KI',
    nameEn: 'Zhaohai',
    namePinyin: 'Zhào Hǎi',
    nameCharacters: '照海',
    category: 'standard',
    location: 'On the medial aspect of the foot, 1 B-cun inferior to the prominence of the medial malleolus, in the depression inferior to the medial malleolus.',
    indications: ['insomnia', 'sore_throat', 'irregular_menstruation', 'epilepsy'],
    acupressureDepth: 'Moderate pressure, 1-2 minutes',
    notes: 'Master point of Yin Qiao Mai. Corresponding point to BL62. WHO Standard location.'
  },

  // Gall Bladder - WHO Standard Locations
  {
    id: 'GB9',
    meridianId: 'GB',
    nameEn: 'Tianchong',
    namePinyin: 'Tiān Chōng',
    nameCharacters: '天冲',
    category: 'standard',
    location: 'On the head, directly superior to the posterior border of the auricular root, 2 B-cun superior to the hairline.',
    indications: ['headache', 'dizziness', 'epilepsy', 'mental_disorders'],
    acupressureDepth: 'Light pressure, 1-2 minutes',
    notes: 'WHO Standard location 2 B-cun above hairline, superior to ear root.'
  },
  {
    id: 'GB12',
    meridianId: 'GB',
    nameEn: 'Wangu',
    namePinyin: 'Wán Gǔ',
    nameCharacters: '完骨',
    category: 'standard',
    location: 'In the anterior region of the neck, in the depression posteroinferior to the mastoid process.',
    indications: ['headache', 'neck_stiffness', 'tinnitus', 'insomnia'],
    acupressureDepth: 'Moderate pressure, 1-2 minutes',
    notes: 'WHO Standard location posteroinferior to mastoid process.'
  },
  {
    id: 'GB20',
    meridianId: 'GB',
    nameEn: 'Fengchi',
    namePinyin: 'Fēng Chí',
    nameCharacters: '風池',
    category: 'standard',
    location: 'In the anterior region of the neck, inferior to the occipital bone, in the depression between the origins of sternocleidomastoid and the trapezius muscles.',
    indications: ['headache', 'neck_stiffness', 'dizziness', 'hypertension', 'common_cold', 'eye_problems'],
    acupressureDepth: 'Moderate pressure directed toward opposite eye, 1-3 minutes',
    notes: 'Meeting point with Yang Wei Mai. WHO Standard location between SCM and trapezius origins.'
  },

  // Governing Vessel - WHO Standard Location
  {
    id: 'GV20',
    meridianId: 'DU',
    nameEn: 'Baihui',
    namePinyin: 'Bǎi Huì',
    nameCharacters: '百會',
    category: 'extraordinary',
    location: 'On the head, 5 B-cun superior to the anterior hairline on the anterior median line.',
    indications: ['headache', 'dizziness', 'mental_disorders', 'memory_problems', 'prolapse', 'hypertension'],
    acupressureDepth: 'Light to moderate pressure, 1-3 minutes',
    notes: 'Meeting point of all Yang meridians. WHO Standard location - 5 B-cun above anterior hairline on midline.'
  }
];

// Function to validate and update existing points against WHO standards
export const validatePointAgainstWHO = (existingPoint: Point): Point => {
  const whoPoint = whoStandardPoints.find(wp => wp.id === existingPoint.id);
  
  if (whoPoint) {
    // Update with WHO standard data while preserving additional clinical information
    return {
      ...existingPoint,
      location: whoPoint.location, // Use WHO standard location
      nameCharacters: whoPoint.nameCharacters || existingPoint.nameCharacters,
      notes: `${whoPoint.notes} ${existingPoint.notes || ''}`.trim()
    };
  }
  
  return existingPoint;
};
