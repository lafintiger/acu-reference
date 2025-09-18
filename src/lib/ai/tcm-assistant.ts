// TCM AI Assistant - Specialized clinical intelligence
// Analyzes patient data and suggests treatments using local AI

import { ollamaClient } from './ollama-client';
import { simpleDb } from '../simpleDatabase';

export class TCMAssistant {
  private readonly systemPrompt = `You are an expert Traditional Chinese Medicine (TCM) practitioner assistant. You specialize in:

- Acupuncture point selection and location
- Treatment protocol recommendations  
- Safety considerations and contraindications
- Multi-modal therapy integration (acupressure, cupping, gua sha, applied kinesiology)
- TCM pattern recognition and diagnosis

Your role is to analyze patient information and provide evidence-based treatment recommendations. Always prioritize safety and include contraindication warnings.

Available data includes:
- 160+ WHO Standard acupuncture points
- Comprehensive treatment protocols for 4 modalities
- Patient intake information (when provided)
- Clinical indications and point relationships

Provide practical, actionable recommendations that practitioners can immediately implement.`;

  // Analyze patient intake and suggest comprehensive treatment plan
  async analyzePatientIntake(patientData: any): Promise<string> {
    const patientSummary = this.createPatientSummary(patientData);
    const availablePoints = this.getRelevantPoints(patientData);
    
    const prompt = `PATIENT ANALYSIS REQUEST

Patient Information:
${patientSummary}

Available Treatment Points:
${availablePoints}

Please provide a comprehensive treatment analysis including:

1. TCM PATTERN ASSESSMENT
   - Constitutional pattern identification
   - Root cause analysis
   - Prognosis and treatment approach

2. TREATMENT RECOMMENDATIONS
   - Primary acupuncture points to use
   - Recommended modalities (acupressure, cupping, gua sha, applied kinesiology)
   - Treatment sequence and timing
   - Session frequency and duration

3. SAFETY CONSIDERATIONS
   - Contraindications based on patient history
   - Pressure/technique modifications needed
   - Monitoring requirements

4. LIFESTYLE RECOMMENDATIONS
   - Diet and exercise suggestions based on TCM pattern
   - Stress management techniques
   - Self-care protocols patient can do at home

5. FOLLOW-UP PLAN
   - Expected timeline for improvement
   - Progress indicators to monitor
   - When to modify treatment approach

Focus on practical, evidence-based recommendations that integrate traditional TCM principles with modern clinical safety standards.`;

    return await ollamaClient.chat(prompt, this.systemPrompt);
  }

  // Get treatment suggestions for specific symptoms
  async getTreatmentSuggestions(symptoms: string[], patientAge?: number, pregnancy?: boolean): Promise<string> {
    const relevantPoints = this.getPointsForSymptoms(symptoms);
    const safetyNotes = this.getSafetyConsiderations(patientAge, pregnancy);

    const prompt = `TREATMENT SUGGESTION REQUEST

Symptoms: ${symptoms.join(', ')}
${patientAge ? `Patient Age: ${patientAge}` : ''}
${pregnancy ? 'PREGNANCY: Yes - use pregnancy-safe protocols only' : ''}

Relevant Points Available:
${relevantPoints}

Safety Considerations:
${safetyNotes}

Please suggest:
1. Primary acupuncture points for these symptoms
2. Best modality for this patient (acupressure, cupping, gua sha, applied kinesiology)
3. Specific technique and pressure recommendations
4. Treatment duration and frequency
5. Any contraindications or precautions
6. Expected outcomes and timeline

Prioritize safety and effectiveness for this specific patient profile.`;

    return await ollamaClient.chat(prompt, this.systemPrompt);
  }

  // Get point-specific guidance
  async getPointGuidance(pointId: string, patientContext?: string): Promise<string> {
    try {
      const point = await simpleDb.getPoint(pointId);
      if (!point) {
        return `Point ${pointId} not found in database.`;
      }

      const prompt = `POINT GUIDANCE REQUEST

Point: ${point.id} - ${point.nameEn} (${point.namePinyin})
Chinese: ${point.nameCharacters}
Location: ${point.location}
Indications: ${point.indications.join(', ')}
${patientContext ? `Patient Context: ${patientContext}` : ''}

Please provide:
1. Precise location instructions for finding this point
2. Acupressure technique (pressure type, duration, angle)
3. Clinical applications and when to use this point
4. Safety considerations and contraindications
5. Points that combine well with this one
6. Expected patient sensations and responses

Make it practical for immediate clinical application.`;

      return await ollamaClient.chat(prompt, this.systemPrompt);
    } catch (error) {
      console.error('Point guidance failed:', error);
      return `Unable to retrieve guidance for ${pointId}. Please check the point ID and try again.`;
    }
  }

  // Quick modality selection guidance
  async getModalityRecommendation(condition: string, patientProfile?: any): Promise<string> {
    const prompt = `MODALITY SELECTION REQUEST

Condition: ${condition}
${patientProfile ? `Patient Profile: ${JSON.stringify(patientProfile, null, 2)}` : ''}

Available Modalities:
- Acupressure: Safe, self-administered, good for chronic conditions
- Cupping: Excellent for muscle tension, requires equipment, visible marks
- Gua Sha: Great for circulation, requires tools, temporary skin changes  
- Applied Kinesiology: Diagnostic, identifies root causes, requires training

Which modality would be best for this patient and condition? Consider:
1. Patient safety and contraindications
2. Condition severity and type
3. Patient preferences and lifestyle
4. Practitioner skill level requirements
5. Equipment availability

Provide specific reasoning for your recommendation.`;

    return await ollamaClient.chat(prompt, this.systemPrompt);
  }

  // Helper methods
  private createPatientSummary(patientData: any): string {
    if (!patientData) return 'No patient data provided';
    
    let summary = '';
    if (patientData.basicInfo) {
      summary += `Age: ${patientData.basicInfo.age}, Gender: ${patientData.basicInfo.gender}\n`;
    }
    if (patientData.chiefComplaint) {
      summary += `Chief Complaint: ${patientData.chiefComplaint.primaryConcern}\n`;
      summary += `Duration: ${patientData.chiefComplaint.duration}, Severity: ${patientData.chiefComplaint.severity}/10\n`;
    }
    if (patientData.healthHistory?.currentMedications?.length) {
      summary += `Medications: ${patientData.healthHistory.currentMedications.join(', ')}\n`;
    }
    if (patientData.healthHistory?.pregnancyStatus === 'pregnant') {
      summary += `PREGNANCY: Use pregnancy-safe protocols only\n`;
    }
    
    return summary;
  }

  private async getRelevantPoints(patientData: any): Promise<string> {
    try {
      // Get points relevant to patient's condition
      const allPoints = await simpleDb.getPoints();
      const chiefComplaint = patientData?.chiefComplaint?.primaryConcern?.toLowerCase() || '';
      
      const relevantPoints = allPoints.filter(point => 
        point.indications.some(indication => 
          chiefComplaint.includes(indication) || indication.includes(chiefComplaint.split(' ')[0])
        )
      ).slice(0, 10); // Top 10 relevant points

      return relevantPoints.map(point => 
        `${point.id} (${point.nameEn}): ${point.location} - ${point.indications.join(', ')}`
      ).join('\n');
    } catch (error) {
      console.error('Failed to get relevant points:', error);
      return 'Unable to retrieve relevant points from database.';
    }
  }

  private async getPointsForSymptoms(symptoms: string[]): Promise<string> {
    const allPoints = await simpleDb.getPoints();
    const relevantPoints = allPoints.filter(point =>
      symptoms.some(symptom => 
        point.indications.some(indication => 
          indication.toLowerCase().includes(symptom.toLowerCase()) ||
          symptom.toLowerCase().includes(indication)
        )
      )
    ).slice(0, 8);

    return relevantPoints.map(point => 
      `${point.id} (${point.nameEn}): ${point.location}`
    ).join('\n');
  }

  private getSafetyConsiderations(age?: number, pregnancy?: boolean): string {
    let safety = '';
    
    if (pregnancy) {
      safety += 'PREGNANCY: Avoid LI4, SP6, BL60, BL67. Use gentle pressure only.\n';
    }
    if (age && age >= 65) {
      safety += 'ELDERLY: Use lighter pressure, shorter duration, monitor comfort.\n';
    }
    if (age && age <= 16) {
      safety += 'MINOR: Use very gentle pressure, shorter sessions, parental consent.\n';
    }
    
    return safety || 'Standard safety protocols apply.';
  }
}

// Singleton instance
export const tcmAssistant = new TCMAssistant();

// Convenience functions
export const analyzePatient = (patientData: any) => 
  tcmAssistant.analyzePatientIntake(patientData);

export const getTreatmentSuggestions = (symptoms: string[], age?: number, pregnancy?: boolean) =>
  tcmAssistant.getTreatmentSuggestions(symptoms, age, pregnancy);

export const getPointGuidance = (pointId: string, context?: string) =>
  tcmAssistant.getPointGuidance(pointId, context);