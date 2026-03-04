'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { BarChart3, TrendingUp, Calendar, Download, FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-2xl">
                <BarChart3 className="text-primary w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">Relatórios</h1>
                <p className="text-slate-400">Análise detalhada do seu controle glicêmico</p>
              </div>
            </div>
            
            <button className="bg-primary text-bg-dark px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <Download className="w-5 h-5" />
              EXPORTAR PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-green/20 border border-border-green/30 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="bg-primary/10 p-6 rounded-full mb-6">
                <TrendingUp className="text-primary w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tendências e Médias</h3>
              <p className="text-slate-500 max-w-xs">
                Visualize como sua glicemia se comporta ao longo do dia e identifique padrões.
              </p>
              <div className="mt-8 w-full h-48 bg-neutral-green/10 rounded-2xl border border-border-green/10 flex items-center justify-center italic text-slate-600">
                Gráfico de Tendência (Em breve)
              </div>
            </div>

            <div className="bg-neutral-green/20 border border-border-green/30 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="bg-primary/10 p-6 rounded-full mb-6">
                <Calendar className="text-primary w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-2">Resumo Mensal</h3>
              <p className="text-slate-500 max-w-xs">
                Um panorama completo do seu mês para compartilhar com sua equipe médica.
              </p>
              <div className="mt-8 w-full h-48 bg-neutral-green/10 rounded-2xl border border-border-green/10 flex items-center justify-center italic text-slate-600">
                Calendário de Controle (Em breve)
              </div>
            </div>
          </div>

          <div className="mt-8 bg-neutral-green/20 border border-border-green/30 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-primary w-6 h-6" />
              <h3 className="text-xl font-bold">Relatórios Recentes</h3>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-neutral-green/10 rounded-2xl border border-border-green/5">
                  <div className="flex items-center gap-4">
                    <div className="bg-bg-dark p-2 rounded-lg">
                      <FileText className="text-slate-400 w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">Relatório Mensal - Março 2024</p>
                      <p className="text-xs text-slate-500">Gerado em 01/03/2024 • 1.2 MB</p>
                    </div>
                  </div>
                  <button className="text-primary font-bold text-sm hover:underline">Download</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
