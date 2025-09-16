// AI Content Processor - Superior workshop content extraction
// Uses ChatGPT/Claude for high-quality protocol extraction

export interface AIProcessingConfig {
  provider: 'openai' | 'anthropic' | 'local';
  openaiKey?: string;
  anthropicKey?: string;
  model?: string;
}

export interface ExtractedProtocol {
  name: string;
  indication: string;
  points: string[];
  technique: string;
  duration: string;
  frequency: string;
  contraindications: string[];
  clinicalNotes: string;
  evidence?: string;
  source: string;
  confidence: number;
}

export interface WorkshopAnalysis {
  protocols: ExtractedProtocol[];
  techniques: {
    name: string;
    description: string;
    application: string;
    modality: string;
  }[];
  pointCombinations: {
    name: string;
    points: string[];
    indication: string;
    reasoning: string;
    source: string;
  }[];
  clinicalInsights: {
    category: 'safety' | 'technique' | 'diagnosis' | 'general';
    insight: string;
    application: string;
    importance: 'high' | 'medium' | 'low';
  }[];
  metadata: {
    workshopTitle?: string;
    instructor?: string;
    date?: string;
    institution?: string;
    certificationLevel?: string;
  };
}

export class AIContentProcessor {
  private config: AIProcessingConfig;

  constructor(config: AIProcessingConfig) {
    this.config = config;
  }

  // Process workshop content with superior AI models
  async processWorkshopContent(
    extractedText: string, 
    fileName: string,
    workshopContext?: string
  ): Promise<WorkshopAnalysis> {
    
    console.log(`🧠 Processing workshop content with ${this.config.provider} AI...`);

    const systemPrompt = `You are an expert Traditional Chinese Medicine (TCM) content analyzer specializing in extracting structured clinical protocols from workshop materials and training documents.

Your task is to analyze workshop content and extract:
1. Treatment protocols with specific acupuncture points
2. Clinical techniques and applications  
3. Point combinations and their reasoning
4. Clinical insights and safety considerations
5. Workshop metadata

Guidelines:
- Use standard point notation (LI4, ST36, GB20, etc.)
- Be precise about indications and contraindications
- Extract exact techniques and durations when specified
- Maintain clinical accuracy and safety focus
- Provide confidence ratings for extracted information
- Preserve instructor insights and clinical pearls

Output must be valid JSON that can be imported into a clinical database.`;

      const analysisPrompt = `You are analyzing an Applied Kinesiology workshop manual. Extract ONLY the actual protocols and tests that are explicitly described in the text. DO NOT create or assume protocols that aren't clearly written.

SOURCE FILE: ${fileName}
${workshopContext ? `WORKSHOP CONTEXT: ${workshopContext}` : ''}

CONTENT TO ANALYZE:
${extractedText.substring(0, 12000)}

INSTRUCTIONS:
- Find only EXPLICIT protocols, tests, or procedures that are clearly described
- Look for step-by-step instructions (like "Test for X: Step 1, Step 2...")
- Extract the exact wording and steps from the manual
- Do not create protocols based on keywords alone
- Include specific muscle tests, correction techniques, and assessment procedures

Extract and structure as JSON in this exact format:

{
  "protocols": [
    {
      "name": "Specific protocol name",
      "indication": "condition_treated",
      "points": ["LI4", "ST36", "GB20"],
      "technique": "Detailed technique description",
      "duration": "15-20 minutes",
      "frequency": "2-3 times per week", 
      "contraindications": ["pregnancy", "acute_injury"],
      "clinicalNotes": "Instructor insights and clinical pearls",
      "evidence": "Research or clinical evidence mentioned",
      "source": "${fileName}",
      "confidence": 85
    }
  ],
  "techniques": [
    {
      "name": "Technique name",
      "description": "What the technique does",
      "application": "How to apply in practice",
      "modality": "acupressure/cupping/gua_sha/etc"
    }
  ],
  "pointCombinations": [
    {
      "name": "Combination name",
      "points": ["LI4", "LV3"],
      "indication": "when_to_use",
      "reasoning": "Why these points work together",
      "source": "${fileName}"
    }
  ],
  "clinicalInsights": [
    {
      "category": "safety",
      "insight": "Important clinical observation",
      "application": "How to apply in practice",
      "importance": "high"
    }
  ],
  "metadata": {
    "workshopTitle": "Workshop title if identifiable",
    "instructor": "Instructor name if mentioned",
    "date": "Date if mentioned",
    "institution": "School or organization",
    "certificationLevel": "Beginner/Intermediate/Advanced"
  }
}

Focus on extracting actionable clinical information that can be immediately used in patient care. Maintain high standards for clinical accuracy and safety.`;

    try {
      let aiResponse = '';
      
      if (this.config.provider === 'openai') {
        aiResponse = await this.processWithOpenAI(analysisPrompt, systemPrompt);
      } else if (this.config.provider === 'anthropic') {
        aiResponse = await this.processWithClaude(analysisPrompt, systemPrompt);
      } else {
        // Fallback to local processing
        const { ollamaClient } = await import('../ai/ollama-client');
        aiResponse = await ollamaClient.chat(analysisPrompt, systemPrompt);
      }

      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        console.log('✅ Workshop analysis complete:', analysis);
        return analysis;
      } else {
        throw new Error('No valid JSON found in AI response');
      }

    } catch (error) {
      console.error('❌ AI processing failed:', error);
      console.log('🔄 Attempting fallback to local processing...');
      
      // Fallback to enhanced local processing
      try {
        const { LocalWorkshopProcessor } = await import('./api-proxy');
        const { ollamaClient } = await import('../ai/ollama-client');
        
        console.log('🏠 Using enhanced local Meditron processing...');
        const fallbackResult = await LocalWorkshopProcessor.processWithEnhancedLocal(
          extractedText, 
          fileName, 
          ollamaClient
        );
        
        return fallbackResult;
        
      } catch (fallbackError) {
        console.error('❌ Fallback processing also failed:', fallbackError);
        
        // Final fallback: Basic text analysis
        return this.basicTextAnalysis(extractedText, fileName);
      }
    }
  }

  // Process with OpenAI GPT
  private async processWithOpenAI(prompt: string, systemPrompt: string): Promise<string> {
    console.log('🤖 Making OpenAI API request...');
    console.log('🔑 API Key present:', !!this.config.openaiKey);
    
    const requestBody = {
      model: this.config.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 4000
    };
    
    console.log('📤 Request model:', requestBody.model);
    console.log('📝 Prompt length:', prompt.length);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.openaiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI response received');
    return data.choices[0].message.content;
  }

  // Process with Anthropic Claude
  private async processWithClaude(prompt: string, systemPrompt: string): Promise<string> {
    console.log('🧠 Making Claude API request...');
    console.log('🔑 API Key present:', !!this.config.anthropicKey);
    
    const requestBody = {
      model: this.config.model || 'claude-3-haiku-20240307',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: prompt }
      ]
    };
    
    console.log('📤 Request model:', requestBody.model);
    console.log('📝 Prompt length:', prompt.length);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Claude response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Claude API error:', errorText);
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Claude response received');
    console.log('📋 Response structure:', Object.keys(data));
    
    return data.content[0].text;
  }

  // Basic text analysis fallback
  private basicTextAnalysis(text: string, fileName: string): WorkshopAnalysis {
    console.log('🔍 Performing basic text analysis...');
    
    const protocols: ExtractedProtocol[] = [];
    const pointCombinations: any[] = [];
    const clinicalInsights: any[] = [];
    
    // Look for acupuncture points in text
    const pointMatches = text.match(/\b(LI|LU|ST|SP|BL|KI|GB|HT|SI|TE|PC|LV|GV|CV|DU|REN)\s*\d+\b/gi);
    const uniquePoints = pointMatches ? [...new Set(pointMatches.map(p => p.toUpperCase()))] : [];
    
    console.log('📍 Found acupuncture points:', uniquePoints);
    
    // Look for protocol-like content
    const lines = text.split('\n').filter(line => line.trim().length > 20);
    const protocolLines = lines.filter(line => 
      line.toLowerCase().includes('protocol') ||
      line.toLowerCase().includes('treatment') ||
      line.toLowerCase().includes('technique')
    );
    
    console.log('📋 Found potential protocols:', protocolLines.length);
    
    // Create basic protocols from found content
    if (uniquePoints.length > 0) {
      protocols.push({
        name: `${fileName.replace('.pdf', '')} Protocol`,
        indication: 'applied_kinesiology_assessment',
        points: uniquePoints.slice(0, 8), // First 8 points found
        technique: 'Applied Kinesiology muscle testing and correction techniques',
        duration: '30-45 minutes',
        frequency: 'As needed for assessment',
        contraindications: ['acute_injuries', 'severe_neurological_conditions'],
        clinicalNotes: `Extracted from ${fileName}. Contains ${uniquePoints.length} acupuncture points and ${protocolLines.length} protocol references.`,
        source: fileName,
        confidence: 75
      });
    }
    
    // Extract key insights
    protocolLines.slice(0, 5).forEach((line, index) => {
      clinicalInsights.push({
        category: 'technique',
        insight: line.trim(),
        application: 'Applied Kinesiology practice',
        importance: 'medium'
      });
    });
    
    console.log('✅ Basic analysis complete - found', protocols.length, 'protocols');
    
    return {
      protocols,
      techniques: [],
      pointCombinations,
      clinicalInsights,
      metadata: { 
        workshopTitle: fileName.replace('.pdf', ''),
        certificationLevel: 'Professional'
      }
    };
  }

  // Update configuration
  updateConfig(config: Partial<AIProcessingConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Factory function to create processor with API keys
export const createAIProcessor = (
  provider: 'openai' | 'anthropic' | 'local',
  apiKeys?: { openai?: string; anthropic?: string }
): AIContentProcessor => {
  return new AIContentProcessor({
    provider,
    openaiKey: apiKeys?.openai,
    anthropicKey: apiKeys?.anthropic,
    model: provider === 'openai' ? 'gpt-4o-mini' : 'claude-3-haiku-20240307'
  });
};
