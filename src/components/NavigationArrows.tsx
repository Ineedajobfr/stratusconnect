import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationArrowsProps {
  className?: string;
}

export const NavigationArrows: React.FC<NavigationArrowsProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to home page if no history
      navigate('/');
    }
  };

  const handleForwardClick = () => {
    // Navigate forward in history
    navigate(1);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBackClick}
        className="h-8 w-8 p-0 border-slate-600/50 text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200"
        title="Go back"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleForwardClick}
        className="h-8 w-8 p-0 border-slate-600/50 text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200"
        title="Go forward"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NavigationArrows;