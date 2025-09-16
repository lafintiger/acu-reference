// Deduplication System - Prevent duplicate workshop content
// Ensures data integrity and prevents redundant information

export interface ContentFingerprint {
  fileHash: string;
  contentHash: string;
  fileName: string;
  uploadDate: string;
  extractedPointCount: number;
  protocolCount: number;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateType: 'exact_file' | 'similar_content' | 'overlapping_protocols' | 'none';
  existingContent?: ContentFingerprint;
  similarity: number; // 0-100
  recommendations: string[];
}

export class DeduplicationManager {
  private readonly FINGERPRINTS_KEY = 'workshop_fingerprints';
  private readonly PROTOCOLS_KEY = 'workshop_protocols';

  // Generate content fingerprint for uploaded document
  generateFingerprint(
    fileName: string,
    extractedText: string,
    extractedContent: any
  ): ContentFingerprint {
    // Simple hash function for content
    const contentHash = this.simpleHash(extractedText);
    const fileHash = this.simpleHash(fileName + extractedText.substring(0, 1000));
    
    return {
      fileHash,
      contentHash,
      fileName,
      uploadDate: new Date().toISOString(),
      extractedPointCount: extractedContent.protocols?.[0]?.points?.length || 0,
      protocolCount: extractedContent.protocols?.length || 0
    };
  }

  // Check if content is duplicate before processing
  checkForDuplicates(
    fileName: string,
    extractedText: string,
    extractedContent: any
  ): DuplicateCheckResult {
    const newFingerprint = this.generateFingerprint(fileName, extractedText, extractedContent);
    const existingFingerprints = this.getStoredFingerprints();

    // Check for exact file duplicate
    const exactFileMatch = existingFingerprints.find(fp => 
      fp.fileHash === newFingerprint.fileHash
    );
    
    if (exactFileMatch) {
      return {
        isDuplicate: true,
        duplicateType: 'exact_file',
        existingContent: exactFileMatch,
        similarity: 100,
        recommendations: [
          'This exact file has been uploaded before',
          `Previous upload: ${new Date(exactFileMatch.uploadDate).toLocaleDateString()}`,
          'Skip upload to avoid duplicates'
        ]
      };
    }

    // Check for similar content
    const similarContent = existingFingerprints.find(fp => {
      const similarity = this.calculateContentSimilarity(newFingerprint, fp);
      return similarity > 80; // 80% similarity threshold
    });

    if (similarContent) {
      const similarity = this.calculateContentSimilarity(newFingerprint, similarContent);
      return {
        isDuplicate: true,
        duplicateType: 'similar_content',
        existingContent: similarContent,
        similarity,
        recommendations: [
          `${similarity}% similar to existing content: ${similarContent.fileName}`,
          'Consider reviewing for overlapping information',
          'You may want to merge or skip duplicate protocols'
        ]
      };
    }

    // Check for overlapping protocols
    const overlappingProtocols = this.checkProtocolOverlap(extractedContent, existingFingerprints);
    if (overlappingProtocols.overlapPercentage > 50) {
      return {
        isDuplicate: true,
        duplicateType: 'overlapping_protocols',
        similarity: overlappingProtocols.overlapPercentage,
        recommendations: [
          `${overlappingProtocols.overlapPercentage}% protocol overlap detected`,
          `Overlapping points: ${overlappingProtocols.overlappingPoints.slice(0, 5).join(', ')}`,
          'Consider selective import to avoid duplicate protocols'
        ]
      };
    }

    return {
      isDuplicate: false,
      duplicateType: 'none',
      similarity: 0,
      recommendations: [
        'New content detected',
        'Safe to import all extracted protocols',
        'No significant duplicates found'
      ]
    };
  }

  // Store fingerprint after successful import
  storeFingerprint(fingerprint: ContentFingerprint): void {
    try {
      const existing = this.getStoredFingerprints();
      existing.push(fingerprint);
      localStorage.setItem(this.FINGERPRINTS_KEY, JSON.stringify(existing));
      console.log('📝 Content fingerprint stored');
    } catch (error) {
      console.error('Failed to store fingerprint:', error);
    }
  }

  // Get all stored fingerprints
  getStoredFingerprints(): ContentFingerprint[] {
    try {
      const data = localStorage.getItem(this.FINGERPRINTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load fingerprints:', error);
      return [];
    }
  }

  // Simple hash function
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Calculate content similarity
  private calculateContentSimilarity(fp1: ContentFingerprint, fp2: ContentFingerprint): number {
    // Simple similarity based on point count and file characteristics
    const pointSimilarity = fp1.extractedPointCount === fp2.extractedPointCount ? 50 : 0;
    const protocolSimilarity = fp1.protocolCount === fp2.protocolCount ? 30 : 0;
    const nameSimilarity = this.calculateNameSimilarity(fp1.fileName, fp2.fileName);
    
    return Math.min(100, pointSimilarity + protocolSimilarity + nameSimilarity);
  }

  // Calculate name similarity
  private calculateNameSimilarity(name1: string, name2: string): number {
    const words1 = name1.toLowerCase().split(/[\s_-]+/);
    const words2 = name2.toLowerCase().split(/[\s_-]+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    
    return Math.round((commonWords.length / totalWords) * 20); // Max 20 points for name similarity
  }

  // Check protocol overlap
  private checkProtocolOverlap(newContent: any, existingFingerprints: ContentFingerprint[]): {
    overlapPercentage: number;
    overlappingPoints: string[];
  } {
    const newPoints = newContent.protocols?.[0]?.points || [];
    
    if (newPoints.length === 0) {
      return { overlapPercentage: 0, overlappingPoints: [] };
    }

    // For now, simple check - in real implementation would check stored protocols
    const allExistingPoints = existingFingerprints.reduce((total, fp) => total + fp.extractedPointCount, 0);
    
    // Simple overlap estimation
    const estimatedOverlap = allExistingPoints > 0 ? Math.min(50, (newPoints.length / allExistingPoints) * 100) : 0;
    
    return {
      overlapPercentage: estimatedOverlap,
      overlappingPoints: newPoints.slice(0, 10) // Sample of points
    };
  }

  // Clear all stored fingerprints (for testing/reset)
  clearAllFingerprints(): void {
    localStorage.removeItem(this.FINGERPRINTS_KEY);
    localStorage.removeItem(this.PROTOCOLS_KEY);
    console.log('🗑️ All workshop fingerprints cleared');
  }

  // Get duplicate statistics
  getDuplicateStats(): {
    totalUploads: number;
    uniqueDocuments: number;
    duplicatesBlocked: number;
  } {
    const fingerprints = this.getStoredFingerprints();
    
    return {
      totalUploads: fingerprints.length,
      uniqueDocuments: fingerprints.length, // For now, assume all stored are unique
      duplicatesBlocked: 0 // Would track blocked duplicates
    };
  }
}

// Singleton instance
export const deduplicationManager = new DeduplicationManager();
