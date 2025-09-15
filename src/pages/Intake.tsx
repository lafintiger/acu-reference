import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, FileText, Eye, Trash2, Calendar, User, AlertTriangle, Brain } from 'lucide-react';
import LocalAIAssistant from '../components/LocalAIAssistant';
import { PatientIntake } from '../types/intake';
import { intakeDb } from '../lib/intakeDatabase';
import IntakeForm from '../components/IntakeForm';

const Intake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'form' | 'view'>('list');
  const [intakeRecords, setIntakeRecords] = useState<any[]>([]);
  const [currentIntake, setCurrentIntake] = useState<PatientIntake | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntakeRecords();
    
    if (id) {
      const intake = intakeDb.getIntakeRecord(id);
      if (intake) {
        setCurrentIntake(intake);
        setView('view');
      }
    }
  }, [id]);

  const loadIntakeRecords = () => {
    setLoading(true);
    try {
      const records = intakeDb.getAllIntakeRecords();
      setIntakeRecords(records);
    } catch (error) {
      console.error('Failed to load intake records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewIntake = () => {
    setCurrentIntake(undefined);
    setView('form');
  };

  const handleEditIntake = (intake: PatientIntake) => {
    setCurrentIntake(intake);
    setView('form');
  };

  const handleViewIntake = (intakeId: string) => {
    const intake = intakeDb.getIntakeRecord(intakeId);
    if (intake) {
      setCurrentIntake(intake);
      setView('view');
      navigate(`/intake/${intakeId}`);
    }
  };

  const handleSaveIntake = (intake: PatientIntake) => {
    try {
      intakeDb.saveIntakeRecord(intake);
      loadIntakeRecords();
      setView('list');
      navigate('/intake');
    } catch (error) {
      console.error('Failed to save intake:', error);
      alert('Failed to save intake record. Please try again.');
    }
  };

  const handleDeleteIntake = (intakeId: string) => {
    if (confirm('Are you sure you want to delete this intake record? This action cannot be undone.')) {
      try {
        intakeDb.deleteIntakeRecord(intakeId);
        loadIntakeRecords();
        if (currentIntake?.id === intakeId) {
          setView('list');
          navigate('/intake');
        }
      } catch (error) {
        console.error('Failed to delete intake:', error);
        alert('Failed to delete intake record. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setView('list');
    navigate('/intake');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderIntakeList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Intake</h1>
          <p className="text-gray-600 mt-1">Manage patient intake forms and assessments</p>
        </div>
        <button
          onClick={handleNewIntake}
          className="flex items-center px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Intake
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Privacy Protection</h3>
            <p className="text-yellow-700 text-sm mt-1">
              All intake data is stored locally on your device only. Patient information never leaves your computer 
              and is not uploaded to any servers. Only initials are used for patient identification to protect privacy.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-tcm-accent mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{intakeRecords.length}</div>
              <div className="text-sm text-gray-600">Total Intakes</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {intakeRecords.filter(r => {
                  const date = new Date(r.createdAt);
                  const today = new Date();
                  return date.toDateString() === today.toDateString();
                }).length}
              </div>
              <div className="text-sm text-gray-600">Today</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {intakeRecords.filter(r => {
                  const date = new Date(r.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return date >= weekAgo;
                }).length}
              </div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Intake Records Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Intake Records</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tcm-accent mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading intake records...</p>
          </div>
        ) : intakeRecords.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No intake records yet</h3>
            <p className="text-gray-600 mb-4">Create your first patient intake to get started.</p>
            <button
              onClick={handleNewIntake}
              className="px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark"
            >
              Create First Intake
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {intakeRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-tcm-accent flex items-center justify-center">
                            <span className="text-white font-medium">
                              {record.initials}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Patient {record.initials}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {record.id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewIntake(record.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View intake"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            const intake = intakeDb.getIntakeRecord(record.id);
                            if (intake) handleEditIntake(intake);
                          }}
                          className="text-tcm-accent hover:text-tcm-accent-dark"
                          title="Edit intake"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIntake(record.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete intake"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderIntakeView = () => {
    if (!currentIntake) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Patient {currentIntake.basicInfo.initials}
            </h1>
            <p className="text-gray-600 mt-1">
              Intake completed on {formatDate(currentIntake.createdAt)}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleEditIntake(currentIntake)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={() => setView('list')}
              className="px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark"
            >
              Back to List
            </button>
          </div>
        </div>

        {/* Intake Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{currentIntake.basicInfo.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium capitalize">{currentIntake.basicInfo.gender.replace('_', ' ')}</span>
              </div>
              {currentIntake.basicInfo.occupation && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Occupation:</span>
                  <span className="font-medium">{currentIntake.basicInfo.occupation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chief Complaint</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 text-sm">Primary Concern:</span>
                <p className="font-medium">{currentIntake.chiefComplaint.primaryConcern}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 text-sm">Duration:</span>
                  <p className="font-medium">{currentIntake.chiefComplaint.duration}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Severity:</span>
                  <p className="font-medium">{currentIntake.chiefComplaint.severity}/10</p>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Goals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Goals</h3>
            <div className="space-y-2">
              {currentIntake.treatmentPreferences.primaryGoals.map((goal, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-tcm-accent mr-2">•</span>
                  <span>{goal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modality Preferences */}
          {currentIntake.treatmentPreferences.modalityPreferences && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Modalities</h3>
              <div className="flex flex-wrap gap-2">
                {currentIntake.treatmentPreferences.modalityPreferences.map((modality) => (
                  <span
                    key={modality}
                    className="px-3 py-1 bg-tcm-light text-tcm-accent rounded-full text-sm capitalize"
                  >
                    {modality.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Brain className="h-5 w-5 text-green-600 mr-2" />
              AI Treatment Analysis
            </h3>
            <button
              onClick={() => navigate(`/intake/${currentIntake.id}/analysis`)}
              className="px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark text-sm"
            >
              Full Analysis Page
            </button>
          </div>
          
          <LocalAIAssistant 
            patientData={currentIntake}
            currentCondition={currentIntake.chiefComplaint.primaryConcern}
            compact={true}
          />
        </div>
      </div>
    );
  };

  if (view === 'form') {
    return (
      <IntakeForm
        intake={currentIntake}
        onSave={handleSaveIntake}
        onCancel={handleCancel}
      />
    );
  }

  if (view === 'view') {
    return renderIntakeView();
  }

  return renderIntakeList();
};

export default Intake;
