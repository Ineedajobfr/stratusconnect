// Pilot Dashboard Service - Manage assignments, certifications, and job applications
// Real-time data for pilot operations

import { supabase } from '@/integrations/supabase/client';

export interface PilotMetrics {
  upcomingFlights: number;
  totalFlightHours: number;
  picHours: number;
  monthlyEarnings: number;
  availabilityStatus: 'available' | 'on_duty' | 'on_rest' | 'unavailable';
  certificationsExpiring: number;
  pendingApplications: number;
}

export interface UpcomingFlight {
  id: string;
  flightNumber: string;
  route: string;
  origin: string;
  destination: string;
  departureDate: string;
  aircraft: string;
  operator: string;
  role: 'Captain' | 'First Officer';
  pay: number;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface JobListing {
  id: string;
  operator: string;
  operatorRating: number;
  aircraftType: string;
  route: string;
  departureDate: string;
  duration: number;
  payRate: number;
  payType: 'day_rate' | 'per_flight';
  requirements: string[];
  matchScore: number;
  postedDate: string;
  applicants: number;
}

export interface PilotCertification {
  id: string;
  type: 'ATP' | 'Commercial' | 'Private' | 'Instrument' | 'Multi-Engine' | 'Flight Instructor' | 'Type Rating';
  name: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
}

export interface FlightHours {
  total: number;
  pic: number;
  sic: number;
  multiEngine: number;
  night: number;
  ifr: number;
  crossCountry: number;
  byAircraftType: {
    [key: string]: number;
  };
}

class PilotDashboardService {
  // Get pilot dashboard metrics
  async getDashboardMetrics(pilotId: string): Promise<PilotMetrics> {
    try {
      // Get upcoming flights
      const { data: flights } = await supabase
        .from('crew_assignments')
        .select(`
          id,
          flights (
            departure_datetime,
            status
          )
        `)
        .eq('user_id', pilotId)
        .eq('flights.status', 'scheduled')
        .gte('flights.departure_datetime', new Date().toISOString());

      // Get total flight hours (would come from flight logs)
      const { data: flightLogs } = await supabase
        .from('flight_logs')
        .select('total_hours, pic_hours')
        .eq('pilot_id', pilotId);

      const totalFlightHours = flightLogs?.reduce((sum, log) => sum + (log.total_hours || 0), 0) || 0;
      const picHours = flightLogs?.reduce((sum, log) => sum + (log.pic_hours || 0), 0) || 0;

      // Get monthly earnings
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: earnings } = await supabase
        .from('pilot_payments')
        .select('amount')
        .eq('pilot_id', pilotId)
        .gte('payment_date', firstDayOfMonth);

      const monthlyEarnings = earnings?.reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0;

      // Get certifications expiring soon
      const sixtyDaysFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
      const { data: certs } = await supabase
        .from('pilot_certifications')
        .select('id')
        .eq('pilot_id', pilotId)
        .lte('expiry_date', sixtyDaysFromNow)
        .gt('expiry_date', new Date().toISOString());

      // Get availability status
      const { data: pilotData } = await supabase
        .from('users')
        .select('availability_status')
        .eq('id', pilotId)
        .single();

      // Get pending job applications
      const { data: applications } = await supabase
        .from('job_applications')
        .select('id')
        .eq('pilot_id', pilotId)
        .eq('status', 'pending');

      return {
        upcomingFlights: flights?.length || 0,
        totalFlightHours: Math.round(totalFlightHours),
        picHours: Math.round(picHours),
        monthlyEarnings: Math.round(monthlyEarnings),
        availabilityStatus: (pilotData?.availability_status as any) || 'available',
        certificationsExpiring: certs?.length || 0,
        pendingApplications: applications?.length || 0,
      };
    } catch (error) {
      console.error('Failed to fetch pilot metrics:', error);
      return {
        upcomingFlights: 0,
        totalFlightHours: 0,
        picHours: 0,
        monthlyEarnings: 0,
        availabilityStatus: 'available',
        certificationsExpiring: 0,
        pendingApplications: 0,
      };
    }
  }

  // Get upcoming flights
  async getUpcomingFlights(pilotId: string): Promise<UpcomingFlight[]> {
    try {
      const { data, error } = await supabase
        .from('crew_assignments')
        .select(`
          id,
          role,
          flights (
            id,
            departure_airport,
            arrival_airport,
            departure_datetime,
            status,
            aircraft (model),
            bookings (
              companies (name)
            )
          )
        `)
        .eq('user_id', pilotId)
        .in('flights.status', ['scheduled', 'boarding'])
        .order('flights.departure_datetime');

      if (error) throw error;

      return (data || []).map((assignment, index) => ({
        id: assignment.id,
        flightNumber: `SC${1000 + index}`,
        route: `${assignment.flights.departure_airport} → ${assignment.flights.arrival_airport}`,
        origin: assignment.flights.departure_airport,
        destination: assignment.flights.arrival_airport,
        departureDate: assignment.flights.departure_datetime,
        aircraft: assignment.flights.aircraft?.model || 'Unknown',
        operator: assignment.flights.bookings?.[0]?.companies?.name || 'Unknown',
        role: assignment.role as any,
        pay: 2500, // Would come from contract
        status: 'confirmed',
      }));
    } catch (error) {
      console.error('Failed to fetch upcoming flights:', error);
      return [];
    }
  }

  // Toggle availability status
  async toggleAvailability(pilotId: string, newStatus: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ availability_status: newStatus })
        .eq('id', pilotId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to update availability:', error);
      return false;
    }
  }

  // Get job listings with match scores
  async getJobListings(pilotId: string): Promise<JobListing[]> {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select(`
          id,
          aircraft_type,
          route,
          departure_date,
          duration_hours,
          pay_rate,
          pay_type,
          requirements,
          created_at,
          companies (
            name,
            rating
          ),
          job_applications (count)
        `)
        .eq('status', 'open')
        .eq('role', 'pilot')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get pilot's type ratings for match score
      const { data: pilotRatings } = await supabase
        .from('pilot_certifications')
        .select('aircraft_type')
        .eq('pilot_id', pilotId)
        .eq('type', 'Type Rating');

      const pilotAircraft = pilotRatings?.map(r => r.aircraft_type) || [];

      return (data || []).map(job => {
        // Calculate match score based on qualifications
        const hasTypeRating = pilotAircraft.includes(job.aircraft_type);
        const matchScore = hasTypeRating ? 95 : 60;

        return {
          id: job.id,
          operator: job.companies?.name || 'Unknown',
          operatorRating: job.companies?.rating || 4.5,
          aircraftType: job.aircraft_type,
          route: job.route,
          departureDate: job.departure_date,
          duration: job.duration_hours,
          payRate: parseFloat(job.pay_rate),
          payType: job.pay_type as any,
          requirements: job.requirements || [],
          matchScore,
          postedDate: job.created_at,
          applicants: job.job_applications?.[0]?.count || 0,
        };
      });
    } catch (error) {
      console.error('Failed to fetch job listings:', error);
      return [];
    }
  }

  // Apply for a job
  async applyForJob(
    jobId: string,
    pilotId: string,
    coverLetter?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_posting_id: jobId,
          pilot_id: pilotId,
          status: 'pending',
          cover_letter: coverLetter,
          applied_at: new Date().toISOString(),
        });

      if (error) throw error;

      // TODO: Notify operator

      return true;
    } catch (error) {
      console.error('Failed to apply for job:', error);
      return false;
    }
  }

  // Get pilot certifications
  async getCertifications(pilotId: string): Promise<PilotCertification[]> {
    try {
      const { data, error } = await supabase
        .from('pilot_certifications')
        .select('*')
        .eq('pilot_id', pilotId)
        .order('expiry_date');

      if (error) throw error;

      return (data || []).map(cert => {
        const expiryDate = new Date(cert.expiry_date);
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        let status: 'valid' | 'expiring_soon' | 'expired' = 'valid';
        if (daysUntilExpiry < 0) status = 'expired';
        else if (daysUntilExpiry < 60) status = 'expiring_soon';

        return {
          id: cert.id,
          type: cert.type as any,
          name: cert.name,
          number: cert.number,
          issueDate: cert.issue_date,
          expiryDate: cert.expiry_date,
          status,
        };
      });
    } catch (error) {
      console.error('Failed to fetch certifications:', error);
      return [];
    }
  }

  // Log flight hours
  async logFlightHours(
    pilotId: string,
    flightData: {
      flightId: string;
      totalHours: number;
      picHours: number;
      sicHours: number;
      nightHours: number;
      ifrHours: number;
      aircraftType: string;
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('flight_logs')
        .insert({
          pilot_id: pilotId,
          flight_id: flightData.flightId,
          total_hours: flightData.totalHours,
          pic_hours: flightData.picHours,
          sic_hours: flightData.sicHours,
          night_hours: flightData.nightHours,
          ifr_hours: flightData.ifrHours,
          aircraft_type: flightData.aircraftType,
          logged_at: new Date().toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to log flight hours:', error);
      return false;
    }
  }

  // Get flight hours breakdown
  async getFlightHours(pilotId: string): Promise<FlightHours> {
    try {
      const { data, error } = await supabase
        .from('flight_logs')
        .select('*')
        .eq('pilot_id', pilotId);

      if (error) throw error;

      const byType: { [key: string]: number } = {};
      
      (data || []).forEach(log => {
        if (log.aircraft_type) {
          byType[log.aircraft_type] = (byType[log.aircraft_type] || 0) + log.total_hours;
        }
      });

      return {
        total: data?.reduce((sum, log) => sum + log.total_hours, 0) || 0,
        pic: data?.reduce((sum, log) => sum + (log.pic_hours || 0), 0) || 0,
        sic: data?.reduce((sum, log) => sum + (log.sic_hours || 0), 0) || 0,
        multiEngine: data?.reduce((sum, log) => sum + (log.multi_engine_hours || 0), 0) || 0,
        night: data?.reduce((sum, log) => sum + (log.night_hours || 0), 0) || 0,
        ifr: data?.reduce((sum, log) => sum + (log.ifr_hours || 0), 0) || 0,
        crossCountry: data?.reduce((sum, log) => sum + (log.cross_country_hours || 0), 0) || 0,
        byAircraftType: byType,
      };
    } catch (error) {
      console.error('Failed to fetch flight hours:', error);
      return {
        total: 0,
        pic: 0,
        sic: 0,
        multiEngine: 0,
        night: 0,
        ifr: 0,
        crossCountry: 0,
        byAircraftType: {},
      };
    }
  }
}

export const pilotDashboardService = new PilotDashboardService();


