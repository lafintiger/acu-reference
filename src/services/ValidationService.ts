// Clinical Validation Service
// Comprehensive validation for clinical data integrity

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface AssessmentData {
  signs: string[];
  symptoms: string[];
  chapmanFindings: ChapmanFinding[];
  notes?: string;
}

export interface ChapmanFinding {
  pointId: string;
  severity: number;
  notes: string;
  dateRecorded: string;
}

export interface TreatmentPlan {
  diagnosis?: string;
  tcmPattern?: string;
  selectedPoints: string[];
  modalities: string[];
  goals: string[];
  contraindications?: string[];
}

export class ClinicalValidationService {
  
  /**
   * Validate assessment data for clinical accuracy
   */
  validateAssessmentData(data: AssessmentData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate Chapman point findings
    if (data.chapmanFindings && data.chapmanFindings.length > 0) {
      data.chapmanFindings.forEach((finding, index) => {
        // Severity validation
        if (finding.severity < 1 || finding.severity > 10) {
          errors.push(`Chapman finding ${index + 1}: Invalid severity rating (${finding.severity}). Must be 1-10.`);
        }

        // Point ID validation
        if (!finding.pointId || typeof finding.pointId !== 'string') {
          errors.push(`Chapman finding ${index + 1}: Missing or invalid point ID.`);
        }

        // Date validation
        if (!finding.dateRecorded || isNaN(Date.parse(finding.dateRecorded))) {
          errors.push(`Chapman finding ${index + 1}: Invalid or missing date.`);
        }

        // High severity warnings
        if (finding.severity >= 8) {
          warnings.push(`Chapman finding ${index + 1}: High severity (${finding.severity}) - consider immediate attention.`);
        }
      });
    }

    // Validate signs and symptoms
    if (!data.signs || data.signs.length === 0) {
      warnings.push('No clinical signs recorded. Consider adding objective findings.');
    }

    if (!data.symptoms || data.symptoms.length === 0) {
      warnings.push('No symptoms recorded. Consider adding subjective complaints.');
    }

    // Check for minimum assessment data
    if (data.signs.length === 0 && data.symptoms.length === 0 && data.chapmanFindings.length === 0) {
      errors.push('Assessment must include at least one sign, symptom, or Chapman point finding.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Validate treatment plan for safety and completeness
   */
  validateTreatmentPlan(plan: TreatmentPlan): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Require either diagnosis or TCM pattern
    if (!plan.diagnosis && !plan.tcmPattern) {
      errors.push('Treatment plan must include either a clinical diagnosis or TCM pattern.');
    }

    // Validate selected points
    if (!plan.selectedPoints || plan.selectedPoints.length === 0) {
      errors.push('Treatment plan must include at least one acupuncture point.');
    } else if (plan.selectedPoints.length > 20) {
      warnings.push(`Large number of points selected (${plan.selectedPoints.length}). Consider focusing treatment.`);
    }

    // Validate modalities
    if (!plan.modalities || plan.modalities.length === 0) {
      warnings.push('No treatment modalities selected. Consider adding treatment methods.');
    }

    // Validate treatment goals
    if (!plan.goals || plan.goals.length === 0) {
      warnings.push('No treatment goals specified. Consider setting measurable objectives.');
    }

    // Safety checks for contraindications
    if (plan.contraindications && plan.contraindications.length > 0) {
      warnings.push(`Contraindications noted: ${plan.contraindications.join(', ')}. Ensure safety protocols are followed.`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Validate workshop content for import
   */
  validateWorkshopContent(content: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!content) {
      errors.push('Workshop content is required.');
      return { isValid: false, errors };
    }

    // Validate protocol structure
    if (content.protocols && Array.isArray(content.protocols)) {
      content.protocols.forEach((protocol: any, index: number) => {
        if (!protocol.name || typeof protocol.name !== 'string') {
          errors.push(`Protocol ${index + 1}: Missing or invalid name.`);
        }

        if (!protocol.indication || typeof protocol.indication !== 'string') {
          errors.push(`Protocol ${index + 1}: Missing or invalid indication.`);
        }

        if (!protocol.technique || typeof protocol.technique !== 'string') {
          warnings.push(`Protocol ${index + 1}: Missing technique description.`);
        }

        // Check for safety information
        if (!protocol.contraindications || protocol.contraindications.length === 0) {
          warnings.push(`Protocol ${index + 1}: No contraindications specified. Consider adding safety information.`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Validate WHO point compliance
   */
  validateWHOCompliance(point: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!point) {
      errors.push('Point data is required.');
      return { isValid: false, errors };
    }

    // Required WHO fields
    const requiredFields = ['id', 'nameEn', 'location'];
    requiredFields.forEach(field => {
      if (!point[field] || typeof point[field] !== 'string') {
        errors.push(`Missing or invalid required field: ${field}`);
      }
    });

    // Validate point ID format
    if (point.id && !/^[A-Z]{2,3}\d+$/.test(point.id)) {
      warnings.push(`Point ID "${point.id}" may not follow WHO standard format (e.g., LI4, ST36).`);
    }

    // Validate location description
    if (point.location && point.location.length < 10) {
      warnings.push('Location description may be too brief for clinical use.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * General data integrity check
   */
  validateDataIntegrity(data: any, dataType: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data) {
      errors.push(`${dataType} data is null or undefined.`);
      return { isValid: false, errors };
    }

    // Check for required timestamp
    if (data.dateCreated && isNaN(Date.parse(data.dateCreated))) {
      warnings.push('Invalid creation date format.');
    }

    // Check for data size (localStorage limits)
    try {
      const dataSize = JSON.stringify(data).length;
      if (dataSize > 1000000) { // 1MB warning
        warnings.push(`Large data size (${Math.round(dataSize / 1024)}KB). Consider data optimization.`);
      }
    } catch (error) {
      errors.push('Data cannot be serialized for storage.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
}

// Singleton instance
export const validationService = new ClinicalValidationService();

// Convenience functions
export const validateAssessment = (data: AssessmentData) => 
  validationService.validateAssessmentData(data);

export const validateTreatment = (plan: TreatmentPlan) => 
  validationService.validateTreatmentPlan(plan);

export const validateWorkshop = (content: any) => 
  validationService.validateWorkshopContent(content);
