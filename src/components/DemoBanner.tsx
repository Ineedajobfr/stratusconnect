import { AlertTriangle } from "lucide-react";
import { memo } from "react";

export const DemoBanner = memo(() => {
  // Only show in demo/development mode
  if (import.meta.env.PROD) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600/90 backdrop-blur-sm border-b border-amber-500/30">
      <div className="flex items-center justify-center gap-2 py-2 px-4">
        <AlertTriangle className="h-4 w-4 text-amber-200" />
        <span className="text-amber-100 text-sm font-medium">
          Demo Mode Active - Using demo data and mock functionality
        </span>
      </div>
    </div>
  );
});