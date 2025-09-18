// Local AI Assistant Component
// Privacy-first AI integration using Ollama

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Brain, Send, Loader, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import VoiceControl from './VoiceControl';
import { ollamaClient } from '../lib/ai/ollama-client';
import { tcmAssistant } from '../lib/ai/tcm-assistant';
import { documentStore } from '../lib/rag/document-store';
import { simpleDb } from '../lib/simpleDatabase';
import { searchService } from '../lib/searchService';
import MarkdownRenderer from './MarkdownRenderer';

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
  const [selectedModel, setSelectedModel] = useState<string>('');

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
        
        // Auto-select preferred model if available
        const preferredModel = models.find(m => m.includes('gpt-oss-abliterated'));
        const meditronModel = models.find(m => m.includes('meditron'));
        const defaultModel = preferredModel || meditronModel || models[0];
        
        if (defaultModel) {
          setSelectedModel(defaultModel);
          ollamaClient.setModel(defaultModel);
          console.log('Selected model:', defaultModel);
        }
      }
    } catch (error) {
      console.error('AI availability check failed:', error);
      setIsAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  const handleModelChange = useCallback((newModel: string) => {
    setSelectedModel(newModel);
    ollamaClient.setModel(newModel);
    console.log('Model changed to:', newModel);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || loading || !isAvailable) return;

    setLoading(true);
    console.log('Sending AI request:', message);
    
    try {
      let aiResponse = '';
      
      // Search BOTH RAG library AND main database for comprehensive context
      console.log('🔍 Searching RAG library for workshop manual context...');
      const ragContext = await documentStore.getContextForQuery(message);
      console.log('📚 RAG context length:', ragContext.length);
      
      console.log('🔍 Searching main database for points and protocols...');
      const databaseContext = await getDatabaseContext(message);
      console.log('💾 Database context length:', databaseContext.length);
      
      // Combine both contexts for comprehensive AI response
      let enhancedMessage = message;
      
      if (ragContext !== 'No relevant content found in manual library.') {
        enhancedMessage += `\n\nRelevant context from your workshop manuals:\n${ragContext}`;
      }
      
      if (databaseContext) {
        enhancedMessage += `\n\nRelevant context from your clinical database:\n${databaseContext}`;
      }
      
      console.log('📤 Sending comprehensive message to AI...');
      console.log('💬 Total context length:', enhancedMessage.length);
      
      console.log('📤 Sending enhanced message to AI...');
      console.log('💬 Message preview:', enhancedMessage.substring(0, 200) + '...');
      
      // Context-aware responses
      if (patientData) {
        aiResponse = await tcmAssistant.analyzePatientIntake(patientData);
      } else if (currentCondition) {
        aiResponse = await tcmAssistant.getTreatmentSuggestions([currentCondition]);
      } else {
        aiResponse = await ollamaClient.chat(enhancedMessage);
      }
      
      console.log('✅ AI response received:', aiResponse.substring(0, 200) + '...');
      setResponse(aiResponse || 'AI response was empty');
    } catch (error) {
      console.error('AI request failed:', error);
      setResponse(`AI Error: ${error}. Check browser console for details.`);
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  // Get relevant context from main clinical database
  const getDatabaseContext = async (query: string): Promise<string> => {
    try {
      let context = '';
      
      // Search for relevant points
      const pointResults = searchService.search(query, 3);
      if (pointResults.length > 0) {
        const pointContext = pointResults.map(result => {
          // Get point from search results directly since they contain the data
          if (result.type === 'point') {
            return `${result.id} (${result.title}): ${result.subtitle}\nType: Acupuncture Point`;
          }
          return '';
        }).filter(Boolean).join('\n\n');
        
        if (pointContext) {
          context += `\nRelevant Acupuncture Points:\n${pointContext}`;
        }
      }
      
      // Search for relevant indications through search service
      const indicationResults = searchService.search(query + ' indication', 2);
      const relevantIndications = indicationResults.filter(result => result.type === 'indication');
      
      if (relevantIndications.length > 0) {
        const indicationContext = relevantIndications.map(result => 
          `${result.title}: ${result.subtitle || 'Clinical condition'}\nType: ${result.type}`
        ).join('\n\n');
        
        if (indicationContext) {
          context += `\n\nRelevant Clinical Conditions:\n${indicationContext}`;
        }
      }
      
      // Search for relevant modality protocols
      const { modalityRegistry } = await import('../lib/modality-system/registry');
      const allModalities = modalityRegistry.getAll();
      const relevantProtocols = [];
      
      allModalities.forEach(modality => {
        const protocols = modality.getProtocolsForIndication(query.toLowerCase().replace(/\s+/g, '_'));
        if (protocols.length > 0) {
          relevantProtocols.push({
            modality: modality.name,
            protocols: protocols.slice(0, 2) // Top 2 protocols per modality
          });
        }
      });
      
      if (relevantProtocols.length > 0) {
        const protocolContext = relevantProtocols.map(({ modality, protocols }) =>
          `${modality} Protocols:\n${protocols.map(p => 
            `- ${p.indication}: ${p.primaryPoints?.join(', ') || 'See protocol'}`
          ).join('\n')}`
        ).join('\n\n');
        
        if (protocolContext) {
          context += `\n\nRelevant Treatment Protocols:\n${protocolContext}`;
        }
      }
      
      return context;
      
    } catch (error) {
      console.error('❌ Database context search failed:', error);
      return '';
    }
  };

  // Memoized quick actions to prevent recreation on each render
  const quickActions = useMemo(() => [
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
  ], [patientData, currentCondition, handleSendMessage]);

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
          <div className="flex items-center space-x-3">
            {availableModels.length > 1 && (
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-900"
              >
                {availableModels.map(model => (
                  <option key={model} value={model}>
                    {model.length > 20 ? model.substring(0, 20) + '...' : model}
                  </option>
                ))}
              </select>
            )}
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Online
            </div>
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
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black"
              style={{ backgroundColor: 'white', color: 'black' }}
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
              <div className="text-gray-900 text-sm leading-relaxed">
                <MarkdownRenderer content={response} />
              </div>
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

      {/* Model Selection */}
      {availableModels.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">AI Model:</label>
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
              >
                {availableModels.map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-green-600">
              {availableModels.length} models available
            </div>
          </div>
          
          {/* Model Info */}
          <div className="mt-2 text-xs text-gray-600">
            <div><strong>Active:</strong> {selectedModel}</div>
            {selectedModel.includes('gpt-oss-abliterated') && (
              <div className="text-green-600">🚀 GPT-OSS Abliterated - High performance, uncensored responses</div>
            )}
            {selectedModel.includes('meditron') && (
              <div className="text-blue-600">🏥 Medical AI - Optimized for clinical content</div>
            )}
            {selectedModel.includes('llama') && (
              <div className="text-purple-600">🧠 General AI - Good for diverse tasks</div>
            )}
            {selectedModel.includes('mistral') && (
              <div className="text-orange-600">⚡ Fast AI - Quick responses</div>
            )}
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black"
            style={{ backgroundColor: 'white', color: 'black' }}
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
            <div className="text-gray-900 text-sm leading-relaxed bg-gray-50 p-3 rounded border">
              <MarkdownRenderer content={response} />
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
