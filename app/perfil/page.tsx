'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useProfile } from '@/hooks/use-profile';
import { 
  User, 
  Mail, 
  Stethoscope, 
  Target, 
  Zap, 
  Scale, 
  Save, 
  Info,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function ProfilePage() {
  const { profile, updateProfile, saveProfile, isLoaded } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    saveProfile();
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  if (!isLoaded) return null;

  return (
    <DashboardLayout>
      <main className="flex-1 flex flex-col items-center py-10 px-6 lg:px-40 overflow-y-auto">
        <div className="w-full max-w-[1100px]">
          <div className="mb-10">
            <h1 className="text-4xl font-black leading-tight tracking-tight">Configuração de Perfil</h1>
            <p className="text-slate-400 text-lg font-normal leading-normal max-w-2xl mt-2">
              Personalize seus dados e parâmetros médicos para garantir cálculos precisos de dosagem de insulina.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Personal Data */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-bold leading-tight mb-6 flex items-center gap-2">
                  <User className="text-primary w-6 h-6" />
                  Dados Pessoais
                </h2>
                <div className="flex flex-col gap-5">
                  <label className="flex flex-col w-full">
                    <p className="text-slate-300 text-sm font-semibold leading-normal pb-2">Nome Completo</p>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input
                        className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-green/30 bg-neutral-green/20 h-14 pl-12 pr-4 text-base font-normal"
                        placeholder="Ex: João Silva"
                        value={profile.name}
                        onChange={(e) => updateProfile({ name: e.target.value })}
                      />
                    </div>
                  </label>
                  <label className="flex flex-col w-full">
                    <p className="text-slate-300 text-sm font-semibold leading-normal pb-2">E-mail</p>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input
                        className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-green/30 bg-neutral-green/20 h-14 pl-12 pr-4 text-base font-normal"
                        placeholder="seu@email.com"
                        type="email"
                        value={profile.email}
                        onChange={(e) => updateProfile({ email: e.target.value })}
                      />
                    </div>
                  </label>
                  <label className="flex flex-col w-full">
                    <p className="text-slate-300 text-sm font-semibold leading-normal pb-2">Tipo de Diabetes</p>
                    <select 
                      className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-green/30 bg-neutral-green/20 h-14 px-4 text-base font-normal appearance-none"
                      value={profile.diabetesType}
                      onChange={(e) => updateProfile({ diabetesType: e.target.value })}
                    >
                      <option>Tipo 1</option>
                      <option>Tipo 2</option>
                      <option>LADA / Outros</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
                <div className="flex gap-4 items-start">
                  <Info className="text-primary w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="text-white font-bold mb-1">Por que esses dados?</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Seus parâmetros médicos são fundamentais para calcular a dose correta de insulina. Consulte sempre seu médico antes de alterar estes valores.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Medical Parameters */}
            <div className="lg:col-span-7">
              <div className="bg-neutral-green/10 rounded-2xl p-8 border border-border-green/30 shadow-xl">
                <h2 className="text-2xl font-bold leading-tight mb-8 flex items-center gap-2">
                  <Stethoscope className="text-primary w-6 h-6" />
                  Parâmetros Médicos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <label className="flex flex-col">
                      <div className="flex justify-between items-center pb-2">
                        <p className="text-slate-300 text-sm font-semibold">Meta Glicêmica</p>
                        <span className="text-xs text-slate-500">mg/dL</span>
                      </div>
                      <div className="relative">
                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                          type="number"
                          className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-green/30 bg-neutral-green/20 h-14 pl-12 pr-16 text-base font-bold"
                          placeholder="Ex: 100"
                          value={profile.targetGlucose}
                          onChange={(e) => updateProfile({ targetGlucose: parseFloat(e.target.value) || 0 })}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold">{profile.targetGlucose}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 italic">Valor ideal alvo no sangue</p>
                    </label>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="flex flex-col">
                      <div className="flex justify-between items-center pb-2">
                        <p className="text-slate-300 text-sm font-semibold">Fator de Sensibilidade</p>
                        <span className="text-xs text-slate-500">mg/dL per UI</span>
                      </div>
                      <div className="relative">
                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                          type="number"
                          className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-green/30 bg-neutral-green/20 h-14 pl-12 pr-16 text-base font-bold"
                          placeholder="Ex: 40"
                          value={profile.sensitivityFactor}
                          onChange={(e) => updateProfile({ sensitivityFactor: parseFloat(e.target.value) || 0 })}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold">{profile.sensitivityFactor}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 italic">Quanto 1 UI reduz a glicemia</p>
                    </label>
                  </div>
                  <div className="col-span-2">
                    <label className="flex flex-col">
                      <div className="flex justify-between items-center pb-2">
                        <p className="text-slate-300 text-sm font-semibold">Razão Insulina / Carboidrato</p>
                        <span className="text-xs text-slate-500">g CHO per UI</span>
                      </div>
                      <div className="relative">
                        <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                          type="number"
                          className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-green/30 bg-neutral-green/20 h-14 pl-12 pr-16 text-base font-bold"
                          placeholder="Ex: 15"
                          value={profile.carbRatio}
                          onChange={(e) => updateProfile({ carbRatio: parseFloat(e.target.value) || 0 })}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold">{profile.carbRatio}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 italic">Grama de carboidrato coberta por 1 UI</p>
                    </label>
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-border-green/20 flex justify-end items-center gap-4">
                  {showSuccess && (
                    <div className="flex items-center gap-2 text-primary text-sm font-bold animate-in fade-in slide-in-from-right-4">
                      <CheckCircle2 className="w-5 h-5" />
                      Perfil salvo com sucesso!
                    </div>
                  )}
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-bg-dark font-bold text-lg py-4 px-10 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="w-6 h-6 border-2 border-bg-dark border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Salvar Perfil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1100px] mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary w-5 h-5" />
            <span>Seus dados são armazenados de forma segura e privada.</span>
          </div>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">Termos de Uso</a>
            <a className="hover:text-primary transition-colors" href="#">Privacidade</a>
            <a className="hover:text-primary transition-colors" href="#">Ajuda</a>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
