import { useState } from 'react';
import { Activity, Clock, Target, AlertTriangle, CheckCircle, Brain, Zap } from 'lucide-react';
import { appliedKinesiologyProtocols } from '../data/appliedKinesiologyProtocols';

const AppliedKinesiologyProtocols = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<string>('');

  const protocolCategories = {
    'Structural & Pain': ['back_pain', 'headache'],
    'Energy & Vitality': ['fatigue'],
    'Emotional Wellness': ['anxiety'],
    'Digestive Health': ['digestive_disorders']
  };

  const getProtocolById = (id: string) => {
    return appliedKinesiologyProtocols.find(p => p.indicationId === id);
  };

  const getCorrectionTypeColor = (type: string) => {
    switch (type) {
      case 'neurolymphatic': return 'bg-blue-100 text-blue-800';
      case 'neurovascular': return 'bg-purple-100 text-purple-800';
      case 'meridian_tracing': return 'bg-green-100 text-green-800';
      case 'emotional_stress_release': return 'bg-pink-100 text-pink-800';
      case 'structural': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Applied Kinesiology Protocols</h1>
        <p className="text-gray-600">Muscle testing and correction techniques for functional assessment</p>
      </div>

      {/* Protocol Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assessment Categories</h2>
          
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
                          {protocol.protocolName.replace(' AK Protocol', '')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {protocol.primaryAssessments.length} assessments • {protocol.totalDuration}
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
                    <Activity className="h-6 w-6 text-tcm-accent mr-3" />
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
                        <div className="font-semibold text-green-900">Assessments</div>
                        <div className="text-green-800 text-sm">{protocol.primaryAssessments.length} muscle tests</div>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                        <Brain className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <div className="font-semibold text-purple-900">Corrections</div>
                        <div className="text-purple-800 text-sm">{protocol.corrections.length} techniques</div>
                      </div>
                    </div>

                    {/* Primary Assessments */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Primary Muscle Assessments</h3>
                      <div className="space-y-4">
                        {protocol.primaryAssessments.map((assessment, index) => (
                          <div key={assessment.muscleName} className="border border-gray-200 rounded-lg p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Assessment Details */}
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                  {index + 1}. {assessment.muscleName}
                                </h4>
                                
                                <div className="space-y-3">
                                  <div>
                                    <strong className="text-gray-900">Location:</strong>
                                    <p className="text-gray-700 text-sm mt-1">{assessment.anatomicalLocation}</p>
                                  </div>
                                  
                                  <div>
                                    <strong className="text-gray-900">Testing Position:</strong>
                                    <p className="text-gray-700 text-sm mt-1">{assessment.testingPosition}</p>
                                  </div>
                                  
                                  <div>
                                    <strong className="text-gray-900">Testing Procedure:</strong>
                                    <p className="text-gray-700 text-sm mt-1">{assessment.testingProcedure}</p>
                                  </div>
                                  
                                  <div>
                                    <strong className="text-gray-900">Normal Response:</strong>
                                    <p className="text-gray-700 text-sm mt-1">{assessment.normalResponse}</p>
                                  </div>
                                  
                                  {assessment.notes && (
                                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                      <strong className="text-gray-900">Clinical Notes:</strong>
                                      <p className="text-gray-700 text-sm mt-1">{assessment.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* TCM Associations */}
                              <div className="space-y-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                  <h5 className="font-medium text-green-900 mb-3">TCM Associations</h5>
                                  
                                  <div className="space-y-2 text-sm">
                                    {assessment.associatedMeridian && (
                                      <div>
                                        <strong className="text-green-900">Meridian:</strong>
                                        <span className="text-green-800 ml-2">{assessment.associatedMeridian}</span>
                                      </div>
                                    )}
                                    
                                    {assessment.associatedOrgan && (
                                      <div>
                                        <strong className="text-green-900">Organ System:</strong>
                                        <span className="text-green-800 ml-2">{assessment.associatedOrgan}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                  <h5 className="font-medium text-red-900 mb-2">Weakness Indicates</h5>
                                  <p className="text-red-800 text-sm">{assessment.weaknessIndicates}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Correction Techniques */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Correction Techniques</h3>
                      <div className="space-y-4">
                        {protocol.corrections.map((correction, index) => (
                          <div key={correction.correctionType} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {index + 1}. {correction.correctionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </h4>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCorrectionTypeColor(correction.correctionType)}`}>
                                {correction.correctionType.replace('_', ' ')}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <div>
                                  <strong className="text-gray-900">Target Area:</strong>
                                  <p className="text-gray-700 text-sm mt-1">{correction.targetArea}</p>
                                </div>
                                
                                <div>
                                  <strong className="text-gray-900">Procedure:</strong>
                                  <p className="text-gray-700 text-sm mt-1">{correction.procedure}</p>
                                </div>
                                
                                <div>
                                  <strong className="text-gray-900">Duration:</strong>
                                  <p className="text-gray-700 text-sm mt-1">{correction.duration}</p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <strong className="text-gray-900">Expected Outcome:</strong>
                                  <p className="text-gray-700 text-sm mt-1">{correction.expectedOutcome}</p>
                                </div>
                                
                                <div>
                                  <strong className="text-gray-900">Retest Procedure:</strong>
                                  <p className="text-gray-700 text-sm mt-1">{correction.retestProcedure}</p>
                                </div>
                                
                                {correction.notes && (
                                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                    <strong className="text-blue-900">Notes:</strong>
                                    <p className="text-blue-800 text-sm mt-1">{correction.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Treatment Sequence */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Assessment & Treatment Sequence</h3>
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

                    {/* Integration Exercises */}
                    {protocol.integrationExercises && protocol.integrationExercises.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                          <Zap className="h-5 w-5 mr-2" />
                          Integration Exercises
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {protocol.integrationExercises.map((exercise, index) => (
                            <div key={exercise.exerciseName} className="bg-white border border-green-200 rounded p-4">
                              <h4 className="font-medium text-green-900 mb-2">{exercise.exerciseName}</h4>
                              <p className="text-green-800 text-sm mb-2">{exercise.description}</p>
                              <div className="text-green-700 text-xs">
                                <strong>Duration:</strong> {exercise.duration}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
                          <h3 className="font-semibold text-blue-900 mb-3">Protocol Modifications</h3>
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
                        <h3 className="font-semibold text-gray-900 mb-3">Follow-up & Integration</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{protocol.followUpGuidance}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select an AK Protocol</h2>
              <p className="text-gray-600">
                Choose a condition from the left panel to view detailed Applied Kinesiology assessment and treatment protocols.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Applied Kinesiology Fundamentals */}
      <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4">Applied Kinesiology Fundamentals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-medium text-indigo-900 mb-2">Muscle Testing Basics</h4>
            <ul className="text-indigo-800 text-sm space-y-1">
              <li>• Clear, specific instructions</li>
              <li>• Proper patient positioning</li>
              <li>• Gradual pressure application</li>
              <li>• Test muscle, not patient's will</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-900 mb-2">Correction Techniques</h4>
            <ul className="text-indigo-800 text-sm space-y-1">
              <li>• Neurolymphatic reflex massage</li>
              <li>• Neurovascular contact points</li>
              <li>• Meridian tracing</li>
              <li>• Emotional stress release</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-900 mb-2">Integration Principles</h4>
            <ul className="text-indigo-800 text-sm space-y-1">
              <li>• Retest after each correction</li>
              <li>• Address primary patterns first</li>
              <li>• Include movement integration</li>
              <li>• Provide home care exercises</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-900 mb-2">Professional Standards</h4>
            <ul className="text-indigo-800 text-sm space-y-1">
              <li>• Obtain informed consent</li>
              <li>• Maintain professional boundaries</li>
              <li>• Document findings accurately</li>
              <li>• Refer when appropriate</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Important Considerations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-yellow-900">Patient Factors:</strong>
              <ul className="text-yellow-800 mt-1 space-y-1">
                <li>• Hydration status affects testing</li>
                <li>• Emotional state influences results</li>
                <li>• Fatigue can cause false weakness</li>
                <li>• Medications may affect muscle response</li>
              </ul>
            </div>
            <div>
              <strong className="text-yellow-900">Practitioner Factors:</strong>
              <ul className="text-yellow-800 mt-1 space-y-1">
                <li>• Maintain neutral, objective state</li>
                <li>• Use consistent testing pressure</li>
                <li>• Avoid leading the patient</li>
                <li>• Trust the muscle response</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            When to Refer or Stop Assessment:
          </h4>
          <ul className="text-red-800 text-sm space-y-1">
            <li>• Patient experiences significant pain during testing</li>
            <li>• Severe muscle weakness without clear cause</li>
            <li>• Neurological symptoms develop during assessment</li>
            <li>• Patient becomes emotionally overwhelmed</li>
            <li>• Findings suggest serious medical condition</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppliedKinesiologyProtocols;
