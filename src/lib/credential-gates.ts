// Credential Hard Gates with Expiry Management
// FCA Compliant Aviation Platform

export interface Credential {
  id: string;
  type: 'pilot_license' | 'medical_certificate' | 'aoc' | 'insurance' | 'maintenance_letter';
  holderId: string;
  holderName: string;
  holderType: 'pilot' | 'crew' | 'operator';
  number: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'expiring_soon' | 'suspended';
  reminderSent: boolean;
  lastChecked: string;
  auditHash: string;
}

export interface CredentialCheck {
  credentialId: string;
  checkType: 'expiry' | 'validity' | 'compliance';
  result: 'pass' | 'fail' | 'warning';
  message: string;
  checkedAt: string;
  checkedBy: string;
  auditHash: string;
}

export class CredentialGates {
  private static credentials: Map<string, Credential> = new Map();
  private static checks: Map<string, CredentialCheck[]> = new Map();

  static addCredential(credential: Credential): void {
    this.credentials.set(credential.id, credential);
    this.updateCredentialStatus(credential.id);
  }

  static getCredential(credentialId: string): Credential | null {
    return this.credentials.get(credentialId) || null;
  }

  static getCredentialsByHolder(holderId: string): Credential[] {
    return Array.from(this.credentials.values())
      .filter(cred => cred.holderId === holderId);
  }

  static checkCredentialExpiry(credentialId: string): CredentialCheck {
    const credential = this.getCredential(credentialId);
    if (!credential) {
      return {
        credentialId,
        checkType: 'expiry',
        result: 'fail',
        message: 'Credential not found',
        checkedAt: new Date().toISOString(),
        checkedBy: 'system',
        auditHash: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    }

    const now = new Date();
    const expiryDate = new Date(credential.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let result: 'pass' | 'fail' | 'warning';
    let message: string;

    if (daysUntilExpiry < 0) {
      result = 'fail';
      message = 'Credential has expired';
      credential.status = 'expired';
    } else if (daysUntilExpiry <= 7) {
      result = 'warning';
      message = `Credential expires in ${daysUntilExpiry} days`;
      credential.status = 'expiring_soon';
    } else if (daysUntilExpiry <= 30) {
      result = 'warning';
      message = `Credential expires in ${daysUntilExpiry} days`;
      credential.status = 'valid';
    } else {
      result = 'pass';
      message = 'Credential is valid';
      credential.status = 'valid';
    }

    const check: CredentialCheck = {
      credentialId,
      checkType: 'expiry',
      result,
      message,
      checkedAt: new Date().toISOString(),
      checkedBy: 'system',
      auditHash: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    this.addCheck(credentialId, check);
    return check;
  }

  static checkAllCredentials(): CredentialCheck[] {
    const allChecks: CredentialCheck[] = [];
    
    this.credentials.forEach((credential, credentialId) => {
      const check = this.checkCredentialExpiry(credentialId);
      allChecks.push(check);
    });

    return allChecks;
  }

  static getExpiringCredentials(days: number = 30): Credential[] {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return Array.from(this.credentials.values())
      .filter(cred => {
        const expiryDate = new Date(cred.expiryDate);
        return expiryDate <= cutoffDate && expiryDate > now;
      });
  }

  static getExpiredCredentials(): Credential[] {
    const now = new Date();
    return Array.from(this.credentials.values())
      .filter(cred => new Date(cred.expiryDate) < now);
  }

  static canPerformAction(holderId: string, actionType: string): { allowed: boolean; reason?: string } {
    const credentials = this.getCredentialsByHolder(holderId);
    const expiredCredentials = credentials.filter(cred => cred.status === 'expired');
    const expiringCredentials = credentials.filter(cred => cred.status === 'expiring_soon');

    // Block actions if any critical credentials are expired
    if (expiredCredentials.length > 0) {
      return {
        allowed: false,
        reason: `Action blocked: ${expiredCredentials.length} expired credential(s)`
      };
    }

    // Warn for expiring credentials but allow action
    if (expiringCredentials.length > 0) {
      return {
        allowed: true,
        reason: `Warning: ${expiringCredentials.length} credential(s) expiring soon`
      };
    }

    return { allowed: true };
  }

  static sendReminder(credentialId: string): boolean {
    const credential = this.getCredential(credentialId);
    if (!credential || credential.reminderSent) {
      return false;
    }

    // In production, this would send actual notifications
    console.log(`Reminder sent for credential ${credentialId} (${credential.type})`);
    
    credential.reminderSent = true;
    credential.lastChecked = new Date().toISOString();
    
    return true;
  }

  static sendBulkReminders(): number {
    const expiringCredentials = this.getExpiringCredentials(30);
    let remindersSent = 0;

    expiringCredentials.forEach(cred => {
      if (this.sendReminder(cred.id)) {
        remindersSent++;
      }
    });

    return remindersSent;
  }

  static updateCredentialStatus(credentialId: string): void {
    const credential = this.getCredential(credentialId);
    if (!credential) return;

    const now = new Date();
    const expiryDate = new Date(credential.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      credential.status = 'expired';
    } else if (daysUntilExpiry <= 7) {
      credential.status = 'expiring_soon';
    } else {
      credential.status = 'valid';
    }

    credential.lastChecked = new Date().toISOString();
  }

  private static addCheck(credentialId: string, check: CredentialCheck): void {
    if (!this.checks.has(credentialId)) {
      this.checks.set(credentialId, []);
    }
    this.checks.get(credentialId)!.push(check);
  }

  static getCredentialChecks(credentialId: string): CredentialCheck[] {
    return this.checks.get(credentialId) || [];
  }

  static generateAuditLog(credential: Credential, action: string): Record<string, unknown> {
    return {
      event: 'credential_action',
      credentialId: credential.id,
      holderId: credential.holderId,
      holderName: credential.holderName,
      holderType: credential.holderType,
      credentialType: credential.type,
      action,
      status: credential.status,
      expiryDate: credential.expiryDate,
      timestamp: new Date().toISOString(),
      auditHash: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  // Demo data for testing
  static initializeDemoData(): void {
    const demoCredentials: Credential[] = [
      {
        id: 'PILOT_001',
        type: 'pilot_license',
        holderId: 'PILOT_123',
        holderName: 'John Smith',
        holderType: 'pilot',
        number: 'PPL-123456',
        issuedBy: 'CAA',
        issuedDate: '2023-01-15',
        expiryDate: '2024-12-31',
        status: 'valid',
        reminderSent: false,
        lastChecked: new Date().toISOString(),
        auditHash: 'audit_demo_001'
      },
      {
        id: 'MEDICAL_001',
        type: 'medical_certificate',
        holderId: 'PILOT_123',
        holderName: 'John Smith',
        holderType: 'pilot',
        number: 'MED-789012',
        issuedBy: 'AME',
        issuedDate: '2023-06-01',
        expiryDate: '2024-06-01',
        status: 'expiring_soon',
        reminderSent: false,
        lastChecked: new Date().toISOString(),
        auditHash: 'audit_demo_002'
      },
      {
        id: 'AOC_001',
        type: 'aoc',
        holderId: 'OPERATOR_456',
        holderName: 'Elite Aviation',
        holderType: 'operator',
        number: 'AOC-ELITE-001',
        issuedBy: 'EASA',
        issuedDate: '2022-01-01',
        expiryDate: '2025-01-01',
        status: 'valid',
        reminderSent: false,
        lastChecked: new Date().toISOString(),
        auditHash: 'audit_demo_003'
      }
    ];

    demoCredentials.forEach(cred => this.addCredential(cred));
  }
}
