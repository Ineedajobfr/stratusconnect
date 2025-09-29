// Max Ollama Client - Local model integration
// Zero API costs with free open-source models
// FCA Compliant Aviation Platform

import { getRoutingDecision, type Intent, type ModelSlot } from './max-router';
import { MODEL_PROMPTS, MAX_VOICE_RULES } from './max-prompts';
import { AviationContext } from './stratus-assist-policy';

export interface OllamaResponse {
  text: string;
  intent: Intent;
  modelUsed: string;
  confidence: number;
  reasoning: string;
}

export interface OllamaBody {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
    stop?: string[];
  };
}

export class MaxOllamaClient {
  private baseUrl: string;
  private models: {
    primary: string;
    reasoning: string;
    summary: string;
  };

  constructor() {
    this.baseUrl = 'http://127.0.0.1:11434';
    this.models = {
      primary: 'llama3:8b',
      reasoning: 'llama3:8b', // Use Llama 3 for everything for now
      summary: 'llama3:8b' // Use Llama 3 for everything for now
    };
  }

  async generateResponse(
    userMsg: string,
    ctx: Partial<AviationContext>,
    context?: string
  ): Promise<OllamaResponse> {
    try {
      // Check if Ollama is available first
      const isOllamaAvailable = await this.healthCheck();
      
      if (!isOllamaAvailable) {
        console.log('Ollama not available, using intelligent fallback');
        return this.generateIntelligentFallback(userMsg, ctx, context);
      }

      // Get routing decision
      const routing = getRoutingDecision(userMsg, ctx);
      
      // Build prompt for the selected model
      const prompt = this.buildPrompt(
        routing.modelSlot,
        context,
        userMsg
      );

      // Call the appropriate model
      const response = await this.callOllama(routing.modelName, prompt);
      
      // Clean and format response
      const cleanText = this.cleanResponse(response, routing.intent);
      
      return {
        text: cleanText,
        intent: routing.intent,
        modelUsed: routing.modelName,
        confidence: routing.confidence,
        reasoning: routing.reasoning
      };

    } catch (error: any) {
      console.error('Ollama error:', error);
      return this.generateIntelligentFallback(userMsg, ctx, context);
    }
  }

  private async callOllama(model: string, prompt: string): Promise<string> {
    try {
      const body: OllamaBody = {
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000,
          stop: ['User:', 'System:', 'Context:']
        }
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Ollama error ${response.status}: ${errorText}`);
        throw new Error(`Ollama error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.response || '';
    } catch (error) {
      console.error('Ollama call failed:', error);
      throw error;
    }
  }

  private buildPrompt(
    modelSlot: ModelSlot,
    context: string | undefined,
    userMsg: string
  ): string {
    const systemPrompt = MODEL_PROMPTS[this.models[modelSlot]];
    
    const parts = [
      `System:\n${systemPrompt}`,
      context ? `Context:\n${context}` : '',
      `User:\n${userMsg}`,
      `Assistant (Max):`
    ].filter(Boolean);
    
    return parts.join('\n\n');
  }

  private cleanResponse(response: string, intent: Intent): string {
    // Remove any system/user markers
    let clean = response
      .replace(/^(System|User|Context|Assistant):\s*/gm, '')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    // Ensure Max's voice characteristics
    if (intent === 'reassure') {
      clean = this.ensureReassuranceTone(clean);
    } else if (intent === 'intake') {
      clean = this.ensureIntakeTone(clean);
    } else if (intent === 'pricing' || intent === 'availability') {
      clean = this.ensureProfessionalTone(clean);
    }

    // Force Max's ending pattern
    if (!clean.endsWith('?') && !clean.endsWith('.')) {
      clean += '.';
    }

    // Ensure it ends with a next action
    if (!this.hasNextAction(clean)) {
      clean += ' What would you like to do next?';
    }

    return clean.slice(0, 2000); // Limit response length
  }

  private ensureReassuranceTone(text: string): string {
    if (text.toLowerCase().includes('real')) {
      return MAX_VOICE_RULES.realness;
    }
    return text;
  }

  private ensureIntakeTone(text: string): string {
    if (text.toLowerCase().includes('help')) {
      return MAX_VOICE_RULES.helpOffer;
    }
    return text;
  }

  private ensureProfessionalTone(text: string): string {
    // Ensure professional aviation terminology
    return text
      .replace(/aircraft/g, 'aircraft')
      .replace(/jet/g, 'aircraft')
      .replace(/plane/g, 'aircraft');
  }

  private hasNextAction(text: string): boolean {
    const nextActionIndicators = [
      'shall i', 'do you want', 'would you like', 'tell me', 'what is', 'which'
    ];
    return nextActionIndicators.some(indicator => 
      text.toLowerCase().includes(indicator)
    );
  }

  private generateIntelligentFallback(
    userMsg: string, 
    ctx: Partial<AviationContext>,
    context?: string
  ): OllamaResponse {
    const u = userMsg.toLowerCase();
    const routing = getRoutingDecision(userMsg, ctx);

    // Reassurance queries
    if (routing.intent === 'reassure' || /are you real|real\?|exist|bot/.test(u)) {
      return {
        text: "If I am real, I am here for you. Ask me and I will help. What do you need assistance with?",
        intent: 'reassure',
        modelUsed: 'intelligent-fallback',
        confidence: 0.9,
        reasoning: 'Intelligent fallback - reassurance'
      };
    }

    // Help requests
    if (routing.intent === 'intake' || /help|can you|assist|support/.test(u)) {
      return {
        text: "Yes, I can help. I can check availability, price options, and match the best operator for your range. Which aircraft and what dates?",
        intent: 'intake',
        modelUsed: 'intelligent-fallback',
        confidence: 0.8,
        reasoning: 'Intelligent fallback - help offer'
      };
    }

    // Pricing queries
    if (routing.intent === 'pricing' || /price|quote|budget|cost|gbp|£/.test(u)) {
      const hasContext = !!(ctx.aircraft && ctx.origin && ctx.destination);
      
      if (hasContext) {
        return {
          text: `I can help with pricing for ${ctx.aircraft} from ${ctx.origin} to ${ctx.destination}. I'll need the date, passenger count, and budget to provide accurate quotes. What are the details?`,
          intent: 'pricing',
          modelUsed: 'intelligent-fallback',
          confidence: 0.8,
          reasoning: 'Intelligent fallback - pricing with partial context'
        };
      } else {
        return {
          text: "I can help with pricing. Tell me the aircraft type, route, date, passengers, and budget, and I'll find the best options for you.",
          intent: 'pricing',
          modelUsed: 'intelligent-fallback',
          confidence: 0.7,
          reasoning: 'Intelligent fallback - pricing without context'
        };
      }
    }

    // Availability queries
    if (routing.intent === 'availability' || /availability|aircraft|g\d{3,4}|gulfstream|falcon|citation/.test(u)) {
      return {
        text: "I can check aircraft availability. Tell me the aircraft type, route, date, passengers, and budget, and I'll find available options for you.",
        intent: 'availability',
        modelUsed: 'intelligent-fallback',
        confidence: 0.8,
        reasoning: 'Intelligent fallback - availability'
      };
    }

    // Summary requests
    if (routing.intent === 'summary' || /summary|recap|brief|overview/.test(u)) {
      return {
        text: "I can provide summaries and briefings. What would you like me to summarize or explain?",
        intent: 'summary',
        modelUsed: 'intelligent-fallback',
        confidence: 0.7,
        reasoning: 'Intelligent fallback - summary'
      };
    }

    // Policy queries
    if (routing.intent === 'policy' || /policy|rules|compliance|regulation/.test(u)) {
      return {
        text: "I can help with policy and compliance questions. Stratus Connect maintains high standards for safety and regulatory compliance. What specific policy question do you have?",
        intent: 'policy',
        modelUsed: 'intelligent-fallback',
        confidence: 0.8,
        reasoning: 'Intelligent fallback - policy'
      };
    }

    // General fallback
    return {
      text: "I'm here to help with aviation services. I can check availability, provide pricing, and assist with bookings. What do you need help with?",
      intent: 'general',
      modelUsed: 'intelligent-fallback',
      confidence: 0.6,
      reasoning: 'Intelligent fallback - general'
    };
  }

  private generateFallbackResponse(
    userMsg: string, 
    ctx: Partial<AviationContext>
  ): OllamaResponse {
    return this.generateIntelligentFallback(userMsg, ctx);
  }

  // Health check for Ollama
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get available models
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();
      return data.models?.map((m: any) => m.name) || [];
    } catch {
      return [];
    }
  }

  // Test model response
  async testModel(model: string): Promise<{ success: boolean; response?: string; error?: string }> {
    try {
      const response = await this.callOllama(model, 'Hello, respond with "Max is ready."');
      return { success: true, response };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const maxOllamaClient = new MaxOllamaClient();

