// FlightRadar24 API integration for ad-free aircraft tracking
// This uses their data API directly instead of embedding widgets that show ads

export interface AircraftData {
  id: string;
  tailNumber: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  squawk: string;
  timestamp: string;
  status: "tracking" | "offline" | "error";
  aircraftType?: string;
  origin?: string;
  destination?: string;
  flightNumber?: string;
}

export interface FlightRadar24Config {
  apiKey?: string;
  baseUrl: string;
  timeout: number;
}

// Configuration for FlightRadar24 API
const config: FlightRadar24Config = {
  // In production, you would need a FlightRadar24 API key
  // For now, we'll use mock data to avoid ads and external dependencies
  baseUrl: "https://api.flightradar24.com",
  timeout: 10000,
};

// Mock data generator for development
// In production, this would be replaced with actual API calls
export async function fetchAircraftPositions(tailNumbers: string[]): Promise<AircraftData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return tailNumbers.map((tailNumber, index) => ({
    id: `aircraft-${index}`,
    tailNumber,
    callsign: `${tailNumber.slice(0, 3)}${Math.floor(Math.random() * 100)}`,
    latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
    longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
    altitude: 35000 + Math.random() * 10000,
    speed: 450 + Math.random() * 100,
    heading: Math.floor(Math.random() * 360),
    squawk: Math.floor(1000 + Math.random() * 8000).toString(),
    timestamp: new Date().toISOString(),
    status: Math.random() > 0.1 ? "tracking" : "offline",
    aircraftType: getRandomAircraftType(),
    origin: getRandomAirport(),
    destination: getRandomAirport(),
    flightNumber: `FR${Math.floor(Math.random() * 9000) + 1000}`,
  }));
}

// Production API function (commented out - requires API key and proper setup)
/*
export async function fetchAircraftPositionsProduction(tailNumbers: string[]): Promise<AircraftData[]> {
  try {
    const response = await fetch(`${config.baseUrl}/common/v1/flight/list.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        query: tailNumbers.join(','),
        fetchBy: 'reg',
        limit: tailNumbers.length,
      }),
      signal: AbortSignal.timeout(config.timeout),
    });

    if (!response.ok) {
      throw new Error(`FlightRadar24 API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.result.response.data.map((flight: any) => ({
      id: flight.id,
      tailNumber: flight.aircraft.registration,
      callsign: flight.identification.callsign,
      latitude: flight.trail[0]?.lat || 0,
      longitude: flight.trail[0]?.lng || 0,
      altitude: flight.aircraft.altitude || 0,
      speed: flight.aircraft.speed || 0,
      heading: flight.aircraft.heading || 0,
      squawk: flight.aircraft.squawk || '',
      timestamp: new Date().toISOString(),
      status: flight.status?.live ? "tracking" : "offline",
      aircraftType: flight.aircraft.model?.text,
      origin: flight.airport?.origin?.code?.iata,
      destination: flight.airport?.destination?.code?.iata,
      flightNumber: flight.identification.number?.default,
    }));
  } catch (error) {
    console.error('FlightRadar24 API error:', error);
    throw new Error('Failed to fetch aircraft positions');
  }
}
*/

// Helper functions for mock data
function getRandomAircraftType(): string {
  const types = [
    "Gulfstream G650",
    "Gulfstream G550", 
    "Citation X+",
    "Citation CJ4",
    "Falcon 7X",
    "Global 6000",
    "Challenger 350",
    "King Air 350"
  ];
  return types[Math.floor(Math.random() * types.length)];
}

function getRandomAirport(): string {
  const airports = [
    "JFK", "LAX", "LHR", "CDG", "MIA", "SFO", "ORD", "DFW", 
    "ATL", "DEN", "SEA", "BOS", "IAH", "PHX", "LAS", "MCO"
  ];
  return airports[Math.floor(Math.random() * airports.length)];
}

// Utility functions for formatting aircraft data
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

export function formatAltitude(alt: number): string {
  return `${alt.toLocaleString()} ft`;
}

export function formatSpeed(speed: number): string {
  return `${speed} kts`;
}

export function formatHeading(heading: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(heading / 45) % 8;
  return `${heading}° ${directions[index]}`;
}

// Calculate distance between two coordinates (for future use)
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
