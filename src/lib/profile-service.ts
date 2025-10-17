// Profile Service
// Handles operator profiles, company info, certifications, and fleet showcase

import { supabase } from '@/integrations/supabase/client';

export interface OperatorProfile {
  id: string;
  userId: string;
  companyName: string;
  fullName: string;
  email: string;
  phone?: string;
  companyInfo: {
    licenseNumber?: string;
    aocNumber?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    headquarters?: string;
    establishedYear?: number;
    totalFlights?: number;
  };
  certifications: Certification[];
  fleet: FleetAircraft[];
  verifications: {
    emailVerified: boolean;
    phoneVerified: boolean;
    identityVerified: boolean;
    businessVerified: boolean;
  };
  metadata?: Record<string, any>;
}

export interface Certification {
  id: string;
  type: string;
  name: string;
  issuer: string;
  certificateNumber?: string;
  issuedDate: string;
  expiryDate?: string;
  documentUrl?: string;
  status: 'active' | 'expired' | 'pending';
}

export interface FleetAircraft {
  id: string;
  operatorId: string;
  manufacturer: string;
  model: string;
  registration: string;
  category: string;
  seats: number;
  images: string[];
  description?: string;
  yearOfManufacture?: number;
  totalFlightHours?: number;
  lastMaintenance?: string;
  nextMaintenanceDue?: string;
  availability: 'available' | 'in-use' | 'maintenance';
}

class ProfileService {
  /**
   * Get operator's complete profile
   */
  async getOperatorProfile(userId: string): Promise<OperatorProfile> {
    try {
      // Get basic profile info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('Failed to fetch profile');
      }

      // Get certifications
      const { data: certifications, error: certsError } = await supabase
        .from('credentials')
        .select('*')
        .eq('user_id', userId)
        .order('issued_date', { ascending: false });

      if (certsError) {
        console.error('Error fetching certifications:', certsError);
      }

      // Get fleet
      const { data: fleet, error: fleetError } = await supabase
        .from('operator_fleet')
        .select('*')
        .eq('operator_id', userId)
        .order('created_at', { ascending: false });

      if (fleetError) {
        console.error('Error fetching fleet:', fleetError);
      }

      return {
        id: profile.id,
        userId: profile.id,
        companyName: profile.company_name || '',
        fullName: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        companyInfo: {
          licenseNumber: profile.license_number,
          aocNumber: profile.aoc_number,
          insuranceProvider: profile.insurance_provider,
          insurancePolicyNumber: profile.insurance_policy_number,
          headquarters: profile.headquarters,
          establishedYear: profile.established_year,
          totalFlights: profile.total_flights_completed || 0
        },
        certifications: certifications || [],
        fleet: fleet || [],
        verifications: {
          emailVerified: profile.email_verified || false,
          phoneVerified: profile.phone_verified || false,
          identityVerified: profile.identity_verified || false,
          businessVerified: profile.business_verified || false
        },
        metadata: profile.metadata || {}
      };
    } catch (error) {
      console.error('Error getting operator profile:', error);
      throw error;
    }
  }

  /**
   * Update operator profile
   */
  async updateOperatorProfile(
    userId: string,
    updates: Partial<OperatorProfile>
  ): Promise<OperatorProfile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          company_name: updates.companyName,
          full_name: updates.fullName,
          phone: updates.phone,
          license_number: updates.companyInfo?.licenseNumber,
          aoc_number: updates.companyInfo?.aocNumber,
          insurance_provider: updates.companyInfo?.insuranceProvider,
          insurance_policy_number: updates.companyInfo?.insurancePolicyNumber,
          headquarters: updates.companyInfo?.headquarters,
          established_year: updates.companyInfo?.establishedYear,
          metadata: updates.metadata
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile');
      }

      return await this.getOperatorProfile(userId);
    } catch (error) {
      console.error('Error updating operator profile:', error);
      throw error;
    }
  }

  /**
   * Add certification
   */
  async addCertification(
    userId: string,
    certification: Omit<Certification, 'id' | 'status'>
  ): Promise<Certification> {
    try {
      const { data, error } = await supabase
        .from('credentials')
        .insert([{
          user_id: userId,
          credential_type: certification.type,
          credential_name: certification.name,
          issuer: certification.issuer,
          certificate_number: certification.certificateNumber,
          issued_date: certification.issuedDate,
          expiry_date: certification.expiryDate,
          document_url: certification.documentUrl,
          status: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding certification:', error);
        throw new Error('Failed to add certification');
      }

      return data as Certification;
    } catch (error) {
      console.error('Error adding certification:', error);
      throw error;
    }
  }

  /**
   * Update certification
   */
  async updateCertification(
    certificationId: string,
    updates: Partial<Certification>
  ): Promise<Certification> {
    try {
      const { data, error } = await supabase
        .from('credentials')
        .update({
          credential_name: updates.name,
          issuer: updates.issuer,
          certificate_number: updates.certificateNumber,
          issued_date: updates.issuedDate,
          expiry_date: updates.expiryDate,
          document_url: updates.documentUrl,
          status: updates.status
        })
        .eq('id', certificationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating certification:', error);
        throw new Error('Failed to update certification');
      }

      return data as Certification;
    } catch (error) {
      console.error('Error updating certification:', error);
      throw error;
    }
  }

  /**
   * Delete certification
   */
  async deleteCertification(certificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('credentials')
        .delete()
        .eq('id', certificationId);

      if (error) {
        console.error('Error deleting certification:', error);
        throw new Error('Failed to delete certification');
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
      throw error;
    }
  }

  /**
   * Add aircraft to fleet
   */
  async addAircraft(
    operatorId: string,
    aircraft: Omit<FleetAircraft, 'id' | 'operatorId'>
  ): Promise<FleetAircraft> {
    try {
      const { data, error } = await supabase
        .from('operator_fleet')
        .insert([{
          operator_id: operatorId,
          manufacturer: aircraft.manufacturer,
          model: aircraft.model,
          registration: aircraft.registration,
          category: aircraft.category,
          seats: aircraft.seats,
          images: aircraft.images,
          description: aircraft.description,
          year_of_manufacture: aircraft.yearOfManufacture,
          total_flight_hours: aircraft.totalFlightHours,
          last_maintenance: aircraft.lastMaintenance,
          next_maintenance_due: aircraft.nextMaintenanceDue,
          availability: aircraft.availability
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding aircraft:', error);
        throw new Error('Failed to add aircraft');
      }

      return data as FleetAircraft;
    } catch (error) {
      console.error('Error adding aircraft:', error);
      throw error;
    }
  }

  /**
   * Update aircraft
   */
  async updateAircraft(
    aircraftId: string,
    updates: Partial<FleetAircraft>
  ): Promise<FleetAircraft> {
    try {
      const { data, error } = await supabase
        .from('operator_fleet')
        .update({
          manufacturer: updates.manufacturer,
          model: updates.model,
          registration: updates.registration,
          category: updates.category,
          seats: updates.seats,
          images: updates.images,
          description: updates.description,
          year_of_manufacture: updates.yearOfManufacture,
          total_flight_hours: updates.totalFlightHours,
          last_maintenance: updates.lastMaintenance,
          next_maintenance_due: updates.nextMaintenanceDue,
          availability: updates.availability
        })
        .eq('id', aircraftId)
        .select()
        .single();

      if (error) {
        console.error('Error updating aircraft:', error);
        throw new Error('Failed to update aircraft');
      }

      return data as FleetAircraft;
    } catch (error) {
      console.error('Error updating aircraft:', error);
      throw error;
    }
  }

  /**
   * Delete aircraft
   */
  async deleteAircraft(aircraftId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('operator_fleet')
        .delete()
        .eq('id', aircraftId);

      if (error) {
        console.error('Error deleting aircraft:', error);
        throw new Error('Failed to delete aircraft');
      }
    } catch (error) {
      console.error('Error deleting aircraft:', error);
      throw error;
    }
  }

  /**
   * Request verification
   */
  async requestVerification(
    userId: string,
    verificationType: 'email' | 'phone' | 'identity' | 'business',
    documents?: string[]
  ): Promise<void> {
    try {
      // In a real implementation, this would trigger the verification workflow
      // For now, just log the request
      console.log('Verification requested:', { userId, verificationType, documents });
      
      // Log to security events
      await supabase
        .from('security_events')
        .insert([{
          user_id: userId,
          event_type: 'verification_requested',
          details: {
            verificationType,
            documents,
            requestedAt: new Date().toISOString()
          }
        }]);
    } catch (error) {
      console.error('Error requesting verification:', error);
      throw error;
    }
  }

  /**
   * Get fleet statistics
   */
  async getFleetStatistics(operatorId: string) {
    try {
      const { data: fleet, error } = await supabase
        .from('operator_fleet')
        .select('*')
        .eq('operator_id', operatorId);

      if (error) {
        console.error('Error fetching fleet for stats:', error);
        return {
          totalAircraft: 0,
          availableAircraft: 0,
          inUseAircraft: 0,
          maintenanceAircraft: 0,
          totalSeats: 0,
          categories: {}
        };
      }

      const stats = {
        totalAircraft: fleet.length,
        availableAircraft: fleet.filter(a => a.availability === 'available').length,
        inUseAircraft: fleet.filter(a => a.availability === 'in-use').length,
        maintenanceAircraft: fleet.filter(a => a.availability === 'maintenance').length,
        totalSeats: fleet.reduce((sum, a) => sum + (a.seats || 0), 0),
        categories: fleet.reduce((acc, a) => {
          acc[a.category] = (acc[a.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      return stats;
    } catch (error) {
      console.error('Error getting fleet statistics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const profileService = new ProfileService();
