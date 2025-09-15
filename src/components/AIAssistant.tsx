// AI Assistant Component - Local LLM Integration
// Provides AI-powered clinical assistance using Ollama

import React, { useState, useEffect, useRef } from 'react';
import { Brain, Mic, MicOff, Volume2, VolumeX, Send, Loader, Settings, AlertCircle } from 'lucide-react';
import { tcmAssistant, isOllamaAvailable } from '../lib/ai/ollama-client';

interface AIAssistantProps {
  context?: {
    condition?: string;
    patientInfo?: any;
    currentTreatment?: string;
  };
  compact?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ context, compact = false }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<any>(null);

  useEffect(() => {
    checkOllamaAvailability();
    initializeVoiceServices();
  }, []);

  const checkOllamaAvailability = async () => {
    try {
      const available = await isOllamaAvailable();
      setIsAvailable(available);
    } catch (error) {
      console.error('Failed to check Ollama availability:', error);
      setIsAvailable(false);
    }
  };

  const initializeVoiceServices = () => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
        // Auto-send voice messages
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
      setVoiceEnabled(true);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakResponse = (text: string) => {
    if (synthesisRef.current && !isSpeaking) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthesisRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim() || loading || !isAvailable) return;

    setLoading(true);
    setMessage('');

    try {
      // Build context-aware prompt
      let contextPrompt = '';
      if (context?.condition) {
        contextPrompt += `Current patient condition: ${context.condition}\n`;
      }
      if (context?.currentTreatment) {
        contextPrompt += `Current treatment step: ${context.currentTreatment}\n`;
      }

      const fullPrompt = contextPrompt + textToSend;
      
      // Get AI response
      let aiResponse = '';
      if (context?.currentTreatment) {
        // Voice guidance for active treatment
        aiResponse = await tcmAssistant.getVoiceGuidance(fullPrompt);
      } else if (context?.condition) {
        // Treatment recommendations
        aiResponse = await tcmAssistant.getTreatmentRecommendations(context.condition, context.patientInfo);
      } else {
        // General guidance
        aiResponse = await tcmAssistant.chat(fullPrompt);
      }

      setResponse(aiResponse);
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: textToSend, timestamp: new Date().toISOString() },
        { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
      ]);

      // Auto-speak response if voice is enabled and this was a voice command
      if (voiceEnabled && messageText) {
        speakResponse(aiResponse);
      }

    } catch (error) {
      console.error('AI assistance failed:', error);
      setResponse('AI assistance is currently unavailable. Please ensure Ollama is running locally.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAvailable) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">AI Assistant Unavailable</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Local AI assistant requires Ollama to be running. 
              <a 
                href="https://ollama.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                Install Ollama
              </a> and run <code className="bg-yellow-100 px-1 rounded">ollama serve</code> to enable AI assistance.
            </p>
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
            <Brain className="h-4 w-4 text-tcm-accent mr-2" />
            AI Assistant
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-2 rounded-lg ${
                isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              onClick={isSpeaking ? stopSpeaking : () => speakResponse(response)}
              className={`p-2 rounded-lg ${
                isSpeaking ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}
              title={isSpeaking ? 'Stop speaking' : 'Speak response'}
              disabled={!response}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask for treatment guidance..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-tcm-accent"
            disabled={loading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !message.trim()}
            className="px-3 py-2 bg-tcm-accent text-white rounded-md hover:bg-tcm-accent-dark disabled:opacity-50"
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>

        {response && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">{response}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Brain className="h-5 w-5 text-tcm-accent mr-2" />
          TCM AI Assistant
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-green-600">● Online</span>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Context Display */}
      {context && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Current Context:</h3>
          <div className="text-sm text-gray-700 space-y-1">
            {context.condition && <div>• Condition: {context.condition}</div>}
            {context.currentTreatment && <div>• Treatment: {context.currentTreatment}</div>}
            {context.patientInfo && <div>• Patient info available</div>}
          </div>
        </div>
      )}

      {/* Voice Controls */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center px-4 py-2 rounded-lg ${
            isListening 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-blue-100 text-blue-700 border border-blue-300'
          }`}
        >
          {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
          {isListening ? 'Stop Listening' : 'Voice Input'}
        </button>

        <button
          onClick={isSpeaking ? stopSpeaking : () => speakResponse(response)}
          disabled={!response}
          className={`flex items-center px-4 py-2 rounded-lg ${
            isSpeaking 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-green-100 text-green-700 border border-green-300'
          } disabled:opacity-50`}
        >
          {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
          {isSpeaking ? 'Stop Speaking' : 'Speak Response'}
        </button>
      </div>

      {/* Chat Interface */}
      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about treatment protocols, point locations, safety considerations..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tcm-accent"
            disabled={loading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !message.trim()}
            className="px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark disabled:opacity-50"
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>

        {/* Response Display */}
        {response && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">AI Recommendation:</h3>
            <div className="text-blue-800 text-sm whitespace-pre-wrap">{response}</div>
          </div>
        )}

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              View Conversation History ({conversationHistory.length / 2} exchanges)
            </summary>
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
              {conversationHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <div className="font-medium mb-1">
                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">Quick Actions:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSendMessage('What points should I use for headache?')}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
            disabled={loading}
          >
            Headache points
          </button>
          <button
            onClick={() => handleSendMessage('Show me LI4 location and technique')}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
            disabled={loading}
          >
            LI4 guidance
          </button>
          <button
            onClick={() => handleSendMessage('Safety considerations for cupping')}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
            disabled={loading}
          >
            Cupping safety
          </button>
          <button
            onClick={() => handleSendMessage('Best modality for chronic pain?')}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
            disabled={loading}
          >
            Modality selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
