// Broker Dashboard Service - Fixed for Real Users
// Handles real broker data and real database queries

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface BrokerMetrics {
  activeRFQs: number;
  quotesReceived: number;
  dealsClosed: number;
  avgResponseTime: number;
  reputationPoints: number;
  reputationRank: string;
  weeklyTrend: {
    rfqsChange: number;
    quotesChange: number;
    dealsChange: number;
  };
}

export interface DashboardRFQ {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
  status: 'open' | 'quoted' | 'accepted' | 'cancelled';
  quotesCount: number;
  createdAt: string;
  expiresAt: string;
}

export interface DashboardQuote {
  id: string;
  requestId: string;
  price: number;
  currency: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  validUntil: string;
  operator: {
    id: string;
    fullName: string;
    companyName: string;
    reputationScore: number;
  };
  aircraft: {
    type: string;
    model: string;
  };
}

export interface DashboardDeal {
  id: string;
  rfqTitle: string;
  operator: string;
  aircraft: string;
  totalValue: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

// ============================================================================
// BROKER DASHBOARD SERVICE CLASS
// ============================================================================

class BrokerDashboardService {
  // Get comprehensive dashboard metrics for a broker
  async getDashboardMetrics(brokerId: string): Promise<BrokerMetrics> {
    try {
      // Get active RFQs count
      const { data: rfqData, error: rfqError } = await supabase
        .from('requests')
        .select('id, status, created_at', { count: 'exact' })
        .eq('broker_id', brokerId)
        .in('status', ['open', 'quoted']);

      if (rfqError) throw rfqError;

      // Get quotes received for broker's RFQs
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('id, created_at, request_id, requests!inner(broker_id, created_at)', { count: 'exact' })
        .eq('requests.broker_id', brokerId);

      if (quotesError) throw quotesError;

      // Get completed deals (bookings)
      const { data: dealsData, error: dealsError } = await supabase
        .from('bookings')
        .select('id, status', { count: 'exact' })
        .eq('broker_company_id', brokerId)
        .eq('status', 'completed');

      if (dealsError) throw dealsError;

      // Calculate average response time
      let avgResponseTime = 0;
      if (quotesData && quotesData.length > 0) {
        const responseTimes = quotesData.map(quote => {
          const rfqCreated = new Date(quote.requests.created_at).getTime();
          const quoteCreated = new Date(quote.created_at).getTime();
          return (quoteCreated - rfqCreated) / (1000 * 60); // minutes
        });
        avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
      }

      // Calculate reputation points (simplified)
      const reputationPoints = (dealsData?.length || 0) * 100 + (quotesData?.length || 0) * 10;
      
      // Determine reputation rank
      let reputationRank = 'Bronze';
      if (reputationPoints >= 1000) reputationRank = 'Platinum';
      else if (reputationPoints >= 500) reputationRank = 'Gold';
      else if (reputationPoints >= 100) reputationRank = 'Silver';

      // Get weekly data for trends
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: weeklyRFQs } = await supabase
        .from('requests')
        .select('id')
        .eq('broker_id', brokerId)
        .gte('created_at', oneWeekAgo.toISOString());

      const { data: weeklyQuotes } = await supabase
        .from('quotes')
        .select('id, requests!inner(broker_id)')
        .eq('requests.broker_id', brokerId)
        .gte('created_at', oneWeekAgo.toISOString());

      const { data: weeklyDeals } = await supabase
        .from('bookings')
        .select('id')
        .eq('broker_company_id', brokerId)
        .gte('created_at', oneWeekAgo.toISOString());

      return {
        activeRFQs: rfqData?.length || 0,
        quotesReceived: quotesData?.length || 0,
        dealsClosed: dealsData?.length || 0,
        avgResponseTime: Math.round(avgResponseTime),
        reputationPoints,
        reputationRank: reputationRank as any,
        weeklyTrend: {
          rfqsChange: weeklyRFQs ? ((weeklyRFQs.length / (rfqData?.length || 1)) * 100) : 0,
          quotesChange: weeklyQuotes ? ((weeklyQuotes.length / (quotesData?.length || 1)) * 100) : 0,
          dealsChange: weeklyDeals ? ((weeklyDeals.length / (dealsData?.length || 1)) * 100) : 0,
        }
      };
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      // Return default values on error
      return {
        activeRFQs: 0,
        quotesReceived: 0,
        dealsClosed: 0,
        avgResponseTime: 0,
        reputationPoints: 0,
        reputationRank: 'Bronze',
        weeklyTrend: {
          rfqsChange: 0,
          quotesChange: 0,
          dealsChange: 0,
        }
      };
    }
  }

  // Get all RFQs for broker
  async getBrokerRFQs(brokerId: string): Promise<DashboardRFQ[]> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          id,
          title,
          description,
          origin,
          destination,
          departure_date,
          passengers,
          budget,
          status,
          created_at
        `)
        .eq('broker_id', brokerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(rfq => ({
        id: rfq.id,
        title: rfq.title || 'Untitled Request',
        description: rfq.description || '',
        origin: rfq.origin || '',
        destination: rfq.destination || '',
        departureDate: rfq.departure_date || '',
        passengers: rfq.passengers || 0,
        status: rfq.status as any,
        quotesCount: 0, // Will be populated separately
        createdAt: rfq.created_at,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));
    } catch (error) {
      console.error('Failed to fetch RFQs:', error);
      return [];
    }
  }

  // Get quotes for a specific RFQ
  async getQuotesForRFQ(rfqId: string): Promise<DashboardQuote[]> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          id,
          request_id,
          price,
          currency,
          status,
          created_at,
          valid_until,
          operator_id,
          operator:profiles!quotes_operator_id_fkey(
            full_name,
            company_name,
            reputation_score
          )
        `)
        .eq('request_id', rfqId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(quote => ({
        id: quote.id,
        requestId: quote.request_id,
        price: quote.price || 0,
        currency: quote.currency || 'USD',
        status: quote.status as any,
        createdAt: quote.created_at,
        validUntil: quote.valid_until || '',
        operator: {
          id: quote.operator_id,
          fullName: quote.operator?.full_name || 'Unknown Operator',
          companyName: quote.operator?.company_name || 'Unknown Company',
          reputationScore: quote.operator?.reputation_score || 0,
        },
        aircraft: {
          type: 'Business Jet', // Default for now
          model: 'Aircraft Model',
        },
      }));
    } catch (error) {
      console.error('Failed to fetch quotes for RFQ:', error);
      return [];
    }
  }

  // Get all quotes for broker
  async getAllQuotes(brokerId: string): Promise<DashboardQuote[]> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          id,
          request_id,
          price,
          currency,
          status,
          created_at,
          valid_until,
          operator_id,
          operator:profiles!quotes_operator_id_fkey(
            full_name,
            company_name,
            reputation_score
          ),
          requests!inner(
            broker_id
          )
        `)
        .eq('requests.broker_id', brokerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(quote => ({
        id: quote.id,
        requestId: quote.request_id,
        price: quote.price || 0,
        currency: quote.currency || 'USD',
        status: quote.status as any,
        createdAt: quote.created_at,
        validUntil: quote.valid_until || '',
        operator: {
          id: quote.operator_id,
          fullName: quote.operator?.full_name || 'Unknown Operator',
          companyName: quote.operator?.company_name || 'Unknown Company',
          reputationScore: quote.operator?.reputation_score || 0,
        },
        aircraft: {
          type: 'Business Jet',
          model: 'Aircraft Model',
        },
      }));
    } catch (error) {
      console.error('Failed to fetch all quotes:', error);
      return [];
    }
  }

  // Get completed deals
  async getCompletedDeals(brokerId: string): Promise<DashboardDeal[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          total_amount,
          currency,
          created_at,
          updated_at,
          operator:profiles!bookings_operator_id_fkey(
            full_name,
            company_name
          ),
          quotes!inner(
            requests!inner(
              title
            )
          )
        `)
        .eq('broker_company_id', brokerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(deal => ({
        id: deal.id,
        rfqTitle: deal.quotes?.requests?.title || 'Untitled Deal',
        operator: deal.operator?.full_name || 'Unknown Operator',
        aircraft: 'Business Jet', // Default for now
        totalValue: deal.total_amount || 0,
        currency: deal.currency || 'USD',
        status: deal.status as any,
        createdAt: deal.created_at,
        completedAt: deal.status === 'completed' ? deal.updated_at : undefined,
      }));
    } catch (error) {
      console.error('Failed to fetch completed deals:', error);
      return [];
    }
  }
}

// Export singleton instance
export const brokerDashboardService = new BrokerDashboardService();
