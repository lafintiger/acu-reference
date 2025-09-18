// Intelligent Embedding Cache
// Optimizes storage and retrieval of embeddings with LRU eviction

export interface CacheEntry {
  embedding: number[];
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  compressed: boolean;
}

export interface CacheStats {
  totalEntries: number;
  memoryUsage: number; // bytes
  hitRate: number;
  evictionCount: number;
}

export class EmbeddingCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private maxMemoryMB: number;
  private compressionThreshold: number;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };

  constructor(
    maxSize: number = 1000,
    maxMemoryMB: number = 50,
    compressionThreshold: number = 100
  ) {
    this.maxSize = maxSize;
    this.maxMemoryMB = maxMemoryMB;
    this.compressionThreshold = compressionThreshold;
  }

  /**
   * Get embedding from cache
   */
  get(key: string): number[] | undefined {
    const entry = this.cache.get(key);
    
    if (entry) {
      // Update access statistics
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      this.stats.hits++;
      
      // Decompress if needed
      return entry.compressed ? this.decompressEmbedding(entry.embedding) : entry.embedding;
    } else {
      this.stats.misses++;
      return undefined;
    }
  }

  /**
   * Store embedding in cache with intelligent compression
   */
  set(key: string, embedding: number[]): void {
    // Check if we need to evict entries first
    this.ensureCapacity();

    const shouldCompress = embedding.length > this.compressionThreshold;
    const processedEmbedding = shouldCompress ? this.compressEmbedding(embedding) : embedding;

    const entry: CacheEntry = {
      embedding: processedEmbedding,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
      compressed: shouldCompress
    };

    this.cache.set(key, entry);
    console.log(`📦 Cached embedding: ${key} (compressed: ${shouldCompress})`);
  }

  /**
   * Check if embedding exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Remove embedding from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, evictions: 0 };
    console.log('🗑️ Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const memoryUsage = this.calculateMemoryUsage();
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;

    return {
      totalEntries: this.cache.size,
      memoryUsage,
      hitRate: Math.round(hitRate * 100) / 100,
      evictionCount: this.stats.evictions
    };
  }

  /**
   * Optimize cache by compressing large embeddings and evicting old entries
   */
  optimize(): void {
    console.log('🔧 Optimizing embedding cache...');
    
    let optimizedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      // Compress uncompressed large embeddings
      if (!entry.compressed && entry.embedding.length > this.compressionThreshold) {
        entry.embedding = this.compressEmbedding(entry.embedding);
        entry.compressed = true;
        optimizedCount++;
      }
    }

    // Evict least recently used entries if over memory limit
    this.evictByMemoryPressure();

    console.log(`✅ Cache optimization complete: ${optimizedCount} embeddings compressed`);
  }

  /**
   * Export cache data for backup
   */
  exportCache(): string {
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      entries: Array.from(this.cache.entries()),
      stats: this.stats
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import cache data from backup
   */
  importCache(exportedData: string): void {
    try {
      const data = JSON.parse(exportedData);
      
      if (data.version !== '1.0') {
        throw new Error(`Unsupported cache version: ${data.version}`);
      }

      this.cache.clear();
      
      for (const [key, entry] of data.entries) {
        this.cache.set(key, entry);
      }

      this.stats = data.stats || { hits: 0, misses: 0, evictions: 0 };
      
      console.log(`📥 Cache imported: ${this.cache.size} entries`);
    } catch (error) {
      console.error('❌ Failed to import cache:', error);
      throw error;
    }
  }

  /**
   * Private helper methods
   */
  private ensureCapacity(): void {
    // Check size limit
    if (this.cache.size >= this.maxSize) {
      this.evictLeastRecentlyUsed();
    }

    // Check memory limit
    const memoryUsageMB = this.calculateMemoryUsage() / (1024 * 1024);
    if (memoryUsageMB > this.maxMemoryMB) {
      this.evictByMemoryPressure();
    }
  }

  private evictLeastRecentlyUsed(): void {
    if (this.cache.size === 0) return;

    // Find least recently used entry
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
      console.log(`🗑️ Evicted LRU entry: ${oldestKey}`);
    }
  }

  private evictByMemoryPressure(): void {
    const targetReduction = 0.2; // Remove 20% of entries
    const targetSize = Math.floor(this.cache.size * (1 - targetReduction));

    // Sort entries by access frequency and recency
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({
        key,
        entry,
        score: entry.accessCount * 0.7 + (Date.now() - entry.lastAccessed) * 0.3
      }))
      .sort((a, b) => a.score - b.score); // Lower score = higher priority for eviction

    // Remove lowest priority entries
    while (this.cache.size > targetSize && entries.length > 0) {
      const { key } = entries.shift()!;
      this.cache.delete(key);
      this.stats.evictions++;
    }

    console.log(`🗑️ Memory pressure eviction: ${this.stats.evictions} entries removed`);
  }

  private compressEmbedding(embedding: number[]): number[] {
    // Reduce precision to save space (4 decimal places)
    return embedding.map(val => Math.round(val * 10000) / 10000);
  }

  private decompressEmbedding(compressed: number[]): number[] {
    // Compressed embeddings are already in the right format
    return compressed;
  }

  private calculateMemoryUsage(): number {
    let totalBytes = 0;

    for (const entry of this.cache.values()) {
      // Each number is approximately 8 bytes (64-bit float)
      const embeddingBytes = entry.embedding.length * 8;
      
      // Add overhead for entry metadata
      const metadataBytes = 64; // timestamp, accessCount, etc.
      
      totalBytes += embeddingBytes + metadataBytes;
    }

    return totalBytes;
  }
}

// Singleton instance for global use
export const embeddingCache = new EmbeddingCache(
  1000, // Max 1000 entries
  50,   // Max 50MB memory
  100   // Compress embeddings > 100 dimensions
);

// Periodic optimization
setInterval(() => {
  if (embeddingCache.getStats().totalEntries > 100) {
    embeddingCache.optimize();
  }
}, 5 * 60 * 1000); // Every 5 minutes
