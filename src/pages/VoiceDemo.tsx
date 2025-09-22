import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Mic,
  Clock,
  FileText,
  Zap,
  Crown,
  Star,
  Heart,
  Wrench,
  Users,
  Settings
} from 'lucide-react';
import { 
  voicePersonalities, 
  getVoiceGreeting,
  getRecommendedVoice,
  AdvancedVoiceSystem 
} from '@/lib/advanced-voice-system';
import { voiceScripts } from '@/scripts/voice-scripts';

export default function VoiceDemo() {
  const [voiceSystem] = useState(() => new AdvancedVoiceSystem());
  const [currentVoice, setCurrentVoice] = useState(voicePersonalities[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentScript, setCurrentScript] = useState<string | null>(null);

  const scriptCategories = [
    {
      title: 'Platform Overview',
      scripts: [
        { id: 'platformOverview', name: 'Platform Overview (5 min)', duration: '5 min', icon: <Zap className="w-4 h-4" /> },
        { id: 'aiFeatures', name: 'AI Features Demo (8 min)', duration: '8 min', icon: <Mic className="w-4 h-4" /> },
        { id: 'searchTips', name: 'Advanced Search Tips (6 min)', duration: '6 min', icon: <FileText className="w-4 h-4" /> },
        { id: 'paymentEscrow', name: 'Payment & Escrow (4 min)', duration: '4 min', icon: <Volume2 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'User Manuals',
      scripts: [
        { id: 'brokerGuide', name: 'Broker Terminal Guide', duration: '3 min', icon: <FileText className="w-4 h-4" /> },
        { id: 'operatorGuide', name: 'Operator Terminal Guide', duration: '4 min', icon: <FileText className="w-4 h-4" /> },
        { id: 'pilotGuide', name: 'Pilot Terminal Guide', duration: '3 min', icon: <FileText className="w-4 h-4" /> },
        { id: 'crewGuide', name: 'Crew Terminal Guide', duration: '3 min', icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Support',
      scripts: [
        { id: 'liveChat', name: 'Live Chat Support', duration: '2 min', icon: <Mic className="w-4 h-4" /> },
        { id: 'knowledgeBase', name: 'Knowledge Base', duration: '2 min', icon: <FileText className="w-4 h-4" /> },
        { id: 'apiDocs', name: 'API Documentation', duration: '2 min', icon: <FileText className="w-4 h-4" /> },
        { id: 'systemStatus', name: 'System Status', duration: '1 min', icon: <Clock className="w-4 h-4" /> }
      ]
    }
  ];

  const speak = async (scriptId: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser doesn\'t support text-to-speech functionality');
      return;
    }

    const script = voiceScripts[scriptId as keyof typeof voiceScripts];
    if (!script) return;

    // Stop any current speech
    voiceSystem.stop();

    try {
      await voiceSystem.speak(script);
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentScript(scriptId);
    } catch (error) {
      console.error('Voice synthesis error:', error);
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
    setCurrentScript(null);
  };

  const handleVoiceChange = (voiceId: string) => {
    voiceSystem.setVoice(voiceId);
    setCurrentVoice(voiceSystem.getCurrentVoice());
    
    // Play greeting with new voice
    const greeting = getVoiceGreeting(voiceId, 'demo');
    voiceSystem.speak(greeting);
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

  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            🎤 Advanced AI Voice System
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Experience 4 distinct AI personalities, each optimized for different use cases
          </p>
        </div>

        {/* Voice Selection */}
        <Card className="terminal-card border-terminal-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Choose Your AI Voice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {voicePersonalities.map((voice) => (
                <div
                  key={voice.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    currentVoice.id === voice.id
                      ? 'border-accent bg-accent/10'
                      : 'border-terminal-border hover:border-accent/50'
                  }`}
                  onClick={() => handleVoiceChange(voice.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={getVoiceColor(voice.personality)}>
                        {getVoiceIcon(voice.personality)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{voice.name}</h3>
                      <p className="text-xs text-muted-foreground">{voice.useCase}</p>
                    </div>
                    {getPersonalityBadge(voice.personality)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {voice.description}
                  </p>
                  
                  <p className="text-xs text-muted-foreground italic">
                    "{voice.catchphrase}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Voice Display */}
        <Card className="terminal-card border-terminal-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Settings className="w-5 h-5 text-accent" />
              Current Voice Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className={getVoiceColor(currentVoice.personality)}>
                      {getVoiceIcon(currentVoice.personality)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{currentVoice.name}</h3>
                    <p className="text-muted-foreground">{currentVoice.description}</p>
                    {getPersonalityBadge(currentVoice.personality)}
                  </div>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-foreground italic">
                    "{currentVoice.catchphrase}"
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Voice Settings</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="text-foreground">{currentVoice.voiceSettings.rate}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pitch:</span>
                    <span className="text-foreground">{currentVoice.voiceSettings.pitch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volume:</span>
                    <span className="text-foreground">{Math.round(currentVoice.voiceSettings.volume * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tone:</span>
                    <span className="text-foreground">{currentVoice.voiceSettings.tone}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="terminal-card border-terminal-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-accent" />
              Voice Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={isPlaying ? pause : () => {}}
                variant="default"
                size="lg"
                className="bg-accent hover:bg-accent/80"
                disabled={!currentScript}
              >
                {isPlaying ? (isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />) : <Play className="w-5 h-5" />}
                {isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Play'}
              </Button>

              <Button
                onClick={stop}
                variant="outline"
                size="lg"
                disabled={!isPlaying && !isPaused}
              >
                <Square className="w-5 h-5" />
                Stop
              </Button>

              {currentScript && (
                <Badge className="bg-accent text-white text-lg px-4 py-2">
                  Playing: {scriptCategories.flatMap(cat => cat.scripts).find(s => s.id === currentScript)?.name}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Script Categories */}
        {scriptCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="terminal-card border-terminal-border">
            <CardHeader>
              <CardTitle className="text-foreground text-2xl">
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.scripts.map((script) => (
                  <div
                    key={script.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      currentScript === script.id
                        ? 'border-accent bg-accent/10'
                        : 'border-terminal-border hover:border-accent/50'
                    }`}
                    onClick={() => speak(script.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-accent">
                        {script.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground text-sm">
                          {script.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {script.duration}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {voiceScripts[script.id as keyof typeof voiceScripts]?.substring(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Script Preview */}
        {currentScript && (
          <Card className="terminal-card border-terminal-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Script Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-60 overflow-y-auto p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">
                  {voiceScripts[currentScript as keyof typeof voiceScripts]}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="terminal-card border-terminal-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Click on any voice card to switch to that AI personality</p>
              <p>• Click on any script card to start playing the voice narration</p>
              <p>• Use the Play/Pause button to control playback</p>
              <p>• Each voice adapts the script to match their personality</p>
              <p>• The AI voices sound more human and engaging than standard TTS</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
