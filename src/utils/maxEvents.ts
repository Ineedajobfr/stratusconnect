// Max Events - Platform event instrumentation for internal Max operator
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

export interface MaxEvent {
  type: string;
  actor_user_id?: string | null;
  payload: any;
}

export class MaxEventPublisher {
  private static instance: MaxEventPublisher;

  static getInstance(): MaxEventPublisher {
    if (!MaxEventPublisher.instance) {
      MaxEventPublisher.instance = new MaxEventPublisher();
    }
    return MaxEventPublisher.instance;
  }

  async publishEvent(event: MaxEvent): Promise<void> {
    try {
      const { error } = await supabase
        .from('internal_max.event_bus')
        .insert({
          type: event.type,
          actor_user_id: event.actor_user_id,
          payload: event.payload,
          occurred_at: new Date().toISOString(),
          status: 'pending'
        });

      if (error) {
        console.error('Failed to publish Max event:', error);
      }
    } catch (error) {
      console.error('Error publishing Max event:', error);
    }
  }

  // Specific event publishers for common platform events
  async publishRFQCreated(rfqId: string, userId: string, rfqData: any): Promise<void> {
    await this.publishEvent({
      type: 'rfq.created',
      actor_user_id: userId,
      payload: {
        rfq_id: rfqId,
        ...rfqData
      }
    });
  }

  async publishRFQUpdated(rfqId: string, userId: string, changes: any): Promise<void> {
    await this.publishEvent({
      type: 'rfq.updated',
      actor_user_id: userId,
      payload: {
        rfq_id: rfqId,
        changes
      }
    });
  }

  async publishQuoteSubmitted(quoteId: string, operatorId: string, quoteData: any): Promise<void> {
    await this.publishEvent({
      type: 'quote.submitted',
      actor_user_id: operatorId,
      payload: {
        quote_id: quoteId,
        ...quoteData
      }
    });
  }

  async publishQuoteExpired(quoteId: string, quoteData: any): Promise<void> {
    await this.publishEvent({
      type: 'quote.expired',
      payload: {
        quote_id: quoteId,
        ...quoteData
      }
    });
  }

  async publishDealCreated(dealId: string, brokerId: string, dealData: any): Promise<void> {
    await this.publishEvent({
      type: 'deal.created',
      actor_user_id: brokerId,
      payload: {
        deal_id: dealId,
        ...dealData
      }
    });
  }

  async publishDealAccepted(dealId: string, operatorId: string, dealData: any): Promise<void> {
    await this.publishEvent({
      type: 'deal.accepted',
      actor_user_id: operatorId,
      payload: {
        deal_id: dealId,
        ...dealData
      }
    });
  }

  async publishDealCancelled(dealId: string, userId: string, reason: string): Promise<void> {
    await this.publishEvent({
      type: 'deal.cancelled',
      actor_user_id: userId,
      payload: {
        deal_id: dealId,
        reason
      }
    });
  }

  async publishUserSignup(userId: string, userData: any): Promise<void> {
    await this.publishEvent({
      type: 'user.signup',
      actor_user_id: userId,
      payload: userData
    });
  }

  async publishVerificationSubmitted(userId: string, verificationData: any): Promise<void> {
    await this.publishEvent({
      type: 'verification.submitted',
      actor_user_id: userId,
      payload: verificationData
    });
  }

  async publishVerificationFailed(userId: string, reason: string): Promise<void> {
    await this.publishEvent({
      type: 'verification.failed',
      actor_user_id: userId,
      payload: { reason }
    });
  }

  async publishSanctionsScreened(userId: string, screeningData: any): Promise<void> {
    await this.publishEvent({
      type: 'sanctions.screened',
      actor_user_id: userId,
      payload: screeningData
    });
  }

  async publishSanctionsMatch(userId: string, matchData: any): Promise<void> {
    await this.publishEvent({
      type: 'sanctions.match',
      actor_user_id: userId,
      payload: matchData
    });
  }

  async publishAircraftAvailabilityUpdated(aircraftId: string, availabilityData: any): Promise<void> {
    await this.publishEvent({
      type: 'aircraft.availability.updated',
      payload: {
        aircraft_id: aircraftId,
        ...availabilityData
      }
    });
  }

  async publishMessageSent(messageId: string, senderId: string, messageData: any): Promise<void> {
    await this.publishEvent({
      type: 'message.sent',
      actor_user_id: senderId,
      payload: {
        message_id: messageId,
        content: messageData.content,
        recipient_id: messageData.recipient_id
      }
    });
  }

  async publishContactRequested(requestId: string, requesterId: string, requestData: any): Promise<void> {
    await this.publishEvent({
      type: 'contact.requested',
      actor_user_id: requesterId,
      payload: {
        request_id: requestId,
        ...requestData
      }
    });
  }

  async publishPaymentIntentCreated(paymentId: string, userId: string, paymentData: any): Promise<void> {
    await this.publishEvent({
      type: 'payment.intent.created',
      actor_user_id: userId,
      payload: {
        payment_id: paymentId,
        ...paymentData
      }
    });
  }

  async publishPaymentSucceeded(paymentId: string, userId: string, paymentData: any): Promise<void> {
    await this.publishEvent({
      type: 'payment.succeeded',
      actor_user_id: userId,
      payload: {
        payment_id: paymentId,
        ...paymentData
      }
    });
  }

  async publishPaymentFailed(paymentId: string, userId: string, error: string): Promise<void> {
    await this.publishEvent({
      type: 'payment.failed',
      actor_user_id: userId,
      payload: {
        payment_id: paymentId,
        error
      }
    });
  }
}

// Export singleton instance
export const maxEvents = MaxEventPublisher.getInstance();

// Convenience functions for common events
export const publishMaxEvent = (event: MaxEvent) => maxEvents.publishEvent(event);

// Hook for React components
export const useMaxEvents = () => {
  return {
    publishEvent: maxEvents.publishEvent.bind(maxEvents),
    publishRFQCreated: maxEvents.publishRFQCreated.bind(maxEvents),
    publishQuoteSubmitted: maxEvents.publishQuoteSubmitted.bind(maxEvents),
    publishDealCreated: maxEvents.publishDealCreated.bind(maxEvents),
    publishUserSignup: maxEvents.publishUserSignup.bind(maxEvents),
    publishMessageSent: maxEvents.publishMessageSent.bind(maxEvents),
    // ... add other specific event publishers as needed
  };
};
