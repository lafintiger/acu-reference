import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, Target, AlertTriangle, CheckCircle, ArrowLeft, FileText, Download } from 'lucide-react';
import { PatientIntake, IntakeAnalysis as IntakeAnalysisType, TreatmentRecommendation } from '../types/intake';
import { intakeDb } from '../lib/intakeDatabase';
import { IntakeAnalyzer } from '../lib/intakeAnalyzer';

const IntakeAnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intake, setIntake] = useState<PatientIntake | null>(null);
  const [analysis, setAnalysis] = useState<IntakeAnalysisType | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      loadIntakeAndAnalysis(id);
    }
  }, [id]);

  const loadIntakeAndAnalysis = (intakeId: string) => {
    setLoading(true);
    try {
      const intakeRecord = intakeDb.getIntakeRecord(intakeId);
      if (intakeRecord) {
        setIntake(intakeRecord);
        
        // Check if analysis already exists
        const existingAnalysis = intakeDb.getIntakeAnalysis(intakeId);
        if (existingAnalysis) {
          setAnalysis(existingAnalysis);
        }
      } else {
        navigate('/intake');
      }
    } catch (error) {
      console.error('Failed to load intake:', error);
      navigate('/intake');
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysis = async () => {
    if (!intake) return;
    
    setGenerating(true);
    try {
      const newAnalysis = IntakeAnalyzer.analyzeIntake(intake);
      intakeDb.saveIntakeAnalysis(newAnalysis);
      setAnalysis(newAnalysis);
    } catch (error) {
      console.error('Failed to generate analysis:', error);
      alert('Failed to generate analysis. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const exportAnalysis = () => {
    if (!intake || !analysis) return;

    const exportData = {
      patient: {
        initials: intake.basicInfo.initials,
        age: intake.basicInfo.age,
        gender: intake.basicInfo.gender
      },
      chiefComplaint: intake.chiefComplaint.primaryConcern,
      analysis: analysis,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `treatment_analysis_${intake.basicInfo.initials}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'acupressure': return '👆';
      case 'cupping': return '🥤';
      case 'gua_sha': return '🪨';
      case 'applied_kinesiology': return '💪';
      default: return '🔧';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tcm-accent"></div>
        <span className="ml-3 text-gray-600">Loading intake analysis...</span>
      </div>
    );
  }

  if (!intake) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Intake record not found.</p>
        <button
          onClick={() => navigate('/intake')}
          className="mt-4 px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark"
        >
          Back to Intake List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/intake/${id}`)}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Treatment Analysis - Patient {intake.basicInfo.initials}
              </h1>
              <p className="text-gray-600 mt-1">
                AI-powered treatment recommendations based on intake assessment
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {analysis && (
            <button
              onClick={exportAnalysis}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          )}
          
          <button
            onClick={generateAnalysis}
            disabled={generating}
            className="flex items-center px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark disabled:opacity-50"
          >
            <Brain className="h-4 w-4 mr-2" />
            {generating ? 'Analyzing...' : analysis ? 'Regenerate Analysis' : 'Generate Analysis'}
          </button>
        </div>
      </div>

      {/* Patient Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-gray-600 text-sm">Chief Complaint:</span>
            <p className="font-medium">{intake.chiefComplaint.primaryConcern}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Duration:</span>
            <p className="font-medium">{intake.chiefComplaint.duration}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Severity:</span>
            <p className="font-medium">{intake.chiefComplaint.severity}/10</p>
          </div>
        </div>
      </div>

      {analysis ? (
        <div className="space-y-6">
          {/* TCM Pattern */}
          {analysis.tcmPattern && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">TCM Pattern Analysis</h2>
              <div className="bg-tcm-light rounded-lg p-4">
                <p className="text-tcm-accent font-semibold text-lg">{analysis.tcmPattern}</p>
                <p className="text-gray-600 text-sm mt-1">
                  Primary constitutional pattern identified based on assessment
                </p>
              </div>
            </div>
          )}

          {/* Primary Indications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Primary Indications</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.primaryIndications.map((indication, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm capitalize"
                >
                  {indication.replace('_', ' ')}
                </span>
              ))}
            </div>
            
            {analysis.secondaryIndications.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-2">Secondary Indications</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.secondaryIndications.map((indication, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm capitalize"
                    >
                      {indication.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Treatment Recommendations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Treatment Recommendations</h2>
            
            <div className="space-y-6">
              {analysis.recommendedTreatments.map((treatment, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getModalityIcon(treatment.modality)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {treatment.modality.replace('_', ' ')}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(treatment.priority)}`}>
                          {treatment.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{treatment.reasoning}</p>

                  {treatment.points.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">Recommended Points/Areas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {treatment.points.map((point, pointIndex) => (
                          <span
                            key={pointIndex}
                            className="px-2 py-1 bg-tcm-light text-tcm-accent rounded text-sm font-mono"
                          >
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {treatment.techniques.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">Techniques:</h4>
                      <ul className="list-disc list-inside text-gray-700 text-sm">
                        {treatment.techniques.map((technique, techIndex) => (
                          <li key={techIndex}>{technique}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {treatment.contraindications && treatment.contraindications.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800">Contraindications:</h4>
                          <ul className="text-red-700 text-sm">
                            {treatment.contraindications.map((contra, contraIndex) => (
                              <li key={contraIndex}>• {contra.replace('_', ' ')}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Safety Considerations */}
          {analysis.safetyConsiderations.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                Safety Considerations
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {analysis.safetyConsiderations.map((consideration, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">⚠️</span>
                      <span className="text-yellow-800">{consideration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Lifestyle Recommendations */}
          {analysis.lifestyleRecommendations.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 text-green-600 mr-2" />
                Lifestyle Recommendations
              </h2>
              <div className="space-y-2">
                {analysis.lifestyleRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <span className="text-gray-700">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Suggestions */}
          {analysis.followUpSuggestions.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                Follow-up Suggestions
              </h2>
              <div className="space-y-2">
                {analysis.followUpSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">📋</span>
                    <span className="text-gray-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Generate Treatment Analysis</h2>
          <p className="text-gray-600 mb-6">
            Use AI-powered analysis to generate personalized treatment recommendations 
            based on the patient's intake information.
          </p>
          <button
            onClick={generateAnalysis}
            disabled={generating}
            className="px-6 py-3 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark disabled:opacity-50"
          >
            {generating ? 'Analyzing...' : 'Start Analysis'}
          </button>
        </div>
      )}
    </div>
  );
};

export default IntakeAnalysisPage;
