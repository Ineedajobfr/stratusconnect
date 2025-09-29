// Simple Max Client - Works without Ollama
// Fallback system that works immediately
// FCA Compliant Aviation Platform

import { AviationContext } from './stratus-assist-policy';

export interface SimpleMaxResponse {
  text: string;
  intent: string;
  modelUsed: string;
  confidence: number;
  reasoning: string;
}

export class SimpleMaxClient {
  async generateResponse(
    userMsg: string,
    ctx: Partial<AviationContext>,
    context?: string
  ): Promise<SimpleMaxResponse> {
    const u = userMsg.toLowerCase();

    // Reassurance queries
    if (/are you real|real\?|exist|real bot/.test(u)) {
      return {
        text: "If I am real, I am here for you. Ask me and I will help.",
        intent: 'reassure',
        modelUsed: 'simple-max',
        confidence: 0.9,
        reasoning: 'Reassurance response'
      };
    }

    // Help requests
    if (/help|can you|assist|support/.test(u)) {
      return {
        text: "Yes, I can help. I can check availability, price options, and match the best operator for your range. Which aircraft and what dates",
        intent: 'intake',
        modelUsed: 'simple-max',
        confidence: 0.8,
        reasoning: 'Help response'
      };
    }

    // Aircraft queries
    if (/gulfstream|falcon|aircraft|jet|g\d{3,4}|global|challenger/.test(u)) {
      return {
        text: "Understood. I will check aircraft availability. What is the route, date, passengers, and a soft budget",
        intent: 'availability',
        modelUsed: 'simple-max',
        confidence: 0.8,
        reasoning: 'Aircraft query response'
      };
    }

    // Pricing queries
    if (/price|quote|budget|cost|gbp|£|expensive|cheap/.test(u)) {
      return {
        text: "I can help with pricing. Tell me the aircraft type, route, date, passengers, and budget range",
        intent: 'pricing',
        modelUsed: 'simple-max',
        confidence: 0.8,
        reasoning: 'Pricing query response'
      };
    }

    // Route queries
    if (/london|nice|paris|dubai|new york|miami|frankfurt/.test(u)) {
      return {
        text: "I can help with that route. What aircraft type, date, and passenger count do you need",
        intent: 'availability',
        modelUsed: 'simple-max',
        confidence: 0.8,
        reasoning: 'Route query response'
      };
    }

    // Default response
    return {
      text: "Tell me aircraft, route, date, passengers, and a soft budget. I will fetch live options.",
      intent: 'intake',
      modelUsed: 'simple-max',
      confidence: 0.6,
      reasoning: 'Default response'
    };
  }
}

// Export singleton instance
export const simpleMaxClient = new SimpleMaxClient();

