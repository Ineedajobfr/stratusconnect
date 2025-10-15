// Broker Dashboard Service - Real-time metrics from database
// Connects all dashboard widgets to live Supabase data

import { supabase } from '@/integrations/supabase/client';

export interface BrokerMetrics {
  activeRFQs: number;
  quotesReceived: number;
  dealsClosed: number;
  avgResponseTime: number; // in minutes
  reputationPoints: number;
  reputationRank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  weeklyTrend: {
    rfqsChange: number; // percentage
    quotesChange: number;
    dealsChange: number;
  };
}

export interface DashboardRFQ {
  id: string;
  route: string;
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
  status: 'draft' | 'published' | 'quoted' | 'accepted' | 'completed' | 'cancelled';
  quotesCount: number;
  createdAt: string;
  expiresAt: string;
}

export interface DashboardQuote {
  id: string;
  rfqId: string;
  rfqRoute: string;
  operatorName: string;
  operatorRating: number;
  aircraft: string;
  price: number;
  currency: string;
  responseTime: number; // minutes from RFQ creation to quote submission
  receivedAt: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface DashboardDeal {
  id: string;
  rfqId: string;
  quoteId: string;
  route: string;
  operatorName: string;
  totalPrice: number;
  commission: number;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'escrowed' | 'released' | 'refunded';
  createdAt: string;
  completedAt?: string;
}

class BrokerDashboardService {
  // Get comprehensive dashboard metrics for a broker
  async getDashboardMetrics(brokerId: string): Promise<BrokerMetrics> {
    try {
      // Get active RFQs count
      const { data: rfqData, error: rfqError } = await supabase
        .from('requests')
        .select('id, status, created_at', { count: 'exact' })
        .eq('created_by', brokerId)
        .in('status', ['open', 'quoted']);

      if (rfqError) throw rfqError;

      // Get quotes received for broker's RFQs
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('id, created_at, request_id, requests!inner(created_by, created_at)', { count: 'exact' })
        .eq('requests.created_by', brokerId);

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
        avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      }

      // Get reputation points (would come from a reputation table)
      const { data: repData } = await supabase
        .from('user_reputation')
        .select('points, rank')
        .eq('user_id', brokerId)
        .single();

      const reputationPoints = repData?.points || 0;
      const reputationRank = repData?.rank || 'Bronze';

      // Calculate weekly trends (compare with last week)
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const { data: weeklyRFQs } = await supabase
        .from('requests')
        .select('id')
        .eq('created_by', brokerId)
        .gte('created_at', lastWeek);

      const { data: weeklyQuotes } = await supabase
        .from('quotes')
        .select('id, requests!inner(created_by)')
        .eq('requests.created_by', brokerId)
        .gte('created_at', lastWeek);

      const { data: weeklyDeals } = await supabase
        .from('bookings')
        .select('id')
        .eq('broker_company_id', brokerId)
        .gte('created_at', lastWeek);

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
          origin,
          destination,
          departure_date,
          passenger_count,
          status,
          created_at,
          quotes (count)
        `)
        .eq('created_by', brokerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(rfq => ({
        id: rfq.id,
        route: `${rfq.origin} → ${rfq.destination}`,
        origin: rfq.origin,
        destination: rfq.destination,
        departureDate: rfq.departure_date,
        passengers: rfq.passenger_count,
        status: rfq.status as any,
        quotesCount: rfq.quotes?.[0]?.count || 0,
        createdAt: rfq.created_at,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
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
          requests (
            origin,
            destination,
            created_at
          ),
          companies (
            name
          ),
          users (
            full_name
          )
        `)
        .eq('request_id', rfqId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(quote => {
        const rfqCreated = new Date(quote.requests.created_at).getTime();
        const quoteCreated = new Date(quote.created_at).getTime();
        const responseTime = Math.round((quoteCreated - rfqCreated) / (1000 * 60));

        return {
          id: quote.id,
          rfqId: quote.request_id,
          rfqRoute: `${quote.requests.origin} → ${quote.requests.destination}`,
          operatorName: quote.companies?.name || quote.users?.full_name || 'Unknown Operator',
          operatorRating: 4.5, // Would come from operator rating system
          aircraft: 'Gulfstream G550', // Would come from quote details
          price: parseFloat(quote.price),
          currency: quote.currency,
          responseTime,
          receivedAt: quote.created_at,
          validUntil: quote.valid_until || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: quote.status as any,
        };
      });
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      return [];
    }
  }

  // Get all quotes received by broker across all RFQs
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
          requests!inner (
            created_by,
            origin,
            destination,
            created_at
          ),
          companies (
            name
          )
        `)
        .eq('requests.created_by', brokerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(quote => {
        const rfqCreated = new Date(quote.requests.created_at).getTime();
        const quoteCreated = new Date(quote.created_at).getTime();
        const responseTime = Math.round((quoteCreated - rfqCreated) / (1000 * 60));

        return {
          id: quote.id,
          rfqId: quote.request_id,
          rfqRoute: `${quote.requests.origin} → ${quote.requests.destination}`,
          operatorName: quote.companies?.name || 'Unknown Operator',
          operatorRating: 4.5,
          aircraft: 'Gulfstream G550',
          price: parseFloat(quote.price),
          currency: quote.currency,
          responseTime,
          receivedAt: quote.created_at,
          validUntil: quote.valid_until || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: quote.status as any,
        };
      });
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
          request_id,
          quote_id,
          total_price,
          status,
          payment_status,
          created_at,
          requests (
            origin,
            destination
          ),
          companies (
            name
          )
        `)
        .eq('broker_company_id', brokerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(deal => ({
        id: deal.id,
        rfqId: deal.request_id,
        quoteId: deal.quote_id,
        route: `${deal.requests.origin} → ${deal.requests.destination}`,
        operatorName: deal.companies?.name || 'Unknown',
        totalPrice: parseFloat(deal.total_price),
        commission: parseFloat(deal.total_price) * 0.10, // 10% broker commission
        status: deal.status as any,
        paymentStatus: deal.payment_status as any,
        createdAt: deal.created_at,
        completedAt: deal.status === 'completed' ? deal.created_at : undefined,
      }));
    } catch (error) {
      console.error('Failed to fetch completed deals:', error);
      return [];
    }
  }

  // Accept a quote and create booking
  async acceptQuote(quoteId: string, brokerId: string): Promise<boolean> {
    try {
      // Get quote details
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select('*, requests(*)')
        .eq('id', quoteId)
        .single();

      if (quoteError) throw quoteError;

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          request_id: quote.request_id,
          quote_id: quote.id,
          broker_company_id: brokerId,
          operator_company_id: quote.operator_company_id,
          total_price: quote.price,
          currency: quote.currency,
          status: 'upcoming',
          payment_status: 'pending',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Update quote status
      await supabase
        .from('quotes')
        .update({ status: 'accepted' })
        .eq('id', quoteId);

      // Update RFQ status
      await supabase
        .from('requests')
        .update({ status: 'accepted' })
        .eq('id', quote.request_id);

      // Award reputation points for deal
      await this.awardReputationPoints(brokerId, 40, 'deal_completed');

      return true;
    } catch (error) {
      console.error('Failed to accept quote:', error);
      return false;
    }
  }

  // Reject a quote
  async rejectQuote(quoteId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'rejected' })
        .eq('id', quoteId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to reject quote:', error);
      return false;
    }
  }

  // Award reputation points
  async awardReputationPoints(
    userId: string, 
    points: number, 
    reason: string
  ): Promise<void> {
    try {
      // Check if user has reputation record
      const { data: existing } = await supabase
        .from('user_reputation')
        .select('points, rank')
        .eq('user_id', userId)
        .single();

      const newPoints = (existing?.points || 0) + points;
      
      // Determine rank based on points
      let rank = 'Bronze';
      if (newPoints >= 1000) rank = 'Platinum';
      else if (newPoints >= 500) rank = 'Gold';
      else if (newPoints >= 200) rank = 'Silver';

      if (existing) {
        // Update existing record
        await supabase
          .from('user_reputation')
          .update({ 
            points: newPoints, 
            rank,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        // Create new record
        await supabase
          .from('user_reputation')
          .insert({
            user_id: userId,
            points: newPoints,
            rank,
          });
      }

      // Log the points award
      await supabase
        .from('reputation_log')
        .insert({
          user_id: userId,
          points,
          reason,
          created_at: new Date().toISOString(),
        });

    } catch (error) {
      console.error('Failed to award reputation points:', error);
    }
  }

  // Get reputation rank benefits
  getRankBenefits(rank: string): string[] {
    switch (rank) {
      case 'Platinum':
        return [
          'Priority RFQ placement',
          'Fast lane access (<1 min)',
          '5% reduced platform fees',
          'Dedicated account manager',
          'Custom analytics reports',
        ];
      case 'Gold':
        return [
          'Enhanced RFQ visibility',
          'Fast lane access (<3 min)',
          '3% reduced platform fees',
          'Advanced analytics',
        ];
      case 'Silver':
        return [
          'Improved RFQ visibility',
          'Fast lane access (<5 min)',
          '2% reduced platform fees',
        ];
      case 'Bronze':
      default:
        return [
          'Standard RFQ placement',
          'Basic analytics',
        ];
    }
  }
}

export const brokerDashboardService = new BrokerDashboardService();














