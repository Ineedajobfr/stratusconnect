import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Mic,
  MicOff,
  Settings,
  Users,
  Zap,
  Crown,
  Star,
  Heart,
  Wrench
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  AdvancedVoiceSystem, 
  voicePersonalities, 
  getVoiceGreeting,
  getRecommendedVoice 
} from '@/lib/advanced-voice-system';

interface AdvancedVoiceSelectorProps {
  text: string;
  title?: string;
  userType?: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  className?: string;
}

export default function AdvancedVoiceSelector({ 
  text, 
  title = "Advanced AI Voice System", 
  userType = 'broker',
  className = "" 
}: AdvancedVoiceSelectorProps) {
  const [voiceSystem] = useState(() => new AdvancedVoiceSystem());
  const [currentVoice, setCurrentVoice] = useState(voiceSystem.getCurrentVoice());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      // Set recommended voice for user type
      const recommendedVoice = getRecommendedVoice(userType);
      voiceSystem.setVoice(recommendedVoice);
      setCurrentVoice(voiceSystem.getCurrentVoice());
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support text-to-speech functionality",
        variant: "destructive"
      });
    }
  }, [userType]);

  const handleVoiceChange = (voiceId: string) => {
    voiceSystem.setVoice(voiceId);
    setCurrentVoice(voiceSystem.getCurrentVoice());
    
    // Play greeting with new voice
    const greeting = getVoiceGreeting(voiceId, 'general');
    voiceSystem.speak(greeting);
  };

  const speak = async () => {
    if (!isSupported || !text) return;

    setIsLoading(true);
    try {
      await voiceSystem.speak(text);
      setIsPlaying(true);
      setIsPaused(false);
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
    voiceSystem.pause();
    setIsPaused(voiceSystem.isCurrentlyPaused());
  };

  const stop = () => {
    voiceSystem.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const getVoiceIcon = (personality: string) => {
    switch (personality) {
      case 'alex-professional': return <Crown className="w-4 h-4" />;
      case 'sarah-enthusiastic': return <Zap className="w-4 h-4" />;
      case 'marcus-technical': return <Wrench className="w-4 h-4" />;
      case 'elena-supportive': return <Heart className="w-4 h-4" />;
      default: return <Mic className="w-4 h-4" />;
    }
  };

  const getVoiceColor = (personality: string) => {
    switch (personality) {
      case 'alex-professional': return 'text-blue-500';
      case 'sarah-enthusiastic': return 'text-yellow-500';
      case 'marcus-technical': return 'text-green-500';
      case 'elena-supportive': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  };

  const getPersonalityBadge = (personality: string) => {
    const badges = {
      'alex-professional': { text: 'Professional', color: 'bg-blue-500' },
      'sarah-enthusiastic': { text: 'Energetic', color: 'bg-yellow-500' },
      'marcus-technical': { text: 'Technical', color: 'bg-green-500' },
      'elena-supportive': { text: 'Supportive', color: 'bg-pink-500' }
    };
    
    const badge = badges[personality as keyof typeof badges];
    if (!badge) return null;

    return (
      <Badge className={`${badge.color} text-white`}>
        {badge.text}
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
          <Users className="w-5 h-5 text-accent" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose from 4 distinct AI personalities, each optimized for different use cases
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Voice Display */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="w-10 h-10">
              <AvatarFallback className={getVoiceColor(currentVoice.personality)}>
                {getVoiceIcon(currentVoice.personality)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{currentVoice.name}</h3>
              <p className="text-sm text-muted-foreground">{currentVoice.description}</p>
            </div>
            {getPersonalityBadge(currentVoice.personality)}
          </div>
          <p className="text-sm text-muted-foreground italic">
            "{currentVoice.catchphrase}"
          </p>
        </div>

        {/* Voice Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Select AI Voice</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {voicePersonalities.map((voice) => (
              <div
                key={voice.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  currentVoice.id === voice.id
                    ? 'border-accent bg-accent/10'
                    : 'border-terminal-border hover:border-accent/50'
                }`}
                onClick={() => handleVoiceChange(voice.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={getVoiceColor(voice.personality)}>
                    {getVoiceIcon(voice.personality)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">{voice.name}</h4>
                    <p className="text-xs text-muted-foreground">{voice.useCase}</p>
                  </div>
                  {getPersonalityBadge(voice.personality)}
                </div>
              </div>
            ))}
          </div>
        </div>

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

        {/* Voice Settings Display */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-sm text-foreground font-medium mb-2">
            Current Voice Settings:
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div>Rate: {currentVoice.voiceSettings.rate}x</div>
            <div>Pitch: {currentVoice.voiceSettings.pitch}</div>
            <div>Volume: {Math.round(currentVoice.voiceSettings.volume * 100)}%</div>
            <div>Tone: {currentVoice.voiceSettings.tone}</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-xs text-muted-foreground">
          {isPlaying && (
            <span className="text-accent">
              ● Playing with {currentVoice.name}...
            </span>
          )}
          {!isPlaying && !isPaused && (
            <span>Ready to play with {currentVoice.name}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
