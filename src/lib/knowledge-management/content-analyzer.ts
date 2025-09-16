// Content Analyzer - AI-powered workshop content processing
// Uses local Meditron AI to structure workshop content

import { ollamaClient } from '../ai/ollama-client';

export interface AnalyzedProtocol {
  name: string;
  indication: string;
  points: string[];
  technique: string;
  duration: string;
  frequency: string;
  contraindications: string[];
  clinicalNotes: string;
  confidence: number; // 0-100
}

export interface AnalyzedContent {
  protocols: AnalyzedProtocol[];
  techniques: {
    name: string;
    description: string;
    application: string;
  }[];
  pointCombinations: {
    name: string;
    points: string[];
    indication: string;
    reasoning: string;
  }[];
  clinicalInsights: {
    category: string;
    insight: string;
    application: string;
  }[];
  keyFindings: string[];
}

export class ContentAnalyzer {
  private readonly systemPrompt = `You are a Traditional Chinese Medicine content analyzer. Your task is to extract structured clinical information from workshop materials and training documents.

When analyzing content, identify:
1. Treatment protocols with specific points, techniques, and indications
2. Point combinations and their clinical reasoning
3. New techniques or modifications to existing methods
4. Clinical insights and practitioner tips
5. Safety considerations and contraindications

Format your analysis as structured data that can be integrated into a clinical database.
Be precise about point names (use standard notation like LI4, ST36) and clinical terminology.
Include confidence ratings for extracted information.`;

  // Analyze workshop content using local AI
  async analyzeWorkshopContent(extractedText: string, fileName: string): Promise<AnalyzedContent> {
    try {
      console.log('🧠 Analyzing workshop content with AI...');
      
      const analysisPrompt = `Analyze this workshop/training content and extract structured clinical information:

SOURCE: ${fileName}
CONTENT:
${extractedText.substring(0, 8000)} // Limit to avoid token limits

Please extract and structure the following information in JSON format:

{
  "protocols": [
    {
      "name": "Protocol name",
      "indication": "condition treated",
      "points": ["LI4", "ST36", "etc"],
      "technique": "how to apply",
      "duration": "treatment time",
      "frequency": "how often",
      "contraindications": ["safety concerns"],
      "clinicalNotes": "practitioner notes",
      "confidence": 85
    }
  ],
  "techniques": [
    {
      "name": "Technique name",
      "description": "what it does",
      "application": "how to use"
    }
  ],
  "pointCombinations": [
    {
      "name": "Combination name",
      "points": ["LI4", "LV3"],
      "indication": "when to use",
      "reasoning": "why these points work together"
    }
  ],
  "clinicalInsights": [
    {
      "category": "treatment tips",
      "insight": "specific clinical observation",
      "application": "how to apply in practice"
    }
  ],
  "keyFindings": ["important takeaways"]
}

Focus on actionable clinical information that can be used in patient care.`;

      const aiResponse = await ollamaClient.chat(analysisPrompt, this.systemPrompt);
      
      // Try to parse JSON response
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analyzedData = JSON.parse(jsonMatch[0]);
          console.log('✅ Content analysis complete:', analyzedData);
          return analyzedData;
        }
      } catch (parseError) {
        console.warn('⚠️ Could not parse AI response as JSON, using fallback');
      }
      
      // Fallback: Create structure from text analysis
      return this.fallbackAnalysis(extractedText, fileName);
      
    } catch (error) {
      console.error('❌ Content analysis failed:', error);
      return this.fallbackAnalysis(extractedText, fileName);
    }
  }

  // Fallback analysis if AI processing fails
  private fallbackAnalysis(text: string, fileName: string): AnalyzedContent {
    const protocols: AnalyzedProtocol[] = [];
    const techniques: any[] = [];
    const pointCombinations: any[] = [];
    const clinicalInsights: any[] = [];
    const keyFindings: string[] = [];

    // Simple text analysis for key information
    const lines = text.split('\n').filter(line => line.trim().length > 20);
    
    // Look for point mentions
    const pointMatches = text.match(/\b(LI|LU|ST|SP|BL|KI|GB|HT|SI|TE|PC|LV|GV|CV|DU|REN)\s*\d+\b/gi);
    if (pointMatches) {
      const uniquePoints = [...new Set(pointMatches.map(p => p.toUpperCase()))];
      
      if (uniquePoints.length > 0) {
        protocols.push({
          name: `${fileName} Protocol`,
          indication: 'general',
          points: uniquePoints,
          technique: 'As described in workshop material',
          duration: 'Variable',
          frequency: 'As needed',
          contraindications: [],
          clinicalNotes: `Extracted from ${fileName}`,
          confidence: 60
        });
      }
    }

    // Extract key insights
    lines.forEach(line => {
      if (line.toLowerCase().includes('important') || 
          line.toLowerCase().includes('key') || 
          line.toLowerCase().includes('remember')) {
        keyFindings.push(line.trim());
      }
    });

    return {
      protocols,
      techniques,
      pointCombinations,
      clinicalInsights,
      keyFindings: keyFindings.slice(0, 5) // Top 5 findings
    };
  }

  // Validate extracted protocols
  validateProtocol(protocol: AnalyzedProtocol): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!protocol.name || protocol.name.length < 3) {
      issues.push('Protocol name too short or missing');
    }
    
    if (!protocol.indication || protocol.indication === 'general') {
      issues.push('Specific indication not identified');
    }
    
    if (protocol.points.length === 0) {
      issues.push('No acupuncture points identified');
    }
    
    if (protocol.confidence < 50) {
      issues.push('Low confidence in extracted data');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

// Singleton instance
export const contentAnalyzer = new ContentAnalyzer();
