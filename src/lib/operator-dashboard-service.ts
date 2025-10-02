// Operator Dashboard Service - Real-time fleet, bookings, and operations data
// Connects operator terminal to live Supabase data

import { supabase } from '@/integrations/supabase/client';

export interface OperatorMetrics {
  fleetUtilization: number; // percentage
  activeBookings: number;
  pendingRFQs: number;
  monthlyRevenue: number;
  activeCrew: number;
  availableAircraft: number;
  maintenanceDue: number;
}

export interface FleetStatus {
  id: string;
  tailNumber: string;
  model: string;
  status: 'available' | 'in_use' | 'maintenance' | 'grounded';
  currentLocation: string;
  nextFlight?: {
    route: string;
    departureTime: string;
  };
  nextMaintenance: string;
}

export interface ActiveBooking {
  id: string;
  flightNumber: string;
  route: string;
  aircraft: string;
  departureDate: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  revenue: number;
  broker: string;
}

export interface RFQNotification {
  id: string;
  route: string;
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
  matchScore: number; // 0-100
  receivedAt: string;
  expiresAt: string;
  brokerName: string;
  brokerRating: number;
}

class OperatorDashboardService {
  // Get comprehensive dashboard metrics
  async getDashboardMetrics(operatorId: string): Promise<OperatorMetrics> {
    try {
      // Get fleet data
      const { data: aircraft, error: aircraftError } = await supabase
        .from('aircraft')
        .select('id, status')
        .eq('operator_company_id', operatorId);

      if (aircraftError) throw aircraftError;

      const totalAircraft = aircraft?.length || 0;
      const availableAircraft = aircraft?.filter(a => a.status === 'available').length || 0;
      const inUse = aircraft?.filter(a => a.status === 'in_use').length || 0;
      const fleetUtilization = totalAircraft > 0 ? Math.round((inUse / totalAircraft) * 100) : 0;

      // Get active bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, total_price, status')
        .eq('operator_company_id', operatorId)
        .in('status', ['upcoming', 'in_progress']);

      if (bookingsError) throw bookingsError;

      // Get pending RFQs (requests that haven't been quoted yet)
      const { data: rfqs, error: rfqsError } = await supabase
        .from('requests')
        .select(`
          id,
          quotes!left (id, operator_company_id)
        `)
        .eq('status', 'open');

      if (rfqsError) throw rfqsError;

      // Filter RFQs that this operator hasn't quoted yet
      const pendingRFQs = rfqs?.filter(rfq => 
        !rfq.quotes?.some((q: any) => q.operator_company_id === operatorId)
      ).length || 0;

      // Calculate monthly revenue
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: monthlyBookings } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('operator_company_id', operatorId)
        .gte('created_at', firstDayOfMonth);

      const monthlyRevenue = monthlyBookings?.reduce((sum, b) => sum + parseFloat(b.total_price), 0) || 0;

      // Get active crew count
      const { data: crew } = await supabase
        .from('users')
        .select('id')
        .eq('company_id', operatorId)
        .in('role', ['pilot', 'crew'])
        .eq('verification_status', 'approved');

      const activeCrew = crew?.length || 0;

      // Get aircraft with maintenance due soon (next 30 days)
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: maintenanceDue } = await supabase
        .from('aircraft')
        .select('id')
        .eq('operator_company_id', operatorId)
        .lte('aoc_expiry', thirtyDaysFromNow);

      return {
        fleetUtilization,
        activeBookings: bookings?.length || 0,
        pendingRFQs,
        monthlyRevenue: Math.round(monthlyRevenue),
        activeCrew,
        availableAircraft,
        maintenanceDue: maintenanceDue?.length || 0,
      };
    } catch (error) {
      console.error('Failed to fetch operator metrics:', error);
      return {
        fleetUtilization: 0,
        activeBookings: 0,
        pendingRFQs: 0,
        monthlyRevenue: 0,
        activeCrew: 0,
        availableAircraft: 0,
        maintenanceDue: 0,
      };
    }
  }

  // Get fleet status
  async getFleetStatus(operatorId: string): Promise<FleetStatus[]> {
    try {
      const { data, error } = await supabase
        .from('aircraft')
        .select('*')
        .eq('operator_company_id', operatorId)
        .order('tail_number');

      if (error) throw error;

      return (data || []).map(aircraft => ({
        id: aircraft.id,
        tailNumber: aircraft.tail_number,
        model: aircraft.model,
        status: aircraft.status as any,
        currentLocation: 'KJFK', // Would come from flight tracking
        nextMaintenance: aircraft.aoc_expiry || '',
      }));
    } catch (error) {
      console.error('Failed to fetch fleet status:', error);
      return [];
    }
  }

  // Get active bookings
  async getActiveBookings(operatorId: string): Promise<ActiveBooking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          total_price,
          status,
          requests (
            origin,
            destination,
            departure_date
          ),
          aircraft (
            model
          ),
          companies (
            name
          )
        `)
        .eq('operator_company_id', operatorId)
        .in('status', ['upcoming', 'in_progress'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((booking, index) => ({
        id: booking.id,
        flightNumber: `SC${1000 + index}`,
        route: `${booking.requests.origin} → ${booking.requests.destination}`,
        aircraft: booking.aircraft?.model || 'Unknown',
        departureDate: booking.requests.departure_date,
        status: booking.status as any,
        revenue: parseFloat(booking.total_price),
        broker: booking.companies?.name || 'Unknown',
      }));
    } catch (error) {
      console.error('Failed to fetch active bookings:', error);
      return [];
    }
  }

  // Get pending RFQ notifications
  async getPendingRFQs(operatorId: string): Promise<RFQNotification[]> {
    try {
      // Get all open RFQs
      const { data, error } = await supabase
        .from('requests')
        .select(`
          id,
          origin,
          destination,
          departure_date,
          passenger_count,
          created_at,
          users (
            full_name
          ),
          quotes!left (
            id,
            operator_company_id
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out RFQs this operator has already quoted
      const pendingRFQs = (data || []).filter(rfq =>
        !rfq.quotes?.some((q: any) => q.operator_company_id === operatorId)
      );

      // Calculate match score for each RFQ
      return pendingRFQs.map(rfq => ({
        id: rfq.id,
        route: `${rfq.origin} → ${rfq.destination}`,
        origin: rfq.origin,
        destination: rfq.destination,
        departureDate: rfq.departure_date,
        passengers: rfq.passenger_count,
        matchScore: 85, // Would be calculated based on fleet, route, etc.
        receivedAt: rfq.created_at,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        brokerName: rfq.users?.full_name || 'Unknown Broker',
        brokerRating: 4.5,
      }));
    } catch (error) {
      console.error('Failed to fetch pending RFQs:', error);
      return [];
    }
  }

  // Submit quote for RFQ
  async submitQuote(
    rfqId: string,
    operatorId: string,
    quoteData: {
      aircraftId: string;
      price: number;
      notes: string;
      validHours: number;
    }
  ): Promise<boolean> {
    try {
      const validUntil = new Date(Date.now() + quoteData.validHours * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('quotes')
        .insert({
          request_id: rfqId,
          operator_company_id: operatorId,
          created_by: operatorId,
          price: quoteData.price,
          currency: 'USD',
          aircraft_id: quoteData.aircraftId,
          notes: quoteData.notes,
          status: 'pending',
          valid_until: validUntil,
        })
        .select()
        .single();

      if (error) throw error;

      // Update request status to 'quoted'
      await supabase
        .from('requests')
        .update({ status: 'quoted' })
        .eq('id', rfqId);

      // TODO: Send notification to broker

      return true;
    } catch (error) {
      console.error('Failed to submit quote:', error);
      return false;
    }
  }

  // Get quote status
  async getQuoteStatus(quoteId: string): Promise<{
    status: string;
    viewedByBroker: boolean;
    competitorCount: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          status,
          request_id,
          requests (
            quotes (count)
          )
        `)
        .eq('id', quoteId)
        .single();

      if (error) throw error;

      return {
        status: data.status,
        viewedByBroker: false, // Would track views
        competitorCount: (data.requests?.quotes?.[0]?.count || 1) - 1,
      };
    } catch (error) {
      console.error('Failed to get quote status:', error);
      return {
        status: 'unknown',
        viewedByBroker: false,
        competitorCount: 0,
      };
    }
  }
}

export const operatorDashboardService = new OperatorDashboardService();


