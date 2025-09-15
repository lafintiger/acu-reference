// Acupressure Protocol Page Component
// Modular component that can be dynamically loaded

import React from 'react';
import { useModalityProtocols } from '../../../lib/modality-system/hooks';
import { Hand, Clock, Users, AlertTriangle } from 'lucide-react';

interface AcupressureProtocolPageProps {
  indication?: string;
}

const AcupressureProtocolPage: React.FC<AcupressureProtocolPageProps> = ({ indication }) => {
  const protocols = useModalityProtocols('acupressure', indication);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Hand className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Acupressure Protocols
              {indication && ` for ${indication.replace('_', ' ')}`}
            </h1>
            <p className="text-gray-600 mt-1">
              Gentle finger pressure therapy using traditional acupuncture points
            </p>
          </div>
        </div>

        {/* Modality Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-semibold text-blue-900">Duration</span>
            </div>
            <p className="text-blue-800">15-30 minutes per session</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-semibold text-green-900">Frequency</span>
            </div>
            <p className="text-green-800">2-3 times per week</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Hand className="h-5 w-5 text-purple-600 mr-2" />
              <span className="font-semibold text-purple-900">Equipment</span>
            </div>
            <p className="text-purple-800">None required - hands only</p>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Safety Guidelines</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Acupressure is generally safe for all ages. Use gentle pressure and avoid points 
              contraindicated during pregnancy. Stop if pain increases or discomfort occurs.
            </p>
          </div>
        </div>
      </div>

      {/* Protocols List */}
      <div className="space-y-4">
        {protocols.length > 0 ? (
          protocols.map(protocol => (
            <div key={protocol.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{protocol.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  protocol.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  protocol.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {protocol.difficulty}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{protocol.description}</p>

              {/* Protocol Steps */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Treatment Steps:</h3>
                {protocol.steps.map(step => (
                  <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{step.order}. {step.title}</h4>
                      {step.duration && (
                        <span className="text-sm text-gray-500">{step.duration}</span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-2">{step.description}</p>
                    
                    {step.points && step.points.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-900">Points: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {step.points.map(point => (
                            <span key={point} className="px-2 py-1 bg-tcm-light text-tcm-accent rounded text-sm font-mono">
                              {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {step.techniques && step.techniques.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-900">Techniques: </span>
                        <span className="text-sm text-gray-700">{step.techniques.join(', ')}</span>
                      </div>
                    )}
                    
                    {step.notes && (
                      <div className="bg-gray-50 rounded p-2 mt-2">
                        <span className="text-sm text-gray-700">{step.notes}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Clinical Information */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Treatment Details</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Duration:</span> {protocol.duration}</div>
                    <div><span className="font-medium">Frequency:</span> {protocol.frequency}</div>
                    <div><span className="font-medium">Difficulty:</span> {protocol.difficulty}</div>
                  </div>
                </div>
                
                {protocol.contraindications.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contraindications</h4>
                    <ul className="space-y-1 text-sm text-red-700">
                      {protocol.contraindications.map(contra => (
                        <li key={contra}>• {contra.replace('_', ' ')}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {protocol.clinicalNotes && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Clinical Notes</h4>
                  <p className="text-blue-800 text-sm">{protocol.clinicalNotes}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Hand className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Protocols Available</h3>
            <p className="text-gray-600">
              {indication 
                ? `No acupressure protocols found for ${indication.replace('_', ' ')}`
                : 'No acupressure protocols are currently available'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcupressureProtocolPage;
