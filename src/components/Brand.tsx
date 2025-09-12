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
  ButtonPrimary: ({ children, className = "", ...props }: ButtonProps) => (
    <button
      className={`bg-[rgb(var(--sc-accent))] text-[#0B0F1A] hover:opacity-90 px-4 py-2 rounded-xl font-semibold transition-opacity ${className}`}
      {...props}
    >
      {children}
    </button>
  ),
  
  ButtonSecondary: ({ children, className = "", ...props }: ButtonProps) => (
    <button 
      className={`bg-elev text-body border border-default hover:bg-surface px-4 py-2 rounded-xl transition-colors ${className}`} 
      {...props}
    >
      {children}
    </button>
  ),
  
  Card: ({ children, className = "" }: CardProps) => (
    <div className={`card p-4 ${className}`}>{children}</div>
  ),
  
  Panel: ({ children, className = "" }: CardProps) => (
    <div className={`panel p-4 ${className}`}>{children}</div>
  ),
  
  SectionTitle: ({ children }: SectionTitleProps) => (
    <h2 className="text-lg font-semibold text-body mb-4">{children}</h2>
  ),
  
  PageTitle: ({ children }: SectionTitleProps) => (
    <h1 className="text-2xl font-bold text-body mb-6">{children}</h1>
  ),
  
  StatusChip: ({ status, children }: { status: 'success' | 'warn' | 'danger' | 'info'; children: React.ReactNode }) => {
    const baseClasses = "chip";
    const statusClasses = {
      success: "chip-success",
      warn: "chip-warn", 
      danger: "chip-warn", // Using warn style for danger
      info: "chip-info"
    };
    
    return (
      <span className={`${baseClasses} ${statusClasses[status]}`}>
        {children}
      </span>
    );
  }
};
