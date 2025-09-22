import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Settings,
  Mic,
  MicOff,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIVoiceReaderProps {
  text: string;
  title?: string;
  className?: string;
}

export default function AIVoiceReader({ text, title = "AI Voice Reader", className = "" }: AIVoiceReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState([0.8]);
  const [rate, setRate] = useState(0.8); // Slower, more deliberate speech
  const [pitch, setPitch] = useState(0.7); // Deeper, more authoritative voice
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      loadVoices();
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support text-to-speech functionality",
        variant: "destructive"
      });
    }

    // Load voices when they become available
    const handleVoicesChanged = () => loadVoices();
    speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const loadVoices = () => {
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
    
    // Try to find a deeper, more authoritative voice (prefer male, deeper voices)
    const preferredVoice = availableVoices.find(v => 
      v.lang.startsWith('en') && (
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('alex') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('deep') ||
        v.name.toLowerCase().includes('low')
      )
    ) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
    
    if (preferredVoice) {
      setVoice(preferredVoice);
    }
  };

  const speak = () => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set voice properties
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = isMuted ? 0 : volume[0];

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWord(0);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      toast({
        title: "Voice Error",
        description: "An error occurred while reading the text",
        variant: "destructive"
      });
      setIsPlaying(false);
      setIsPaused(false);
    };

    // Word highlighting (basic implementation)
    const words = text.split(' ');
    let wordIndex = 0;
    
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWord(wordIndex);
        wordIndex++;
      }
    };

    speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (isPlaying && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWord(0);
  };

  const downloadAudio = async () => {
    if (!isSupported) return;

    try {
      // Create a new utterance for recording
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = isMuted ? 0 : volume[0];

      // Note: Direct audio download isn't supported by Web Speech API
      // This would require a server-side solution or different approach
      toast({
        title: "Download Not Available",
        description: "Audio download requires server-side processing. Use browser recording instead.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (!isSupported) {
    return (
      <Card className={`terminal-card border-terminal-border ${className}`}>
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <MicOff className="w-5 h-5 text-accent" />
            Voice Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your browser doesn't support text-to-speech functionality. 
            Please use a modern browser like Chrome, Firefox, or Safari.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`terminal-card border-terminal-border ${className}`}>
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Mic className="w-5 h-5 text-accent" />
          {title}
          <span className="text-sm text-muted-foreground ml-2">(Aragorn's Voice)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Preview */}
        <div className="p-4 bg-terminal-card border border-terminal-border rounded-lg max-h-40 overflow-y-auto">
          <p className="text-sm text-foreground leading-relaxed">
            {text.split(' ').map((word, index) => (
              <span
                key={index}
                className={index === currentWord ? 'bg-accent/20 text-accent font-medium' : ''}
              >
                {word}{' '}
              </span>
            ))}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={isPlaying ? pause : speak}
            variant="default"
            size="sm"
            className="bg-accent hover:bg-accent/80"
          >
            {isPlaying ? (
              isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Play'}
          </Button>

          <Button
            onClick={stop}
            variant="outline"
            size="sm"
            disabled={!isPlaying && !isPaused}
          >
            <Square className="w-4 h-4" />
            Stop
          </Button>

          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="outline"
            size="sm"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>

          <Button
            onClick={downloadAudio}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Voice Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Voice</label>
              <Select value={voice?.name || ''} onValueChange={(value) => {
                const selectedVoice = voices.find(v => v.name === value);
                if (selectedVoice) setVoice(selectedVoice);
              }}>
                <SelectTrigger className="bg-terminal-card border-terminal-border">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {voices.map((v) => (
                    <SelectItem key={v.name} value={v.name} className="text-foreground">
                      {v.name} ({v.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Speed: {rate}x
              </label>
              <Slider
                value={[rate]}
                onValueChange={(value) => setRate(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Pitch */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Pitch: {pitch}x
              </label>
              <Slider
                value={[pitch]}
                onValueChange={(value) => setPitch(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Volume: {Math.round(volume[0] * 100)}%
            </label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
              disabled={isMuted}
            />
          </div>
        </div>

        {/* Status */}
        <div className="text-xs text-muted-foreground">
          {isPlaying && (
            <span className="text-accent">
              ● Playing... {isPaused && '(Paused)'}
            </span>
          )}
          {!isPlaying && !isPaused && (
            <span>Ready to play</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
