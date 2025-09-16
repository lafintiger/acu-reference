// Search Result Card - Enhanced display for RAG search results
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Copy } from 'lucide-react';

interface SearchResultCardProps {
  result: any;
  onKeywordClick: (keyword: string) => void;
  onExpandContent: (content: string) => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ 
  result, 
  onKeywordClick, 
  onExpandContent 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Content copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy content');
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-gray-900">{result.documentTitle}</h4>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Page {result.pageNumber}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
              {result.contentType}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs bg-tcm-light text-tcm-accent px-2 py-1 rounded">
            Score: {result.score}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-800"
            title={isExpanded ? 'Show less' : 'Show full content'}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-3">
        <div className="text-sm text-gray-700 bg-gray-50 rounded p-3">
          {isExpanded ? (
            <div>
              <div className="whitespace-pre-wrap">{result.content}</div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex space-x-2">
                <button
                  onClick={() => copyToClipboard(result.content)}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Full Text
                </button>
                <button
                  onClick={() => onExpandContent(result.content)}
                  className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View in Modal
                </button>
              </div>
            </div>
          ) : (
            <div>
              {result.content.substring(0, 200)}...
              <button
                onClick={() => setIsExpanded(true)}
                className="ml-2 text-tcm-accent hover:text-tcm-accent-dark text-xs underline"
              >
                Read More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Keywords */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {result.keywords.slice(0, 8).map((keyword: string) => (
            <button
              key={keyword}
              onClick={() => onKeywordClick(keyword)}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 cursor-pointer transition-colors"
              title={`Search for "${keyword}"`}
            >
              {keyword}
            </button>
          ))}
          {result.keywords.length > 8 && (
            <span className="text-xs text-gray-500">
              +{result.keywords.length - 8} more
            </span>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          Chunk {result.chunkIndex + 1}
        </div>
      </div>

      {/* Quick Actions */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div>
              Document ID: {result.documentId}
            </div>
            <div>
              Content Length: {result.content.length} characters
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultCard;
