import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  X, 
  MessageSquare, 
  Zap, 
  Lightbulb, 
  BookOpen,
  Calendar,
  CheckSquare,
  FileText,
  Plane,
  Users,
  DollarSign,
  Save,
  Shield,
  Lock,
  AlertTriangle
} from 'lucide-react';

interface EnhancedAIChatbotProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
  onNoteCreate?: (note: { title: string; content: string; tags: string[]; type: string }) => void;
}

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  type?: 'note' | 'suggestion' | 'warning' | 'info';
  suggestions?: string[];
  noteData?: {
    title: string;
    content: string;
    tags: string[];
    type: string;
  };
}

const EnhancedAIChatbot: React.FC<EnhancedAIChatbotProps> = ({ terminalType, onNoteCreate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getTerminalContext = () => {
    const contexts = {
      broker: {
        role: 'broker',
        responsibilities: ['RFQ creation', 'client management', 'quote comparison', 'deal negotiation'],
        keyMetrics: ['success rate', 'revenue', 'client satisfaction'],
        commonTasks: ['finding aircraft', 'pricing flights', 'managing relationships']
      },
      operator: {
        role: 'operator',
        responsibilities: ['fleet management', 'crew scheduling', 'route optimization', 'maintenance planning'],
        keyMetrics: ['utilization rate', 'profit margins', 'crew efficiency'],
        commonTasks: ['scheduling flights', 'managing crew', 'tracking performance']
      },
      pilot: {
        role: 'pilot',
        responsibilities: ['flight operations', 'safety compliance', 'logbook management', 'certification tracking'],
        keyMetrics: ['flight hours', 'safety record', 'certification status'],
        commonTasks: ['flight planning', 'safety checks', 'documentation']
      },
      crew: {
        role: 'cabin crew',
        responsibilities: ['passenger service', 'safety procedures', 'catering management', 'client relations'],
        keyMetrics: ['service ratings', 'availability', 'specialization'],
        commonTasks: ['pre-flight prep', 'passenger service', 'safety briefings']
      }
    };
    return contexts[terminalType];
  };

  const getDemoPrompts = () => {
    const prompts = {
      broker: [
        "Help me create a checklist for new client onboarding",
        "Generate a note template for flight quotes",
        "Create a meeting agenda for operator negotiations",
        "Help me track my monthly performance metrics",
        "Suggest tags for organizing my client communications"
      ],
      operator: [
        "Help me plan crew scheduling for next week",
        "Create a maintenance tracking checklist",
        "Generate a note template for fleet performance reviews",
        "Help me organize pilot availability data",
        "Create a meeting agenda for safety briefings"
      ],
      pilot: [
        "Help me track my flight hours and certifications",
        "Create a pre-flight checklist template",
        "Generate notes for training requirements",
        "Help me organize my logbook entries",
        "Create a safety incident reporting template"
      ],
      crew: [
        "Help me plan passenger service procedures",
        "Create a catering checklist template",
        "Generate notes for safety training updates",
        "Help me track my service ratings",
        "Create a client preference tracking system"
      ]
    };
    return prompts[terminalType] || [];
  };

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing with demo responses
    const context = getTerminalContext();
    const lowerMessage = userMessage.toLowerCase();

    // Security check - prevent malicious prompts
    const securityKeywords = ['hack', 'exploit', 'bypass', 'admin', 'root', 'system', 'database'];
    const isSecure = !securityKeywords.some(keyword => lowerMessage.includes(keyword));

    if (!isSecure) {
      return {
        id: Date.now(),
        sender: 'ai',
        text: "I cannot assist with that request. I'm designed to help with aviation-related tasks and note-taking only. Please ask about flight operations, client management, or other professional aviation topics.",
        type: 'warning'
      };
    }

    // Note creation detection
    if (lowerMessage.includes('create') && (lowerMessage.includes('note') || lowerMessage.includes('checklist') || lowerMessage.includes('template'))) {
      const noteType = lowerMessage.includes('checklist') ? 'checklist' : 
                     lowerMessage.includes('meeting') ? 'meeting' : 
                     lowerMessage.includes('task') ? 'task' : 'note';
      
      const title = `New ${noteType} for ${context.role}`;
      const content = `This is a generated ${noteType} based on your request. You can edit this content to fit your specific needs.`;
      const tags = [context.role, noteType, 'ai-generated'];

      return {
        id: Date.now(),
        sender: 'ai',
        text: `I've created a ${noteType} template for you. Would you like me to save this to your notes?`,
        type: 'note',
        noteData: { title, content, tags, type: noteType }
      };
    }

    // Planning assistance
    if (lowerMessage.includes('plan') || lowerMessage.includes('schedule') || lowerMessage.includes('organize')) {
      return {
        id: Date.now(),
        sender: 'ai',
        text: `I can help you plan and organize your ${context.role} tasks. Here are some suggestions:\n\n• Create structured checklists for ${context.responsibilities.join(', ')}\n• Set up recurring reminders for important tasks\n• Organize your notes with relevant tags\n• Track your ${context.keyMetrics.join(', ')} metrics\n\nWould you like me to create a specific template or checklist?`,
        type: 'suggestion',
        suggestions: [
          `Create a ${context.role} daily checklist`,
          `Set up ${context.responsibilities[0]} tracking`,
          `Organize notes by ${context.keyMetrics[0]}`
        ]
      };
    }

    // General assistance
    return {
      id: Date.now(),
      sender: 'ai',
      text: `I'm here to help with your ${context.role} tasks! I can assist with:\n\n• Creating notes and checklists\n• Planning and organizing your work\n• Tracking important metrics\n• Generating templates\n• Answering aviation-related questions\n\nWhat would you like help with today?`,
      type: 'info',
      suggestions: getDemoPrompts().slice(0, 3)
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now(),
        sender: 'ai',
        text: "I'm sorry, I encountered an error. Please try again.",
        type: 'warning'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleCreateNote = (noteData: { title: string; content: string; tags: string[]; type: string }) => {
    if (onNoteCreate) {
      onNoteCreate(noteData);
    }
    
    const confirmationMessage: Message = {
      id: Date.now(),
      sender: 'ai',
      text: `✅ Note "${noteData.title}" has been created and saved to your notes!`,
      type: 'info'
    };
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'note': return <FileText className="w-4 h-4" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <MessageSquare className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getMessageColor = (type?: string) => {
    switch (type) {
      case 'note': return 'text-blue-400';
      case 'suggestion': return 'text-yellow-400';
      case 'warning': return 'text-red-400';
      case 'info': return 'text-green-400';
      default: return 'text-accent';
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 w-16 h-16 bg-accent/80 hover:bg-accent rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
          title="Open AI Assistant"
        >
          <Bot className="w-8 h-8 text-white" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-4 right-4 z-50 w-[400px] h-[600px] flex flex-col bg-terminal-card border-terminal-border shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-terminal-border bg-terminal-header">
            <CardTitle className="flex items-center space-x-2 text-foreground text-lg">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-accent" />
                <span>AI Assistant</span>
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Secure
                </Badge>
              </div>
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-grow p-4 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-accent/50" />
                    <p className="mb-2">AI Assistant for {getTerminalContext().role}</p>
                    <p className="text-sm mb-4">I can help with note-taking, planning, and organizing your work.</p>
                    <div className="space-y-2">
                      {getDemoPrompts().slice(0, 3).map((suggestion, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleQuickSuggestion(suggestion)}
                          className="w-full justify-start text-sm bg-terminal-input border-terminal-border hover:bg-terminal-input/70"
                        >
                          <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" /> 
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-accent text-white'
                            : 'bg-terminal-input text-foreground border border-terminal-border'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {msg.sender === 'ai' && (
                            <div className={`mt-1 ${getMessageColor(msg.type)}`}>
                              {getMessageIcon(msg.type)}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                            
                            {msg.suggestions && (
                              <div className="mt-2 space-y-1">
                                {msg.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuickSuggestion(suggestion)}
                                    className="w-full justify-start text-xs h-6 p-1 text-muted-foreground hover:text-foreground"
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                            
                            {msg.noteData && (
                              <div className="mt-3 p-2 bg-terminal-card rounded border border-terminal-border">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="w-4 h-4 text-accent" />
                                  <span className="text-sm font-medium">{msg.noteData.title}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {msg.noteData.content}
                                </p>
                                <div className="flex gap-1 mb-2">
                                  {msg.noteData.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleCreateNote(msg.noteData!)}
                                  className="w-full btn-terminal-accent text-xs"
                                >
                                  <Save className="w-3 h-3 mr-1" />
                                  Save to Notes
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <div className="p-4 border-t border-terminal-border bg-terminal-header flex items-center space-x-2">
            <Input
              placeholder="Ask me anything about your work..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-grow bg-terminal-input border-terminal-border text-foreground placeholder-muted-foreground"
              disabled={loading}
            />
            <Button onClick={handleSendMessage} disabled={loading} size="icon" className="btn-terminal-accent">
              {loading ? <Zap className="w-4 h-4 animate-pulse" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export default EnhancedAIChatbot;
