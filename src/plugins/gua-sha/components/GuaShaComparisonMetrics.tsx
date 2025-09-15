import React from 'react';
import { ModalityEffectiveness } from '../../../lib/modality-system/types';

const GuaShaComparisonMetrics: React.FC<{ effectiveness: ModalityEffectiveness[] }> = ({ effectiveness }) => {
  return (
    <div className="grid grid-cols-4 gap-4 text-center">
      <div>
        <div className="text-2xl font-bold text-green-600">88%</div>
        <div className="text-xs text-gray-600">Effectiveness</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-blue-600">80%</div>
        <div className="text-xs text-gray-600">Ease of Use</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-green-600">90%</div>
        <div className="text-xs text-gray-600">Safety</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-purple-600">High</div>
        <div className="text-xs text-gray-600">Versatility</div>
      </div>
    </div>
  );
};

export default GuaShaComparisonMetrics;
