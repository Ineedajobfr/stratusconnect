import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export const Section: React.FC<SectionProps> = ({ 
  title, 
  children, 
  className = "",
  titleClassName = ""
}) => {
  return (
    <section className={`mx-auto max-w-5xl px-6 py-12 border-t border-neutral-800 ${className}`}>
      <h2 className={`text-2xl font-semibold ${titleClassName}`}>{title}</h2>
      {children}
    </section>
  );
};
