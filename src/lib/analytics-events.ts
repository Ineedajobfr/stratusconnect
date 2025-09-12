// Analytics Events - Universal Compliance Funnel
// FCA Compliant Aviation Platform

export interface AnalyticsEvent {
  eventId: string;
  eventType: string;
  userId: string;
  timestamp: string;
  properties: Record<string, any>;
  sessionId?: string;
}

export interface DealFunnelEvent extends AnalyticsEvent {
  eventType: 'rfq_posted' | 'quote_submitted' | 'quote_accepted' | 'deal_completed' | 'deposit_paid';
  dealId: string;
  route?: string;
  aircraft?: string;
  amount?: number;
  currency?: string;
}

export interface ComplianceEvent extends AnalyticsEvent {
  eventType: 'deposit_gate_shown' | 'deposit_intent_created' | 'contact_unlocked' | 'evidence_bundle_exported' | 'receipt_downloaded' | 'signed_quote_generated';
  dealId: string;
  complianceFeature: string;
}

export interface PerformanceEvent extends AnalyticsEvent {
  eventType: 'merit_points_awarded' | 'league_promotion' | 'league_demotion' | 'continuity_streak' | 'briefing_completed';
  pointsAwarded?: number;
  leagueName?: string;
  streakCount?: number;
}

class AnalyticsEventTracker {
  private static instance: AnalyticsEventTracker;
  private events: AnalyticsEvent[] = [];

  private constructor() {}

  public static getInstance(): AnalyticsEventTracker {
    if (!AnalyticsEventTracker.instance) {
      AnalyticsEventTracker.instance = new AnalyticsEventTracker();
    }
    return AnalyticsEventTracker.instance;
  }

  /**
   * Track deal funnel events
   */
  public trackDealFunnel(event: Omit<DealFunnelEvent, 'eventId' | 'timestamp'>): void {
    const analyticsEvent: DealFunnelEvent = {
      ...event,
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString()
    };

    this.events.push(analyticsEvent);
    this.logEvent(analyticsEvent);
  }

  /**
   * Track compliance events
   */
  public trackCompliance(event: Omit<ComplianceEvent, 'eventId' | 'timestamp'>): void {
    const analyticsEvent: ComplianceEvent = {
      ...event,
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString()
    };

    this.events.push(analyticsEvent);
    this.logEvent(analyticsEvent);
  }

  /**
   * Track performance programme events
   */
  public trackPerformance(event: Omit<PerformanceEvent, 'eventId' | 'timestamp'>): void {
    const analyticsEvent: PerformanceEvent = {
      ...event,
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString()
    };

    this.events.push(analyticsEvent);
    this.logEvent(analyticsEvent);
  }

  /**
   * Track custom events
   */
  public trackCustom(event: Omit<AnalyticsEvent, 'eventId' | 'timestamp'>): void {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString()
    };

    this.events.push(analyticsEvent);
    this.logEvent(analyticsEvent);
  }

  /**
   * Get events by type
   */
  public getEventsByType(eventType: string): AnalyticsEvent[] {
    return this.events.filter(event => event.eventType === eventType);
  }

  /**
   * Get events for a specific user
   */
  public getEventsByUser(userId: string): AnalyticsEvent[] {
    return this.events.filter(event => event.userId === userId);
  }

  /**
   * Get events for a specific deal
   */
  public getEventsByDeal(dealId: string): AnalyticsEvent[] {
    return this.events.filter(event => 
      'dealId' in event.properties && event.properties.dealId === dealId
    );
  }

  /**
   * Get funnel conversion metrics
   */
  public getFunnelMetrics(): {
    rfqPosted: number;
    quotesSubmitted: number;
    quotesAccepted: number;
    dealsCompleted: number;
    depositPaid: number;
    conversionRates: {
      rfqToQuote: number;
      quoteToAcceptance: number;
      acceptanceToCompletion: number;
      completionToDeposit: number;
    };
  } {
    const rfqPosted = this.getEventsByType('rfq_posted').length;
    const quotesSubmitted = this.getEventsByType('quote_submitted').length;
    const quotesAccepted = this.getEventsByType('quote_accepted').length;
    const dealsCompleted = this.getEventsByType('deal_completed').length;
    const depositPaid = this.getEventsByType('deposit_paid').length;

    return {
      rfqPosted,
      quotesSubmitted,
      quotesAccepted,
      dealsCompleted,
      depositPaid,
      conversionRates: {
        rfqToQuote: rfqPosted > 0 ? (quotesSubmitted / rfqPosted) * 100 : 0,
        quoteToAcceptance: quotesSubmitted > 0 ? (quotesAccepted / quotesSubmitted) * 100 : 0,
        acceptanceToCompletion: quotesAccepted > 0 ? (dealsCompleted / quotesAccepted) * 100 : 0,
        completionToDeposit: dealsCompleted > 0 ? (depositPaid / dealsCompleted) * 100 : 0,
      }
    };
  }

  /**
   * Get compliance feature usage
   */
  public getComplianceMetrics(): {
    depositGateShown: number;
    depositIntentCreated: number;
    contactUnlocked: number;
    evidenceBundleExported: number;
    receiptDownloaded: number;
    signedQuoteGenerated: number;
  } {
    return {
      depositGateShown: this.getEventsByType('deposit_gate_shown').length,
      depositIntentCreated: this.getEventsByType('deposit_intent_created').length,
      contactUnlocked: this.getEventsByType('contact_unlocked').length,
      evidenceBundleExported: this.getEventsByType('evidence_bundle_exported').length,
      receiptDownloaded: this.getEventsByType('receipt_downloaded').length,
      signedQuoteGenerated: this.getEventsByType('signed_quote_generated').length,
    };
  }

  /**
   * Clear all events (for testing)
   */
  public clearEvents(): void {
    this.events = [];
  }

  /**
   * Export events for analysis
   */
  public exportEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logEvent(event: AnalyticsEvent): void {
    console.log(`📊 Analytics Event: ${event.eventType}`, {
      eventId: event.eventId,
      userId: event.userId,
      timestamp: event.timestamp,
      properties: event.properties
    });
  }
}

export const analyticsTracker = AnalyticsEventTracker.getInstance();

// Convenience functions for common events
export const trackRFQPosted = (userId: string, dealId: string, route: string, aircraft: string, amount: number, currency: string) => {
  analyticsTracker.trackDealFunnel({
    eventType: 'rfq_posted',
    userId,
    dealId,
    route,
    aircraft,
    amount,
    currency,
    properties: { dealId, route, aircraft, amount, currency }
  });
};

export const trackQuoteSubmitted = (userId: string, dealId: string, route: string, aircraft: string, amount: number, currency: string) => {
  analyticsTracker.trackDealFunnel({
    eventType: 'quote_submitted',
    userId,
    dealId,
    route,
    aircraft,
    amount,
    currency,
    properties: { dealId, route, aircraft, amount, currency }
  });
};

export const trackQuoteAccepted = (userId: string, dealId: string, route: string, aircraft: string, amount: number, currency: string) => {
  analyticsTracker.trackDealFunnel({
    eventType: 'quote_accepted',
    userId,
    dealId,
    route,
    aircraft,
    amount,
    currency,
    properties: { dealId, route, aircraft, amount, currency }
  });
};

export const trackDealCompleted = (userId: string, dealId: string, route: string, aircraft: string, amount: number, currency: string) => {
  analyticsTracker.trackDealFunnel({
    eventType: 'deal_completed',
    userId,
    dealId,
    route,
    aircraft,
    amount,
    currency,
    properties: { dealId, route, aircraft, amount, currency }
  });
};

export const trackDepositPaid = (userId: string, dealId: string, amount: number, currency: string) => {
  analyticsTracker.trackDealFunnel({
    eventType: 'deposit_paid',
    userId,
    dealId,
    amount,
    currency,
    properties: { dealId, amount, currency }
  });
};

export const trackDepositGateShown = (userId: string, dealId: string) => {
  analyticsTracker.trackCompliance({
    eventType: 'deposit_gate_shown',
    userId,
    dealId,
    complianceFeature: 'deposit_before_contact',
    properties: { dealId, complianceFeature: 'deposit_before_contact' }
  });
};

export const trackDepositIntentCreated = (userId: string, dealId: string, amount: number, currency: string) => {
  analyticsTracker.trackCompliance({
    eventType: 'deposit_intent_created',
    userId,
    dealId,
    complianceFeature: 'deposit_before_contact',
    properties: { dealId, amount, currency, complianceFeature: 'deposit_before_contact' }
  });
};

export const trackContactUnlocked = (userId: string, dealId: string) => {
  analyticsTracker.trackCompliance({
    eventType: 'contact_unlocked',
    userId,
    dealId,
    complianceFeature: 'deposit_before_contact',
    properties: { dealId, complianceFeature: 'deposit_before_contact' }
  });
};

export const trackEvidenceBundleExported = (userId: string, dealId: string) => {
  analyticsTracker.trackCompliance({
    eventType: 'evidence_bundle_exported',
    userId,
    dealId,
    complianceFeature: 'evidence_bundle_export',
    properties: { dealId, complianceFeature: 'evidence_bundle_export' }
  });
};

export const trackReceiptDownloaded = (userId: string, dealId: string) => {
  analyticsTracker.trackCompliance({
    eventType: 'receipt_downloaded',
    userId,
    dealId,
    complianceFeature: 'immutable_receipts',
    properties: { dealId, complianceFeature: 'immutable_receipts' }
  });
};

export const trackSignedQuoteGenerated = (userId: string, dealId: string) => {
  analyticsTracker.trackCompliance({
    eventType: 'signed_quote_generated',
    userId,
    dealId,
    complianceFeature: 'signed_quote_pdfs',
    properties: { dealId, complianceFeature: 'signed_quote_pdfs' }
  });
};

export const trackMeritPointsAwarded = (userId: string, pointsAwarded: number, reason: string) => {
  analyticsTracker.trackPerformance({
    eventType: 'merit_points_awarded',
    userId,
    pointsAwarded,
    properties: { pointsAwarded, reason }
  });
};

export const trackLeaguePromotion = (userId: string, leagueName: string) => {
  analyticsTracker.trackPerformance({
    eventType: 'league_promotion',
    userId,
    leagueName,
    properties: { leagueName }
  });
};

export const trackLeagueDemotion = (userId: string, leagueName: string) => {
  analyticsTracker.trackPerformance({
    eventType: 'league_demotion',
    userId,
    leagueName,
    properties: { leagueName }
  });
};

export const trackContinuityStreak = (userId: string, streakCount: number) => {
  analyticsTracker.trackPerformance({
    eventType: 'continuity_streak',
    userId,
    streakCount,
    properties: { streakCount }
  });
};

export const trackBriefingCompleted = (userId: string, briefingType: string) => {
  analyticsTracker.trackPerformance({
    eventType: 'briefing_completed',
    userId,
    properties: { briefingType }
  });
};
