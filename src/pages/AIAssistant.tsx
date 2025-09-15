import React from 'react';
import { Brain } from 'lucide-react';
import LocalAIAssistant from '../components/LocalAIAssistant';

const AIAssistant = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Brain className="h-8 w-8 text-green-600 mr-3" />
          Local AI Clinical Assistant
        </h1>
        <p className="text-gray-600 mt-1">
          Privacy-first AI assistance for treatment planning and clinical decisions
        </p>
      </div>

      {/* AI Assistant Interface */}
      <LocalAIAssistant />

      {/* Features Overview */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-green-900 mb-4">
          🤖 AI Assistant Capabilities
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Patient Analysis</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Complete intake analysis with TCM pattern recognition</li>
              <li>• Treatment recommendations based on symptoms</li>
              <li>• Safety considerations for specific patients</li>
              <li>• Contraindication warnings (pregnancy, age, medications)</li>
              <li>• Lifestyle and follow-up recommendations</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Clinical Guidance</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Point location and technique instructions</li>
              <li>• Modality selection guidance</li>
              <li>• Treatment sequencing and timing</li>
              <li>• Pressure and duration recommendations</li>
              <li>• Integration of multiple modalities</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">🔒 Privacy & Security</h3>
          <p className="text-gray-700 text-sm">
            All AI processing happens locally using Ollama. Patient information never leaves your computer, 
            ensuring complete privacy compliance. The AI has access to your WHO-validated point database 
            and treatment protocols to provide accurate, evidence-based recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;