// Advanced Voice Services Integration
// This file provides integration with professional AI voice services

export interface VoiceService {
  name: string;
  provider: string;
  cost: string;
  quality: 'basic' | 'good' | 'excellent' | 'professional';
  features: string[];
  apiKey?: string;
}

export const voiceServices: VoiceService[] = [
  {
    name: 'ElevenLabs',
    provider: 'ElevenLabs',
    cost: '$5-20/month',
    quality: 'professional',
    features: ['Voice cloning', 'Emotion control', 'High quality', 'Custom voices'],
    apiKey: process.env.REACT_APP_ELEVENLABS_API_KEY
  },
  {
    name: 'Azure Neural TTS',
    provider: 'Microsoft',
    cost: 'Pay-per-use',
    quality: 'excellent',
    features: ['400+ voices', 'SSML support', 'Natural speech', 'Multiple languages'],
    apiKey: process.env.REACT_APP_AZURE_SPEECH_KEY
  },
  {
    name: 'Google WaveNet',
    provider: 'Google',
    cost: 'Pay-per-character',
    quality: 'excellent',
    features: ['WaveNet voices', 'Custom training', 'Multiple accents', 'High quality'],
    apiKey: process.env.REACT_APP_GOOGLE_TTS_KEY
  },
  {
    name: 'Amazon Polly',
    provider: 'AWS',
    cost: 'Pay-per-character',
    quality: 'good',
    features: ['Neural voices', 'SSML support', 'Multiple languages', 'Reliable'],
    apiKey: process.env.REACT_APP_AWS_POLLY_KEY
  }
];

// ElevenLabs Integration
export class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async synthesizeSpeech(text: string, voiceId: string = 'pNInz6obpgDQGcFmaJgB'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return response.blob();
  }

  async getVoices(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'xi-api-key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices;
  }
}

// Azure Cognitive Services Integration
export class AzureTTSService {
  private apiKey: string;
  private region: string;
  private baseUrl: string;

  constructor(apiKey: string, region: string = 'eastus') {
    this.apiKey = apiKey;
    this.region = region;
    this.baseUrl = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  }

  async synthesizeSpeech(text: string, voiceName: string = 'en-US-AriaNeural'): Promise<Blob> {
    const ssml = `
      <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
        <voice name='${voiceName}'>
          <prosody rate='0.9' pitch='0.8'>
            ${text}
          </prosody>
        </voice>
      </speak>
    `;

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
      },
      body: ssml
    });

    if (!response.ok) {
      throw new Error(`Azure TTS API error: ${response.statusText}`);
    }

    return response.blob();
  }
}

// Google Cloud TTS Integration
export class GoogleTTSService {
  private apiKey: string;
  private baseUrl = 'https://texttospeech.googleapis.com/v1/text:synthesize';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async synthesizeSpeech(text: string, voiceName: string = 'en-US-Wavenet-D'): Promise<Blob> {
    const requestBody = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: voiceName,
        ssmlGender: 'MALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.9,
        pitch: -2.0,
        volumeGainDb: 0.0
      }
    };

    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Google TTS API error: ${response.statusText}`);
    }

    const data = await response.json();
    const audioData = atob(data.audioContent);
    const audioBlob = new Blob([new Uint8Array(audioData.length)], { type: 'audio/mp3' });
    
    return audioBlob;
  }
}

// Enhanced Voice Reader with Multiple Services
export class EnhancedVoiceReader {
  private currentService: 'browser' | 'elevenlabs' | 'azure' | 'google' = 'browser';
  private elevenLabs?: ElevenLabsService;
  private azure?: AzureTTSService;
  private google?: GoogleTTSService;

  constructor() {
    // Initialize services if API keys are available
    if (process.env.REACT_APP_ELEVENLABS_API_KEY) {
      this.elevenLabs = new ElevenLabsService(process.env.REACT_APP_ELEVENLABS_API_KEY);
    }
    if (process.env.REACT_APP_AZURE_SPEECH_KEY) {
      this.azure = new AzureTTSService(process.env.REACT_APP_AZURE_SPEECH_KEY);
    }
    if (process.env.REACT_APP_GOOGLE_TTS_KEY) {
      this.google = new GoogleTTSService(process.env.REACT_APP_GOOGLE_TTS_KEY);
    }
  }

  setService(service: 'browser' | 'elevenlabs' | 'azure' | 'google') {
    this.currentService = service;
  }

  async speak(text: string, voiceId?: string): Promise<void> {
    switch (this.currentService) {
      case 'elevenlabs':
        if (this.elevenLabs) {
          await this.speakWithElevenLabs(text, voiceId);
        } else {
          throw new Error('ElevenLabs API key not configured');
        }
        break;
      case 'azure':
        if (this.azure) {
          await this.speakWithAzure(text, voiceId);
        } else {
          throw new Error('Azure Speech API key not configured');
        }
        break;
      case 'google':
        if (this.google) {
          await this.speakWithGoogle(text, voiceId);
        } else {
          throw new Error('Google TTS API key not configured');
        }
        break;
      default:
        this.speakWithBrowser(text);
    }
  }

  private async speakWithElevenLabs(text: string, voiceId?: string) {
    if (!this.elevenLabs) return;
    
    try {
      const audioBlob = await this.elevenLabs.synthesizeSpeech(text, voiceId);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('ElevenLabs synthesis error:', error);
      // Fallback to browser
      this.speakWithBrowser(text);
    }
  }

  private async speakWithAzure(text: string, voiceName?: string) {
    if (!this.azure) return;
    
    try {
      const audioBlob = await this.azure.synthesizeSpeech(text, voiceName);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Azure TTS synthesis error:', error);
      // Fallback to browser
      this.speakWithBrowser(text);
    }
  }

  private async speakWithGoogle(text: string, voiceName?: string) {
    if (!this.google) return;
    
    try {
      const audioBlob = await this.google.synthesizeSpeech(text, voiceName);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Google TTS synthesis error:', error);
      // Fallback to browser
      this.speakWithBrowser(text);
    }
  }

  private speakWithBrowser(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 0.7;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  }
}

// Voice Quality Comparison
export const voiceQualityComparison = {
  browser: {
    quality: 'Basic',
    naturalness: 'Robotic',
    cost: 'Free',
    features: ['Basic TTS', 'System voices', 'Limited control']
  },
  elevenlabs: {
    quality: 'Professional',
    naturalness: 'Very Natural',
    cost: '$5-20/month',
    features: ['Voice cloning', 'Emotion control', 'High quality', 'Custom voices']
  },
  azure: {
    quality: 'Excellent',
    naturalness: 'Natural',
    cost: 'Pay-per-use',
    features: ['400+ voices', 'SSML support', 'Neural TTS', 'Multiple languages']
  },
  google: {
    quality: 'Excellent',
    naturalness: 'Very Natural',
    cost: 'Pay-per-character',
    features: ['WaveNet voices', 'Custom training', 'Multiple accents', 'High quality']
  }
};
