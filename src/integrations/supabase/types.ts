export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      activity: {
        Row: {
          created_at: string
          id: string
          kind: string
          summary: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          summary: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          summary?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_invite_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string
          expires_at: string
          id: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          expires_at: string
          id?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          expires_at?: string
          id?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_invite_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_invite_codes_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_warnings: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          message: string
          severity: string
          user_id: string | null
          warning_type: string
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message: string
          severity?: string
          user_id?: string | null
          warning_type: string
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string
          severity?: string
          user_id?: string | null
          warning_type?: string
        }
        Relationships: []
      }
      aircraft: {
        Row: {
          aircraft_type: string
          availability_status: string
          base_location: string | null
          country: string | null
          created_at: string
          cruise_speed_knots: number | null
          description: string | null
          home_base_icao: string | null
          hourly_rate: number
          icao_type: string | null
          icao24: string | null
          id: string
          images: string[] | null
          manufacturer: string | null
          max_range_nm: number | null
          model: string | null
          mtow_kg: number | null
          operator_cert: string | null
          operator_id: string
          operator_name: string | null
          registry_source: string | null
          seats: number
          tail_number: string
          updated_at: string
          year_manufactured: number | null
        }
        Insert: {
          aircraft_type: string
          availability_status?: string
          base_location?: string | null
          country?: string | null
          created_at?: string
          cruise_speed_knots?: number | null
          description?: string | null
          home_base_icao?: string | null
          hourly_rate: number
          icao_type?: string | null
          icao24?: string | null
          id?: string
          images?: string[] | null
          manufacturer?: string | null
          max_range_nm?: number | null
          model?: string | null
          mtow_kg?: number | null
          operator_cert?: string | null
          operator_id: string
          operator_name?: string | null
          registry_source?: string | null
          seats: number
          tail_number: string
          updated_at?: string
          year_manufactured?: number | null
        }
        Update: {
          aircraft_type?: string
          availability_status?: string
          base_location?: string | null
          country?: string | null
          created_at?: string
          cruise_speed_knots?: number | null
          description?: string | null
          home_base_icao?: string | null
          hourly_rate?: number
          icao_type?: string | null
          icao24?: string | null
          id?: string
          images?: string[] | null
          manufacturer?: string | null
          max_range_nm?: number | null
          model?: string | null
          mtow_kg?: number | null
          operator_cert?: string | null
          operator_id?: string
          operator_name?: string | null
          registry_source?: string | null
          seats?: number
          tail_number?: string
          updated_at?: string
          year_manufactured?: number | null
        }
        Relationships: []
      }
      aircraft_utilization: {
        Row: {
          aircraft_id: string
          created_at: string
          flight_hours: number
          id: string
          last_flight_date: string | null
          maintenance_due_date: string | null
          revenue_generated: number
          status: string
          updated_at: string
          utilization_percentage: number
        }
        Insert: {
          aircraft_id: string
          created_at?: string
          flight_hours: number
          id?: string
          last_flight_date?: string | null
          maintenance_due_date?: string | null
          revenue_generated: number
          status?: string
          updated_at?: string
          utilization_percentage: number
        }
        Update: {
          aircraft_id?: string
          created_at?: string
          flight_hours?: number
          id?: string
          last_flight_date?: string | null
          maintenance_due_date?: string | null
          revenue_generated?: number
          status?: string
          updated_at?: string
          utilization_percentage?: number
        }
        Relationships: []
      }
      airports: {
        Row: {
          country: string | null
          geom: unknown | null
          iata: string | null
          icao: string
          lat: number | null
          lon: number | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          geom?: unknown | null
          iata?: string | null
          icao: string
          lat?: number | null
          lon?: number | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          geom?: unknown | null
          iata?: string | null
          icao?: string
          lat?: number | null
          lon?: number | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      api_integrations: {
        Row: {
          api_endpoint: string
          api_key_encrypted: string | null
          created_at: string
          id: string
          integration_name: string
          last_sync: string | null
          status: string
          sync_frequency: string | null
          updated_at: string
        }
        Insert: {
          api_endpoint: string
          api_key_encrypted?: string | null
          created_at?: string
          id?: string
          integration_name: string
          last_sync?: string | null
          status?: string
          sync_frequency?: string | null
          updated_at?: string
        }
        Update: {
          api_endpoint?: string
          api_key_encrypted?: string | null
          created_at?: string
          id?: string
          integration_name?: string
          last_sync?: string | null
          status?: string
          sync_frequency?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string
          after_values: Json | null
          before_values: Json | null
          created_at: string
          id: string
          request_hash: string | null
          session_hash: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          action: string
          actor_id: string
          after_values?: Json | null
          before_values?: Json | null
          created_at?: string
          id?: string
          request_hash?: string | null
          session_hash?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          action?: string
          actor_id?: string
          after_values?: Json | null
          before_values?: Json | null
          created_at?: string
          id?: string
          request_hash?: string | null
          session_hash?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      bids: {
        Row: {
          bid_amount: number
          broker_id: string
          created_at: string
          expires_at: string | null
          id: string
          listing_id: string
          message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          bid_amount: number
          broker_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          listing_id: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          bid_amount?: number
          broker_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          listing_id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_schedules: {
        Row: {
          billing_type: string
          created_at: string
          currency: string
          deal_id: string
          id: string
          schedule_data: Json
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          billing_type?: string
          created_at?: string
          currency?: string
          deal_id: string
          id?: string
          schedule_data: Json
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          billing_type?: string
          created_at?: string
          currency?: string
          deal_id?: string
          id?: string
          schedule_data?: Json
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      commission_settings: {
        Row: {
          applies_to_role: string
          commission_rate: number
          created_at: string
          id: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          applies_to_role: string
          commission_rate: number
          created_at?: string
          id?: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          applies_to_role?: string
          commission_rate?: number
          created_at?: string
          id?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          country: string | null
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          reg_no: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          reg_no?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          reg_no?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      company_members: {
        Row: {
          company_id: string
          joined_at: string | null
          member_role: string
          user_id: string
        }
        Insert: {
          company_id: string
          joined_at?: string | null
          member_role: string
          user_id: string
        }
        Update: {
          company_id?: string
          joined_at?: string | null
          member_role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      contracts: {
        Row: {
          broker_signature_date: string | null
          contract_content: string
          contract_template: string
          created_at: string
          created_by: string
          deal_id: string
          id: string
          operator_signature_date: string | null
          signed_by_broker: string | null
          signed_by_operator: string | null
          status: string
          updated_at: string
        }
        Insert: {
          broker_signature_date?: string | null
          contract_content: string
          contract_template: string
          created_at?: string
          created_by: string
          deal_id: string
          id?: string
          operator_signature_date?: string | null
          signed_by_broker?: string | null
          signed_by_operator?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          broker_signature_date?: string | null
          contract_content?: string
          contract_template?: string
          created_at?: string
          created_by?: string
          deal_id?: string
          id?: string
          operator_signature_date?: string | null
          signed_by_broker?: string | null
          signed_by_operator?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      credentials: {
        Row: {
          created_at: string
          expires_at: string | null
          file_id: string | null
          id: string
          issued_at: string | null
          issuer: string | null
          number_masked: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          file_id?: string | null
          id?: string
          issued_at?: string | null
          issuer?: string | null
          number_masked?: string | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          file_id?: string | null
          id?: string
          issued_at?: string | null
          issuer?: string | null
          number_masked?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      crew_availability: {
        Row: {
          available_from: string
          available_to: string
          created_at: string
          crew_id: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          available_from: string
          available_to: string
          created_at?: string
          crew_id: string
          id?: string
          notes?: string | null
          status?: string
        }
        Update: {
          available_from?: string
          available_to?: string
          created_at?: string
          crew_id?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: []
      }
      crew_certifications: {
        Row: {
          certification_name: string
          certification_number: string | null
          created_at: string
          crew_id: string
          document_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuing_authority: string | null
          status: string
        }
        Insert: {
          certification_name: string
          certification_number?: string | null
          created_at?: string
          crew_id: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          status?: string
        }
        Update: {
          certification_name?: string
          certification_number?: string | null
          created_at?: string
          crew_id?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          status?: string
        }
        Relationships: []
      }
      crew_profiles: {
        Row: {
          availability_status: string
          base_location: string | null
          bio: string | null
          certifications: string[] | null
          created_at: string
          crew_type: string
          experience_years: number | null
          hourly_rate: number | null
          id: string
          languages: string[] | null
          license_number: string | null
          license_type: string | null
          profile_image_url: string | null
          total_flight_hours: number | null
          updated_at: string
          user_id: string
          willing_to_travel: boolean | null
        }
        Insert: {
          availability_status?: string
          base_location?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          crew_type?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          license_number?: string | null
          license_type?: string | null
          profile_image_url?: string | null
          total_flight_hours?: number | null
          updated_at?: string
          user_id: string
          willing_to_travel?: boolean | null
        }
        Update: {
          availability_status?: string
          base_location?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          crew_type?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          license_number?: string | null
          license_type?: string | null
          profile_image_url?: string | null
          total_flight_hours?: number | null
          updated_at?: string
          user_id?: string
          willing_to_travel?: boolean | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          aircraft_id: string
          broker_id: string
          contract_terms: string | null
          created_at: string
          final_amount: number
          flight_date: string | null
          id: string
          listing_id: string
          operator_id: string
          status: string
          updated_at: string
          winning_bid_id: string | null
        }
        Insert: {
          aircraft_id: string
          broker_id: string
          contract_terms?: string | null
          created_at?: string
          final_amount: number
          flight_date?: string | null
          id?: string
          listing_id: string
          operator_id: string
          status?: string
          updated_at?: string
          winning_bid_id?: string | null
        }
        Update: {
          aircraft_id?: string
          broker_id?: string
          contract_terms?: string | null
          created_at?: string
          final_amount?: number
          flight_date?: string | null
          id?: string
          listing_id?: string
          operator_id?: string
          status?: string
          updated_at?: string
          winning_bid_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_winning_bid_id_fkey"
            columns: ["winning_bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_accounts: {
        Row: {
          account_id: string
          balance: number
          created_at: string
          currency: string
          deal_id: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          account_id: string
          balance?: number
          created_at?: string
          currency?: string
          deal_id: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          balance?: number
          created_at?: string
          currency?: string
          deal_id?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      experience: {
        Row: {
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          start_date: string
          title: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date: string
          title: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      hiring_requests: {
        Row: {
          accepted_at: string | null
          aircraft_type: string | null
          broker_id: string
          completed_at: string | null
          created_at: string
          crew_id: string
          departure_location: string | null
          destination: string | null
          duration_hours: number | null
          flight_date: string | null
          hiring_fee: number | null
          id: string
          job_description: string | null
          job_title: string
          message: string | null
          offered_rate: number | null
          return_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          aircraft_type?: string | null
          broker_id: string
          completed_at?: string | null
          created_at?: string
          crew_id: string
          departure_location?: string | null
          destination?: string | null
          duration_hours?: number | null
          flight_date?: string | null
          hiring_fee?: number | null
          id?: string
          job_description?: string | null
          job_title: string
          message?: string | null
          offered_rate?: number | null
          return_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          aircraft_type?: string | null
          broker_id?: string
          completed_at?: string | null
          created_at?: string
          crew_id?: string
          departure_location?: string | null
          destination?: string | null
          duration_hours?: number | null
          flight_date?: string | null
          hiring_fee?: number | null
          id?: string
          job_description?: string | null
          job_title?: string
          message?: string | null
          offered_rate?: number | null
          return_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      hourly_rate_baseline: {
        Row: {
          as_of_date: string
          baseline_usd: number
          class: string
          source: string | null
        }
        Insert: {
          as_of_date: string
          baseline_usd: number
          class: string
          source?: string | null
        }
        Update: {
          as_of_date?: string
          baseline_usd?: number
          class?: string
          source?: string | null
        }
        Relationships: []
      }
      maintenance_schedules: {
        Row: {
          actual_cost: number | null
          aircraft_id: string
          cost_estimate: number | null
          created_at: string
          estimated_duration_hours: number
          id: string
          maintenance_type: string
          notes: string | null
          scheduled_date: string
          status: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          aircraft_id: string
          cost_estimate?: number | null
          created_at?: string
          estimated_duration_hours: number
          id?: string
          maintenance_type: string
          notes?: string | null
          scheduled_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          aircraft_id?: string
          cost_estimate?: number | null
          created_at?: string
          estimated_duration_hours?: number
          id?: string
          maintenance_type?: string
          notes?: string | null
          scheduled_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_analytics: {
        Row: {
          aircraft_type: string
          avg_price: number
          created_at: string
          demand_score: number | null
          id: string
          listing_count: number
          max_price: number
          min_price: number
          route: string
          trend_direction: string | null
          updated_at: string
        }
        Insert: {
          aircraft_type: string
          avg_price: number
          created_at?: string
          demand_score?: number | null
          id?: string
          listing_count: number
          max_price: number
          min_price: number
          route: string
          trend_direction?: string | null
          updated_at?: string
        }
        Update: {
          aircraft_type?: string
          avg_price?: number
          created_at?: string
          demand_score?: number | null
          id?: string
          listing_count?: number
          max_price?: number
          min_price?: number
          route?: string
          trend_direction?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      market_trends: {
        Row: {
          aircraft_type: string
          confidence_score: number | null
          created_at: string
          forecast_period: string
          id: string
          route: string
          trend_data: Json
        }
        Insert: {
          aircraft_type: string
          confidence_score?: number | null
          created_at?: string
          forecast_period: string
          id?: string
          route: string
          trend_data: Json
        }
        Update: {
          aircraft_type?: string
          confidence_score?: number | null
          created_at?: string
          forecast_period?: string
          id?: string
          route?: string
          trend_data?: Json
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          aircraft_id: string
          asking_price: number
          created_at: string
          departure_date: string | null
          departure_location: string
          description: string | null
          destination: string | null
          expires_at: string | null
          flight_hours: number | null
          id: string
          listing_type: string
          minimum_bid: number | null
          operator_id: string
          passengers: number | null
          return_date: string | null
          special_requirements: string | null
          status: string
          updated_at: string
        }
        Insert: {
          aircraft_id: string
          asking_price: number
          created_at?: string
          departure_date?: string | null
          departure_location: string
          description?: string | null
          destination?: string | null
          expires_at?: string | null
          flight_hours?: number | null
          id?: string
          listing_type?: string
          minimum_bid?: number | null
          operator_id: string
          passengers?: number | null
          return_date?: string | null
          special_requirements?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          aircraft_id?: string
          asking_price?: number
          created_at?: string
          departure_date?: string | null
          departure_location?: string
          description?: string | null
          destination?: string | null
          expires_at?: string | null
          flight_hours?: number | null
          id?: string
          listing_type?: string
          minimum_bid?: number | null
          operator_id?: string
          passengers?: number | null
          return_date?: string | null
          special_requirements?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
        ]
      }
      message_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          message_id: string
          mime_type: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          message_id: string
          mime_type?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          message_id?: string
          mime_type?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          deal_id: string
          has_violations: boolean | null
          id: string
          message_type: string | null
          read_at: string | null
          redacted_content: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deal_id: string
          has_violations?: boolean | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          redacted_content?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deal_id?: string
          has_violations?: boolean | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          redacted_content?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      operators: {
        Row: {
          authority: string | null
          certificate_no: string | null
          contact: Json | null
          country: string | null
          id: string
          name: string
          regions: string[] | null
          updated_at: string | null
        }
        Insert: {
          authority?: string | null
          certificate_no?: string | null
          contact?: Json | null
          country?: string | null
          id?: string
          name: string
          regions?: string[] | null
          updated_at?: string | null
        }
        Update: {
          authority?: string | null
          certificate_no?: string | null
          contact?: Json | null
          country?: string | null
          id?: string
          name?: string
          regions?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content: string
          content_type: string
          created_at: string
          id: string
          page_name: string
          section_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content: string
          content_type?: string
          created_at?: string
          id?: string
          page_name: string
          section_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          id?: string
          page_name?: string
          section_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          commission_amount: number | null
          created_at: string
          currency: string
          deal_id: string
          id: string
          payer_id: string
          payment_method: string | null
          payment_type: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          commission_amount?: number | null
          created_at?: string
          currency?: string
          deal_id: string
          id?: string
          payer_id: string
          payment_method?: string | null
          payment_type: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          commission_amount?: number | null
          created_at?: string
          currency?: string
          deal_id?: string
          id?: string
          payer_id?: string
          payment_method?: string | null
          payment_type?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          created_at: string
          id: string
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_type?: string
          metric_value?: number
          period_end?: string
          period_start?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_admins: {
        Row: {
          is_admin: boolean | null
          is_reviewer: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          is_admin?: boolean | null
          is_reviewer?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          is_admin?: boolean | null
          is_reviewer?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_admins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      privacy_settings: {
        Row: {
          allow_messages: boolean | null
          created_at: string
          id: string
          show_activity: boolean | null
          show_email: boolean | null
          show_phone: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_messages?: boolean | null
          created_at?: string
          id?: string
          show_activity?: boolean | null
          show_email?: boolean | null
          show_phone?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_messages?: boolean | null
          created_at?: string
          id?: string
          show_activity?: boolean | null
          show_email?: boolean | null
          show_phone?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string | null
          display_name: string
          phone: string | null
          platform_role: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          display_name: string
          phone?: string | null
          platform_role: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          display_name?: string
          phone?: string | null
          platform_role?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      psych_consent: {
        Row: {
          share_profile: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          share_profile?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          share_profile?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "psych_consent_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      psych_items: {
        Row: {
          id: string
          is_active: boolean | null
          module_id: string | null
          payload: Json
          trait_map: Json
          type: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          module_id?: string | null
          payload: Json
          trait_map: Json
          type: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          module_id?: string | null
          payload?: Json
          trait_map?: Json
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "psych_items_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "psych_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      psych_modules: {
        Row: {
          code: string
          config: Json | null
          id: string
          item_count: number
          name: string
          order_index: number
          test_id: string | null
          time_hint_min: number
        }
        Insert: {
          code: string
          config?: Json | null
          id?: string
          item_count: number
          name: string
          order_index: number
          test_id?: string | null
          time_hint_min: number
        }
        Update: {
          code?: string
          config?: Json | null
          id?: string
          item_count?: number
          name?: string
          order_index?: number
          test_id?: string | null
          time_hint_min?: number
        }
        Relationships: [
          {
            foreignKeyName: "psych_modules_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "psych_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      psych_norms: {
        Row: {
          mean: number
          sd: number
          trait: string
        }
        Insert: {
          mean: number
          sd: number
          trait: string
        }
        Update: {
          mean?: number
          sd?: number
          trait?: string
        }
        Relationships: []
      }
      psych_responses: {
        Row: {
          created_at: string | null
          id: string
          item_id: string | null
          module_id: string | null
          ms_elapsed: number | null
          response: Json
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          module_id?: string | null
          ms_elapsed?: number | null
          response: Json
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          module_id?: string | null
          ms_elapsed?: number | null
          response?: Json
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "psych_responses_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "psych_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psych_responses_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "psych_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psych_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "psych_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psych_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      psych_scores: {
        Row: {
          created_at: string | null
          id: string
          module_code: string | null
          percentile: number | null
          raw: number
          session_id: string | null
          trait: string
          user_id: string | null
          zscore: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          module_code?: string | null
          percentile?: number | null
          raw: number
          session_id?: string | null
          trait: string
          user_id?: string | null
          zscore?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          module_code?: string | null
          percentile?: number | null
          raw?: number
          session_id?: string | null
          trait?: string
          user_id?: string | null
          zscore?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "psych_scores_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "psych_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psych_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      psych_sessions: {
        Row: {
          attention_flags: Json | null
          completed_at: string | null
          id: string
          seconds_spent: number | null
          started_at: string | null
          status: string | null
          test_id: string | null
          user_id: string | null
        }
        Insert: {
          attention_flags?: Json | null
          completed_at?: string | null
          id?: string
          seconds_spent?: number | null
          started_at?: string | null
          status?: string | null
          test_id?: string | null
          user_id?: string | null
        }
        Update: {
          attention_flags?: Json | null
          completed_at?: string | null
          id?: string
          seconds_spent?: number | null
          started_at?: string | null
          status?: string | null
          test_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "psych_sessions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "psych_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psych_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      psych_share_tokens: {
        Row: {
          created_at: string | null
          expires_at: string | null
          token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          token?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "psych_share_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      psych_tests: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          duration_min: number
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          duration_min?: number
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          duration_min?: number
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          aircraft_choice: string | null
          created_at: string | null
          date_utc: string | null
          dest_icao: string | null
          driver_breakdown_json: Json | null
          est_price_usd: number | null
          id: string
          origin_icao: string | null
          pax: number | null
          request_id: string | null
        }
        Insert: {
          aircraft_choice?: string | null
          created_at?: string | null
          date_utc?: string | null
          dest_icao?: string | null
          driver_breakdown_json?: Json | null
          est_price_usd?: number | null
          id?: string
          origin_icao?: string | null
          pax?: number | null
          request_id?: string | null
        }
        Update: {
          aircraft_choice?: string | null
          created_at?: string | null
          date_utc?: string | null
          dest_icao?: string | null
          driver_breakdown_json?: Json | null
          est_price_usd?: number | null
          id?: string
          origin_icao?: string | null
          pax?: number | null
          request_id?: string | null
        }
        Relationships: []
      }
      references: {
        Row: {
          created_at: string
          id: string
          note: string | null
          ref_company: string | null
          ref_contact_masked: string | null
          ref_name: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          ref_company?: string | null
          ref_contact_masked?: string | null
          ref_name: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          ref_company?: string | null
          ref_contact_masked?: string | null
          ref_name?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      sanctions_entities: {
        Row: {
          addresses: string[] | null
          aliases: string[] | null
          birth_date: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          name: string
          nationalities: string[] | null
          risk_score: number | null
          sanctions_authority: string | null
          sanctions_date: string | null
          sanctions_reason: string | null
          status: string
          updated_at: string
        }
        Insert: {
          addresses?: string[] | null
          aliases?: string[] | null
          birth_date?: string | null
          created_at?: string
          entity_id: string
          entity_type?: string
          id?: string
          name: string
          nationalities?: string[] | null
          risk_score?: number | null
          sanctions_authority?: string | null
          sanctions_date?: string | null
          sanctions_reason?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          addresses?: string[] | null
          aliases?: string[] | null
          birth_date?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          name?: string
          nationalities?: string[] | null
          risk_score?: number | null
          sanctions_authority?: string | null
          sanctions_date?: string | null
          sanctions_reason?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sanctions_lists: {
        Row: {
          checksum: string | null
          created_at: string
          id: string
          last_updated: string
          list_name: string
          record_count: number
          source: string
          status: string
        }
        Insert: {
          checksum?: string | null
          created_at?: string
          id?: string
          last_updated?: string
          list_name: string
          record_count?: number
          source?: string
          status?: string
        }
        Update: {
          checksum?: string | null
          created_at?: string
          id?: string
          last_updated?: string
          list_name?: string
          record_count?: number
          source?: string
          status?: string
        }
        Relationships: []
      }
      sanctions_matches: {
        Row: {
          created_at: string
          entity_id: string
          false_positive: boolean | null
          id: string
          match_details: Json | null
          match_score: number
          match_type: string
          screening_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          false_positive?: boolean | null
          id?: string
          match_details?: Json | null
          match_score?: number
          match_type?: string
          screening_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          false_positive?: boolean | null
          id?: string
          match_details?: Json | null
          match_score?: number
          match_type?: string
          screening_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sanctions_matches_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "sanctions_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sanctions_matches_screening_id_fkey"
            columns: ["screening_id"]
            isOneToOne: false
            referencedRelation: "sanctions_screenings"
            referencedColumns: ["id"]
          },
        ]
      }
      sanctions_screenings: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          matches_found: number
          risk_level: string
          screened_at: string
          screening_type: string
          search_terms: Json
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          matches_found?: number
          risk_level?: string
          screened_at?: string
          screening_type?: string
          search_terms: Json
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          matches_found?: number
          risk_level?: string
          screened_at?: string
          screening_type?: string
          search_terms?: Json
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          alert_enabled: boolean | null
          created_at: string
          filters: Json
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_enabled?: boolean | null
          created_at?: string
          filters: Json
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_enabled?: boolean | null
          created_at?: string
          filters?: Json
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          blocked: boolean | null
          created_at: string
          description: string
          event_type: string
          id: string
          ip_hash: string | null
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_agent_hash: string | null
          user_id: string | null
        }
        Insert: {
          blocked?: boolean | null
          created_at?: string
          description: string
          event_type: string
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_agent_hash?: string | null
          user_id?: string | null
        }
        Update: {
          blocked?: boolean | null
          created_at?: string
          description?: string
          event_type?: string
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_agent_hash?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          description: string | null
          id: string
          setting_name: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_name: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_name?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      signals: {
        Row: {
          last_seen_icao: string | null
          last_seen_time: string | null
          reposition_bias_km: number | null
          tail_number: string
          utilisation_hrs_7d: number | null
        }
        Insert: {
          last_seen_icao?: string | null
          last_seen_time?: string | null
          reposition_bias_km?: number | null
          tail_number: string
          utilisation_hrs_7d?: number | null
        }
        Update: {
          last_seen_icao?: string | null
          last_seen_time?: string | null
          reposition_bias_km?: number | null
          tail_number?: string
          utilisation_hrs_7d?: number | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      strikes: {
        Row: {
          count: number
          created_at: string
          created_by: string
          id: string
          notes: string | null
          reason: string
          resolved_at: string | null
          resolved_by: string | null
          resolved_flag: boolean
          severity: string
          user_id: string
        }
        Insert: {
          count?: number
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          reason: string
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_flag?: boolean
          severity?: string
          user_id: string
        }
        Update: {
          count?: number
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          reason?: string
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_flag?: boolean
          severity?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          badge_icon: string | null
          description: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          badge_icon?: string | null
          description: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          badge_icon?: string | null
          description?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          email_verified: boolean | null
          full_name: string | null
          headline: string | null
          id: string
          level: number | null
          location: string | null
          phone_verified: boolean | null
          role: string
          trust_score: number | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email_verified?: boolean | null
          full_name?: string | null
          headline?: string | null
          id?: string
          level?: number | null
          location?: string | null
          phone_verified?: boolean | null
          role?: string
          trust_score?: number | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email_verified?: boolean | null
          full_name?: string | null
          headline?: string | null
          id?: string
          level?: number | null
          location?: string | null
          phone_verified?: boolean | null
          role?: string
          trust_score?: number | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      user_ratings: {
        Row: {
          category: string
          comment: string | null
          created_at: string
          deal_id: string
          id: string
          rated_user_id: string
          rater_user_id: string
          rating: number
        }
        Insert: {
          category: string
          comment?: string | null
          created_at?: string
          deal_id: string
          id?: string
          rated_user_id: string
          rater_user_id: string
          rating: number
        }
        Update: {
          category?: string
          comment?: string | null
          created_at?: string
          deal_id?: string
          id?: string
          rated_user_id?: string
          rater_user_id?: string
          rating?: number
        }
        Relationships: []
      }
      user_reviews: {
        Row: {
          created_at: string | null
          deal_id: string | null
          hiring_request_id: string | null
          id: string
          is_verified: boolean | null
          rating: number
          review_text: string | null
          review_type: string
          reviewee_id: string
          reviewer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          hiring_request_id?: string | null
          id?: string
          is_verified?: boolean | null
          rating: number
          review_text?: string | null
          review_type: string
          reviewee_id: string
          reviewer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          hiring_request_id?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          review_text?: string | null
          review_type?: string
          reviewee_id?: string
          reviewer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reviews_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reviews_hiring_request_id_fkey"
            columns: ["hiring_request_id"]
            isOneToOne: false
            referencedRelation: "hiring_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          last_activity: string
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: string | null
          last_activity?: string
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          last_activity?: string
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          access_code_hash: string
          company_name: string | null
          created_at: string
          email: string
          email_verification_expires_at: string | null
          email_verification_token: string | null
          email_verified: boolean
          failed_login_count: number
          full_name: string | null
          id: string
          is_active: boolean
          last_login_at: string | null
          locked_until: string | null
          password_hash: string
          password_reset_expires_at: string | null
          password_reset_token: string | null
          role: string
          updated_at: string
          username: string
          verification_status: string
        }
        Insert: {
          access_code_hash: string
          company_name?: string | null
          created_at?: string
          email: string
          email_verification_expires_at?: string | null
          email_verification_token?: string | null
          email_verified?: boolean
          failed_login_count?: number
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          locked_until?: string | null
          password_hash: string
          password_reset_expires_at?: string | null
          password_reset_token?: string | null
          role: string
          updated_at?: string
          username: string
          verification_status?: string
        }
        Update: {
          access_code_hash?: string
          company_name?: string | null
          created_at?: string
          email?: string
          email_verification_expires_at?: string | null
          email_verification_token?: string | null
          email_verified?: boolean
          failed_login_count?: number
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          locked_until?: string | null
          password_hash?: string
          password_reset_expires_at?: string | null
          password_reset_token?: string | null
          role?: string
          updated_at?: string
          username?: string
          verification_status?: string
        }
        Relationships: []
      }
      verification_documents: {
        Row: {
          created_at: string
          document_type: string
          file_name: string
          file_url: string
          id: string
          rejection_reason: string | null
          sanctions_risk_level: string | null
          sanctions_screened: boolean | null
          sanctions_screening_id: string | null
          status: string
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          file_name: string
          file_url: string
          id?: string
          rejection_reason?: string | null
          sanctions_risk_level?: string | null
          sanctions_screened?: boolean | null
          sanctions_screening_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          file_name?: string
          file_url?: string
          id?: string
          rejection_reason?: string | null
          sanctions_risk_level?: string | null
          sanctions_screened?: boolean | null
          sanctions_screening_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_documents_sanctions_screening_id_fkey"
            columns: ["sanctions_screening_id"]
            isOneToOne: false
            referencedRelation: "sanctions_screenings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { "": unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { "": unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      addauth: {
        Args: { "": string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
        Returns: string
      }
      box: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { "": unknown }
        Returns: unknown
      }
      bytea: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
      cleanup_old_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_ai_warning: {
        Args: {
          p_expires_hours?: number
          p_message: string
          p_severity?: string
          p_user_id: string
          p_warning_type: string
        }
        Returns: string
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      distance_nm: {
        Args: { dest_icao: string; origin_icao: string }
        Returns: number
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
          | { column_name: string; schema_name: string; table_name: string }
          | { column_name: string; table_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      find_nearest_airport: {
        Args: { lat_param: number; lon_param: number }
        Returns: {
          distance_km: number
          icao: string
        }[]
      }
      generate_access_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_unique_profile_username: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_unique_username: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      geography: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { "": unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { "": unknown }
        Returns: number
      }
      geometry_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { "": unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      get_available_crew_basic_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          availability_status: string
          certifications: string[]
          created_at: string
          crew_type: string
          experience_years: number
          id: string
          languages: string[]
        }[]
      }
      get_proj4_from_srid: {
        Args: { "": number }
        Returns: string
      }
      get_user_security_status: {
        Args: { p_user_id: string }
        Returns: Json
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      json: {
        Args: { "": unknown }
        Returns: Json
      }
      jsonb: {
        Args: { "": unknown }
        Returns: Json
      }
      log_security_event: {
        Args: {
          p_description?: string
          p_event_type: string
          p_metadata?: Json
          p_severity?: string
          p_user_id: string
        }
        Returns: string
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      nearest_aircraft_by_type: {
        Args: { icao_type_in: string; limit_n: number; origin_icao: string }
        Returns: {
          km: number
          tail_number: string
        }[]
      }
      path: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      point: {
        Args: { "": unknown }
        Returns: unknown
      }
      polygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean }
        Returns: number
      }
      postgis_addbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { "": unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { "": number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      spheroid_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_ashexewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { format?: string; geom: unknown }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; rel?: number }
          | { geom: unknown; maxdecimaldigits?: number; rel?: number }
        Returns: string
      }
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; options?: string; radius: number }
          | { geom: unknown; quadsegs: number; radius: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { "": unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { "": unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { dm?: number; dx: number; dy: number; dz?: number; geom: unknown }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { "": unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: { "": unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_letters: {
        Args: { font?: Json; letters: string }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { "": unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multi: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_ndims: {
        Args: { "": unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_nrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_points: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { from_proj: string; geom: unknown; to_proj: string }
          | { from_proj: string; geom: unknown; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      st_x: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmin: {
        Args: { "": unknown }
        Returns: number
      }
      st_y: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymax: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymin: {
        Args: { "": unknown }
        Returns: number
      }
      st_z: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmin: {
        Args: { "": unknown }
        Returns: number
      }
      text: {
        Args: { "": unknown }
        Returns: string
      }
      unlockrows: {
        Args: { "": string }
        Returns: number
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
