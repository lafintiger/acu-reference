import React from 'react';
import { ModalityContraindications } from '../../../lib/modality-system/types';

const GuaShaSafetyWarnings: React.FC<{ contraindications: ModalityContraindications }> = ({ contraindications }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 className="font-semibold text-yellow-800">Gua Sha Safety Guidelines</h3>
      <ul className="text-yellow-700 text-sm mt-2">
        {contraindications.absolute.map(contra => (
          <li key={contra}>• {contra.replace('_', ' ')}</li>
        ))}
      </ul>
    </div>
  );
};

export default GuaShaSafetyWarnings;
