import React from 'react';
import { Hand, Circle, Waves, Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface TreatmentGuideProps {
  conditionName: string;
  onClose: () => void;
}

const TreatmentGuide: React.FC<TreatmentGuideProps> = ({ conditionName, onClose }) => {
  // Sample comprehensive treatment guide
  const treatmentProtocols = {
    'headache': {
      acupressure: {
        points: ['LI4 (bilateral)', 'GB20 (bilateral)', 'Taiyang', 'Yintang'],
        technique: 'Sustained pressure with circular motions',
        duration: '2-3 minutes per point',
        sequence: 'Start with LI4, then GB20, finish with Taiyang and Yintang',
        pressure: 'Moderate to firm, adjust based on patient tolerance',
        cautions: 'Avoid LI4 in pregnancy'
      },
      cupping: {
        areas: ['Upper trapezius', 'Suboccipital region', 'GB21 area'],
        technique: 'Stationary cupping with medium suction',
        duration: '8-12 minutes',
        cupSize: 'Medium cups (45-50mm diameter)',
        cautions: 'Monitor skin color, avoid over-cupping',
        followUp: 'Apply sliding technique if muscle tension persists'
      },
      guaSha: {
        areas: ['Neck and shoulders', 'Temporal region', 'Occipital area'],
        technique: 'Gentle scraping along GB meridian',
        duration: '5-8 minutes',
        direction: 'Follow meridian flow, downward strokes on neck',
        pressure: 'Light to moderate, increase gradually',
        tools: 'Smooth-edged gua sha tool, massage oil'
      },
      appliedKinesiology: {
        assessment: ['Neck flexors/extensors', 'Suboccipital muscles', 'SCM'],
        corrections: ['Neurolymphatic reflexes', 'Neurovascular points', 'ESR'],
        duration: '10-15 minutes total',
        focus: 'Address cervical dysfunction and emotional stress',
        integration: 'Cross-crawl exercises for brain integration'
      }
    }
  };

  const currentTreatment = treatmentProtocols[conditionName as keyof typeof treatmentProtocols];

  if (!currentTreatment) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold mb-4">Treatment Guide</h3>
          <p className="text-gray-600 mb-4">
            Treatment guide for "{conditionName}" is being developed. 
            Check back soon for comprehensive protocols.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-tcm-accent text-white rounded hover:bg-tcm-secondary"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Comprehensive Treatment Guide: {conditionName.charAt(0).toUpperCase() + conditionName.slice(1)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Acupressure Protocol */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Hand className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-900">Acupressure Protocol</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-blue-900">Points:</strong>
                  <p className="text-blue-800">{currentTreatment.acupressure.points.join(', ')}</p>
                </div>
                <div>
                  <strong className="text-blue-900">Technique:</strong>
                  <p className="text-blue-800">{currentTreatment.acupressure.technique}</p>
                </div>
                <div>
                  <strong className="text-blue-900">Duration:</strong>
                  <p className="text-blue-800">{currentTreatment.acupressure.duration}</p>
                </div>
                <div>
                  <strong className="text-blue-900">Sequence:</strong>
                  <p className="text-blue-800">{currentTreatment.acupressure.sequence}</p>
                </div>
                {currentTreatment.acupressure.cautions && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-600 mr-1" />
                      <strong className="text-red-900 text-xs">Cautions:</strong>
                    </div>
                    <p className="text-red-800 text-xs">{currentTreatment.acupressure.cautions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cupping Protocol */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Circle className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-orange-900">Cupping Protocol</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-orange-900">Areas:</strong>
                  <p className="text-orange-800">{currentTreatment.cupping.areas.join(', ')}</p>
                </div>
                <div>
                  <strong className="text-orange-900">Technique:</strong>
                  <p className="text-orange-800">{currentTreatment.cupping.technique}</p>
                </div>
                <div>
                  <strong className="text-orange-900">Duration:</strong>
                  <p className="text-orange-800">{currentTreatment.cupping.duration}</p>
                </div>
                {currentTreatment.cupping.cupSize && (
                  <div>
                    <strong className="text-orange-900">Cup Size:</strong>
                    <p className="text-orange-800">{currentTreatment.cupping.cupSize}</p>
                  </div>
                )}
                {currentTreatment.cupping.cautions && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-600 mr-1" />
                      <strong className="text-red-900 text-xs">Cautions:</strong>
                    </div>
                    <p className="text-red-800 text-xs">{currentTreatment.cupping.cautions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Gua Sha Protocol */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Waves className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-900">Gua Sha Protocol</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-green-900">Areas:</strong>
                  <p className="text-green-800">{currentTreatment.guaSha.areas.join(', ')}</p>
                </div>
                <div>
                  <strong className="text-green-900">Technique:</strong>
                  <p className="text-green-800">{currentTreatment.guaSha.technique}</p>
                </div>
                <div>
                  <strong className="text-green-900">Duration:</strong>
                  <p className="text-green-800">{currentTreatment.guaSha.duration}</p>
                </div>
                <div>
                  <strong className="text-green-900">Direction:</strong>
                  <p className="text-green-800">{currentTreatment.guaSha.direction}</p>
                </div>
                <div>
                  <strong className="text-green-900">Tools:</strong>
                  <p className="text-green-800">{currentTreatment.guaSha.tools}</p>
                </div>
              </div>
            </div>

            {/* Applied Kinesiology Protocol */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Activity className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-purple-900">Applied Kinesiology</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-purple-900">Assessment:</strong>
                  <p className="text-purple-800">{currentTreatment.appliedKinesiology.assessment.join(', ')}</p>
                </div>
                <div>
                  <strong className="text-purple-900">Corrections:</strong>
                  <p className="text-purple-800">{currentTreatment.appliedKinesiology.corrections.join(', ')}</p>
                </div>
                <div>
                  <strong className="text-purple-900">Duration:</strong>
                  <p className="text-purple-800">{currentTreatment.appliedKinesiology.duration}</p>
                </div>
                <div>
                  <strong className="text-purple-900">Focus:</strong>
                  <p className="text-purple-800">{currentTreatment.appliedKinesiology.focus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Summary */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Treatment Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-gray-900">Recommended Sequence:</strong>
                <ol className="text-gray-700 mt-1 space-y-1 list-decimal list-inside">
                  <li>Applied Kinesiology assessment (5 min)</li>
                  <li>Acupressure treatment (15-20 min)</li>
                  <li>Cupping or Gua Sha (8-12 min)</li>
                  <li>AK corrections and integration (5 min)</li>
                </ol>
              </div>
              <div>
                <strong className="text-gray-900">Total Treatment Time:</strong>
                <p className="text-gray-700 mt-1">30-45 minutes</p>
                
                <strong className="text-gray-900 mt-3 block">Follow-up:</strong>
                <p className="text-gray-700 mt-1">
                  Monitor symptoms for 24-48 hours. Recommend self-acupressure on key points.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-secondary"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentGuide;
