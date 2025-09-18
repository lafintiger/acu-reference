// Markdown Renderer - Displays AI responses with proper formatting
// Renders markdown tables, lists, headings for better readability

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  
  // Parse and render markdown content
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Handle tables
      if (line.includes('|') && line.trim().startsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableHeaders = line.split('|').map(h => h.trim()).filter(h => h);
          // Skip separator line
          i++;
          continue;
        } else {
          const row = line.split('|').map(cell => cell.trim()).filter(cell => cell);
          if (row.length > 0) {
            tableRows.push(row);
          }
        }
      } else {
        // End of table
        if (inTable) {
          elements.push(renderTable(tableHeaders, tableRows, elements.length));
          inTable = false;
          tableHeaders = [];
          tableRows = [];
        }
        
        // Handle other markdown elements
        if (line.startsWith('### ')) {
          elements.push(
            <h3 key={elements.length} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
              {line.replace('### ', '')}
            </h3>
          );
        } else if (line.startsWith('## ')) {
          elements.push(
            <h2 key={elements.length} className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              {line.replace('## ', '')}
            </h2>
          );
        } else if (line.startsWith('# ')) {
          elements.push(
            <h1 key={elements.length} className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              {line.replace('# ', '')}
            </h1>
          );
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
          elements.push(
            <div key={elements.length} className="flex items-start mb-1">
              <span className="text-tcm-accent mr-2 mt-1">•</span>
              <span>{line.replace(/^[*-] /, '')}</span>
            </div>
          );
        } else if (line.match(/^\d+\. /)) {
          const number = line.match(/^(\d+)\. /)?.[1];
          const text = line.replace(/^\d+\. /, '');
          elements.push(
            <div key={elements.length} className="flex items-start mb-1">
              <span className="text-blue-600 font-medium mr-2 mt-1">{number}.</span>
              <span>{text}</span>
            </div>
          );
        } else if (line.startsWith('**') && line.endsWith('**')) {
          elements.push(
            <div key={elements.length} className="font-semibold text-gray-900 mb-1">
              {line.replace(/\*\*/g, '')}
            </div>
          );
        } else if (line.trim() === '') {
          elements.push(<div key={elements.length} className="mb-2"></div>);
        } else if (line.trim()) {
          // Handle inline formatting
          const formattedLine = formatInlineMarkdown(line);
          elements.push(
            <div key={elements.length} className="mb-1" dangerouslySetInnerHTML={{ __html: formattedLine }} />
          );
        }
      }
    }
    
    // Handle final table if text ends with one
    if (inTable && tableRows.length > 0) {
      elements.push(renderTable(tableHeaders, tableRows, elements.length));
    }
    
    return elements;
  };
  
  // Render markdown table
  const renderTable = (headers: string[], rows: string[][], key: number) => (
    <div key={key} className="my-4 overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">
                {formatInlineMarkdown(header).replace(/<[^>]*>/g, '')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  <div dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  // Enhanced inline markdown formatting with clinical context
  const formatInlineMarkdown = (text: string): string => {
    return text
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      // Italic text  
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      // Code text
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800 border">$1</code>')
      // Point codes (make them stand out)
      .replace(/\b([A-Z]{2,3}\d+)\b/g, '<span class="bg-tcm-light text-tcm-accent px-2 py-1 rounded font-mono text-sm font-semibold border border-tcm-accent">$1</span>')
      // Safety warnings (highlight in red)
      .replace(/\b(contraindicated?|avoid|dangerous?|warning|caution)\b/gi, '<span class="bg-red-100 text-red-800 px-1 rounded font-medium">$1</span>')
      // Pregnancy warnings (special highlighting)
      .replace(/\b(pregnancy|pregnant)\b/gi, '<span class="bg-red-200 text-red-900 px-2 py-1 rounded font-bold border border-red-400">⚠️ $1</span>')
      // Duration/timing (highlight in blue)
      .replace(/\b(\d+[-–]\d+\s*(?:minutes?|hours?|days?|weeks?))\b/gi, '<span class="bg-blue-100 text-blue-800 px-1 rounded text-sm">$1</span>')
      // Severity ratings (color coded)
      .replace(/\b(severity:?\s*)?(\d+)\/10\b/gi, (match, prefix, rating) => {
        const num = parseInt(rating);
        const colorClass = num >= 8 ? 'bg-red-100 text-red-800' : 
                          num >= 6 ? 'bg-orange-100 text-orange-800' : 
                          num >= 4 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800';
        return `<span class="${colorClass} px-2 py-1 rounded font-medium">${match}</span>`;
      })
      // Clinical terms (subtle highlighting)
      .replace(/\b(palpation|tender|nodule|congestion|dysfunction)\b/gi, '<span class="bg-blue-50 text-blue-900 px-1 rounded">$1</span>');
  };

  return (
    <div className="markdown-content">
      {renderMarkdown(content)}
    </div>
  );
};

export default MarkdownRenderer;
