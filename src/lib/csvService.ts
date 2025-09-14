import { Point, Indication, Technique, Herb, DietItem } from '../types';

export class CSVService {
  // Generate CSV templates
  static generatePointsTemplate(): string {
    const headers = [
      'id',
      'meridianId', 
      'nameEn',
      'namePinyin',
      'nameCharacters',
      'category',
      'location',
      'indications',
      'contraindications',
      'acupressureDepth',
      'notes'
    ];

    const sampleRow = [
      'LI4',
      'LI',
      'Hegu',
      'He Gu',
      '合谷',
      'standard',
      'On the dorsum of the hand, between the 1st and 2nd metacarpal bones',
      'headache,toothache,facial_pain',
      'pregnancy',
      'Firm pressure 30-60 seconds',
      'Commonly paired with GB20 for headache relief'
    ];

    return [headers.join(','), sampleRow.join(',')].join('\n');
  }

  static generateIndicationsTemplate(): string {
    const headers = ['id', 'label', 'synonyms', 'category'];
    const sampleRow = ['headache', 'Headache', 'cephalalgia,head pain', 'pain'];
    
    return [headers.join(','), sampleRow.join(',')].join('\n');
  }

  static generateTechniquesTemplate(): string {
    const headers = ['id', 'modalityId', 'name', 'description', 'cautions', 'duration', 'equipment'];
    const sampleRow = [
      'acupressure_sustained',
      'acupressure',
      'Sustained Pressure',
      'Apply steady pressure to point for 1-3 minutes',
      '',
      '1-3 minutes',
      'fingers,thumbs'
    ];
    
    return [headers.join(','), sampleRow.join(',')].join('\n');
  }

  static generateHerbsTemplate(): string {
    const headers = ['id', 'name', 'nameChinese', 'properties', 'meridians', 'cautions', 'dosage'];
    const sampleRow = [
      'chrysanthemum',
      'Chrysanthemum',
      '菊花 (Jú Huā)',
      'Sweet, bitter, slightly cold',
      'LU,LV',
      'Avoid in yang deficiency conditions',
      '5-10g in tea'
    ];
    
    return [headers.join(','), sampleRow.join(',')].join('\n');
  }

  static generateDietTemplate(): string {
    const headers = ['id', 'name', 'guidance', 'properties', 'category'];
    const sampleRow = [
      'warm_water',
      'Warm Water',
      'Drink throughout day, especially upon waking',
      'Neutral, supports digestion',
      'drink'
    ];
    
    return [headers.join(','), sampleRow.join(',')].join('\n');
  }

  // Parse CSV data
  static parseCSV(csvText: string): string[][] {
    const lines = csvText.trim().split('\n');
    const result: string[][] = [];
    
    for (const line of lines) {
      // Simple CSV parsing (handles basic cases)
      const fields = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));
      result.push(fields);
    }
    
    return result;
  }

  // Convert CSV to JSON for points
  static csvToPoints(csvText: string): Point[] {
    const rows = this.parseCSV(csvText);
    if (rows.length < 2) return [];
    
    const headers = rows[0];
    const points: Point[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < headers.length) continue;
      
      const point: Point = {
        id: row[0],
        meridianId: row[1] || undefined,
        nameEn: row[2],
        namePinyin: row[3] || undefined,
        nameCharacters: row[4] || undefined,
        category: (row[5] as any) || 'standard',
        location: row[6],
        indications: row[7] ? row[7].split(',').map(s => s.trim()) : [],
        contraindications: row[8] ? row[8].split(',').map(s => s.trim()) : undefined,
        acupressureDepth: row[9] || undefined,
        notes: row[10] || undefined
      };
      
      points.push(point);
    }
    
    return points;
  }

  // Convert CSV to JSON for indications
  static csvToIndications(csvText: string): Indication[] {
    const rows = this.parseCSV(csvText);
    if (rows.length < 2) return [];
    
    const headers = rows[0];
    const indications: Indication[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < headers.length) continue;
      
      const indication: Indication = {
        id: row[0],
        label: row[1],
        synonyms: row[2] ? row[2].split(',').map(s => s.trim()) : undefined,
        category: row[3] || undefined
      };
      
      indications.push(indication);
    }
    
    return indications;
  }

  // Convert CSV to JSON for techniques
  static csvToTechniques(csvText: string): Technique[] {
    const rows = this.parseCSV(csvText);
    if (rows.length < 2) return [];
    
    const headers = rows[0];
    const techniques: Technique[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < headers.length) continue;
      
      const technique: Technique = {
        id: row[0],
        modalityId: row[1] as any,
        name: row[2],
        description: row[3] || undefined,
        cautions: row[4] || undefined,
        duration: row[5] || undefined,
        equipment: row[6] ? row[6].split(',').map(s => s.trim()) : undefined
      };
      
      techniques.push(technique);
    }
    
    return techniques;
  }

  // Download CSV template
  static downloadTemplate(type: 'points' | 'indications' | 'techniques' | 'herbs' | 'diet') {
    let content = '';
    let filename = '';
    
    switch (type) {
      case 'points':
        content = this.generatePointsTemplate();
        filename = 'acuref-points-template.csv';
        break;
      case 'indications':
        content = this.generateIndicationsTemplate();
        filename = 'acuref-indications-template.csv';
        break;
      case 'techniques':
        content = this.generateTechniquesTemplate();
        filename = 'acuref-techniques-template.csv';
        break;
      case 'herbs':
        content = this.generateHerbsTemplate();
        filename = 'acuref-herbs-template.csv';
        break;
      case 'diet':
        content = this.generateDietTemplate();
        filename = 'acuref-diet-template.csv';
        break;
    }
    
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Export current data as CSV
  static async exportToCSV(data: Point[] | Indication[] | Technique[], type: 'points' | 'indications' | 'techniques'): Promise<void> {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';

    switch (type) {
      case 'points':
        headers = ['id', 'meridianId', 'nameEn', 'namePinyin', 'nameCharacters', 'category', 'location', 'indications', 'contraindications', 'acupressureDepth', 'notes'];
        rows = (data as Point[]).map(point => [
          point.id,
          point.meridianId || '',
          point.nameEn,
          point.namePinyin || '',
          point.nameCharacters || '',
          point.category || 'standard',
          point.location,
          point.indications.join(','),
          point.contraindications?.join(',') || '',
          point.acupressureDepth || '',
          point.notes || ''
        ]);
        filename = 'acuref-points-export.csv';
        break;
        
      case 'indications':
        headers = ['id', 'label', 'synonyms', 'category'];
        rows = (data as Indication[]).map(indication => [
          indication.id,
          indication.label,
          indication.synonyms?.join(',') || '',
          indication.category || ''
        ]);
        filename = 'acuref-indications-export.csv';
        break;
        
      case 'techniques':
        headers = ['id', 'modalityId', 'name', 'description', 'cautions', 'duration', 'equipment'];
        rows = (data as Technique[]).map(technique => [
          technique.id,
          technique.modalityId,
          technique.name,
          technique.description || '',
          technique.cautions || '',
          technique.duration || '',
          technique.equipment?.join(',') || ''
        ]);
        filename = 'acuref-techniques-export.csv';
        break;
    }

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
