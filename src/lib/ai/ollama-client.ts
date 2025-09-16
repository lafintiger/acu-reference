// Local AI Integration with Ollama
// Privacy-first AI assistance - all processing stays local

export interface OllamaConfig {
  baseUrl: string;
  model: string;
  timeout: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export class OllamaClient {
  private config: OllamaConfig;
  private conversationHistory: ChatMessage[] = [];

  constructor(config: Partial<OllamaConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost:11434',
      model: config.model || 'huihui_ai/gpt-oss-abliterated:20b-q8_0', // Use preferred model
      timeout: config.timeout || 60000 // Increased timeout for large documents
    };
  }

  // Check if Ollama is running locally
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      console.log('Ollama not available - install from https://ollama.ai');
      return false;
    }
  }

  // Get available models
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/tags`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      console.error('Failed to get models:', error);
      return [];
    }
  }

  // Send chat message to local AI
  async chat(message: string, systemPrompt?: string): Promise<string> {
    console.log('Ollama chat request:', { message, model: this.config.model });
    
    try {
      // Add system prompt if provided
      if (systemPrompt && !this.conversationHistory.some(msg => msg.role === 'system')) {
        this.conversationHistory.unshift({
          role: 'system',
          content: systemPrompt,
          timestamp: new Date().toISOString()
        });
      }

      // Add user message
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });

      const requestBody = {
        model: this.config.model,
        messages: this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: false
      };
      
      console.log('Ollama request body:', requestBody);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      
      const response = await fetch(`${this.config.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      console.log('Ollama response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ollama error response:', errorText);
        throw new Error(`Ollama request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Ollama response data:', data);
      const assistantMessage = data.message?.content || data.content || 'No response content';

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date().toISOString()
      });

      return assistantMessage;
    } catch (error) {
      console.error('Local AI request failed:', error);
      throw new Error(`Local AI unavailable: ${error}`);
    }
  }

  // Clear conversation history
  clearHistory(): void {
    this.conversationHistory = [];
  }

  // Get conversation history
  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  // Update model
  setModel(model: string): void {
    this.config.model = model;
  }
}

// Singleton instance for app use
export const ollamaClient = new OllamaClient();