// Acupressure Protocol Card Component
// Compact card view for protocol display

import React from 'react';
import { ModalityProtocol } from '../../../lib/modality-system/types';
import { Hand, Clock, AlertTriangle } from 'lucide-react';

interface AcupressureProtocolCardProps {
  protocol: ModalityProtocol;
  compact?: boolean;
}

const AcupressureProtocolCard: React.FC<AcupressureProtocolCardProps> = ({ 
  protocol, 
  compact = false 
}) => {
  const treatmentStep = protocol.steps.find(step => step.type === 'treatment');
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="p-2 bg-blue-50 rounded-lg mr-3">
            <Hand className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {compact ? 'Acupressure' : protocol.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              protocol.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              protocol.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {protocol.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {!compact && (
        <p className="text-gray-600 text-sm mb-4">{protocol.description}</p>
      )}

      {/* Key Information */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-700">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          <span>{protocol.duration} • {protocol.frequency}</span>
        </div>
        
        {treatmentStep?.points && (
          <div>
            <span className="font-medium text-gray-900">Primary Points: </span>
            <span className="text-gray-700">
              {treatmentStep.points.slice(0, 3).join(', ')}
              {treatmentStep.points.length > 3 && ` +${treatmentStep.points.length - 3} more`}
            </span>
          </div>
        )}
        
        {treatmentStep?.techniques && (
          <div>
            <span className="font-medium text-gray-900">Technique: </span>
            <span className="text-gray-700">{treatmentStep.techniques.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Contraindications Warning */}
      {protocol.contraindications.length > 0 && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded p-2">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
            <div>
              <span className="text-red-800 text-xs font-medium">Contraindications: </span>
              <span className="text-red-700 text-xs">
                {protocol.contraindications.slice(0, 2).join(', ')}
                {protocol.contraindications.length > 2 && '...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Expected Outcomes */}
      {!compact && protocol.expectedOutcomes.length > 0 && (
        <div className="mt-3">
          <span className="text-xs font-medium text-gray-900">Expected Outcomes: </span>
          <span className="text-xs text-gray-700">
            {protocol.expectedOutcomes.join(', ')}
          </span>
        </div>
      )}
    </div>
  );
};

export default AcupressureProtocolCard;
