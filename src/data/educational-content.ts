// Educational Content - Quizzes and Learning Modules
// Comprehensive learning system for TCM knowledge

import { Quiz, LearningModule } from '../types/education';

export const pointLocationQuizzes: Quiz[] = [
  {
    id: 'basic_points_quiz',
    title: 'Essential Acupuncture Points',
    description: 'Test your knowledge of the most commonly used acupuncture points',
    category: 'points',
    difficulty: 'beginner',
    passingScore: 80,
    tags: ['points', 'location', 'basic'],
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'li4_location',
        type: 'multiple_choice',
        question: 'Where is LI4 (Hegu) located?',
        options: [
          'Between thumb and index finger',
          'On the dorsum of hand, radial to midpoint of 2nd metacarpal',
          'On the palm side of the hand',
          'At the wrist crease'
        ],
        correctAnswer: '1',
        explanation: 'LI4 Hegu is located on the dorsum of the hand, radial to the midpoint of the second metacarpal bone. This is the WHO standard location.',
        points: 10,
        references: ['WHO Standard Acupuncture Point Locations']
      },
      {
        id: 'gv20_function',
        type: 'multiple_choice',
        question: 'What is the primary function of GV20 (Baihui)?',
        options: [
          'Digestive disorders',
          'Respiratory problems',
          'Mental clarity and headaches',
          'Joint pain'
        ],
        correctAnswer: '2',
        explanation: 'GV20 Baihui is the meeting point of all Yang meridians and is primarily used for mental disorders, headaches, dizziness, and improving mental clarity.',
        points: 10,
        references: ['Classical TCM Theory']
      },
      {
        id: 'sp6_contraindication',
        type: 'true_false',
        question: 'SP6 (Sanyinjiao) is safe to use during pregnancy.',
        correctAnswer: 'false',
        explanation: 'SP6 is contraindicated during pregnancy as it can induce labor. It is one of the forbidden points during pregnancy along with LI4, BL60, and BL67.',
        points: 15,
        references: ['Clinical Safety Guidelines']
      },
      {
        id: 'ki3_classification',
        type: 'multiple_choice',
        question: 'What type of point is KI3 (Taixi)?',
        options: [
          'He-Sea point',
          'Yuan-Source point',
          'Luo-Connecting point',
          'Xi-Cleft point'
        ],
        correctAnswer: '1',
        explanation: 'KI3 Taixi is the Yuan-Source point of the Kidney meridian, making it the primary tonification point for Kidney deficiency.',
        points: 10,
        references: ['Five Element Theory', 'Point Classifications']
      }
    ]
  },
  {
    id: 'safety_quiz',
    title: 'Clinical Safety & Contraindications',
    description: 'Essential safety knowledge for clinical practice',
    category: 'safety',
    difficulty: 'intermediate',
    passingScore: 90,
    tags: ['safety', 'contraindications', 'clinical'],
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'pregnancy_points',
        type: 'multiple_choice',
        question: 'Which points should be avoided during pregnancy?',
        options: [
          'LI4, SP6, BL60, BL67',
          'ST36, LV3, GB34',
          'LU9, HT7, PC6',
          'GV20, EX-HN3, GB20'
        ],
        correctAnswer: '0',
        explanation: 'The four main points to avoid during pregnancy are LI4, SP6, BL60, and BL67 as they can potentially induce labor.',
        points: 20,
        references: ['Clinical Safety Guidelines', 'Pregnancy Protocols']
      },
      {
        id: 'cupping_contraindications',
        type: 'fill_blank',
        question: 'Cupping therapy should be avoided in patients taking _____ medications.',
        correctAnswer: 'blood thinning',
        explanation: 'Blood thinning medications (anticoagulants) increase bleeding risk, making cupping therapy contraindicated.',
        points: 15,
        references: ['Cupping Safety Guidelines']
      }
    ]
  }
];

export const learningModules: LearningModule[] = [
  {
    id: 'five_element_basics',
    title: 'Five Element Theory Fundamentals',
    description: 'Comprehensive introduction to Five Element theory and its clinical applications',
    category: 'theory',
    difficulty: 'beginner',
    estimatedDuration: 45,
    tags: ['theory', 'five-elements', 'tcm'],
    createdAt: new Date().toISOString(),
    sections: [
      {
        id: 'five_elements_intro',
        title: 'Introduction to Five Elements',
        content: `The Five Element theory (Wu Xing) is one of the fundamental theories of Traditional Chinese Medicine. It describes the relationship between five natural elements and their correspondences in the human body.

The Five Elements are:
• Wood (木) - Associated with Liver and Gall Bladder
• Fire (火) - Associated with Heart and Small Intestine  
• Earth (土) - Associated with Spleen and Stomach
• Metal (金) - Associated with Lung and Large Intestine
• Water (水) - Associated with Kidney and Bladder

Each element has specific characteristics, emotions, seasons, and clinical applications that guide treatment selection.`,
        type: 'text',
        duration: 10,
        resources: [
          {
            id: 'five_elements_chart',
            type: 'image',
            title: 'Five Element Correspondences Chart',
            url: '/images/five-elements-chart.png',
            description: 'Visual representation of Five Element correspondences'
          }
        ]
      },
      {
        id: 'element_cycles',
        title: 'Generation and Control Cycles',
        content: `The Five Elements interact through two main cycles:

Generation Cycle (Sheng Cycle):
Wood feeds Fire → Fire creates Earth (ash) → Earth contains Metal → Metal collects Water → Water nourishes Wood

Control Cycle (Ke Cycle):
Wood depletes Earth → Earth absorbs Water → Water extinguishes Fire → Fire melts Metal → Metal cuts Wood

Understanding these cycles helps practitioners identify patterns of disharmony and select appropriate treatment strategies.`,
        type: 'interactive',
        duration: 15
      },
      {
        id: 'clinical_applications',
        title: 'Clinical Applications',
        content: `Five Element theory guides treatment in several ways:

1. Constitutional Assessment - Identify patient's primary element
2. Symptom Patterns - Match symptoms to element imbalances
3. Point Selection - Choose points that support or control specific elements
4. Treatment Timing - Consider seasonal influences
5. Emotional Patterns - Address emotional aspects of illness

Example: A patient with chronic fatigue, digestive issues, and worry would suggest Earth element (Spleen) deficiency, indicating treatment of Spleen/Stomach meridian points.`,
        type: 'text',
        duration: 20
      }
    ]
  },
  {
    id: 'point_location_mastery',
    title: 'WHO Standard Point Location Mastery',
    description: 'Master precise point location using WHO standard anatomical landmarks',
    category: 'points',
    difficulty: 'intermediate',
    estimatedDuration: 60,
    prerequisites: ['five_element_basics'],
    tags: ['points', 'who-standards', 'anatomy'],
    createdAt: new Date().toISOString(),
    sections: [
      {
        id: 'anatomical_landmarks',
        title: 'Anatomical Landmark Method',
        content: `The WHO Standard emphasizes anatomical landmarks for precise point location:

Fixed Landmarks:
• Bony prominences (malleoli, epicondyles)
• Joint spaces and creases
• Muscle borders and tendons
• Natural depressions

Movable Landmarks:
• Depressions that appear with movement
• Muscle contractions
• Joint flexion points

Proportional Measurements (B-cun):
• Body cun based on patient's own proportions
• Standardized measurements between landmarks
• Finger cun for verification`,
        type: 'text',
        duration: 20
      },
      {
        id: 'location_practice',
        title: 'Interactive Point Location Practice',
        content: 'Practice locating points using the body map with immediate feedback on accuracy.',
        type: 'practice',
        duration: 40
      }
    ],
    quiz: {
      id: 'point_location_quiz',
      title: 'Point Location Assessment',
      description: 'Test your WHO standard point location knowledge',
      category: 'points',
      difficulty: 'intermediate',
      passingScore: 85,
      tags: ['assessment'],
      createdAt: new Date().toISOString(),
      questions: [] // Would be populated with location questions
    }
  }
];

export const studyPlans = [
  {
    id: 'beginner_tcm_path',
    title: 'Beginner TCM Practitioner Path',
    description: 'Complete learning path for new TCM practitioners',
    modules: ['five_element_basics', 'point_location_mastery'],
    estimatedWeeks: 8,
    dailyStudyTime: 30
  },
  {
    id: 'safety_certification',
    title: 'Clinical Safety Certification',
    description: 'Comprehensive safety training for all modalities',
    modules: ['safety_fundamentals', 'contraindications_mastery'],
    estimatedWeeks: 4,
    dailyStudyTime: 20
  }
];
