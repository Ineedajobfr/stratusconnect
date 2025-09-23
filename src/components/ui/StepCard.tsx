import React from "react";

interface StepCardProps {
  title: string;
  body: string;
  stepNumber?: number;
  className?: string;
}

export const StepCard: React.FC<StepCardProps> = ({ 
  title, 
  body, 
  stepNumber, 
  className = "" 
}) => {
  return (
    <div className={`rounded-2xl border border-neutral-800 p-5 ${className}`}>
      {stepNumber && (
        <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-sm font-semibold text-neutral-300 mb-3">
          {stepNumber}
        </div>
      )}
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm text-neutral-300">{body}</p>
    </div>
  );
};
