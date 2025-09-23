import React from "react";

interface StatCardProps {
  title: string;
  body: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, body, className = "" }) => {
  return (
    <div className={`rounded-2xl border border-neutral-800 p-5 ${className}`}>
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm text-neutral-300">{body}</p>
    </div>
  );
};
