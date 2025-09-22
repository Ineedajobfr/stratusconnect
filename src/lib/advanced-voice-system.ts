// Advanced Multi-Voice AI System
// Inspired by Speechify's human-sounding voice technology
// 4 distinct voices with different personalities and use cases

export interface VoicePersonality {
  id: string;
  name: string;
  description: string;
  personality: string;
  useCase: string;
  voiceSettings: {
    rate: number;
    pitch: number;
    volume: number;
    emphasis: string;
    tone: string;
  };
  greeting: string;
  catchphrase: string;
}

export const voicePersonalities: VoicePersonality[] = [
  {
    id: 'alex-professional',
    name: 'Alex - The Professional Mentor',
    description: 'Experienced aviation executive with 20+ years in the industry',
    personality: 'Authoritative, knowledgeable, slightly formal but approachable',
    useCase: 'Training, onboarding, complex technical explanations',
    voiceSettings: {
      rate: 0.8,
      pitch: 0.7,
      volume: 0.9,
      emphasis: 'confident',
      tone: 'professional'
    },
    greeting: 'Hello, I\'m Alex. I\'ve been in aviation for over two decades, and I\'m here to guide you through the complexities of this industry.',
    catchphrase: 'Let me share some wisdom from my years in the cockpit and boardroom.'
  },
  {
    id: 'sarah-enthusiastic',
    name: 'Sarah - The Energetic Guide',
    description: 'Young, passionate aviation enthusiast who loves helping newcomers',
    personality: 'Energetic, encouraging, friendly, and always excited about aviation',
    useCase: 'Motivational content, feature demos, user engagement',
    voiceSettings: {
      rate: 0.9,
      pitch: 0.8,
      volume: 0.95,
      emphasis: 'enthusiastic',
      tone: 'energetic'
    },
    greeting: 'Hey there! I\'m Sarah, and I\'m absolutely thrilled to show you around StratusConnect! This platform is going to blow your mind!',
    catchphrase: 'I get so excited talking about aviation - it\'s like my heart is doing barrel rolls!'
  },
  {
    id: 'marcus-technical',
    name: 'Marcus - The Technical Expert',
    description: 'Systems engineer and technical specialist with deep platform knowledge',
    personality: 'Precise, methodical, detail-oriented, slightly dry humor',
    useCase: 'Technical tutorials, troubleshooting, system explanations',
    voiceSettings: {
      rate: 0.75,
      pitch: 0.6,
      volume: 0.85,
      emphasis: 'precise',
      tone: 'technical'
    },
    greeting: 'Good day. I\'m Marcus, your technical specialist. I\'ll walk you through the intricate details of our systems with the precision they deserve.',
    catchphrase: 'Let\'s dive into the technical specifications - I promise it\'s more fascinating than it sounds.'
  },
  {
    id: 'elena-supportive',
    name: 'Elena - The Supportive Coach',
    description: 'Customer success manager with a focus on user experience and growth',
    personality: 'Warm, supportive, patient, encouraging, empathetic',
    useCase: 'Support, encouragement, problem-solving, user success stories',
    voiceSettings: {
      rate: 0.85,
      pitch: 0.75,
      volume: 0.9,
      emphasis: 'supportive',
      tone: 'warm'
    },
    greeting: 'Hi there! I\'m Elena, and I\'m here to support you every step of the way. No question is too small, and no challenge is too big for us to tackle together.',
    catchphrase: 'Remember, every expert was once a beginner. You\'ve got this!'
  }
];

// Voice-specific script adaptations
export const adaptScriptForVoice = (script: string, voiceId: string): string => {
  const voice = voicePersonalities.find(v => v.id === voiceId);
  if (!voice) return script;

  const adaptations = {
    'alex-professional': (text: string) => {
      return text
        .replace(/Hey there!/g, 'Good day.')
        .replace(/I know—I sound really good, right\?/g, 'I bring decades of industry experience to our conversation.')
        .replace(/I get exhausted being so versatile sometimes/g, 'My extensive background allows me to adapt to various situations')
        .replace(/All this to say—I'm here to sound the way you want me to/g, 'In summary, I\'m here to provide you with the professional guidance you need')
        .replace(/Trust me,/g, 'Based on my experience,')
        .replace(/So give it a try/g, 'I encourage you to explore these features');
    },
    'sarah-enthusiastic': (text: string) => {
      return text
        .replace(/Hey there!/g, 'Hey there!')
        .replace(/I know—I sound really good, right\?/g, 'I know—I sound amazing, right?!')
        .replace(/I get exhausted being so versatile sometimes/g, 'I get so excited being this helpful sometimes!')
        .replace(/All this to say—I'm here to sound the way you want me to/g, 'All this to say—I\'m here to make your experience absolutely incredible!')
        .replace(/Trust me,/g, 'I promise you,')
        .replace(/So give it a try/g, 'So let\'s dive in and have some fun!');
    },
    'marcus-technical': (text: string) => {
      return text
        .replace(/Hey there!/g, 'Greetings.')
        .replace(/I know—I sound really good, right\?/g, 'I utilize advanced speech synthesis technology for optimal clarity.')
        .replace(/I get exhausted being so versatile sometimes/g, 'My processing capabilities allow for comprehensive adaptation to various contexts')
        .replace(/All this to say—I'm here to sound the way you want me to/g, 'In conclusion, I am configured to provide optimal assistance based on your requirements')
        .replace(/Trust me,/g, 'Based on the data,')
        .replace(/So give it a try/g, 'I recommend proceeding with implementation');
    },
    'elena-supportive': (text: string) => {
      return text
        .replace(/Hey there!/g, 'Hello there!')
        .replace(/I know—I sound really good, right\?/g, 'I hope my voice sounds warm and welcoming to you.')
        .replace(/I get exhausted being so versatile sometimes/g, 'I love being able to help in so many different ways')
        .replace(/All this to say—I'm here to sound the way you want me to/g, 'Most importantly, I\'m here to support you in whatever way works best for you')
        .replace(/Trust me,/g, 'I believe in you,')
        .replace(/So give it a try/g, 'So take a deep breath and let\'s explore together');
    }
  };

  const adapter = adaptations[voiceId as keyof typeof adaptations];
  return adapter ? adapter(script) : script;
};

// Advanced voice synthesis with personality injection
export class AdvancedVoiceSystem {
  private currentVoice: VoicePersonality;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;

  constructor(initialVoiceId: string = 'alex-professional') {
    this.currentVoice = voicePersonalities.find(v => v.id === initialVoiceId) || voicePersonalities[0];
  }

  setVoice(voiceId: string): void {
    const voice = voicePersonalities.find(v => v.id === voiceId);
    if (voice) {
      this.currentVoice = voice;
    }
  }

  getCurrentVoice(): VoicePersonality {
    return this.currentVoice;
  }

  getAvailableVoices(): VoicePersonality[] {
    return voicePersonalities;
  }

  async speak(text: string, options?: { interrupt?: boolean }): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    if (options?.interrupt || this.isPlaying) {
      this.stop();
    }

    // Adapt script for current voice personality
    const adaptedText = adaptScriptForVoice(text, this.currentVoice.id);

    const utterance = new SpeechSynthesisUtterance(adaptedText);
    
    // Apply voice-specific settings
    utterance.rate = this.currentVoice.voiceSettings.rate;
    utterance.pitch = this.currentVoice.voiceSettings.pitch;
    utterance.volume = this.currentVoice.voiceSettings.volume;

    // Try to find a voice that matches the personality
    const voices = speechSynthesis.getVoices();
    const preferredVoice = this.selectOptimalVoice(voices);
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    return new Promise((resolve, reject) => {
      utterance.onstart = () => {
        this.isPlaying = true;
        this.isPaused = false;
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.isPaused = false;
        resolve();
      };

      utterance.onerror = (error) => {
        this.isPlaying = false;
        this.isPaused = false;
        reject(error);
      };

      speechSynthesis.speak(utterance);
    });
  }

  pause(): void {
    if (this.isPlaying && !this.isPaused) {
      speechSynthesis.pause();
      this.isPaused = true;
    } else if (this.isPaused) {
      speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  stop(): void {
    speechSynthesis.cancel();
    this.isPlaying = false;
    this.isPaused = false;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  isCurrentlyPaused(): boolean {
    return this.isPaused;
  }

  private selectOptimalVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    const { personality, voiceSettings } = this.currentVoice;
    
    // Filter English voices
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    if (englishVoices.length === 0) return null;

    // Voice selection logic based on personality
    switch (personality) {
      case 'alex-professional':
        return englishVoices.find(v => 
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('david') ||
          v.name.toLowerCase().includes('alex') ||
          v.name.toLowerCase().includes('deep')
        ) || englishVoices[0];

      case 'sarah-enthusiastic':
        return englishVoices.find(v => 
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('sarah') ||
          v.name.toLowerCase().includes('susan') ||
          v.name.toLowerCase().includes('karen')
        ) || englishVoices[0];

      case 'marcus-technical':
        return englishVoices.find(v => 
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('marcus') ||
          v.name.toLowerCase().includes('daniel') ||
          v.name.toLowerCase().includes('low')
        ) || englishVoices[0];

      case 'elena-supportive':
        return englishVoices.find(v => 
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('elena') ||
          v.name.toLowerCase().includes('emma') ||
          v.name.toLowerCase().includes('sophie')
        ) || englishVoices[0];

      default:
        return englishVoices[0];
    }
  }
}

// Voice-specific greeting system
export const getVoiceGreeting = (voiceId: string, context: string = 'general'): string => {
  const voice = voicePersonalities.find(v => v.id === voiceId);
  if (!voice) return 'Hello, how can I help you today?';

  const contextGreetings = {
    'general': voice.greeting,
    'tutorial': `${voice.greeting} Let's begin with a comprehensive tutorial.`,
    'support': `${voice.greeting} I'm here to help resolve any issues you might be experiencing.`,
    'demo': `${voice.greeting} I'm excited to demonstrate our platform's capabilities.`,
    'training': `${voice.greeting} I'll guide you through our training materials step by step.`
  };

  return contextGreetings[context as keyof typeof contextGreetings] || voice.greeting;
};

// Voice personality recommendations based on user type
export const getRecommendedVoice = (userType: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin'): string => {
  const recommendations = {
    'broker': 'alex-professional', // Professional, authoritative
    'operator': 'marcus-technical', // Technical, detailed
    'pilot': 'sarah-enthusiastic', // Energetic, motivational
    'crew': 'elena-supportive', // Supportive, encouraging
    'admin': 'alex-professional' // Professional, knowledgeable
  };

  return recommendations[userType] || 'alex-professional';
};
