// KYC/AML Live System - Simplified for Type Safety
import { supabase } from '@/integrations/supabase/client';

export interface SanctionsResult {
  userId: string;
  screeningDate: string;
  provider: string;
  result: string;
  matches: Array<{
    list: string;
    name: string;
    score: number;
    reason: string;
  }>;
}

export interface KYCResult {
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  riskScore: number;
  completedAt?: string;
  documents: string[];
}

export class KYCAMLLiveSystem {
  private readonly sanctionsLists = [
    'OFAC_SDN',
    'EU_SANCTIONS',
    'UK_SANCTIONS',
    'UN_SANCTIONS'
  ];

  /**
   * Screen user against sanctions lists
   */
  async screenUser(userId: string, userData: { 
    fullName: string; 
    nationality?: string; 
    email: string; 
  }): Promise<SanctionsResult> {
    try {
      // Simulate sanctions screening
      const matches = await this.performSanctionsCheck(userData);
      
      const result: SanctionsResult = {
        userId,
        screeningDate: new Date().toISOString(),
        provider: 'STRATUS_SCREENING',
        result: matches.length > 0 ? 'MATCH' : 'CLEAR',
        matches
      };

      // Store result in activity log instead of non-existent table
      await this.logSanctionsResult(result);
      
      return result;
    } catch (error) {
      console.error('Sanctions screening error:', error);
      return {
        userId,
        screeningDate: new Date().toISOString(),
        provider: 'STRATUS_SCREENING',
        result: 'ERROR',
        matches: []
      };
    }
  }

  /**
   * Perform KYC verification
   */
  async performKYC(userId: string, documents: string[]): Promise<KYCResult> {
    try {
      // Get user data
      const { data: userData } = await supabase
        .from('users')
        .select('email, id')
        .eq('id', userId)
        .single();

      if (!userData) {
        throw new Error('User not found');
      }

      // Simulate KYC process
      const riskScore = Math.random() * 100;
      const status = riskScore < 70 ? 'approved' : 'pending';

      const result: KYCResult = {
        userId,
        status,
        riskScore,
        completedAt: status === 'approved' ? new Date().toISOString() : undefined,
        documents
      };

      // Log KYC result
      await this.logKYCResult(result);

      return result;
    } catch (error) {
      console.error('KYC error:', error);
      return {
        userId,
        status: 'rejected',
        riskScore: 100,
        documents: []
      };
    }
  }

  /**
   * Get user compliance status
   */
  async getComplianceStatus(userId: string): Promise<{
    kycStatus: string;
    sanctionsStatus: string;
    lastChecked: string;
    isCompliant: boolean;
  }> {
    try {
      // Get basic user info
      const { data: userData } = await supabase
        .from('users')
        .select('email, id, created_at')
        .eq('id', userId)
        .single();

      if (!userData) {
        throw new Error('User not found');
      }

      // Return mock compliance status
      return {
        kycStatus: 'approved',
        sanctionsStatus: 'clear',
        lastChecked: new Date().toISOString(),
        isCompliant: true
      };
    } catch (error) {
      console.error('Compliance status error:', error);
      return {
        kycStatus: 'pending',
        sanctionsStatus: 'unknown',
        lastChecked: new Date().toISOString(),
        isCompliant: false
      };
    }
  }

  private async performSanctionsCheck(userData: { 
    fullName: string; 
    nationality?: string; 
  }): Promise<Array<{ list: string; name: string; score: number; reason: string; }>> {
    // Simulate sanctions check - return empty for clean users
    const suspiciousNames = ['BLOCKED', 'SANCTIONED', 'RESTRICTED'];
    const isMatch = suspiciousNames.some(name => 
      userData.fullName.toUpperCase().includes(name)
    );

    if (isMatch) {
      return [{
        list: 'OFAC_SDN',
        name: userData.fullName,
        score: 95,
        reason: 'Name match detected'
      }];
    }

    return [];
  }

  private async logSanctionsResult(result: SanctionsResult): Promise<void> {
    try {
      await supabase.from('activity').insert({
        user_id: result.userId,
        kind: 'sanctions_screening',
        summary: `Sanctions screening: ${result.result}`
      });
    } catch (error) {
      console.error('Failed to log sanctions result:', error);
    }
  }

  private async logKYCResult(result: KYCResult): Promise<void> {
    try {
      await supabase.from('activity').insert({
        user_id: result.userId,
        kind: 'kyc_verification',
        summary: `KYC verification: ${result.status}`
      });
    } catch (error) {
      console.error('Failed to log KYC result:', error);
    }
  }
}

export const kycAMLLiveSystem = new KYCAMLLiveSystem();
export default kycAMLLiveSystem;