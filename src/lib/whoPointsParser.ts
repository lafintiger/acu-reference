// Parser for WHO Standard Acupuncture Point Locations CSV data
import { Point } from '../types';

export interface WHOPointData {
  meridian: string;
  pointCode: string;
  pointNamePinyin: string;
  chineseName: string;
  locationDescription: string;
  indications: string;
  category: string;
  element: string;
  sexSpecificNotes: string;
  source: string;
}

export class WHOPointsParser {
  static parseCSVLine(line: string): WHOPointData | null {
    // Simple CSV parsing - in production would use a proper CSV parser
    const fields = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));
    
    if (fields.length < 6) return null;
    
    return {
      meridian: fields[0] || '',
      pointCode: fields[1] || '',
      pointNamePinyin: fields[2] || '',
      chineseName: fields[3] || '',
      locationDescription: fields[4] || '',
      indications: fields[5] || '',
      category: fields[6] || '',
      element: fields[7] || '',
      sexSpecificNotes: fields[8] || '',
      source: fields[9] || ''
    };
  }

  static convertWHOPointToAppFormat(whoPoint: WHOPointData): Point {
    // Convert WHO data to our app's Point format
    const pointCode = whoPoint.pointCode;
    const meridianId = whoPoint.meridian;
    
    // Extract English name from pinyin (if available) or use pinyin
    const nameEn = this.extractEnglishName(whoPoint.pointNamePinyin) || whoPoint.pointNamePinyin;
    
    // Clean up location description
    const location = this.cleanLocationDescription(whoPoint.locationDescription);
    
    // Parse indications
    const indications = this.parseIndications(whoPoint.indications);
    
    // Determine point category
    const category = this.determineCategory(whoPoint.category, whoPoint.pointCode);
    
    return {
      id: pointCode,
      meridianId: meridianId || undefined,
      nameEn: nameEn,
      namePinyin: whoPoint.pointNamePinyin,
      nameCharacters: whoPoint.chineseName,
      category: category,
      location: location,
      indications: indications,
      contraindications: this.extractContraindications(whoPoint.sexSpecificNotes),
      acupressureDepth: this.generateAcupressureGuidance(pointCode, whoPoint.category),
      notes: this.generateClinicalNotes(whoPoint)
    };
  }

  private static extractEnglishName(pinyin: string): string {
    // Extract English name if present in parentheses or use pinyin
    const englishMatch = pinyin.match(/\(([^)]+)\)/);
    return englishMatch ? englishMatch[1] : pinyin;
  }

  private static cleanLocationDescription(description: string): string {
    // Clean up the location description by removing figure references and extra text
    return description
      .replace(/\(Fig \d+\)/g, '')
      .replace(/WHO S.*?POI.*?n S \d+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static parseIndications(indicationsText: string): string[] {
    // Parse indications from text - this would need more sophisticated parsing
    if (!indicationsText) return [];
    
    // Basic parsing - in production would be more comprehensive
    return indicationsText
      .split(/[,;]/)
      .map(indication => indication.trim().toLowerCase().replace(/\s+/g, '_'))
      .filter(indication => indication.length > 0);
  }

  private static determineCategory(category: string, pointCode: string): 'standard' | 'extra' | 'extraordinary' | 'auricular' {
    if (category) {
      if (category.toLowerCase().includes('xi-cleft') || category.toLowerCase().includes('luo') || category.toLowerCase().includes('source')) {
        return 'standard';
      }
    }
    
    // Determine by point code
    if (pointCode.startsWith('GV') || pointCode.startsWith('CV') || pointCode.startsWith('DU') || pointCode.startsWith('REN')) {
      return 'extraordinary';
    }
    
    if (pointCode.startsWith('EX') || pointCode.startsWith('M-')) {
      return 'extra';
    }
    
    if (pointCode.includes('AU') || pointCode.includes('ear')) {
      return 'auricular';
    }
    
    return 'standard';
  }

  private static extractContraindications(sexSpecificNotes: string): string[] | undefined {
    if (!sexSpecificNotes) return undefined;
    
    const contraindications: string[] = [];
    
    // Look for common contraindication keywords
    if (sexSpecificNotes.toLowerCase().includes('pregnancy')) {
      contraindications.push('pregnancy');
    }
    
    if (sexSpecificNotes.toLowerCase().includes('deep needling') || sexSpecificNotes.toLowerCase().includes('deep pressure')) {
      contraindications.push('deep_needling');
    }
    
    return contraindications.length > 0 ? contraindications : undefined;
  }

  private static generateAcupressureGuidance(pointCode: string, category: string): string {
    // Generate appropriate acupressure guidance based on point characteristics
    if (category?.toLowerCase().includes('xi-cleft')) {
      return 'Moderate to firm pressure, 1-2 minutes (acute conditions)';
    }
    
    if (category?.toLowerCase().includes('source')) {
      return 'Moderate pressure, 2-3 minutes (tonification)';
    }
    
    if (pointCode.includes('1') || pointCode.includes('11') || pointCode.endsWith('9')) {
      return 'Light pressure with fingernail, 30-60 seconds (well points)';
    }
    
    if (pointCode.startsWith('GV') || pointCode.startsWith('CV')) {
      return 'Light to moderate pressure, 1-3 minutes';
    }
    
    // Default guidance
    return 'Moderate pressure, 1-2 minutes';
  }

  private static generateClinicalNotes(whoPoint: WHOPointData): string {
    let notes = '';
    
    if (whoPoint.category) {
      notes += `${whoPoint.category} point. `;
    }
    
    if (whoPoint.element) {
      notes += `${whoPoint.element} element meridian. `;
    }
    
    if (whoPoint.source && whoPoint.source.includes('WHO')) {
      notes += 'Location based on WHO Standard Acupuncture Point Locations.';
    }
    
    return notes.trim();
  }
}

// Function to load and parse WHO points data
export const loadWHOPointsData = async (): Promise<Point[]> => {
  try {
    // In a real implementation, we would fetch the CSV file
    // For now, we'll return the existing points with WHO validation
    console.log('WHO Points data integration planned - would validate against CSV');
    return [];
  } catch (error) {
    console.error('Failed to load WHO points data:', error);
    return [];
  }
};
