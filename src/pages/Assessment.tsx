import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Stethoscope, Clipboard, Search, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { clinicalSigns, clinicalSymptoms, getSignsByCategory, getSymptomsByCategory } from '../data/signs-symptoms';
import { chapmanPoints } from '../data/chapman-points';
import { chapmanPointsPlugin } from '../plugins/diagnostic/chapman-points-plugin';

const Assessment = () => {
  const [activeTab, setActiveTab] = useState<'signs' | 'symptoms' | 'chapman' | 'summary'>('signs');
  const [selectedSigns, setSelectedSigns] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [chapmanFindings, setChapmanFindings] = useState<any[]>([]);
  const [assessmentNotes, setAssessmentNotes] = useState('');

  // Memoized event handlers to prevent unnecessary re-renders
  const toggleSign = useCallback((signId: string) => {
    setSelectedSigns(prev => 
      prev.includes(signId) 
        ? prev.filter(id => id !== signId)
        : [...prev, signId]
    );
  }, []);

  const toggleSymptom = useCallback((symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  }, []);

  const addChapmanFinding = useCallback((pointId: string, severity: number, notes: string) => {
    const finding = {
      pointId,
      severity,
      notes,
      dateRecorded: new Date().toISOString()
    };
    setChapmanFindings(prev => [...prev, finding]);
  }, []);

  // Memoized computations for better performance
  const signsByCategory = useMemo(() => getSignsByCategory(), []);
  const symptomsByCategory = useMemo(() => getSymptomsByCategory(), []);
  
  const assessmentSummary = useMemo(() => {
    const selectedSignsData = clinicalSigns.filter(sign => selectedSigns.includes(sign.id));
    const selectedSymptomsData = clinicalSymptoms.filter(symptom => selectedSymptoms.includes(symptom.id));
    
    return {
      signsCount: selectedSigns.length,
      symptomsCount: selectedSymptoms.length,
      chapmanCount: chapmanFindings.length,
      totalFindings: selectedSigns.length + selectedSymptoms.length + chapmanFindings.length,
      selectedSignsData,
      selectedSymptomsData
    };
  }, [selectedSigns, selectedSymptoms, chapmanFindings]);

  const chapmanInterpretation = useMemo(() => {
    if (chapmanFindings.length === 0) return null;
    
    try {
      return chapmanPointsPlugin.interpretFindings(
        chapmanFindings.map(f => ({
          id: f.pointId,
          patientId: 'current',
          findingType: 'diagnostic_point' as const,
          referenceId: f.pointId,
          severity: f.severity,
          notes: f.notes,
          dateRecorded: f.dateRecorded
        }))
      );
    } catch (error) {
      console.error('Chapman interpretation error:', error);
      return 'Unable to interpret Chapman point findings';
    }
  }, [chapmanFindings]);

  const getSeverityColor = useCallback((severity: number) => {
    if (severity >= 8) return 'text-red-600';
    if (severity >= 6) return 'text-orange-600';
    if (severity >= 4) return 'text-yellow-600';
    return 'text-green-600';
  }, []);

  const renderSigns = () => (
    <div className="space-y-6">
      {/* Categories */}
      {(['vital_signs', 'physical_exam', 'observation', 'palpation'] as const).map(category => (
        <div key={category} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            {category.replace('_', ' ')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getSignsByCategory(category).map(sign => (
              <div
                key={sign.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedSigns.includes(sign.id)
                    ? 'border-tcm-accent bg-tcm-light'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleSign(sign.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{sign.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">{sign.description}</p>
                    {sign.normalRange && (
                      <p className="text-blue-600 text-xs mt-2">
                        <strong>Normal:</strong> {sign.normalRange}
                      </p>
                    )}
                  </div>
                  {selectedSigns.includes(sign.id) && (
                    <CheckCircle className="h-5 w-5 text-tcm-accent ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSymptoms = () => (
    <div className="space-y-6">
      {(['pain', 'functional', 'emotional', 'sensory', 'systemic'] as const).map(category => (
        <div key={category} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            {category} Symptoms
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getSymptomsByCategory(category).map(symptom => (
              <div
                key={symptom.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedSymptoms.includes(symptom.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleSymptom(symptom.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{symptom.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">{symptom.description}</p>
                    
                    <div className="mt-2 space-y-1 text-xs">
                      <div className={`font-medium ${getSeverityColor(symptom.severity)}`}>
                        Severity: {symptom.severity}/10
                      </div>
                      <div className="text-gray-500">
                        Duration: {symptom.duration} • {symptom.frequency}
                      </div>
                    </div>
                    
                    {symptom.triggers && symptom.triggers.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-gray-700">Triggers: </span>
                        <span className="text-xs text-gray-600">
                          {symptom.triggers.slice(0, 3).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  {selectedSymptoms.includes(symptom.id) && (
                    <CheckCircle className="h-5 w-5 text-blue-500 ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderChapmanPoints = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Chapman Neurolymphatic Points Assessment</h3>
        <p className="text-blue-800 text-sm">
          Palpate each point for tenderness, nodular texture, or tissue congestion. 
          Positive findings indicate lymphatic drainage issues affecting associated organ systems.
        </p>
      </div>

      {/* Anterior Points */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Anterior Chapman Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapmanPoints.filter(point => point.location.includes('intercostal') || point.location.includes('umbilicus')).map(point => (
            <div key={point.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{point.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{point.location}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {point.associatedOrgan}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-700">
                  <strong>Method:</strong> {point.testingMethod}
                </div>
                
                <div className="text-xs">
                  <strong className="text-gray-700">Positive Findings:</strong>
                  <div className="mt-1 space-y-1">
                    {point.positiveFindings.map(finding => (
                      <div key={finding} className="text-gray-600">• {finding.replace('_', ' ')}</div>
                    ))}
                  </div>
                </div>
                
                {point.associatedMeridian && (
                  <div className="text-xs">
                    <strong className="text-tcm-accent">Related Meridian:</strong> {point.associatedMeridian}
                  </div>
                )}
              </div>

              {/* Quick Assessment */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Assessment:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(level => (
                      <button
                        key={level}
                        onClick={() => addChapmanFinding(point.id, level * 2, `${point.name} - Level ${level}`)}
                        className={`w-6 h-6 text-xs rounded ${
                          level <= 2 ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          level <= 3 ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                          'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Posterior Points */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Posterior Chapman Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapmanPoints.filter(point => point.location.includes('transverse')).map(point => (
            <div key={point.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{point.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{point.location}</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {point.associatedOrgan}
                </span>
              </div>
              
              <div className="text-xs text-gray-700 mb-3">
                <strong>Clinical Significance:</strong> {point.clinicalSignificance}
              </div>

              {/* Quick Assessment */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Assessment:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(level => (
                      <button
                        key={level}
                        onClick={() => addChapmanFinding(point.id, level * 2, `${point.name} - Level ${level}`)}
                        className={`w-6 h-6 text-xs rounded ${
                          level <= 2 ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          level <= 3 ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                          'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapman Findings Summary */}
      {chapmanFindings.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chapman Point Findings</h3>
          <div className="space-y-3">
            {chapmanFindings.map((finding, index) => {
              const point = chapmanPoints.find(p => p.id === finding.pointId);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{point?.name}</span>
                    <span className="text-sm text-gray-600 ml-2">({point?.associatedOrgan})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getSeverityColor(finding.severity)}`}>
                      {finding.severity}/10
                    </span>
                    <button
                      onClick={() => setChapmanFindings(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* AI Interpretation */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Clinical Interpretation:</h4>
            <p className="text-blue-800 text-sm">
              {chapmanPointsPlugin.interpretFindings(chapmanFindings.map(f => ({
                id: f.pointId,
                patientId: 'current',
                findingType: 'diagnostic_point' as const,
                referenceId: f.pointId,
                severity: f.severity,
                notes: f.notes,
                dateRecorded: f.dateRecorded
              })))}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      {/* Assessment Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Clinical Signs</h3>
            <div className="text-2xl font-bold text-tcm-accent">{selectedSigns.length}</div>
            <div className="text-sm text-gray-600">Objective findings</div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Symptoms</h3>
            <div className="text-2xl font-bold text-blue-600">{selectedSymptoms.length}</div>
            <div className="text-sm text-gray-600">Subjective reports</div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Chapman Points</h3>
            <div className="text-2xl font-bold text-purple-600">{chapmanFindings.length}</div>
            <div className="text-sm text-gray-600">Positive findings</div>
          </div>
        </div>
      </div>

      {/* Suggested Diagnoses */}
      {(selectedSigns.length > 0 || selectedSymptoms.length > 0 || chapmanFindings.length > 0) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Suggested Clinical Patterns</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              Based on assessment findings, consider investigating: 
              <strong> Stress-related disorders, Digestive dysfunction, Circulation issues</strong>
            </p>
            <div className="mt-2">
              <button className="px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark text-sm">
                → Proceed to Treatment Planning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Stethoscope className="h-8 w-8 text-tcm-accent mr-3" />
          Clinical Assessment
        </h1>
        <p className="text-gray-600 mt-1">
          Systematic collection of signs, symptoms, and diagnostic point findings
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Assessment Progress</span>
          <span className="text-sm text-gray-500">
            {selectedSigns.length + selectedSymptoms.length + chapmanFindings.length} findings recorded
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-tcm-accent h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(100, ((selectedSigns.length + selectedSymptoms.length + chapmanFindings.length) / 10) * 100)}%` 
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'signs', label: 'Clinical Signs', icon: Clipboard },
              { id: 'symptoms', label: 'Symptoms', icon: AlertTriangle },
              { id: 'chapman', label: 'Chapman Points', icon: Search },
              { id: 'summary', label: 'Summary', icon: CheckCircle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-tcm-accent text-tcm-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'signs' && renderSigns()}
          {activeTab === 'symptoms' && renderSymptoms()}
          {activeTab === 'chapman' && renderChapmanPoints()}
          {activeTab === 'summary' && renderSummary()}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
