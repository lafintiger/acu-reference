import { useState } from 'react';
import { Circle, Clock, Target, AlertTriangle, CheckCircle, Thermometer, Droplets } from 'lucide-react';
import { cuppingProtocols } from '../data/cuppingProtocols';

const CuppingProtocols = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<string>('');

  const protocolCategories = {
    'Pain Management': ['back_pain', 'shoulder_pain', 'muscle_tension'],
    'Respiratory Health': ['cough', 'common_cold'],
    'Digestive Support': ['digestive_disorders'],
    'Emotional Wellness': ['anxiety']
  };

  const getProtocolById = (id: string) => {
    return cuppingProtocols.find(p => p.indicationId === id);
  };

  const getSuctionColor = (level: string) => {
    switch (level) {
      case 'light': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'strong': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCupSizeColor = (size: string) => {
    switch (size) {
      case 'small': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-purple-100 text-purple-800';
      case 'large': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cupping Treatment Protocols</h1>
        <p className="text-gray-600">Professional cupping techniques for therapeutic conditions</p>
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
                          {protocol.protocolName.replace(' Cupping Protocol', '')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {protocol.primaryAreas.length} areas • {protocol.totalDuration}
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
                    <Circle className="h-6 w-6 text-tcm-accent mr-3" />
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
                        <div className="font-semibold text-green-900">Treatment Areas</div>
                        <div className="text-green-800 text-sm">{protocol.primaryAreas.length} primary areas</div>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                        <Thermometer className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <div className="font-semibold text-purple-900">Frequency</div>
                        <div className="text-purple-800 text-sm">{protocol.frequency}</div>
                      </div>
                    </div>

                    {/* Primary Areas Detailed */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Primary Treatment Areas</h3>
                      <div className="space-y-4">
                        {protocol.primaryAreas.map((area, index) => (
                          <div key={area.areaName} className="border border-gray-200 rounded-lg p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Area Details */}
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                  {index + 1}. {area.areaName}
                                </h4>
                                
                                <div className="space-y-3">
                                  <div>
                                    <strong className="text-gray-900">Location:</strong>
                                    <p className="text-gray-700 text-sm mt-1">{area.anatomicalLocation}</p>
                                  </div>
                                  
                                  <div>
                                    <strong className="text-gray-900">Technique:</strong>
                                    <p className="text-gray-700 text-sm mt-1">{area.technique}</p>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <strong className="text-gray-900">Duration:</strong>
                                      <p className="text-gray-700 text-sm">{area.duration}</p>
                                    </div>
                                    <div>
                                      <strong className="text-gray-900">Number of Cups:</strong>
                                      <p className="text-gray-700 text-sm">{area.numberOfCups}</p>
                                    </div>
                                  </div>
                                  
                                  {area.notes && (
                                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                      <strong className="text-gray-900">Clinical Notes:</strong>
                                      <p className="text-gray-700 text-sm mt-1">{area.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Technical Specifications */}
                              <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <h5 className="font-medium text-gray-900 mb-3">Cup Specifications</h5>
                                  
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">Cup Size:</span>
                                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCupSizeColor(area.cupSize)}`}>
                                        {area.cupSize}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">Suction Level:</span>
                                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSuctionColor(area.suctionLevel)}`}>
                                        {area.suctionLevel}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">Technique:</span>
                                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                                        {area.technique}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <h5 className="font-medium text-blue-900 mb-2">Suction Guide</h5>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                                      <span>Light: Gentle pull, skin rises 1-2cm</span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                                      <span>Medium: Moderate pull, skin rises 2-3cm</span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                                      <span>Strong: Firm pull, skin rises 3-4cm</span>
                                    </div>
                                  </div>
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

                    {/* Safety & Post-Treatment */}
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

                      {/* Post-Treatment Care */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                          <Droplets className="h-5 w-5 mr-2" />
                          Post-Treatment Care
                        </h3>
                        <p className="text-green-800 text-sm leading-relaxed">{protocol.postTreatmentCare}</p>
                        
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <h4 className="font-medium text-green-900 mb-1">Expected Marking</h4>
                          <p className="text-green-800 text-xs">{protocol.expectedMarking}</p>
                        </div>
                      </div>
                    </div>

                    {/* Modifications */}
                    {protocol.modifications && protocol.modifications.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-semibold text-blue-900 mb-4">Treatment Modifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {protocol.modifications.map((mod, index) => (
                            <div key={index} className="bg-white border border-blue-200 rounded p-3">
                              <h4 className="font-medium text-blue-900 text-sm mb-1">{mod.condition}</h4>
                              <p className="text-blue-800 text-sm">{mod.modification}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
                        <h3 className="font-semibold text-gray-900 mb-3">Follow-up & Monitoring</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{protocol.followUpGuidance}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Circle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Cupping Protocol</h2>
              <p className="text-gray-600">
                Choose a condition from the left panel to view detailed cupping treatment protocols.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* General Cupping Safety Guidelines */}
      <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-orange-900 mb-4">Essential Cupping Safety Guidelines</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-medium text-orange-900 mb-2">Before Treatment</h4>
            <ul className="text-orange-800 text-sm space-y-1">
              <li>• Check for contraindications</li>
              <li>• Inspect skin condition</li>
              <li>• Explain procedure to patient</li>
              <li>• Ensure clean equipment</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-orange-900 mb-2">During Treatment</h4>
            <ul className="text-orange-800 text-sm space-y-1">
              <li>• Monitor skin color changes</li>
              <li>• Check patient comfort regularly</li>
              <li>• Adjust suction if needed</li>
              <li>• Never leave patient unattended</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-orange-900 mb-2">Cup Removal</h4>
            <ul className="text-orange-800 text-sm space-y-1">
              <li>• Release suction slowly</li>
              <li>• Press skin beside cup edge</li>
              <li>• Never pull cups off forcefully</li>
              <li>• Clean skin after removal</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-orange-900 mb-2">Post-Treatment</h4>
            <ul className="text-orange-800 text-sm space-y-1">
              <li>• Keep area warm and covered</li>
              <li>• Avoid cold exposure 2-4 hours</li>
              <li>• Monitor for adverse reactions</li>
              <li>• Document treatment response</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Emergency Situations - Remove Cups Immediately If:
          </h4>
          <ul className="text-red-800 text-sm space-y-1">
            <li>• Skin becomes white, blue, or black</li>
            <li>• Patient experiences severe pain or distress</li>
            <li>• Blistering or skin breakdown occurs</li>
            <li>• Patient feels faint or dizzy</li>
            <li>• Any signs of adverse reaction</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CuppingProtocols;
