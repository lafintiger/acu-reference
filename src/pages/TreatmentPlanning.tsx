import React, { useState, useEffect } from 'react';
import { Target, Brain, Lightbulb, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { clinicalDiagnoses, tcmPatterns, getDiagnosesForSigns, getDiagnosesForSymptoms, getTCMPatternsForSymptoms } from '../data/clinical-diagnoses';
import { simpleDb } from '../lib/simpleDatabase';

const TreatmentPlanning = () => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>('');
  const [selectedTCMPattern, setSelectedTCMPattern] = useState<string>('');
  const [treatmentGoals, setTreatmentGoals] = useState<string[]>([]);
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
  const [treatmentNotes, setTreatmentNotes] = useState('');

  // Mock assessment data - in real implementation, this would come from Assessment page
  const mockAssessmentData = {
    signs: ['muscle_tension_neck', 'pulse_wiry'],
    symptoms: ['headache_tension', 'anxiety', 'neck_pain'],
    chapmanFindings: [
      { pointId: 'chapman_liver_anterior', severity: 7 },
      { pointId: 'chapman_adrenal_anterior', severity: 6 }
    ]
  };

  const [suggestedDiagnoses, setSuggestedDiagnoses] = useState<any[]>([]);
  const [suggestedTCMPatterns, setSuggestedTCMPatterns] = useState<any[]>([]);
  const [recommendedPoints, setRecommendedPoints] = useState<any[]>([]);

  useEffect(() => {
    // Generate suggestions based on assessment findings
    const diagnosesFromSigns = getDiagnosesForSigns(mockAssessmentData.signs);
    const diagnosesFromSymptoms = getDiagnosesForSymptoms(mockAssessmentData.symptoms);
    const tcmPatternsFromSymptoms = getTCMPatternsForSymptoms(mockAssessmentData.symptoms);

    // Combine and score suggestions
    const allSuggestions = [...diagnosesFromSigns, ...diagnosesFromSymptoms];
    const scoredDiagnoses = allSuggestions.map(diagnosis => {
      const signMatches = diagnosis.associatedSigns.filter(sign => 
        mockAssessmentData.signs.includes(sign)
      ).length;
      const symptomMatches = diagnosis.associatedSymptoms.filter(symptom => 
        mockAssessmentData.symptoms.includes(symptom)
      ).length;
      
      return {
        ...diagnosis,
        matchScore: signMatches + symptomMatches,
        confidence: Math.min(95, (signMatches + symptomMatches) * 25)
      };
    });

    setSuggestedDiagnoses(scoredDiagnoses.sort((a, b) => b.matchScore - a.matchScore));
    setSuggestedTCMPatterns(tcmPatternsFromSymptoms);
  }, []);

  useEffect(() => {
    // Update recommended points based on selected diagnosis and TCM pattern
    if (selectedDiagnosis || selectedTCMPattern) {
      const diagnosis = clinicalDiagnoses.find(d => d.id === selectedDiagnosis);
      const tcmPattern = tcmPatterns.find(p => p.id === selectedTCMPattern);
      
      let points: any[] = [];
      
      if (tcmPattern?.recommendedPoints) {
        points = tcmPattern.recommendedPoints.map(pointId => {
          const point = simpleDb.getPointById(pointId);
          return point ? { ...point, source: 'TCM Pattern' } : null;
        }).filter(Boolean);
      }
      
      // Add points based on symptoms if no TCM pattern selected
      if (!selectedTCMPattern && diagnosis) {
        const symptomPoints = diagnosis.associatedSymptoms.flatMap(symptomId => {
          const allPoints = simpleDb.getAllPoints();
          return allPoints.filter(point => 
            point.indications.some(indication => 
              indication.includes(symptomId) || symptomId.includes(indication)
            )
          ).slice(0, 3); // Top 3 points per symptom
        });
        
        points = [...points, ...symptomPoints.map(point => ({ ...point, source: 'Symptom-based' }))];
      }
      
      // Remove duplicates
      const uniquePoints = points.filter((point, index, self) => 
        index === self.findIndex(p => p.id === point.id)
      );
      
      setRecommendedPoints(uniquePoints);
    }
  }, [selectedDiagnosis, selectedTCMPattern]);

  const addTreatmentGoal = (goal: string) => {
    if (goal && !treatmentGoals.includes(goal)) {
      setTreatmentGoals([...treatmentGoals, goal]);
    }
  };

  const toggleModality = (modalityId: string) => {
    setSelectedModalities(prev => 
      prev.includes(modalityId)
        ? prev.filter(id => id !== modalityId)
        : [...prev, modalityId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Target className="h-8 w-8 text-tcm-accent mr-3" />
          Treatment Planning
        </h1>
        <p className="text-gray-600 mt-1">
          Evidence-based treatment protocol development from assessment findings
        </p>
      </div>

      {/* Assessment Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="font-semibold text-blue-900 mb-3">Assessment Findings Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-blue-900">Signs:</h3>
            <ul className="text-blue-800 space-y-1 mt-1">
              <li>• Neck muscle tension</li>
              <li>• Wiry pulse quality</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-900">Symptoms:</h3>
            <ul className="text-blue-800 space-y-1 mt-1">
              <li>• Tension headaches</li>
              <li>• Anxiety</li>
              <li>• Neck pain</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-900">Chapman Points:</h3>
            <ul className="text-blue-800 space-y-1 mt-1">
              <li>• Liver anterior (7/10)</li>
              <li>• Adrenal anterior (6/10)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Diagnostic Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Western Diagnoses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Brain className="h-5 w-5 text-blue-600 mr-2" />
            Suggested Diagnoses
          </h2>
          
          <div className="space-y-3">
            {suggestedDiagnoses.slice(0, 3).map(diagnosis => (
              <div
                key={diagnosis.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedDiagnosis === diagnosis.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDiagnosis(diagnosis.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{diagnosis.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{diagnosis.description}</p>
                    {diagnosis.confidence && (
                      <div className="mt-2 flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${diagnosis.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-blue-600 font-medium">
                          {diagnosis.confidence}% match
                        </span>
                      </div>
                    )}
                  </div>
                  {selectedDiagnosis === diagnosis.id && (
                    <CheckCircle className="h-5 w-5 text-blue-500 ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TCM Patterns */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 text-tcm-accent mr-2" />
            TCM Pattern Analysis
          </h2>
          
          <div className="space-y-3">
            {suggestedTCMPatterns.slice(0, 3).map(pattern => (
              <div
                key={pattern.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedTCMPattern === pattern.id
                    ? 'border-tcm-accent bg-tcm-light'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTCMPattern(pattern.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{pattern.name}</h3>
                    {pattern.chineseName && (
                      <p className="text-tcm-accent text-sm">{pattern.chineseName}</p>
                    )}
                    <p className="text-gray-600 text-sm mt-1">{pattern.description}</p>
                    
                    <div className="mt-2 space-y-1 text-xs">
                      <div><strong>Pulse:</strong> {pattern.pulseQuality}</div>
                      <div><strong>Tongue:</strong> {pattern.tonguePresentation}</div>
                    </div>
                  </div>
                  {selectedTCMPattern === pattern.id && (
                    <CheckCircle className="h-5 w-5 text-tcm-accent ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Points */}
      {recommendedPoints.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Treatment Points</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedPoints.map(point => (
              <div key={point.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{point.id}</h3>
                    <p className="text-sm text-gray-600">{point.nameEn}</p>
                    {point.nameCharacters && (
                      <p className="text-tcm-accent text-sm">{point.nameCharacters}</p>
                    )}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {point.source}
                  </span>
                </div>
                
                <p className="text-xs text-gray-700 mb-2">{point.location}</p>
                
                {point.acupressureDepth && (
                  <div className="text-xs text-blue-600">
                    <strong>Technique:</strong> {point.acupressureDepth}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Treatment Modalities Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Treatment Modalities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'acupressure', name: 'Acupressure', icon: '👆', description: 'Gentle, safe, self-administered' },
            { id: 'cupping', name: 'Cupping', icon: '🥤', description: 'Deep muscle relief, circulation' },
            { id: 'gua_sha', name: 'Gua Sha', icon: '🪨', description: 'Tension release, lymphatic drainage' },
            { id: 'applied_kinesiology', name: 'Applied Kinesiology', icon: '💪', description: 'Assessment and correction' }
          ].map(modality => (
            <div
              key={modality.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedModalities.includes(modality.id)
                  ? 'border-tcm-accent bg-tcm-light'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleModality(modality.id)}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{modality.icon}</div>
                <h3 className="font-medium text-gray-900 text-sm">{modality.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{modality.description}</p>
                {selectedModalities.includes(modality.id) && (
                  <CheckCircle className="h-4 w-4 text-tcm-accent mx-auto mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Goals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Treatment Goals</h2>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              'Reduce pain intensity',
              'Improve sleep quality', 
              'Decrease stress levels',
              'Enhance energy',
              'Improve mood',
              'Restore function'
            ].map(goal => (
              <button
                key={goal}
                onClick={() => addTreatmentGoal(goal)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
              >
                + {goal}
              </button>
            ))}
          </div>
          
          {treatmentGoals.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Selected Goals:</h3>
              <div className="flex flex-wrap gap-2">
                {treatmentGoals.map(goal => (
                  <span
                    key={goal}
                    className="px-3 py-1 bg-tcm-light text-tcm-accent rounded-full text-sm flex items-center"
                  >
                    {goal}
                    <button
                      onClick={() => setTreatmentGoals(prev => prev.filter(g => g !== goal))}
                      className="ml-2 text-tcm-accent hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Treatment Plan Summary */}
      {(selectedDiagnosis || selectedTCMPattern) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Treatment Plan Summary</h2>
          
          <div className="space-y-4">
            {selectedDiagnosis && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900">Primary Diagnosis:</h3>
                <p className="text-blue-800">
                  {clinicalDiagnoses.find(d => d.id === selectedDiagnosis)?.name}
                </p>
              </div>
            )}
            
            {selectedTCMPattern && (
              <div className="bg-tcm-light border border-tcm-accent rounded-lg p-4">
                <h3 className="font-semibold text-tcm-accent">TCM Pattern:</h3>
                <p className="text-gray-800">
                  {tcmPatterns.find(p => p.id === selectedTCMPattern)?.name}
                </p>
              </div>
            )}
            
            {recommendedPoints.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  Treatment Points ({recommendedPoints.length}):
                </h3>
                <div className="flex flex-wrap gap-1">
                  {recommendedPoints.map(point => (
                    <span key={point.id} className="px-2 py-1 bg-white text-green-800 rounded text-sm font-mono border border-green-200">
                      {point.id}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {selectedModalities.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Selected Modalities:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedModalities.map(modalityId => (
                    <span key={modalityId} className="px-3 py-1 bg-white text-purple-800 rounded-full text-sm border border-purple-200 capitalize">
                      {modalityId.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="flex justify-end">
              <button className="flex items-center px-6 py-3 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark">
                Proceed to Treatment Application
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentPlanning;
