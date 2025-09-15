// Dynamic Modality Cards - Auto-generated from plugins
// This component automatically displays cards for all relevant modalities

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Clock, Users, Zap } from 'lucide-react';
import DynamicRouter from '../lib/modality-system/dynamic-router';

interface DynamicModalityCardsProps {
  indication: string;
  compact?: boolean;
}

const DynamicModalityCards: React.FC<DynamicModalityCardsProps> = ({ 
  indication, 
  compact = false 
}) => {
  const [modalityCards, setModalityCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModalityCards = () => {
      try {
        const cards = DynamicRouter.generateModalityCards(indication);
        setModalityCards(cards);
      } catch (error) {
        console.error('Failed to load modality cards:', error);
      } finally {
        setLoading(false);
      }
    };

    // Check if plugin system is ready
    if (DynamicRouter.isReady()) {
      loadModalityCards();
    } else {
      // Wait for plugins to load
      const checkInterval = setInterval(() => {
        if (DynamicRouter.isReady()) {
          loadModalityCards();
          clearInterval(checkInterval);
        }
      }, 100);

      // Cleanup interval after 5 seconds
      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }, [indication]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (modalityCards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No modalities available for {indication.replace('_', ' ')}</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'} gap-4`}>
      {modalityCards.map((modality) => (
        <div key={modality.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-center">
            {/* Icon and Name */}
            <div className="text-2xl mb-2">{modality.icon}</div>
            <h3 className="font-semibold text-gray-900 text-sm mb-2">{modality.name}</h3>
            
            {/* Protocol Count */}
            <div className="text-xs text-gray-600 mb-2">
              {modality.protocols} protocol{modality.protocols !== 1 ? 's' : ''}
            </div>

            {/* Effectiveness Score */}
            {modality.effectiveness > 0 && (
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600 font-medium">
                  {modality.effectiveness}% effective
                </span>
              </div>
            )}

            {/* Quick Info */}
            {!compact && (
              <div className="text-xs text-gray-500 mb-3 space-y-1">
                <div className="flex items-center justify-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{modality.skillLevel}</span>
                </div>
                <div>
                  {modality.equipmentRequired ? 'Equipment needed' : 'No equipment'}
                </div>
                <div>
                  {modality.selfAdministered ? 'Self-care possible' : 'Practitioner only'}
                </div>
              </div>
            )}

            {/* Protocol Link */}
            <Link
              to={modality.link}
              className="inline-flex items-center text-xs text-tcm-accent hover:text-tcm-accent-dark font-medium"
            >
              View Protocols
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicModalityCards;
