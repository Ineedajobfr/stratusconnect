import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Clock, 
  Mic,
  Settings
} from 'lucide-react';
import { voiceScripts } from '@/scripts/voice-scripts';

interface VoiceScriptDemoProps {
  className?: string;
}

export default function VoiceScriptDemo({ className = "" }: VoiceScriptDemoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScript, setCurrentScript] = useState<keyof typeof voiceScripts>('platformOverview');
  const [speechInstance, setSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null);

  const scripts = [
    { 
      key: 'platformOverview' as keyof typeof voiceScripts, 
      title: 'Platform Overview', 
      duration: '5 min',
      description: 'Complete introduction to StratusConnect features'
    },
    { 
      key: 'aiFeatures' as keyof typeof voiceScripts, 
      title: 'AI Features Demo', 
      duration: '8 min',
      description: 'Deep dive into AI-powered functionality'
    }
  ];

  const speak = () => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(voiceScripts[currentScript]);
      
      // Configure voice settings
      utterance.rate = 0.9;
      utterance.pitch = 1.0; 
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      setSpeechInstance(utterance);
      window.speechSynthesis.speak(utterance);
    }
  };

  const pause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const currentScriptData = scripts.find(s => s.key === currentScript);

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Voice Script Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Script Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Demo Script:</label>
          <Select 
            value={currentScript} 
            onValueChange={(value) => setCurrentScript(value as keyof typeof voiceScripts)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scripts.map((script) => (
                <SelectItem key={script.key} value={script.key}>
                  <div className="flex items-center justify-between w-full">
                    <span>{script.title}</span>
                    <Badge variant="outline" className="ml-2">
                      {script.duration}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Script Info */}
        {currentScriptData && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{currentScriptData.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {currentScriptData.duration}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentScriptData.description}
            </p>
          </div>
        )}

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <Button onClick={speak} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Start Demo
            </Button>
          ) : (
            <>
              <Button onClick={pause} variant="outline" className="flex items-center gap-2">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
              <Button onClick={resume} variant="outline" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Resume
              </Button>
            </>
          )}
          
          <Button 
            onClick={stop} 
            variant="outline" 
            disabled={!isPlaying}
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop
          </Button>
        </div>

        {/* Voice Settings */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Settings className="w-4 h-4" />
          <span>Voice settings: Rate 0.9x, Pitch 1.0x, Volume 80%</span>
        </div>

        {/* Browser Support Warning */}
        {'speechSynthesis' in window ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Volume2 className="w-4 h-4" />
            Voice synthesis supported in your browser
          </div>
        ) : (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              Voice synthesis not supported in your browser. Please use Chrome, Firefox, or Safari for the best experience.
            </p>
          </div>
        )}

        {/* Script Preview */}
        <div className="mt-4">
          <details className="text-sm">
            <summary className="cursor-pointer font-medium mb-2">Preview Script Content</summary>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto text-xs">
              {voiceScripts[currentScript].substring(0, 300)}...
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}