import React from 'react';
import { ModalityTechnique } from '../../../lib/modality-system/types';
import { Hand, Clock, AlertTriangle } from 'lucide-react';

interface AcupressureTechniquesListProps {
  techniques: ModalityTechnique[];
}

const AcupressureTechniquesList: React.FC<AcupressureTechniquesListProps> = ({ techniques }) => {
  return (
    <div className="space-y-4">
      {techniques.map(technique => (
        <div key={technique.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{technique.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {technique.duration}
            </div>
          </div>
          
          <p className="text-gray-700 mb-3">{technique.description}</p>
          
          <div className="mb-3">
            <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              {technique.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              <strong>Intensity:</strong> {technique.intensity}
            </span>
            
            {technique.contraindications && technique.contraindications.length > 0 && (
              <div className="flex items-center text-red-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>See contraindications</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AcupressureTechniquesList;