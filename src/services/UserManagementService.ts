// User Management Service
// Multi-practitioner support with role-based access control

import { securityService } from './SecurityService';
import { validationService } from './ValidationService';

export interface PractitionerProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  credentials: string[];
  specializations: string[];
  licenseNumber?: string;
  licenseState?: string;
  preferences: PractitionerPreferences;
  accessLevel: 'basic' | 'advanced' | 'admin' | 'observer';
  isActive: boolean;
  dateCreated: string;
  lastLogin?: string;
  practiceInfo?: PracticeInfo;
}

export interface PractitionerPreferences {
  defaultModalities: string[];
  preferredAIModel: string;
  diagnosticSystems: string[]; // Chapman, Ridler, Bennett
  uiTheme: 'light' | 'dark' | 'clinical';
  language: 'en' | 'zh' | 'es' | 'fr';
  measurementSystem: 'metric' | 'imperial';
  autoSave: boolean;
  notificationSettings: {
    appointmentReminders: boolean;
    systemUpdates: boolean;
    securityAlerts: boolean;
  };
}

export interface PracticeInfo {
  practiceName: string;
  address?: string;
  phone?: string;
  website?: string;
  practiceType: 'solo' | 'group' | 'clinic' | 'hospital';
  specialtyFocus: string[];
}

export interface UserSession {
  userId: string;
  sessionId: string;
  loginTime: string;
  lastActivity: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

export interface AccessPermission {
  resource: 'patients' | 'assessments' | 'treatments' | 'reports' | 'system' | 'workshop_content';
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}

export class UserManagementService {
  private storage = localStorage;
  private usersKey = 'acu_practitioners';
  private sessionsKey = 'acu_sessions';
  private currentUserKey = 'acu_current_user';

  /**
   * Create new practitioner account
   */
  async createPractitioner(profile: Omit<PractitionerProfile, 'id' | 'dateCreated' | 'isActive'>): Promise<string> {
    try {
      // Validate required fields
      this.validatePractitionerData(profile);

      // Check for duplicate username/email
      const existingUsers = this.getAllPractitioners();
      const duplicateUsername = existingUsers.find(u => u.username === profile.username);
      const duplicateEmail = existingUsers.find(u => u.email === profile.email);

      if (duplicateUsername) {
        throw new Error(`Username "${profile.username}" already exists`);
      }

      if (duplicateEmail) {
        throw new Error(`Email "${profile.email}" already exists`);
      }

      // Create new practitioner
      const practitionerId = `prac_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const newPractitioner: PractitionerProfile = {
        ...profile,
        id: practitionerId,
        dateCreated: new Date().toISOString(),
        isActive: true
      };

      // Save to storage
      const practitioners = this.getStoredPractitioners();
      practitioners[practitionerId] = newPractitioner;
      
      await securityService.secureStore(this.usersKey, practitioners);
      
      // Log creation
      securityService.logClinicalAction('practitioner_created', 'system', practitionerId);
      console.log('✅ Practitioner created successfully:', practitionerId);

      return practitionerId;
    } catch (error) {
      console.error('❌ Failed to create practitioner:', error);
      securityService.logError(error as Error, 'practitioner_creation');
      throw error;
    }
  }

  /**
   * Authenticate practitioner login
   */
  async authenticatePractitioner(username: string, credentials: any): Promise<UserSession | null> {
    try {
      const practitioners = this.getAllPractitioners();
      const practitioner = practitioners.find(p => 
        p.username === username && p.isActive
      );

      if (!practitioner) {
        securityService.logClinicalAction('login_failed', 'system', undefined, { username, reason: 'user_not_found' });
        return null;
      }

      // In a real implementation, verify password/credentials here
      // For this demo, we'll assume authentication is successful

      // Create session
      const session: UserSession = {
        userId: practitioner.id,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        userAgent: navigator.userAgent,
        isActive: true
      };

      // Store session
      const sessions = this.getStoredSessions();
      sessions[session.sessionId] = session;
      this.storage.setItem(this.sessionsKey, JSON.stringify(sessions));

      // Set current user
      this.storage.setItem(this.currentUserKey, practitioner.id);

      // Update last login
      practitioner.lastLogin = new Date().toISOString();
      const allPractitioners = this.getStoredPractitioners();
      allPractitioners[practitioner.id] = practitioner;
      await securityService.secureStore(this.usersKey, allPractitioners);

      securityService.logClinicalAction('login_successful', 'system', practitioner.id);
      console.log('✅ Practitioner authenticated:', practitioner.username);

      return session;
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      securityService.logError(error as Error, 'authentication');
      return null;
    }
  }

  /**
   * Get current logged-in practitioner
   */
  getCurrentPractitioner(): PractitionerProfile | null {
    try {
      const currentUserId = this.storage.getItem(this.currentUserKey);
      if (!currentUserId) return null;

      const practitioners = this.getAllPractitioners();
      return practitioners.find(p => p.id === currentUserId) || null;
    } catch (error) {
      console.error('❌ Failed to get current practitioner:', error);
      return null;
    }
  }

  /**
   * Update practitioner profile
   */
  async updatePractitioner(userId: string, updates: Partial<PractitionerProfile>): Promise<void> {
    try {
      const practitioners = this.getStoredPractitioners();
      const practitioner = practitioners[userId];

      if (!practitioner) {
        throw new Error(`Practitioner not found: ${userId}`);
      }

      // Validate updates
      if (updates.email || updates.username) {
        this.validatePractitionerData({ ...practitioner, ...updates } as any);
      }

      // Apply updates
      const updatedPractitioner = {
        ...practitioner,
        ...updates,
        lastModified: new Date().toISOString()
      };

      practitioners[userId] = updatedPractitioner;
      await securityService.secureStore(this.usersKey, practitioners);

      securityService.logClinicalAction('practitioner_updated', 'system', userId, updates);
      console.log('✅ Practitioner updated:', userId);
    } catch (error) {
      console.error('❌ Failed to update practitioner:', error);
      securityService.logError(error as Error, 'practitioner_update');
      throw error;
    }
  }

  /**
   * Get practitioner permissions based on access level
   */
  getPractitionerPermissions(practitioner: PractitionerProfile): AccessPermission[] {
    const permissions: AccessPermission[] = [];

    switch (practitioner.accessLevel) {
      case 'admin':
        permissions.push(
          { resource: 'patients', actions: ['read', 'write', 'delete', 'admin'] },
          { resource: 'assessments', actions: ['read', 'write', 'delete', 'admin'] },
          { resource: 'treatments', actions: ['read', 'write', 'delete', 'admin'] },
          { resource: 'reports', actions: ['read', 'write', 'delete', 'admin'] },
          { resource: 'system', actions: ['read', 'write', 'delete', 'admin'] },
          { resource: 'workshop_content', actions: ['read', 'write', 'delete', 'admin'] }
        );
        break;

      case 'advanced':
        permissions.push(
          { resource: 'patients', actions: ['read', 'write', 'delete'] },
          { resource: 'assessments', actions: ['read', 'write', 'delete'] },
          { resource: 'treatments', actions: ['read', 'write', 'delete'] },
          { resource: 'reports', actions: ['read', 'write'] },
          { resource: 'workshop_content', actions: ['read', 'write'] }
        );
        break;

      case 'basic':
        permissions.push(
          { resource: 'patients', actions: ['read', 'write'] },
          { resource: 'assessments', actions: ['read', 'write'] },
          { resource: 'treatments', actions: ['read', 'write'] },
          { resource: 'reports', actions: ['read'] },
          { resource: 'workshop_content', actions: ['read'] }
        );
        break;

      case 'observer':
        permissions.push(
          { resource: 'patients', actions: ['read'] },
          { resource: 'assessments', actions: ['read'] },
          { resource: 'treatments', actions: ['read'] },
          { resource: 'reports', actions: ['read'] }
        );
        break;
    }

    return permissions;
  }

  /**
   * Check if practitioner has permission for action
   */
  hasPermission(
    practitioner: PractitionerProfile, 
    resource: AccessPermission['resource'], 
    action: AccessPermission['actions'][0]
  ): boolean {
    const permissions = this.getPractitionerPermissions(practitioner);
    const resourcePermission = permissions.find(p => p.resource === resource);
    
    return resourcePermission?.actions.includes(action) || false;
  }

  /**
   * Get all practitioners (admin only)
   */
  getAllPractitioners(): PractitionerProfile[] {
    try {
      const stored = this.getStoredPractitioners();
      return Object.values(stored).filter(p => p.isActive);
    } catch (error) {
      console.error('❌ Failed to get practitioners:', error);
      return [];
    }
  }

  /**
   * Deactivate practitioner account
   */
  async deactivatePractitioner(userId: string, reason: string): Promise<void> {
    try {
      const practitioners = this.getStoredPractitioners();
      const practitioner = practitioners[userId];

      if (!practitioner) {
        throw new Error(`Practitioner not found: ${userId}`);
      }

      practitioner.isActive = false;
      practitioners[userId] = practitioner;

      await securityService.secureStore(this.usersKey, practitioners);
      securityService.logClinicalAction('practitioner_deactivated', 'system', userId, { reason });

      console.log('✅ Practitioner deactivated:', userId);
    } catch (error) {
      console.error('❌ Failed to deactivate practitioner:', error);
      throw error;
    }
  }

  /**
   * Logout practitioner
   */
  logout(): void {
    try {
      const currentUser = this.getCurrentPractitioner();
      
      if (currentUser) {
        securityService.logClinicalAction('logout', 'system', currentUser.id);
      }

      // Clear current user
      this.storage.removeItem(this.currentUserKey);
      
      // Deactivate sessions
      const sessions = this.getStoredSessions();
      Object.values(sessions).forEach(session => {
        if (session.userId === currentUser?.id) {
          session.isActive = false;
        }
      });
      
      this.storage.setItem(this.sessionsKey, JSON.stringify(sessions));
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  }

  /**
   * Get practice statistics
   */
  getPracticeStatistics(): {
    totalPractitioners: number;
    activePractitioners: number;
    specializations: Record<string, number>;
    accessLevels: Record<string, number>;
    recentActivity: number;
  } {
    const practitioners = this.getAllPractitioners();
    const sessions = Object.values(this.getStoredSessions());
    
    const specializations: Record<string, number> = {};
    const accessLevels: Record<string, number> = {};

    practitioners.forEach(p => {
      // Count specializations
      p.specializations.forEach(spec => {
        specializations[spec] = (specializations[spec] || 0) + 1;
      });

      // Count access levels
      accessLevels[p.accessLevel] = (accessLevels[p.accessLevel] || 0) + 1;
    });

    // Count recent activity (last 24 hours)
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const recentActivity = sessions.filter(s => 
      new Date(s.lastActivity).getTime() > oneDayAgo
    ).length;

    return {
      totalPractitioners: practitioners.length,
      activePractitioners: practitioners.filter(p => p.isActive).length,
      specializations,
      accessLevels,
      recentActivity
    };
  }

  /**
   * Private helper methods
   */
  private validatePractitionerData(profile: any): void {
    const required = ['username', 'email', 'firstName', 'lastName'];
    
    for (const field of required) {
      if (!profile[field] || typeof profile[field] !== 'string') {
        throw new Error(`Required field missing or invalid: ${field}`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      throw new Error('Invalid email format');
    }

    // Validate username format
    if (profile.username.length < 3 || profile.username.length > 20) {
      throw new Error('Username must be 3-20 characters');
    }

    // Validate credentials
    if (profile.credentials && !Array.isArray(profile.credentials)) {
      throw new Error('Credentials must be an array');
    }
  }

  private getStoredPractitioners(): Record<string, PractitionerProfile> {
    try {
      const stored = this.storage.getItem(this.usersKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse stored practitioners:', error);
      return {};
    }
  }

  private getStoredSessions(): Record<string, UserSession> {
    try {
      const stored = this.storage.getItem(this.sessionsKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse stored sessions:', error);
      return {};
    }
  }
}

// Role-based access control helper
export class AccessControlService {
  private userService = new UserManagementService();

  /**
   * Check if current user can perform action
   */
  canPerformAction(resource: AccessPermission['resource'], action: AccessPermission['actions'][0]): boolean {
    const currentUser = this.userService.getCurrentPractitioner();
    if (!currentUser) return false;

    return this.userService.hasPermission(currentUser, resource, action);
  }

  /**
   * Require specific permission or throw error
   */
  requirePermission(resource: AccessPermission['resource'], action: AccessPermission['actions'][0]): void {
    if (!this.canPerformAction(resource, action)) {
      const currentUser = this.userService.getCurrentPractitioner();
      const username = currentUser?.username || 'anonymous';
      
      securityService.logClinicalAction('access_denied', 'system', currentUser?.id, { 
        resource, 
        action, 
        username 
      });
      
      throw new Error(`Access denied: ${username} cannot ${action} ${resource}`);
    }
  }

  /**
   * Get filtered data based on user permissions
   */
  filterDataByPermissions<T>(data: T[], resourceType: AccessPermission['resource']): T[] {
    if (this.canPerformAction(resourceType, 'admin')) {
      return data; // Admin sees everything
    }

    if (this.canPerformAction(resourceType, 'read')) {
      return data; // Can read, return all data
    }

    return []; // No read permission
  }
}

// Singleton instances
export const userManagementService = new UserManagementService();
export const accessControlService = new AccessControlService();

// Convenience functions
export const createPractitioner = (profile: Omit<PractitionerProfile, 'id' | 'dateCreated' | 'isActive'>) =>
  userManagementService.createPractitioner(profile);

export const getCurrentUser = () => userManagementService.getCurrentPractitioner();
export const hasPermission = (resource: AccessPermission['resource'], action: AccessPermission['actions'][0]) =>
  accessControlService.canPerformAction(resource, action);
