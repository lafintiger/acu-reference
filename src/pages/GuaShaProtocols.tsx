import { useState } from 'react';
import { Waves, Clock, Target, AlertTriangle, CheckCircle, Brush, ArrowRight } from 'lucide-react';
import { guaShaProtocols } from '../data/guaShaProtocols';

const GuaShaProtocols = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<string>('');

  const protocolCategories = {
    'Pain & Tension': ['neck_stiffness', 'back_pain', 'muscle_tension'],
    'Respiratory Health': ['common_cold'],
    'Neurological': ['facial_paralysis'],
    'Skin & Detox': ['skin_conditions'],
    'Cardiovascular': ['hypertension']
  };

  const getProtocolById = (id: string) => {
    return guaShaProtocols.find(p => p.indicationId === id);
  };

  const getPressureColor = (level: string) => {
    switch (level) {
      case 'light': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'firm': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getToolColor = (tool: string) => {
    switch (tool) {
      case 'smooth_edge': return 'bg-blue-100 text-blue-800';
      case 'coin_edge': return 'bg-purple-100 text-purple-800';
      case 'horn': return 'bg-amber-100 text-amber-800';
      case 'jade': return 'bg-emerald-100 text-emerald-800';
      case 'stainless_steel': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gua Sha Treatment Protocols</h1>
        <p className="text-gray-600">Traditional scraping techniques for therapeutic healing</p>
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
                          {protocol.protocolName.replace(' Gua Sha Protocol', '')}
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
                    <Waves className="h-6 w-6 text-tcm-accent mr-3" />
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
                        <Brush className="h-6 w-6 text-purple-600 mx-auto mb-2" />
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
                                    <strong className="text-gray-900">Scraping Direction:</strong>
                                    <div className="flex items-center mt-1">
                                      <ArrowRight className="h-4 w-4 text-gray-500 mr-2" />
                                      <p className="text-gray-700 text-sm">{area.scrapingDirection}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <strong className="text-gray-900">Duration:</strong>
                                      <p className="text-gray-700 text-sm">{area.duration}</p>
                                    </div>
                                    <div>
                                      <strong className="text-gray-900">Stroke Length:</strong>
                                      <p className="text-gray-700 text-sm">{area.strokeLength}</p>
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
                                  <h5 className="font-medium text-gray-900 mb-3">Technique Specifications</h5>
                                  
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">Pressure:</span>
                                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPressureColor(area.pressure)}`}>
                                        {area.pressure}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">Tool Type:</span>
                                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getToolColor(area.toolType)}`}>
                                        {area.toolType.replace('_', ' ')}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">Oil Required:</span>
                                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        area.oilRequired ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {area.oilRequired ? 'Yes' : 'No'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                  <h5 className="font-medium text-amber-900 mb-2">Pressure Guide</h5>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                                      <span>Light: Gentle scraping, minimal sha</span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                                      <span>Moderate: Firm scraping, visible sha</span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                                      <span>Firm: Strong scraping, prominent sha</span>
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

                    {/* Safety & Marking Information */}
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

                      {/* Expected Sha Marking */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h3 className="font-semibold text-amber-900 mb-3">Expected Sha Marking</h3>
                        <p className="text-amber-800 text-sm leading-relaxed mb-3">{protocol.expectedShaMarking}</p>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-pink-300 rounded-full mr-2"></div>
                            <span>Light pink: Good circulation, minimal stagnation</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                            <span>Red: Moderate stagnation, normal therapeutic response</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                            <span>Dark red/purple: Significant stagnation, strong response</span>
                          </div>
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

                    {/* Clinical Notes & Post-Treatment */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Clinical Notes
                        </h3>
                        <p className="text-green-800 text-sm leading-relaxed">{protocol.clinicalNotes}</p>
                      </div>

                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h3 className="font-semibold text-orange-900 mb-3">Post-Treatment Care</h3>
                        <p className="text-orange-800 text-sm leading-relaxed">{protocol.postTreatmentCare}</p>
                      </div>
                    </div>

                    {/* Follow-up Guidance */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Follow-up & Monitoring</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{protocol.followUpGuidance}</p>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Waves className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Gua Sha Protocol</h2>
              <p className="text-gray-600">
                Choose a condition from the left panel to view detailed Gua Sha treatment protocols.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Gua Sha Technique Guidelines */}
      <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-emerald-900 mb-4">Essential Gua Sha Technique Guidelines</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-medium text-emerald-900 mb-2">Tool Preparation</h4>
            <ul className="text-emerald-800 text-sm space-y-1">
              <li>• Clean and sterilize tools</li>
              <li>• Check for smooth edges</li>
              <li>• Warm tool slightly if cold</li>
              <li>• Have multiple tools available</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-emerald-900 mb-2">Scraping Technique</h4>
            <ul className="text-emerald-800 text-sm space-y-1">
              <li>• Hold tool at 45-degree angle</li>
              <li>• Apply steady, even pressure</li>
              <li>• Use long, smooth strokes</li>
              <li>• Follow meridian directions</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-emerald-900 mb-2">Pressure Application</h4>
            <ul className="text-emerald-800 text-sm space-y-1">
              <li>• Start with light pressure</li>
              <li>• Increase gradually as tolerated</li>
              <li>• Maintain consistent pressure</li>
              <li>• Stop if patient experiences pain</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-emerald-900 mb-2">Stroke Patterns</h4>
            <ul className="text-emerald-800 text-sm space-y-1">
              <li>• Unidirectional strokes preferred</li>
              <li>• Overlap strokes by 50%</li>
              <li>• Cover entire treatment area</li>
              <li>• End with integrative strokes</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Stop Treatment Immediately If:
          </h4>
          <ul className="text-red-800 text-sm space-y-1">
            <li>• Skin breaks or bleeds</li>
            <li>• Patient experiences severe pain</li>
            <li>• Excessive bruising occurs</li>
            <li>• Patient feels faint or dizzy</li>
            <li>• Any adverse reaction develops</li>
          </ul>
        </div>

        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">Tool Selection Guide</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-200 rounded mx-auto mb-1"></div>
              <strong>Smooth Edge</strong><br />
              General use, beginners
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-200 rounded mx-auto mb-1"></div>
              <strong>Coin Edge</strong><br />
              Traditional, moderate pressure
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-amber-200 rounded mx-auto mb-1"></div>
              <strong>Horn</strong><br />
              Traditional, warming effect
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-emerald-200 rounded mx-auto mb-1"></div>
              <strong>Jade</strong><br />
              Cooling, facial work
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-1"></div>
              <strong>Stainless Steel</strong><br />
              Hygienic, professional
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuaShaProtocols;
