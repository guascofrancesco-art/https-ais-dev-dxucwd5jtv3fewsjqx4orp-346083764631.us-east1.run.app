'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
      <footer className="bg-bg-dark border-t border-border-green px-8 py-2 flex justify-between items-center text-[10px] text-slate-500 font-medium uppercase tracking-widest">
        <div className="flex gap-4">
          <span>Versão 2.4.0</span>
          <span suppressHydrationWarning>Última Sincronização: Hoje, {timeString}</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
            Servidor Online
          </span>
        </div>
      </footer>
    </div>
  );
}
