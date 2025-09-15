// Local AI Assistant Component
// Privacy-first AI integration using Ollama

import React, { useState, useEffect } from 'react';
import { Brain, Send, Loader, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import VoiceControl from './VoiceControl';
import { ollamaClient } from '../lib/ai/ollama-client';
import { tcmAssistant } from '../lib/ai/tcm-assistant';

interface LocalAIAssistantProps {
  patientData?: any;
  currentCondition?: string;
  compact?: boolean;
}

const LocalAIAssistant: React.FC<LocalAIAssistantProps> = ({ 
  patientData, 
  currentCondition, 
  compact = false 
}) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    checkAIAvailability();
  }, []);

  const checkAIAvailability = async () => {
    setChecking(true);
    try {
      const available = await ollamaClient.isAvailable();
      setIsAvailable(available);
      
      if (available) {
        const models = await ollamaClient.getAvailableModels();
        setAvailableModels(models);
        
        // Auto-select meditron model if available, otherwise first model
        const meditronModel = models.find(m => m.includes('meditron'));
        const selectedModel = meditronModel || models[0];
        
        if (selectedModel) {
          ollamaClient.setModel(selectedModel);
          console.log('Selected model:', selectedModel);
        }
      }
    } catch (error) {
      console.error('AI availability check failed:', error);
      setIsAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || loading || !isAvailable) return;

    setLoading(true);
    console.log('Sending AI request:', message);
    
    try {
      let aiResponse = '';
      
      // For now, let's use direct Ollama client for simpler debugging
      console.log('Making direct Ollama request...');
      aiResponse = await ollamaClient.chat(message);
      console.log('AI response received:', aiResponse);

      console.log('Setting response:', aiResponse);
      setResponse(aiResponse || 'AI response was empty');
    } catch (error) {
      console.error('AI request failed:', error);
      setResponse(`AI Error: ${error}. Check browser console for details.`);
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  // Quick action buttons for common requests
  const quickActions = [
    {
      label: 'Analyze Patient',
      action: () => patientData && handleSendMessage(),
      enabled: !!patientData
    },
    {
      label: 'Best Points for Headache',
      action: () => {
        setMessage('What are the best acupuncture points for headache treatment?');
        setTimeout(handleSendMessage, 100);
      },
      enabled: true
    },
    {
      label: 'Safety Check',
      action: () => {
        const safetyQuery = patientData?.healthHistory?.pregnancyStatus === 'pregnant' 
          ? 'What points are safe during pregnancy?'
          : 'What are the main safety considerations for acupuncture treatment?';
        setMessage(safetyQuery);
        setTimeout(handleSendMessage, 100);
      },
      enabled: true
    },
    {
      label: 'Modality Selection',
      action: () => {
        setMessage(`What modality would be best for ${currentCondition || 'chronic pain'}?`);
        setTimeout(handleSendMessage, 100);
      },
      enabled: true
    }
  ];

  if (checking) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center">
          <Loader className="h-4 w-4 animate-spin text-gray-600 mr-2" />
          <span className="text-gray-600 text-sm">Checking local AI availability...</span>
        </div>
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Local AI Assistant Setup</h3>
            <p className="text-yellow-700 text-sm mt-1 mb-3">
              To enable AI-powered treatment analysis, install Ollama locally:
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-white border border-yellow-200 rounded p-2">
                <strong>1. Install:</strong>{' '}
                <a 
                  href="https://ollama.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:no-underline"
                >
                  Download Ollama
                </a>
              </div>
              <div className="bg-white border border-yellow-200 rounded p-2">
                <strong>2. Download model:</strong> <code className="bg-gray-100 px-1 rounded">ollama pull llama3.1:8b</code>
              </div>
              <div className="bg-white border border-yellow-200 rounded p-2">
                <strong>3. Start server:</strong> <code className="bg-gray-100 px-1 rounded">ollama serve</code>
              </div>
            </div>
            <button
              onClick={checkAIAvailability}
              className="mt-3 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
            >
              Check Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Brain className="h-4 w-4 text-green-600 mr-2" />
            Local AI Assistant
          </h3>
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Online
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about treatment, points, or safety..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>

          {response && (
            <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-sm">
              <p className="text-gray-900 text-sm whitespace-pre-wrap leading-relaxed">{response}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Brain className="h-5 w-5 text-green-600 mr-2" />
          Local AI Clinical Assistant
        </h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Ollama Connected</span>
          </div>
          <button 
            onClick={checkAIAvailability}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Model Info */}
      {availableModels.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-700">
            <strong>Active Model:</strong> {availableModels[0]} 
            <span className="ml-2 text-green-600">({availableModels.length} available)</span>
          </div>
        </div>
      )}

      {/* Patient Context */}
      {(patientData || currentCondition) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Current Context:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            {currentCondition && <div>• Condition: {currentCondition}</div>}
            {patientData?.basicInfo && (
              <div>• Patient: {patientData.basicInfo.age}y, {patientData.basicInfo.gender}</div>
            )}
            {patientData?.chiefComplaint && (
              <div>• Complaint: {patientData.chiefComplaint.primaryConcern}</div>
            )}
            {patientData?.healthHistory?.pregnancyStatus === 'pregnant' && (
              <div className="text-red-600">• ⚠️ PREGNANCY - Safety protocols required</div>
            )}
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about treatment protocols, point locations, safety considerations..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !message.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>

        {/* Voice Control */}
        <VoiceControl 
          onVoiceCommand={(command, response) => {
            setMessage(command);
            setResponse(response);
          }}
          compact={true}
        />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setMessage('Hello, test connection');
              setTimeout(handleSendMessage, 100);
            }}
            disabled={loading}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 disabled:opacity-50"
          >
            🧪 Test Connection
          </button>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              disabled={!action.enabled || loading}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 disabled:opacity-50"
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* AI Response */}
        {response && (
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">AI Analysis & Recommendations:</h3>
            <div className="text-gray-900 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded border">
              {response}
            </div>
          </div>
        )}
        
        {/* Debug Info */}
        <div className="mt-2 text-xs text-gray-500">
          Response length: {response.length} characters
          {loading && ' • AI thinking...'}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 text-sm">
          🔒 <strong>Privacy Protected:</strong> All AI processing happens locally on your computer. 
          Patient information never leaves your device.
        </p>
      </div>
    </div>
  );
};

export default LocalAIAssistant;
