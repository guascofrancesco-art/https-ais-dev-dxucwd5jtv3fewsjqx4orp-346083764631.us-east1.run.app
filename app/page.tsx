'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useProfile } from '@/hooks/use-profile';
import { useFoods, Food } from '@/hooks/use-foods';
import { useHistory } from '@/hooks/use-history';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Calculator, 
  Utensils, 
  Droplets,
  Save,
  ShoppingCart,
  X,
  Scale
} from 'lucide-react';

export default function CalculatorPage() {
  const { profile, isLoaded: profileLoaded } = useProfile();
  const { foods, meals, saveMeal, deleteMeal, isLoaded: foodsLoaded } = useFoods();
  const { addRecord } = useHistory();
  const [bloodGlucose, setBloodGlucose] = useState<string>('');
  const [selectedFoods, setSelectedFoods] = useState<(Food & { weight: number })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addingFood, setAddingFood] = useState<Food | null>(null);
  const [weightInput, setWeightInput] = useState<string>('');
  const [mealNameInput, setMealNameInput] = useState('');
  const [isSavingMeal, setIsSavingMeal] = useState(false);

  // Load current selection from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('glicocalc_current_selection');
    if (saved) {
      try {
        const { foods: savedFoods, glucose } = JSON.parse(saved);
        setSelectedFoods(savedFoods);
        setBloodGlucose(glucose);
      } catch (e) {
        console.error('Failed to load current selection', e);
      }
    }
  }, []);

  // Persist current selection on change
  React.useEffect(() => {
    localStorage.setItem('glicocalc_current_selection', JSON.stringify({
      foods: selectedFoods,
      glucose: bloodGlucose
    }));
  }, [selectedFoods, bloodGlucose]);

  // Medical parameters from profile
  const { targetGlucose, sensitivityFactor, carbRatio } = profile;

  const filteredFoods = useMemo(() => {
    return foods.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, foods]);

  const totalCarbs = useMemo(() => {
    return selectedFoods.reduce((sum, item) => sum + (item.carbsPer100g * item.weight / 100), 0);
  }, [selectedFoods]);

  const correctionBolus = useMemo(() => {
    const bg = parseFloat(bloodGlucose);
    if (isNaN(bg) || bg <= targetGlucose) return 0;
    return (bg - targetGlucose) / sensitivityFactor;
  }, [bloodGlucose, targetGlucose, sensitivityFactor]);

  const foodBolus = useMemo(() => {
    return totalCarbs / carbRatio;
  }, [totalCarbs, carbRatio]);

  const totalBolus = correctionBolus + foodBolus;

  if (!profileLoaded || !foodsLoaded) return null;

  const handleAddFood = () => {
    if (!addingFood) return;
    const weight = parseFloat(weightInput) || addingFood.defaultWeight;
    
    setSelectedFoods(prev => {
      const existing = prev.find(item => item.id === addingFood.id);
      if (existing) {
        return prev.map(item => 
          item.id === addingFood.id ? { ...item, weight: item.weight + weight } : item
        );
      }
      return [...prev, { ...addingFood, weight }];
    });
    
    setAddingFood(null);
    setWeightInput('');
  };

  const removeFood = (id: string) => {
    setSelectedFoods(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveMeal = () => {
    if (!mealNameInput || selectedFoods.length === 0) return;
    const items = selectedFoods.map(f => ({
      foodId: f.id,
      weight: f.weight,
      name: f.name,
      carbsPer100g: f.carbsPer100g
    }));
    saveMeal(mealNameInput, items);
    setMealNameInput('');
    setIsSavingMeal(false);
  };

  const loadMeal = (meal: any) => {
    const foodsToLoad = meal.items.map((item: any) => ({
      id: item.foodId,
      name: item.name,
      carbsPer100g: item.carbsPer100g,
      weight: item.weight
    }));
    setSelectedFoods(foodsToLoad);
  };

  const clearAll = () => {
    setSelectedFoods([]);
    setBloodGlucose('');
  };

  const handleRegisterDose = () => {
    if (totalBolus <= 0) return;
    
    addRecord({
      glucose: parseFloat(bloodGlucose) || 0,
      carbs: totalCarbs,
      bolusCorrection: correctionBolus,
      bolusFood: foodBolus,
      totalBolus: totalBolus,
      mealName: mealNameInput || undefined
    });
    
    alert('Dose registrada com sucesso!');
    clearAll();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden p-4 lg:p-6 gap-6 relative">
        <AnimatePresence>
          {isSavingMeal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-bg-dark/80 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-neutral-green border border-primary/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-primary">Salvar Refeição</h3>
                  <button onClick={() => setIsSavingMeal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Nome da Refeição (ex: Café da Manhã)</label>
                    <input
                      type="text"
                      autoFocus
                      value={mealNameInput}
                      onChange={(e) => setMealNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveMeal()}
                      className="w-full bg-neutral-green/40 border-border-green rounded-lg py-3 px-4 text-white focus:ring-primary focus:border-primary"
                      placeholder="Minha Refeição"
                    />
                  </div>
                  
                  <button 
                    onClick={handleSaveMeal}
                    className="w-full bg-primary hover:bg-primary/90 text-bg-dark font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                  >
                    <Save className="w-5 h-5" />
                    SALVAR REFEIÇÃO
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {addingFood && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-bg-dark/80 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-neutral-green border border-primary/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-primary">{addingFood.name}</h3>
                  <button onClick={() => setAddingFood(null)} className="text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Quantidade em Gramas (g)</label>
                    <div className="relative">
                      <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input
                        type="number"
                        autoFocus
                        value={weightInput}
                        onChange={(e) => setWeightInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddFood()}
                        className="w-full bg-neutral-green/40 border-border-green rounded-lg py-4 pl-12 pr-4 text-2xl font-bold text-primary focus:ring-primary focus:border-primary"
                        placeholder={addingFood.defaultWeight.toString()}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2 italic">Sugestão: {addingFood.defaultPortion} ({addingFood.defaultWeight}g)</p>
                  </div>
                  
                  <button 
                    onClick={handleAddFood}
                    className="w-full bg-primary hover:bg-primary/90 text-bg-dark font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                  >
                    <Plus className="w-5 h-5" />
                    ADICIONAR AO CÁLCULO
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Side: Inputs & Food Search */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
          {/* Glicemia Section */}
          <section className="bg-neutral-green/20 border border-border-green/30 p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Droplets className="text-primary w-6 h-6" />
              <h3 className="text-lg font-semibold">1. Glicemia Atual</h3>
            </div>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-slate-400 mb-2">Valor da Glicemia (mg/dL)</label>
              <div className="relative">
                <input
                  type="number"
                  value={bloodGlucose}
                  onChange={(e) => setBloodGlucose(e.target.value)}
                  className="w-full bg-neutral-green/40 border-border-green rounded-lg py-4 px-5 text-2xl font-bold text-primary focus:ring-primary focus:border-primary placeholder:text-neutral-green/30"
                  placeholder="Ex: 110"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">mg/dL</div>
              </div>
            </div>
          </section>

          {/* Alimentos Section */}
          <section className="bg-neutral-green/20 border border-border-green/30 p-6 rounded-xl shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Utensils className="text-primary w-6 h-6" />
                <h3 className="text-lg font-semibold">2. Seleção de Alimentos</h3>
              </div>
              <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Banco de Dados Ativo
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-green/40 border-border-green rounded-lg py-3 pl-12 pr-12 focus:ring-primary focus:border-primary"
                placeholder="Pesquisar alimentos (pão, arroz, maçã...)"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFoods.map((food) => (
                <motion.div
                  key={food.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAddingFood(food)}
                  className="p-4 border border-border-green/20 rounded-lg hover:border-primary/50 cursor-pointer bg-neutral-green/10 transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="font-medium">{food.name}</p>
                    <p className="text-sm text-slate-400">{food.carbsPer100g}g carb / 100g</p>
                  </div>
                  <button className="bg-primary/20 text-primary rounded-full p-1 group-hover:bg-primary group-hover:text-background-dark transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Saved Meals Section */}
            <div className="mt-10">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Refeições Salvas
              </h4>
              {meals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meals.map((meal) => (
                    <div 
                      key={meal.id}
                      className="p-4 border border-border-green/20 rounded-lg bg-neutral-green/5 flex items-center justify-between group"
                    >
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => loadMeal(meal)}
                      >
                        <p className="font-bold text-primary">{meal.name}</p>
                        <p className="text-xs text-slate-500">{meal.items.length} itens • {meal.totalCarbs.toFixed(1)}g carb</p>
                      </div>
                      <button 
                        onClick={() => deleteMeal(meal.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-border-green/20 rounded-xl text-center">
                  <p className="text-sm text-slate-500 italic">
                    Você ainda não salvou nenhuma refeição. 
                    <br />
                    Monte uma lista de alimentos e clique em &quot;Salvar como Refeição&quot; no painel lateral.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Side: Calculation & Summary */}
        <aside className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto pr-2 no-scrollbar shrink-0">
          {/* Carrinho de Carboidratos */}
          <div className="bg-neutral-green/20 border border-border-green/30 rounded-xl overflow-hidden flex flex-col shrink-0 min-h-[300px] max-h-[500px]">
            <div className="bg-neutral-green/40 px-6 py-4 border-b border-border-green/30 flex justify-between items-center">
              <h4 className="font-bold flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary" />
                Composição da Refeição
              </h4>
              <button 
                onClick={clearAll}
                className="text-xs font-bold text-primary hover:underline"
              >
                LIMPAR TUDO
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {selectedFoods.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm italic py-8">
                    Nenhum alimento selecionado
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 px-2 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-border-green/10">
                      <div className="col-span-5">Alimento</div>
                      <div className="col-span-3 text-center">Peso</div>
                      <div className="col-span-4 text-right">CHO</div>
                    </div>
                    {selectedFoods.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-12 gap-2 items-center text-sm py-2 border-b border-border-green/5 group"
                      >
                        <div className="col-span-5 min-w-0">
                          <p className="font-medium break-words leading-tight">{item.name}</p>
                        </div>
                        <div className="col-span-3 text-center">
                          <p className="text-slate-400 text-xs whitespace-nowrap">{item.weight}g</p>
                        </div>
                        <div className="col-span-4 flex items-center justify-end gap-1.5">
                          <span className="font-bold text-primary whitespace-nowrap">{(item.carbsPer100g * item.weight / 100).toFixed(1)}g</span>
                          <button 
                            onClick={() => removeFood(item.id)}
                            className="text-red-400/50 hover:text-red-400 transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
            <div className="p-6 bg-primary/5 border-t border-border-green/30">
              <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs uppercase font-bold tracking-tighter">Total Geral</span>
                  <span className="text-slate-500 text-[10px]">Carboidratos (CHO)</span>
                </div>
                <span className="text-3xl font-black text-primary">{totalCarbs.toFixed(1)}g</span>
              </div>
              <button 
                disabled={selectedFoods.length === 0}
                onClick={() => setIsSavingMeal(true)}
                className="w-full py-2 border border-primary/30 rounded-lg text-xs font-bold text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-3 h-3" />
                SALVAR COMO REFEIÇÃO
              </button>
            </div>
          </div>

          {/* Painel de Resultado */}
          <div className="bg-gradient-to-br from-neutral-green to-bg-dark border border-primary/30 rounded-xl p-6 shadow-2xl flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="text-primary w-5 h-5" />
                <h4 className="font-bold text-lg uppercase tracking-widest text-primary/80">Resultado Final</h4>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">Bolo de Correção</p>
                    <p className="text-xs text-slate-500 italic">Meta: {targetGlucose} mg/dL | Fator: {sensitivityFactor}</p>
                  </div>
                  <p className="text-xl font-bold">{correctionBolus.toFixed(1)} <span className="text-xs font-normal text-slate-500">U</span></p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">Bolo Alimentar</p>
                    <p className="text-xs text-slate-500 italic">Relação: 1U / {carbRatio}g carb</p>
                  </div>
                  <p className="text-xl font-bold">{foodBolus.toFixed(1)} <span className="text-xs font-normal text-slate-500">U</span></p>
                </div>
                <div className="border-t border-primary/20 pt-6">
                  <p className="text-center text-xs uppercase text-slate-500 mb-2 font-bold tracking-widest">Total a Aplicar</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-5xl font-black text-primary">{totalBolus.toFixed(1)}</span>
                    <span className="text-xl font-bold text-primary self-end mb-2">Unidades</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={handleRegisterDose}
              disabled={totalBolus <= 0}
              className="w-full bg-primary hover:bg-primary/90 text-bg-dark font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 mt-6 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              REGISTRAR DOSE
            </button>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
