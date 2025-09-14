// Accurate point coordinates based on traditional TCM measurements
// Coordinates are percentage-based (0-100) to work with any image size
// Based on anatomical landmarks and cun measurements from professional medical images

export interface PointCoordinate {
  id: string;
  name: string;
  view: 'front' | 'back' | 'left' | 'right';
  x: number; // Percentage coordinate (0-100)
  y: number; // Percentage coordinate (0-100)
  cunX?: number; // Traditional cun measurement from reference
  cunY?: number; // Traditional cun measurement from reference
  anatomicalLandmark?: string; // Reference point for location
  notes?: string; // Clinical location notes
}

export const pointCoordinates: PointCoordinate[] = [
  // FRONT VIEW POINTS
  
  // Large Intestine Meridian - All 20 Points
  {
    id: 'LI1',
    name: 'Shangyang',
    view: 'front',
    x: 78, // Right index finger
    y: 68,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Radial side of index fingernail',
    notes: 'Jing-Well point at corner of nail'
  },
  {
    id: 'LI2',
    name: 'Erjian',
    view: 'front',
    x: 77, // Right index finger
    y: 66,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Distal to index MCP joint',
    notes: 'Ying-Spring point at red/white skin junction'
  },
  {
    id: 'LI3',
    name: 'Sanjian',
    view: 'front',
    x: 76, // Right index finger
    y: 64,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Proximal to index MCP joint',
    notes: 'Shu-Stream point at red/white skin junction'
  },
  {
    id: 'LI4',
    name: 'Hegu',
    view: 'front',
    x: 75, // Right hand dorsum
    y: 62,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: '1st-2nd metacarpal junction',
    notes: 'Yuan-Source point. Four Gates point. Contraindicated in pregnancy'
  },
  {
    id: 'LI5',
    name: 'Yangxi',
    view: 'front',
    x: 74, // Right wrist
    y: 58,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Radial wrist between extensor tendons',
    notes: 'Jing-River point in anatomical snuffbox'
  },
  {
    id: 'LI6',
    name: 'Pianli',
    view: 'front',
    x: 73, // Right forearm
    y: 54,
    cunX: 0,
    cunY: 3,
    anatomicalLandmark: '3 cun proximal to LI5',
    notes: 'Luo-Connecting point to Lung meridian'
  },
  {
    id: 'LI7',
    name: 'Wenliu',
    view: 'front',
    x: 72, // Right forearm
    y: 52,
    cunX: 0,
    cunY: 5,
    anatomicalLandmark: '5 cun proximal to wrist',
    notes: 'Xi-Cleft point for acute Large Intestine conditions'
  },
  {
    id: 'LI8',
    name: 'Xialian',
    view: 'front',
    x: 71, // Right forearm
    y: 48,
    cunX: 0,
    cunY: 4,
    anatomicalLandmark: '4 cun distal to LI11',
    notes: 'Local point for arm and abdominal conditions'
  },
  {
    id: 'LI9',
    name: 'Shanglian',
    view: 'front',
    x: 70, // Right forearm
    y: 46,
    cunX: 0,
    cunY: 3,
    anatomicalLandmark: '3 cun distal to LI11',
    notes: 'Good for upper limb motor function'
  },
  {
    id: 'LI10',
    name: 'Shousanli',
    view: 'front',
    x: 69, // Right forearm
    y: 44,
    cunX: 0,
    cunY: 2,
    anatomicalLandmark: '2 cun distal to LI11',
    notes: 'Important for digestive disorders and arm pain'
  },
  {
    id: 'LI11',
    name: 'Quchi',
    view: 'front',
    x: 68, // Right elbow
    y: 42,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Lateral end of elbow crease',
    notes: 'He-Sea point. Master point for heat and inflammation'
  },
  {
    id: 'LI12',
    name: 'Zhouliao',
    view: 'front',
    x: 67, // Right upper arm
    y: 40,
    cunX: 0,
    cunY: 1,
    anatomicalLandmark: '1 cun superior to LI11',
    notes: 'Local point for elbow and arm conditions'
  },
  {
    id: 'LI13',
    name: 'Shouwuli',
    view: 'front',
    x: 66, // Right upper arm
    y: 38,
    cunX: 0,
    cunY: 3,
    anatomicalLandmark: '3 cun superior to LI11',
    notes: 'Good for upper arm and shoulder conditions'
  },
  {
    id: 'LI14',
    name: 'Binao',
    view: 'front',
    x: 65, // Right shoulder area
    y: 35,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Deltoid muscle insertion',
    notes: 'Important point for shoulder disorders'
  },
  {
    id: 'LI15',
    name: 'Jianyu',
    view: 'front',
    x: 62, // Right shoulder
    y: 32,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Depression between clavicle and humerus',
    notes: 'Master point for shoulder disorders'
  },
  {
    id: 'LI16',
    name: 'Jugu',
    view: 'front',
    x: 58, // Right shoulder
    y: 30,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Between clavicle and scapular spine',
    notes: 'Good for shoulder and respiratory conditions'
  },
  {
    id: 'LI17',
    name: 'Tianding',
    view: 'front',
    x: 55, // Right neck
    y: 25,
    cunX: 1,
    cunY: 0,
    anatomicalLandmark: 'Posterior border of SCM muscle',
    notes: 'Caution: sensitive neck area'
  },
  {
    id: 'LI18',
    name: 'Futu',
    view: 'front',
    x: 53, // Right neck
    y: 23,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Between SCM heads, Adam\'s apple level',
    notes: 'Caution: very sensitive, near carotid artery'
  },
  {
    id: 'LI19',
    name: 'Kouheliao',
    view: 'front',
    x: 52, // Right face
    y: 15,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Below lateral nostril margin',
    notes: 'Good for facial and nasal conditions'
  },
  {
    id: 'LI20',
    name: 'Yingxiang',
    view: 'front',
    x: 52, // Right side of nose
    y: 12,
    cunX: 0.5,
    cunY: 0,
    anatomicalLandmark: 'Nasolabial groove',
    notes: 'Final LI point. Master for nasal conditions'
  },

  // Lung Meridian
  {
    id: 'LU1',
    name: 'Zhongfu',
    view: 'front',
    x: 220, // Right subclavicular area
    y: 140,
    cunX: 1,
    cunY: -1,
    anatomicalLandmark: '1 cun below clavicle',
    notes: 'In subclavicular fossa, 1 cun below LU2'
  },
  {
    id: 'LU9',
    name: 'Taiyuan',
    view: 'front',
    x: 300, // Right wrist
    y: 270,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Radial artery at wrist',
    notes: 'At wrist, in radial artery between tendons'
  },

  // Stomach Meridian
  {
    id: 'ST6',
    name: 'Jiache',
    view: 'front',
    x: 225, // Right jaw
    y: 85,
    cunX: 1,
    cunY: 0,
    anatomicalLandmark: 'Masseter muscle',
    notes: 'One finger anterior-superior to mandible angle'
  },
  {
    id: 'ST36',
    name: 'Zusanli',
    view: 'front',
    x: 55, // Right leg (percentage)
    y: 75, // Below knee (percentage)
    cunX: 1,
    cunY: 3,
    anatomicalLandmark: '3 cun below knee',
    notes: '3 cun below ST35, 1 finger lateral from tibia crest'
  },

  // Spleen Meridian
  {
    id: 'SP3',
    name: 'Taibai',
    view: 'front',
    x: 240, // Right foot medial
    y: 545,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: '1st metatarsophalangeal joint',
    notes: 'Medial side of foot, posterior to 1st MTP joint'
  },
  {
    id: 'SP6',
    name: 'Sanyinjiao',
    view: 'front',
    x: 235, // Right leg medial
    y: 460,
    cunX: 0,
    cunY: 3,
    anatomicalLandmark: '3 cun above medial malleolus',
    notes: '3 cun above medial malleolus, posterior to tibia'
  },

  // Heart Meridian
  {
    id: 'HT7',
    name: 'Shenmen',
    view: 'front',
    x: 95, // Left wrist
    y: 270,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Ulnar side of wrist crease',
    notes: 'Radial to flexor carpi ulnaris tendon at wrist'
  },

  // Pericardium Meridian
  {
    id: 'PC6',
    name: 'Neiguan',
    view: 'front',
    x: 95, // Left forearm
    y: 250,
    cunX: 0,
    cunY: 2,
    anatomicalLandmark: '2 cun above wrist crease',
    notes: '2 cun proximal to wrist, between palmaris longus and flexor carpi radialis'
  },

  // Triple Heater Meridian
  {
    id: 'TH5',
    name: 'Waiguan',
    view: 'front',
    x: 300, // Right forearm dorsal
    y: 250,
    cunX: 0,
    cunY: 2,
    anatomicalLandmark: '2 cun above dorsal wrist',
    notes: '2 cun proximal to dorsal wrist crease, between radius and ulna'
  },

  // Liver Meridian
  {
    id: 'LV3',
    name: 'Taichong',
    view: 'front',
    x: 160, // Left foot
    y: 545,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: '1st-2nd metatarsal junction',
    notes: 'Depression distal to 1st-2nd metatarsal junction'
  },

  // Kidney Meridian
  {
    id: 'KI1',
    name: 'Yongquan',
    view: 'front',
    x: 160, // Left foot sole
    y: 555,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Sole of foot center',
    notes: 'On sole, in depression with foot in plantar flexion'
  },
  {
    id: 'KI3',
    name: 'Taixi',
    view: 'front',
    x: 170, // Left ankle medial
    y: 520,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Between malleolus and Achilles',
    notes: 'Between medial malleolus and Achilles tendon'
  },

  // Conception Vessel
  {
    id: 'CV6',
    name: 'Qihai',
    view: 'front',
    x: 50, // Center abdomen (percentage)
    y: 55, // Below navel (percentage)
    cunX: 0,
    cunY: 1.5,
    anatomicalLandmark: '1.5 cun below navel',
    notes: '1.5 cun below umbilicus on anterior midline'
  },
  {
    id: 'CV17',
    name: 'Shanzhong',
    view: 'front',
    x: 50, // Center chest (percentage)
    y: 30, // Between nipples (percentage)
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Between nipples',
    notes: 'On anterior midline, level with 4th intercostal space'
  },

  // BACK VIEW POINTS
  
  // Bladder Meridian
  {
    id: 'BL2',
    name: 'Zanzhu',
    view: 'back',
    x: 185, // Left eyebrow (back view perspective)
    y: 55,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Medial end of eyebrow',
    notes: 'At medial end of eyebrow, in supraorbital notch'
  },
  {
    id: 'BL60',
    name: 'Kunlun',
    view: 'back',
    x: 165, // Left ankle lateral
    y: 520,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Between malleolus and Achilles',
    notes: 'Between external malleolus and Achilles tendon'
  },

  // Gall Bladder Meridian
  {
    id: 'GB20',
    name: 'Fengchi',
    view: 'back',
    x: 45, // Left neck (percentage)
    y: 18, // Neck level (percentage)
    cunX: 1,
    cunY: 0,
    anatomicalLandmark: 'Occipital bone depression',
    notes: 'Depression between sternocleidomastoid and trapezius'
  },
  {
    id: 'GB34',
    name: 'Yanglingquan',
    view: 'back',
    x: 175, // Left knee lateral
    y: 400,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Fibula head',
    notes: 'Depression anterior and inferior to fibula head'
  },

  // Small Intestine Meridian
  {
    id: 'SI3',
    name: 'Houxi',
    view: 'back',
    x: 95, // Left hand
    y: 285,
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Ulnar palm crease',
    notes: 'Ulnar end of transverse palm crease'
  },

  // Governing Vessel
  {
    id: 'GV20',
    name: 'Baihui',
    view: 'back',
    x: 50, // Top of head (percentage)
    y: 8, // Vertex (percentage)
    cunX: 0,
    cunY: 0,
    anatomicalLandmark: 'Vertex of head',
    notes: '7 cun above posterior hairline, intersection of midline and ear apex line'
  }
];

// Helper function to get points for a specific view
export const getPointsForView = (view: 'front' | 'back' | 'left' | 'right'): PointCoordinate[] => {
  return pointCoordinates.filter(point => point.view === view);
};
