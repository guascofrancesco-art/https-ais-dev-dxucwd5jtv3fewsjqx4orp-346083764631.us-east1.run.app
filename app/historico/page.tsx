'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useHistory } from '@/hooks/use-history';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Trash2, 
  Calendar, 
  Clock, 
  Droplets, 
  Utensils, 
  Calculator,
  ChevronRight,
  Search
} from 'lucide-react';

export default function HistoryPage() {
  const { history, deleteRecord, clearHistory, isLoaded } = useHistory();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredHistory = history.filter(record => 
    record.mealName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(record.timestamp).toLocaleDateString().includes(searchTerm)
  );

  if (!isLoaded) return null;

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-2xl">
                <History className="text-primary w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">Histórico</h1>
                <p className="text-slate-400">Registro de todas as doses aplicadas</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="Pesquisar registros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-neutral-green/20 border-border-green/30 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-primary focus:border-primary w-64"
                />
              </div>
              <button 
                onClick={() => {
                  if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
                    clearHistory();
                  }
                }}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                LIMPAR TUDO
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-neutral-green/20 border border-border-green/30 p-6 rounded-2xl">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total de Registros</p>
              <p className="text-3xl font-black text-primary">{history.length}</p>
            </div>
            <div className="bg-neutral-green/20 border border-border-green/30 p-6 rounded-2xl">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Média de Glicemia</p>
              <p className="text-3xl font-black text-primary">
                {history.length > 0 
                  ? (history.reduce((acc, r) => acc + r.glucose, 0) / history.length).toFixed(0) 
                  : 0} 
                <span className="text-sm font-bold text-slate-500 ml-1">mg/dL</span>
              </p>
            </div>
            <div className="bg-neutral-green/20 border border-border-green/30 p-6 rounded-2xl">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total de Insulina</p>
              <p className="text-3xl font-black text-primary">
                {history.reduce((acc, r) => acc + r.totalBolus, 0).toFixed(1)}
                <span className="text-sm font-bold text-slate-500 ml-1">Unidades</span>
              </p>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredHistory.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-neutral-green/10 rounded-3xl border border-dashed border-border-green/20"
                >
                  <History className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-20" />
                  <p className="text-slate-500 italic">Nenhum registro encontrado</p>
                </motion.div>
              ) : (
                filteredHistory.map((record) => (
                  <motion.div
                    key={record.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-neutral-green/20 border border-border-green/30 rounded-2xl p-6 hover:border-primary/40 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                          <Droplets className="text-primary w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">
                              {record.mealName || 'Aplicação Avulsa'}
                            </h3>
                            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-black uppercase">
                              {record.totalBolus.toFixed(1)}U
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(record.timestamp).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 max-w-2xl">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Glicemia</span>
                          <span className="text-xl font-black text-primary">{record.glucose} <span className="text-[10px] font-normal text-slate-500">mg/dL</span></span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Carbos</span>
                          <span className="text-xl font-black text-primary">{record.carbs.toFixed(0)} <span className="text-[10px] font-normal text-slate-500">g</span></span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Correção</span>
                          <span className="text-xl font-black text-slate-300">{record.bolusCorrection.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">U</span></span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Alimentar</span>
                          <span className="text-xl font-black text-slate-300">{record.bolusFood.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">U</span></span>
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteRecord(record.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-3 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
