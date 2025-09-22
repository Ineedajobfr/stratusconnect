import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Mic
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleVoiceReaderProps {
  text: string;
  title?: string;
  className?: string;
}

export default function SimpleVoiceReader({ 
  text, 
  title = "Voice Reader", 
  className = "" 
}: SimpleVoiceReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true);
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support text-to-speech functionality",
        variant: "destructive"
      });
    }
  }, []);

  const speak = async () => {
    if (!isSupported || !text) return;

    setIsLoading(true);
    try {
      // Stop any current speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Simple, clean voice settings - optimized for Asian male voice
      utterance.rate = 0.85;  // Slightly slower for clarity
      utterance.pitch = 0.8;   // Slightly lower pitch
      utterance.volume = 0.9;  // Good volume

      // Try to find an Asian male voice
      const voices = speechSynthesis.getVoices();
      const asianMaleVoice = voices.find(v => 
        v.lang.startsWith('en') && (
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('david') ||
          v.name.toLowerCase().includes('alex') ||
          v.name.toLowerCase().includes('daniel') ||
          v.name.toLowerCase().includes('deep') ||
          v.name.toLowerCase().includes('low')
        )
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

      if (asianMaleVoice) {
        utterance.voice = asianMaleVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Voice synthesis error:', error);
      toast({
        title: "Voice Error",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
  };

  if (!isSupported) {
    return (
      <Card className={`terminal-card border-terminal-border ${className}`}>
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Mic className="w-5 h-5 text-accent" />
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Preview */}
        <div className="p-4 bg-terminal-card border border-terminal-border rounded-lg max-h-40 overflow-y-auto">
          <p className="text-sm text-foreground leading-relaxed">
            {text}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={isPlaying ? pause : speak}
            variant="default"
            size="sm"
            className="bg-accent hover:bg-accent/80"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isLoading ? 'Generating...' : isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Play'}
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
        </div>

        {/* Status */}
        <div className="text-xs text-muted-foreground">
          {isPlaying && (
            <span className="text-accent">
              ● Playing audio...
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
