import React from 'react';
import { ModalityEffectiveness } from '../../../lib/modality-system/types';

const AppliedKinesiologyComparisonMetrics: React.FC<{ effectiveness: ModalityEffectiveness[] }> = ({ effectiveness }) => {
  return (
    <div className="grid grid-cols-4 gap-4 text-center">
      <div>
        <div className="text-2xl font-bold text-orange-600">92%</div>
        <div className="text-xs text-gray-600">Effectiveness</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-yellow-600">60%</div>
        <div className="text-xs text-gray-600">Ease of Use</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-green-600">95%</div>
        <div className="text-xs text-gray-600">Safety</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-blue-600">Diagnostic</div>
        <div className="text-xs text-gray-600">Purpose</div>
      </div>
    </div>
  );
};

export default AppliedKinesiologyComparisonMetrics;
