import React from 'react';
import { ModalityProtocol } from '../../../lib/modality-system/types';

const GuaShaProtocolCard: React.FC<{ protocol: ModalityProtocol; compact?: boolean }> = ({ protocol }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900">{protocol.name}</h3>
      <p className="text-gray-600 text-sm">{protocol.description}</p>
    </div>
  );
};

export default GuaShaProtocolCard;
