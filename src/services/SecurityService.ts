// Security Service
// Data encryption and audit logging for clinical data protection

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  resourceType: 'assessment' | 'treatment' | 'patient_data' | 'workshop_content' | 'system';
  resourceId?: string;
  dataHash?: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

export interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  iterations: number;
}

export class SecurityService {
  private readonly config: EncryptionConfig = {
    algorithm: 'AES-GCM',
    keyLength: 256,
    iterations: 100000
  };
  
  private sessionId: string;
  private encryptionKey: CryptoKey | null = null;
  private auditLogKey = 'acu_audit_log';

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeEncryption();
  }

  /**
   * Encrypt sensitive data for storage
   */
  async encryptData(data: any): Promise<string> {
    try {
      if (!this.encryptionKey) {
        await this.initializeEncryption();
      }

      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonString);

      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt data
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        this.encryptionKey!,
        dataBuffer
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('❌ Encryption failed:', error);
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  /**
   * Decrypt data from storage
   */
  async decryptData(encryptedData: string): Promise<any> {
    try {
      if (!this.encryptionKey) {
        await this.initializeEncryption();
      }

      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encryptedBuffer = combined.slice(12);

      // Decrypt data
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        this.encryptionKey!,
        encryptedBuffer
      );

      // Convert back to JSON
      const decoder = new TextDecoder();
      const jsonString = decoder.decode(decryptedBuffer);
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('❌ Decryption failed:', error);
      throw new Error(`Decryption failed: ${error}`);
    }
  }

  /**
   * Securely store data with encryption
   */
  async secureStore(key: string, data: any): Promise<void> {
    try {
      const encryptedData = await this.encryptData(data);
      localStorage.setItem(`secure_${key}`, encryptedData);
      
      this.logAuditEvent('data_store', 'patient_data', key, true);
      console.log('🔒 Data securely stored');
    } catch (error) {
      this.logAuditEvent('data_store', 'patient_data', key, false, error.message);
      throw error;
    }
  }

  /**
   * Securely retrieve data with decryption
   */
  async secureRetrieve(key: string): Promise<any> {
    try {
      const encryptedData = localStorage.getItem(`secure_${key}`);
      if (!encryptedData) {
        return null;
      }

      const decryptedData = await this.decryptData(encryptedData);
      
      this.logAuditEvent('data_retrieve', 'patient_data', key, true);
      return decryptedData;
    } catch (error) {
      this.logAuditEvent('data_retrieve', 'patient_data', key, false, error.message);
      console.error('❌ Secure retrieval failed:', error);
      return null;
    }
  }

  /**
   * Log clinical action for audit trail
   */
  logClinicalAction(
    action: string,
    resourceType: AuditLogEntry['resourceType'],
    resourceId?: string,
    data?: any,
    userId: string = 'anonymous'
  ): void {
    const entry: AuditLogEntry = {
      id: this.generateAuditId(),
      timestamp: new Date().toISOString(),
      action,
      userId,
      resourceType,
      resourceId,
      dataHash: data ? this.hashData(data) : undefined,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      success: true
    };

    this.appendToAuditLog(entry);
  }

  /**
   * Log system event
   */
  logSystemEvent(event: string, details: any): void {
    const entry: AuditLogEntry = {
      id: this.generateAuditId(),
      timestamp: new Date().toISOString(),
      action: event,
      userId: 'system',
      resourceType: 'system',
      dataHash: this.hashData(details),
      sessionId: this.sessionId,
      success: true
    };

    this.appendToAuditLog(entry);
  }

  /**
   * Log error event
   */
  logError(error: Error, context: string): void {
    const entry: AuditLogEntry = {
      id: this.generateAuditId(),
      timestamp: new Date().toISOString(),
      action: 'error_occurred',
      userId: 'system',
      resourceType: 'system',
      sessionId: this.sessionId,
      success: false,
      errorMessage: `${context}: ${error.message}`
    };

    this.appendToAuditLog(entry);
  }

  /**
   * Get audit log entries
   */
  getAuditLog(limit: number = 100): AuditLogEntry[] {
    try {
      const stored = localStorage.getItem(this.auditLogKey);
      if (!stored) return [];

      const entries: AuditLogEntry[] = JSON.parse(stored);
      return entries
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('❌ Failed to retrieve audit log:', error);
      return [];
    }
  }

  /**
   * Clear audit log (admin function)
   */
  clearAuditLog(): void {
    localStorage.removeItem(this.auditLogKey);
    this.logSystemEvent('audit_log_cleared', { cleared_by: 'admin' });
    console.log('🗑️ Audit log cleared');
  }

  /**
   * Export audit log for compliance
   */
  exportAuditLog(): string {
    const entries = this.getAuditLog(10000); // Get all entries
    
    const exportData = {
      exportDate: new Date().toISOString(),
      totalEntries: entries.length,
      entries: entries,
      version: '1.0'
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Get security statistics
   */
  getSecurityStats(): {
    auditEntries: number;
    sessionId: string;
    encryptionEnabled: boolean;
    lastActivity: string;
  } {
    const auditEntries = this.getAuditLog().length;
    const lastEntry = this.getAuditLog(1)[0];

    return {
      auditEntries,
      sessionId: this.sessionId,
      encryptionEnabled: this.encryptionKey !== null,
      lastActivity: lastEntry?.timestamp || 'No activity recorded'
    };
  }

  /**
   * Private helper methods
   */
  private async initializeEncryption(): Promise<void> {
    try {
      // Generate or retrieve encryption key
      const keyMaterial = await this.getOrCreateKeyMaterial();
      
      this.encryptionKey = await crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );

      console.log('🔐 Encryption initialized');
    } catch (error) {
      console.error('❌ Encryption initialization failed:', error);
      // Continue without encryption in case of failure
    }
  }

  private async getOrCreateKeyMaterial(): Promise<ArrayBuffer> {
    // For demo purposes, use a deterministic key
    // In production, this should be user-derived or securely generated
    const password = 'AcuReference_Clinical_Data_Protection_2024';
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    // Use PBKDF2 to derive key from password
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const salt = encoder.encode('AcuRef_Salt_v1'); // Static salt for consistency

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: this.config.iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: this.config.keyLength },
      true,
      ['encrypt', 'decrypt']
    );

    return await crypto.subtle.exportKey('raw', derivedKey);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private generateAuditId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private hashData(data: any): string {
    // Simple hash for audit purposes (not cryptographic)
    const jsonString = JSON.stringify(data);
    let hash = 0;
    
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }

  private appendToAuditLog(entry: AuditLogEntry): void {
    try {
      const existing = this.getAuditLog(10000); // Get all entries
      existing.unshift(entry); // Add to beginning
      
      // Keep only last 1000 entries to prevent storage overflow
      const trimmed = existing.slice(0, 1000);
      
      localStorage.setItem(this.auditLogKey, JSON.stringify(trimmed));
    } catch (error) {
      console.error('❌ Failed to append audit log:', error);
    }
  }
}

// Singleton instance
export const securityService = new SecurityService();

// Convenience functions
export const encryptData = (data: any) => securityService.encryptData(data);
export const decryptData = (encryptedData: string) => securityService.decryptData(encryptedData);
export const secureStore = (key: string, data: any) => securityService.secureStore(key, data);
export const secureRetrieve = (key: string) => securityService.secureRetrieve(key);
export const logClinicalAction = (action: string, resourceType: any, resourceId?: string, data?: any) =>
  securityService.logClinicalAction(action, resourceType, resourceId, data);
