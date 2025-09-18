// Embedding Service - Vector embeddings for RAG system
// Uses embeddinggemma model for semantic document search with intelligent caching

import { embeddingCache } from './EmbeddingCache';

export interface EmbeddingResult {
  embedding: number[];
  success: boolean;
  error?: string;
  fromCache?: boolean;
}

export class EmbeddingService {
  private readonly baseUrl: string;
  private readonly embeddingModel: string;

  constructor(baseUrl: string = 'http://localhost:11434', embeddingModel: string = 'ZimaBlueAI/Qwen3-Embedding-8B:Q5_K_M') {
    this.baseUrl = baseUrl;
    this.embeddingModel = embeddingModel;
  }

  // Create embedding for text using selected model with caching
  async createEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      // Create cache key from text content
      const cacheKey = this.createCacheKey(text);
      
      // Check cache first
      const cachedEmbedding = embeddingCache.get(cacheKey);
      if (cachedEmbedding) {
        console.log(`💾 Embedding retrieved from cache: ${cacheKey.substring(0, 20)}...`);
        return {
          embedding: cachedEmbedding,
          success: true,
          fromCache: true
        };
      }

      console.log(`🔢 Creating embedding with ${this.embeddingModel}...`);
      
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.embeddingModel,
          prompt: text
        })
      });

      if (!response.ok) {
        throw new Error(`Embedding API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the embedding for future use
      embeddingCache.set(cacheKey, data.embedding);
      
      return {
        embedding: data.embedding,
        success: true,
        fromCache: false
      };
      
    } catch (error) {
      console.error('❌ Embedding creation failed:', error);
      return {
        embedding: [],
        success: false,
        error: `Failed to create embedding: ${error}`,
        fromCache: false
      };
    }
  }

  // Create embeddings for multiple text chunks
  async createBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    console.log(`🔢 Creating ${texts.length} embeddings...`);
    
    const results = [];
    
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      console.log(`Processing embedding ${i + 1}/${texts.length}...`);
      
      const result = await this.createEmbedding(text);
      results.push(result);
      
      // Small delay to avoid overwhelming the server
      if (i < texts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`✅ Batch embedding complete: ${results.filter(r => r.success).length}/${texts.length} successful`);
    return results;
  }

  // Calculate cosine similarity between embeddings
  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      return 0;
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  // Find most similar chunks using embeddings
  findSimilarChunks(
    queryEmbedding: number[], 
    chunkEmbeddings: { id: string; embedding: number[]; content: string }[], 
    limit: number = 5
  ): { id: string; content: string; similarity: number }[] {
    
    const similarities = chunkEmbeddings.map(chunk => ({
      id: chunk.id,
      content: chunk.content,
      similarity: this.calculateSimilarity(queryEmbedding, chunk.embedding)
    }));

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  // Check if embedding model is available
  async isEmbeddingModelAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return false;
      
      const data = await response.json();
      const models = data.models?.map((model: any) => model.name) || [];
      
      return models.some((model: string) => 
        model.includes('Qwen3-Embedding') || model.includes('embeddinggemma') || model.includes('embed')
      );
    } catch (error) {
      console.error('Failed to check embedding model:', error);
      return false;
    }
  }

  // Get embedding model info
  async getEmbeddingModelInfo(): Promise<{ available: boolean; model: string; dimensions?: number }> {
    const available = await this.isEmbeddingModelAvailable();
    
    return {
      available,
      model: this.embeddingModel,
      dimensions: available ? 4096 : undefined // Qwen3-Embedding-8B dimensions
    };
  }

  // Get cache statistics
  getCacheStats() {
    return embeddingCache.getStats();
  }

  // Clear embedding cache
  clearCache(): void {
    embeddingCache.clear();
  }

  // Optimize cache performance
  optimizeCache(): void {
    embeddingCache.optimize();
  }

  // Create cache key from text content
  private createCacheKey(text: string): string {
    // Create a hash-like key from the text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Include model name in key to handle model changes
    return `${this.embeddingModel}_${Math.abs(hash).toString(16)}_${text.length}`;
  }
}

// Singleton instance with dynamic model selection
class EmbeddingServiceManager {
  private service: EmbeddingService;
  
  constructor() {
    this.service = new EmbeddingService();
  }
  
  setModel(model: string) {
    this.service = new EmbeddingService('http://localhost:11434', model);
    console.log('🔢 Embedding model changed to:', model);
    
    // Force update the singleton reference (browser-safe)
    (window as any).embeddingService = this.service;
  }
  
  getService(): EmbeddingService {
    return this.service;
  }
}

export const embeddingManager = new EmbeddingServiceManager();
export const embeddingService = embeddingManager.getService();
