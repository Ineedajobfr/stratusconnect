import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Mic,
  Clock,
  FileText,
  Zap
} from 'lucide-react';
import { voiceScripts, voiceSettings } from '@/scripts/voice-scripts';

export default function VoiceScriptDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScript, setCurrentScript] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

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

  const speak = (scriptId: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser doesn\'t support text-to-speech functionality');
      return;
    }

    const script = voiceScripts[scriptId as keyof typeof voiceScripts];
    if (!script) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(script);
    
    // Apply voice settings based on script type
    const settings = voiceSettings[scriptId as keyof typeof voiceSettings] || voiceSettings.userManuals;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentScript(scriptId);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentScript(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentScript(null);
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
    setCurrentScript(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          🎤 AI Voice Script Demo
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Experience the engaging, conversational AI voice scripts written in the style you requested
        </p>
      </div>

      {/* Controls */}
      <Card className="terminal-card border-terminal-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Mic className="w-5 h-5 text-accent" />
            Voice Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={isPlaying ? pause : () => {}}
              variant="default"
              size="sm"
              className="bg-accent hover:bg-accent/80"
              disabled={!currentScript}
            >
              {isPlaying ? (isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />) : <Play className="w-4 h-4" />}
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

            {currentScript && (
              <Badge className="bg-accent text-white">
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
            <CardTitle className="text-foreground text-xl">
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
            <p>• Click on any script card to start playing the voice narration</p>
            <p>• Use the Play/Pause button to control playback</p>
            <p>• Click Stop to end the current narration</p>
            <p>• Each script is written in the engaging, conversational style you requested</p>
            <p>• The AI voice adapts its tone based on the content (enthusiastic, helpful, professional)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
