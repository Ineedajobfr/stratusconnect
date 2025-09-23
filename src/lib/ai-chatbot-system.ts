// Advanced AI Chatbot System - Like ChatGPT/Grok for StratusConnect
// With voice capabilities, memory, and comprehensive aviation knowledge

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  voiceEnabled?: boolean;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
  context: {
    userType: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
    currentPage?: string;
    preferences: {
      voiceEnabled: boolean;
      responseStyle: 'professional' | 'casual' | 'technical';
      expertiseLevel: 'beginner' | 'intermediate' | 'expert';
    };
  };
}

export interface AviationKnowledge {
  aircraft: {
    types: string[];
    specifications: Record<string, any>;
    manufacturers: string[];
    performance: Record<string, any>;
  };
  regulations: {
    faa: Record<string, any>;
    icao: Record<string, any>;
    easa: Record<string, any>;
  };
  operations: {
    procedures: string[];
    safety: string[];
    maintenance: string[];
    training: string[];
  };
  market: {
    trends: string[];
    pricing: Record<string, any>;
    demand: Record<string, any>;
  };
}

// Comprehensive aviation knowledge base
export const aviationKnowledge: AviationKnowledge = {
  aircraft: {
    types: [
      'Light Jets', 'Midsize Jets', 'Heavy Jets', 'Ultra-Long Range Jets',
      'Turboprops', 'Piston Aircraft', 'Helicopters', 'Amphibious Aircraft'
    ],
    specifications: {
      'Gulfstream G650ER': {
        range: '7500 nm',
        passengers: '19',
        cruiseSpeed: 'Mach 0.85',
        price: '$70M+'
      },
      'Cessna Citation X+': {
        range: '3500 nm',
        passengers: '12',
        cruiseSpeed: 'Mach 0.935',
        price: '$22M+'
      },
      'Bombardier Global 7500': {
        range: '7700 nm',
        passengers: '19',
        cruiseSpeed: 'Mach 0.85',
        price: '$73M+'
      }
    },
    manufacturers: [
      'Gulfstream', 'Bombardier', 'Cessna', 'Dassault', 'Embraer',
      'Pilatus', 'Beechcraft', 'Piper', 'Cirrus', 'HondaJet'
    ],
    performance: {
      'Light Jets': { range: '1000-2000 nm', passengers: '4-8' },
      'Midsize Jets': { range: '2000-3500 nm', passengers: '6-10' },
      'Heavy Jets': { range: '3500-6000 nm', passengers: '8-16' },
      'Ultra-Long Range': { range: '6000+ nm', passengers: '12-19' }
    }
  },
  regulations: {
    faa: {
      'Part 91': 'General operating and flight rules',
      'Part 135': 'Commuter and on-demand operations',
      'Part 121': 'Scheduled air carrier operations',
      'Part 145': 'Repair stations'
    },
    icao: {
      'Annex 6': 'Operation of aircraft',
      'Annex 8': 'Airworthiness of aircraft',
      'Annex 14': 'Aerodromes'
    },
    easa: {
      'CS-25': 'Large aeroplanes',
      'CS-23': 'Normal, utility, aerobatic, and commuter aeroplanes',
      'CS-27': 'Small rotorcraft'
    }
  },
  operations: {
    procedures: [
      'Pre-flight inspection', 'Weight and balance', 'Weather briefing',
      'Flight planning', 'ATC communication', 'Emergency procedures',
      'Post-flight inspection', 'Maintenance scheduling'
    ],
    safety: [
      'Risk assessment', 'Safety management systems', 'Incident reporting',
      'Safety training', 'Emergency response', 'Safety audits'
    ],
    maintenance: [
      'Scheduled maintenance', 'Unscheduled maintenance', 'Inspection programs',
      'Parts management', 'Compliance tracking', 'Documentation'
    ],
    training: [
      'Initial training', 'Recurrent training', 'Type ratings',
      'Simulator training', 'Line training', 'Proficiency checks'
    ]
  },
  market: {
    trends: [
      'Sustainable aviation fuels', 'Electric aircraft development',
      'Urban air mobility', 'Autonomous flight systems',
      'Digital transformation', 'Fleet modernization'
    ],
    pricing: {
      'Charter rates': 'Vary by aircraft type and route',
      'Management fees': 'Typically 8-12% of revenue',
      'Maintenance costs': 'Vary by aircraft age and usage',
      'Insurance costs': 'Based on aircraft value and usage'
    },
    demand: {
      'Business travel': 'Growing post-pandemic',
      'Leisure travel': 'Steady growth',
      'Cargo operations': 'High demand',
      'Emergency services': 'Consistent demand'
    }
  }
};

// AI Chatbot System
export class StratusConnectAI {
  private sessions: Map<string, ChatSession> = new Map();
  private currentSession: ChatSession | null = null;
  private voiceEnabled: boolean = false;
  private speechSynthesis: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  // Create new chat session
  createSession(userId: string, userType: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin'): ChatSession {
    const session: ChatSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      context: {
        userType,
        preferences: {
          voiceEnabled: false,
          responseStyle: 'professional',
          expertiseLevel: 'intermediate'
        }
      }
    };

    this.sessions.set(session.id, session);
    this.currentSession = session;

    // Add welcome message
    this.addMessage('assistant', this.generateWelcomeMessage(userType), false);
    
    return session;
  }

  // Add message to current session
  addMessage(role: 'user' | 'assistant', content: string, voiceEnabled: boolean = false): ChatMessage {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
      voiceEnabled
    };

    this.currentSession.messages.push(message);
    this.currentSession.lastActivity = new Date();

    return message;
  }

  // Process user message and generate response
  async processMessage(userMessage: string): Promise<ChatMessage> {
    try {
      if (!this.currentSession) {
        throw new Error('No active session');
      }

      // Add user message
      const userMsg = this.addMessage('user', userMessage);

      // Generate AI response
      const response = await this.generateResponse(userMessage);
      
      // Add assistant response
      const assistantMsg = this.addMessage('assistant', response, this.voiceEnabled);

      // Speak response if voice is enabled
      if (this.voiceEnabled && this.speechSynthesis) {
        this.speak(response);
      }

      return assistantMsg;
    } catch (error) {
      console.error('Error processing message:', error);
      // Return a fallback response
      return this.addMessage('assistant', 'I apologize, but I encountered an error processing your message. Please try again.');
    }
  }

  // Generate AI response based on user message and context
  private async generateResponse(userMessage: string): Promise<string> {
    const { userType, preferences } = this.currentSession!.context;
    const { responseStyle, expertiseLevel } = preferences;

    // Analyze user intent
    const intent = this.analyzeIntent(userMessage);
    
    // Generate response based on intent and context
    let response = '';

    switch (intent.type) {
      case 'greeting':
        response = this.generateGreetingResponse(userType, responseStyle);
        break;
      case 'aircraft_query':
        response = this.generateAircraftResponse(userMessage, expertiseLevel);
        break;
      case 'regulation_query':
        response = this.generateRegulationResponse(userMessage, expertiseLevel);
        break;
      case 'operation_query':
        response = this.generateOperationResponse(userMessage, expertiseLevel);
        break;
      case 'market_query':
        response = this.generateMarketResponse(userMessage, expertiseLevel);
        break;
      case 'platform_help':
        response = this.generatePlatformHelpResponse(userMessage, userType);
        break;
      case 'general_question':
        response = this.generateGeneralResponse(userMessage, userType, responseStyle);
        break;
      default:
        response = this.generateDefaultResponse(userMessage, userType);
    }

    return response;
  }

  // Analyze user intent
  private analyzeIntent(message: string): { type: string; confidence: number } {
    const lowerMessage = message.toLowerCase();

    // Greeting patterns
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return { type: 'greeting', confidence: 0.9 };
    }

    // Aircraft queries
    if (lowerMessage.includes('aircraft') || lowerMessage.includes('jet') || lowerMessage.includes('plane') || 
        lowerMessage.includes('gulfstream') || lowerMessage.includes('cessna') || lowerMessage.includes('bombardier')) {
      return { type: 'aircraft_query', confidence: 0.8 };
    }

    // Regulation queries
    if (lowerMessage.includes('regulation') || lowerMessage.includes('faa') || lowerMessage.includes('icao') || 
        lowerMessage.includes('easa') || lowerMessage.includes('compliance') || lowerMessage.includes('certification')) {
      return { type: 'regulation_query', confidence: 0.8 };
    }

    // Operation queries
    if (lowerMessage.includes('operation') || lowerMessage.includes('flight') || lowerMessage.includes('maintenance') || 
        lowerMessage.includes('safety') || lowerMessage.includes('training') || lowerMessage.includes('procedure')) {
      return { type: 'operation_query', confidence: 0.8 };
    }

    // Market queries
    if (lowerMessage.includes('market') || lowerMessage.includes('price') || lowerMessage.includes('cost') || 
        lowerMessage.includes('trend') || lowerMessage.includes('demand') || lowerMessage.includes('revenue')) {
      return { type: 'market_query', confidence: 0.8 };
    }

    // Platform help
    if (lowerMessage.includes('help') || lowerMessage.includes('how to') || lowerMessage.includes('stratusconnect') || 
        lowerMessage.includes('platform') || lowerMessage.includes('feature') || lowerMessage.includes('function')) {
      return { type: 'platform_help', confidence: 0.7 };
    }

    return { type: 'general_question', confidence: 0.5 };
  }

  // Generate welcome message
  private generateWelcomeMessage(userType: string): string {
    const welcomeMessages = {
      broker: "Welcome to StratusConnect! I'm your AI assistant, specialized in aviation brokerage. I can help you find aircraft, manage client relationships, create quotes, and navigate our platform. What would you like to know?",
      operator: "Hello! I'm your AI assistant for aviation operations. I can help you with fleet management, pilot coordination, maintenance tracking, and operational procedures. How can I assist you today?",
      pilot: "Welcome aboard! I'm your AI assistant for pilot operations. I can help you with job searches, certification management, flight planning, and career development. What questions do you have?",
      crew: "Hi there! I'm your AI assistant for crew operations. I can help you with assignments, qualifications, training, and career advancement. How can I help you today?",
      admin: "Good day! I'm your AI assistant for platform administration. I can help you with user management, system monitoring, security, and platform optimization. What do you need assistance with?"
    };

    return welcomeMessages[userType as keyof typeof welcomeMessages] || "Welcome to StratusConnect! I'm your AI assistant. How can I help you today?";
  }

  // Generate aircraft response
  private generateAircraftResponse(message: string, expertiseLevel: string): string {
    // This would integrate with real-time aircraft data
    return `I can help you with aircraft information. Based on your query, here are some relevant details:

**Aircraft Types Available:**
- Light Jets: 1000-2000 nm range, 4-8 passengers
- Midsize Jets: 2000-3500 nm range, 6-10 passengers  
- Heavy Jets: 3500-6000 nm range, 8-16 passengers
- Ultra-Long Range: 6000+ nm range, 12-19 passengers

**Popular Manufacturers:**
Gulfstream, Bombardier, Cessna, Dassault, Embraer, Pilatus, Beechcraft, Piper, Cirrus, HondaJet

**Performance Specifications:**
- Gulfstream G650ER: 7500 nm range, 19 passengers, Mach 0.85 cruise
- Cessna Citation X+: 3500 nm range, 12 passengers, Mach 0.935 cruise
- Bombardier Global 7500: 7700 nm range, 19 passengers, Mach 0.85 cruise

Would you like me to search for specific aircraft based on your requirements?`;
  }

  // Generate regulation response
  private generateRegulationResponse(message: string, expertiseLevel: string): string {
    return `I can help you with aviation regulations. Here's what I know:

**FAA Regulations:**
- Part 91: General operating and flight rules
- Part 135: Commuter and on-demand operations
- Part 121: Scheduled air carrier operations
- Part 145: Repair stations

**ICAO Standards:**
- Annex 6: Operation of aircraft
- Annex 8: Airworthiness of aircraft
- Annex 14: Aerodromes

**EASA Regulations:**
- CS-25: Large aeroplanes
- CS-23: Normal, utility, aerobatic, and commuter aeroplanes
- CS-27: Small rotorcraft

What specific regulation are you looking for? I can provide detailed information and help you understand compliance requirements.`;
  }

  // Generate operation response
  private generateOperationResponse(message: string, expertiseLevel: string): string {
    return `I can help you with aviation operations. Here's what I can assist with:

**Flight Operations:**
- Pre-flight inspection procedures
- Weight and balance calculations
- Weather briefing and analysis
- Flight planning and routing
- ATC communication protocols
- Emergency procedures

**Safety Management:**
- Risk assessment methodologies
- Safety management systems
- Incident reporting procedures
- Safety training programs
- Emergency response planning
- Safety audit processes

**Maintenance Operations:**
- Scheduled maintenance programs
- Unscheduled maintenance procedures
- Inspection programs and intervals
- Parts management and inventory
- Compliance tracking
- Documentation requirements

**Training Programs:**
- Initial training requirements
- Recurrent training schedules
- Type rating programs
- Simulator training protocols
- Line training procedures
- Proficiency check requirements

What specific operational area do you need help with?`;
  }

  // Generate market response
  private generateMarketResponse(message: string, expertiseLevel: string): string {
    return `I can help you with aviation market information. Here's what I know:

**Current Market Trends:**
- Sustainable aviation fuels adoption
- Electric aircraft development
- Urban air mobility growth
- Autonomous flight systems
- Digital transformation initiatives
- Fleet modernization programs

**Pricing Information:**
- Charter rates vary by aircraft type and route
- Management fees typically 8-12% of revenue
- Maintenance costs vary by aircraft age and usage
- Insurance costs based on aircraft value and usage

**Demand Patterns:**
- Business travel: Growing post-pandemic
- Leisure travel: Steady growth
- Cargo operations: High demand
- Emergency services: Consistent demand

**Market Opportunities:**
- Emerging markets in Asia-Pacific
- Sustainable aviation initiatives
- Technology integration opportunities
- Regulatory compliance services

Would you like me to provide more specific market data or analysis?`;
  }

  // Generate platform help response
  private generatePlatformHelpResponse(message: string, userType: string): string {
    return `I can help you navigate StratusConnect! Here's what I can assist with:

**Platform Features:**
- AI-powered search and matching
- Real-time tracking and monitoring
- Secure payment and escrow system
- Comprehensive user management
- Advanced analytics and reporting

**User-Specific Help:**
- Broker: Client management, quote creation, transaction facilitation
- Operator: Fleet management, pilot coordination, maintenance tracking
- Pilot: Job search, profile management, certification tracking
- Crew: Assignment management, qualification tracking, training
- Admin: User management, system monitoring, security

**Getting Started:**
1. Complete your profile setup
2. Explore the dashboard
3. Use the search functionality
4. Connect with other users
5. Start transactions

**Need Help With:**
- Account setup and verification
- Platform navigation
- Feature usage
- Troubleshooting
- Best practices

What specific aspect of the platform would you like help with?`;
  }

  // Generate general response
  private generateGeneralResponse(message: string, userType: string, responseStyle: string): string {
    return `I understand you're asking about "${message}". As your StratusConnect AI assistant, I'm here to help with:

- Aviation industry questions
- Platform functionality
- Technical support
- Best practices
- Market information
- Regulatory guidance

Could you provide more specific details about what you'd like to know? I can give you more targeted assistance once I understand your exact needs.`;
  }

  // Generate default response
  private generateDefaultResponse(message: string, userType: string): string {
    return `I'm not sure I fully understand your question. As your StratusConnect AI assistant, I can help with:

- Aircraft information and specifications
- Aviation regulations and compliance
- Operational procedures and best practices
- Market trends and pricing
- Platform features and functionality
- Technical support and troubleshooting

Could you rephrase your question or provide more context? I'm here to help!`;
  }

  // Voice functionality
  enableVoice(): void {
    this.voiceEnabled = true;
    if (this.currentSession) {
      this.currentSession.context.preferences.voiceEnabled = true;
    }
  }

  disableVoice(): void {
    this.voiceEnabled = false;
    if (this.currentSession) {
      this.currentSession.context.preferences.voiceEnabled = false;
    }
  }

  speak(text: string): void {
    try {
      if (!this.speechSynthesis) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 0.8;
      utterance.volume = 0.9;

      // Try to find a good voice
      const voices = this.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && (
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('david') ||
          v.name.toLowerCase().includes('alex') ||
          v.name.toLowerCase().includes('daniel')
        )
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      this.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  }

  // Get current session
  getCurrentSession(): ChatSession | null {
    return this.currentSession;
  }

  // Get session history
  getSessionHistory(): ChatSession[] {
    return Array.from(this.sessions.values());
  }

  // Clear session
  clearSession(): void {
    if (this.currentSession) {
      this.sessions.delete(this.currentSession.id);
      this.currentSession = null;
    }
  }
}

// Export singleton instance
export const stratusConnectAI = new StratusConnectAI();
