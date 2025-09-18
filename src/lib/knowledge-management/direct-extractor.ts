// Direct Text Extractor - Reliable pattern matching without AI
// Finds actual protocols using text patterns, not AI interpretation

export interface ExtractedTest {
  name: string;
  indication: string;
  procedure: string;
  correction?: string;
  points: string[];
  sourceText: string;
  pageNumber?: number;
  confidence: number;
}

export class DirectExtractor {
  // Extract protocols directly from text using reliable patterns
  static extractProtocolsDirectly(text: string, fileName: string): any {
    console.log('🔍 Direct text extraction starting...');
    
    const protocols = [];
    const techniques = [];
    const clinicalInsights = [];
    
    // Split text by page markers to track page numbers
    const pages = text.split(/--- Page \d+ ---/);
    console.log(`📄 Processing ${pages.length} pages for extraction...`);
    
    // Find "Test for X:" patterns - like your hydration test
    const testMatches = this.findTestPatternsWithPages(text, pages);
    console.log('🧪 Found test patterns:', testMatches.length);
    
    testMatches.forEach(test => {
      protocols.push({
        name: test.name,
        indication: test.indication,
        points: test.points,
        technique: test.procedure,
        duration: 'Variable',
        frequency: 'As needed',
        contraindications: [],
        clinicalNotes: `Source: ${fileName}${test.pageNumber ? `, Page ${test.pageNumber}` : ''}\nProcedure: ${test.procedure}`,
        confidence: test.confidence,
        sourceText: test.sourceText
      });
    });
    
    // Find correction procedures with page numbers
    const corrections = this.findCorrectionPatternsWithPages(text, pages);
    console.log('🔧 Found correction patterns:', corrections.length);
    
    corrections.forEach(correction => {
      techniques.push({
        name: correction.name,
        description: correction.description,
        application: correction.application
      });
    });
    
    // Extract all acupuncture points
    const allPoints = this.extractAllPoints(text);
    console.log('📍 Found acupuncture points:', allPoints.length);
    
    // If we found tests but no points in them, create a general point reference
    if (protocols.length === 0 && allPoints.length > 0) {
      protocols.push({
        name: `${fileName.replace('.pdf', '')} - Point Reference`,
        indication: 'reference',
        points: allPoints,
        technique: 'Applied Kinesiology assessment and treatment using referenced points',
        duration: 'Variable',
        frequency: 'As needed',
        contraindications: [],
        clinicalNotes: `All ${allPoints.length} acupuncture points referenced in ${fileName}`,
        confidence: 90
      });
    }
    
    // Add general insights
    if (protocols.length > 0 || allPoints.length > 0) {
      clinicalInsights.push({
        category: 'technique',
        insight: `Applied Kinesiology manual contains ${allPoints.length} acupuncture points and ${protocols.length} explicit procedures`,
        application: 'Use for AK assessment and treatment planning',
        importance: 'high'
      });
    }
    
    const result = {
      protocols,
      techniques,
      pointCombinations: [],
      clinicalInsights,
      metadata: {
        workshopTitle: fileName.replace('.pdf', ''),
        extractionMethod: 'Direct pattern matching',
        pointCount: allPoints.length,
        testCount: testMatches.length
      }
    };
    
    console.log('✅ Direct extraction complete:', result);
    return result;
  }

  // Find "Test for X:" patterns with page numbers
  static findTestPatternsWithPages(text: string, pages: string[]): ExtractedTest[] {
    const tests = [];
    
    // Search each page for test patterns
    pages.forEach((pageContent, pageIndex) => {
      const pageNumber = pageIndex + 1; // Pages start at 1
      
      // Pattern 1: "Test for X: [description]"
      const testPattern1 = /Test for ([^:]+):\s*([^\.]+(?:\.[^\.]*){0,5})/gi;
      let match;
      
      while ((match = testPattern1.exec(pageContent)) !== null) {
        const [fullMatch, testName, description] = match;
        
        tests.push({
          name: `${testName.trim()} Test`,
          indication: testName.toLowerCase().replace(/\s+/g, '_'),
          procedure: description.trim(),
          points: this.extractPointsFromText(description),
          sourceText: fullMatch,
          pageNumber: pageNumber,
          confidence: 95
        });
      }
      
      // Pattern 2: Look for numbered procedures on this page
      const procedurePattern = /(\d+\.\s*[^\.]+(?:\.[^\.]*){0,3})/gi;
      let procMatch;
      
      while ((procMatch = procedurePattern.exec(pageContent)) !== null) {
        const [fullMatch] = procMatch;
        
        if (fullMatch.toLowerCase().includes('test') || fullMatch.toLowerCase().includes('assess')) {
          tests.push({
            name: 'Assessment Procedure',
            indication: 'assessment',
            procedure: fullMatch.trim(),
            points: this.extractPointsFromText(fullMatch),
            sourceText: fullMatch,
            pageNumber: pageNumber,
            confidence: 80
          });
        }
      }
    });
    
    return tests;
  }

  // Legacy method for compatibility
  static findTestPatterns(text: string): ExtractedTest[] {
    const pages = text.split(/--- Page \d+ ---/);
    return this.findTestPatternsWithPages(text, pages);
  }

  // Find correction patterns with page numbers
  static findCorrectionPatternsWithPages(text: string, pages: string[]): any[] {
    const corrections = [];
    
    pages.forEach((pageContent, pageIndex) => {
      const pageNumber = pageIndex + 1;
      
      // Pattern: "Correction: [description]"
      const correctionPattern = /Correction:\s*([^\.]+(?:\.[^\.]*){0,3})/gi;
      let match;
      
      while ((match = correctionPattern.exec(pageContent)) !== null) {
        const [fullMatch, description] = match;
        
        corrections.push({
          name: 'Correction Technique',
          description: description.trim(),
          application: 'Applied Kinesiology correction method',
          sourceText: fullMatch,
          pageNumber: pageNumber,
          sourceReference: `${pageContent.substring(0, 50).replace(/[^\w\s]/g, '')}... (Page ${pageNumber})`
        });
      }
    });
    
    return corrections;
  }

  // Legacy method for compatibility
  static findCorrectionPatterns(text: string): any[] {
    const pages = text.split(/--- Page \d+ ---/);
    return this.findCorrectionPatternsWithPages(text, pages);
  }

  // Extract all acupuncture points from text
  static extractAllPoints(text: string): string[] {
    const pointPattern = /\b(LI|LU|ST|SP|BL|KI|GB|HT|SI|TE|PC|LV|GV|CV|DU|REN)\s*\d+\b/gi;
    const matches = text.match(pointPattern) || [];
    const uniquePoints = [...new Set(matches.map(p => p.toUpperCase().replace(/\s+/, '')))];
    return uniquePoints.sort();
  }

  // Extract points from specific text segment
  static extractPointsFromText(text: string): string[] {
    const pointPattern = /\b(LI|LU|ST|SP|BL|KI|GB|HT|SI|TE|PC|LV|GV|CV|DU|REN)\s*\d+\b/gi;
    const matches = text.match(pointPattern) || [];
    return [...new Set(matches.map(p => p.toUpperCase().replace(/\s+/, '')))];
  }
}

// Export for use in workshop processing
export { DirectExtractor as default };
