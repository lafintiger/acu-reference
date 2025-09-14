import MiniSearch from 'minisearch';
import { Point, Indication, Technique, Herb, DietItem } from '../types';

export interface SearchResult {
  type: 'point' | 'indication' | 'technique' | 'herb' | 'diet';
  id: string;
  title: string;
  subtitle?: string;
  snippet?: string;
  score: number;
  data: Point | Indication | Technique | Herb | DietItem;
}

class SearchService {
  private pointsIndex: MiniSearch<Point & { type: 'point' }>;
  private indicationsIndex: MiniSearch<Indication & { type: 'indication' }>;
  private techniquesIndex: MiniSearch<Technique & { type: 'technique' }>;
  private herbsIndex: MiniSearch<Herb & { type: 'herb' }>;
  private dietIndex: MiniSearch<DietItem & { type: 'diet' }>;

  constructor() {
    // Points search configuration
    this.pointsIndex = new MiniSearch({
      fields: ['id', 'nameEn', 'namePinyin', 'nameCharacters', 'location', 'indications', 'notes', 'meridianId'],
      storeFields: ['id', 'nameEn', 'namePinyin', 'meridianId', 'location', 'indications', 'contraindications', 'acupressureDepth', 'notes', 'category'],
      searchOptions: {
        boost: { id: 3, nameEn: 2, namePinyin: 2, indications: 1.5 },
        fuzzy: 0.2,
        prefix: true
      }
    });

    // Indications search configuration
    this.indicationsIndex = new MiniSearch({
      fields: ['id', 'label', 'synonyms', 'category'],
      storeFields: ['id', 'label', 'synonyms', 'category'],
      searchOptions: {
        boost: { label: 2, synonyms: 1.5 },
        fuzzy: 0.2,
        prefix: true
      }
    });

    // Techniques search configuration
    this.techniquesIndex = new MiniSearch({
      fields: ['id', 'name', 'description', 'modalityId'],
      storeFields: ['id', 'name', 'description', 'modalityId', 'cautions', 'duration', 'equipment'],
      searchOptions: {
        boost: { name: 2, modalityId: 1.5 },
        fuzzy: 0.2,
        prefix: true
      }
    });

    // Herbs search configuration
    this.herbsIndex = new MiniSearch({
      fields: ['id', 'name', 'nameChinese', 'properties', 'meridians'],
      storeFields: ['id', 'name', 'nameChinese', 'properties', 'meridians', 'cautions', 'dosage'],
      searchOptions: {
        boost: { name: 2, nameChinese: 1.5 },
        fuzzy: 0.2,
        prefix: true
      }
    });

    // Diet items search configuration
    this.dietIndex = new MiniSearch({
      fields: ['id', 'name', 'guidance', 'properties', 'category'],
      storeFields: ['id', 'name', 'guidance', 'properties', 'category'],
      searchOptions: {
        boost: { name: 2 },
        fuzzy: 0.2,
        prefix: true
      }
    });
  }

  // Index all data
  async indexData(data: {
    points: Point[];
    indications: Indication[];
    techniques: Technique[];
    herbs: Herb[];
    dietItems: DietItem[];
  }) {
    // Clear existing indexes
    this.pointsIndex.removeAll();
    this.indicationsIndex.removeAll();
    this.techniquesIndex.removeAll();
    this.herbsIndex.removeAll();
    this.dietIndex.removeAll();

    // Index points
    const pointsWithType = data.points.map(point => ({
      ...point,
      type: 'point' as const,
      // Flatten arrays for search
      indications: point.indications.join(' '),
      contraindications: point.contraindications?.join(' ') || ''
    }));
    this.pointsIndex.addAll(pointsWithType);

    // Index indications
    const indicationsWithType = data.indications.map(indication => ({
      ...indication,
      type: 'indication' as const,
      synonyms: indication.synonyms?.join(' ') || ''
    }));
    this.indicationsIndex.addAll(indicationsWithType);

    // Index techniques
    const techniquesWithType = data.techniques.map(technique => ({
      ...technique,
      type: 'technique' as const,
      equipment: technique.equipment?.join(' ') || ''
    }));
    this.techniquesIndex.addAll(techniquesWithType);

    // Index herbs
    const herbsWithType = data.herbs.map(herb => ({
      ...herb,
      type: 'herb' as const,
      meridians: herb.meridians?.join(' ') || ''
    }));
    this.herbsIndex.addAll(herbsWithType);

    // Index diet items
    const dietWithType = data.dietItems.map(item => ({
      ...item,
      type: 'diet' as const
    }));
    this.dietIndex.addAll(dietWithType);

    console.log('Search indexes built:', {
      points: data.points.length,
      indications: data.indications.length,
      techniques: data.techniques.length,
      herbs: data.herbs.length,
      dietItems: data.dietItems.length
    });
  }

  // Unified search across all types
  search(query: string, filters?: {
    type?: 'point' | 'indication' | 'technique' | 'herb' | 'diet';
    meridian?: string;
    category?: string;
  }): SearchResult[] {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];

    // Search points
    if (!filters?.type || filters.type === 'point') {
      const pointResults = this.pointsIndex.search(query);
      results.push(...pointResults.map(result => ({
        type: 'point' as const,
        id: result.id,
        title: `${result.id} — ${result.nameEn}`,
        subtitle: result.namePinyin || result.meridianId,
        snippet: this.createSnippet(result.location, query),
        score: result.score,
        data: result as Point
      })));
    }

    // Search indications
    if (!filters?.type || filters.type === 'indication') {
      const indicationResults = this.indicationsIndex.search(query);
      results.push(...indicationResults.map(result => ({
        type: 'indication' as const,
        id: result.id,
        title: result.label,
        subtitle: result.category,
        snippet: this.createSnippet(result.synonyms || '', query),
        score: result.score,
        data: result as Indication
      })));
    }

    // Search techniques
    if (!filters?.type || filters.type === 'technique') {
      const techniqueResults = this.techniquesIndex.search(query);
      results.push(...techniqueResults.map(result => ({
        type: 'technique' as const,
        id: result.id,
        title: result.name,
        subtitle: result.modalityId,
        snippet: this.createSnippet(result.description || '', query),
        score: result.score,
        data: result as Technique
      })));
    }

    // Search herbs
    if (!filters?.type || filters.type === 'herb') {
      const herbResults = this.herbsIndex.search(query);
      results.push(...herbResults.map(result => ({
        type: 'herb' as const,
        id: result.id,
        title: result.name,
        subtitle: result.nameChinese,
        snippet: this.createSnippet(result.properties || '', query),
        score: result.score,
        data: result as Herb
      })));
    }

    // Search diet items
    if (!filters?.type || filters.type === 'diet') {
      const dietResults = this.dietIndex.search(query);
      results.push(...dietResults.map(result => ({
        type: 'diet' as const,
        id: result.id,
        title: result.name,
        subtitle: result.category,
        snippet: this.createSnippet(result.guidance || '', query),
        score: result.score,
        data: result as DietItem
      })));
    }

    // Sort by score and apply filters
    let filteredResults = results.sort((a, b) => b.score - a.score);

    // Apply meridian filter for points
    if (filters?.meridian && filters.meridian !== '') {
      filteredResults = filteredResults.filter(result => {
        if (result.type === 'point') {
          const point = result.data as Point;
          return point.meridianId === filters.meridian;
        }
        return true;
      });
    }

    // Apply category filter
    if (filters?.category && filters.category !== '') {
      filteredResults = filteredResults.filter(result => {
        if (result.type === 'indication') {
          const indication = result.data as Indication;
          return indication.category === filters.category;
        }
        if (result.type === 'point') {
          const point = result.data as Point;
          return point.category === filters.category;
        }
        return true;
      });
    }

    return filteredResults.slice(0, 50); // Limit results
  }

  // Create search snippet with highlighted terms
  private createSnippet(text: string, query: string, maxLength: number = 150): string {
    if (!text) return '';
    
    const queryTerms = query.toLowerCase().split(' ');
    const lowerText = text.toLowerCase();
    
    // Find the best position to show the snippet
    let bestIndex = 0;
    let bestScore = 0;
    
    for (const term of queryTerms) {
      const index = lowerText.indexOf(term);
      if (index !== -1 && index > bestScore) {
        bestIndex = index;
        bestScore = index;
      }
    }
    
    // Extract snippet around the best match
    const start = Math.max(0, bestIndex - 50);
    const end = Math.min(text.length, start + maxLength);
    let snippet = text.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    return snippet;
  }

  // Get suggestions for autocomplete
  autoSuggest(query: string, limit: number = 10): string[] {
    if (!query.trim()) return [];

    const suggestions = new Set<string>();
    
    // Get suggestions from all indexes
    const pointSuggestions = this.pointsIndex.autoSuggest(query, { maxResults: limit });
    const indicationSuggestions = this.indicationsIndex.autoSuggest(query, { maxResults: limit });
    
    pointSuggestions.forEach(s => suggestions.add(s.suggestion));
    indicationSuggestions.forEach(s => suggestions.add(s.suggestion));
    
    return Array.from(suggestions).slice(0, limit);
  }
}

export const searchService = new SearchService();
