import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Event {
  id: string;
  type: string;
  actor_user_id: string | null;
  payload: any;
  occurred_at: string;
}

interface Finding {
  severity: 'info' | 'warn' | 'high' | 'critical';
  label: string;
  details: any;
  event_id: string;
  linked_object_type?: string;
  linked_object_id?: string;
}

interface Task {
  kind: 'alert' | 'review' | 'enrich' | 'generate_report' | 'route';
  summary: string;
  suggested_action: any;
  due_at?: string;
}

class MaxRulesEngine {
  private supabase: any;

  constructor(supabase: any) {
    this.supabase = supabase;
  }

  async processEvent(event: Event): Promise<{ findings: Finding[], tasks: Task[] }> {
    const findings: Finding[] = [];
    const tasks: Task[] = [];

    try {
      // Rule: Contact leak detection
      if (event.type === 'message.sent' && event.payload.content) {
        const contactLeak = this.detectContactLeak(event.payload.content);
        if (contactLeak) {
          findings.push({
            severity: 'high',
            label: 'Potential Contact Information Leak',
            details: {
              detected: contactLeak,
              message_content: event.payload.content.substring(0, 100) + '...'
            },
            event_id: event.id,
            linked_object_type: 'message',
            linked_object_id: event.payload.message_id
          });

          tasks.push({
            kind: 'alert',
            summary: 'Review message for contact information leak',
            suggested_action: {
              action: 'review_message',
              message_id: event.payload.message_id,
              reason: 'potential_contact_leak'
            }
          });
        }
      }

      // Rule: Price outlier detection
      if (event.type === 'quote.submitted' && event.payload.price) {
        const priceOutlier = await this.detectPriceOutlier(event.payload);
        if (priceOutlier.isOutlier) {
          findings.push({
            severity: priceOutlier.severity,
            label: 'Price Outlier Detected',
            details: {
              quote_price: event.payload.price,
              median_price: priceOutlier.median,
              deviation: priceOutlier.deviation,
              aircraft_class: event.payload.aircraft_class,
              route: event.payload.route
            },
            event_id: event.id,
            linked_object_type: 'quote',
            linked_object_id: event.payload.quote_id
          });

          if (priceOutlier.severity === 'critical') {
            tasks.push({
              kind: 'review',
              summary: 'Review critical price outlier',
              suggested_action: {
                action: 'review_quote',
                quote_id: event.payload.quote_id,
                reason: 'critical_price_outlier'
              }
            });
          }
        }
      }

      // Rule: Sanctions match detection
      if (event.type === 'sanctions.match' && event.payload.severity) {
        if (event.payload.severity === 'high' || event.payload.severity === 'critical') {
          findings.push({
            severity: event.payload.severity,
            label: 'Sanctions Match Detected',
            details: {
              match_type: event.payload.match_type,
              confidence: event.payload.confidence,
              entity_name: event.payload.entity_name
            },
            event_id: event.id,
            linked_object_type: 'user',
            linked_object_id: event.payload.user_id
          });

          tasks.push({
            kind: 'alert',
            summary: 'Handle sanctions match',
            suggested_action: {
              action: 'suspend_user',
              user_id: event.payload.user_id,
              reason: 'sanctions_match'
            },
            due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
          });
        }
      }

      // Rule: Empty leg opportunity detection
      if (event.type === 'aircraft.availability.updated') {
        const emptyLegOpportunity = await this.detectEmptyLegOpportunity(event.payload);
        if (emptyLegOpportunity) {
          findings.push({
            severity: 'info',
            label: 'Empty Leg Opportunity Detected',
            details: {
              aircraft_id: event.payload.aircraft_id,
              route: emptyLegOpportunity.route,
              distance_nm: emptyLegOpportunity.distance,
              timeframe_hours: emptyLegOpportunity.timeframe
            },
            event_id: event.id,
            linked_object_type: 'aircraft',
            linked_object_id: event.payload.aircraft_id
          });

          tasks.push({
            kind: 'route',
            summary: 'Route empty leg opportunity',
            suggested_action: {
              action: 'notify_operators',
              aircraft_id: event.payload.aircraft_id,
              opportunity: emptyLegOpportunity
            }
          });
        }
      }

      // Rule: Slow operator response detection
      if (event.type === 'quote.submitted') {
        const slowResponse = await this.detectSlowResponse(event.payload);
        if (slowResponse) {
          findings.push({
            severity: 'warn',
            label: 'Slow Operator Response',
            details: {
              operator_id: event.payload.operator_id,
              response_time_hours: slowResponse.responseTime,
              sla_threshold: slowResponse.threshold
            },
            event_id: event.id,
            linked_object_type: 'operator',
            linked_object_id: event.payload.operator_id
          });
        }
      }

    } catch (error) {
      console.error('Error processing event:', error);
      findings.push({
        severity: 'warn',
        label: 'Event Processing Error',
        details: {
          error: error.message,
          event_type: event.type
        },
        event_id: event.id
      });
    }

    return { findings, tasks };
  }

  private detectContactLeak(content: string): string[] | null {
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    
    const phones = content.match(phoneRegex);
    const emails = content.match(emailRegex);
    
    const leaks = [];
    if (phones) leaks.push(...phones);
    if (emails) leaks.push(...emails);
    
    return leaks.length > 0 ? leaks : null;
  }

  private async detectPriceOutlier(quoteData: any): Promise<{ isOutlier: boolean, severity: 'warn' | 'critical', median: number, deviation: number }> {
    try {
      // Get historical prices for similar routes and aircraft class
      const { data: historicalQuotes } = await this.supabase
        .from('quotes')
        .select('price')
        .eq('aircraft_class', quoteData.aircraft_class)
        .eq('route', quoteData.route)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
        .limit(100);

      if (!historicalQuotes || historicalQuotes.length < 10) {
        return { isOutlier: false, severity: 'warn', median: 0, deviation: 0 };
      }

      const prices = historicalQuotes.map(q => q.price).sort((a, b) => a - b);
      const median = prices[Math.floor(prices.length / 2)];
      const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
      const stdDev = Math.sqrt(variance);

      const deviation = Math.abs(quoteData.price - median) / stdDev;
      const isOutlier = deviation > 2;

      return {
        isOutlier,
        severity: deviation > 3 ? 'critical' : 'warn',
        median,
        deviation
      };
    } catch (error) {
      console.error('Error detecting price outlier:', error);
      return { isOutlier: false, severity: 'warn', median: 0, deviation: 0 };
    }
  }

  private async detectEmptyLegOpportunity(availabilityData: any): Promise<any | null> {
    try {
      // This is a simplified version - in reality, you'd need to:
      // 1. Get nearby RFQs
      // 2. Check aircraft positioning
      // 3. Calculate distances and timeframes
      
      const { data: nearbyRFQs } = await this.supabase
        .from('rfqs')
        .select('id, origin, destination, aircraft_class, departure_date')
        .eq('aircraft_class', availabilityData.aircraft_class)
        .gte('departure_date', new Date().toISOString())
        .lte('departure_date', new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()) // Next 72 hours
        .limit(10);

      if (!nearbyRFQs || nearbyRFQs.length === 0) {
        return null;
      }

      // Find closest RFQ (simplified distance calculation)
      const closestRFQ = nearbyRFQs[0]; // In reality, calculate actual distance
      const distance = 250; // Simplified - would calculate actual nautical miles
      
      if (distance <= 300) {
        return {
          route: `${availabilityData.current_location} to ${closestRFQ.origin}`,
          distance,
          timeframe: 48,
          rfq_id: closestRFQ.id
        };
      }

      return null;
    } catch (error) {
      console.error('Error detecting empty leg opportunity:', error);
      return null;
    }
  }

  private async detectSlowResponse(quoteData: any): Promise<any | null> {
    try {
      const { data: rfqData } = await this.supabase
        .from('rfqs')
        .select('created_at')
        .eq('id', quoteData.rfq_id)
        .single();

      if (!rfqData) return null;

      const rfqTime = new Date(rfqData.created_at).getTime();
      const quoteTime = new Date(quoteData.created_at).getTime();
      const responseTimeHours = (quoteTime - rfqTime) / (1000 * 60 * 60);

      const slaThreshold = 24; // 24 hours SLA
      
      if (responseTimeHours > slaThreshold) {
        return {
          responseTime: responseTimeHours,
          threshold: slaThreshold
        };
      }

      return null;
    } catch (error) {
      console.error('Error detecting slow response:', error);
      return null;
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const rulesEngine = new MaxRulesEngine(supabase)

    // Get pending events (limit to prevent overwhelming)
    const { data: events, error: eventsError } = await supabase
      .from('internal_max.event_bus')
      .select('*')
      .eq('status', 'pending')
      .order('occurred_at', { ascending: true })
      .limit(50)

    if (eventsError) {
      console.error('Error fetching events:', eventsError)
      return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    if (!events || events.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'No pending events to process',
        processed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    let processedCount = 0
    const allFindings: Finding[] = []
    const allTasks: Task[] = []

    // Process each event
    for (const event of events) {
      try {
        const { findings, tasks } = await rulesEngine.processEvent(event)
        
        // Store findings
        if (findings.length > 0) {
          const findingsToInsert = findings.map(f => ({
            ...f,
            created_at: new Date().toISOString()
          }))
          
          const { error: findingsError } = await supabase
            .from('internal_max.findings')
            .insert(findingsToInsert)

          if (findingsError) {
            console.error('Error inserting findings:', findingsError)
          } else {
            allFindings.push(...findings)
          }
        }

        // Store tasks
        if (tasks.length > 0) {
          const tasksToInsert = tasks.map(t => ({
            ...t,
            created_at: new Date().toISOString(),
            assignee: 'admin',
            status: 'open'
          }))
          
          const { error: tasksError } = await supabase
            .from('internal_max.tasks')
            .insert(tasksToInsert)

          if (tasksError) {
            console.error('Error inserting tasks:', tasksError)
          } else {
            allTasks.push(...tasks)
          }
        }

        // Mark event as processed
        const { error: updateError } = await supabase
          .from('internal_max.event_bus')
          .update({ 
            status: 'processed',
            processed_at: new Date().toISOString()
          })
          .eq('id', event.id)

        if (updateError) {
          console.error('Error updating event status:', updateError)
        } else {
          processedCount++
        }

        // Log the processing
        await supabase.rpc('internal_max.log_action', {
          action_name: 'process_event',
          target_type: 'event',
          target_id: event.id,
          action_details: {
            event_type: event.type,
            findings_count: findings.length,
            tasks_count: tasks.length
          }
        })

      } catch (error) {
        console.error(`Error processing event ${event.id}:`, error)
        
        // Log the error
        await supabase.rpc('internal_max.log_action', {
          action_name: 'process_event_error',
          target_type: 'event',
          target_id: event.id,
          action_details: {
            error: error.message,
            event_type: event.type
          }
        })
      }
    }

    return new Response(JSON.stringify({
      message: `Processed ${processedCount} events`,
      processed: processedCount,
      findings_created: allFindings.length,
      tasks_created: allTasks.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Max worker error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
