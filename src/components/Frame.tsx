import React from 'react';

export function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-app w-full overflow-x-hidden">
      <header className="sticky top-0 z-20 backdrop-blur bg-app/70 border-b border-default">
        <div className="w-full max-w-none px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-body truncate">{title}</h1>
        </div>
      </header>
      <main className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-6">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card p-3 sm:p-4 md:p-6 w-full ${className}`}>{children}</div>;
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`panel p-3 sm:p-4 md:p-6 w-full ${className}`}>{children}</div>;
}