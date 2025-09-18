// Enterprise Dashboard
// Comprehensive practice management dashboard with analytics and real-time monitoring

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Shield,
  Zap,
  MessageSquare
} from 'lucide-react';
import { dashboardService, reportingService } from '../services/ReportingService';
import { userManagementService } from '../services/UserManagementService';
import { practiceManagementService } from '../services/PracticeManagementService';
import { performanceService } from '../services/PerformanceService';
import { securityService } from '../services/SecurityService';

const EnterpriseDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month'>('week');

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  // Get real-time statistics
  const practiceStats = useMemo(() => userManagementService.getPracticeStatistics(), []);
  const performanceStats = useMemo(() => performanceService.getPerformanceStats(), []);
  const securityStats = useMemo(() => securityService.getSecurityStats(), []);
  const kpis = useMemo(() => dashboardService.getKPIs(), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tcm-accent"></div>
        <span className="ml-3 text-gray-600">Loading enterprise dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive practice management and analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tcm-accent"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Patient Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.patientSatisfaction}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Treatment Effectiveness</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.treatmentEffectiveness}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Safety Compliance</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.safetyCompliance}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">System Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.systemUtilization}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-tcm-accent mr-2" />
            Today's Activity
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Assessments</span>
              <span className="text-2xl font-bold text-tcm-accent">{dashboardData?.todayStats?.assessments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Treatments</span>
              <span className="text-2xl font-bold text-blue-600">{dashboardData?.todayStats?.treatments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">New Patients</span>
              <span className="text-2xl font-bold text-green-600">{dashboardData?.todayStats?.newPatients || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Chapman Findings</span>
              <span className="text-2xl font-bold text-orange-600">{dashboardData?.todayStats?.chapmanFindings || 0}</span>
            </div>
          </div>
        </div>

        {/* Practice Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 text-tcm-accent mr-2" />
            Practice Statistics
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Practitioners</span>
              <span className="text-2xl font-bold text-tcm-accent">{practiceStats.activePractitioners}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Practitioners</span>
              <span className="text-2xl font-bold text-gray-700">{practiceStats.totalPractitioners}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Recent Activity</span>
              <span className="text-2xl font-bold text-blue-600">{practiceStats.recentActivity}</span>
            </div>
          </div>

          {/* Specializations Breakdown */}
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-3">Specializations</h3>
            <div className="space-y-2">
              {Object.entries(practiceStats.specializations).map(([spec, count]) => (
                <div key={spec} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 capitalize">{spec.replace('_', ' ')}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 text-tcm-accent mr-2" />
            Performance Metrics
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg Render Time</span>
              <span className={`font-bold ${performanceStats.averageRenderTime > 100 ? 'text-red-600' : 'text-green-600'}`}>
                {performanceStats.averageRenderTime.toFixed(1)}ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg Query Time</span>
              <span className={`font-bold ${performanceStats.averageQueryTime > 500 ? 'text-red-600' : 'text-green-600'}`}>
                {performanceStats.averageQueryTime.toFixed(1)}ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Storage Usage</span>
              <span className={`font-bold ${performanceStats.storageUsage > 6000000 ? 'text-red-600' : 'text-green-600'}`}>
                {(performanceStats.storageUsage / 1024 / 1024).toFixed(1)}MB
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Alerts</span>
              <span className={`font-bold ${performanceStats.alertCount > 5 ? 'text-red-600' : 'text-green-600'}`}>
                {performanceStats.alertCount}
              </span>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 text-tcm-accent mr-2" />
            Security Status
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Encryption Status</span>
              <span className={`font-bold ${securityStats.encryptionEnabled ? 'text-green-600' : 'text-red-600'}`}>
                {securityStats.encryptionEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Audit Entries</span>
              <span className="font-bold text-gray-900">{securityStats.auditEntries}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Session ID</span>
              <span className="font-mono text-sm text-gray-600">
                {securityStats.sessionId.substring(0, 12)}...
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Activity</span>
              <span className="text-sm text-gray-600">
                {new Date(securityStats.lastActivity).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            Active Alerts ({dashboardData.alerts.length})
          </h2>
          
          <div className="space-y-3">
            {dashboardData.alerts.map((alert: string, index: number) => (
              <div key={index} className="flex items-start p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                <div className="flex-1">
                  <p className="text-orange-800">{alert}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 text-tcm-accent mr-2" />
          Recent Activity
        </h2>
        
        <div className="space-y-3">
          {dashboardData?.recentActivity?.map((activity: any, index: number) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-tcm-accent rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.patient}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 text-tcm-accent mr-2" />
          Weekly Trends
        </h2>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-xs text-gray-600 mb-2">{day}</div>
              <div className="relative">
                <div className="h-20 bg-gray-100 rounded">
                  <div 
                    className="bg-tcm-accent rounded-b"
                    style={{ 
                      height: `${(dashboardData?.weeklyTrends?.assessments[index] || 0) * 5}px`,
                      minHeight: '2px'
                    }}
                  />
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  {dashboardData?.weeklyTrends?.assessments[index] || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center text-sm text-gray-600">
          <div className="w-3 h-3 bg-tcm-accent rounded mr-2"></div>
          Assessments per day
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 bg-tcm-light text-tcm-accent rounded-lg hover:bg-tcm-accent hover:text-white transition-colors">
            <BarChart3 className="h-5 w-5 mr-2" />
            Generate Report
          </button>
          
          <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
            <Shield className="h-5 w-5 mr-2" />
            Safety Audit
          </button>
          
          <button className="flex items-center justify-center p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors">
            <Users className="h-5 w-5 mr-2" />
            Manage Users
          </button>
          
          <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors">
            <MessageSquare className="h-5 w-5 mr-2" />
            Team Messages
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Performance Health */}
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
              performanceStats.averageRenderTime < 50 ? 'bg-green-100' : 
              performanceStats.averageRenderTime < 100 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Zap className={`h-8 w-8 ${
                performanceStats.averageRenderTime < 50 ? 'text-green-600' : 
                performanceStats.averageRenderTime < 100 ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <h3 className="font-medium text-gray-900">Performance</h3>
            <p className="text-sm text-gray-600">
              {performanceStats.averageRenderTime < 50 ? 'Excellent' : 
               performanceStats.averageRenderTime < 100 ? 'Good' : 'Needs Attention'}
            </p>
          </div>

          {/* Security Health */}
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
              securityStats.encryptionEnabled ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Shield className={`h-8 w-8 ${
                securityStats.encryptionEnabled ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
            <h3 className="font-medium text-gray-900">Security</h3>
            <p className="text-sm text-gray-600">
              {securityStats.encryptionEnabled ? 'Protected' : 'Not Encrypted'}
            </p>
          </div>

          {/* Storage Health */}
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
              performanceStats.storageUsage < 5000000 ? 'bg-green-100' : 
              performanceStats.storageUsage < 7000000 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <BarChart3 className={`h-8 w-8 ${
                performanceStats.storageUsage < 5000000 ? 'text-green-600' : 
                performanceStats.storageUsage < 7000000 ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <h3 className="font-medium text-gray-900">Storage</h3>
            <p className="text-sm text-gray-600">
              {(performanceStats.storageUsage / 1024 / 1024).toFixed(1)}MB Used
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
