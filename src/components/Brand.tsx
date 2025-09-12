import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionTitleProps {
  children: React.ReactNode;
}

export const Brand = {
  // Primary action button - Stratus orange
  Primary: ({ children, className = "", ...props }: ButtonProps) => (
    <button
      className={`px-4 py-2 rounded-xl font-semibold bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:opacity-90 transition-opacity ${className}`}
      {...props}
    >
      {children}
    </button>
  ),
  
  // Secondary action button - dark theme
  Secondary: ({ children, className = "", ...props }: ButtonProps) => (
    <button 
      className={`px-4 py-2 rounded-xl bg-elev text-body border border-default hover:bg-elev/90 transition-colors ${className}`} 
      {...props}
    >
      {children}
    </button>
  ),
  
  // Card container - consistent dark styling
  Card: ({ children, className = "" }: CardProps) => (
    <div className={`card p-4 ${className}`}>{children}</div>
  ),
  
  // Panel container - elevated dark styling
  Panel: ({ children, className = "" }: CardProps) => (
    <div className={`panel p-4 ${className}`}>{children}</div>
  ),
  
  // Typography components
  SectionTitle: ({ children }: SectionTitleProps) => (
    <h2 className="text-lg font-semibold text-body mb-4">{children}</h2>
  ),
  
  PageTitle: ({ children }: SectionTitleProps) => (
    <h1 className="text-2xl font-bold text-body mb-6">{children}</h1>
  ),
  
  // Status chip with proper styling
  StatusChip: ({ status, children }: { status: 'success' | 'warn' | 'danger' | 'info'; children: React.ReactNode }) => {
    const baseClasses = "chip";
    const statusClasses = {
      success: "chip-success",
      warn: "chip-warn", 
      danger: "chip-danger",
      info: "chip-info"
    };
    
    return (
      <span className={`${baseClasses} ${statusClasses[status]}`}>
        {children}
      </span>
    );
  }
};
