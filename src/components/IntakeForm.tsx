import React, { useState, useEffect } from 'react';
import { PatientIntake, IntakeFormSection } from '../types/intake';
import { User, Heart, Brain, Activity, Target, FileText, Save, ArrowRight, ArrowLeft } from 'lucide-react';

interface IntakeFormProps {
  intake?: PatientIntake;
  onSave: (intake: PatientIntake) => void;
  onCancel: () => void;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ intake, onSave, onCancel }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<PatientIntake>(
    intake || {
      id: `intake_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      basicInfo: {
        initials: '',
        age: 0,
        gender: 'prefer_not_to_say'
      },
      chiefComplaint: {
        primaryConcern: '',
        duration: '',
        severity: 5,
        onsetType: 'unknown'
      },
      healthHistory: {},
      tcmAssessment: {
        constitution: 'unknown'
      },
      physicalAssessment: {
        painAreas: []
      },
      lifestyle: {},
      treatmentPreferences: {
        primaryGoals: []
      }
    }
  );

  const sections: IntakeFormSection[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'General demographic information',
      completed: !!formData.basicInfo.initials && !!formData.basicInfo.age,
      required: true
    },
    {
      id: 'complaint',
      title: 'Chief Complaint',
      description: 'Primary concern and symptoms',
      completed: !!formData.chiefComplaint.primaryConcern && !!formData.chiefComplaint.duration,
      required: true
    },
    {
      id: 'health',
      title: 'Health History',
      description: 'Medical history and current conditions',
      completed: true, // Optional section
      required: false
    },
    {
      id: 'tcm',
      title: 'TCM Assessment',
      description: 'Traditional Chinese Medicine evaluation',
      completed: formData.tcmAssessment.constitution !== 'unknown',
      required: false
    },
    {
      id: 'physical',
      title: 'Physical Assessment',
      description: 'Physical examination findings',
      completed: true, // Optional section
      required: false
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle Factors',
      description: 'Daily habits and environmental factors',
      completed: true, // Optional section
      required: false
    },
    {
      id: 'preferences',
      title: 'Treatment Preferences',
      description: 'Goals and treatment preferences',
      completed: formData.treatmentPreferences.primaryGoals.length > 0,
      required: true
    }
  ];

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof PatientIntake], ...data },
      updatedAt: new Date().toISOString()
    }));
  };

  const addPainArea = () => {
    const newPainArea = {
      location: '',
      type: 'dull' as const,
      intensity: 5 as const,
      timing: 'constant' as const
    };
    
    setFormData(prev => ({
      ...prev,
      physicalAssessment: {
        ...prev.physicalAssessment,
        painAreas: [...(prev.physicalAssessment.painAreas || []), newPainArea]
      }
    }));
  };

  const updatePainArea = (index: number, data: any) => {
    setFormData(prev => ({
      ...prev,
      physicalAssessment: {
        ...prev.physicalAssessment,
        painAreas: prev.physicalAssessment.painAreas?.map((area, i) =>
          i === index ? { ...area, ...data } : area
        ) || []
      }
    }));
  };

  const removePainArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      physicalAssessment: {
        ...prev.physicalAssessment,
        painAreas: prev.physicalAssessment.painAreas?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const canProceed = () => {
    const section = sections[currentSection];
    return !section.required || section.completed;
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient Initials *
          </label>
          <input
            type="text"
            value={formData.basicInfo.initials}
            onChange={(e) => updateFormData('basicInfo', { initials: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
            placeholder="e.g., J.D."
            maxLength={10}
          />
          <p className="text-xs text-gray-500 mt-1">Initials only for privacy protection</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age *
          </label>
          <input
            type="number"
            value={formData.basicInfo.age || ''}
            onChange={(e) => updateFormData('basicInfo', { age: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
            min="0"
            max="120"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={formData.basicInfo.gender}
            onChange={(e) => updateFormData('basicInfo', { gender: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
          >
            <option value="prefer_not_to_say">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupation
          </label>
          <input
            type="text"
            value={formData.basicInfo.occupation || ''}
            onChange={(e) => updateFormData('basicInfo', { occupation: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How did you hear about us?
        </label>
        <input
          type="text"
          value={formData.basicInfo.referralSource || ''}
          onChange={(e) => updateFormData('basicInfo', { referralSource: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
          placeholder="Optional - referral source"
        />
      </div>
    </div>
  );

  const renderChiefComplaint = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Concern *
        </label>
        <textarea
          value={formData.chiefComplaint.primaryConcern}
          onChange={(e) => updateFormData('chiefComplaint', { primaryConcern: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
          rows={4}
          placeholder="Describe your main health concern or reason for seeking treatment..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration *
          </label>
          <input
            type="text"
            value={formData.chiefComplaint.duration}
            onChange={(e) => updateFormData('chiefComplaint', { duration: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
            placeholder="e.g., 2 weeks, 3 months, 1 year"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Onset Type
          </label>
          <select
            value={formData.chiefComplaint.onsetType}
            onChange={(e) => updateFormData('chiefComplaint', { onsetType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
          >
            <option value="unknown">Unknown</option>
            <option value="gradual">Gradual onset</option>
            <option value="sudden">Sudden onset</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Severity Level: {formData.chiefComplaint.severity}/10
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.chiefComplaint.severity}
          onChange={(e) => updateFormData('chiefComplaint', { severity: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 - Mild</span>
          <span>5 - Moderate</span>
          <span>10 - Severe</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Known Triggers
        </label>
        <textarea
          value={formData.chiefComplaint.triggers?.join(', ') || ''}
          onChange={(e) => updateFormData('chiefComplaint', { 
            triggers: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
          rows={2}
          placeholder="Separate multiple triggers with commas..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Previous Treatments Tried
        </label>
        <textarea
          value={formData.chiefComplaint.previousTreatments?.join(', ') || ''}
          onChange={(e) => updateFormData('chiefComplaint', { 
            previousTreatments: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
          rows={2}
          placeholder="List previous treatments, medications, therapies..."
        />
      </div>
    </div>
  );

  const renderTreatmentPreferences = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Treatment Goals *
        </label>
        <textarea
          value={formData.treatmentPreferences.primaryGoals.join(', ')}
          onChange={(e) => updateFormData('treatmentPreferences', { 
            primaryGoals: e.target.value.split(',').map(g => g.trim()).filter(g => g) 
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
          rows={3}
          placeholder="What do you hope to achieve? Separate multiple goals with commas..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Treatment Modalities
        </label>
        <div className="grid grid-cols-2 gap-4">
          {['acupressure', 'cupping', 'gua_sha', 'applied_kinesiology'].map((modality) => (
            <label key={modality} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.treatmentPreferences.modalityPreferences?.includes(modality as any) || false}
                onChange={(e) => {
                  const current = formData.treatmentPreferences.modalityPreferences || [];
                  const updated = e.target.checked
                    ? [...current, modality as any]
                    : current.filter(m => m !== modality);
                  updateFormData('treatmentPreferences', { modalityPreferences: updated });
                }}
                className="mr-2"
              />
              <span className="capitalize">{modality.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pressure Preference
        </label>
        <select
          value={formData.treatmentPreferences.pressurePreference || 'moderate'}
          onChange={(e) => updateFormData('treatmentPreferences', { pressurePreference: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
        >
          <option value="light">Light pressure</option>
          <option value="moderate">Moderate pressure</option>
          <option value="firm">Firm pressure</option>
          <option value="varies">Varies by area</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Concerns or Questions
        </label>
        <textarea
          value={formData.treatmentPreferences.concerns?.join(', ') || ''}
          onChange={(e) => updateFormData('treatmentPreferences', { 
            concerns: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
          rows={3}
          placeholder="Any concerns about treatment, questions, or special considerations..."
        />
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (currentSection) {
      case 0: return renderBasicInfo();
      case 1: return renderChiefComplaint();
      case 2: return <div className="text-gray-500">Health History section - Coming soon</div>;
      case 3: return <div className="text-gray-500">TCM Assessment section - Coming soon</div>;
      case 4: return <div className="text-gray-500">Physical Assessment section - Coming soon</div>;
      case 5: return <div className="text-gray-500">Lifestyle Factors section - Coming soon</div>;
      case 6: return renderTreatmentPreferences();
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Intake Form</h1>
            <p className="text-gray-600">Comprehensive health assessment</p>
          </div>
          <div className="text-sm text-gray-500">
            Section {currentSection + 1} of {sections.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{sections[currentSection].title}</span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentSection + 1) / sections.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-tcm-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Section Navigation */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                index === currentSection
                  ? 'bg-tcm-accent text-white'
                  : section.completed
                  ? 'bg-green-100 text-green-800'
                  : section.required
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {section.title}
              {section.required && !section.completed && ' *'}
              {section.completed && ' ✓'}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {sections[currentSection].title}
          </h2>
          <p className="text-gray-600">{sections[currentSection].description}</p>
        </div>

        {renderSectionContent()}
      </div>

      {/* Navigation Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
        <button
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-tcm-accent text-white rounded-md hover:bg-tcm-accent-dark"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Progress
          </button>

          {currentSection < sections.length - 1 ? (
            <button
              onClick={() => setCurrentSection(currentSection + 1)}
              disabled={!canProceed()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Complete Intake
              <FileText className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntakeForm;
