import React, { useState } from 'react';
import { BookOpen, Upload, Database, Search, Brain } from 'lucide-react';
import WorkshopUploader from '../components/WorkshopUploader';
import ManualLibrary from '../components/ManualLibrary';
import RAGManagement from '../components/RAGManagement';

const KnowledgeManagement = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'search' | 'integration'>('upload');

  const renderUpload = () => (
    <div className="space-y-6">
      <WorkshopUploader />
      
      {/* Upload Benefits */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          📚 Transform Your Training Into Clinical Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-blue-900 mb-3">What You Can Upload:</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• Workshop handouts and manuals</li>
              <li>• Training certification materials</li>
              <li>• Clinical protocol documents</li>
              <li>• Research papers and studies</li>
              <li>• Technique instruction guides</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-blue-900 mb-3">AI Processing Features:</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• Automatic protocol extraction</li>
              <li>• Point combination identification</li>
              <li>• Clinical technique analysis</li>
              <li>• Safety consideration detection</li>
              <li>• Integration with clinical workflow</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLibrary = () => (
    <ManualLibrary />
  );

  const renderSearch = () => (
    <RAGManagement />
  );

  const renderIntegration = () => (
    <div className="space-y-6">
      <div className="bg-tcm-light border border-tcm-accent rounded-lg p-6">
        <h2 className="text-xl font-semibold text-tcm-accent mb-4">
          🔗 Clinical Workflow Integration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Assessment Integration</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Workshop diagnostic techniques appear in assessment</li>
              <li>• New point combinations available for testing</li>
              <li>• Enhanced clinical interpretation from training</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Treatment Integration</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Workshop protocols available in treatment planning</li>
              <li>• Advanced techniques integrated with modalities</li>
              <li>• AI references workshop content during recommendations</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded-lg border border-tcm-accent">
          <h3 className="font-semibold text-tcm-accent mb-2">🤖 AI Enhancement</h3>
          <p className="text-gray-700 text-sm">
            Your local Meditron AI will have access to all workshop content, providing 
            contextual recommendations during patient care that include your advanced training.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <BookOpen className="h-8 w-8 text-tcm-accent mr-3" />
          Knowledge Management
        </h1>
        <p className="text-gray-600 mt-1">
          Transform workshop materials and training documents into clinical protocols
        </p>
      </div>

      {/* Benefits Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📈 Turn Training Into Clinical Value
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-tcm-accent">∞</div>
            <div className="text-sm text-gray-600">Workshop Content</div>
            <div className="text-xs text-gray-500">Upload unlimited materials</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">🤖</div>
            <div className="text-sm text-gray-600">AI Processing</div>
            <div className="text-xs text-gray-500">Automatic protocol extraction</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">🔗</div>
            <div className="text-sm text-gray-600">Workflow Integration</div>
            <div className="text-xs text-gray-500">Available during patient care</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">🔒</div>
            <div className="text-sm text-gray-600">Privacy Protected</div>
            <div className="text-xs text-gray-500">Local processing only</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'upload', label: 'Upload & Process', icon: Upload },
              { id: 'library', label: 'RAG Library', icon: Database },
              { id: 'search', label: 'RAG Management', icon: Search },
              { id: 'integration', label: 'AI Integration', icon: Brain }
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
          {activeTab === 'upload' && renderUpload()}
          {activeTab === 'library' && renderLibrary()}
          {activeTab === 'search' && renderSearch()}
          {activeTab === 'integration' && renderIntegration()}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeManagement;
