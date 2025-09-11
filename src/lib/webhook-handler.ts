// Stripe Webhook Handler - Production Ready
// FCA Compliant Payment Processing

import { stripeConnectLive } from './stripe-connect-live';
import { supabase } from '@/integrations/supabase/client';

export interface WebhookRequest {
  body: string;
  signature: string;
  headers: Record<string, string>;
}

export interface WebhookResponse {
  status: number;
  body: string;
}

export class WebhookHandler {
  /**
   * Process Stripe webhook with idempotency
   */
  static async handleStripeWebhook(request: WebhookRequest): Promise<WebhookResponse> {
    try {
      // Verify webhook signature
      const event = await stripeConnectLive.processWebhook(request.body, request.signature);
      
      // Log webhook receipt
      await this.logWebhookReceipt(event.id, request.body, request.headers);
      
      return {
        status: 200,
        body: JSON.stringify({ received: true, event_id: event.id })
      };
    } catch (error) {
      console.error('Webhook processing failed:', error);
      
      return {
        status: 400,
        body: JSON.stringify({ 
          error: 'Webhook processing failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      };
    }
  }

  /**
   * Log webhook receipt for audit
   */
  private static async logWebhookReceipt(
    eventId: string, 
    payload: string, 
    headers: Record<string, string>
  ): Promise<void> {
    try {
      // Generate payload hash
      const encoder = new TextEncoder();
      const data = encoder.encode(payload);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const payloadHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Store in database
      const { error } = await supabase
        .from('stripe_webhook_events')
        .insert({
          id: eventId,
          processed: true,
          processed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log webhook receipt:', error);
      }

      // Log to audit trail
      await supabase
        .from('audit_log')
        .insert({
          action: 'webhook_received',
          details: {
            event_id: eventId,
            payload_hash: payloadHash,
            headers: this.sanitizeHeaders(headers)
          },
          timestamp: new Date().toISOString()
        });

    } catch (error) {
      console.error('Failed to log webhook receipt:', error);
    }
  }

  /**
   * Sanitize headers for logging
   */
  private static sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(headers)) {
      // Only log safe headers
      if (['user-agent', 'content-type', 'stripe-signature'].includes(key.toLowerCase())) {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  /**
   * Health check endpoint
   */
  static async healthCheck(): Promise<WebhookResponse> {
    try {
      // Check database connection
      const { error } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        throw new Error('Database connection failed');
      }

      return {
        status: 200,
        body: JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        })
      };
    } catch (error) {
      return {
        status: 503,
        body: JSON.stringify({
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        })
      };
    }
  }
}

export default WebhookHandler;
