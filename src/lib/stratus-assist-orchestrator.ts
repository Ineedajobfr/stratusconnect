// Stratus Assist Orchestrator
// The brain that coordinates dialogue, tools, and responses
// FCA Compliant Aviation Platform

import { enforcePolicy, detectIntent, extractContext, hasAllRequiredContext, getMissingContext, type AviationContext, type Intent } from './stratus-assist-policy';
import { 
  get_aircraft_availability, 
  price_estimate, 
  price_match, 
  get_operator_profile,
  get_aircraft_specs,
  sanctions_check,
  type AvailabilityItem,
  type PriceEstimate,
  type PriceMatchResult,
  type OperatorProfile
} from './stratus-assist-tools';
import { MASTER_SYSTEM_PROMPT, VOICE_RULES, REPLY_TEMPLATES } from './stratus-assist-prompts';

export type ConversationState = 
  | "idle"
  | "reassure"
  | "intake"
  | "searching"
  | "pricing"
  | "presenting"
  | "confirming";

export interface ConversationContext {
  state: ConversationState;
  context: Partial<AviationContext>;
  lastQuery?: string;
  searchResults?: AvailabilityItem[];
  priceResults?: PriceEstimate[];
  matchResult?: PriceMatchResult;
  operatorProfile?: OperatorProfile;
}

export interface OrchestratorResponse {
  reply: string;
  newState: ConversationState;
  context: Partial<AviationContext>;
  toolCalls?: string[];
  confidence: number;
}

export class StratusAssistOrchestrator {
  private conversationHistory: Map<string, ConversationContext> = new Map();

  async processMessage(
    userMsg: string, 
    conversationId: string, 
    terminalType: 'broker' | 'operator' | 'pilot' | 'crew'
  ): Promise<OrchestratorResponse> {
    
    // Get or create conversation context
    let convContext = this.conversationHistory.get(conversationId) || {
      state: "idle" as ConversationState,
      context: {}
    };

    // 1. Policy enforcement
    const policyResult = enforcePolicy(userMsg);
    if (policyResult.blocked) {
      return {
        reply: policyResult.message,
        newState: "idle",
        context: convContext.context,
        confidence: 1.0
      };
    }

    // 2. Intent detection
    const intent = detectIntent(userMsg);
    
    // 3. Context extraction
    const extractedContext = extractContext(userMsg);
    const updatedContext = { ...convContext.context, ...extractedContext };

    // 4. State machine logic
    const response = await this.handleStateMachine(
      userMsg, 
      intent, 
      convContext.state, 
      updatedContext, 
      terminalType
    );

    // 5. Update conversation context
    convContext.state = response.newState;
    convContext.context = response.context;
    this.conversationHistory.set(conversationId, convContext);

    return response;
  }

  private async handleStateMachine(
    userMsg: string,
    intent: Intent,
    currentState: ConversationState,
    context: Partial<AviationContext>,
    terminalType: 'broker' | 'operator' | 'pilot' | 'crew'
  ): Promise<OrchestratorResponse> {

    // Existential questions
    if (intent === 'existential') {
      return {
        reply: VOICE_RULES.realness,
        newState: "reassure",
        context,
        confidence: 1.0
      };
    }

    // Help requests
    if (intent === 'help_request' && currentState === "idle") {
      return {
        reply: VOICE_RULES.helpOffer,
        newState: "intake",
        context,
        confidence: 0.9
      };
    }

    // Aircraft queries with missing context
    if (intent === 'aircraft_query' && !hasAllRequiredContext(context)) {
      const missing = getMissingContext(context);
      const missingText = missing.join(', ');
      
      return {
        reply: `Understood. I need ${missingText} to find the best options. What is the route, date, passengers, and a soft budget`,
        newState: "intake",
        context,
        confidence: 0.8
      };
    }

    // Quote requests with complete context
    if (intent === 'quote_request' && hasAllRequiredContext(context)) {
      return await this.handleQuoteRequest(context, terminalType);
    }

    // General queries
    if (intent === 'general') {
      return {
        reply: VOICE_RULES.intake,
        newState: "intake",
        context,
        confidence: 0.7
      };
    }

    // Default fallback
    return {
      reply: VOICE_RULES.intake,
      newState: "intake",
      context,
      confidence: 0.6
    };
  }

  private async handleQuoteRequest(
    context: Partial<AviationContext>,
    terminalType: 'broker' | 'operator' | 'pilot' | 'crew'
  ): Promise<OrchestratorResponse> {
    
    const toolCalls: string[] = [];
    
    try {
      // 1. Get availability
      const availability = await get_aircraft_availability({
        aircraft_type: context.aircraft,
        origin: context.origin,
        destination: context.destination,
        depart_date: context.date,
        pax: context.pax,
        budget_gbp: context.budget_gbp
      });

      toolCalls.push('get_aircraft_availability');

      if (!availability.ok || !availability.data.length) {
        return {
          reply: "I could not find suitable availability right now. Shall I expand to adjacent bases or propose a close class",
          newState: "idle",
          context,
          toolCalls,
          confidence: 0.8
        };
      }

      const topOptions = availability.data.slice(0, 3);

      // 2. Price each candidate
      const priceResults: PriceEstimate[] = [];
      for (const option of topOptions) {
        const price = await price_estimate({
          operator_id: option.operator_id,
          aircraft_type: option.aircraft_type,
          origin: context.origin!,
          destination: context.destination!,
          depart_date: context.date!,
          pax: context.pax!,
          extras: {}
        });

        toolCalls.push('price_estimate');

        if (price.ok) {
          priceResults.push(price.data);
        }
      }

      if (!priceResults.length) {
        return {
          reply: "Pricing failed. Do you want me to request manual quotes",
          newState: "idle",
          context,
          toolCalls,
          confidence: 0.7
        };
      }

      // 3. Price match
      const match = await price_match({
        candidates: priceResults.map(p => ({ 
          operator_id: p.operator_id, 
          est_price_gbp: p.est_price_gbp 
        })),
        target_budget_gbp: context.budget_gbp!,
        tie_break: "home_base_fit"
      });

      toolCalls.push('price_match');

      if (!match.ok) {
        return {
          reply: "Price match failed. Do you want me to present raw options",
          newState: "idle",
          context,
          toolCalls,
          confidence: 0.7
        };
      }

      // 4. Get operator profile for best match
      const bestPrice = priceResults.find(p => p.operator_id === match.data.best_operator_id)!;
      const profile = await get_operator_profile({ operator_id: bestPrice.operator_id });

      toolCalls.push('get_operator_profile');

      // 5. Format response
      const formatMoney = (n: number) => 
        new Intl.NumberFormat("en-GB", { 
          style: "currency", 
          currency: "GBP", 
          maximumFractionDigits: 0 
        }).format(n);

      const alternatives = priceResults
        .filter(p => p.operator_id !== bestPrice.operator_id)
        .map(p => formatMoney(p.est_price_gbp))
        .join(", ");

      const operatorName = profile.ok ? profile.data.name : "Selected operator";
      const bestPriceFormatted = formatMoney(bestPrice.est_price_gbp);

      let reply = `I can help. I checked ${context.aircraft} for ${context.date}, ${context.origin} to ${context.destination}, ${context.pax} passengers. `;
      reply += `Best value is ${operatorName}, estimated ${bestPriceFormatted} all in. `;
      
      if (alternatives) {
        reply += `Two alternates also fit, ${alternatives}. `;
      }
      
      reply += `Shall I request confirmation and hold the slot`;

      return {
        reply,
        newState: "presenting",
        context,
        toolCalls,
        confidence: 0.9
      };

    } catch (error: any) {
      return {
        reply: "I encountered an error processing your request. Do you want me to try a different approach",
        newState: "idle",
        context,
        toolCalls,
        confidence: 0.5
      };
    }
  }

  // Utility methods
  private formatMoney(amount: number): string {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0
    }).format(amount);
  }

  private formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateStr;
    }
  }

  // Get conversation history
  getConversationHistory(conversationId: string): ConversationContext | undefined {
    return this.conversationHistory.get(conversationId);
  }

  // Clear conversation history
  clearConversationHistory(conversationId: string): void {
    this.conversationHistory.delete(conversationId);
  }

  // Get all active conversations
  getActiveConversations(): string[] {
    return Array.from(this.conversationHistory.keys());
  }
}

// Export singleton instance
export const stratusAssistOrchestrator = new StratusAssistOrchestrator();
