import React from 'react';
import { Leaf, Flame, Mountain, Gem, Droplets } from 'lucide-react';

interface FiveElementTheoryProps {
  selectedElement?: string;
  onElementSelect?: (element: string) => void;
  showDetails?: boolean;
}

const FiveElementTheory: React.FC<FiveElementTheoryProps> = ({ 
  selectedElement, 
  onElementSelect, 
  showDetails = false 
}) => {
  const elements = [
    {
      id: 'wood',
      name: 'Wood',
      icon: Leaf,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      meridians: ['Liver (LV)', 'Gall Bladder (GB)'],
      season: 'Spring',
      emotion: 'Anger / Frustration',
      organs: 'Liver, Gall Bladder',
      tissues: 'Tendons, Ligaments',
      sensory: 'Eyes, Vision',
      characteristics: ['Growth', 'Planning', 'Flexibility', 'Vision'],
      imbalance: ['Irritability', 'Tension headaches', 'Eye problems', 'Muscle stiffness']
    },
    {
      id: 'fire',
      name: 'Fire',
      icon: Flame,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      meridians: ['Heart (HT)', 'Small Intestine (SI)', 'Pericardium (PC)', 'Triple Heater (TH)'],
      season: 'Summer',
      emotion: 'Joy / Overexcitement',
      organs: 'Heart, Small Intestine, Pericardium, Triple Heater',
      tissues: 'Blood Vessels',
      sensory: 'Tongue, Speech',
      characteristics: ['Communication', 'Joy', 'Circulation', 'Warmth'],
      imbalance: ['Anxiety', 'Insomnia', 'Heart palpitations', 'Speech problems']
    },
    {
      id: 'earth',
      name: 'Earth',
      icon: Mountain,
      color: 'bg-yellow-600',
      lightColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      meridians: ['Spleen (SP)', 'Stomach (ST)'],
      season: 'Late Summer',
      emotion: 'Worry / Pensiveness',
      organs: 'Spleen, Stomach',
      tissues: 'Muscles, Flesh',
      sensory: 'Mouth, Taste',
      characteristics: ['Nourishment', 'Grounding', 'Stability', 'Digestion'],
      imbalance: ['Digestive issues', 'Worry', 'Fatigue', 'Sweet cravings']
    },
    {
      id: 'metal',
      name: 'Metal',
      icon: Gem,
      color: 'bg-gray-500',
      lightColor: 'bg-gray-50',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      meridians: ['Lung (LU)', 'Large Intestine (LI)'],
      season: 'Autumn',
      emotion: 'Grief / Sadness',
      organs: 'Lungs, Large Intestine',
      tissues: 'Skin, Body Hair',
      sensory: 'Nose, Smell',
      characteristics: ['Letting go', 'Structure', 'Boundaries', 'Inspiration'],
      imbalance: ['Respiratory issues', 'Grief', 'Skin problems', 'Constipation']
    },
    {
      id: 'water',
      name: 'Water',
      icon: Droplets,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      meridians: ['Kidney (KI)', 'Bladder (BL)'],
      season: 'Winter',
      emotion: 'Fear / Fright',
      organs: 'Kidneys, Bladder',
      tissues: 'Bones, Marrow',
      sensory: 'Ears, Hearing',
      characteristics: ['Storage', 'Willpower', 'Wisdom', 'Foundation'],
      imbalance: ['Kidney weakness', 'Fear', 'Bone problems', 'Hearing issues']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Element Selection */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {elements.map((element) => {
          const Icon = element.icon;
          const isSelected = selectedElement === element.id;
          
          return (
            <button
              key={element.id}
              onClick={() => onElementSelect?.(element.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `${element.color} text-white border-transparent`
                  : `${element.lightColor} ${element.textColor} ${element.borderColor} hover:border-opacity-60`
              }`}
            >
              <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-white' : element.textColor}`} />
              <div className={`font-medium ${isSelected ? 'text-white' : element.textColor}`}>
                {element.name}
              </div>
              <div className={`text-xs ${isSelected ? 'text-white opacity-90' : 'text-gray-600'}`}>
                {element.season}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Element Information */}
      {showDetails && selectedElement && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {elements
            .filter(element => element.id === selectedElement)
            .map((element) => {
              const Icon = element.icon;
              
              return (
                <div key={element.id} className={`${element.lightColor} ${element.borderColor} border rounded-lg p-6`}>
                  <div className="flex items-center mb-4">
                    <Icon className={`h-6 w-6 ${element.textColor} mr-2`} />
                    <h3 className={`text-xl font-bold ${element.textColor}`}>
                      {element.name} Element
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className={`font-semibold ${element.textColor} mb-2`}>Associated Meridians</h4>
                      <div className="flex flex-wrap gap-2">
                        {element.meridians.map((meridian) => (
                          <span
                            key={meridian}
                            className={`px-3 py-1 ${element.color} text-white rounded-full text-sm`}
                          >
                            {meridian}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className={element.textColor}>Season:</strong>
                        <p className="text-gray-700">{element.season}</p>
                      </div>
                      <div>
                        <strong className={element.textColor}>Emotion:</strong>
                        <p className="text-gray-700">{element.emotion}</p>
                      </div>
                      <div>
                        <strong className={element.textColor}>Organs:</strong>
                        <p className="text-gray-700">{element.organs}</p>
                      </div>
                      <div>
                        <strong className={element.textColor}>Tissues:</strong>
                        <p className="text-gray-700">{element.tissues}</p>
                      </div>
                      <div>
                        <strong className={element.textColor}>Sensory:</strong>
                        <p className="text-gray-700">{element.sensory}</p>
                      </div>
                    </div>

                    <div>
                      <strong className={`${element.textColor} block mb-2`}>Characteristics:</strong>
                      <div className="flex flex-wrap gap-1">
                        {element.characteristics.map((char) => (
                          <span
                            key={char}
                            className="px-2 py-1 bg-white text-gray-700 rounded text-xs border"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong className={`${element.textColor} block mb-2`}>Common Imbalances:</strong>
                      <ul className="text-gray-700 text-sm space-y-1">
                        {element.imbalance.map((symptom) => (
                          <li key={symptom} className="flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Element Relationships */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Five Element Relationships</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Generation Cycle (Mother-Child)</h4>
                <p className="text-sm text-gray-700 mb-2">Each element nourishes the next:</p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Wood</span>
                  <span>→</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded">Fire</span>
                  <span>→</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Earth</span>
                  <span>→</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Metal</span>
                  <span>→</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Water</span>
                  <span>→</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Wood</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Control Cycle (Grandmother-Grandchild)</h4>
                <p className="text-sm text-gray-700 mb-2">Each element controls another:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Wood controls Earth (roots break soil)</li>
                  <li>• Fire controls Metal (fire melts metal)</li>
                  <li>• Earth controls Water (earth absorbs water)</li>
                  <li>• Metal controls Wood (metal cuts wood)</li>
                  <li>• Water controls Fire (water extinguishes fire)</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <h4 className="font-semibold text-blue-900 mb-1">Clinical Application</h4>
                <p className="text-blue-800 text-sm">
                  Use element relationships to understand root causes and select appropriate points. 
                  Tonify the mother to strengthen the child, or sedate the controller to free the controlled.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiveElementTheory;
