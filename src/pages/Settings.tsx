import { useState } from 'react';
import { Download, Upload, RotateCcw, Database, FileText } from 'lucide-react';
import { simpleDb as db } from '../lib/simpleDatabase';
import { CSVService } from '../lib/csvService';
import WHOPointsImporter from '../components/WHOPointsImporter';

const Settings = () => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExportData = async () => {
    setExporting(true);
    try {
      const data = await db.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `acuref-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage('Data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      setMessage('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      await db.importData(text);
      setMessage('Data imported successfully! The page will reload.');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Import failed:', error);
      setMessage('Import failed. Please check the file format and try again.');
    } finally {
      setImporting(false);
    }
  };

  const handleExportCSV = async (type: 'points' | 'indications' | 'techniques') => {
    try {
      let data;
      switch (type) {
        case 'points':
          data = await db.getPoints();
          break;
        case 'indications':
          data = await db.getIndications();
          break;
        case 'techniques':
          data = await db.getTechniques();
          break;
      }
      
      await CSVService.exportToCSV(data, type);
      setMessage(`${type} exported to CSV successfully!`);
    } catch (error) {
      console.error('CSV export failed:', error);
      setMessage('CSV export failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your AcuReference data and preferences</p>
      </div>

      {/* Message display */}
      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">{message}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Data Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="h-5 w-5 text-tcm-accent mr-2" />
            Data Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Export Data</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download all your data as a JSON file for backup or transfer.
              </p>
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-tcm-accent hover:bg-tcm-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tcm-accent disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export Data'}
              </button>
            </div>

            {/* Import */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Import Data</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload a JSON file to import data. This will replace existing data.
              </p>
              <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-tcm-accent hover:bg-tcm-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tcm-accent cursor-pointer disabled:opacity-50">
                <Upload className="h-4 w-4 mr-2" />
                {importing ? 'Importing...' : 'Import Data'}
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  disabled={importing}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>

        {/* CSV Templates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 text-tcm-accent mr-2" />
            CSV Templates
          </h2>
          
          <p className="text-gray-600 mb-4">
            Download CSV templates to bulk import data. Fill in the templates and convert to JSON for import.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Templates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Templates</h3>
              <div className="space-y-3">
                <button
                  onClick={() => CSVService.downloadTemplate('points')}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:border-tcm-accent transition-colors text-left"
                >
                  <h4 className="font-medium text-gray-900">Points Template</h4>
                  <p className="text-sm text-gray-600">CSV template for acupuncture points</p>
                </button>

                <button
                  onClick={() => CSVService.downloadTemplate('indications')}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:border-tcm-accent transition-colors text-left"
                >
                  <h4 className="font-medium text-gray-900">Indications Template</h4>
                  <p className="text-sm text-gray-600">CSV template for conditions/symptoms</p>
                </button>

                <button
                  onClick={() => CSVService.downloadTemplate('techniques')}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:border-tcm-accent transition-colors text-left"
                >
                  <h4 className="font-medium text-gray-900">Techniques Template</h4>
                  <p className="text-sm text-gray-600">CSV template for modality techniques</p>
                </button>
              </div>
            </div>

            {/* Export Current Data */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Current Data</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleExportCSV('points')}
                  className="w-full p-3 bg-tcm-accent text-white rounded-lg hover:bg-tcm-secondary transition-colors text-left"
                >
                  <h4 className="font-medium">Export Points to CSV</h4>
                  <p className="text-sm opacity-90">Download current points as CSV</p>
                </button>

                <button
                  onClick={() => handleExportCSV('indications')}
                  className="w-full p-3 bg-tcm-accent text-white rounded-lg hover:bg-tcm-secondary transition-colors text-left"
                >
                  <h4 className="font-medium">Export Indications to CSV</h4>
                  <p className="text-sm opacity-90">Download current indications as CSV</p>
                </button>

                <button
                  onClick={() => handleExportCSV('techniques')}
                  className="w-full p-3 bg-tcm-accent text-white rounded-lg hover:bg-tcm-secondary transition-colors text-left"
                >
                  <h4 className="font-medium">Export Techniques to CSV</h4>
                  <p className="text-sm opacity-90">Download current techniques as CSV</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* WHO Standards Integration */}
        <WHOPointsImporter />

        {/* Database Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Database Information</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-tcm-accent">14</div>
              <div className="text-sm text-gray-600">Meridians</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-tcm-accent">25+</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-tcm-accent">40+</div>
              <div className="text-sm text-gray-600">Indications</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-tcm-accent">8+</div>
              <div className="text-sm text-gray-600">Techniques</div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About AcuReference</h2>
          
          <div className="prose prose-sm text-gray-600">
            <p>
              AcuReference is a comprehensive Traditional Chinese Medicine reference application 
              designed for practitioners of acupressure, cupping, gua sha, and applied kinesiology.
            </p>
            
            <p>
              <strong>Version:</strong> 0.1.0 (MVP)<br />
              <strong>Database:</strong> SQLite-WASM (offline-first)<br />
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Medical Disclaimer:</strong> This application is for reference purposes only 
                and is not intended as a substitute for professional medical advice, diagnosis, or treatment. 
                Always seek the advice of qualified healthcare providers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
