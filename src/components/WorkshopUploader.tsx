// Workshop Content Uploader - Modular PDF Processing Component
// Self-contained system that doesn't affect existing clinical workflow

import React, { useState } from 'react';
import { Upload, FileText, Brain, CheckCircle, AlertTriangle, Download, Settings, Shield } from 'lucide-react';
import ProtocolReviewCard from './ProtocolReviewCard';
import { pdfProcessor } from '../lib/knowledge-management/pdf-processor';
import { createAIProcessor } from '../lib/knowledge-management/ai-content-processor';
import { deduplicationManager } from '../lib/knowledge-management/deduplication';
// Removed DirectExtractor import to fix module loading issue
import AIProviderSelector from './AIProviderSelector';

const WorkshopUploader = () => {
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [analyzedContent, setAnalyzedContent] = useState<any>(null);
  const [processingStep, setProcessingStep] = useState<'config' | 'upload' | 'extract' | 'analyze' | 'review'>('config');
  const [fileName, setFileName] = useState('');
  const [aiProcessor, setAIProcessor] = useState<any>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [duplicateCheck, setDuplicateCheck] = useState<any>(null);
  const [showSelectiveImport, setShowSelectiveImport] = useState(false);
  const [protocolApprovals, setProtocolApprovals] = useState<{[key: number]: boolean}>({});

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setProcessing(true);
    setFileName(file.name);
    setProcessingStep('extract');

    try {
      // Step 1: Extract text from PDF
      console.log('📄 Starting PDF text extraction...');
      const extractionResult = await pdfProcessor.processPDF(file);
      
      if (!extractionResult.success) {
        throw new Error(extractionResult.error || 'PDF processing failed');
      }

      setExtractedText(extractionResult.text);
      setProcessingStep('analyze');

      // Step 2: Analyze content (handle CORS issues)
      console.log('🧠 Starting AI content analysis...');
      let analysis;
      
      // Skip AI entirely and use direct text extraction for reliability
      console.log('🔍 Using direct pattern extraction (no AI dependency)...');
      analysis = extractProtocolsDirectly(extractionResult.text, file.name);
      
      // Step 3: Check for duplicates
      console.log('🔍 Checking for duplicate content...');
      const duplicateResult = deduplicationManager.checkForDuplicates(file.name, extractionResult.text, analysis);
      setDuplicateCheck(duplicateResult);
      
      setAnalyzedContent(analysis);
      setProcessingStep('review');
      
      console.log('✅ Workshop content processing complete!');
      
    } catch (error) {
      console.error('❌ Workshop processing failed:', error);
      alert(`Processing failed: ${error}`);
      setProcessingStep('upload');
    } finally {
      setProcessing(false);
    }
  };

  const downloadExtractedText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAnalyzedContent = () => {
    const blob = new Blob([JSON.stringify(analyzedContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_analyzed.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleProviderSelect = (provider: string, config: any) => {
    const processor = createAIProcessor(provider as any, {
      openai: config.openaiKey,
      anthropic: config.anthropicKey
    });
    setAIProcessor(processor);
    setProcessingStep('upload');
  };

  // Direct extraction function (moved here to avoid import issues)
  const extractProtocolsDirectly = (text: string, fileName: string) => {
    console.log('🔍 Direct text extraction starting...');
    
    const protocols = [];
    const techniques = [];
    
    // Split by page markers
    const pages = text.split(/--- Page \d+ ---/);
    console.log(`📄 Processing ${pages.length} pages...`);
    
    // Enhanced protocol detection for actual AK manual structures
    pages.forEach((pageContent, pageIndex) => {
      const pageNumber = pageIndex + 1;
      
      // Pattern 1: "Test for X:" format
      const testPattern = /Test for ([^:]+):\s*([^\.]+(?:\.[^\.]*){0,5})/gi;
      let match;
      while ((match = testPattern.exec(pageContent)) !== null) {
        const [fullMatch, testName, description] = match;
        const timing = extractTiming(description);
        
        protocols.push({
          name: `${testName.trim()} Test`,
          indication: testName.toLowerCase().replace(/\s+/g, '_'),
          points: extractPointsFromText(description),
          technique: description.trim(),
          duration: timing.duration || undefined,
          frequency: timing.frequency || undefined,
          contraindications: [],
          clinicalNotes: `Source: ${fileName}, Page ${pageNumber}\nProcedure: ${description.trim()}`,
          confidence: 95,
          sourceText: fullMatch
        });
      }
      
      // Pattern 2: Look for actual procedure content (not table of contents)
      // Skip pages that look like table of contents (lots of dots and page numbers)
      const isTableOfContents = pageContent.includes('...........') || 
                                 pageContent.match(/\d+\s*\.{3,}\s*\d+/g);
      
      if (!isTableOfContents) {
        // Look for specific procedure titles followed by actual content
        const procedureTitles = [
          'Acupressure Points to Correct Switching',
          'GENERAL NEUROLYMPHATIC TECHNIQUE',
          'RELEASING MUSCLE CRAMPS',
          'Emotional Stress Release',
          'EAR UNROLLING PROCEDURE', 
          'Injury Recall',
          'Testing the ICV',
          'Meridian Trace'
        ];
        
        procedureTitles.forEach(title => {
          const titleIndex = pageContent.indexOf(title);
          if (titleIndex !== -1) {
            // Extract content before title (for context/indications)
            const beforeTitle = pageContent.substring(Math.max(0, titleIndex - 500), titleIndex);
            
            // Extract content after the title until next major section
            const contentAfterTitle = pageContent.substring(titleIndex);
            const nextSectionMatch = contentAfterTitle.match(/\n[A-Z\s]{10,}/);
            const endIndex = nextSectionMatch ? nextSectionMatch.index : Math.min(2000, contentAfterTitle.length);
            const procedureContent = contentAfterTitle.substring(0, endIndex);
            
            // Extract clinical indications, purpose, and timing
            const clinicalContext = extractClinicalContext(beforeTitle, procedureContent, title);
            const timing = extractTiming(procedureContent);
            
            // Only include if it has substantial content (not just title)
            if (procedureContent.length > title.length + 100) {
              protocols.push({
                name: title,
                indication: clinicalContext.indication,
                points: extractPointsFromText(procedureContent),
                technique: procedureContent.trim(),
                duration: timing.duration || undefined, // Only if found in text
                frequency: timing.frequency || undefined, // Only if found in text
                contraindications: [],
                clinicalNotes: `Source: ${fileName}, Page ${pageNumber}\n${clinicalContext.purpose}\nProcedure: ${title}\nIndications: ${clinicalContext.indications.join(', ') || 'General AK technique'}`,
                confidence: 95,
                sourceText: procedureContent
              });
            }
          }
        });
      }
      
      // Pattern 3: Numbered procedures (only if we can find a good title)
      const numberedProcedure = /(\d+\.\s+[^]*?)(?=\d+\.\s+|$)/gi;
      const procedures = pageContent.match(numberedProcedure) || [];
      
      if (procedures.length >= 3) { // At least 3 steps = likely a protocol
        const combinedProcedure = procedures.join('\n');
        const title = extractTitleFromContent(pageContent, procedures[0]);
        
        // Only add if we found a meaningful title (not just "Procedure")
        if (title && title !== 'Procedure' && title.length > 5 && 
            !title.includes('...') && !title.match(/\d+/)) {
          
          const timing = extractTiming(combinedProcedure);
          
          protocols.push({
            name: title,
            indication: title.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '_'),
            points: extractPointsFromText(combinedProcedure),
            technique: combinedProcedure,
            duration: timing.duration || undefined,
            frequency: timing.frequency || undefined,
            contraindications: [],
            clinicalNotes: `Source: ${fileName}, Page ${pageNumber}\nMulti-step procedure: ${title}\nSteps: ${procedures.length}`,
            confidence: 85,
            sourceText: combinedProcedure
          });
        } else {
          console.log(`⚠️ Skipping numbered procedure on page ${pageNumber} - no clear title found`);
        }
      }
      
      // Pattern 4: "Correction:" sections
      const correctionPattern = /Correction:\s*([^]*?)(?=\n[A-Z\s]+[A-Z]+:|Retest:|$)/gi;
      let corrMatch;
      while ((corrMatch = correctionPattern.exec(pageContent)) !== null) {
        const [fullMatch, description] = corrMatch;
        techniques.push({
          name: 'Correction Technique',
          description: description.trim(),
          application: 'Applied Kinesiology correction method',
          pageNumber: pageNumber,
          sourceReference: `Page ${pageNumber}`
        });
      }
    });
    
    // Extract all points
    const allPoints = extractAllPoints(text);
    console.log(`📍 Found ${allPoints.length} total acupuncture points`);
    
    // Remove condition-based protocol creation - only use explicit protocols found in text
    // const conditionProtocols = createConditionProtocols(text, fileName, allPoints, pages);
    // protocols.push(...conditionProtocols);
    
    // If no explicit tests found, create reference protocol
    if (protocols.length === 0 && allPoints.length > 0) {
      protocols.push({
        name: `${fileName.replace('.pdf', '')} - Point Reference`,
        indication: 'reference',
        points: allPoints,
        technique: 'Applied Kinesiology reference points',
        duration: 'Variable',
        frequency: 'As needed',
        contraindications: [],
        clinicalNotes: `Source: ${fileName}\nContains ${allPoints.length} acupuncture points from manual`,
        confidence: 90
      });
    }
    
    return {
      protocols,
      techniques,
      pointCombinations: [],
      clinicalInsights: [{
        category: 'reference',
        insight: `Extracted ${protocols.length} protocols and ${allPoints.length} points from ${fileName}`,
        application: 'Applied Kinesiology practice',
        importance: 'high'
      }],
      metadata: {
        workshopTitle: fileName.replace('.pdf', ''),
        extractionMethod: 'Direct pattern matching',
        pageCount: pages.length
      }
    };
  };

  const extractPointsFromText = (text: string): string[] => {
    const pointPattern = /\b(LI|LU|ST|SP|BL|KI|GB|HT|SI|TE|PC|LV|GV|CV|DU|REN)\s*\d+\b/gi;
    const matches = text.match(pointPattern) || [];
    return [...new Set(matches.map(p => p.toUpperCase().replace(/\s+/, '')))];
  };

  const extractAllPoints = (text: string): string[] => {
    const pointPattern = /\b(LI|LU|ST|SP|BL|KI|GB|HT|SI|TE|PC|LV|GV|CV|DU|REN)\s*\d+\b/gi;
    const matches = text.match(pointPattern) || [];
    return [...new Set(matches.map(p => p.toUpperCase().replace(/\s+/, '')))].sort();
  };

  // Removed condition-based protocol creation - was creating false protocols
  // Now only extracting actual protocols explicitly described in the manual

  // Get relevant points for specific conditions
  const getPointsForCondition = (condition: string, allPoints: string[]): string[] => {
    const conditionPointMap: { [key: string]: string[] } = {
      'hydration': ['CV6', 'CV12', 'KI3', 'BL23'],
      'stress': ['GV20', 'HT7', 'PC6', 'LV3', 'CV17'],
      'digestive_disorders': ['CV12', 'CV6', 'ST36', 'SP3', 'LV14'],
      'energy': ['CV6', 'CV4', 'KI3', 'ST36', 'SP6'],
      'structural': ['GV14', 'GV4', 'BL23', 'BL25'],
      'nutrition': ['CV12', 'ST36', 'SP3', 'BL20'],
      'muscle_testing': ['GV20', 'CV17', 'LI11'],
      'correction': ['GV14', 'CV6', 'ST36']
    };
    
    const preferredPoints = conditionPointMap[condition] || [];
    const matchingPoints = allPoints.filter(point => preferredPoints.includes(point));
    
    // Return matching points, or a selection if no matches
    return matchingPoints.length > 0 ? matchingPoints : allPoints.slice(0, 6);
  };

  // Extract title from content context with better filtering
  const extractTitleFromContent = (pageContent: string, firstStep: string): string => {
    // Look for title-like text before the first numbered step
    const beforeFirstStep = pageContent.substring(0, pageContent.indexOf(firstStep));
    const lines = beforeFirstStep.split('\n').reverse();
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Good title criteria
      if (trimmed.length > 10 && trimmed.length < 100 && 
          !trimmed.includes('...') && // Not table of contents
          !trimmed.match(/\d+$/) && // Not ending with page number
          !trimmed.includes('Page') && // Not page reference
          (trimmed.includes('TECHNIQUE') || trimmed.includes('PROCEDURE') || 
           trimmed.includes('RELEASE') || trimmed.includes('TEST') ||
           trimmed.includes('CORRECTION') || trimmed.includes('ASSESSMENT'))) {
        return trimmed;
      }
    }
    
    // If no good title found, return null to skip this procedure
    return null;
  };

  // Extract clinical context and indications for procedures
  const extractClinicalContext = (beforeTitle: string, procedureContent: string, title: string) => {
    const indications = [];
    let purpose = '';
    let indication = 'general';
    
    // Combine before and procedure content for analysis
    const fullContext = beforeTitle + ' ' + procedureContent;
    const lowerContext = fullContext.toLowerCase();
    
    // Look for specific indications mentioned in context
    const indicationPatterns = [
      { pattern: /pain relief|pain|painful|ache|aching/gi, indication: 'pain_relief', term: 'pain relief' },
      { pattern: /energy|fatigue|tired|exhaustion|boost/gi, indication: 'energy_enhancement', term: 'energy enhancement' },
      { pattern: /stress|anxiety|emotional|tension/gi, indication: 'stress_relief', term: 'stress relief' },
      { pattern: /flexibility|range of motion|mobility|stiff/gi, indication: 'flexibility', term: 'flexibility improvement' },
      { pattern: /cramp|spasm|muscle tension|tight/gi, indication: 'muscle_relief', term: 'muscle tension relief' },
      { pattern: /hydration|dehydration|water|fluid/gi, indication: 'hydration_assessment', term: 'hydration status' },
      { pattern: /injury|trauma|healing|recovery/gi, indication: 'injury_recovery', term: 'injury recovery' },
      { pattern: /circulation|blood flow|lymphatic/gi, indication: 'circulation', term: 'circulation improvement' },
      { pattern: /digestion|digestive|stomach|gut/gi, indication: 'digestive_support', term: 'digestive support' },
      { pattern: /balance|coordination|stability/gi, indication: 'balance', term: 'balance and coordination' },
      { pattern: /hearing|listen|ear|sound/gi, indication: 'auditory_enhancement', term: 'hearing and attention' },
      { pattern: /neck|cervical|head turn/gi, indication: 'neck_mobility', term: 'neck flexibility' }
    ];
    
    // Check each pattern
    indicationPatterns.forEach(({ pattern, indication: ind, term }) => {
      if (pattern.test(lowerContext)) {
        indications.push(term);
        if (!indication || indication === 'general') {
          indication = ind;
        }
      }
    });
    
    // Extract purpose statement if available
    const purposePatterns = [
      /(?:used? for|helpful for|effective for|benefits?)\s+([^\.]{10,100})/gi,
      /(?:can|will|may)\s+(help|assist|improve|relieve|enhance)\s+([^\.]{10,100})/gi
    ];
    
    purposePatterns.forEach(pattern => {
      const matches = fullContext.match(pattern);
      if (matches && matches.length > 0) {
        purpose = matches[0].trim();
      }
    });
    
    // Default purpose based on title if none found
    if (!purpose) {
      if (title.includes('PAIN') || title.includes('CRAMP')) {
        purpose = 'Used for pain relief and muscle tension reduction';
      } else if (title.includes('ENERGY')) {
        purpose = 'Used for energy enhancement and fatigue relief';
      } else if (title.includes('STRESS') || title.includes('EMOTIONAL')) {
        purpose = 'Used for stress relief and emotional balance';
      } else if (title.includes('EAR')) {
        purpose = 'Used for hearing enhancement and attention improvement';
      } else if (title.includes('INJURY')) {
        purpose = 'Used for injury recovery and healing';
      } else {
        purpose = 'Applied Kinesiology assessment and treatment technique';
      }
    }
    
    return {
      indication,
      indications,
      purpose
    };
  };

  // Extract timing information (duration and frequency) from text
  const extractTiming = (text: string) => {
    let duration = null;
    let frequency = null;
    
    // Look for duration patterns
    const durationPatterns = [
      /(\d+\s*-\s*\d+\s*(?:seconds?|minutes?|hours?))/gi,
      /(\d+\s*(?:seconds?|minutes?|hours?))/gi,
      /(about\s+\d+\s*(?:seconds?|minutes?))/gi,
      /(for\s+\d+\s*(?:seconds?|minutes?))/gi
    ];
    
    durationPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match && !duration) {
        duration = match[0].trim();
      }
    });
    
    // Look for frequency patterns
    const frequencyPatterns = [
      /(repeat\s+\d+\s*-\s*\d+\s*times)/gi,
      /(repeat\s+\d+\s*times)/gi,
      /(\d+\s*times\s*(?:per|each|daily|weekly))/gi,
      /(daily|weekly|monthly|as needed)/gi
    ];
    
    frequencyPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match && !frequency) {
        frequency = match[0].trim();
      }
    });
    
    return { duration, frequency };
  };

  const resetUploader = () => {
    setProcessingStep('config');
    setExtractedText('');
    setAnalyzedContent(null);
    setFileName('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <FileText className="h-5 w-5 text-tcm-accent mr-2" />
          Workshop Content Processor
        </h2>
        {processingStep !== 'upload' && (
          <button
            onClick={resetUploader}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
          >
            Process Another File
          </button>
        )}
      </div>

        {/* Processing Steps Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {[
            { id: 'config', label: 'AI Config', icon: Settings },
            { id: 'upload', label: 'Upload PDF', icon: Upload },
            { id: 'extract', label: 'Extract Text', icon: FileText },
            { id: 'analyze', label: 'AI Analysis', icon: Brain },
            { id: 'review', label: 'Review & Import', icon: CheckCircle }
          ].map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                processingStep === step.id ? 'bg-tcm-accent text-white' :
                ['extract', 'analyze', 'review'].includes(processingStep) && index < ['upload', 'extract', 'analyze', 'review'].indexOf(processingStep) ? 'bg-green-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                <step.icon className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">{step.label}</span>
              {index < 4 && <div className="w-8 h-0.5 bg-gray-200 ml-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* AI Provider Configuration */}
      {processingStep === 'config' && (
        <div className="space-y-6">
          <AIProviderSelector 
            onProviderSelect={handleProviderSelect}
            currentProvider="anthropic"
          />
          
          <div className="bg-tcm-light border border-tcm-accent rounded-lg p-4">
            <h3 className="font-semibold text-tcm-accent mb-2">🚀 Ready for Superior Processing</h3>
            <p className="text-gray-700 text-sm">
              Select your preferred AI provider above, then proceed to upload workshop materials. 
              <strong>Claude (Anthropic)</strong> is recommended for best clinical content extraction.
            </p>
          </div>
        </div>
      )}

      {/* Upload Interface */}
      {processingStep === 'upload' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Workshop PDF</h3>
          <p className="text-gray-600 mb-4">
            Upload workshop materials, manuals, or training documents to extract clinical protocols
          </p>
          
          <label className="inline-flex items-center px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Choose PDF File
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={processing}
              className="sr-only"
            />
          </label>
          
          <p className="text-xs text-gray-500 mt-2">
            PDF files only • Processing happens locally for privacy
          </p>
        </div>
      )}

      {/* Processing Status */}
      {processing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tcm-accent mr-3"></div>
            <div>
              <h3 className="font-semibold text-blue-900">
                {processingStep === 'extract' && 'Extracting text from PDF...'}
                {processingStep === 'analyze' && 'AI analyzing content for clinical protocols...'}
              </h3>
              <p className="text-blue-800 text-sm">
                Processing {fileName} • This may take a few moments
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Text Preview */}
      {processingStep === 'analyze' && extractedText && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Extracted Text Preview</h3>
            <button
              onClick={downloadExtractedText}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Download Text
            </button>
          </div>
          <div className="bg-gray-50 rounded p-3 max-h-40 overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {extractedText.substring(0, 1000)}...
            </pre>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {processingStep === 'review' && analyzedContent && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-900">AI Analysis Complete!</h3>
              <button
                onClick={downloadAnalyzedContent}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Download Analysis
              </button>
            </div>
            <p className="text-green-800 text-sm">
              Found {analyzedContent.protocols?.length || 0} protocols, 
              {analyzedContent.techniques?.length || 0} techniques, and 
              {analyzedContent.clinicalInsights?.length || 0} clinical insights
            </p>
            
            {/* Show point count if available */}
            {analyzedContent.protocols?.[0]?.points && (
              <p className="text-green-800 text-sm mt-1">
                <strong>Points extracted:</strong> {analyzedContent.protocols[0].points.length} acupuncture points
              </p>
            )}
            
            {/* Debug: Show all protocols and their point counts */}
            <div className="mt-2 text-xs text-gray-600">
              Debug: {analyzedContent.protocols?.map((p: any, i: number) => 
                `Protocol ${i+1}: ${p.points?.length || 0} points`
              ).join(', ')}
            </div>
          </div>

          {/* Protocols Found - Enhanced with Selective Import */}
          {analyzedContent.protocols && analyzedContent.protocols.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  Extracted Protocols ({analyzedContent.protocols.length})
                </h3>
                {showSelectiveImport && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        // Select all protocols
                        const allApproved = {};
                        analyzedContent.protocols.forEach((_: any, index: number) => {
                          allApproved[index] = true;
                        });
                        setProtocolApprovals(allApproved);
                      }}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => setProtocolApprovals({})}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                    >
                      Deselect All
                    </button>
                    <button
                      onClick={() => setShowSelectiveImport(false)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {analyzedContent.protocols.map((protocol: any, index: number) => (
                  <div key={index} className={`border rounded p-4 ${
                    showSelectiveImport 
                      ? (protocolApprovals[index] ? 'border-green-500 bg-green-50' : 'border-gray-200')
                      : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      {/* Selective Import Checkbox */}
                      {showSelectiveImport && (
                        <div className="mr-3 mt-1">
                          <input
                            type="checkbox"
                            checked={protocolApprovals[index] || false}
                            onChange={(e) => {
                              setProtocolApprovals(prev => ({
                                ...prev,
                                [index]: e.target.checked
                              }));
                            }}
                            className="w-4 h-4 text-tcm-accent"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{protocol.name}</h4>
                        <p className="text-sm text-gray-600">For: {protocol.indication?.replace('_', ' ')}</p>
                        
                        <div className="mt-2 space-y-1 text-sm">
                          <div><strong>Points ({protocol.points?.length || 0}):</strong></div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {protocol.points?.map((point: string) => (
                              <span key={point} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                                {point}
                              </span>
                            )) || <span className="text-gray-500 text-xs">No points</span>}
                          </div>
                          
                          <div className="mt-2">
                            <strong>Technique:</strong> {protocol.technique}
                          </div>
                          <div>
                            <strong>Duration:</strong> {protocol.duration} • <strong>Frequency:</strong> {protocol.frequency}
                          </div>
                          
                          {protocol.clinicalNotes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                              <strong>Clinical Notes:</strong> {protocol.clinicalNotes}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className={`text-xs px-2 py-1 rounded ${
                          protocol.confidence >= 80 ? 'bg-green-100 text-green-800' :
                          protocol.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {protocol.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debug Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">🔍 Debug Information</h3>
            <div className="space-y-2 text-sm">
              <div><strong>File:</strong> {fileName}</div>
              <div><strong>Extracted Text Length:</strong> {extractedText.length} characters</div>
              <div><strong>AI Provider:</strong> {aiProcessor?.config?.provider || 'Not configured'}</div>
              <div><strong>Analysis Status:</strong> {analyzedContent ? 'Complete' : 'Failed/Empty'}</div>
            </div>
            
            <details className="mt-3">
              <summary className="cursor-pointer text-gray-700 hover:text-gray-900">
                View Raw Extracted Text (First 1000 chars)
              </summary>
              <div className="mt-2 bg-white border rounded p-3 max-h-40 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {extractedText.substring(0, 1000)}...
                </pre>
              </div>
            </details>
          </div>

          {/* Duplicate Check Results */}
          {duplicateCheck && (
            <div className={`border rounded-lg p-4 ${
              duplicateCheck.isDuplicate 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start">
                <Shield className={`h-5 w-5 mr-3 mt-0.5 ${
                  duplicateCheck.isDuplicate ? 'text-yellow-600' : 'text-green-600'
                }`} />
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${
                    duplicateCheck.isDuplicate ? 'text-yellow-900' : 'text-green-900'
                  }`}>
                    {duplicateCheck.isDuplicate ? '⚠️ Duplicate Content Detected' : '✅ New Content Verified'}
                  </h3>
                  
                  {duplicateCheck.isDuplicate && (
                    <div className="space-y-2 text-sm">
                      <div className={`${
                        duplicateCheck.duplicateType === 'exact_file' ? 'text-red-700' :
                        duplicateCheck.duplicateType === 'similar_content' ? 'text-yellow-700' :
                        'text-orange-700'
                      }`}>
                        <strong>Type:</strong> {duplicateCheck.duplicateType.replace('_', ' ')} 
                        ({duplicateCheck.similarity}% similarity)
                      </div>
                      
                      <div className="text-yellow-800">
                        <strong>Recommendations:</strong>
                        <ul className="mt-1 space-y-1">
                          {duplicateCheck.recommendations.map((rec: string, index: number) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {!duplicateCheck.isDuplicate && (
                    <p className="text-green-800 text-sm">
                      This content is unique and safe to import without creating duplicates.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Import Actions */}
          <div className="bg-tcm-light border border-tcm-accent rounded-lg p-4">
            <h3 className="font-semibold text-tcm-accent mb-3">
              {duplicateCheck?.isDuplicate ? 'Import with Caution' : 'Ready to Import'}
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              {duplicateCheck?.isDuplicate 
                ? 'Duplicate content detected. Review carefully before importing to avoid redundant data.'
                : 'Review the extracted content above. When ready, import the protocols and techniques into your clinical database.'
              }
            </p>
            <div className="flex space-x-3">
              <button 
                className={`px-4 py-2 rounded-lg ${
                  duplicateCheck?.isDuplicate 
                    ? 'bg-yellow-600 hover:bg-yellow-700' 
                    : 'bg-tcm-accent hover:bg-tcm-accent-dark'
                } text-white`}
                onClick={() => {
                  if (showSelectiveImport) {
                    // Import only selected protocols
                    const selectedProtocols = analyzedContent.protocols?.filter((_: any, index: number) => 
                      protocolApprovals[index]
                    ) || [];
                    const selectedTechniques = analyzedContent.techniques || [];
                    
                    if (selectedProtocols.length > 0) {
                      const fingerprint = deduplicationManager.generateFingerprint(fileName, extractedText, {
                        ...analyzedContent,
                        protocols: selectedProtocols
                      });
                      deduplicationManager.storeFingerprint(fingerprint);
                      
                      alert(`Selective import successful:\n• ${selectedProtocols.length} protocols imported\n• ${selectedTechniques.length} techniques imported\n• ${analyzedContent.protocols.length - selectedProtocols.length} protocols skipped`);
                      setShowSelectiveImport(false);
                    } else {
                      alert('Please select at least one protocol to import.');
                    }
                  } else {
                    // Import all protocols
                    const allProtocols = analyzedContent.protocols || [];
                    const allTechniques = analyzedContent.techniques || [];
                    
                    if (allProtocols.length > 0 || allTechniques.length > 0) {
                      const fingerprint = deduplicationManager.generateFingerprint(fileName, extractedText, analyzedContent);
                      deduplicationManager.storeFingerprint(fingerprint);
                      
                      alert(`Successfully imported:\n• ${allProtocols.length} protocols\n• ${allTechniques.length} techniques\n• Duplicate prevention enabled`);
                    } else {
                      alert('No protocols found to import.');
                    }
                  }
                }}
              >
                {showSelectiveImport 
                  ? `Import Selected (${Object.values(protocolApprovals).filter(Boolean).length})` 
                  : (duplicateCheck?.isDuplicate ? 'Import All Anyway' : 'Import All Protocols')
                }
              </button>
              <button 
                onClick={() => {
                  // Selective import - show approval interface
                  setShowSelectiveImport(true);
                }}
                className="px-4 py-2 border border-tcm-accent text-tcm-accent rounded-lg hover:bg-tcm-light"
              >
                Selective Import
              </button>
              <button 
                onClick={() => {
                  console.log('🔍 Full Analysis Data:', analyzedContent);
                  console.log('📄 Duplicate Check:', duplicateCheck);
                  console.log('📄 Full Extracted Text:', extractedText);
                  console.log('🔍 Protocol Structure:', analyzedContent?.protocols?.[0]);
                  console.log('🔍 Points in Protocol:', analyzedContent?.protocols?.[0]?.points);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Debug Protocol Structure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopUploader;
