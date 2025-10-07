// Quote Loop Service
// Handles all quote loop transactions (RFQ → Quote → Deal → Payment)

import { supabase } from '@/integrations/supabase/client'

export interface RFQData {
  client_name: string
  client_company?: string
  client_email?: string
  client_phone?: string
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  passenger_count: number
  aircraft_preferences?: Record<string, any>
  budget_min?: number
  budget_max?: number
  currency?: string
  urgency?: 'low' | 'normal' | 'high' | 'urgent'
  expires_at?: string
  notes?: string
  special_requirements?: string
}

export interface QuoteData {
  rfq_id: string
  price: number
  currency?: string
  aircraft_id?: string
  aircraft_model?: string
  aircraft_tail_number?: string
  valid_until: string
  terms?: string
  notes?: string
}

export interface CrewHiringData {
  deal_id?: string
  flight_id?: string
  pilot_id: string
  route: string
  departure_date: string
  arrival_date: string
  daily_rate: number
  total_payment: number
  commission_rate?: number
  currency?: string
}

export interface NotificationData {
  id: string
  type: string
  title: string
  message: string
  data: Record<string, any>
  read: boolean
  created_at: string
}

class QuoteLoopService {
  // RFQ Management
  async createRFQ(rfqData: RFQData) {
    try {
      const { data, error } = await supabase.functions.invoke('create-rfq', {
        body: rfqData
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating RFQ:', error)
      throw error
    }
  }

  async getRFQs(status?: string) {
    try {
      let query = supabase
        .from('rfqs')
        .select(`
          *,
          users!rfqs_broker_id_fkey (
            full_name,
            email
          ),
          quotes (
            id,
            price,
            currency,
            status,
            created_at,
            users!quotes_operator_id_fkey (
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching RFQs:', error)
      throw error
    }
  }

  async getRFQById(id: string) {
    try {
      const { data, error } = await supabase
        .from('rfqs')
        .select(`
          *,
          users!rfqs_broker_id_fkey (
            full_name,
            email
          ),
          quotes (
            id,
            price,
            currency,
            status,
            created_at,
            valid_until,
            aircraft_model,
            aircraft_tail_number,
            notes,
            users!quotes_operator_id_fkey (
              full_name,
              email
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching RFQ:', error)
      throw error
    }
  }

  // Quote Management
  async submitQuote(quoteData: QuoteData) {
    try {
      const { data, error } = await supabase.functions.invoke('submit-quote', {
        body: quoteData
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error submitting quote:', error)
      throw error
    }
  }

  async getQuotes(rfqId?: string) {
    try {
      let query = supabase
        .from('quotes')
        .select(`
          *,
          rfqs!quotes_rfq_id_fkey (
            id,
            client_name,
            origin,
            destination,
            departure_date,
            passenger_count,
            users!rfqs_broker_id_fkey (
              full_name
            )
          ),
          users!quotes_operator_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (rfqId) {
        query = query.eq('rfq_id', rfqId)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching quotes:', error)
      throw error
    }
  }

  async acceptQuote(quoteId: string, paymentIntentId?: string) {
    try {
      const { data, error } = await supabase.functions.invoke('accept-quote', {
        body: {
          quote_id: quoteId,
          payment_intent_id: paymentIntentId
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error accepting quote:', error)
      throw error
    }
  }

  // Deal Management
  async getDeals() {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          rfqs!deals_rfq_id_fkey (
            id,
            client_name,
            origin,
            destination,
            departure_date,
            passenger_count
          ),
          quotes!deals_quote_id_fkey (
            id,
            price,
            currency,
            aircraft_model
          ),
          users!deals_broker_id_fkey (
            full_name
          ),
          users!deals_operator_id_fkey (
            full_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching deals:', error)
      throw error
    }
  }

  async getDealById(id: string) {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          rfqs!deals_rfq_id_fkey (
            id,
            client_name,
            origin,
            destination,
            departure_date,
            passenger_count,
            notes
          ),
          quotes!deals_quote_id_fkey (
            id,
            price,
            currency,
            aircraft_model,
            aircraft_tail_number,
            terms
          ),
          users!deals_broker_id_fkey (
            full_name,
            email
          ),
          users!deals_operator_id_fkey (
            full_name,
            email
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching deal:', error)
      throw error
    }
  }

  // Crew Hiring
  async hireCrew(crewData: CrewHiringData) {
    try {
      const { data, error } = await supabase.functions.invoke('hire-crew', {
        body: crewData
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error hiring crew:', error)
      throw error
    }
  }

  async getCrewHiring() {
    try {
      const { data, error } = await supabase
        .from('crew_hiring')
        .select(`
          *,
          users!crew_hiring_pilot_id_fkey (
            full_name,
            email
          ),
          users!crew_hiring_hiring_party_id_fkey (
            full_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching crew hiring:', error)
      throw error
    }
  }

  // Notifications
  async getNotifications() {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  async getUnreadNotificationCount() {
    try {
      const { data, error } = await supabase.rpc('get_unread_notification_count', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching unread notification count:', error)
      throw error
    }
  }

  async markNotificationsRead(notificationIds?: string[]) {
    try {
      const { data, error } = await supabase.rpc('mark_notifications_read', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id,
        p_notification_ids: notificationIds || null
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error marking notifications as read:', error)
      throw error
    }
  }

  // Performance Metrics
  async getPerformanceMetrics(metricType?: string) {
    try {
      let query = supabase
        .from('performance_metrics')
        .select('*')
        .order('created_at', { ascending: false })

      if (metricType) {
        query = query.eq('metric_type', metricType)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching performance metrics:', error)
      throw error
    }
  }

  // Real-time subscriptions
  subscribeToRFQs(callback: (payload: any) => void) {
    return supabase
      .channel('rfqs')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rfqs' }, 
        callback
      )
      .subscribe()
  }

  subscribeToQuotes(callback: (payload: any) => void) {
    return supabase
      .channel('quotes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quotes' }, 
        callback
      )
      .subscribe()
  }

  subscribeToDeals(callback: (payload: any) => void) {
    return supabase
      .channel('deals')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'deals' }, 
        callback
      )
      .subscribe()
  }

  subscribeToNotifications(callback: (payload: any) => void) {
    return supabase
      .channel('notifications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications' }, 
        callback
      )
      .subscribe()
  }
}

export const quoteLoopService = new QuoteLoopService()

