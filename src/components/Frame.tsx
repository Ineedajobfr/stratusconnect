import React from 'react';

export function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-app">
      <header className="sticky top-0 z-20 backdrop-blur bg-app/70 border-b border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-body truncate">{title}</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">{children}</main>
    </div>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="card p-3 sm:p-4">{children}</div>;
}

export function Panel({ children }: { children: React.ReactNode }) {
  return <div className="panel p-3 sm:p-4">{children}</div>;
}