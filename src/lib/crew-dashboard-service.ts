// Crew Dashboard Service - Cabin crew assignments and professional development
// Real-time data for crew operations

import { supabase } from '@/integrations/supabase/client';

export interface CrewMetrics {
  upcomingFlights: number;
  completedFlights: number;
  averageRating: number;
  monthlyEarnings: number;
  availabilityStatus: 'available' | 'on_duty' | 'on_rest' | 'unavailable';
  certificationsExpiring: number;
  pendingApplications: number;
  trainingCoursesRequired: number;
}

export interface CrewAssignment {
  id: string;
  flightNumber: string;
  route: string;
  origin: string;
  destination: string;
  departureDate: string;
  duration: number;
  aircraft: string;
  operator: string;
  passengers: number;
  specialRequests: string[];
  vipPassengers: boolean;
  cateringType: string;
  pay: number;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface CrewJobListing {
  id: string;
  operator: string;
  operatorRating: number;
  position: 'Flight Attendant' | 'Senior Flight Attendant' | 'Purser' | 'Chief Flight Attendant';
  aircraftSize: 'light' | 'midsize' | 'large' | 'ultra_long_range';
  employmentType: 'full_time' | 'contract' | 'per_diem';
  flightType: 'corporate' | 'charter' | 'mixed';
  route: string;
  schedule: string;
  payRate: number;
  payType: 'monthly' | 'daily' | 'per_flight';
  languagesRequired: string[];
  specialSkills: string[];
  benefits: string[];
  matchScore: number;
  postedDate: string;
  applicants: number;
}

export interface CrewCertification {
  id: string;
  type: 'FAA_Cabin_Crew' | 'First_Aid' | 'CPR' | 'Emergency_Procedures' | 'Security_Training' | 'Food_Safety' | 'Language' | 'Wine_Sommelier' | 'Culinary';
  name: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
}

export interface ServiceRating {
  id: string;
  flightId: string;
  route: string;
  date: string;
  rating: number;
  feedback: string;
  passengerName: string;
  categories: {
    service: number;
    professionalism: number;
    communication: number;
    appearance: number;
  };
}

class CrewDashboardService {
  // Get crew dashboard metrics
  async getDashboardMetrics(crewId: string): Promise<CrewMetrics> {
    try {
      // Get upcoming flights
      const { data: upcomingFlights } = await supabase
        .from('crew_assignments')
        .select(`
          id,
          flights (
            departure_datetime,
            status
          )
        `)
        .eq('user_id', crewId)
        .eq('flights.status', 'scheduled')
        .gte('flights.departure_datetime', new Date().toISOString());

      // Get completed flights
      const { data: completedFlights } = await supabase
        .from('crew_assignments')
        .select('id')
        .eq('user_id', crewId)
        .eq('status', 'completed');

      // Get service ratings
      const { data: ratings } = await supabase
        .from('service_ratings')
        .select('rating')
        .eq('crew_id', crewId);

      const averageRating = ratings?.length 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      // Get monthly earnings
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: earnings } = await supabase
        .from('crew_payments')
        .select('amount')
        .eq('crew_id', crewId)
        .gte('payment_date', firstDayOfMonth);

      const monthlyEarnings = earnings?.reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0;

      // Get availability
      const { data: crewData } = await supabase
        .from('users')
        .select('availability_status')
        .eq('id', crewId)
        .single();

      // Get expiring certifications
      const sixtyDaysFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
      const { data: certs } = await supabase
        .from('crew_certifications')
        .select('id')
        .eq('crew_id', crewId)
        .lte('expiry_date', sixtyDaysFromNow)
        .gt('expiry_date', new Date().toISOString());

      // Get pending applications
      const { data: applications } = await supabase
        .from('job_applications')
        .select('id')
        .eq('crew_id', crewId)
        .eq('status', 'pending');

      // Get required training courses
      const { data: training } = await supabase
        .from('training_requirements')
        .select('id')
        .eq('crew_id', crewId)
        .eq('status', 'pending');

      return {
        upcomingFlights: upcomingFlights?.length || 0,
        completedFlights: completedFlights?.length || 0,
        averageRating: Math.round(averageRating * 10) / 10,
        monthlyEarnings: Math.round(monthlyEarnings),
        availabilityStatus: (crewData?.availability_status as any) || 'available',
        certificationsExpiring: certs?.length || 0,
        pendingApplications: applications?.length || 0,
        trainingCoursesRequired: training?.length || 0,
      };
    } catch (error) {
      console.error('Failed to fetch crew metrics:', error);
      return {
        upcomingFlights: 0,
        completedFlights: 0,
        averageRating: 0,
        monthlyEarnings: 0,
        availabilityStatus: 'available',
        certificationsExpiring: 0,
        pendingApplications: 0,
        trainingCoursesRequired: 0,
      };
    }
  }

  // Get upcoming assignments
  async getUpcomingAssignments(crewId: string): Promise<CrewAssignment[]> {
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
              companies (name),
              requests (passenger_count)
            )
          )
        `)
        .eq('user_id', crewId)
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
        duration: 5.5, // Would be calculated
        aircraft: assignment.flights.aircraft?.model || 'Unknown',
        operator: assignment.flights.bookings?.[0]?.companies?.name || 'Unknown',
        passengers: assignment.flights.bookings?.[0]?.requests?.passenger_count || 0,
        specialRequests: [],
        vipPassengers: false,
        cateringType: 'Standard',
        pay: 800, // Would come from contract
        status: 'confirmed',
      }));
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      return [];
    }
  }

  // Get job listings for crew
  async getJobListings(crewId: string): Promise<CrewJobListing[]> {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select(`
          id,
          position,
          aircraft_type,
          employment_type,
          flight_type,
          route,
          schedule,
          pay_rate,
          pay_type,
          languages_required,
          special_skills,
          benefits,
          created_at,
          companies (
            name,
            rating
          ),
          job_applications (count)
        `)
        .eq('status', 'open')
        .eq('role', 'crew')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get crew's qualifications for match score
      const { data: crewSkills } = await supabase
        .from('crew_certifications')
        .select('type, languages')
        .eq('crew_id', crewId);

      return (data || []).map(job => {
        // Calculate match score
        const matchScore = 85; // Would be calculated based on skills

        return {
          id: job.id,
          operator: job.companies?.name || 'Unknown',
          operatorRating: job.companies?.rating || 4.5,
          position: job.position as any,
          aircraftSize: (job.aircraft_type || 'midsize') as any,
          employmentType: job.employment_type as any,
          flightType: job.flight_type as any,
          route: job.route || 'Various',
          schedule: job.schedule || 'Flexible',
          payRate: parseFloat(job.pay_rate),
          payType: job.pay_type as any,
          languagesRequired: job.languages_required || [],
          specialSkills: job.special_skills || [],
          benefits: job.benefits || [],
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

  // Apply for crew position
  async applyForJob(
    jobId: string,
    crewId: string,
    applicationData: {
      coverLetter?: string;
      languages: string[];
      specialSkills: string[];
      availableFrom: string;
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_posting_id: jobId,
          crew_id: crewId,
          status: 'pending',
          cover_letter: applicationData.coverLetter,
          languages: applicationData.languages,
          special_skills: applicationData.specialSkills,
          available_from: applicationData.availableFrom,
          applied_at: new Date().toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to apply for job:', error);
      return false;
    }
  }

  // Get service ratings
  async getServiceRatings(crewId: string): Promise<ServiceRating[]> {
    try {
      const { data, error } = await supabase
        .from('service_ratings')
        .select(`
          id,
          rating,
          feedback,
          passenger_name,
          service_score,
          professionalism_score,
          communication_score,
          appearance_score,
          flights (
            departure_airport,
            arrival_airport,
            departure_datetime
          )
        `)
        .eq('crew_id', crewId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(rating => ({
        id: rating.id,
        flightId: rating.id,
        route: `${rating.flights.departure_airport} → ${rating.flights.arrival_airport}`,
        date: rating.flights.departure_datetime,
        rating: rating.rating,
        feedback: rating.feedback || '',
        passengerName: rating.passenger_name || 'Anonymous',
        categories: {
          service: rating.service_score || 5,
          professionalism: rating.professionalism_score || 5,
          communication: rating.communication_score || 5,
          appearance: rating.appearance_score || 5,
        },
      }));
    } catch (error) {
      console.error('Failed to fetch service ratings:', error);
      return [];
    }
  }

  // Get certifications
  async getCertifications(crewId: string): Promise<CrewCertification[]> {
    try {
      const { data, error } = await supabase
        .from('crew_certifications')
        .select('*')
        .eq('crew_id', crewId)
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

  // Toggle availability
  async toggleAvailability(crewId: string, newStatus: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ availability_status: newStatus })
        .eq('id', crewId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to update availability:', error);
      return false;
    }
  }

  // Complete flight and submit feedback
  async completeFlightAssignment(
    assignmentId: string,
    data: {
      passengerFeedback: string;
      incidentReports: string[];
      cabinCondition: string;
      inventoryUsed: string[];
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('crew_assignments')
        .update({
          status: 'completed',
          passenger_feedback: data.passengerFeedback,
          incident_reports: data.incidentReports,
          cabin_condition: data.cabinCondition,
          inventory_used: data.inventoryUsed,
          completed_at: new Date().toISOString(),
        })
        .eq('id', assignmentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to complete flight assignment:', error);
      return false;
    }
  }
}

export const crewDashboardService = new CrewDashboardService();














