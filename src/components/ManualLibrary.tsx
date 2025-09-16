// Manual Library - RAG System Interface
// Manage uploaded manuals and enable intelligent search

import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Upload, Trash2, Eye, Database, Brain } from 'lucide-react';
import { documentStore } from '../lib/rag/document-store';
import SearchResultCard from './SearchResultCard';

const ManualLibrary = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalDocuments: 0, totalChunks: 0, totalKeywords: 0 });
  const [embeddingModel, setEmbeddingModel] = useState('ZimaBlueAI/Qwen3-Embedding-8B:Q5_K_M');

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = () => {
    const docs = documentStore.getAllDocuments();
    const libraryStats = documentStore.getStats();
    setDocuments(docs);
    setStats(libraryStats);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      console.log('🔍 Starting RAG search for:', searchQuery);
      const results = await documentStore.searchDocuments(searchQuery, 10);
      setSearchResults(results);
      console.log('✅ RAG search results:', results);
    } catch (error) {
      console.error('❌ RAG search failed:', error);
      setSearchResults([]);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    try {
      console.log('📁 Adding manual to RAG library...');
      
      // Process PDF (reuse existing PDF processor)
      const { pdfProcessor } = await import('../lib/knowledge-management/pdf-processor');
      const extractionResult = await pdfProcessor.processPDF(file);
      
      if (extractionResult.success) {
        // Store in RAG system
        const documentId = await documentStore.storeDocument(
          file.name, 
          extractionResult.text, 
          'manual'
        );
        
        console.log('✅ Manual added to RAG library:', documentId);
        loadLibrary();
        alert(`Manual "${file.name}" added to RAG library!\n${extractionResult.pageCount} pages indexed for intelligent search.`);
      } else {
        alert('Failed to process PDF: ' + extractionResult.error);
      }
    } catch (error) {
      console.error('Failed to add manual:', error);
      alert('Failed to add manual to library');
    }
  };

  const deleteDocument = (documentId: string, documentTitle: string) => {
    if (confirm(`Remove "${documentTitle}" from the RAG library?\n\nThis will delete the document and all its searchable chunks.`)) {
      const success = documentStore.deleteDocument(documentId);
      
      if (success) {
        loadLibrary(); // Refresh the display
        alert(`"${documentTitle}" removed from RAG library successfully!`);
      } else {
        alert('Failed to delete document. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="h-8 w-8 text-tcm-accent mr-3" />
            Manual Library (RAG System)
          </h1>
          <p className="text-gray-600 mt-1">
            Intelligent search and AI context from your workshop manuals
          </p>
        </div>
        
        <label className="flex items-center px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark cursor-pointer">
          <Upload className="h-4 w-4 mr-2" />
          Add Manual
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="sr-only"
          />
        </label>
      </div>

      {/* Embedding Model Selection */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Embedding Model:</label>
            <select
              value={embeddingModel}
              onChange={(e) => {
                setEmbeddingModel(e.target.value);
                // Update the embedding service to use selected model
                import('../lib/rag/embedding-service').then(({ embeddingManager }) => {
                  embeddingManager.setModel(e.target.value);
                });
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent bg-white text-black"
              style={{ backgroundColor: 'white', color: 'black' }}
            >
              <option value="ZimaBlueAI/Qwen3-Embedding-8B:Q5_K_M">🚀 Qwen3-Embedding-8B (5.4 GB) - Best Quality</option>
              <option value="embeddinggemma:latest">embeddinggemma:latest (621 MB) - Good Quality</option>
              <option value="nomic-embed-text:latest">nomic-embed-text (274 MB) - Lightweight</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Semantic search enabled
          </div>
        </div>
      </div>

      {/* Library Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-tcm-accent">{stats.totalDocuments}</div>
          <div className="text-sm text-gray-600">Manuals Stored</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalChunks}</div>
          <div className="text-sm text-gray-600">Searchable Chunks</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.totalKeywords}</div>
          <div className="text-sm text-gray-600">Indexed Keywords</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">🤖</div>
          <div className="text-sm text-gray-600">AI Enhanced</div>
        </div>
      </div>

      {/* Intelligent Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Search className="h-5 w-5 text-tcm-accent mr-2" />
          Intelligent Manual Search
        </h2>
        
        <div className="flex space-x-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search across all manuals (e.g., 'hydration test', 'LI4', 'stress release')..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tcm-accent bg-white text-black"
            style={{ backgroundColor: 'white', color: 'black' }}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">
              Search Results ({searchResults.length})
            </h3>
            {searchResults.map(result => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{result.documentTitle}</h4>
                    <p className="text-sm text-gray-600">Page {result.pageNumber} • {result.contentType}</p>
                  </div>
                  <div className="text-xs bg-tcm-light text-tcm-accent px-2 py-1 rounded">
                    Score: {result.score}
                  </div>
                </div>
                <div className="text-sm text-gray-700 bg-gray-50 rounded p-3">
                  <div className="whitespace-pre-wrap">{result.content}</div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {result.keywords.slice(0, 8).map((keyword: string) => (
                    <button
                      key={keyword}
                      onClick={() => {
                        setSearchQuery(keyword);
                        handleSearch();
                      }}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 cursor-pointer"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Library */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Manual Library</h2>
        
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map(doc => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{doc.title}</h3>
                    <p className="text-sm text-gray-600">{doc.fileName}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => alert('Document viewer not yet implemented')}
                      className="text-blue-600 hover:text-blue-800"
                      title="View document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id, doc.title)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove from library"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div><strong>Pages:</strong> {doc.pageCount}</div>
                  <div><strong>Chunks:</strong> {doc.chunkCount}</div>
                  <div><strong>Uploaded:</strong> {new Date(doc.uploadDate).toLocaleDateString()}</div>
                </div>
                
                {doc.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {doc.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {doc.summary && (
                  <p className="mt-2 text-xs text-gray-600 italic">
                    {doc.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Manuals in Library</h3>
            <p className="text-gray-600 mb-4">
              Upload your workshop manuals to create an intelligent, searchable knowledge base
            </p>
            <label className="inline-flex items-center px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload First Manual
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </label>
          </div>
        )}
      </div>

      {/* RAG Integration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          AI Integration (RAG System)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-blue-900 mb-3">How RAG Works:</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• Manuals are split into searchable chunks</li>
              <li>• AI searches relevant content for your questions</li>
              <li>• Provides answers with manual references</li>
              <li>• Maintains source attribution and page numbers</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-blue-900 mb-3">AI Enhancement:</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• Ask questions about your specific manuals</li>
              <li>• Get answers with page references</li>
              <li>• Context-aware clinical recommendations</li>
              <li>• Search across entire manual library</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border border-blue-200">
          <p className="text-blue-800 text-sm">
            <strong>Example:</strong> Ask "How do I test for hydration?" and the AI will search your manuals, 
            find the relevant procedure, and provide the answer with page references!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManualLibrary;
