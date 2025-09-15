import React from 'react';
import { ModalityContraindications } from '../../../lib/modality-system/types';

const AppliedKinesiologySafetyWarnings: React.FC<{ contraindications: ModalityContraindications }> = ({ contraindications }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-semibold text-blue-800">Applied Kinesiology Guidelines</h3>
      <ul className="text-blue-700 text-sm mt-2">
        {contraindications.absolute.map(contra => (
          <li key={contra}>• {contra.replace('_', ' ')}</li>
        ))}
      </ul>
    </div>
  );
};

export default AppliedKinesiologySafetyWarnings;
