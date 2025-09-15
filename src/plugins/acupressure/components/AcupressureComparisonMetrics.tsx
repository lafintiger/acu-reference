import React from 'react';
import { ModalityEffectiveness } from '../../../lib/modality-system/types';
import { TrendingUp, Clock, Users, DollarSign } from 'lucide-react';

interface AcupressureComparisonMetricsProps {
  effectiveness: ModalityEffectiveness[];
}

const AcupressureComparisonMetrics: React.FC<AcupressureComparisonMetricsProps> = ({ 
  effectiveness 
}) => {
  const averageEffectiveness = effectiveness.length > 0
    ? effectiveness.reduce((sum, eff) => sum + eff.effectivenessScore, 0) / effectiveness.length
    : 0;

  const metrics = [
    {
      label: 'Effectiveness',
      value: Math.round(averageEffectiveness),
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'Ease of Use',
      value: 95,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Safety Profile',
      value: 98,
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      label: 'Cost Effectiveness',
      value: 100,
      icon: DollarSign,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map(metric => (
        <div key={metric.label} className="text-center">
          <div className="flex items-center justify-center mb-2">
            <metric.icon className={`h-5 w-5 ${metric.color}`} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metric.value}%</div>
          <div className="text-xs text-gray-600">{metric.label}</div>
        </div>
      ))}
    </div>
  );
};

export default AcupressureComparisonMetrics;
