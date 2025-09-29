// Stratus Assist LLM Integration
// Real AI intelligence with function calling
// FCA Compliant Aviation Platform

import { MASTER_SYSTEM_PROMPT } from './stratus-assist-prompts';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface LLMResponse {
  content: string;
  function_calls?: Array<{
    name: string;
    arguments: string;
  }>;
  finish_reason: 'stop' | 'length' | 'function_call' | 'content_filter';
}

export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
}

// Function definitions for the LLM
export const AVAILABLE_FUNCTIONS: Record<string, FunctionDefinition> = {
  get_aircraft_availability: {
    name: 'get_aircraft_availability',
    description: 'Get available aircraft for a specific route and date',
    parameters: {
      type: 'object',
      properties: {
        aircraft_type: { type: 'string', description: 'Type of aircraft (e.g., Gulfstream G550)' },
        origin: { type: 'string', description: 'Origin airport code (e.g., EGLL)' },
        destination: { type: 'string', description: 'Destination airport code (e.g., LFMN)' },
        depart_date: { type: 'string', description: 'Departure date in YYYY-MM-DD format' },
        pax: { type: 'number', description: 'Number of passengers' },
        budget_gbp: { type: 'number', description: 'Budget in GBP' }
      },
      required: ['origin', 'destination', 'depart_date', 'pax']
    }
  },
  price_estimate: {
    name: 'price_estimate',
    description: 'Get price estimate for a specific aircraft and route',
    parameters: {
      type: 'object',
      properties: {
        operator_id: { type: 'string', description: 'Operator ID' },
        aircraft_type: { type: 'string', description: 'Type of aircraft' },
        origin: { type: 'string', description: 'Origin airport code' },
        destination: { type: 'string', description: 'Destination airport code' },
        depart_date: { type: 'string', description: 'Departure date' },
        pax: { type: 'number', description: 'Number of passengers' },
        extras: {
          type: 'object',
          properties: {
            deice_risk: { type: 'boolean', description: 'De-icing risk' },
            wifi: { type: 'boolean', description: 'WiFi required' },
            catering: { type: 'boolean', description: 'Catering required' }
          }
        }
      },
      required: ['operator_id', 'aircraft_type', 'origin', 'destination', 'depart_date', 'pax']
    }
  },
  price_match: {
    name: 'price_match',
    description: 'Match and rank pricing options',
    parameters: {
      type: 'object',
      properties: {
        candidates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              operator_id: { type: 'string' },
              est_price_gbp: { type: 'number' }
            }
          }
        },
        target_budget_gbp: { type: 'number', description: 'Target budget in GBP' },
        tie_break: { type: 'string', enum: ['response_speed', 'aog_history', 'home_base_fit'] }
      },
      required: ['candidates', 'target_budget_gbp']
    }
  },
  get_operator_profile: {
    name: 'get_operator_profile',
    description: 'Get operator profile and details',
    parameters: {
      type: 'object',
      properties: {
        operator_id: { type: 'string', description: 'Operator ID' }
      },
      required: ['operator_id']
    }
  },
  get_aircraft_specs: {
    name: 'get_aircraft_specs',
    description: 'Get aircraft specifications and details',
    parameters: {
      type: 'object',
      properties: {
        aircraft_type: { type: 'string', description: 'Type of aircraft' }
      },
      required: ['aircraft_type']
    }
  },
  sanctions_check: {
    name: 'sanctions_check',
    description: 'Check for sanctions and compliance issues',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name to check' },
        company: { type: 'string', description: 'Company name' },
        country: { type: 'string', description: 'Country' }
      },
      required: ['name']
    }
  }
};

export class StratusAssistLLM {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    // Use environment variables for API configuration
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1';
    this.model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
  }

  async generateResponse(
    messages: LLMMessage[],
    functions?: FunctionDefinition[]
  ): Promise<LLMResponse> {
    try {
      // If no API key, use fallback responses
      if (!this.apiKey) {
        return this.generateFallbackResponse(messages);
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          functions: functions ? Object.values(functions) : undefined,
          function_call: functions ? 'auto' : undefined,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status}`);
      }

      const data = await response.json();
      const choice = data.choices[0];

      return {
        content: choice.message.content || '',
        function_calls: choice.message.function_call ? [choice.message.function_call] : undefined,
        finish_reason: choice.finish_reason
      };

    } catch (error) {
      console.error('LLM API error:', error);
      return this.generateFallbackResponse(messages);
    }
  }

  private generateFallbackResponse(messages: LLMMessage[]): LLMResponse {
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage.content.toLowerCase();

    // Simple fallback responses based on content
    if (content.includes('are you real') || content.includes('real?')) {
      return {
        content: "If I am real, I am here for you. Ask me and I will help.",
        finish_reason: 'stop'
      };
    }

    if (content.includes('help') || content.includes('can you')) {
      return {
        content: "Yes, I can help. I can check availability, price options, and match the best operator for your range. Which aircraft and what dates",
        finish_reason: 'stop'
      };
    }

    if (content.includes('gulfstream') || content.includes('falcon') || content.includes('aircraft')) {
      return {
        content: "Understood. I will check aircraft availability. What is the route, date, passengers, and a soft budget",
        finish_reason: 'stop'
      };
    }

    return {
      content: "Tell me aircraft, route, date, passengers, and a soft budget. I will fetch live options.",
      finish_reason: 'stop'
    };
  }

  // Create conversation context
  createConversationContext(
    systemPrompt: string,
    conversationHistory: LLMMessage[],
    userMessage: string
  ): LLMMessage[] {
    return [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];
  }

  // Parse function call arguments
  parseFunctionArguments(argumentsString: string): any {
    try {
      return JSON.parse(argumentsString);
    } catch (error) {
      console.error('Failed to parse function arguments:', error);
      return {};
    }
  }

  // Format function call result for LLM
  formatFunctionResult(functionName: string, result: any): LLMMessage {
    return {
      role: 'function',
      name: functionName,
      content: JSON.stringify(result)
    };
  }
}

// Export singleton instance
export const stratusAssistLLM = new StratusAssistLLM();
