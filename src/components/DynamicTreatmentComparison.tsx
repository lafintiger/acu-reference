// Dynamic Treatment Comparison - Auto-generated from plugins
// This component automatically creates comparison tables from registered plugins

import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Users, Shield, Zap, DollarSign } from 'lucide-react';
import DynamicRouter from '../lib/modality-system/dynamic-router';

interface DynamicTreatmentComparisonProps {
  indication: string;
  detailed?: boolean;
}

const DynamicTreatmentComparison: React.FC<DynamicTreatmentComparisonProps> = ({ 
  indication, 
  detailed = false 
}) => {
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComparisonData = () => {
      try {
        const data = DynamicRouter.generateComparisonData(indication);
        setComparisonData(data);
      } catch (error) {
        console.error('Failed to load comparison data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (DynamicRouter.isReady()) {
      loadComparisonData();
    } else {
      const checkInterval = setInterval(() => {
        if (DynamicRouter.isReady()) {
          loadComparisonData();
          clearInterval(checkInterval);
        }
      }, 100);
      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }, [indication]);

  const getEffectivenessColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (comparisonData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No treatment modalities available for comparison</p>
      </div>
    );
  }

  if (detailed) {
    // Detailed comparison view
    return (
      <div className="space-y-6">
        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effectiveness
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ease of Use
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Safety
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisonData.map((treatment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{treatment.icon}</span>
                      <span className="font-medium text-gray-900">{treatment.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {treatment.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {treatment.frequency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${getEffectivenessColor(treatment.effectiveness)}`}
                          style={{ width: `${treatment.effectiveness}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getScoreColor(treatment.effectiveness)}`}>
                        {treatment.effectiveness}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${getEffectivenessColor(treatment.easeOfUse)}`}
                          style={{ width: `${treatment.easeOfUse}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getScoreColor(treatment.easeOfUse)}`}>
                        {treatment.easeOfUse}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${getEffectivenessColor(treatment.safetyProfile)}`}
                          style={{ width: `${treatment.safetyProfile}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getScoreColor(treatment.safetyProfile)}`}>
                        {treatment.safetyProfile}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {treatment.equipment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Compact comparison view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {comparisonData.map((treatment, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl mb-2">{treatment.icon}</div>
          <h3 className="font-semibold text-gray-900 mb-1">{treatment.name}</h3>
          <div className="text-xs text-gray-600 mb-2">
            {treatment.effectiveness}% effective • {treatment.easeOfUse}% ease
          </div>
          
          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex items-center justify-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{treatment.duration}</span>
            </div>
            <div>{treatment.equipment}</div>
          </div>
          
          <Link
            to={`/${treatment.modalityId}`}
            className="inline-flex items-center text-xs text-tcm-accent hover:text-tcm-accent-dark font-medium mt-2"
          >
            View Details
            <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DynamicModalityCards;
