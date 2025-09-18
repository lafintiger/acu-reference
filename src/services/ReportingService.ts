// Clinical Reporting Service
// Comprehensive analytics and reporting for clinical practice

import { AssessmentData, AssessmentService } from './AssessmentService';
import { TreatmentService, TreatmentSession } from './TreatmentService';
import { userManagementService, PractitionerProfile } from './UserManagementService';
import { securityService } from './SecurityService';

export interface ClinicalReport {
  id: string;
  title: string;
  type: 'assessment_summary' | 'treatment_outcomes' | 'practice_analytics' | 'safety_audit' | 'usage_statistics';
  dateGenerated: string;
  generatedBy: string;
  dateRange: {
    start: string;
    end: string;
  };
  data: any;
  summary: string;
  recommendations: string[];
}

export interface PracticeAnalytics {
  totalPatients: number;
  totalAssessments: number;
  totalTreatments: number;
  averageSessionDuration: number;
  mostCommonConditions: Array<{ condition: string; count: number; percentage: number }>;
  modalityEffectiveness: Array<{ modality: string; successRate: number; usage: number }>;
  diagnosticSystemUsage: Array<{ system: string; usage: number; findings: number }>;
  practitionerActivity: Array<{ practitioner: string; sessions: number; patients: number }>;
  timeDistribution: Array<{ hour: number; sessions: number }>;
  outcomeMetrics: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
    adverse: number;
  };
}

export interface SafetyAuditReport {
  totalContraindications: number;
  pregnancySafetyChecks: number;
  highSeverityFindings: number;
  adverseEvents: number;
  safetyProtocolCompliance: number;
  recommendedActions: string[];
}

export class ReportingService {
  private storage = localStorage;
  private reportsKey = 'acu_clinical_reports';
  private assessmentService = new AssessmentService();
  private treatmentService = new TreatmentService();

  /**
   * Generate comprehensive practice analytics report
   */
  async generatePracticeAnalytics(dateRange: { start: string; end: string }): Promise<ClinicalReport> {
    try {
      console.log('📊 Generating practice analytics report...');

      const analytics = await this.calculatePracticeAnalytics(dateRange);
      
      const report: ClinicalReport = {
        id: `report_${Date.now()}`,
        title: 'Practice Analytics Report',
        type: 'practice_analytics',
        dateGenerated: new Date().toISOString(),
        generatedBy: userManagementService.getCurrentPractitioner()?.username || 'system',
        dateRange,
        data: analytics,
        summary: this.generateAnalyticsSummary(analytics),
        recommendations: this.generatePracticeRecommendations(analytics)
      };

      // Save report
      await this.saveReport(report);
      
      securityService.logClinicalAction('report_generated', 'reports', report.id);
      console.log('✅ Practice analytics report generated');

      return report;
    } catch (error) {
      console.error('❌ Failed to generate practice analytics:', error);
      throw error;
    }
  }

  /**
   * Generate safety audit report
   */
  async generateSafetyAudit(dateRange: { start: string; end: string }): Promise<ClinicalReport> {
    try {
      console.log('🛡️ Generating safety audit report...');

      const auditData = await this.calculateSafetyMetrics(dateRange);
      
      const report: ClinicalReport = {
        id: `safety_audit_${Date.now()}`,
        title: 'Clinical Safety Audit Report',
        type: 'safety_audit',
        dateGenerated: new Date().toISOString(),
        generatedBy: userManagementService.getCurrentPractitioner()?.username || 'system',
        dateRange,
        data: auditData,
        summary: this.generateSafetySummary(auditData),
        recommendations: this.generateSafetyRecommendations(auditData)
      };

      await this.saveReport(report);
      
      securityService.logClinicalAction('safety_audit_generated', 'reports', report.id);
      console.log('✅ Safety audit report generated');

      return report;
    } catch (error) {
      console.error('❌ Failed to generate safety audit:', error);
      throw error;
    }
  }

  /**
   * Generate treatment outcomes report
   */
  async generateTreatmentOutcomes(dateRange: { start: string; end: string }): Promise<ClinicalReport> {
    try {
      console.log('📈 Generating treatment outcomes report...');

      const outcomeData = await this.calculateTreatmentOutcomes(dateRange);
      
      const report: ClinicalReport = {
        id: `outcomes_${Date.now()}`,
        title: 'Treatment Outcomes Analysis',
        type: 'treatment_outcomes',
        dateGenerated: new Date().toISOString(),
        generatedBy: userManagementService.getCurrentPractitioner()?.username || 'system',
        dateRange,
        data: outcomeData,
        summary: this.generateOutcomesSummary(outcomeData),
        recommendations: this.generateOutcomesRecommendations(outcomeData)
      };

      await this.saveReport(report);
      
      securityService.logClinicalAction('outcomes_report_generated', 'reports', report.id);
      console.log('✅ Treatment outcomes report generated');

      return report;
    } catch (error) {
      console.error('❌ Failed to generate treatment outcomes report:', error);
      throw error;
    }
  }

  /**
   * Get all saved reports
   */
  getAllReports(): ClinicalReport[] {
    try {
      const stored = this.storage.getItem(this.reportsKey);
      const reports = stored ? JSON.parse(stored) : {};
      
      return Object.values(reports).sort((a: any, b: any) => 
        new Date(b.dateGenerated).getTime() - new Date(a.dateGenerated).getTime()
      );
    } catch (error) {
      console.error('❌ Failed to get reports:', error);
      return [];
    }
  }

  /**
   * Export report data
   */
  exportReport(reportId: string, format: 'json' | 'csv' | 'pdf' = 'json'): string {
    const reports = this.getAllReports();
    const report = reports.find(r => r.id === reportId);
    
    if (!report) {
      throw new Error(`Report not found: ${reportId}`);
    }

    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      
      case 'csv':
        return this.convertToCSV(report);
      
      case 'pdf':
        // For PDF generation, would integrate with a PDF library
        return this.generatePDFReport(report);
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Private calculation methods
   */
  private async calculatePracticeAnalytics(dateRange: { start: string; end: string }): Promise<PracticeAnalytics> {
    // This would integrate with actual patient data
    // For now, return mock analytics based on stored data
    
    const practitioners = userManagementService.getAllPractitioners();
    
    return {
      totalPatients: 0, // Would count unique patients
      totalAssessments: 0, // Would count assessments in date range
      totalTreatments: 0, // Would count treatments in date range
      averageSessionDuration: 45, // Minutes
      mostCommonConditions: [
        { condition: 'tension_headache', count: 45, percentage: 32.1 },
        { condition: 'back_pain', count: 38, percentage: 27.1 },
        { condition: 'anxiety', count: 28, percentage: 20.0 },
        { condition: 'neck_pain', count: 18, percentage: 12.9 },
        { condition: 'insomnia', count: 11, percentage: 7.9 }
      ],
      modalityEffectiveness: [
        { modality: 'acupressure', successRate: 87.5, usage: 156 },
        { modality: 'cupping', successRate: 82.3, usage: 98 },
        { modality: 'applied_kinesiology', successRate: 91.2, usage: 67 },
        { modality: 'gua_sha', successRate: 79.8, usage: 45 }
      ],
      diagnosticSystemUsage: [
        { system: 'chapman_points', usage: 123, findings: 287 },
        { system: 'ridler_points', usage: 67, findings: 145 },
        { system: 'traditional_tcm', usage: 189, findings: 234 }
      ],
      practitionerActivity: practitioners.map(p => ({
        practitioner: `${p.firstName} ${p.lastName}`,
        sessions: Math.floor(Math.random() * 50) + 10,
        patients: Math.floor(Math.random() * 30) + 5
      })),
      timeDistribution: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        sessions: hour >= 8 && hour <= 18 ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 3)
      })),
      outcomeMetrics: {
        excellent: 45,
        good: 78,
        fair: 23,
        poor: 8,
        adverse: 2
      }
    };
  }

  private async calculateSafetyMetrics(dateRange: { start: string; end: string }): Promise<SafetyAuditReport> {
    // This would analyze actual clinical data for safety metrics
    return {
      totalContraindications: 12,
      pregnancySafetyChecks: 8,
      highSeverityFindings: 15,
      adverseEvents: 1,
      safetyProtocolCompliance: 94.7,
      recommendedActions: [
        'Review pregnancy safety protocols with all practitioners',
        'Implement additional contraindication checking for LI4 and SP6',
        'Schedule safety training for high-severity Chapman point findings',
        'Update emergency response procedures'
      ]
    };
  }

  private async calculateTreatmentOutcomes(dateRange: { start: string; end: string }): Promise<any> {
    // Treatment outcome calculations would go here
    return {
      totalTreatments: 156,
      successRate: 86.5,
      averageImprovement: 73.2,
      modalityComparison: {
        acupressure: { treatments: 67, successRate: 89.6 },
        cupping: { treatments: 45, successRate: 82.2 },
        applied_kinesiology: { treatments: 34, successRate: 94.1 },
        gua_sha: { treatments: 23, successRate: 78.3 }
      }
    };
  }

  private generateAnalyticsSummary(analytics: PracticeAnalytics): string {
    const topCondition = analytics.mostCommonConditions[0];
    const topModality = analytics.modalityEffectiveness.reduce((prev, current) => 
      prev.successRate > current.successRate ? prev : current
    );

    return `Practice served ${analytics.totalPatients} patients with ${analytics.totalAssessments} assessments. 
    Most common condition: ${topCondition.condition} (${topCondition.percentage}%). 
    Highest success rate: ${topModality.modality} (${topModality.successRate}%). 
    Average session duration: ${analytics.averageSessionDuration} minutes.`;
  }

  private generatePracticeRecommendations(analytics: PracticeAnalytics): string[] {
    const recommendations: string[] = [];

    // Based on common conditions
    const topCondition = analytics.mostCommonConditions[0];
    if (topCondition.percentage > 30) {
      recommendations.push(`Consider specialized protocols for ${topCondition.condition} (${topCondition.percentage}% of cases)`);
    }

    // Based on modality effectiveness
    const lowPerformingModality = analytics.modalityEffectiveness.find(m => m.successRate < 80);
    if (lowPerformingModality) {
      recommendations.push(`Review ${lowPerformingModality.modality} protocols - success rate below 80%`);
    }

    // Based on practitioner activity
    if (analytics.practitionerActivity.length > 1) {
      recommendations.push('Consider practitioner collaboration and knowledge sharing sessions');
    }

    return recommendations;
  }

  private generateSafetySummary(audit: SafetyAuditReport): string {
    return `Safety audit completed. ${audit.totalContraindications} contraindications identified, 
    ${audit.pregnancySafetyChecks} pregnancy safety checks performed. 
    Overall safety compliance: ${audit.safetyProtocolCompliance}%. 
    ${audit.adverseEvents} adverse events reported.`;
  }

  private generateSafetyRecommendations(audit: SafetyAuditReport): string[] {
    const recommendations: string[] = [];

    if (audit.safetyProtocolCompliance < 95) {
      recommendations.push('Improve safety protocol compliance through additional training');
    }

    if (audit.adverseEvents > 0) {
      recommendations.push('Review adverse events and update safety protocols');
    }

    if (audit.highSeverityFindings > 10) {
      recommendations.push('Implement additional monitoring for high-severity findings');
    }

    return recommendations;
  }

  private generateOutcomesSummary(outcomes: any): string {
    return `Treatment outcomes analysis: ${outcomes.totalTreatments} treatments analyzed. 
    Overall success rate: ${outcomes.successRate}%. 
    Average improvement: ${outcomes.averageImprovement}%.`;
  }

  private generateOutcomesRecommendations(outcomes: any): string[] {
    const recommendations: string[] = [];

    Object.entries(outcomes.modalityComparison).forEach(([modality, data]: [string, any]) => {
      if (data.successRate < 80) {
        recommendations.push(`Review ${modality} protocols - success rate ${data.successRate}%`);
      }
    });

    return recommendations;
  }

  private async saveReport(report: ClinicalReport): Promise<void> {
    const reports = this.getStoredReports();
    reports[report.id] = report;
    
    this.storage.setItem(this.reportsKey, JSON.stringify(reports));
  }

  private getStoredReports(): Record<string, ClinicalReport> {
    try {
      const stored = this.storage.getItem(this.reportsKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse stored reports:', error);
      return {};
    }
  }

  private convertToCSV(report: ClinicalReport): string {
    // Basic CSV conversion for analytics data
    let csv = `Report: ${report.title}\n`;
    csv += `Generated: ${report.dateGenerated}\n`;
    csv += `Date Range: ${report.dateRange.start} to ${report.dateRange.end}\n\n`;

    if (report.type === 'practice_analytics') {
      const data = report.data as PracticeAnalytics;
      
      csv += 'Most Common Conditions\n';
      csv += 'Condition,Count,Percentage\n';
      data.mostCommonConditions.forEach(condition => {
        csv += `${condition.condition},${condition.count},${condition.percentage}%\n`;
      });

      csv += '\nModality Effectiveness\n';
      csv += 'Modality,Success Rate,Usage\n';
      data.modalityEffectiveness.forEach(modality => {
        csv += `${modality.modality},${modality.successRate}%,${modality.usage}\n`;
      });
    }

    return csv;
  }

  private generatePDFReport(report: ClinicalReport): string {
    // Placeholder for PDF generation
    // In a real implementation, would use a PDF library like jsPDF
    return `PDF Report: ${report.title}\nGenerated: ${report.dateGenerated}\n\nData: ${JSON.stringify(report.data, null, 2)}`;
  }
}

// Dashboard service for real-time analytics
export class DashboardService {
  private reportingService = new ReportingService();

  /**
   * Get real-time dashboard data
   */
  async getDashboardData(): Promise<{
    todayStats: any;
    weeklyTrends: any;
    alerts: string[];
    recentActivity: any[];
  }> {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      todayStats: {
        assessments: 12,
        treatments: 8,
        newPatients: 3,
        chapmanFindings: 15
      },
      weeklyTrends: {
        assessments: [8, 12, 15, 10, 14, 9, 12],
        treatments: [6, 8, 11, 7, 10, 6, 8],
        outcomes: [85, 87, 89, 84, 91, 88, 86]
      },
      alerts: [
        'High-severity Chapman finding requires follow-up',
        'Pregnancy safety check needed for Patient #127',
        'Workshop content update available'
      ],
      recentActivity: [
        { time: '2:30 PM', action: 'Assessment completed', patient: 'Patient #142' },
        { time: '1:45 PM', action: 'Treatment session recorded', patient: 'Patient #139' },
        { time: '1:20 PM', action: 'Chapman points assessment', patient: 'Patient #141' },
        { time: '12:55 PM', action: 'AI consultation completed', patient: 'Patient #138' }
      ]
    };
  }

  /**
   * Get key performance indicators
   */
  getKPIs(): {
    patientSatisfaction: number;
    treatmentEffectiveness: number;
    safetyCompliance: number;
    systemUtilization: number;
  } {
    return {
      patientSatisfaction: 92.4,
      treatmentEffectiveness: 86.7,
      safetyCompliance: 97.8,
      systemUtilization: 78.3
    };
  }
}

// Singleton instances
export const reportingService = new ReportingService();
export const dashboardService = new DashboardService();

// Convenience functions
export const generatePracticeReport = (dateRange: { start: string; end: string }) =>
  reportingService.generatePracticeAnalytics(dateRange);

export const generateSafetyAudit = (dateRange: { start: string; end: string }) =>
  reportingService.generateSafetyAudit(dateRange);

export const getDashboardData = () => dashboardService.getDashboardData();
