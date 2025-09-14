import { useState } from 'react';
import { Book, Compass, Target, Zap, Heart, Brain } from 'lucide-react';
import FiveElementTheory from '../components/FiveElementTheory';

const TCMTheory = () => {
  const [selectedTheory, setSelectedTheory] = useState('five_elements');

  const theories = [
    {
      id: 'five_elements',
      name: 'Five Element Theory',
      icon: Compass,
      description: 'Understanding meridian relationships through elemental correspondences'
    },
    {
      id: 'point_classifications',
      name: 'Point Classifications',
      icon: Target,
      description: 'Traditional point categories and their therapeutic applications'
    },
    {
      id: 'qi_theory',
      name: 'Qi & Energy Flow',
      icon: Zap,
      description: 'Understanding qi circulation and meridian pathways'
    },
    {
      id: 'zang_fu',
      name: 'Zang-Fu Theory',
      icon: Heart,
      description: 'Organ systems and their energetic functions'
    },
    {
      id: 'diagnostic_methods',
      name: 'TCM Diagnostics',
      icon: Brain,
      description: 'Traditional diagnostic methods and pattern recognition'
    }
  ];

  const pointClassifications = [
    {
      category: 'Five Transport Points',
      points: [
        { name: 'Jing-Well', description: 'Located at fingertips/toes, good for mental disorders and revival', example: 'LI1, LU11' },
        { name: 'Ying-Spring', description: 'Located at metacarpal/metatarsal areas, good for heat conditions', example: 'LI2, LU10' },
        { name: 'Shu-Stream', description: 'Located at wrists/ankles, good for body heaviness and joint pain', example: 'LI3, LU9' },
        { name: 'Jing-River', description: 'Located at forearms/lower legs, good for cough and fever', example: 'LI5, LU8' },
        { name: 'He-Sea', description: 'Located at elbows/knees, good for organ disorders', example: 'LI11, LU5' }
      ]
    },
    {
      category: 'Special Points',
      points: [
        { name: 'Yuan-Source', description: 'Store original qi of organs, used for tonification', example: 'LI4, LU9, ST42' },
        { name: 'Luo-Connecting', description: 'Connect paired meridians, treat both meridians', example: 'LI6, LU7, PC6' },
        { name: 'Xi-Cleft', description: 'Acute conditions and emergency treatments', example: 'LI7, LU6, SP8' },
        { name: 'Back-Shu', description: 'Tonify organ qi, located on back bladder meridian', example: 'BL13, BL15, BL18' },
        { name: 'Front-Mu', description: 'Regulate organ qi, located on chest/abdomen', example: 'LU1, LV14, CV17' }
      ]
    },
    {
      category: 'Master Points',
      points: [
        { name: 'Four Gates', description: 'LI4 + LV3 for moving qi and calming spirit', example: 'LI4, LV3' },
        { name: 'Four Command', description: 'Classical points for major body regions', example: 'LI4, LV3, LU7, ST36' },
        { name: 'Eight Confluent', description: 'Master points of extraordinary vessels', example: 'PC6, TH5, SP4, LU7' }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">TCM Theory & Classifications</h1>
        <p className="text-gray-600">Deepen your understanding of Traditional Chinese Medicine principles</p>
      </div>

      {/* Theory Navigation */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {theories.map((theory) => {
            const Icon = theory.icon;
            return (
              <button
                key={theory.id}
                onClick={() => setSelectedTheory(theory.id)}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  selectedTheory === theory.id
                    ? 'bg-tcm-accent text-white border-tcm-accent'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-tcm-accent hover:text-tcm-accent'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {theory.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Theory Content */}
      <div className="space-y-6">
        {selectedTheory === 'five_elements' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Five Element Theory</h2>
            <FiveElementTheory 
              selectedElement="wood"
              showDetails={true}
            />
          </div>
        )}

        {selectedTheory === 'point_classifications' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Point Classifications</h2>
            
            <div className="space-y-8">
              {pointClassifications.map((classification) => (
                <div key={classification.category}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 text-tcm-accent mr-2" />
                    {classification.category}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classification.points.map((point) => (
                      <div key={point.name} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{point.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{point.description}</p>
                        <div className="text-xs text-tcm-accent">
                          <strong>Examples:</strong> {point.example}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTheory === 'qi_theory' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Qi & Energy Flow</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Meridian Flow Patterns</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Yin Meridians</h4>
                    <p className="text-blue-800 text-sm">Flow from chest to fingertips (arm) or from feet to chest (leg)</p>
                    <p className="text-blue-700 text-xs mt-1">LU, HT, PC (arm) | SP, KI, LV (leg)</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-900">Yang Meridians</h4>
                    <p className="text-orange-800 text-sm">Flow from fingertips to face (arm) or from face to feet (leg)</p>
                    <p className="text-orange-700 text-xs mt-1">LI, SI, TH (arm) | ST, BL, GB (leg)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Treatment Principles</h3>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900">Tonification</h4>
                    <p className="text-gray-600 text-sm">Use Yuan-Source points, gentle stimulation, longer duration</p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900">Sedation</h4>
                    <p className="text-gray-600 text-sm">Use He-Sea points, stronger stimulation, shorter duration</p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900">Regulation</h4>
                    <p className="text-gray-600 text-sm">Use Shu-Stream points, moderate stimulation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTheory === 'zang_fu' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Zang-Fu Organ Theory</h2>
            <div className="text-center py-12 text-gray-500">
              <Book className="h-12 w-12 mx-auto mb-4" />
              <p>Zang-Fu theory content coming soon...</p>
            </div>
          </div>
        )}

        {selectedTheory === 'diagnostic_methods' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">TCM Diagnostic Methods</h2>
            <div className="text-center py-12 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-4" />
              <p>Diagnostic methods content coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TCMTheory;
