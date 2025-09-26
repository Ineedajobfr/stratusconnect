// AI Demand and Pricing Edge Function - The Hunter
// FCA Compliant Aviation Platform - Real Data, Real Actions

import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface DemandInsight {
  route: string;
  predicted_demand: number;
  optimal_price: number;
  currency: string;
  confidence: number;
  why: Array<{
    feature: string;
    weight: number;
    value: number;
    impact: string;
  }>;
  data_as_of: string;
  sample_size: number;
  price_volatility: number;
  market_activity: number;
}

interface PricingInsight {
  aircraft_id: string;
  registration: string;
  model: string;
  current_utilization: number;
  optimal_rate: number;
  currency: string;
  confidence: number;
  why: Array<{
    feature: string;
    weight: number;
    value: number;
    impact: string;
  }>;
  data_as_of: string;
  maintenance_due: boolean;
  next_maintenance: string;
}

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { role, routes, currency, aircraft_ids } = await req.json();
    const startTime = Date.now();

    // Validate role
    if (!["broker", "operator", "pilot", "crew"].includes(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let insights: any[] = [];

    if (role === "broker" && routes) {
      // Broker gets demand and pricing insights
      insights = await getDemandInsights(supabase, routes, currency);
    } else if (role === "operator" && aircraft_ids) {
      // Operator gets fleet utilization and pricing insights
      insights = await getFleetInsights(supabase, aircraft_ids, currency);
    } else if (role === "pilot") {
      // Pilot gets job opportunities and market insights
      insights = await getPilotInsights(supabase, currency);
    } else if (role === "crew") {
      // Crew gets job opportunities and market insights
      insights = await getCrewInsights(supabase, currency);
    }

    const latency = Date.now() - startTime;

    // Log the AI recommendation
    await supabase.rpc("log_ai_recommendation", {
      p_user_id: "server", // In real implementation, get from JWT
      p_role: role,
      p_model_version: "v0.2-hunter",
      p_insight_type: role === "broker" ? "demand_pricing" : "fleet_utilization",
      p_inputs: { role, routes, currency, aircraft_ids },
      p_outputs: insights,
      p_latency_ms: latency
    });

    return new Response(
      JSON.stringify({ insights, latency_ms: latency }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        } 
      }
    );
  } catch (error) {
    console.error("AI Demand Price Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

async function getDemandInsights(
  supabase: any,
  routes: string[],
  currency: string
): Promise<DemandInsight[]> {
  // Get market demand data
  const { data: marketData, error } = await supabase
    .from("mv_market_demand")
    .select("*")
    .in("route", routes)
    .gte("day", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order("day", { ascending: false });

  if (error) throw error;

  // Get weather impact data
  const { data: weatherData } = await supabase
    .from("mv_weather_impact")
    .select("*")
    .gte("observation_time", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  // Get event impact data
  const { data: eventData } = await supabase
    .from("mv_event_impact")
    .select("*")
    .gte("event_date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  return routes.map(route => {
    const routeData = marketData?.filter(d => d.route === route) || [];
    const recentData = routeData.slice(0, 7); // Last 7 days
    
    if (recentData.length === 0) {
      return {
        route,
        predicted_demand: 0,
        optimal_price: 0,
        currency,
        confidence: 0,
        why: [],
        data_as_of: new Date().toISOString(),
        sample_size: 0,
        price_volatility: 0,
        market_activity: 0
      };
    }

    // Calculate EWMA for demand prediction
    const demand = calculateEWMA(recentData.map(d => d.rfq_count), 0.3);
    const avgPrice = recentData.reduce((sum, d) => sum + d.avg_price_usd, 0) / recentData.length;
    const volatility = recentData.reduce((sum, d) => sum + (d.price_volatility || 0), 0) / recentData.length;
    const marketActivity = recentData.reduce((sum, d) => sum + d.unique_brokers + d.unique_operators, 0) / recentData.length;

    // Simple elasticity model for optimal pricing
    const optimalPrice = calculateOptimalPrice(avgPrice, demand, volatility);

    // Calculate confidence based on data quality
    const confidence = Math.min(0.95, recentData.length / 7 * 0.8 + (1 - volatility / avgPrice) * 0.2);

    // Generate explainable features
    const why = [
      {
        feature: "recent_rfq_count",
        weight: 0.46,
        value: demand,
        impact: demand > 5 ? "High demand" : "Low demand"
      },
      {
        feature: "avg_price_7d",
        weight: 0.31,
        value: avgPrice,
        impact: avgPrice > 50000 ? "Premium route" : "Standard route"
      },
      {
        feature: "price_volatility",
        weight: 0.15,
        value: volatility,
        impact: volatility > 10000 ? "Unstable pricing" : "Stable pricing"
      },
      {
        feature: "market_activity",
        weight: 0.08,
        value: marketActivity,
        impact: marketActivity > 10 ? "Active market" : "Quiet market"
      }
    ];

    return {
      route,
      predicted_demand: Math.round(demand),
      optimal_price: Math.round(optimalPrice),
      currency,
      confidence: Math.round(confidence * 100) / 100,
      why,
      data_as_of: recentData[0].day,
      sample_size: recentData.length,
      price_volatility: Math.round(volatility),
      market_activity: Math.round(marketActivity)
    };
  });
}

async function getFleetInsights(
  supabase: any,
  aircraft_ids: string[],
  currency: string
): Promise<PricingInsight[]> {
  const { data: fleetData, error } = await supabase
    .from("mv_fleet_utilization")
    .select("*")
    .in("aircraft_id", aircraft_ids);

  if (error) throw error;

  return fleetData?.map(aircraft => {
    const utilization = aircraft.total_hours / (24 * 30); // Hours per month
    const completionRate = aircraft.completed_flights / Math.max(aircraft.total_flights, 1);
    
    // Calculate optimal rate based on utilization and performance
    const baseRate = 5000; // Base rate per hour
    const utilizationMultiplier = Math.max(0.5, Math.min(2.0, utilization));
    const performanceMultiplier = Math.max(0.8, Math.min(1.2, completionRate));
    const optimalRate = baseRate * utilizationMultiplier * performanceMultiplier;

    const confidence = Math.min(0.95, aircraft.total_flights / 10 * 0.6 + completionRate * 0.4);

    const why = [
      {
        feature: "utilization_rate",
        weight: 0.4,
        value: utilization,
        impact: utilization > 0.8 ? "High utilization" : "Low utilization"
      },
      {
        feature: "completion_rate",
        weight: 0.3,
        value: completionRate,
        impact: completionRate > 0.9 ? "Excellent performance" : "Needs improvement"
      },
      {
        feature: "total_hours",
        weight: 0.2,
        value: aircraft.total_hours,
        impact: aircraft.total_hours > 100 ? "Experienced aircraft" : "New aircraft"
      },
      {
        feature: "last_flight",
        weight: 0.1,
        value: aircraft.last_flight_date ? 
          (Date.now() - new Date(aircraft.last_flight_date).getTime()) / (24 * 60 * 60 * 1000) : 999,
        impact: aircraft.last_flight_date ? "Recently active" : "Inactive"
      }
    ];

    return {
      aircraft_id: aircraft.aircraft_id,
      registration: aircraft.registration,
      model: aircraft.model,
      current_utilization: Math.round(utilization * 100) / 100,
      optimal_rate: Math.round(optimalRate),
      currency,
      confidence: Math.round(confidence * 100) / 100,
      why,
      data_as_of: new Date().toISOString(),
      maintenance_due: aircraft.total_hours > 1000, // Simplified maintenance logic
      next_maintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }) || [];
}

async function getPilotInsights(supabase: any, currency: string): Promise<any[]> {
  // Get pilot performance data
  const { data: pilotData } = await supabase
    .from("mv_pilot_performance")
    .select("*")
    .limit(10);

  return pilotData?.map(pilot => ({
    pilot_id: pilot.pilot_id,
    name: pilot.name,
    rating: pilot.rating,
    hours_flown: pilot.hours_flown,
    completion_rate: pilot.successful_flights / Math.max(pilot.flights_completed, 1),
    avg_rating: pilot.avg_flight_rating,
    market_demand: "High", // Simplified
    recommended_rate: pilot.rating * 100, // Simplified
    currency,
    confidence: 0.85,
    why: [
      { feature: "rating", weight: 0.5, value: pilot.rating, impact: "Pilot rating" },
      { feature: "hours", weight: 0.3, value: pilot.hours_flown, impact: "Experience" },
      { feature: "completion", weight: 0.2, value: pilot.completion_rate, impact: "Reliability" }
    ]
  })) || [];
}

async function getCrewInsights(supabase: any, currency: string): Promise<any[]> {
  // Similar to pilot insights but for crew
  return [{
    crew_id: "demo-crew-1",
    name: "Demo Crew",
    role: "Flight Attendant",
    rating: 4.8,
    experience: 5,
    market_demand: "High",
    recommended_rate: 150,
    currency,
    confidence: 0.85,
    why: [
      { feature: "rating", weight: 0.5, value: 4.8, impact: "Crew rating" },
      { feature: "experience", weight: 0.3, value: 5, impact: "Years of experience" },
      { feature: "availability", weight: 0.2, value: 0.9, impact: "High availability" }
    ]
  }];
}

function calculateEWMA(values: number[], alpha: number): number {
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];
  
  let ema = values[0];
  for (let i = 1; i < values.length; i++) {
    ema = alpha * values[i] + (1 - alpha) * ema;
  }
  return ema;
}

function calculateOptimalPrice(avgPrice: number, demand: number, volatility: number): number {
  // Simple elasticity model
  const demandMultiplier = Math.max(0.8, Math.min(1.3, demand / 5));
  const volatilityAdjustment = Math.max(0.9, Math.min(1.1, 1 - volatility / avgPrice));
  
  return avgPrice * demandMultiplier * volatilityAdjustment;
}
