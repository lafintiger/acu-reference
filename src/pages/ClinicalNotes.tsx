import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, Star, Filter, Download, Upload, Trash2, Edit, Plus } from 'lucide-react';
import { ClinicalNote, ClinicalInsight, TreatmentOutcome } from '../types/clinical-notes';
import { clinicalNotesDb } from '../lib/clinical-notes/notes-database';
import ClinicalNotesPanel from '../components/ClinicalNotesPanel';

const ClinicalNotes = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'insights' | 'outcomes' | 'preferences'>('notes');
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [insights, setInsights] = useState<ClinicalInsight[]>([]);
  const [outcomes, setOutcomes] = useState<TreatmentOutcome[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setNotes(clinicalNotesDb.getAllNotes());
    setInsights(clinicalNotesDb.getAllClinicalInsights());
    setOutcomes(clinicalNotesDb.getAllTreatmentOutcomes());
  };

  const exportClinicalData = () => {
    const data = clinicalNotesDb.exportClinicalData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical_notes_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        clinicalNotesDb.importClinicalData(data);
        loadData();
        alert('Clinical data imported successfully!');
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const filteredNotes = notes.filter(note => {
    const categoryMatch = filterCategory === 'all' || note.category === filterCategory;
    const typeMatch = filterType === 'all' || note.type === filterType;
    return categoryMatch && typeMatch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'observation': return 'bg-blue-100 text-blue-800';
      case 'modification': return 'bg-green-100 text-green-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'research': return 'bg-purple-100 text-purple-800';
      case 'personal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderNotes = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Categories</option>
            <option value="observation">Observations</option>
            <option value="modification">Modifications</option>
            <option value="reminder">Reminders</option>
            <option value="research">Research</option>
            <option value="personal">Personal</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Types</option>
            <option value="point">Points</option>
            <option value="indication">Indications</option>
            <option value="protocol">Protocols</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNotes.map(note => (
          <div key={note.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{note.title}</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(note.category)}`}>
                    {note.category}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{note.type}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="text-gray-600 hover:text-gray-800">
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => clinicalNotesDb.deleteNote(note.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-700 text-sm">{note.content}</p>
            {note.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {note.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-4">
      {insights.map(insight => (
        <div key={insight.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">{insight.title}</h3>
              <div className="flex items-center mt-1 space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  insight.type === 'effectiveness' ? 'bg-green-100 text-green-800' :
                  insight.type === 'pattern' ? 'bg-blue-100 text-blue-800' :
                  insight.type === 'safety' ? 'bg-red-100 text-red-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {insight.type}
                </span>
                <span className="text-xs text-gray-500">
                  {insight.dataPoints} treatments • {insight.confidence}% confidence
                </span>
              </div>
            </div>
            <Star className={`h-5 w-5 ${insight.verified ? 'text-yellow-500' : 'text-gray-400'}`} />
          </div>
          
          <p className="text-gray-700 mb-3">{insight.description}</p>
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-blue-800 text-sm font-medium">{insight.recommendation}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="h-8 w-8 text-tcm-accent mr-3" />
            Clinical Notes & Insights
          </h1>
          <p className="text-gray-600 mt-1">
            Personal observations, customizations, and AI-generated clinical insights
          </p>
        </div>
        <div className="flex space-x-2">
          <label className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="sr-only"
            />
          </label>
          <button
            onClick={exportClinicalData}
            className="flex items-center px-3 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-tcm-accent">{notes.length}</div>
          <div className="text-sm text-gray-600">Clinical Notes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{insights.length}</div>
          <div className="text-sm text-gray-600">AI Insights</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-green-600">{outcomes.length}</div>
          <div className="text-sm text-gray-600">Treatment Outcomes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {clinicalNotesDb.getAllPointCustomizations().length}
          </div>
          <div className="text-sm text-gray-600">Point Customizations</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'notes', label: 'Clinical Notes', icon: FileText },
              { id: 'insights', label: 'AI Insights', icon: TrendingUp },
              { id: 'outcomes', label: 'Treatment Outcomes', icon: Star },
              { id: 'preferences', label: 'Preferences', icon: Edit }
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
          {activeTab === 'notes' && renderNotes()}
          {activeTab === 'insights' && renderInsights()}
          {activeTab === 'outcomes' && (
            <div className="text-center py-12 text-gray-500">
              <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p>Treatment outcomes tracking coming soon!</p>
            </div>
          )}
          {activeTab === 'preferences' && (
            <div className="text-center py-12 text-gray-500">
              <Edit className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p>Practitioner preferences panel coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicalNotes;
