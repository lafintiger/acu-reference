// RAG Management - Bulk operations for document library
import React, { useState } from 'react';
import { Trash2, RefreshCw, Download, AlertTriangle } from 'lucide-react';
import { documentStore } from '../lib/rag/document-store';

const RAGManagement = () => {
  const [confirmClear, setConfirmClear] = useState(false);

  const clearAllDocuments = () => {
    if (confirmClear) {
      documentStore.clearAll();
      alert('All RAG documents cleared! You can now start fresh.');
      window.location.reload(); // Refresh to show empty library
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 5000); // Reset after 5 seconds
    }
  };

  const exportRAGData = () => {
    try {
      const documents = documentStore.getAllDocuments();
      const chunks = documentStore.getAllChunks();
      
      const exportData = {
        documents,
        chunks: chunks.map(chunk => ({
          ...chunk,
          embedding: undefined // Remove embeddings from export to reduce size
        })),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rag_library_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('RAG library exported successfully (without embeddings for size)');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export RAG library');
    }
  };

  const getStorageInfo = () => {
    const documents = documentStore.getAllDocuments();
    const chunks = documentStore.getAllChunks();
    const chunksWithEmbeddings = chunks.filter(c => c.embedding && c.embedding.length > 0);
    
    return {
      totalDocuments: documents.length,
      totalChunks: chunks.length,
      chunksWithEmbeddings: chunksWithEmbeddings.length,
      estimatedSize: Math.round(JSON.stringify(chunks).length / 1024) + 'KB'
    };
  };

  const storageInfo = getStorageInfo();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <RefreshCw className="h-5 w-5 text-tcm-accent mr-2" />
        RAG System Management
      </h2>

      {/* Storage Information */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Storage Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-900">{storageInfo.totalDocuments}</div>
            <div className="text-gray-600">Documents</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{storageInfo.totalChunks}</div>
            <div className="text-gray-600">Total Chunks</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{storageInfo.chunksWithEmbeddings}</div>
            <div className="text-gray-600">With Embeddings</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{storageInfo.estimatedSize}</div>
            <div className="text-gray-600">Storage Used</div>
          </div>
        </div>
      </div>

      {/* Management Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Export RAG Library</h3>
            <p className="text-sm text-gray-600">Download your document library for backup</p>
          </div>
          <button
            onClick={exportRAGData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div>
            <h3 className="font-medium text-red-900">Clear All Documents</h3>
            <p className="text-sm text-red-700">Remove all documents and start fresh</p>
          </div>
          <button
            onClick={clearAllDocuments}
            className={`flex items-center px-4 py-2 rounded-lg ${
              confirmClear 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'border border-red-600 text-red-600 hover:bg-red-50'
            }`}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {confirmClear ? 'Confirm Clear All' : 'Clear All'}
          </button>
        </div>

        {confirmClear && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <p className="text-yellow-800 text-sm">
                  <strong>Warning:</strong> This will permanently delete all {storageInfo.totalDocuments} documents 
                  and {storageInfo.totalChunks} chunks from your RAG library. This action cannot be undone.
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  Click "Confirm Clear All" again to proceed, or wait 5 seconds to cancel.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RAGManagement;
