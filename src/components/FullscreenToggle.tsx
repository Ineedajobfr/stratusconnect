import { Maximize, Minimize } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Listen for fullscreen changes (including ESC key or F11)
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await document.documentElement.requestFullscreen();
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <Button
      onClick={toggleFullscreen}
      variant="outline"
      size="icon"
      className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm border-slate-700/30 hover:bg-black/90 hover:border-orange-500/50 text-white shadow-lg"
      title={isFullscreen ? 'Exit Fullscreen (ESC)' : 'Enter Fullscreen'}
    >
      {isFullscreen ? (
        <Minimize className="h-5 w-5 text-orange-400" />
      ) : (
        <Maximize className="h-5 w-5 text-orange-400" />
      )}
    </Button>
  );
}


