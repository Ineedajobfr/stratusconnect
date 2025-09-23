import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Mic,
  MicOff,
  Settings,
  Zap,
  Crown,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedVoiceReader, voiceServices, voiceQualityComparison } from '@/lib/voice-services';

interface EnhancedVoiceReaderProps {
  text: string;
  title?: string;
  className?: string;
}

export default function EnhancedVoiceReader({ 
  text, 
  title = "Enhanced AI Voice Reader", 
  className = "" 
}: EnhancedVoiceReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentService, setCurrentService] = useState<'browser' | 'elevenlabs' | 'azure' | 'google'>('browser');
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const voiceReader = new EnhancedVoiceReader();
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
      voiceReader.setService(currentService);
      await voiceReader.speak(text);
      setIsPlaying(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Voice synthesis error:', error);
      toast({
        title: "Voice Error",
        description: "Failed to generate speech. Falling back to browser voice.",
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

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'elevenlabs': return <Crown className="w-4 h-4" />;
      case 'azure': return <Star className="w-4 h-4" />;
      case 'google': return <Zap className="w-4 h-4" />;
      default: return <Mic className="w-4 h-4" />;
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'elevenlabs': return 'text-purple-500';
      case 'azure': return 'text-blue-500';
      case 'google': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getQualityBadge = (service: string) => {
    const quality = voiceQualityComparison[service as keyof typeof voiceQualityComparison];
    if (!quality) return null;

    const colorClass = quality.quality === 'Professional' ? 'bg-purple-500' :
                      quality.quality === 'Excellent' ? 'bg-green-500' :
                      quality.quality === 'Good' ? 'bg-blue-500' : 'bg-gray-500';

    return (
      <Badge className={`${colorClass} text-white`}>
        {quality.quality}
      </Badge>
    );
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Preview */}
        <div className="p-4 bg-terminal-card border border-terminal-border rounded-lg max-h-40 overflow-y-auto">
          <p className="text-sm text-foreground leading-relaxed">
            {text}
          </p>
        </div>

        {/* Service Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Voice Service</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {voiceServices.map((service) => (
              <div
                key={service.name}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  currentService === service.provider.toLowerCase()
                    ? 'border-accent bg-accent/10'
                    : 'border-terminal-border hover:border-accent/50'
                }`}
                onClick={() => setCurrentService(service.provider.toLowerCase() as any)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={getServiceColor(service.provider.toLowerCase())}>
                      {getServiceIcon(service.provider.toLowerCase())}
                    </div>
                    <span className="font-medium text-foreground">{service.name}</span>
                  </div>
                  {getQualityBadge(service.provider.toLowerCase())}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {service.cost} • {service.features.slice(0, 2).join(', ')}
                </div>
              </div>
            ))}
          </div>
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

        {/* Service Info */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-sm text-foreground font-medium mb-2">
            {voiceServices.find(s => s.provider.toLowerCase() === currentService)?.name} Features:
          </div>
          <div className="text-xs text-muted-foreground">
            {voiceServices.find(s => s.provider.toLowerCase() === currentService)?.features.join(' • ')}
          </div>
        </div>

        {/* Setup Instructions */}
        {currentService !== 'browser' && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Setup Required:
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              To use {voiceServices.find(s => s.provider.toLowerCase() === currentService)?.name}, 
              add your API key to the environment variables. Contact support for setup assistance.
            </div>
          </div>
        )}

        {/* Status */}
        <div className="text-xs text-muted-foreground">
          {isPlaying && (
            <span className="text-accent">
              ● Playing with {voiceServices.find(s => s.provider.toLowerCase() === currentService)?.name}...
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
