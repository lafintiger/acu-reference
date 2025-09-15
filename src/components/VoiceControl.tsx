// Voice Control Component - Speech interface for hands-free operation
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { voiceControl } from '../lib/voice/voice-control';
import { ollamaClient } from '../lib/ai/ollama-client';

interface VoiceControlProps {
  onVoiceCommand?: (command: string, response: string) => void;
  compact?: boolean;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onVoiceCommand, compact = false }) => {
  const [voiceStatus, setVoiceStatus] = useState(voiceControl.getStatus());
  const [lastCommand, setLastCommand] = useState('');
  const [lastResponse, setLastResponse] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setVoiceStatus(voiceControl.getStatus());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleStartListening = () => {
    const success = voiceControl.startListening(async (command) => {
      setLastCommand(command);
      
      // Process the voice command
      const processed = voiceControl.processCommand(command);
      
      try {
        // Get AI response to voice command
        const aiResponse = await ollamaClient.chat(`Clinical voice command: "${command}". Provide a brief, spoken response for hands-free use.`);
        setLastResponse(aiResponse);
        
        // Speak the response
        voiceControl.speak(aiResponse);
        
        // Notify parent component
        onVoiceCommand?.(command, aiResponse);
        
      } catch (error) {
        const errorResponse = "Voice command received but AI is not available.";
        setLastResponse(errorResponse);
        voiceControl.speak(errorResponse);
      }
    });

    if (!success) {
      alert('Voice recognition not available in this browser');
    }
  };

  const handleStopListening = () => {
    voiceControl.stopListening();
  };

  const handleSpeak = () => {
    if (lastResponse) {
      voiceControl.speak(lastResponse);
    } else {
      voiceControl.speak("Voice control is ready. Say 'show me LI4' or 'help with headache treatment'");
    }
  };

  const handleStopSpeaking = () => {
    voiceControl.stopSpeaking();
  };

  if (!voiceStatus.available) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-yellow-800 text-sm">
          Voice control not available in this browser
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={voiceStatus.listening ? handleStopListening : handleStartListening}
          className={`p-2 rounded-lg ${
            voiceStatus.listening 
              ? 'bg-red-100 text-red-600' 
              : 'bg-blue-100 text-blue-600'
          }`}
          title={voiceStatus.listening ? 'Stop listening' : 'Start voice input'}
        >
          {voiceStatus.listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
        
        <button
          onClick={voiceStatus.speaking ? handleStopSpeaking : handleSpeak}
          className={`p-2 rounded-lg ${
            voiceStatus.speaking 
              ? 'bg-red-100 text-red-600' 
              : 'bg-green-100 text-green-600'
          }`}
          title={voiceStatus.speaking ? 'Stop speaking' : 'Speak response'}
          disabled={!lastResponse}
        >
          {voiceStatus.speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        🎙️ Voice Control Interface
      </h2>

      {/* Voice Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={voiceStatus.listening ? handleStopListening : handleStartListening}
          className={`flex items-center px-4 py-2 rounded-lg font-medium ${
            voiceStatus.listening 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-blue-100 text-blue-700 border border-blue-300'
          }`}
        >
          {voiceStatus.listening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
          {voiceStatus.listening ? 'Stop Listening' : 'Start Voice Input'}
        </button>

        <button
          onClick={voiceStatus.speaking ? handleStopSpeaking : handleSpeak}
          disabled={!lastResponse}
          className={`flex items-center px-4 py-2 rounded-lg font-medium ${
            voiceStatus.speaking 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-green-100 text-green-700 border border-green-300'
          } disabled:opacity-50`}
        >
          {voiceStatus.speaking ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4" />}
          {voiceStatus.speaking ? 'Stop Speaking' : 'Speak Response'}
        </button>
      </div>

      {/* Voice Activity */}
      {lastCommand && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Last Voice Command:</h3>
            <p className="text-blue-800 text-sm">"{lastCommand}"</p>
          </div>

          {lastResponse && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">AI Response:</h3>
              <p className="text-green-800 text-sm">{lastResponse}</p>
            </div>
          )}
        </div>
      )}

      {/* Voice Commands Help */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Voice Commands Examples:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Point Lookup:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• "Show me LI4"</li>
              <li>• "Where is GB20?"</li>
              <li>• "Location of Yintang"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Treatment Help:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• "Help with headache treatment"</li>
              <li>• "Best points for neck pain"</li>
              <li>• "Is this safe during pregnancy?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceControl;
