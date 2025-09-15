import React from 'react';
import { ModalityTechnique } from '../../../lib/modality-system/types';

const CuppingTechniquesList: React.FC<{ techniques: ModalityTechnique[] }> = ({ techniques }) => {
  return (
    <div className="space-y-4">
      {techniques.map(technique => (
        <div key={technique.id} className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900">{technique.name}</h3>
          <p className="text-gray-600 text-sm">{technique.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CuppingTechniquesList;