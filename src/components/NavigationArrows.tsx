import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export const NavigationArrows = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Track navigation history
  useEffect(() => {
    setNavigationHistory(prev => {
      const newHistory = [...prev];
      const currentPath = location.pathname;
      
      // If we're not at the end of history, truncate and add new path
      if (currentIndex < newHistory.length - 1) {
        newHistory.splice(currentIndex + 1);
      }
      
      // Add current path if it's different from the last one
      if (newHistory[newHistory.length - 1] !== currentPath) {
        newHistory.push(currentPath);
        setCurrentIndex(newHistory.length - 1);
      }
      
      return newHistory;
    });
  }, [location.pathname]);

  const goBack = () => {
    if (currentIndex > 0) {
      const prevPath = navigationHistory[currentIndex - 1];
      setCurrentIndex(prev => prev - 1);
      navigate(prevPath);
    } else {
      // Fallback to browser back
      navigate(-1);
    }
  };

  const goForward = () => {
    if (currentIndex < navigationHistory.length - 1) {
      const nextPath = navigationHistory[currentIndex + 1];
      setCurrentIndex(prev => prev + 1);
      navigate(nextPath);
    } else {
      // Fallback to browser forward
      window.history.forward();
    }
  };

  const canGoBack = currentIndex > 0 || (typeof window !== "undefined" && window.history.length > 1);
  const canGoForward = currentIndex < navigationHistory.length - 1;

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={goBack}
        disabled={!canGoBack}
        className="bg-terminal-card/80 border-terminal-border text-gunmetal hover:bg-terminal-card hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed h-8 w-8 p-0 backdrop-blur-sm"
        aria-label="Go back"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={goForward}
        disabled={!canGoForward}
        className="bg-terminal-card/80 border-terminal-border text-gunmetal hover:bg-terminal-card hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed h-8 w-8 p-0 backdrop-blur-sm"
        aria-label="Go forward"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};