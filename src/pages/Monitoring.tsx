import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Target, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';
import { outcomeMetrics, progressIndicators, getMetricsByCategory, calculateProgress } from '../data/monitoring-outcomes';

const Monitoring = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'progress' | 'reports'>('overview');
  const [selectedPatient, setSelectedPatient] = useState('demo_patient');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  // Mock patient data - in real implementation, this would come from patient database
  const mockPatientData = {
    id: 'demo_patient',
    initials: 'J.D.',
    startDate: '2024-01-15',
    currentTreatment: 'Tension Headache Protocol',
    sessions: 8,
    
    // Progress data over time
    progressData: [
      { date: '2024-01-15', painLevel: 8, stressLevel: 9, sleepQuality: 3, energyLevel: 4 },
      { date: '2024-01-22', painLevel: 7, stressLevel: 8, sleepQuality: 4, energyLevel: 5 },
      { date: '2024-01-29', painLevel: 6, stressLevel: 7, sleepQuality: 5, energyLevel: 6 },
      { date: '2024-02-05', painLevel: 5, stressLevel: 6, sleepQuality: 6, energyLevel: 7 },
      { date: '2024-02-12', painLevel: 4, stressLevel: 5, sleepQuality: 7, energyLevel: 7 },
      { date: '2024-02-19', painLevel: 3, stressLevel: 4, sleepQuality: 8, energyLevel: 8 }
    ],
    
    // Current status
    currentMetrics: {
      painLevel: 3,
      stressLevel: 4,
      sleepQuality: 8,
      energyLevel: 8,
      functionalCapacity: 85,
      treatmentSatisfaction: 9
    },
    
    // Treatment goals
    treatmentGoals: {
      painLevel: 2,
      stressLevel: 3,
      sleepQuality: 8,
      energyLevel: 8,
      functionalCapacity: 90
    }
  };

  const getProgressStatus = (current: number, baseline: number, target: number) => {
    const progress = calculateProgress(baseline, current, target);
    return progress;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Patient Progress Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Patient Progress Overview</h2>
          <div className="text-sm text-gray-500">
            Patient {mockPatientData.initials} • {mockPatientData.sessions} sessions
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pain Progress */}
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${((8 - mockPatientData.currentMetrics.painLevel) / 8) * 226} 226`}
                  className="text-green-600"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {mockPatientData.currentMetrics.painLevel}/10
                </span>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">Pain Level</div>
            <div className="text-xs text-green-600">↓ 62% improvement</div>
          </div>

          {/* Stress Progress */}
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${((10 - mockPatientData.currentMetrics.stressLevel) / 10) * 226} 226`}
                  className="text-blue-600"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {mockPatientData.currentMetrics.stressLevel}/10
                </span>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">Stress Level</div>
            <div className="text-xs text-blue-600">↓ 56% improvement</div>
          </div>

          {/* Sleep Quality */}
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${(mockPatientData.currentMetrics.sleepQuality / 10) * 226} 226`}
                  className="text-purple-600"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {mockPatientData.currentMetrics.sleepQuality}/10
                </span>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">Sleep Quality</div>
            <div className="text-xs text-purple-600">↑ 167% improvement</div>
          </div>

          {/* Energy Level */}
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${(mockPatientData.currentMetrics.energyLevel / 10) * 226} 226`}
                  className="text-orange-600"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {mockPatientData.currentMetrics.energyLevel}/10
                </span>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">Energy Level</div>
            <div className="text-xs text-orange-600">↑ 100% improvement</div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Over Time</h2>
        
        <div className="space-y-4">
          {/* Simple Progress Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Pain & Stress Reduction</h3>
              <div className="space-y-3">
                {mockPatientData.progressData.slice(-4).map((data, index) => (
                  <div key={data.date} className="flex items-center space-x-4">
                    <div className="text-xs text-gray-500 w-16">
                      {new Date(data.date).toLocaleDateString()}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center">
                        <span className="text-xs w-12">Pain:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(data.painLevel / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs w-8">{data.painLevel}/10</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs w-12">Stress:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${(data.stressLevel / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs w-8">{data.stressLevel}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Sleep & Energy Improvement</h3>
              <div className="space-y-3">
                {mockPatientData.progressData.slice(-4).map((data, index) => (
                  <div key={data.date} className="flex items-center space-x-4">
                    <div className="text-xs text-gray-500 w-16">
                      {new Date(data.date).toLocaleDateString()}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center">
                        <span className="text-xs w-12">Sleep:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(data.sleepQuality / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs w-8">{data.sleepQuality}/10</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs w-12">Energy:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(data.energyLevel / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs w-8">{data.energyLevel}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Effectiveness */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Treatment Effectiveness Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-900">Excellent Progress</h3>
            </div>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Sleep quality significantly improved</li>
              <li>• Energy levels doubled</li>
              <li>• Stress management effective</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Goals Achieved</h3>
            </div>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Pain reduced to manageable levels</li>
              <li>• Sleep quality restored</li>
              <li>• Functional capacity improving</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-semibold text-yellow-900">Areas to Monitor</h3>
            </div>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• Continue stress management</li>
              <li>• Monitor pain stability</li>
              <li>• Maintain treatment frequency</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-tcm-light border border-tcm-accent rounded-lg p-6">
        <h2 className="text-xl font-semibold text-tcm-accent mb-4">Clinical Recommendations</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Continue Current Protocol</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Maintain acupressure sessions 2x/week</li>
                <li>• Continue stress management techniques</li>
                <li>• Monitor pain levels weekly</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Consider Adjustments</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Add maintenance gua sha sessions</li>
                <li>• Reduce session frequency to weekly</li>
                <li>• Focus on prevention strategies</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white border border-tcm-accent rounded p-4">
            <h3 className="font-semibold text-tcm-accent mb-2">Next Assessment Due:</h3>
            <p className="text-gray-800 text-sm">
              <strong>Date:</strong> {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} (1 week)
            </p>
            <p className="text-gray-700 text-sm mt-1">
              Re-evaluate pain levels, stress management, and consider transitioning to maintenance phase
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      {/* Outcome Metrics by Category */}
      {(['pain', 'function', 'quality_of_life', 'objective'] as const).map(category => (
        <div key={category} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            {category.replace('_', ' ')} Metrics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getMetricsByCategory(category).map(metric => (
              <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{metric.name}</h4>
                <p className="text-gray-600 text-sm mt-1">{metric.description}</p>
                
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Scale:</span>
                    <span className="font-medium">{metric.scale.replace('_', ' ')}</span>
                  </div>
                  {metric.normalRange && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Normal Range:</span>
                      <span className="font-medium text-green-600">{metric.normalRange}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                    {metric.clinicalSignificance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-8 w-8 text-tcm-accent mr-3" />
            Treatment Monitoring
          </h1>
          <p className="text-gray-600 mt-1">
            Track treatment outcomes and patient progress over time
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="quarter">Past Quarter</option>
          </select>
        </div>
      </div>

      {/* Patient Selection */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Monitoring Patient:</span>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
            >
              <option value="demo_patient">Patient J.D. (Demo)</option>
              <option value="add_patient">+ Add New Patient</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            Treatment started: {new Date(mockPatientData.startDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Progress Overview', icon: TrendingUp },
              { id: 'metrics', label: 'Outcome Metrics', icon: BarChart3 },
              { id: 'progress', label: 'Progress Indicators', icon: Target },
              { id: 'reports', label: 'Clinical Reports', icon: Calendar }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-tcm-accent text-tcm-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'metrics' && renderMetrics()}
          {activeTab === 'progress' && (
            <div className="text-center py-12 text-gray-500">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p>Progress indicators tracking coming soon!</p>
            </div>
          )}
          {activeTab === 'reports' && (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p>Clinical reports generation coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
