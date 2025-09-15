// Plugin System Demo Component
// Demonstrates the power of the modular architecture

import React, { useState } from 'react';
import { Puzzle, Plus, Trash2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAllModalities, useModalityStats } from '../lib/modality-system/hooks';
import { modalityRegistry } from '../lib/modality-system/registry';

const PluginSystemDemo = () => {
  const modalities = useAllModalities();
  const stats = useModalityStats();
  const [demoMode, setDemoMode] = useState(false);

  // Demo: Create a simple reflexology plugin
  const createReflexologyDemo = () => {
    const reflexologyDemo = {
      metadata: {
        id: 'reflexology_demo',
        name: 'reflexology',
        displayName: 'Reflexology (Demo)',
        icon: '🦶',
        description: 'Foot pressure point therapy - DEMO PLUGIN',
        version: '1.0.0-demo',
        author: 'Demo System',
        category: 'physical' as const,
        skillLevel: 'intermediate' as const,
        equipmentRequired: false,
        selfAdministered: true
      },
      protocols: [
        {
          id: 'reflexology_demo_headache',
          modalityId: 'reflexology_demo',
          indication: 'headache',
          name: 'Reflexology for Headache (Demo)',
          description: 'Foot reflex points for headache relief',
          steps: [
            {
              id: 'demo_step',
              order: 1,
              type: 'treatment' as const,
              title: 'Foot Reflex Points',
              description: 'Apply pressure to head reflex areas on feet',
              duration: '10-15 minutes',
              points: ['big_toe', 'toe_tips'],
              techniques: ['circular_pressure']
            }
          ],
          duration: '15-20 minutes',
          frequency: '2-3 times per week',
          difficulty: 'intermediate' as const,
          contraindications: ['foot_injuries'],
          precautions: ['gentle_pressure'],
          expectedOutcomes: ['headache_relief'],
          clinicalNotes: 'Demo reflexology protocol'
        }
      ],
      techniques: [
        {
          id: 'foot_pressure_demo',
          modalityId: 'reflexology_demo',
          name: 'Foot Pressure (Demo)',
          description: 'Apply pressure to foot reflex points',
          instructions: ['Locate reflex point', 'Apply steady pressure', 'Hold for 30-60 seconds'],
          duration: '1-2 minutes per point',
          intensity: 'moderate' as const
        }
      ],
      effectiveness: [
        {
          indication: 'headache',
          effectivenessScore: 78,
          evidenceLevel: 'moderate' as const,
          clinicalNotes: 'Demo effectiveness data'
        }
      ],
      contraindications: {
        absolute: ['severe_foot_injuries'],
        relative: ['foot_sensitivity'],
        pregnancy: 'caution' as const,
        medications: [],
        conditions: []
      },
      components: {
        ProtocolPage: () => React.createElement('div', {}, 'Demo Reflexology Page'),
        ProtocolCard: () => React.createElement('div', {}, 'Demo Card'),
        TechniquesList: () => React.createElement('div', {}, 'Demo Techniques'),
        SafetyWarnings: () => React.createElement('div', {}, 'Demo Safety'),
        ComparisonMetrics: () => React.createElement('div', {}, 'Demo Metrics')
      },
      async initialize() { console.log('Demo reflexology initialized'); },
      getProtocolsForIndication: (indication: string) => 
        indication === 'headache' ? [(reflexologyDemo as any).protocols[0]] : [],
      getTechniquesForIndication: () => [(reflexologyDemo as any).techniques[0]],
      getEffectivenessForIndication: (indication: string) => 
        indication === 'headache' ? (reflexologyDemo as any).effectiveness[0] : null,
      validateSafetyForPatient: () => ({ safe: true, warnings: [] }),
      getComparisonData: () => ({
        duration: '15-20 minutes',
        frequency: '2-3x/week',
        effectiveness: 78,
        easeOfUse: 85,
        safetyProfile: 92,
        cost: 'Free',
        equipment: 'None'
      }),
      registerRoutes: () => [{ path: '/reflexology-demo', component: () => null }],
      registerNavigation: () => ({ name: 'Reflexology Demo', path: '/reflexology-demo', icon: '🦶' }),
      registerSearchTerms: () => ['reflexology', 'foot', 'pressure', 'demo']
    };

    try {
      modalityRegistry.register(reflexologyDemo as any);
      setDemoMode(true);
      console.log('✅ Demo reflexology plugin added!');
    } catch (error) {
      console.error('Demo plugin registration failed:', error);
    }
  };

  const removeReflexologyDemo = () => {
    try {
      modalityRegistry.unregister('reflexology_demo');
      setDemoMode(false);
      console.log('🗑️ Demo reflexology plugin removed!');
    } catch (error) {
      console.error('Demo plugin removal failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Puzzle className="h-5 w-5 text-tcm-accent mr-2" />
          Plugin System Demo
        </h2>
        <div className="flex space-x-2">
          {!demoMode ? (
            <button
              onClick={createReflexologyDemo}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Demo Plugin
            </button>
          ) : (
            <button
              onClick={removeReflexologyDemo}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove Demo
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Demo Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-900 mb-2">🎯 Live Plugin Demo</h3>
        <div className="text-blue-800 text-sm space-y-2">
          <p>
            <strong>1. Click "Add Demo Plugin"</strong> to dynamically add a Reflexology modality
          </p>
          <p>
            <strong>2. Watch the stats update</strong> - plugin count and protocols increase
          </p>
          <p>
            <strong>3. Go to any indication page</strong> - Reflexology automatically appears
          </p>
          <p>
            <strong>4. Check treatment comparisons</strong> - Reflexology included automatically
          </p>
          <p>
            <strong>5. Remove the demo</strong> - Everything updates automatically
          </p>
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-tcm-accent">{stats.totalPlugins || 0}</div>
          <div className="text-sm text-gray-600">Active Plugins</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.totalProtocols || 0}</div>
          <div className="text-sm text-gray-600">Total Protocols</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.totalTechniques || 0}</div>
          <div className="text-sm text-gray-600">Techniques</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className={`text-2xl font-bold ${demoMode ? 'text-green-600' : 'text-gray-400'}`}>
            {demoMode ? '✅' : '⭕'}
          </div>
          <div className="text-sm text-gray-600">Demo Mode</div>
        </div>
      </div>

      {/* Plugin List */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900">Currently Loaded Plugins:</h3>
        {modalities.map(modality => (
          <div key={modality.metadata.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-xl mr-3">{modality.metadata.icon}</span>
              <div>
                <span className="font-medium text-gray-900">{modality.metadata.displayName}</span>
                <span className="text-xs text-gray-500 ml-2">v{modality.metadata.version}</span>
                {modality.metadata.id.includes('demo') && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    DEMO
                  </span>
                )}
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="text-gray-900 font-medium">{modality.protocols.length} protocols</div>
              <div className="text-gray-500">{modality.techniques.length} techniques</div>
            </div>
          </div>
        ))}
      </div>

      {demoMode && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800">Demo Plugin Active!</h3>
              <p className="text-green-700 text-sm mt-1">
                Reflexology is now available throughout the app. Visit any indication page to see it 
                automatically included in treatment options and comparisons!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PluginSystemDemo;
