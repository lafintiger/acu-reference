// AI Provider Selector - Choose between different AI providers
// Secure implementation without hardcoded API keys

import React, { useState } from 'react';
import { Brain, Key, AlertTriangle, CheckCircle } from 'lucide-react';

interface AIProviderConfig {
  provider: 'openai' | 'anthropic' | 'local' | 'none';
  openaiKey?: string;
  anthropicKey?: string;
  localConfig?: any;
}

interface AIProviderSelectorProps {
  currentProvider: string;
  onProviderSelect: (provider: string, config: AIProviderConfig) => void;
}

const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({ 
  currentProvider, 
  onProviderSelect 
}) => {
  const [selectedProvider, setSelectedProvider] = useState(currentProvider);
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: ''
  });

  const providers = [
    {
      id: 'local',
      name: 'Local AI (Ollama)',
      description: 'Privacy-first local AI processing',
      icon: '🏠',
      privacy: 100,
      cost: 0,
      performance: 85,
      setup: 'Requires Ollama installation'
    },
    {
      id: 'openai',
      name: 'OpenAI GPT',
      description: 'Advanced AI with cloud processing',
      icon: '🤖',
      privacy: 60,
      cost: 80,
      performance: 95,
      setup: 'Requires OpenAI API key'
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      description: 'Constitutional AI with safety focus',
      icon: '🧠',
      privacy: 65,
      cost: 75,
      performance: 90,
      setup: 'Requires Anthropic API key'
    },
    {
      id: 'none',
      name: 'No AI Assistant',
      description: 'Manual clinical workflows only',
      icon: '📋',
      privacy: 100,
      cost: 0,
      performance: 0,
      setup: 'No setup required'
    }
  ];

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    
    const config: AIProviderConfig = {
      provider: providerId as any,
      openaiKey: apiKeys.openai || undefined,
      anthropicKey: apiKeys.anthropic || undefined
    };
    
    onProviderSelect(providerId, config);
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Brain className="h-6 w-6 text-tcm-accent mr-3" />
          AI Provider Configuration
        </h2>
        <p className="text-gray-600 mt-1">
          Choose your AI assistant provider. Local processing recommended for privacy.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Privacy & Security Notice</h3>
            <p className="text-blue-800 text-sm mt-1">
              <strong>Local AI (Ollama)</strong> is recommended for clinical use as all processing 
              stays on your device. Cloud providers require sending data externally.
            </p>
          </div>
        </div>
      </div>

      {/* Provider Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map(provider => (
          <div
            key={provider.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedProvider === provider.id
                ? 'border-tcm-accent bg-tcm-light'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleProviderSelect(provider.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{provider.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                  <p className="text-sm text-gray-600">{provider.description}</p>
                </div>
              </div>
              {selectedProvider === provider.id && (
                <CheckCircle className="h-5 w-5 text-tcm-accent" />
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Privacy:</span>
                <span className={getQualityColor(provider.privacy)}>{provider.privacy}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Performance:</span>
                <span className={getQualityColor(provider.performance)}>{provider.performance}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cost:</span>
                <span className={provider.cost === 0 ? 'text-green-600' : 'text-orange-600'}>
                  {provider.cost === 0 ? 'Free' : `${provider.cost}%`}
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Setup: {provider.setup}
            </div>
          </div>
        ))}
      </div>

      {/* API Key Configuration */}
      {(selectedProvider === 'openai' || selectedProvider === 'anthropic') && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Key className="h-5 w-5 text-gray-600 mr-2" />
            API Key Configuration
          </h3>
          
          <div className="space-y-4">
            {selectedProvider === 'openai' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.openai}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">OpenAI Platform</a>
                </p>
              </div>
            )}

            {selectedProvider === 'anthropic' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.anthropic}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, anthropic: e.target.value }))}
                  placeholder="sk-ant-..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Anthropic Console</a>
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Security Notice:</strong> API keys are stored locally and never transmitted. 
                However, using cloud AI providers means your clinical data will be sent to external servers.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Local AI Setup Instructions */}
      {selectedProvider === 'local' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-4">Local AI Setup (Recommended)</h3>
          
          <div className="space-y-3 text-sm text-green-800">
            <div className="flex items-start">
              <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
              <div>
                <strong>Install Ollama:</strong>{' '}
                <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Download from ollama.ai
                </a>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
              <div>
                <strong>Download AI model:</strong>{' '}
                <code className="bg-green-100 px-2 py-1 rounded text-xs">
                  ollama pull huihui_ai/gpt-oss-abliterated:20b-q8_0
                </code>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
              <div>
                <strong>Start Ollama:</strong>{' '}
                <code className="bg-green-100 px-2 py-1 rounded text-xs">ollama serve</code>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800">
                <strong>Privacy Protected:</strong> All AI processing happens locally. 
                Patient data never leaves your device.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Actions */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => handleProviderSelect(selectedProvider)}
          className="px-6 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark"
        >
          Apply Configuration
        </button>
      </div>
    </div>
  );
};

export default AIProviderSelector;
