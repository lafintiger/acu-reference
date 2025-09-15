import React from 'react';
import { ModalityContraindications } from '../../../lib/modality-system/types';

const CuppingSafetyWarnings: React.FC<{ contraindications: ModalityContraindications }> = ({ contraindications }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 className="font-semibold text-red-800">Cupping Safety Warnings</h3>
      <ul className="text-red-700 text-sm mt-2">
        {contraindications.absolute.map(contra => (
          <li key={contra}>• {contra.replace('_', ' ')}</li>
        ))}
      </ul>
    </div>
  );
};

export default CuppingSafetyWarnings;