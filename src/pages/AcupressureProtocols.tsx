import { useState } from 'react';
import { Hand, Clock, Target, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { acupressureProtocols } from '../data/acupressureProtocols';

const AcupressureProtocols = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<string>('');

  const protocolCategories = {
    'Pain Management': ['headache', 'back_pain', 'neck_stiffness'],
    'Digestive Health': ['digestive_disorders', 'nausea'],
    'Emotional Wellness': ['anxiety', 'insomnia'],
    'Cardiovascular': ['hypertension']
  };

  const getProtocolById = (id: string) => {
    return acupressureProtocols.find(p => p.indicationId === id);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Acupressure Treatment Protocols</h1>
        <p className="text-gray-600">Comprehensive step-by-step acupressure treatments for common conditions</p>
      </div>

      {/* Protocol Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Treatment Categories</h2>
          
          <div className="space-y-4">
            {Object.entries(protocolCategories).map(([category, protocolIds]) => (
              <div key={category}>
                <h3 className="font-medium text-gray-900 mb-2">{category}</h3>
                <div className="space-y-2">
                  {protocolIds.map((protocolId) => {
                    const protocol = getProtocolById(protocolId);
                    if (!protocol) return null;
                    
                    return (
                      <button
                        key={protocolId}
                        onClick={() => setSelectedProtocol(protocolId)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedProtocol === protocolId
                            ? 'border-tcm-accent bg-tcm-accent bg-opacity-10 text-tcm-accent'
                            : 'border-gray-200 text-gray-700 hover:border-tcm-accent hover:text-tcm-accent'
                        }`}
                      >
                        <div className="font-medium text-sm">
                          {protocol.protocolName.replace(' Protocol', '')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {protocol.primaryPoints.length} primary points • {protocol.totalDuration}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Details */}
        <div className="lg:col-span-3">
          {selectedProtocol ? (
            (() => {
              const protocol = getProtocolById(selectedProtocol);
              if (!protocol) return null;

              return (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-6">
                    <Hand className="h-6 w-6 text-tcm-accent mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">{protocol.protocolName}</h2>
                  </div>

                  <div className="space-y-8">
                    {/* Protocol Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="font-semibold text-blue-900">Duration</div>
                        <div className="text-blue-800 text-sm">{protocol.totalDuration}</div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <div className="font-semibold text-green-900">Primary Points</div>
                        <div className="text-green-800 text-sm">{protocol.primaryPoints.length} points</div>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                        <User className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <div className="font-semibold text-purple-900">Frequency</div>
                        <div className="text-purple-800 text-sm">{protocol.frequency}</div>
                      </div>
                    </div>

                    {/* Primary Points Detailed */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Primary Treatment Points</h3>
                      <div className="space-y-4">
                        {protocol.primaryPoints.map((point, index) => (
                          <div key={point.pointId} className="border border-gray-200 rounded-lg p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              {/* Point Info */}
                              <div className="lg:col-span-2">
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="text-lg font-semibold text-gray-900">
                                    {index + 1}. {point.pointId} - {point.pointName}
                                  </h4>
                                  <div className="flex space-x-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      point.pressure === 'light' ? 'bg-green-100 text-green-800' :
                                      point.pressure === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {point.pressure} pressure
                                    </span>
                                    {point.bilateralTreatment && (
                                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        bilateral
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <strong className="text-gray-900">Location:</strong>
                                    <span className="text-gray-700 ml-2">{point.location}</span>
                                  </div>
                                  <div>
                                    <strong className="text-gray-900">Technique:</strong>
                                    <span className="text-gray-700 ml-2">{point.technique}</span>
                                  </div>
                                  <div>
                                    <strong className="text-gray-900">Duration:</strong>
                                    <span className="text-gray-700 ml-2">{point.duration}</span>
                                  </div>
                                  {point.notes && (
                                    <div className="bg-gray-50 border border-gray-200 rounded p-3 mt-3">
                                      <strong className="text-gray-900">Clinical Notes:</strong>
                                      <p className="text-gray-700 mt-1">{point.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Visual Guide */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-medium text-gray-900 mb-2">Pressure Guide</h5>
                                <div className="space-y-2 text-xs">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                                    <span>Light: Gentle touch, no pain</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                                    <span>Moderate: Firm but comfortable</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                                    <span>Firm: Strong pressure, slight discomfort OK</span>
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <h5 className="font-medium text-gray-900 mb-2">Timing</h5>
                                  <p className="text-xs text-gray-600">
                                    Apply pressure gradually, hold steadily, release slowly. 
                                    Coordinate with patient's breathing when possible.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Treatment Sequence */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Step-by-Step Treatment Sequence</h3>
                      <div className="space-y-3">
                        {protocol.treatmentSequence.map((step, index) => (
                          <div key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-8 h-8 bg-tcm-accent text-white rounded-full text-sm flex items-center justify-center mr-4 mt-1">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-700">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Safety & Modifications */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Contraindications */}
                      {protocol.contraindications && protocol.contraindications.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Contraindications & Cautions
                          </h3>
                          <ul className="text-red-800 text-sm space-y-2">
                            {protocol.contraindications.map((contraindication, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-1 h-1 bg-red-600 rounded-full mr-2 mt-2"></span>
                                {contraindication}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Modifications */}
                      {protocol.modifications && protocol.modifications.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-semibold text-blue-900 mb-3">Treatment Modifications</h3>
                          <div className="space-y-3">
                            {protocol.modifications.map((mod, index) => (
                              <div key={index}>
                                <h4 className="font-medium text-blue-900 text-sm">{mod.condition}</h4>
                                <p className="text-blue-800 text-sm">{mod.modification}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Clinical Notes & Follow-up */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Clinical Notes
                        </h3>
                        <p className="text-green-800 text-sm leading-relaxed">{protocol.clinicalNotes}</p>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Follow-up & Self-Care</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{protocol.followUpGuidance}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Hand className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Treatment Protocol</h2>
              <p className="text-gray-600">
                Choose a condition from the left panel to view detailed acupressure treatment protocols.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* General Acupressure Guidelines */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">General Acupressure Guidelines</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Pressure Application</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Apply pressure gradually</li>
              <li>• Hold steadily without rubbing</li>
              <li>• Release slowly</li>
              <li>• Breathe deeply during treatment</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Patient Positioning</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Comfortable, supported position</li>
              <li>• Relaxed muscles</li>
              <li>• Good access to points</li>
              <li>• Calm environment</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Treatment Response</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Slight soreness is normal</li>
              <li>• Warmth or tingling is good</li>
              <li>• Sharp pain means too much pressure</li>
              <li>• Adjust based on patient feedback</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Safety Considerations</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Check contraindications first</li>
              <li>• Start with lighter pressure</li>
              <li>• Monitor patient response</li>
              <li>• Stop if adverse reactions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcupressureProtocols;
