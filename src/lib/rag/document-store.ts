// Document Store - RAG System for Manual Library
// Stores and indexes workshop manuals for intelligent search and AI context

import { embeddingService } from './embedding-service';

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  chunkIndex: number;
  content: string;
  contentType: 'procedure' | 'theory' | 'points' | 'general';
  keywords: string[];
  embedding?: number[]; // Vector embedding for semantic search
}

export interface StoredDocument {
  id: string;
  fileName: string;
  title: string;
  uploadDate: string;
  pageCount: number;
  chunkCount: number;
  documentType: 'workshop' | 'manual' | 'research' | 'reference';
  tags: string[];
  summary?: string;
}

export class DocumentStore {
  private readonly DOCUMENTS_KEY = 'rag_documents';
  private readonly CHUNKS_KEY = 'rag_chunks';
  private readonly INDEX_KEY = 'rag_search_index';

  // Store a document and create searchable chunks with embeddings
  async storeDocument(
    fileName: string,
    extractedText: string,
    documentType: 'workshop' | 'manual' | 'research' | 'reference' = 'manual'
  ): Promise<string> {
    const documentId = `doc_${Date.now()}`;
    
    console.log('📚 Storing document for RAG system:', fileName);
    
    // Split text into pages
    const pages = extractedText.split(/--- Page \d+ ---/);
    
    // Create document chunks
    const chunks = this.createDocumentChunks(documentId, fileName, pages);
    
    // Create embeddings for semantic search
    console.log('🔢 Creating embeddings for semantic search...');
    await this.createEmbeddingsForChunks(chunks);
    
    // Store document metadata
    const document: StoredDocument = {
      id: documentId,
      fileName,
      title: fileName.replace('.pdf', ''),
      uploadDate: new Date().toISOString(),
      pageCount: pages.length,
      chunkCount: chunks.length,
      documentType,
      tags: this.extractTags(extractedText),
      summary: this.createDocumentSummary(extractedText)
    };
    
    // Save to storage
    this.saveDocument(document);
    this.saveChunks(chunks);
    this.updateSearchIndex(chunks);
    
    console.log(`✅ Document stored: ${chunks.length} chunks created`);
    return documentId;
  }

  // Create searchable chunks from document pages
  private createDocumentChunks(documentId: string, fileName: string, pages: string[]): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    
    pages.forEach((pageContent, pageIndex) => {
      if (pageContent.trim().length < 100) return; // Skip short pages
      
      // Split page into smaller chunks for better search
      const pageChunks = this.splitPageIntoChunks(pageContent, 500); // 500 char chunks
      
      pageChunks.forEach((chunkContent, chunkIndex) => {
        const chunk: DocumentChunk = {
          id: `${documentId}_p${pageIndex + 1}_c${chunkIndex}`,
          documentId,
          documentTitle: fileName.replace('.pdf', ''),
          pageNumber: pageIndex + 1,
          chunkIndex,
          content: chunkContent.trim(),
          contentType: this.classifyContent(chunkContent),
          keywords: this.extractKeywords(chunkContent)
        };
        
        chunks.push(chunk);
      });
    });
    
    return chunks;
  }

  // Create embeddings for document chunks
  private async createEmbeddingsForChunks(chunks: DocumentChunk[]): Promise<void> {
    try {
      // Use the selected embedding model (Qwen3)
      const { embeddingManager } = await import('./embedding-service');
      embeddingManager.setModel('ZimaBlueAI/Qwen3-Embedding-8B:Q5_K_M');
      
      // Check if embedding model is available
      const modelInfo = await embeddingService.getEmbeddingModelInfo();
      if (!modelInfo.available) {
        console.warn('⚠️ No embedding model available, using keyword search only');
        return;
      }
      
      console.log(`🔢 Creating embeddings for ${chunks.length} chunks...`);
      
      // Create embeddings in smaller batches and reduce storage size
      const batchSize = 3; // Smaller batches for large model
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const texts = batch.map(chunk => chunk.content);
        
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}...`);
        
        const embeddings = await embeddingService.createBatchEmbeddings(texts);
        
        // Assign compressed embeddings to chunks to save storage
        batch.forEach((chunk, index) => {
          if (embeddings[index].success) {
            // Compress embedding immediately to save storage
            chunk.embedding = this.compressEmbedding(embeddings[index].embedding);
          }
        });
      }
      
      console.log('✅ Embeddings created for all chunks');
      
    } catch (error) {
      console.error('❌ Failed to create embeddings:', error);
    }
  }

  // Split page content into searchable chunks
  private splitPageIntoChunks(content: string, maxLength: number): string[] {
    const chunks = [];
    const sentences = content.split(/[.!?]+/);
    let currentChunk = '';
    
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (!trimmed) return;
      
      if (currentChunk.length + trimmed.length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = trimmed;
        }
      } else {
        currentChunk += (currentChunk ? '. ' : '') + trimmed;
      }
    });
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  // Classify content type for better search
  private classifyContent(content: string): DocumentChunk['contentType'] {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('procedure') || lowerContent.includes('test') || 
        lowerContent.includes('correction') || lowerContent.includes('technique')) {
      return 'procedure';
    }
    
    if (lowerContent.match(/\b(li|lu|st|sp|bl|ki|gb|ht|si|te|pc|lv|gv|cv|du|ren)\s*\d+\b/)) {
      return 'points';
    }
    
    if (lowerContent.includes('theory') || lowerContent.includes('principle') || 
        lowerContent.includes('concept') || lowerContent.includes('meridian')) {
      return 'theory';
    }
    
    return 'general';
  }

  // Extract keywords for search indexing
  private extractKeywords(content: string): string[] {
    const keywords = new Set<string>();
    
    // Extract acupuncture points
    const points = content.match(/\b(LI|LU|ST|SP|BL|KI|GB|HT|SI|TE|PC|LV|GV|CV|DU|REN)\s*\d+\b/gi);
    if (points) {
      points.forEach(point => keywords.add(point.toUpperCase()));
    }
    
    // Extract important terms
    const terms = content.toLowerCase().match(/\b(test|correction|technique|procedure|muscle|stress|pain|energy|balance|meridian|point|assessment)\b/g);
    if (terms) {
      terms.forEach(term => keywords.add(term));
    }
    
    return Array.from(keywords);
  }

  // Extract document tags
  private extractTags(content: string): string[] {
    const tags = [];
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('applied kinesiology')) tags.push('applied-kinesiology');
    if (lowerContent.includes('acupuncture')) tags.push('acupuncture');
    if (lowerContent.includes('muscle test')) tags.push('muscle-testing');
    if (lowerContent.includes('correction')) tags.push('corrections');
    if (lowerContent.includes('stress')) tags.push('stress-relief');
    if (lowerContent.includes('pain')) tags.push('pain-relief');
    if (lowerContent.includes('energy')) tags.push('energy-work');
    
    return tags;
  }

  // Create document summary
  private createDocumentSummary(content: string): string {
    const firstPage = content.split(/--- Page \d+ ---/)[1] || content.substring(0, 1000);
    return firstPage.substring(0, 200).trim() + '...';
  }

  // Search documents using semantic embeddings + keyword fallback
  async searchDocuments(query: string, limit: number = 5): Promise<DocumentChunk[]> {
    const allChunks = this.getAllChunks();
    
    // Check if we have embeddings available
    const chunksWithEmbeddings = allChunks.filter(chunk => chunk.embedding && chunk.embedding.length > 0);
    
    if (chunksWithEmbeddings.length > 0) {
      // Use semantic search with embeddings
      console.log('🔍 Using semantic search with embeddings...');
      return await this.semanticSearch(query, chunksWithEmbeddings, limit);
    } else {
      // Fallback to keyword search
      console.log('🔍 Using keyword search (no embeddings available)...');
      return this.keywordSearch(query, allChunks, limit);
    }
  }

  // Semantic search using embeddings
  private async semanticSearch(query: string, chunks: DocumentChunk[], limit: number): Promise<DocumentChunk[]> {
    try {
      // Create embedding for the query
      const queryEmbeddingResult = await embeddingService.createEmbedding(query);
      
      if (!queryEmbeddingResult.success) {
        console.warn('⚠️ Query embedding failed, falling back to keyword search');
        return this.keywordSearch(query, chunks, limit);
      }
      
      // Find similar chunks using cosine similarity
      const chunkEmbeddings = chunks.map(chunk => ({
        id: chunk.id,
        embedding: chunk.embedding!,
        content: chunk.content,
        chunk
      }));
      
      const similarChunks = embeddingService.findSimilarChunks(
        queryEmbeddingResult.embedding,
        chunkEmbeddings,
        limit
      );
      
      // Return chunks with similarity scores
      return similarChunks.map(result => {
        const chunk = chunks.find(c => c.id === result.id)!;
        return { ...chunk, score: Math.round(result.similarity * 100) };
      });
      
    } catch (error) {
      console.error('❌ Semantic search failed:', error);
      return this.keywordSearch(query, chunks, limit);
    }
  }

  // Keyword search fallback
  private keywordSearch(query: string, chunks: DocumentChunk[], limit: number): DocumentChunk[] {
    const lowerQuery = query.toLowerCase();
    
    // Score chunks based on relevance
    const scoredChunks = chunks.map(chunk => {
      let score = 0;
      const lowerContent = chunk.content.toLowerCase();
      
      // Exact keyword matches
      if (chunk.keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()))) {
        score += 10;
      }
      
      // Content contains query terms
      const queryWords = lowerQuery.split(/\s+/);
      queryWords.forEach(word => {
        if (lowerContent.includes(word)) {
          score += 5;
        }
      });
      
      // Boost for procedure content
      if (chunk.contentType === 'procedure' && lowerQuery.includes('how')) {
        score += 5;
      }
      
      // Boost for point content
      if (chunk.contentType === 'points' && lowerQuery.match(/\b(li|lu|st|sp|bl|ki|gb|ht|si|te|pc|lv|gv|cv)\d+\b/i)) {
        score += 8;
      }
      
      return { ...chunk, score };
    });
    
    // Return top results
    return scoredChunks
      .filter(chunk => chunk.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Get context for AI assistant using semantic search
  async getContextForQuery(query: string): Promise<string> {
    const relevantChunks = await this.searchDocuments(query, 3);
    
    if (relevantChunks.length === 0) {
      return 'No relevant content found in manual library.';
    }
    
    const context = relevantChunks.map(chunk => 
      `[${chunk.documentTitle}, Page ${chunk.pageNumber}]\n${chunk.content}`
    ).join('\n\n---\n\n');
    
    return `Relevant content from your manual library:\n\n${context}`;
  }

  // Storage methods
  private saveDocument(document: StoredDocument): void {
    try {
      const documents = this.getAllDocuments();
      documents.push(document);
      localStorage.setItem(this.DOCUMENTS_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  }

  private saveChunks(chunks: DocumentChunk[]): void {
    try {
      const existingChunks = this.getAllChunks();
      const updatedChunks = [...existingChunks, ...chunks];
      
      // Check storage size and compress if needed
      const dataSize = JSON.stringify(updatedChunks).length;
      console.log(`💾 Saving ${chunks.length} chunks, total size: ${Math.round(dataSize / 1024)}KB`);
      
      if (dataSize > 5000000) { // 5MB limit
        console.warn('⚠️ Large dataset detected, compressing embeddings...');
        // Compress embeddings to reduce storage
        const compressedChunks = updatedChunks.map(chunk => ({
          ...chunk,
          embedding: chunk.embedding ? this.compressEmbedding(chunk.embedding) : undefined
        }));
        localStorage.setItem(this.CHUNKS_KEY, JSON.stringify(compressedChunks));
      } else {
        localStorage.setItem(this.CHUNKS_KEY, JSON.stringify(updatedChunks));
      }
      
      console.log('✅ Chunks saved successfully');
    } catch (error) {
      console.error('❌ Failed to save chunks:', error);
      
      // Fallback: Save without embeddings if storage fails
      try {
        console.log('🔄 Saving chunks without embeddings as fallback...');
        const chunksWithoutEmbeddings = chunks.map(chunk => ({
          ...chunk,
          embedding: undefined
        }));
        const existingChunks = this.getAllChunks();
        const updatedChunks = [...existingChunks, ...chunksWithoutEmbeddings];
        localStorage.setItem(this.CHUNKS_KEY, JSON.stringify(updatedChunks));
        console.log('✅ Chunks saved without embeddings');
      } catch (fallbackError) {
        console.error('❌ Fallback save also failed:', fallbackError);
      }
    }
  }

  // Compress embedding vectors to save storage space
  private compressEmbedding(embedding: number[]): number[] {
    // Aggressive compression for large embeddings (4096 dimensions)
    // Keep only most significant values
    return embedding.map(val => Math.round(val * 100) / 100); // Reduce precision
  }

  private updateSearchIndex(chunks: DocumentChunk[]): void {
    try {
      // Simple keyword index for fast search
      const index = {};
      chunks.forEach(chunk => {
        chunk.keywords.forEach(keyword => {
          if (!index[keyword]) index[keyword] = [];
          index[keyword].push(chunk.id);
        });
      });
      
      localStorage.setItem(this.INDEX_KEY, JSON.stringify(index));
    } catch (error) {
      console.error('Failed to update search index:', error);
    }
  }

  // Retrieval methods
  getAllDocuments(): StoredDocument[] {
    try {
      const data = localStorage.getItem(this.DOCUMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load documents:', error);
      return [];
    }
  }

  getAllChunks(): DocumentChunk[] {
    try {
      const data = localStorage.getItem(this.CHUNKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load chunks:', error);
      return [];
    }
  }

  getDocument(documentId: string): StoredDocument | null {
    return this.getAllDocuments().find(doc => doc.id === documentId) || null;
  }

  getDocumentChunks(documentId: string): DocumentChunk[] {
    return this.getAllChunks().filter(chunk => chunk.documentId === documentId);
  }

  // Delete a specific document and all its chunks
  deleteDocument(documentId: string): boolean {
    try {
      console.log('🗑️ Deleting document and chunks:', documentId);
      
      // Remove document from documents list
      const documents = this.getAllDocuments().filter(doc => doc.id !== documentId);
      localStorage.setItem(this.DOCUMENTS_KEY, JSON.stringify(documents));
      
      // Remove all chunks for this document
      const chunks = this.getAllChunks().filter(chunk => chunk.documentId !== documentId);
      localStorage.setItem(this.CHUNKS_KEY, JSON.stringify(chunks));
      
      // Update search index
      this.rebuildSearchIndex(chunks);
      
      console.log('✅ Document deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to delete document:', error);
      return false;
    }
  }

  // Rebuild search index after deletions
  private rebuildSearchIndex(chunks: DocumentChunk[]): void {
    try {
      const index = {};
      chunks.forEach(chunk => {
        chunk.keywords.forEach(keyword => {
          if (!index[keyword]) index[keyword] = [];
          index[keyword].push(chunk.id);
        });
      });
      
      localStorage.setItem(this.INDEX_KEY, JSON.stringify(index));
      console.log('🔄 Search index rebuilt');
    } catch (error) {
      console.error('Failed to rebuild search index:', error);
    }
  }

  // Clear all stored documents
  clearAll(): void {
    localStorage.removeItem(this.DOCUMENTS_KEY);
    localStorage.removeItem(this.CHUNKS_KEY);
    localStorage.removeItem(this.INDEX_KEY);
    console.log('🗑️ All RAG documents cleared');
  }

  // Get statistics
  getStats(): { totalDocuments: number; totalChunks: number; totalKeywords: number } {
    const documents = this.getAllDocuments();
    const chunks = this.getAllChunks();
    const allKeywords = new Set();
    
    chunks.forEach(chunk => {
      chunk.keywords.forEach(keyword => allKeywords.add(keyword));
    });
    
    return {
      totalDocuments: documents.length,
      totalChunks: chunks.length,
      totalKeywords: allKeywords.size
    };
  }
}

// Singleton instance
export const documentStore = new DocumentStore();
