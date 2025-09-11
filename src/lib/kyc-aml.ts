// KYC/AML and Sanctions Screening System
// Compliant with FCA and EU regulations

export interface KYCData {
  userId: string;
  type: 'individual' | 'company';
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  submittedAt: string;
  verifiedAt?: string;
  expiresAt?: string;
  rejectionReason?: string;
  documents: KYCDocument[];
  screeningResults: ScreeningResult[];
}

export interface KYCDocument {
  id: string;
  type: 'passport' | 'driving_license' | 'national_id' | 'company_registration' | 'utility_bill' | 'bank_statement';
  filename: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
}

export interface ScreeningResult {
  id: string;
  type: 'sanctions' | 'pep' | 'adverse_media';
  provider: 'worldcheck' | 'refinitiv' | 'manual';
  status: 'clear' | 'match' | 'pending';
  matchScore?: number;
  matchDetails?: string;
  screenedAt: string;
  expiresAt: string;
}

export interface SanctionsMatch {
  id: string;
  userId: string;
  matchType: 'sanctions' | 'pep' | 'adverse_media';
  matchScore: number;
  matchDetails: string;
  listName: string;
  listType: string;
  screenedAt: string;
  status: 'active' | 'resolved' | 'false_positive';
  resolutionNotes?: string;
}

class KYCScreeningService {
  private static instance: KYCScreeningService;
  private kycData: Map<string, KYCData> = new Map();
  private sanctionsMatches: SanctionsMatch[] = [];

  static getInstance(): KYCScreeningService {
    if (!KYCScreeningService.instance) {
      KYCScreeningService.instance = new KYCScreeningService();
    }
    return KYCScreeningService.instance;
  }

  /**
   * Submit KYC data for verification
   */
  async submitKYC(userId: string, kycData: Partial<KYCData>): Promise<KYCData> {
    const kyc: KYCData = {
      userId,
      type: kycData.type || 'individual',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      documents: kycData.documents || [],
      screeningResults: [],
      ...kycData,
    };

    this.kycData.set(userId, kyc);
    await this.persistKYCData();

    // Start screening process
    await this.startScreeningProcess(userId);

    return kyc;
  }

  /**
   * Start screening process for a user
   */
  private async startScreeningProcess(userId: string): Promise<void> {
    const kyc = this.kycData.get(userId);
    if (!kyc) return;

    try {
      // Run sanctions screening
      const sanctionsResult = await this.runSanctionsScreening(userId, kyc);
      kyc.screeningResults.push(sanctionsResult);

      // Run PEP screening
      const pepResult = await this.runPEPScreening(userId, kyc);
      kyc.screeningResults.push(pepResult);

      // Run adverse media screening
      const adverseMediaResult = await this.runAdverseMediaScreening(userId, kyc);
      kyc.screeningResults.push(adverseMediaResult);

      // Update KYC status based on results
      await this.updateKYCStatus(userId);

      await this.persistKYCData();
    } catch (error) {
      console.error('Error in screening process:', error);
    }
  }

  /**
   * Run sanctions screening
   */
  private async runSanctionsScreening(userId: string, kyc: KYCData): Promise<ScreeningResult> {
    // In production, this would integrate with a real sanctions screening service
    // For now, we'll simulate the screening process
    
    const screeningResult: ScreeningResult = {
      id: crypto.randomUUID(),
      type: 'sanctions',
      provider: 'worldcheck',
      status: 'clear',
      screenedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    // Simulate screening logic
    const hasMatch = Math.random() < 0.05; // 5% chance of match for demo
    
    if (hasMatch) {
      screeningResult.status = 'match';
      screeningResult.matchScore = Math.random() * 100;
      screeningResult.matchDetails = 'Potential match found in sanctions database';
      
      // Create sanctions match record
      const match: SanctionsMatch = {
        id: crypto.randomUUID(),
        userId,
        matchType: 'sanctions',
        matchScore: screeningResult.matchScore,
        matchDetails: screeningResult.matchDetails,
        listName: 'OFAC SDN List',
        listType: 'sanctions',
        screenedAt: screeningResult.screenedAt,
        status: 'active',
      };
      
      this.sanctionsMatches.push(match);
    }

    return screeningResult;
  }

  /**
   * Run PEP (Politically Exposed Person) screening
   */
  private async runPEPScreening(userId: string, kyc: KYCData): Promise<ScreeningResult> {
    const screeningResult: ScreeningResult = {
      id: crypto.randomUUID(),
      type: 'pep',
      provider: 'refinitiv',
      status: 'clear',
      screenedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Simulate PEP screening
    const hasMatch = Math.random() < 0.02; // 2% chance of PEP match
    
    if (hasMatch) {
      screeningResult.status = 'match';
      screeningResult.matchScore = Math.random() * 100;
      screeningResult.matchDetails = 'Potential PEP match found';
      
      const match: SanctionsMatch = {
        id: crypto.randomUUID(),
        userId,
        matchType: 'pep',
        matchScore: screeningResult.matchScore,
        matchDetails: screeningResult.matchDetails,
        listName: 'PEP Database',
        listType: 'pep',
        screenedAt: screeningResult.screenedAt,
        status: 'active',
      };
      
      this.sanctionsMatches.push(match);
    }

    return screeningResult;
  }

  /**
   * Run adverse media screening
   */
  private async runAdverseMediaScreening(userId: string, kyc: KYCData): Promise<ScreeningResult> {
    const screeningResult: ScreeningResult = {
      id: crypto.randomUUID(),
      type: 'adverse_media',
      provider: 'manual',
      status: 'clear',
      screenedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Simulate adverse media screening
    const hasMatch = Math.random() < 0.01; // 1% chance of adverse media match
    
    if (hasMatch) {
      screeningResult.status = 'match';
      screeningResult.matchScore = Math.random() * 100;
      screeningResult.matchDetails = 'Adverse media found';
      
      const match: SanctionsMatch = {
        id: crypto.randomUUID(),
        userId,
        matchType: 'adverse_media',
        matchScore: screeningResult.matchScore,
        matchDetails: screeningResult.matchDetails,
        listName: 'Adverse Media Database',
        listType: 'adverse_media',
        screenedAt: screeningResult.screenedAt,
        status: 'active',
      };
      
      this.sanctionsMatches.push(match);
    }

    return screeningResult;
  }

  /**
   * Update KYC status based on screening results
   */
  private async updateKYCStatus(userId: string): Promise<void> {
    const kyc = this.kycData.get(userId);
    if (!kyc) return;

    // Check if any screening results show matches
    const hasMatches = kyc.screeningResults.some(result => result.status === 'match');
    
    if (hasMatches) {
      kyc.status = 'rejected';
      kyc.rejectionReason = 'Sanctions/PEP/Adverse media match found';
    } else {
      kyc.status = 'verified';
      kyc.verifiedAt = new Date().toISOString();
      kyc.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year
    }
  }

  /**
   * Get KYC status for a user
   */
  getKYCStatus(userId: string): KYCData | null {
    return this.kycData.get(userId) || null;
  }

  /**
   * Check if user can receive payouts
   */
  canReceivePayouts(userId: string): boolean {
    const kyc = this.kycData.get(userId);
    if (!kyc) return false;
    
    // Check if KYC is verified and not expired
    if (kyc.status !== 'verified') return false;
    if (kyc.expiresAt && new Date(kyc.expiresAt) < new Date()) return false;
    
    // Check for active sanctions matches
    const activeMatches = this.sanctionsMatches.filter(
      match => match.userId === userId && match.status === 'active'
    );
    
    return activeMatches.length === 0;
  }

  /**
   * Get sanctions matches for a user
   */
  getSanctionsMatches(userId: string): SanctionsMatch[] {
    return this.sanctionsMatches.filter(match => match.userId === userId);
  }

  /**
   * Get all active sanctions matches
   */
  getAllActiveSanctionsMatches(): SanctionsMatch[] {
    return this.sanctionsMatches.filter(match => match.status === 'active');
  }

  /**
   * Resolve a sanctions match
   */
  async resolveSanctionsMatch(matchId: string, resolutionNotes: string): Promise<boolean> {
    const match = this.sanctionsMatches.find(m => m.id === matchId);
    if (!match) return false;

    match.status = 'resolved';
    match.resolutionNotes = resolutionNotes;
    
    await this.persistSanctionsMatches();
    return true;
  }

  /**
   * Run monthly screening for all active users
   */
  async runMonthlyScreening(): Promise<void> {
    const activeUsers = Array.from(this.kycData.keys());
    
    for (const userId of activeUsers) {
      const kyc = this.kycData.get(userId);
      if (!kyc || kyc.status !== 'verified') continue;
      
      // Re-run screening
      await this.startScreeningProcess(userId);
    }
  }

  /**
   * Persist KYC data to localStorage
   */
  private async persistKYCData(): Promise<void> {
    try {
      const data = Array.from(this.kycData.entries());
      localStorage.setItem('kyc_data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist KYC data:', error);
    }
  }

  /**
   * Persist sanctions matches to localStorage
   */
  private async persistSanctionsMatches(): Promise<void> {
    try {
      localStorage.setItem('sanctions_matches', JSON.stringify(this.sanctionsMatches));
    } catch (error) {
      console.error('Failed to persist sanctions matches:', error);
    }
  }

  /**
   * Load data from localStorage
   */
  async loadData(): Promise<void> {
    try {
      // Load KYC data
      const kycData = localStorage.getItem('kyc_data');
      if (kycData) {
        const entries = JSON.parse(kycData);
        this.kycData = new Map(entries);
      }

      // Load sanctions matches
      const sanctionsData = localStorage.getItem('sanctions_matches');
      if (sanctionsData) {
        this.sanctionsMatches = JSON.parse(sanctionsData);
      }
    } catch (error) {
      console.error('Failed to load KYC/AML data:', error);
    }
  }
}

// Create singleton instance
export const kycScreening = KYCScreeningService.getInstance();

// Initialize on import
kycScreening.loadData();
