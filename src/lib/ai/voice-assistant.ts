// Voice Assistant - Text-to-Speech and Speech-to-Text Integration
// Enables hands-free interaction with the AI assistant during treatments

export class VoiceAssistant {
  private recognition: any = null;
  private synthesis: any = null;
  private isListening = false;
  private isSpeaking = false;
  private onVoiceCommand?: (command: string) => void;
  private onListeningChange?: (listening: boolean) => void;

  constructor() {
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
  }

  // Initialize Speech Recognition (STT)
  private initializeSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onListeningChange?.(true);
        console.log('🎙️ Voice recognition started');
      };

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript.trim()) {
          console.log('🎤 Voice command:', finalTranscript);
          this.onVoiceCommand?.(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onListeningChange?.(false);
        console.log('🎙️ Voice recognition ended');
      };
    }
  }

  // Initialize Speech Synthesis (TTS)
  private initializeSpeechSynthesis(): void {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  // Start listening for voice commands
  startListening(
    onCommand: (command: string) => void,
    onListeningChange?: (listening: boolean) => void
  ): boolean {
    if (!this.recognition) {
      console.warn('Speech recognition not available');
      return false;
    }

    this.onVoiceCommand = onCommand;
    this.onListeningChange = onListeningChange;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      return false;
    }
  }

  // Stop listening
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Speak text aloud
  speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
  }): boolean {
    if (!this.synthesis) {
      console.warn('Speech synthesis not available');
      return false;
    }

    // Stop any current speech
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || 0.9;
    utterance.pitch = options?.pitch || 1.0;
    utterance.volume = options?.volume || 0.8;

    // Set voice if specified
    if (options?.voice) {
      const voices = this.synthesis.getVoices();
      const selectedVoice = voices.find((voice: any) => voice.name === options.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      console.log('🔊 Speaking:', text.substring(0, 50) + '...');
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      console.log('🔊 Speech completed');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
    };

    try {
      this.synthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Failed to speak:', error);
      return false;
    }
  }

  // Stop speaking
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  // Get available voices
  getAvailableVoices(): any[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  // Check if voice services are available
  isVoiceAvailable(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  // Get current status
  getStatus(): {
    recognitionAvailable: boolean;
    synthesisAvailable: boolean;
    isListening: boolean;
    isSpeaking: boolean;
  } {
    return {
      recognitionAvailable: !!this.recognition,
      synthesisAvailable: !!this.synthesis,
      isListening: this.isListening,
      isSpeaking: this.isSpeaking
    };
  }

  // Clinical voice commands processing
  processClinicalCommand(command: string): {
    intent: 'point_lookup' | 'treatment_guidance' | 'safety_check' | 'next_step' | 'unknown';
    entities: string[];
    confidence: number;
  } {
    const lowerCommand = command.toLowerCase();
    
    // Point lookup patterns
    if (lowerCommand.includes('show me') || lowerCommand.includes('where is') || lowerCommand.includes('location')) {
      const pointMatch = lowerCommand.match(/\b(li|lu|st|sp|bl|ki|gb|ht|si|te|pc|lv|gv|cv|du|ren)\s*\d+\b/i);
      return {
        intent: 'point_lookup',
        entities: pointMatch ? [pointMatch[0].toUpperCase()] : [],
        confidence: pointMatch ? 0.9 : 0.6
      };
    }

    // Treatment guidance patterns
    if (lowerCommand.includes('what next') || lowerCommand.includes('next step') || lowerCommand.includes('continue')) {
      return {
        intent: 'next_step',
        entities: [],
        confidence: 0.8
      };
    }

    // Safety check patterns
    if (lowerCommand.includes('safe') || lowerCommand.includes('contraindication') || lowerCommand.includes('caution')) {
      return {
        intent: 'safety_check',
        entities: [],
        confidence: 0.8
      };
    }

    // Treatment guidance patterns
    if (lowerCommand.includes('how to') || lowerCommand.includes('technique') || lowerCommand.includes('pressure')) {
      return {
        intent: 'treatment_guidance',
        entities: [],
        confidence: 0.7
      };
    }

    return {
      intent: 'unknown',
      entities: [],
      confidence: 0.0
    };
  }
}

// Singleton instance
export const voiceAssistant = new VoiceAssistant();

// Convenience functions
export const startVoiceListening = (onCommand: (command: string) => void) =>
  voiceAssistant.startListening(onCommand);

export const speakText = (text: string, options?: any) =>
  voiceAssistant.speak(text, options);

export const isVoiceAvailable = () =>
  voiceAssistant.isVoiceAvailable();
