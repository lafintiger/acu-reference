import React, { useState, useEffect } from 'react';
import { Puzzle, RefreshCw, CheckCircle } from 'lucide-react';
import { modalityRegistry } from '../lib/modality-system/registry';

const ModalitySystem = () => {
  const [stats, setStats] = useState<any>({ totalPlugins: 0, totalProtocols: 0 });
  const [plugins, setPlugins] = useState<any[]>([]);

  useEffect(() => {
    loadPluginData();
  }, []);

  const loadPluginData = () => {
    const pluginStats = modalityRegistry.getStats();
    const allPlugins = modalityRegistry.getAll();
    
    setStats(pluginStats);
    setPlugins(allPlugins);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Puzzle className="h-8 w-8 text-tcm-accent mr-3" />
            Modality Plugin System
          </h1>
          <p className="text-gray-600 mt-1">
            Clean v0.2 - Modular architecture for unlimited expansion
          </p>
        </div>
        <button
          onClick={loadPluginData}
          className="flex items-center px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          Plugin System Status
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-tcm-accent">{stats.totalPlugins}</div>
            <div className="text-sm text-gray-600">Registered Plugins</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalProtocols}</div>
            <div className="text-sm text-gray-600">Total Protocols</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">✅</div>
            <div className="text-sm text-gray-600">System Ready</div>
          </div>
        </div>
      </div>

      {/* Registered Plugins */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Registered Modality Plugins</h2>
        
        {plugins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plugins.map(plugin => (
              <div key={plugin.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{plugin.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{plugin.name}</h3>
                    <div className="text-xs text-gray-500">Plugin ID: {plugin.id}</div>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-3">{plugin.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protocols:</span>
                    <span className="font-medium">{plugin.protocols.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effectiveness:</span>
                    <span className="font-medium text-green-600">{plugin.effectiveness}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Puzzle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p>No plugins registered yet</p>
            <p className="text-sm">Plugins will appear here as they're added</p>
          </div>
        )}
      </div>

      {/* Plugin Benefits */}
      <div className="bg-tcm-light border border-tcm-accent rounded-lg p-6">
        <h2 className="text-xl font-semibold text-tcm-accent mb-4">
          🚀 Clean Plugin Architecture Benefits
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">For Practitioners</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Add unlimited therapy modalities</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Automatic integration across all pages</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Consistent professional interface</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">For Development</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Clean, maintainable architecture</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>No breaking changes when adding modalities</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Incremental testing and development</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalitySystem;