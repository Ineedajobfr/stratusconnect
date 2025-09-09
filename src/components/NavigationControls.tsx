import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavigationControlsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  showHome?: boolean;
  showHelp?: boolean;
  helpPage?: string;
  className?: string;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  onPrevious,
  onNext,
  showHome = true,
  showHelp = true,
  helpPage,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleHelp = () => {
    if (helpPage) {
      navigate(`/help/${helpPage}`);
    }
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2">
        {onPrevious && (
          <Button
            onClick={onPrevious}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
        )}
        {showHome && (
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {showHelp && (
          <Button
            onClick={handleHelp}
            variant="outline"
            size="sm"
            className="border-orange-500/50 text-orange-300 hover:bg-orange-500/10"
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            Help
          </Button>
        )}
        {onNext && (
          <Button
            onClick={onNext}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};
