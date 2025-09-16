// API Proxy - Handles CORS issues for external AI services
// Creates a simple backend proxy to handle API calls

export class APIProxy {
  // Create a simple proxy server for API calls
  static async createProxyRequest(
    url: string, 
    options: RequestInit, 
    provider: 'openai' | 'anthropic'
  ): Promise<Response> {
    
    // For development, we'll use a CORS proxy service
    // In production, you'd want your own backend
    
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    
    try {
      console.log('🔄 Using CORS proxy for API request...');
      
      const response = await fetch(proxyUrl + url, {
        ...options,
        headers: {
          ...options.headers,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      return response;
      
    } catch (error) {
      console.error('❌ Proxy request failed:', error);
      throw error;
    }
  }
  
  // Alternative: Use a simple backend endpoint
  static async createBackendProxy(): Promise<string> {
    // This would require a simple Node.js backend
    // For now, let's use a different approach
    return 'Backend proxy not implemented yet';
  }
}

// Simpler solution: Use Ollama local processing with better prompts
export class LocalWorkshopProcessor {
  static async processWithEnhancedLocal(
    extractedText: string, 
    fileName: string,
    ollamaClient: any
  ): Promise<any> {
    
    console.log('🏠 Using enhanced local processing...');
    
    // Enhanced prompt to find actual protocols, not assumed ones
    const enhancedPrompt = `Analyze this Applied Kinesiology manual and find ONLY explicit protocols and tests that are clearly described with step-by-step instructions.

MANUAL CONTENT:
${extractedText.substring(0, 8000)}

Look for:
1. Explicit test procedures (like "Test for X: Step 1... Step 2...")
2. Muscle testing protocols with clear instructions
3. Correction techniques with specific steps
4. Assessment procedures that are fully described

DO NOT create protocols based on keywords alone. Only extract what is explicitly written as a procedure or test.

List what you find in simple text format.`;

    try {
      const response = await ollamaClient.chat(enhancedPrompt);
      console.log('📥 Local AI response:', response);
      
      console.log('📄 Full AI response:', response);
      
      // Since local AI isn't giving JSON, let's extract what we can
      const extractedPoints = this.extractPointsFromText(extractedText);
      const extractedTechniques = this.extractTechniquesFromText(extractedText);
      
      console.log('📍 Extracted points:', extractedPoints);
      console.log('🔧 Extracted techniques:', extractedTechniques);
      
      // Create multiple protocols based on content analysis
      const protocols = this.extractMultipleProtocols(extractedText, fileName, extractedPoints);
      
      const result = {
        protocols,
        techniques: extractedTechniques,
        pointCombinations: [],
        clinicalInsights: [{
          category: 'technique',
          insight: 'Applied Kinesiology integrates muscle testing with acupuncture point therapy',
          application: 'Use muscle testing to identify point effectiveness',
          importance: 'high'
        }],
        metadata: { 
          workshopTitle: fileName.replace('.pdf', ''),
          certificationLevel: 'Professional',
          contentType: 'Applied Kinesiology'
        }
      };
      
      console.log('✅ Enhanced local processing complete:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Local processing failed:', error);
      return {
        protocols: [],
        techniques: [],
        pointCombinations: [],
        clinicalInsights: [],
        metadata: { workshopTitle: fileName }
      };
    }
  }

  // Extract acupuncture points from text using regex
  static extractPointsFromText(text: string): string[] {
    const pointMatches = text.match(/\b(LI|LU|ST|SP|BL|KI|GB|HT|SI|TE|PC|LV|GV|CV|DU|REN)\s*\d+\b/gi);
    const uniquePoints = pointMatches ? [...new Set(pointMatches.map(p => p.toUpperCase().replace(/\s+/, '')))] : [];
    return uniquePoints;
  }

  // Extract techniques from text with enhanced pattern recognition
  static extractTechniquesFromText(text: string): any[] {
    const techniques = [];
    const lowerText = text.toLowerCase();
    
    // Enhanced technique detection
    const techniquePatterns = [
      { pattern: 'muscle test', name: 'Muscle Testing', desc: 'Applied Kinesiology muscle strength assessment' },
      { pattern: 'challenge', name: 'Challenge Testing', desc: 'Testing muscle response to stimuli' },
      { pattern: 'therapy localization', name: 'Therapy Localization', desc: 'Identifying treatment points through muscle testing' },
      { pattern: 'correction', name: 'AK Correction Techniques', desc: 'Applied Kinesiology correction methods' },
      { pattern: 'meridian tracing', name: 'Meridian Tracing', desc: 'Tracing meridian pathways for assessment' },
      { pattern: 'neurolymphatic', name: 'Neurolymphatic Reflex', desc: 'Chapman point stimulation techniques' },
      { pattern: 'neurovascular', name: 'Neurovascular Reflex', desc: 'Bennett point holding techniques' },
      { pattern: 'cranial', name: 'Cranial Techniques', desc: 'Craniosacral and cranial corrections' },
      { pattern: 'nutrition', name: 'Nutritional Testing', desc: 'Muscle testing for nutritional needs' },
      { pattern: 'emotional', name: 'Emotional Stress Release', desc: 'AK techniques for emotional patterns' }
    ];
    
    techniquePatterns.forEach(({ pattern, name, desc }) => {
      if (lowerText.includes(pattern)) {
        techniques.push({
          name,
          description: desc,
          application: `Applied Kinesiology ${pattern} methodology`
        });
      }
    });
    
    return techniques;
  }

  // Extract actual protocols from workshop content - only explicit procedures
  static extractMultipleProtocols(text: string, fileName: string, extractedPoints: string[]): any[] {
    const protocols = [];
    
    // Look for explicit test procedures with clear instructions
    const explicitTests = this.findExplicitTests(text);
    
    explicitTests.forEach(test => {
      protocols.push({
        name: test.name,
        indication: test.indication,
        points: test.points,
        technique: test.technique,
        duration: test.duration || 'Variable',
        frequency: test.frequency || 'As needed',
        contraindications: test.contraindications || [],
        clinicalNotes: `Extracted from ${fileName}: ${test.description}`,
        confidence: test.confidence,
        sourceText: test.sourceText // Keep original text for reference
      });
    });
    
    // If no explicit tests found, create one general protocol with all points
    if (protocols.length === 0 && extractedPoints.length > 0) {
      protocols.push({
        name: `${fileName.replace('.pdf', '')} - Point Reference`,
        indication: 'applied_kinesiology_reference',
        points: extractedPoints,
        technique: 'Applied Kinesiology assessment and treatment',
        duration: 'Variable',
        frequency: 'As needed',
        contraindications: [],
        clinicalNotes: `Reference protocol containing all ${extractedPoints.length} acupuncture points mentioned in ${fileName}.`,
        confidence: 90
      });
    }
    
    return protocols;
  }

  // Find explicit test procedures in the text
  static findExplicitTests(text: string): any[] {
    const tests = [];
    
    // Look for "Test for X:" patterns
    const testPatterns = text.match(/Test for ([^:]+):\s*([^\.]+(?:\.[^\.]*){0,3})/gi);
    
    if (testPatterns) {
      testPatterns.forEach(match => {
        const [, testName, description] = match.match(/Test for ([^:]+):\s*(.+)/i) || [];
        
        if (testName && description) {
          tests.push({
            name: `${testName.trim()} Test`,
            indication: testName.toLowerCase().replace(/\s+/g, '_'),
            points: [], // Will be populated if points mentioned in description
            technique: description.trim(),
            description: description.trim(),
            confidence: 95, // High confidence for explicit tests
            sourceText: match
          });
        }
      });
    }
    
    // Look for other explicit procedure patterns
    const procedurePatterns = [
      /Correction:\s*([^\.]+(?:\.[^\.]*){0,2})/gi,
      /Technique:\s*([^\.]+(?:\.[^\.]*){0,2})/gi,
      /Protocol:\s*([^\.]+(?:\.[^\.]*){0,2})/gi,
      /Method:\s*([^\.]+(?:\.[^\.]*){0,2})/gi
    ];
    
    procedurePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const [, description] = match.match(/\w+:\s*(.+)/i) || [];
          if (description) {
            tests.push({
              name: `Correction Technique`,
              indication: 'correction',
              points: [],
              technique: description.trim(),
              description: description.trim(),
              confidence: 85,
              sourceText: match
            });
          }
        });
      }
    });
    
    return tests;
  }

  // Get relevant points for specific conditions
  static getPointsForCondition(condition: string, allPoints: string[]): string[] {
    // Point selection based on condition and traditional TCM associations
    const conditionPointMap: { [key: string]: string[] } = {
      'headache': ['GV20', 'GV24', 'GB20', 'LI4', 'LV3', 'HT7'],
      'back_pain': ['GV14', 'GV4', 'BL23', 'BL25', 'KI3'],
      'digestive_disorders': ['CV12', 'CV6', 'ST36', 'SP3', 'LV14'],
      'stress': ['GV20', 'HT7', 'PC6', 'LV3', 'CV17'],
      'chronic_fatigue': ['CV6', 'CV4', 'KI3', 'ST36', 'SP6'],
      'joint_pain': ['LI4', 'LI11', 'ST36', 'GB34', 'LV3'],
      'hormonal_imbalance': ['CV4', 'CV6', 'KI3', 'SP6', 'LV3'],
      'nutritional_deficiency': ['CV12', 'ST36', 'SP3', 'BL20', 'BL21']
    };
    
    const preferredPoints = conditionPointMap[condition] || [];
    
    // Return points that exist in both the extracted points and preferred points
    const matchingPoints = allPoints.filter(point => preferredPoints.includes(point));
    
    // If we have matches, use them; otherwise use a selection of extracted points
    return matchingPoints.length > 0 ? matchingPoints : allPoints.slice(0, 6);
  }
}
