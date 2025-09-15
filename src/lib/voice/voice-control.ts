// Voice Control System - Clean Implementation
// Speech-to-Text and Text-to-Speech for hands-free clinical workflow

export class VoiceControl {
  private recognition: any = null;
  private synthesis: any = null;
  private isListening = false;
  private isSpeaking = false;

  constructor() {
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
  }

  // Initialize Speech Recognition (STT)
  private initializeSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  // Initialize Speech Synthesis (TTS)
  private initializeSpeechSynthesis(): void {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  // Start listening for voice commands
  startListening(onCommand: (command: string) => void): boolean {
    if (!this.recognition) {
      console.warn('Speech recognition not available');
      return false;
    }

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('🎤 Voice command:', transcript);
      onCommand(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
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
      this.isListening = false;
    }
  }

  // Speak text aloud
  speak(text: string): boolean {
    if (!this.synthesis) {
      console.warn('Speech synthesis not available');
      return false;
    }

    // Stop any current speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      this.isSpeaking = true;
      console.log('🔊 Speaking:', text.substring(0, 50) + '...');
    };

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = () => {
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

  // Check availability
  isVoiceAvailable(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  // Get status
  getStatus(): { listening: boolean; speaking: boolean; available: boolean } {
    return {
      listening: this.isListening,
      speaking: this.isSpeaking,
      available: this.isVoiceAvailable()
    };
  }

  // Process clinical voice commands
  processCommand(command: string): { 
    intent: 'point_lookup' | 'treatment_help' | 'safety_check' | 'unknown';
    entities: string[];
  } {
    const lowerCommand = command.toLowerCase();
    
    // Point lookup patterns
    if (lowerCommand.includes('show me') || lowerCommand.includes('where is') || lowerCommand.includes('location')) {
      const pointMatch = lowerCommand.match(/\b(li|lu|st|sp|bl|ki|gb|ht|si|te|pc|lv|gv|cv|du|ren)\s*\d+\b/i);
      return {
        intent: 'point_lookup',
        entities: pointMatch ? [pointMatch[0].toUpperCase()] : []
      };
    }

    // Safety check patterns
    if (lowerCommand.includes('safe') || lowerCommand.includes('contraindication')) {
      return {
        intent: 'safety_check',
        entities: []
      };
    }

    // Treatment help patterns
    if (lowerCommand.includes('help') || lowerCommand.includes('how to') || lowerCommand.includes('technique')) {
      return {
        intent: 'treatment_help',
        entities: []
      };
    }

    return {
      intent: 'unknown',
      entities: []
    };
  }
}

// Singleton instance
export const voiceControl = new VoiceControl();
