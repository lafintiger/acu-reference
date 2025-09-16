// PDF Processing System - Modular Knowledge Management
// Extracts text from PDFs without disrupting existing clinical workflow

export interface PDFProcessingResult {
  success: boolean;
  text: string;
  pageCount: number;
  fileName: string;
  fileSize: number;
  processingTime: number;
  error?: string;
}

export interface ExtractedContent {
  id: string;
  sourceFile: string;
  extractedText: string;
  processedDate: string;
  contentType: 'workshop' | 'manual' | 'research' | 'protocol' | 'general';
  metadata: {
    title?: string;
    author?: string;
    workshop?: string;
    date?: string;
    instructor?: string;
  };
}

export class PDFProcessor {
  private static instance: PDFProcessor;
  
  static getInstance(): PDFProcessor {
    if (!PDFProcessor.instance) {
      PDFProcessor.instance = new PDFProcessor();
    }
    return PDFProcessor.instance;
  }

  // Process PDF file to extract text
  async processPDF(file: File): Promise<PDFProcessingResult> {
    const startTime = Date.now();
    
    try {
      console.log('🔄 Processing PDF:', file.name);
      
      // Load PDF.js dynamically to avoid bundle size issues
      const pdfjsLib = await this.loadPDFJS();
      
      // Convert file to array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log(`📄 PDF loaded: ${pdf.numPages} pages`);
      
      // Extract text from all pages
      let fullText = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine text items with spaces
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
      }
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ PDF processing complete: ${processingTime}ms`);
      
      return {
        success: true,
        text: fullText.trim(),
        pageCount: pdf.numPages,
        fileName: file.name,
        fileSize: file.size,
        processingTime
      };
      
    } catch (error) {
      console.error('❌ PDF processing failed:', error);
      return {
        success: false,
        text: '',
        pageCount: 0,
        fileName: file.name,
        fileSize: file.size,
        processingTime: Date.now() - startTime,
        error: `PDF processing failed: ${error}`
      };
    }
  }

  // Load PDF.js library dynamically
  private async loadPDFJS(): Promise<any> {
    try {
      // Try to load from CDN
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          const pdfjsLib = (window as any).pdfjsLib;
          if (pdfjsLib) {
            // Set worker source
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve(pdfjsLib);
          } else {
            reject(new Error('PDF.js failed to load'));
          }
        };
        
        script.onerror = () => reject(new Error('Failed to load PDF.js from CDN'));
        document.head.appendChild(script);
      });
      
    } catch (error) {
      throw new Error(`Failed to load PDF.js: ${error}`);
    }
  }

  // Clean and structure extracted text
  cleanExtractedText(rawText: string): string {
    return rawText
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove page markers
      .replace(/--- Page \d+ ---/g, '\n\n')
      // Clean up line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Trim
      .trim();
  }

  // Detect content type from text
  detectContentType(text: string): ExtractedContent['contentType'] {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('workshop') || lowerText.includes('seminar')) {
      return 'workshop';
    }
    if (lowerText.includes('manual') || lowerText.includes('handbook')) {
      return 'manual';
    }
    if (lowerText.includes('research') || lowerText.includes('study')) {
      return 'research';
    }
    if (lowerText.includes('protocol') || lowerText.includes('treatment')) {
      return 'protocol';
    }
    
    return 'general';
  }

  // Extract metadata from text
  extractMetadata(text: string, fileName: string): ExtractedContent['metadata'] {
    const metadata: ExtractedContent['metadata'] = {};
    
    // Try to extract title (usually first significant line)
    const lines = text.split('\n').filter(line => line.trim().length > 10);
    if (lines.length > 0) {
      metadata.title = lines[0].trim();
    }
    
    // Try to extract workshop/course information
    const workshopMatch = text.match(/workshop[:\s]+([^\n]+)/i);
    if (workshopMatch) {
      metadata.workshop = workshopMatch[1].trim();
    }
    
    // Try to extract instructor information
    const instructorMatch = text.match(/instructor[:\s]+([^\n]+)/i);
    if (instructorMatch) {
      metadata.instructor = instructorMatch[1].trim();
    }
    
    // Extract date if present
    const dateMatch = text.match(/\b(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})\b/);
    if (dateMatch) {
      metadata.date = dateMatch[1];
    }
    
    return metadata;
  }
}

// Singleton instance
export const pdfProcessor = PDFProcessor.getInstance();
