'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Food {
  id: string;
  name: string;
  carbsPer100g: number;
  defaultPortion: string;
  defaultWeight: number;
  category: string;
  isCustom?: boolean;
  color?: string;
}

const DEFAULT_FOODS: Food[] = [
  // Frutas
  { id: 'f1', name: 'Abacate (picado)', carbsPer100g: 6.7, defaultPortion: 'colher de sopa cheia', defaultWeight: 45, category: 'Frutas', color: 'text-green-500' },
  { id: 'f2', name: 'Abacaxi', carbsPer100g: 13.3, defaultPortion: 'fatia média', defaultWeight: 75, category: 'Frutas', color: 'text-yellow-400' },
  { id: 'f3', name: 'Acerola', carbsPer100g: 8.3, defaultPortion: 'unidade', defaultWeight: 12, category: 'Frutas', color: 'text-red-500' },
  { id: 'f4', name: 'Banana Nanica', carbsPer100g: 23.3, defaultPortion: 'unidade média', defaultWeight: 86, category: 'Frutas', color: 'text-yellow-500' },
  { id: 'f5', name: 'Banana Prata', carbsPer100g: 26, defaultPortion: 'unidade média', defaultWeight: 50, category: 'Frutas', color: 'text-yellow-400' },
  { id: 'f6', name: 'Maçã com casca', carbsPer100g: 15.5, defaultPortion: 'unidade pequena', defaultWeight: 90, category: 'Frutas', color: 'text-red-400' },
  { id: 'f7', name: 'Mamão Papaia', carbsPer100g: 10, defaultPortion: 'meia unidade', defaultWeight: 160, category: 'Frutas', color: 'text-orange-400' },
  { id: 'f8', name: 'Manga Espada', carbsPer100g: 15.7, defaultPortion: 'unidade média', defaultWeight: 140, category: 'Frutas', color: 'text-orange-500' },
  { id: 'f9', name: 'Melancia', carbsPer100g: 5.5, defaultPortion: 'fatia média', defaultWeight: 200, category: 'Frutas', color: 'text-red-500' },
  { id: 'f10', name: 'Morango', carbsPer100g: 8.3, defaultPortion: 'unidade média', defaultWeight: 12, category: 'Frutas', color: 'text-red-400' },

  // Grãos, Pães & Cereais
  { id: 'g1', name: 'Arroz Branco Cozido', carbsPer100g: 25, defaultPortion: 'colher de sopa cheia', defaultWeight: 20, category: 'Grãos & Pães', color: 'text-slate-200' },
  { id: 'g2', name: 'Arroz Integral Cozido', carbsPer100g: 25, defaultPortion: 'colher de sopa cheia', defaultWeight: 20, category: 'Grãos & Pães', color: 'text-amber-700' },
  { id: 'g3', name: 'Feijão Carioca (grão)', carbsPer100g: 17.6, defaultPortion: 'colher de sopa cheia', defaultWeight: 17, category: 'Grãos & Pães', color: 'text-amber-600' },
  { id: 'g4', name: 'Pão Francês', carbsPer100g: 56, defaultPortion: 'unidade', defaultWeight: 50, category: 'Grãos & Pães', color: 'text-yellow-600' },
  { id: 'g5', name: 'Pão de Forma', carbsPer100g: 48, defaultPortion: 'fatia', defaultWeight: 25, category: 'Grãos & Pães', color: 'text-yellow-500' },
  { id: 'g6', name: 'Macarrão Cozido', carbsPer100g: 22, defaultPortion: 'escumadeira cheia', defaultWeight: 110, category: 'Grãos & Pães', color: 'text-yellow-300' },
  { id: 'g7', name: 'Aipim Cozido', carbsPer100g: 29, defaultPortion: 'pedaço médio', defaultWeight: 100, category: 'Grãos & Pães', color: 'text-yellow-100' },
  { id: 'g8', name: 'Batata Inglesa Cozida', carbsPer100g: 20, defaultPortion: 'colher de sopa', defaultWeight: 30, category: 'Grãos & Pães', color: 'text-yellow-200' },
  { id: 'g9', name: 'Batata Doce Cozida', carbsPer100g: 23.8, defaultPortion: 'colher sopa cheia', defaultWeight: 42, category: 'Grãos & Pães', color: 'text-purple-400' },
  { id: 'g10', name: 'Aveia em Flocos', carbsPer100g: 66.7, defaultPortion: 'colher de sopa', defaultWeight: 15, category: 'Grãos & Pães', color: 'text-slate-300' },

  // Laticínios
  { id: 'l1', name: 'Leite Integral', carbsPer100g: 5, defaultPortion: 'copo duplo', defaultWeight: 240, category: 'Laticínios', color: 'text-blue-200' },
  { id: 'l2', name: 'Leite Desnatado', carbsPer100g: 5, defaultPortion: 'copo duplo', defaultWeight: 240, category: 'Laticínios', color: 'text-blue-100' },
  { id: 'l3', name: 'Iogurte Natural', carbsPer100g: 6, defaultPortion: 'copo', defaultWeight: 200, category: 'Laticínios', color: 'text-blue-300' },
  { id: 'l4', name: 'Queijo Minas Frescal', carbsPer100g: 0, defaultPortion: 'fatia média', defaultWeight: 30, category: 'Laticínios', color: 'text-slate-100' },

  // Vegetais & Legumes
  { id: 'v1', name: 'Abóbora Cabotian Cozida', carbsPer100g: 8.3, defaultPortion: 'colher de sopa', defaultWeight: 36, category: 'Vegetais', color: 'text-orange-600' },
  { id: 'v2', name: 'Abobrinha Cozida', carbsPer100g: 0, defaultPortion: 'colher de sopa', defaultWeight: 20, category: 'Vegetais', color: 'text-green-600' },
  { id: 'v3', name: 'Alface (todas)', carbsPer100g: 0, defaultPortion: 'folha média', defaultWeight: 10, category: 'Vegetais', color: 'text-green-400' },
  { id: 'v4', name: 'Brócolis Cozido', carbsPer100g: 0, defaultPortion: 'colher de sopa cheia', defaultWeight: 10, category: 'Vegetais', color: 'text-green-700' },
  { id: 'v5', name: 'Cenoura Cozida', carbsPer100g: 8, defaultPortion: 'colher de sopa', defaultWeight: 25, category: 'Vegetais', color: 'text-orange-500' },
  { id: 'v6', name: 'Tomate', carbsPer100g: 3, defaultPortion: 'fatia média', defaultWeight: 30, category: 'Vegetais', color: 'text-red-600' },

  // Carnes & Proteínas
  { id: 'p1', name: 'Carne Bovina (Acém)', carbsPer100g: 0, defaultPortion: 'pedaço médio', defaultWeight: 100, category: 'Carnes & Proteínas', color: 'text-red-800' },
  { id: 'p2', name: 'Frango (Peito Grelhado)', carbsPer100g: 0, defaultPortion: 'filé médio', defaultWeight: 100, category: 'Carnes & Proteínas', color: 'text-orange-200' },
  { id: 'p3', name: 'Ovo de Galinha', carbsPer100g: 0, defaultPortion: 'unidade', defaultWeight: 45, category: 'Carnes & Proteínas', color: 'text-yellow-100' },
  { id: 'p4', name: 'Peixe Grelhado', carbsPer100g: 0, defaultPortion: 'posta ou filé', defaultWeight: 100, category: 'Carnes & Proteínas', color: 'text-blue-300' },

  // Doces & Lanches
  { id: 'd1', name: 'Açúcar Branco', carbsPer100g: 100, defaultPortion: 'colher de sopa rasa', defaultWeight: 15, category: 'Doces & Lanches', color: 'text-slate-100' },
  { id: 'd2', name: 'Achocolatado em Pó', carbsPer100g: 88, defaultPortion: 'colher de sopa', defaultWeight: 10, category: 'Doces & Lanches', color: 'text-amber-900' },
  { id: 'd3', name: 'Biscoito Água e Sal', carbsPer100g: 62.5, defaultPortion: 'unidade', defaultWeight: 8, category: 'Doces & Lanches', color: 'text-yellow-200' },
  { id: 'd4', name: 'Chocolate ao Leite', carbsPer100g: 60, defaultPortion: 'barra pequena', defaultWeight: 30, category: 'Doces & Lanches', color: 'text-amber-800' },
  { id: 'd5', name: 'Gelatina com Açúcar', carbsPer100g: 85.7, defaultPortion: 'colher de sopa', defaultWeight: 14, category: 'Doces & Lanches', color: 'text-pink-400' },
  { id: 'd6', name: 'Batata Frita', carbsPer100g: 35.7, defaultPortion: 'porção média', defaultWeight: 95, category: 'Doces & Lanches', color: 'text-yellow-500' },
  { id: 'd7', name: 'Pão de Queijo', carbsPer100g: 45, defaultPortion: 'unidade pequena', defaultWeight: 20, category: 'Doces & Lanches', color: 'text-yellow-600' },
  { id: 'd8', name: 'Pizza de Mussarela', carbsPer100g: 22, defaultPortion: 'fatia média', defaultWeight: 100, category: 'Doces & Lanches', color: 'text-orange-400' },
  { id: 'd9', name: 'Sorvete de Massa', carbsPer100g: 25, defaultPortion: 'bola média', defaultWeight: 80, category: 'Doces & Lanches', color: 'text-blue-300' },
];

export interface Meal {
  id: string;
  name: string;
  items: { foodId: string; weight: number; name: string; carbsPer100g: number }[];
  totalCarbs: number;
}

interface FoodContextType {
  foods: Food[];
  meals: Meal[];
  addFood: (food: Omit<Food, 'id' | 'isCustom'>) => void;
  deleteFood: (id: string) => void;
  saveMeal: (name: string, items: { foodId: string; weight: number; name: string; carbsPer100g: number }[]) => void;
  deleteMeal: (id: string) => void;
  isLoaded: boolean;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export function FoodProvider({ children }: { children: React.ReactNode }) {
  const [customFoods, setCustomFoods] = useState<Food[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const savedFoods = localStorage.getItem('glicocalc_custom_foods');
      const savedMeals = localStorage.getItem('glicocalc_saved_meals');
      
      if (savedFoods) {
        try {
          setCustomFoods(JSON.parse(savedFoods));
        } catch (e) {
          console.error('Failed to parse custom foods', e);
        }
      }

      if (savedMeals) {
        try {
          setMeals(JSON.parse(savedMeals));
        } catch (e) {
          console.error('Failed to parse saved meals', e);
        }
      }
      setIsLoaded(true);
    };

    const timer = setTimeout(loadData, 0);
    return () => clearTimeout(timer);
  }, []);

  const addFood = (food: Omit<Food, 'id' | 'isCustom'>) => {
    const newFood: Food = {
      ...food,
      id: Math.random().toString(36).substr(2, 9),
      isCustom: true,
    };
    const updated = [...customFoods, newFood];
    setCustomFoods(updated);
    localStorage.setItem('glicocalc_custom_foods', JSON.stringify(updated));
  };

  const deleteFood = (id: string) => {
    const updated = customFoods.filter(f => f.id !== id);
    setCustomFoods(updated);
    localStorage.setItem('glicocalc_custom_foods', JSON.stringify(updated));
  };

  const saveMeal = (name: string, items: { foodId: string; weight: number; name: string; carbsPer100g: number }[]) => {
    const totalCarbs = items.reduce((sum, item) => sum + (item.carbsPer100g * item.weight / 100), 0);
    const newMeal: Meal = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      items,
      totalCarbs
    };
    const updated = [...meals, newMeal];
    setMeals(updated);
    localStorage.setItem('glicocalc_saved_meals', JSON.stringify(updated));
  };

  const deleteMeal = (id: string) => {
    const updated = meals.filter(m => m.id !== id);
    setMeals(updated);
    localStorage.setItem('glicocalc_saved_meals', JSON.stringify(updated));
  };

  const allFoods = [...DEFAULT_FOODS, ...customFoods];

  return (
    <FoodContext.Provider value={{ foods: allFoods, meals, addFood, deleteFood, saveMeal, deleteMeal, isLoaded }}>
      {children}
    </FoodContext.Provider>
  );
}

export function useFoods() {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error('useFoods must be used within a FoodProvider');
  }
  return context;
}
