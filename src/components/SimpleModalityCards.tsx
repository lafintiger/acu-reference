// Simple Modality Cards - Auto-generated from plugins
// Clean implementation of dynamic modality display

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { modalityRegistry } from '../lib/modality-system/registry';

interface SimpleModalityCardsProps {
  indication: string;
}

const SimpleModalityCards: React.FC<SimpleModalityCardsProps> = ({ indication }) => {
  const [modalityData, setModalityData] = useState<any[]>([]);

  useEffect(() => {
    const data = modalityRegistry.getComparisonData(indication);
    setModalityData(data);
  }, [indication]);

  if (modalityData.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No modalities registered yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {modalityData.map((modality) => (
        <div key={modality.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="text-2xl mb-2">{modality.icon}</div>
            <h3 className="font-semibold text-gray-900 text-sm mb-2">{modality.name}</h3>
            
            <div className="text-xs text-gray-600 mb-2">
              {modality.protocols} protocol{modality.protocols !== 1 ? 's' : ''}
            </div>

            <div className="text-xs text-green-600 font-medium mb-3">
              {modality.effectiveness}% effective
            </div>

            <Link
              to={`/${modality.id}`}
              className="inline-flex items-center text-xs text-tcm-accent hover:text-tcm-accent-dark font-medium"
            >
              View Protocols
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      ))}
      
      {/* Plugin System Indicator */}
      <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg mb-1">🔧</div>
          <div className="text-xs">Plugin System</div>
          <div className="text-xs">Auto-Generated</div>
        </div>
      </div>
    </div>
  );
};

export default SimpleModalityCards;
