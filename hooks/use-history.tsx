'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DoseRecord {
  id: string;
  timestamp: string;
  glucose: number;
  carbs: number;
  bolusCorrection: number;
  bolusFood: number;
  totalBolus: number;
  mealName?: string;
}

interface HistoryContextType {
  history: DoseRecord[];
  addRecord: (record: Omit<DoseRecord, 'id' | 'timestamp'>) => void;
  deleteRecord: (id: string) => void;
  clearHistory: () => void;
  isLoaded: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<DoseRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadHistory = () => {
      const saved = localStorage.getItem('glicocalc_history');
      if (saved) {
        try {
          setHistory(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse history', e);
        }
      }
      setIsLoaded(true);
    };

    const timer = setTimeout(loadHistory, 0);
    return () => clearTimeout(timer);
  }, []);

  const addRecord = (record: Omit<DoseRecord, 'id' | 'timestamp'>) => {
    const newRecord: DoseRecord = {
      ...record,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    const updated = [newRecord, ...history];
    setHistory(updated);
    localStorage.setItem('glicocalc_history', JSON.stringify(updated));
  };

  const deleteRecord = (id: string) => {
    const updated = history.filter(r => r.id !== id);
    setHistory(updated);
    localStorage.setItem('glicocalc_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('glicocalc_history');
  };

  return (
    <HistoryContext.Provider value={{ history, addRecord, deleteRecord, clearHistory, isLoaded }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
