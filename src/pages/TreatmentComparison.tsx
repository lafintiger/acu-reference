import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Target, AlertTriangle, TrendingUp, Users, Zap } from 'lucide-react';
import { simpleDb } from '../lib/simpleDatabase';

const TreatmentComparison = () => {
  const { indication } = useParams();
  const navigate = useNavigate();
  
  const indicationData = indication ? simpleDb.getIndicationById(indication) : null;
  
  if (!indicationData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Indication not found.</p>
        <button
          onClick={() => navigate('/indications')}
          className="mt-4 px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark"
        >
          Back to Indications
        </button>
      </div>
    );
  }

  const treatmentData = [
    {
      modality: 'Acupressure',
      icon: '👆',
      duration: '15-30 min',
      frequency: '2-3x/week',
      effectiveness: 85,
      easeOfUse: 95,
      safetyProfile: 98,
      cost: 'Free',
      immediateRelief: 'Moderate',
      longTermBenefit: 'Good',
      selfAdministered: 'Yes',
      equipmentNeeded: 'None',
      learningCurve: 'Easy',
      sideEffects: 'Minimal',
      bestFor: ['Chronic pain', 'Stress', 'Headaches', 'Self-care'],
      limitations: ['May require frequent sessions', 'Results vary by individual'],
      contraindications: ['Open wounds', 'Severe osteoporosis'],
      clinicalNotes: 'Excellent first-line treatment. Safe for all ages. Can be combined with any other modality.',
      color: 'blue'
    },
    {
      modality: 'Cupping',
      icon: '🥤',
      duration: '20-30 min',
      frequency: '1-2x/week',
      effectiveness: 90,
      easeOfUse: 75,
      safetyProfile: 85,
      cost: 'Low',
      immediateRelief: 'High',
      longTermBenefit: 'Excellent',
      selfAdministered: 'Limited',
      equipmentNeeded: 'Cups & pump',
      learningCurve: 'Moderate',
      sideEffects: 'Temporary marks',
      bestFor: ['Muscle tension', 'Back pain', 'Respiratory issues', 'Recovery'],
      limitations: ['Visible marks', 'Requires equipment', 'Some contraindications'],
      contraindications: ['Pregnancy', 'Blood thinners', 'Skin conditions'],
      clinicalNotes: 'Powerful for deep muscle issues. Excellent circulation improvement. Plan for mark visibility.',
      color: 'purple'
    },
    {
      modality: 'Gua Sha',
      icon: '🪨',
      duration: '15-25 min',
      frequency: '2-3x/week',
      effectiveness: 88,
      easeOfUse: 80,
      safetyProfile: 90,
      cost: 'Low',
      immediateRelief: 'High',
      longTermBenefit: 'Good',
      selfAdministered: 'Yes',
      equipmentNeeded: 'Gua sha tool',
      learningCurve: 'Moderate',
      sideEffects: 'Temporary redness',
      bestFor: ['Neck tension', 'Facial care', 'Lymphatic drainage', 'Pain relief'],
      limitations: ['Temporary skin changes', 'Technique dependent'],
      contraindications: ['Blood thinners', 'Infections', 'Recent injuries'],
      clinicalNotes: 'Versatile technique. Great for both therapeutic and cosmetic applications. Immediate visible results.',
      color: 'green'
    },
    {
      modality: 'Applied Kinesiology',
      icon: '💪',
      duration: '30-45 min',
      frequency: 'As needed',
      effectiveness: 92,
      easeOfUse: 60,
      safetyProfile: 95,
      cost: 'Free',
      immediateRelief: 'Variable',
      longTermBenefit: 'Excellent',
      selfAdministered: 'Limited',
      equipmentNeeded: 'None',
      learningCurve: 'Advanced',
      sideEffects: 'None',
      bestFor: ['Diagnosis', 'Root causes', 'Functional issues', 'Assessment'],
      limitations: ['Requires training', 'Subjective results', 'Time intensive'],
      contraindications: ['Acute injuries', 'Severe neurological conditions'],
      clinicalNotes: 'Excellent diagnostic tool. Identifies root causes. Best combined with other treatment modalities.',
      color: 'orange'
    }
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/indications/${indication}`)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Treatment Comparison for {indicationData.nameEn}
            </h1>
            <p className="text-gray-600 mt-1">
              Detailed comparison of all available treatment modalities
            </p>
          </div>
        </div>
      </div>

      {/* Quick Comparison Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Quick Comparison Overview</h2>
        </div>
        
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
                  Self-Care
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {treatmentData.map((treatment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{treatment.icon}</span>
                      <span className="font-medium text-gray-900">{treatment.modality}</span>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      treatment.selfAdministered === 'Yes' ? 'bg-green-100 text-green-800' :
                      treatment.selfAdministered === 'Limited' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {treatment.selfAdministered}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {treatmentData.map((treatment, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{treatment.icon}</span>
                <h3 className="text-xl font-semibold text-gray-900">{treatment.modality}</h3>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(treatment.effectiveness)}`}>
                  {treatment.effectiveness}%
                </div>
                <div className="text-xs text-gray-500">Effectiveness</div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center mb-1">
                  <Zap className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm font-medium text-blue-800">Immediate Relief</span>
                </div>
                <span className="text-blue-900 font-semibold">{treatment.immediateRelief}</span>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-800">Long-term</span>
                </div>
                <span className="text-green-900 font-semibold">{treatment.longTermBenefit}</span>
              </div>
            </div>

            {/* Treatment Details */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Equipment:</span>
                <span className="font-medium">{treatment.equipmentNeeded}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Learning Curve:</span>
                <span className="font-medium">{treatment.learningCurve}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Side Effects:</span>
                <span className="font-medium">{treatment.sideEffects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost:</span>
                <span className="font-medium">{treatment.cost}</span>
              </div>
            </div>

            {/* Best For */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Best For:</h4>
              <div className="flex flex-wrap gap-1">
                {treatment.bestFor.map((condition, condIndex) => (
                  <span
                    key={condIndex}
                    className="px-2 py-1 bg-tcm-light text-tcm-accent rounded-full text-xs"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            {/* Limitations */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Limitations:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {treatment.limitations.map((limitation, limIndex) => (
                  <li key={limIndex} className="flex items-start">
                    <span className="text-yellow-600 mr-2">⚠</span>
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contraindications */}
            {treatment.contraindications.length > 0 && (
              <div className="mb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800 mb-1">Contraindications:</h4>
                      <ul className="text-red-700 text-sm space-y-1">
                        {treatment.contraindications.map((contra, contraIndex) => (
                          <li key={contraIndex}>• {contra}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Clinical Notes */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-1">Clinical Notes:</h4>
              <p className="text-sm text-gray-700">{treatment.clinicalNotes}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Decision Guide */}
      <div className="bg-tcm-light border border-tcm-accent rounded-lg p-6">
        <h2 className="text-xl font-semibold text-tcm-accent mb-4">
          <Target className="h-5 w-5 inline mr-2" />
          Treatment Selection Guide
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">For Beginners</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="text-lg mr-2">👆</span>
                <span><strong>Acupressure:</strong> Start here - safe and effective</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg mr-2">🪨</span>
                <span><strong>Gua Sha:</strong> Next step - visible results</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">For Immediate Relief</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="text-lg mr-2">🥤</span>
                <span><strong>Cupping:</strong> Fastest pain relief</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg mr-2">🪨</span>
                <span><strong>Gua Sha:</strong> Quick tension release</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">For Root Causes</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="text-lg mr-2">💪</span>
                <span><strong>Applied Kinesiology:</strong> Identify issues</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg mr-2">👆</span>
                <span><strong>Acupressure:</strong> Long-term maintenance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentComparison;
