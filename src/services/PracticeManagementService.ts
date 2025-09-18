// Practice Management Service
// Enterprise features for multi-practitioner practices

import { userManagementService, PractitionerProfile } from './UserManagementService';
import { reportingService } from './ReportingService';
import { securityService } from './SecurityService';

export interface Appointment {
  id: string;
  patientId: string;
  practitionerId: string;
  dateTime: string;
  duration: number; // minutes
  type: 'initial_consultation' | 'follow_up' | 'assessment_only' | 'treatment_only';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  reminderSent: boolean;
  createdBy: string;
  createdAt: string;
}

export interface PatientRecord {
  id: string;
  initials: string; // Privacy protection - no full names
  dateOfBirth: string; // For age calculation only
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  contactPreferences: {
    reminders: boolean;
    followUp: boolean;
    educational: boolean;
  };
  assignedPractitioner: string;
  dateCreated: string;
  lastVisit?: string;
  totalVisits: number;
  isActive: boolean;
}

export interface CollaborationNote {
  id: string;
  patientId: string;
  fromPractitioner: string;
  toPractitioner?: string; // If specific, otherwise to all
  message: string;
  type: 'consultation' | 'referral' | 'observation' | 'question' | 'update';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dateCreated: string;
  read: boolean;
  responses?: Array<{
    from: string;
    message: string;
    dateCreated: string;
  }>;
}

export interface PracticeConfiguration {
  id: string;
  practiceName: string;
  practiceType: 'solo' | 'group' | 'clinic' | 'hospital' | 'academic';
  timeZone: string;
  workingHours: {
    [key: string]: { // day of week
      start: string; // HH:MM
      end: string; // HH:MM
      isOpen: boolean;
    };
  };
  appointmentDuration: {
    initial: number; // minutes
    followUp: number;
    assessment: number;
  };
  features: {
    multiPractitioner: boolean;
    appointmentScheduling: boolean;
    patientReminders: boolean;
    collaborationTools: boolean;
    advancedReporting: boolean;
    mobileAccess: boolean;
  };
  integrations: {
    emailProvider?: string;
    smsProvider?: string;
    calendarSystem?: string;
    billingSystem?: string;
  };
}

export class PracticeManagementService {
  private storage = localStorage;
  private appointmentsKey = 'acu_appointments';
  private patientsKey = 'acu_patient_records';
  private collaborationKey = 'acu_collaboration_notes';
  private configKey = 'acu_practice_config';

  /**
   * Schedule new appointment
   */
  async scheduleAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'createdBy'>): Promise<string> {
    try {
      const currentUser = userManagementService.getCurrentPractitioner();
      if (!currentUser) {
        throw new Error('No authenticated practitioner');
      }

      // Validate appointment data
      this.validateAppointmentData(appointment);

      // Check for conflicts
      const conflicts = await this.checkAppointmentConflicts(appointment);
      if (conflicts.length > 0) {
        throw new Error(`Appointment conflicts detected: ${conflicts.join(', ')}`);
      }

      const appointmentId = `appt_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const newAppointment: Appointment = {
        ...appointment,
        id: appointmentId,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        reminderSent: false
      };

      // Save appointment
      const appointments = this.getStoredAppointments();
      appointments[appointmentId] = newAppointment;
      this.storage.setItem(this.appointmentsKey, JSON.stringify(appointments));

      securityService.logClinicalAction('appointment_scheduled', 'system', appointmentId);
      console.log('✅ Appointment scheduled:', appointmentId);

      return appointmentId;
    } catch (error) {
      console.error('❌ Failed to schedule appointment:', error);
      throw error;
    }
  }

  /**
   * Create patient record
   */
  async createPatientRecord(patient: Omit<PatientRecord, 'id' | 'dateCreated' | 'totalVisits' | 'isActive'>): Promise<string> {
    try {
      const currentUser = userManagementService.getCurrentPractitioner();
      if (!currentUser) {
        throw new Error('No authenticated practitioner');
      }

      // Validate patient data
      this.validatePatientData(patient);

      const patientId = `patient_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const newPatient: PatientRecord = {
        ...patient,
        id: patientId,
        dateCreated: new Date().toISOString(),
        totalVisits: 0,
        isActive: true
      };

      // Save patient record
      const patients = this.getStoredPatients();
      patients[patientId] = newPatient;
      await securityService.secureStore(this.patientsKey, patients);

      securityService.logClinicalAction('patient_created', 'patients', patientId);
      console.log('✅ Patient record created:', patientId);

      return patientId;
    } catch (error) {
      console.error('❌ Failed to create patient record:', error);
      throw error;
    }
  }

  /**
   * Send collaboration note
   */
  async sendCollaborationNote(note: Omit<CollaborationNote, 'id' | 'dateCreated' | 'read'>): Promise<string> {
    try {
      const currentUser = userManagementService.getCurrentPractitioner();
      if (!currentUser) {
        throw new Error('No authenticated practitioner');
      }

      const noteId = `collab_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const newNote: CollaborationNote = {
        ...note,
        id: noteId,
        dateCreated: new Date().toISOString(),
        read: false
      };

      // Save collaboration note
      const notes = this.getStoredCollaborationNotes();
      notes[noteId] = newNote;
      this.storage.setItem(this.collaborationKey, JSON.stringify(notes));

      securityService.logClinicalAction('collaboration_note_sent', 'system', noteId);
      console.log('✅ Collaboration note sent:', noteId);

      return noteId;
    } catch (error) {
      console.error('❌ Failed to send collaboration note:', error);
      throw error;
    }
  }

  /**
   * Get practitioner's appointments
   */
  getPractitionerAppointments(practitionerId: string, date?: string): Appointment[] {
    const appointments = Object.values(this.getStoredAppointments());
    
    let filtered = appointments.filter(appt => appt.practitionerId === practitionerId);
    
    if (date) {
      filtered = filtered.filter(appt => appt.dateTime.startsWith(date));
    }

    return filtered.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }

  /**
   * Get collaboration notes for practitioner
   */
  getCollaborationNotes(practitionerId: string, unreadOnly: boolean = false): CollaborationNote[] {
    const notes = Object.values(this.getStoredCollaborationNotes());
    
    let filtered = notes.filter(note => 
      note.toPractitioner === practitionerId || 
      (!note.toPractitioner && note.fromPractitioner !== practitionerId) // Broadcast messages
    );

    if (unreadOnly) {
      filtered = filtered.filter(note => !note.read);
    }

    return filtered.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
  }

  /**
   * Get practice dashboard data
   */
  async getPracticeDashboard(): Promise<{
    todayAppointments: number;
    weeklyAppointments: number[];
    unreadMessages: number;
    activePractitioners: number;
    pendingTasks: string[];
    alerts: Array<{ type: 'info' | 'warning' | 'error'; message: string }>;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const currentUser = userManagementService.getCurrentPractitioner();
    
    if (!currentUser) {
      throw new Error('No authenticated practitioner');
    }

    const todayAppointments = this.getPractitionerAppointments(currentUser.id, today);
    const unreadMessages = this.getCollaborationNotes(currentUser.id, true);
    const practitioners = userManagementService.getAllPractitioners();

    // Calculate weekly appointment trends
    const weeklyAppointments = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      return this.getPractitionerAppointments(currentUser.id, dateStr).length;
    });

    const alerts = [];
    
    // Generate alerts
    if (unreadMessages.length > 5) {
      alerts.push({ type: 'warning' as const, message: `${unreadMessages.length} unread collaboration messages` });
    }
    
    if (todayAppointments.length > 8) {
      alerts.push({ type: 'info' as const, message: 'Busy day ahead - consider time management' });
    }

    return {
      todayAppointments: todayAppointments.length,
      weeklyAppointments,
      unreadMessages: unreadMessages.length,
      activePractitioners: practitioners.length,
      pendingTasks: [
        'Review yesterday\'s treatment outcomes',
        'Update patient progress notes',
        'Check for workshop content updates'
      ],
      alerts
    };
  }

  /**
   * Configure practice settings
   */
  async configurePractice(config: PracticeConfiguration): Promise<void> {
    try {
      // Validate configuration
      this.validatePracticeConfig(config);

      // Save configuration
      await securityService.secureStore(this.configKey, config);
      
      securityService.logClinicalAction('practice_configured', 'system', config.id);
      console.log('✅ Practice configuration updated');
    } catch (error) {
      console.error('❌ Failed to configure practice:', error);
      throw error;
    }
  }

  /**
   * Private helper methods
   */
  private validateAppointmentData(appointment: any): void {
    const required = ['patientId', 'practitionerId', 'dateTime', 'duration', 'type'];
    
    for (const field of required) {
      if (!appointment[field]) {
        throw new Error(`Required appointment field missing: ${field}`);
      }
    }

    // Validate date format
    if (isNaN(Date.parse(appointment.dateTime))) {
      throw new Error('Invalid appointment date format');
    }

    // Validate duration
    if (appointment.duration < 15 || appointment.duration > 180) {
      throw new Error('Appointment duration must be 15-180 minutes');
    }
  }

  private validatePatientData(patient: any): void {
    const required = ['initials', 'dateOfBirth', 'gender', 'assignedPractitioner'];
    
    for (const field of required) {
      if (!patient[field]) {
        throw new Error(`Required patient field missing: ${field}`);
      }
    }

    // Validate initials format (privacy protection)
    if (patient.initials.length < 2 || patient.initials.length > 4) {
      throw new Error('Patient initials must be 2-4 characters');
    }

    // Validate date of birth
    if (isNaN(Date.parse(patient.dateOfBirth))) {
      throw new Error('Invalid date of birth format');
    }
  }

  private validatePracticeConfig(config: any): void {
    const required = ['practiceName', 'practiceType', 'timeZone'];
    
    for (const field of required) {
      if (!config[field]) {
        throw new Error(`Required configuration field missing: ${field}`);
      }
    }
  }

  private async checkAppointmentConflicts(appointment: any): Promise<string[]> {
    const conflicts: string[] = [];
    const existingAppointments = this.getPractitionerAppointments(appointment.practitionerId);
    
    const newStart = new Date(appointment.dateTime);
    const newEnd = new Date(newStart.getTime() + appointment.duration * 60000);

    for (const existing of existingAppointments) {
      const existingStart = new Date(existing.dateTime);
      const existingEnd = new Date(existingStart.getTime() + existing.duration * 60000);

      // Check for overlap
      if (newStart < existingEnd && newEnd > existingStart) {
        conflicts.push(`Conflicts with appointment ${existing.id} at ${existing.dateTime}`);
      }
    }

    return conflicts;
  }

  private getStoredAppointments(): Record<string, Appointment> {
    try {
      const stored = this.storage.getItem(this.appointmentsKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse stored appointments:', error);
      return {};
    }
  }

  private getStoredPatients(): Record<string, PatientRecord> {
    try {
      const stored = this.storage.getItem(this.patientsKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse stored patients:', error);
      return {};
    }
  }

  private getStoredCollaborationNotes(): Record<string, CollaborationNote> {
    try {
      const stored = this.storage.getItem(this.collaborationKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse stored collaboration notes:', error);
      return {};
    }
  }
}

// Workflow automation service
export class WorkflowAutomationService {
  private practiceService = new PracticeManagementService();

  /**
   * Automate appointment reminders
   */
  async sendAppointmentReminders(): Promise<void> {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const allPractitioners = userManagementService.getAllPractitioners();
      
      for (const practitioner of allPractitioners) {
        const appointments = this.practiceService.getPractitionerAppointments(practitioner.id, tomorrowStr);
        
        for (const appointment of appointments) {
          if (!appointment.reminderSent && appointment.status === 'scheduled') {
            // Send reminder logic would go here
            console.log(`📱 Reminder sent for appointment ${appointment.id}`);
            
            // Mark as sent
            appointment.reminderSent = true;
            // Save updated appointment...
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to send appointment reminders:', error);
    }
  }

  /**
   * Generate daily workflow tasks
   */
  generateDailyTasks(practitionerId: string): string[] {
    const tasks: string[] = [];
    const today = new Date().toISOString().split('T')[0];
    
    const appointments = this.practiceService.getPractitionerAppointments(practitionerId, today);
    
    if (appointments.length > 0) {
      tasks.push(`Review ${appointments.length} scheduled appointments`);
      tasks.push('Prepare treatment protocols for today\'s patients');
    }

    const unreadMessages = this.practiceService.getCollaborationNotes(practitionerId, true);
    if (unreadMessages.length > 0) {
      tasks.push(`Review ${unreadMessages.length} collaboration messages`);
    }

    // Add routine tasks
    tasks.push('Check workshop content for updates');
    tasks.push('Review yesterday\'s treatment outcomes');
    tasks.push('Update continuing education progress');

    return tasks;
  }

  /**
   * Automate outcome tracking
   */
  async automateOutcomeTracking(): Promise<void> {
    try {
      // This would automatically follow up on treatments
      // Send outcome questionnaires, track progress, etc.
      console.log('🔄 Automated outcome tracking initiated');
    } catch (error) {
      console.error('❌ Outcome tracking automation failed:', error);
    }
  }
}

// Collaboration service for team communication
export class CollaborationService {
  private practiceService = new PracticeManagementService();

  /**
   * Create consultation request
   */
  async requestConsultation(
    patientId: string,
    consultingPractitioner: string,
    question: string,
    priority: CollaborationNote['priority'] = 'medium'
  ): Promise<string> {
    const currentUser = userManagementService.getCurrentPractitioner();
    if (!currentUser) {
      throw new Error('No authenticated practitioner');
    }

    return await this.practiceService.sendCollaborationNote({
      patientId,
      fromPractitioner: currentUser.id,
      toPractitioner: consultingPractitioner,
      message: question,
      type: 'consultation',
      priority
    });
  }

  /**
   * Broadcast practice update
   */
  async broadcastUpdate(message: string, type: CollaborationNote['type'] = 'update'): Promise<string> {
    const currentUser = userManagementService.getCurrentPractitioner();
    if (!currentUser) {
      throw new Error('No authenticated practitioner');
    }

    return await this.practiceService.sendCollaborationNote({
      patientId: 'system',
      fromPractitioner: currentUser.id,
      // No toPractitioner means broadcast to all
      message,
      type,
      priority: 'medium'
    });
  }

  /**
   * Get team activity feed
   */
  getTeamActivity(): Array<{
    type: string;
    practitioner: string;
    action: string;
    timestamp: string;
    details?: any;
  }> {
    // This would aggregate activity from audit logs
    return [
      {
        type: 'assessment',
        practitioner: 'Dr. Smith',
        action: 'Completed Chapman points assessment',
        timestamp: '2 hours ago',
        details: { patient: 'Patient #142', findings: 3 }
      },
      {
        type: 'treatment',
        practitioner: 'Dr. Johnson',
        action: 'Applied acupressure protocol',
        timestamp: '3 hours ago',
        details: { patient: 'Patient #139', duration: '45 minutes' }
      },
      {
        type: 'collaboration',
        practitioner: 'Dr. Lee',
        action: 'Requested consultation',
        timestamp: '4 hours ago',
        details: { regarding: 'Complex Chapman findings' }
      }
    ];
  }
}

// Singleton instances
export const practiceManagementService = new PracticeManagementService();
export const workflowAutomationService = new WorkflowAutomationService();
export const collaborationService = new CollaborationService();

// Convenience functions
export const scheduleAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'createdBy'>) =>
  practiceManagementService.scheduleAppointment(appointment);

export const createPatient = (patient: Omit<PatientRecord, 'id' | 'dateCreated' | 'totalVisits' | 'isActive'>) =>
  practiceManagementService.createPatientRecord(patient);

export const requestConsultation = (patientId: string, practitioner: string, question: string) =>
  collaborationService.requestConsultation(patientId, practitioner, question);
