'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useFoods } from '@/hooks/use-foods';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Apple, 
  Wheat, 
  Droplet, 
  Coffee, 
  Leaf, 
  Beef, 
  Pizza,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ArrowRight,
  Utensils,
  X,
  Trash2
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Todos', icon: 'list' },
  { name: 'Frutas', icon: Apple },
  { name: 'Grãos & Pães', icon: Wheat },
  { name: 'Laticínios', icon: Droplet },
  { name: 'Vegetais', icon: Leaf },
  { name: 'Proteínas', icon: Beef },
  { name: 'Lanches & Fast Food', icon: Pizza },
];

export default function FoodDatabasePage() {
  const { foods, addFood, deleteFood, isLoaded } = useFoods();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [newName, setNewName] = useState('');
  const [newCarbs, setNewCarbs] = useState('');
  const [newPortion, setNewPortion] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newCategory, setNewCategory] = useState('Grãos & Pães');

  const filteredFoods = foods.filter(food => {
    const matchesCategory = activeCategory === 'Todos' || food.category === activeCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCarbs || !newWeight) return;

    addFood({
      name: newName,
      carbsPer100g: parseFloat(newCarbs),
      defaultPortion: newPortion || '100g',
      defaultWeight: parseFloat(newWeight),
      category: newCategory,
      color: 'text-primary'
    });

    // Reset form
    setNewName('');
    setNewCarbs('');
    setNewPortion('');
    setNewWeight('');
    setIsModalOpen(false);
  };

  if (!isLoaded) return null;

  return (
    <DashboardLayout>
      <main className="flex flex-col max-w-[1200px] mx-auto w-full px-6 py-8 overflow-y-auto relative">
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-bg-dark/80 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-neutral-green border border-primary/30 p-8 rounded-2xl shadow-2xl max-w-md w-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-primary">Novo Alimento</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddFood} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Nome do Alimento</label>
                    <input
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-neutral-green/40 border border-border-green/30 rounded-lg py-3 px-4 focus:ring-primary focus:border-primary text-white"
                      placeholder="Ex: Pão Integral Caseiro"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Carbs / 100g</label>
                      <input
                        required
                        type="number"
                        step="0.1"
                        value={newCarbs}
                        onChange={(e) => setNewCarbs(e.target.value)}
                        className="w-full bg-neutral-green/40 border border-border-green/30 rounded-lg py-3 px-4 focus:ring-primary focus:border-primary text-white"
                        placeholder="Ex: 45"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Peso Padrão (g)</label>
                      <input
                        required
                        type="number"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                        className="w-full bg-neutral-green/40 border border-border-green/30 rounded-lg py-3 px-4 focus:ring-primary focus:border-primary text-white"
                        placeholder="Ex: 50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Categoria</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-neutral-green/40 border border-border-green/30 rounded-lg py-3 px-4 focus:ring-primary focus:border-primary appearance-none text-white"
                    >
                      {CATEGORIES.filter(c => c.name !== 'Todos').map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Descrição da Porção (Opcional)</label>
                    <input
                      value={newPortion}
                      onChange={(e) => setNewPortion(e.target.value)}
                      className="w-full bg-neutral-green/40 border border-border-green/30 rounded-lg py-3 px-4 focus:ring-primary focus:border-primary text-white"
                      placeholder="Ex: 1 fatia média"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-bg-dark font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 mt-4"
                  >
                    <Plus className="w-5 h-5" />
                    CADASTRAR ALIMENTO
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black leading-tight tracking-tight">Banco de Dados de Alimentos</h1>
            <p className="text-slate-400 text-lg max-w-xl">Consulte a contagem de carboidratos para calcular sua dose de insulina com precisão.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-bg-dark rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/10"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar Novo Alimento</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-green/20 border border-border-green/30 rounded-xl py-4 pl-12 pr-12 focus:ring-primary focus:border-primary text-white"
              placeholder="Pesquisar no banco de dados..."
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

          <div className="flex gap-3 pb-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center justify-center gap-2 rounded-full px-6 py-2 text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.name
                    ? 'bg-primary text-bg-dark'
                    : 'bg-neutral-green/20 text-slate-400 hover:bg-neutral-green/40'
                }`}
              >
                {typeof cat.icon === 'string' ? null : <cat.icon className="w-4 h-4" />}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table Container */}
        <div className="w-full">
          <div className="overflow-hidden rounded-xl border border-border-green/30 bg-neutral-green/10 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-neutral-green/30">
                  <th className="px-6 py-4 text-left text-slate-400 text-xs font-bold uppercase tracking-wider w-1/2">Nome do Alimento</th>
                  <th className="px-6 py-4 text-left text-slate-400 text-xs font-bold uppercase tracking-wider">Porção Padrão</th>
                  <th className="px-6 py-4 text-right text-slate-400 text-xs font-bold uppercase tracking-wider">Carbs / 100g</th>
                  <th className="px-6 py-4 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-green/10">
                {filteredFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-neutral-green/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-lg bg-neutral-green/40 flex items-center justify-center shrink-0 ${food.color || 'text-primary'}`}>
                          <Utensils className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium break-words">{food.name}</span>
                          {food.isCustom && (
                            <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded font-bold uppercase w-fit mt-0.5">Personalizado</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-400 text-sm">{food.defaultPortion} ({food.defaultWeight}g)</td>
                    <td className="px-6 py-5 text-right">
                      <span className="inline-flex items-center justify-center bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg min-w-[60px] whitespace-nowrap">
                        {food.carbsPer100g}g
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      {food.isCustom ? (
                        <button 
                          onClick={() => deleteFood(food.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs italic">Sistema</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredFoods.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500 italic">
                      Nenhum alimento encontrado para &quot;{searchQuery}&quot;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-slate-400">Mostrando {filteredFoods.length} alimentos</p>
            <div className="flex items-center gap-1">
              <button className="size-10 flex items-center justify-center rounded-lg hover:bg-neutral-green/20 text-slate-500">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="size-10 flex items-center justify-center rounded-lg bg-primary text-bg-dark font-bold shadow-md shadow-primary/20">1</button>
              <button className="size-10 flex items-center justify-center rounded-lg hover:bg-neutral-green/20 text-slate-400">2</button>
              <button className="size-10 flex items-center justify-center rounded-lg hover:bg-neutral-green/20 text-slate-400">3</button>
              <span className="px-2 text-slate-600">...</span>
              <button className="size-10 flex items-center justify-center rounded-lg hover:bg-neutral-green/20 text-slate-400">42</button>
              <button className="size-10 flex items-center justify-center rounded-lg hover:bg-neutral-green/20 text-slate-500">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Custom Info Card */}
        <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center gap-6">
          <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Lightbulb className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">Dica Prática</h3>
            <p className="text-slate-400 leading-relaxed">
              Você pode adicionar alimentos personalizados que não constam na nossa lista. A contagem correta é essencial para um ajuste preciso da insulina bolus. Lembre-se de descontar as fibras para o cálculo de carboidratos líquidos se indicado pelo seu médico.
            </p>
          </div>
          <button className="px-6 py-2 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-bg-dark transition-all whitespace-nowrap flex items-center gap-2">
            Entender o Cálculo
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </DashboardLayout>
  );
}
