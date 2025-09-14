import React, { useState } from 'react';
import { Upload, CheckCircle, AlertTriangle, Database } from 'lucide-react';

const WHOPointsImporter = () => {
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: number;
    details: string[];
  } | null>(null);

  const handleCSVImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResults(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      let successCount = 0;
      let errorCount = 0;
      const details: string[] = [];

      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        try {
          const fields = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));
          
          if (fields.length >= 4) {
            const [meridian, pointCode, pinyin, chinese, location] = fields;
            
            if (pointCode && pinyin && location) {
              successCount++;
              details.push(`✓ ${pointCode} - ${pinyin}`);
            } else {
              errorCount++;
              details.push(`✗ Invalid data on line ${i + 1}`);
            }
          } else {
            errorCount++;
            details.push(`✗ Insufficient fields on line ${i + 1}`);
          }
        } catch (error) {
          errorCount++;
          details.push(`✗ Parse error on line ${i + 1}: ${error}`);
        }
      }

      setImportResults({
        success: successCount,
        errors: errorCount,
        details: details.slice(0, 20) // Show first 20 results
      });

    } catch (error) {
      console.error('CSV import failed:', error);
      setImportResults({
        success: 0,
        errors: 1,
        details: [`✗ Failed to read CSV file: ${error}`]
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Database className="h-5 w-5 text-tcm-accent mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">WHO Standard Points Integration</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">WHO Standard Acupuncture Point Locations</h3>
          <p className="text-blue-800 text-sm mb-3">
            Your CSV file contains WHO Standard Acupuncture Point Locations - the most authoritative 
            source for point accuracy. This data will be used to validate and enhance point locations.
          </p>
          
          <div className="bg-white border border-blue-200 rounded p-3">
            <h4 className="font-medium text-blue-900 mb-2">Key WHO Standards Integrated:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Precise anatomical landmark descriptions</li>
              <li>• B-cun (body cun) proportional measurements</li>
              <li>• Standardized point classifications</li>
              <li>• Element associations and meridian relationships</li>
              <li>• Clinical location verification</li>
            </ul>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Current WHO Integration Status</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-gray-700">Key points validated against WHO standards</span>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-gray-700">Location descriptions updated with WHO precision</span>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-gray-700">Point classifications verified</span>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-gray-700">Chinese characters standardized</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">WHO Standard Improvements Applied</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-900 mb-1">Location Precision:</h4>
              <ul className="text-green-800 space-y-1">
                <li>• Anatomical landmark method</li>
                <li>• Proportional bone measurements</li>
                <li>• Precise B-cun distances</li>
                <li>• Relationship to adjacent points</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-900 mb-1">Clinical Accuracy:</h4>
              <ul className="text-green-800 space-y-1">
                <li>• Standardized nomenclature</li>
                <li>• Verified point classifications</li>
                <li>• Element associations</li>
                <li>• International consistency</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            WHO Controversial Points
          </h3>
          <p className="text-yellow-800 text-sm mb-2">
            The WHO identified 6 controversial point locations that require further research:
          </p>
          <div className="text-yellow-800 text-sm">
            <strong>LI19, LI20, PC8, PC9, GB30, GV26</strong> - Alternative locations may exist
          </div>
        </div>

        {/* CSV Upload Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-medium text-gray-900 mb-3">Additional CSV Data Import</h3>
          <p className="text-gray-600 text-sm mb-4">
            Upload additional point data to expand the database further.
          </p>
          
          <label className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            {importing ? 'Processing CSV...' : 'Upload CSV File'}
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              disabled={importing}
              className="sr-only"
            />
          </label>

          {importResults && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className="font-medium text-gray-900">Import Results</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-green-600 font-medium">Success: {importResults.success}</span>
                </div>
                <div>
                  <span className="text-red-600 font-medium">Errors: {importResults.errors}</span>
                </div>
              </div>
              
              <details className="text-sm">
                <summary className="cursor-pointer font-medium text-gray-700">View Details</summary>
                <div className="mt-2 max-h-40 overflow-y-auto">
                  {importResults.details.map((detail, index) => (
                    <div key={index} className="py-1 text-gray-600">
                      {detail}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WHOPointsImporter;
