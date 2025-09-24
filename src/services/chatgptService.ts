// ChatGPT OpenAI Integration Service
// This service handles communication with OpenAI's ChatGPT API

interface ChatGPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatGPTResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class ChatGPTService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1/chat/completions';
  private model: string = 'gpt-4';

  constructor() {
    // In production, this should come from environment variables
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
  }

  async sendMessage(
    messages: ChatGPTMessage[],
    context?: {
      activeTab?: string;
      userRole?: string;
      recentActivity?: any[];
    }
  ): Promise<string> {
    if (!this.apiKey) {
      // Fallback to mock response if no API key
      return this.getMockResponse(messages[messages.length - 1]?.content || '', context);
    }

    try {
      const systemMessage: ChatGPTMessage = {
        role: 'system',
        content: this.getSystemPrompt(context)
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [systemMessage, ...messages],
          max_tokens: 1000,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: ChatGPTResponse = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not process your request.';
    } catch (error) {
      console.error('ChatGPT API Error:', error);
      // Fallback to mock response
      return this.getMockResponse(messages[messages.length - 1]?.content || '', context);
    }
  }

  private getSystemPrompt(context?: any): string {
    return `You are an AI assistant specialized in aviation brokerage and the StratusConnect platform. You help brokers with:

**Core Functions:**
1. RFQ Creation & Management
2. Aircraft Search & Comparison  
3. Market Intelligence & Pricing
4. Client Communication
5. Compliance & Regulations
6. Workflow Optimization
7. Financial Calculations
8. Route Planning

**Current Context:**
- User is a ${context?.userRole || 'broker'}
- Active tab: ${context?.activeTab || 'dashboard'}
- Platform: FCA Compliant Aviation Trading Floor

**Always provide:**
- Specific, actionable advice
- Relevant industry insights
- Step-by-step guidance
- Safety and compliance reminders
- Professional, helpful tone

**Key Features to Help With:**
- Multi-leg RFQ creation
- Aircraft marketplace navigation
- Market trend analysis
- Client relationship management
- Pricing optimization
- Regulatory compliance
- Workflow automation

Respond concisely but comprehensively. If asked about specific features, provide step-by-step instructions.`;
  }

  private getMockResponse(userMessage: string, context?: any): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('rfq') || message.includes('request')) {
      return `To create a multi-leg RFQ in StratusConnect:

1. **Navigate to RFQs tab** - Click on "RFQs" in the main navigation
2. **Click "New RFQ"** - This opens the Multi-Leg RFQ Builder
3. **Add Route Details**:
   - Enter IATA codes (e.g., LHR, JFK)
   - Select departure date and time
   - Specify passenger count (1-20 per leg)
   - Add special requirements

4. **Configure Multi-Leg Options**:
   - Add additional legs using the "+" button
   - Set layover times between legs
   - Specify aircraft preferences

5. **Submit & Track**:
   - Review all details
   - Click "Create RFQ"
   - Monitor responses in the RFQ dashboard

**Pro Tip:** Use the AI Pricing Engine to get optimal pricing suggestions before submitting!`;
    }

    if (message.includes('aircraft') || message.includes('search') || message.includes('marketplace')) {
      return `For aircraft search and discovery:

1. **Use the Marketplace tab** - Browse available aircraft
2. **Apply Filters**:
   - Route: Enter departure and destination
   - Aircraft type: Gulfstream, Citation, etc.
   - Price range: Set your budget
   - Date: Specify travel dates
   - Verification: Filter by verified operators

3. **Compare Options**:
   - Use the compare feature for side-by-side analysis
   - Check operator ratings and reviews
   - Review aircraft specifications

4. **AI-Powered Search**:
   - Use natural language: "Find a Gulfstream for London to New York next week"
   - Get personalized recommendations
   - Access market intelligence insights

**Current Market Trends:**
- Gulfstream G650: High demand, prices up 15%
- Empty leg opportunities: 23% increase this week
- Best routes: LHR-JFK, LAX-HNL, CDG-DXB`;
    }

    if (message.includes('market') || message.includes('pricing') || message.includes('intelligence')) {
      return `**Market Intelligence Dashboard:**

**Current Trends:**
- LHR-JFK: High demand, prices up 15% this month
- Empty leg availability: 23% increase week-over-week
- Fuel costs: Down 8% from last month
- Operator capacity: 78% average utilization

**Pricing Insights:**
- Gulfstream G650: $85,000-$120,000 (LHR-JFK)
- Challenger 350: $45,000-$65,000 (CDG-DXB)
- Citation X+: $35,000-$50,000 (LAX-HNL)

**Smart Pricing Engine:**
- AI analyzes market conditions
- Provides confidence scores
- Suggests optimal pricing strategies
- Tracks competitor pricing

**Access via:** Market Intel tab → Live Pricing & Trends`;
    }

    if (message.includes('client') || message.includes('communication')) {
      return `**Client Management & Communication:**

**Client Portal Features:**
- Comprehensive client database
- Activity tracking and history
- Communication logs
- Quote management

**Real-time Chat:**
- Instant messaging with operators
- Video/voice call capabilities
- File sharing and collaboration
- Message status tracking

**Client Analytics:**
- Spending patterns analysis
- Satisfaction tracking
- Growth opportunities
- Segment analysis

**Best Practices:**
- Respond within 15 minutes
- Use personalized communication
- Track all interactions
- Follow up systematically`;
    }

    if (message.includes('shortcut') || message.includes('keyboard')) {
      return `**Keyboard Shortcuts:**

**Main Navigation:**
- Ctrl+1: Dashboard
- Ctrl+2: RFQs
- Ctrl+3: Marketplace
- Ctrl+4: Market Intel
- Ctrl+5: Automation
- Ctrl+6: Analytics
- Ctrl+7: Clients

**AI Features:**
- Ctrl+A: AI Assistant (this chat)
- Ctrl+C: Real-time Chat
- Ctrl+H: Help Guide/Tutorial

**Quick Actions:**
- Ctrl+K: Search
- Ctrl+N: New RFQ
- Ctrl+S: Save
- Ctrl+E: Export

**Pro Tips:**
- Use Ctrl+A for instant AI help
- Press Ctrl+H for guided tutorials
- Ctrl+K for quick search across all features`;
    }

    if (message.includes('help') || message.includes('start') || message.includes('begin')) {
      return `**Welcome to StratusConnect Broker Terminal!**

I'm your AI assistant, trained specifically on this platform. Here's how to get started:

**Quick Start:**
1. **Dashboard** - Overview of your performance metrics
2. **RFQs** - Create and manage flight requests
3. **Marketplace** - Search and compare aircraft
4. **Market Intel** - Live market data and trends
5. **Analytics** - Performance insights and reporting
6. **Clients** - Client relationship management

**AI-Powered Features:**
- Smart Pricing Engine (RFQ tab)
- Real-time Chat (Ctrl+C)
- Market Intelligence
- Workflow Automation

**Need Help?**
- Press Ctrl+H for the full tutorial
- Ask me anything about the platform
- Use natural language queries

What would you like to explore first?`;
    }

    return `I'd be happy to help! Based on your current context (${context?.activeTab || 'dashboard'} tab), here are some things I can assist with:

**Quick Actions:**
- Create and manage RFQs
- Search for aircraft and operators
- Analyze market trends and pricing
- Optimize your workflow
- Handle client communications
- Ensure compliance

**AI Features Available:**
- Smart Pricing Engine
- Market Intelligence
- Real-time Chat
- Workflow Automation
- Advanced Analytics

What specific task would you like help with? Feel free to ask in natural language!`;
  }
}

export const chatGPTService = new ChatGPTService();
export default chatGPTService;
