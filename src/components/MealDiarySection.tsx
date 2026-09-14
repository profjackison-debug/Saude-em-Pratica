import React, { useState } from 'react';
import {
  Apple,
  Search,
  Scale,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Info,
  Trash2,
  Check,
  Utensils,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FoodItem, MealSlot, MealTimeId } from '../types';
import { BRAZILIAN_FOODS } from '../data/tacoData';
import { playClickSound, playFanfare } from '../utils/audio';
import { MealTipCard } from './MealTipCard';

interface MealDiarySectionProps {
  mealSlots: Record<MealTimeId, MealSlot>;
  activeMealId: MealTimeId;
  onSelectMealTime: (mealId: MealTimeId) => void;
  onAddFoodToMeal: (food: FoodItem) => void;
  onRemoveFoodFromMeal: (foodId: string) => void;
  onAdjustPortion: (foodId: string, delta: number) => void;
  onResetMeal: () => void;
  onOpenProportionChallenge: () => void;
  onLoadMealTemplate?: (mealId: MealTimeId, templateFoods: { foodId: string; portions: number }[]) => void;
  isFocusedView?: boolean;
  onCloseFocus?: () => void;
  onNavigateToWeight?: () => void;
}

type FoodFilterTab =
  | 'suggested'
  | 'all'
  | 'juices'
  | 'cereal'
  | 'meat'
  | 'dairy'
  | 'fruit'
  | 'vegetable'
  | 'beverage'
  | 'tuber';

export const MealDiarySection: React.FC<MealDiarySectionProps> = ({
  mealSlots,
  activeMealId,
  onSelectMealTime,
  onAddFoodToMeal,
  onRemoveFoodFromMeal,
  onAdjustPortion,
  onResetMeal,
  onOpenProportionChallenge,
  onLoadMealTemplate,
  isFocusedView = false,
  onCloseFocus,
  onNavigateToWeight,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FoodFilterTab>('suggested');
  const [selectedFoodInfo, setSelectedFoodInfo] = useState<FoodItem | null>(null);

  const currentSlot = mealSlots[activeMealId];

  // Meal names and descriptions
  const mealTitles: Record<MealTimeId, { name: string; subtitle: string; icon: string }> = {
    breakfast: {
      name: 'Café da Manhã',
      subtitle: 'Desjejum: energia para acordar o corpo e mente',
      icon: '☀️',
    },
    lunch: {
      name: 'Almoço',
      subtitle: 'Refeição principal: prato colorido, arroz, feijão e salada',
      icon: '🍽️',
    },
    snack: {
      name: 'Lanche da Tarde',
      subtitle: 'Pausa vespertina: frutas, milho, leite e saciedade',
      icon: '🥪',
    },
    dinner: {
      name: 'Jantar',
      subtitle: 'Ceia ou refeição noturna: sopas, comida caseira ou cuscuz',
      icon: '🌙',
    },
  };

  // Calculate day-wide consumption across all 4 meals
  const allMealKeys: MealTimeId[] = ['breakfast', 'lunch', 'snack', 'dinner'];
  const dailyStats = allMealKeys.reduce(
    (acc, key) => {
      const slot = mealSlots[key];
      const hasItems = slot.items.length > 0;
      const weight = slot.items.reduce(
        (sum, item) => sum + item.food.servingSizeGrams * item.portions,
        0
      );
      const kcal = slot.items.reduce(
        (sum, item) =>
          sum + (item.food.per100g.energyKcal * (item.food.servingSizeGrams * item.portions)) / 100,
        0
      );
      return {
        totalGrams: acc.totalGrams + weight,
        totalKcal: acc.totalKcal + Math.round(kcal),
        completedCount: acc.completedCount + (hasItems ? 1 : 0),
        details: {
          ...acc.details,
          [key]: { hasItems, weight, kcal: Math.round(kcal), count: slot.items.length },
        },
      };
    },
    {
      totalGrams: 0,
      totalKcal: 0,
      completedCount: 0,
      details: {} as Record<MealTimeId, { hasItems: boolean; weight: number; kcal: number; count: number }>,
    }
  );

  const allFourMealsCompleted = dailyStats.completedCount === 4;

  // Calculate totals for active meal
  const mealTotalGrams = currentSlot.items.reduce(
    (sum, item) => sum + item.food.servingSizeGrams * item.portions,
    0
  );

  const totalKcal = Math.round(
    currentSlot.items.reduce(
      (sum, item) => sum + (item.food.per100g.energyKcal * (item.food.servingSizeGrams * item.portions)) / 100,
      0
    )
  );

  const totalCarbs = currentSlot.items.reduce(
    (sum, item) => sum + (item.food.per100g.carbsG * (item.food.servingSizeGrams * item.portions)) / 100,
    0
  );

  const totalProtein = currentSlot.items.reduce(
    (sum, item) => sum + (item.food.per100g.proteinG * (item.food.servingSizeGrams * item.portions)) / 100,
    0
  );

  const totalFat = currentSlot.items.reduce(
    (sum, item) => sum + (item.food.per100g.fatG * (item.food.servingSizeGrams * item.portions)) / 100,
    0
  );

  const totalFiber = currentSlot.items.reduce(
    (sum, item) => sum + (item.food.per100g.fiberG * (item.food.servingSizeGrams * item.portions)) / 100,
    0
  );

  // Proportions for SVG donut
  const macroSum = totalCarbs + totalProtein + totalFat + totalFiber || 1;
  const carbPct = Math.round((totalCarbs / macroSum) * 100);
  const proteinPct = Math.round((totalProtein / macroSum) * 100);
  const fatPct = Math.round((totalFat / macroSum) * 100);
  const fiberPct = Math.max(0, 100 - carbPct - proteinPct - fatPct);

  // Filter foods
  const filteredFoods = BRAZILIAN_FOODS.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'suggested') {
      return food.meals ? food.meals.includes(activeMealId) : true;
    }
    if (activeFilter === 'all') return true;
    if (activeFilter === 'juices') {
      return food.id.startsWith('suco_') || food.id === 'agua_coco';
    }
    if (activeFilter === 'cereal') return food.category === 'cereal' || food.category === 'bread';
    if (activeFilter === 'meat') return food.category === 'meat' || food.category === 'legume';
    if (activeFilter === 'dairy') return food.category === 'dairy';
    if (activeFilter === 'fruit') return food.category === 'fruit' || food.id.startsWith('suco_');
    if (activeFilter === 'vegetable') return food.category === 'vegetable';
    if (activeFilter === 'beverage') return food.category === 'beverage' || food.id.startsWith('suco_') || food.id === 'agua_coco';
    if (activeFilter === 'tuber') return food.category === 'tuber';
    return true;
  });

  // Calculate SVG donut segments
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeCarb = (carbPct / 100) * circumference;
  const strokeProt = (proteinPct / 100) * circumference;
  const strokeFat = (fatPct / 100) * circumference;
  const strokeFiber = (fiberPct / 100) * circumference;

  const offsetCarb = 0;
  const offsetProt = -strokeCarb;
  const offsetFat = -(strokeCarb + strokeProt);
  const offsetFiber = -(strokeCarb + strokeProt + strokeFat);

  // Quick combinations for current meal
  const mealSuggestions: Record<MealTimeId, { title: string; items: { foodId: string; portions: number }[] }[]> = {
    breakfast: [
      {
        title: '🥖 Pão na Chapa & Pingado (Clássico)',
        items: [
          { foodId: 'pao', portions: 1 },
          { foodId: 'manteiga', portions: 1 },
          { foodId: 'cafe_pingado', portions: 1 },
          { foodId: 'mamao', portions: 1 },
        ],
      },
      {
        title: '🌽 Cuscuz com Ovo & Café (Nordestino)',
        items: [
          { foodId: 'cuscuz', portions: 1 },
          { foodId: 'ovo_mexido', portions: 1 },
          { foodId: 'manteiga', portions: 1 },
          { foodId: 'cafe_preto', portions: 1 },
        ],
      },
      {
        title: '🫓 Tapioca com Queijo & Suco de Caju',
        items: [
          { foodId: 'tapioca', portions: 1 },
          { foodId: 'queijo', portions: 1 },
          { foodId: 'suco_caju', portions: 1 },
        ],
      },
      {
        title: '🥣 Mingau com Fruta (Nutritivo)',
        items: [
          { foodId: 'mingau_aveia', portions: 1 },
          { foodId: 'banana', portions: 1 },
          { foodId: 'queijo', portions: 1 },
        ],
      },
    ],
    lunch: [
      {
        title: '🍗 PF Tradicional (Arroz, Feijão & Frango)',
        items: [
          { foodId: 'arroz', portions: 1 },
          { foodId: 'feijao', portions: 1 },
          { foodId: 'frango', portions: 1 },
          { foodId: 'verduras', portions: 1 },
          { foodId: 'suco_laranja', portions: 1 },
        ],
      },
      {
        title: '🍍 Peixe com Salada & Suco de Abacaxi',
        items: [
          { foodId: 'arroz', portions: 1 },
          { foodId: 'feijao', portions: 1 },
          { foodId: 'peixe', portions: 1 },
          { foodId: 'verduras', portions: 1 },
          { foodId: 'suco_abacaxi_hortela', portions: 1 },
        ],
      },
      {
        title: '🍳 Almoço Popular com Ovo Frito & Farofa',
        items: [
          { foodId: 'arroz', portions: 1 },
          { foodId: 'feijao', portions: 1 },
          { foodId: 'ovo', portions: 1 },
          { foodId: 'farofa', portions: 1 },
          { foodId: 'suco_limao', portions: 1 },
        ],
      },
      {
        title: '🥩 Carne Moída com Mandioca & Suco de Maracujá',
        items: [
          { foodId: 'arroz', portions: 1 },
          { foodId: 'feijao', portions: 1 },
          { foodId: 'carne_bovina', portions: 1 },
          { foodId: 'mandioca', portions: 1 },
          { foodId: 'suco_maracuja', portions: 1 },
        ],
      },
    ],
    snack: [
      {
        title: '🥤 Suco de Goiaba & Pão de Queijo',
        items: [
          { foodId: 'pao_queijo', portions: 1 },
          { foodId: 'suco_goiaba', portions: 1 },
        ],
      },
      {
        title: '🥭 Suco de Manga Fresca & Biscoito Polvilho',
        items: [
          { foodId: 'suco_manga', portions: 1 },
          { foodId: 'biscoito_polvilho', portions: 1 },
        ],
      },
      {
        title: '🥥 Água de Coco & Salada de Frutas',
        items: [
          { foodId: 'agua_coco', portions: 1 },
          { foodId: 'maca', portions: 1 },
          { foodId: 'banana', portions: 1 },
        ],
      },
      {
        title: '🍿 Pipoca de Panela & Suco de Uva Integral',
        items: [
          { foodId: 'pipoca', portions: 1 },
          { foodId: 'suco_uva_integral', portions: 1 },
        ],
      },
    ],
    dinner: [
      {
        title: '🍲 Sopa Caseira de Legumes & Suco de Maracujá',
        items: [
          { foodId: 'sopa_legumes', portions: 1 },
          { foodId: 'pao', portions: 1 },
          { foodId: 'suco_maracuja', portions: 1 },
        ],
      },
      {
        title: '🥣 Canja de Galinha & Limonada Fresca',
        items: [
          { foodId: 'canja', portions: 1 },
          { foodId: 'pao', portions: 1 },
          { foodId: 'suco_limao', portions: 1 },
        ],
      },
      {
        title: '🍳 Omelete Rápido com Pão & Suco de Caju',
        items: [
          { foodId: 'omelete', portions: 1 },
          { foodId: 'pao', portions: 1 },
          { foodId: 'verduras', portions: 1 },
          { foodId: 'suco_caju', portions: 1 },
        ],
      },
    ],
  };

  const handleApplySuggestion = (templateItems: { foodId: string; portions: number }[]) => {
    playClickSound();
    if (onLoadMealTemplate) {
      onLoadMealTemplate(activeMealId, templateItems);
    } else {
      onResetMeal();
      templateItems.forEach((it) => {
        const found = BRAZILIAN_FOODS.find((f) => f.id === it.foodId);
        if (found) {
          for (let i = 0; i < it.portions; i++) {
            onAddFoodToMeal(found);
          }
        }
      });
    }
  };

  return (
    <section className="bg-white/95 dark:bg-[#0f1b33]/95 rounded-3xl p-4 sm:p-5 border-2 border-teal-300 dark:border-blue-800 shadow-xl shadow-teal-900/10 dark:shadow-black/50 flex flex-col justify-between h-full relative overflow-hidden transition-colors">
      {/* Top Header Row with Pinned Yellow Sticky Note */}
      <div className="flex items-start justify-between gap-2 mb-3">
        {/* Title and Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-800 dark:bg-blue-600 text-white flex items-center justify-center shadow-md shadow-teal-900/20 border-2 border-white dark:border-blue-500">
            <Apple className="w-6 h-6 fill-white text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-none">
              1. Refeições Diárias
            </h2>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
              Monte suas refeições e explore os nutrientes reais da mesa brasileira!
            </p>
          </div>
        </div>

        {/* Actions / Sticky Note */}
        <div className="flex items-center gap-2">
          {isFocusedView && onCloseFocus && (
            <button
              onClick={onCloseFocus}
              className="text-xs font-bold text-teal-800 dark:text-blue-200 bg-teal-50 dark:bg-blue-950/60 hover:bg-teal-100 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-blue-800 transition cursor-pointer"
            >
              ← Visão Geral
            </button>
          )}

          {/* Pinned Yellow Sticky Note: "Explore porções e proporções!" */}
          <div
            onClick={() => {
              playClickSound();
              onOpenProportionChallenge();
            }}
            className="relative bg-[#fef08a] hover:bg-[#fde047] dark:bg-amber-400 dark:hover:bg-amber-300 text-amber-950 p-2 sm:px-3 sm:py-2 rounded-xl shadow-md rotate-2 hover:rotate-0 transition-transform cursor-pointer border border-amber-300 dark:border-amber-500 group"
            title="Toque para abrir os desafios de proporção"
          >
            {/* Pushpin at top */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-red-500 border border-red-700 shadow-xs flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white/70" />
            </div>
            <p className="text-[11px] sm:text-xs font-black font-display tracking-tight text-center leading-tight mt-0.5">
              Explore porções &
              <br />
              proporções!
            </p>
          </div>
        </div>
      </div>

      {/* 4 Meal Tabs: Café da Manhã, Almoço, Lanche da Tarde, Jantar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {[
          { id: 'breakfast', label: 'Café da Manhã', icon: '☀️' },
          { id: 'lunch', label: 'Almoço', icon: '🍽️' },
          { id: 'snack', label: 'Lanche da Tarde', icon: '🥪' },
          { id: 'dinner', label: 'Jantar', icon: '🌙' },
        ].map((tab) => {
          const isSelected = activeMealId === tab.id;
          const status = dailyStats.details[tab.id as MealTimeId];
          const hasFood = status?.hasItems;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound();
                onSelectMealTime(tab.id as MealTimeId);
              }}
              className={`py-2 px-2.5 sm:px-3 rounded-2xl text-xs sm:text-sm font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-teal-700 dark:bg-blue-600 text-white shadow-md shadow-teal-700/30 scale-[1.02] border-2 border-teal-800 dark:border-blue-500'
                  : 'bg-white dark:bg-[#152547] hover:bg-slate-50 dark:hover:bg-[#1d325e] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-blue-900/80'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
              </div>
              {hasFood ? (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full leading-tight shrink-0 ${
                    isSelected
                      ? 'bg-teal-900/50 text-teal-100 border border-teal-400/40'
                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  }`}
                >
                  ✓ {status.kcal} kcal
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  (vazio)
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Meal Combinations Bar for Inspiration */}
      <div className="mb-3 bg-teal-50/70 dark:bg-[#0b162b]/80 border border-teal-200 dark:border-blue-900/90 rounded-2xl px-3 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-teal-950 dark:text-blue-200">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Sugestões da mesa brasileira para {mealTitles[activeMealId].name}:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {mealSuggestions[activeMealId]?.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleApplySuggestion(sug.items)}
              className="px-2.5 py-1 bg-white dark:bg-[#16274a] hover:bg-teal-600 hover:text-white dark:hover:bg-blue-600 border border-teal-300 dark:border-blue-700 text-teal-900 dark:text-blue-100 rounded-xl text-[11px] font-bold shadow-xs transition cursor-pointer"
              title="Carregar esta combinação no prato"
            >
              {sug.title}
            </button>
          ))}
        </div>
      </div>

      {/* Dica Nutricional do Dia Dinâmica para o Prato do Aluno */}
      <MealTipCard
        mealId={activeMealId}
        mealName={mealTitles[activeMealId].name}
        items={currentSlot.items}
      />

      {/* Main 3-Column Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch flex-1">
        {/* Left Subpanel: "Alimentos" & Categories */}
        <div className="md:col-span-4 bg-slate-50/90 dark:bg-[#0b162b]/90 rounded-2xl p-3 border border-slate-200 dark:border-blue-900/80 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black text-slate-900 dark:text-blue-100 uppercase tracking-wide flex items-center gap-1">
                <span>Alimentos Brasileiros</span>
                <span className="text-[10px] font-bold text-teal-700 dark:text-blue-300 bg-teal-100 dark:bg-blue-950/80 px-1.5 py-0.5 rounded-full border border-teal-200 dark:border-blue-800">
                  {filteredFoods.length}
                </span>
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar (suco, caju, maracujá, arroz, feijão...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white dark:bg-[#132240] border border-slate-200 dark:border-blue-800/80 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:border-blue-500 font-medium shadow-xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Filter Tabs / Categories */}
            <div className="grid grid-cols-2 gap-1 mb-2">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveFilter('suggested');
                }}
                className={`px-2 py-1 rounded-xl text-[10.5px] font-extrabold flex items-center justify-center gap-1 transition cursor-pointer ${
                  activeFilter === 'suggested'
                    ? 'bg-teal-700 dark:bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#132240] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-blue-900/80 hover:bg-slate-100 dark:hover:bg-[#1b2f56]'
                }`}
              >
                <span>🌟</span>
                <span>Típicos desta refeição</span>
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setActiveFilter('all');
                }}
                className={`px-2 py-1 rounded-xl text-[10.5px] font-extrabold flex items-center justify-center gap-1 transition cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-teal-700 dark:bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#132240] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-blue-900/80 hover:bg-slate-100 dark:hover:bg-[#1b2f56]'
                }`}
              >
                <span>🌐</span>
                <span>Todos os alimentos</span>
              </button>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-2 scrollbar-thin">
              {[
                { id: 'juices', label: 'Sucos Naturais', icon: '🍹', highlight: true },
                { id: 'beverage', label: 'Bebidas & Cafés', icon: '☕' },
                { id: 'fruit', label: 'Frutas', icon: '🍎' },
                { id: 'cereal', label: 'Pães & Cereais', icon: '🥖' },
                { id: 'meat', label: 'Carnes & Ovos', icon: '🥩' },
                { id: 'dairy', label: 'Laticínios', icon: '🥛' },
                { id: 'vegetable', label: 'Verduras', icon: '🥬' },
                { id: 'tuber', label: 'Raízes/Tubérculos', icon: '🥔' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    playClickSound();
                    setActiveFilter(cat.id as FoodFilterTab);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                    activeFilter === cat.id
                      ? cat.id === 'juices'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                        : 'bg-slate-800 dark:bg-blue-600 text-white'
                      : cat.id === 'juices'
                        ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 font-extrabold'
                        : 'bg-white dark:bg-[#132240] border border-slate-200 dark:border-blue-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1b2f56]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Food Items Catalog */}
          <div className="mt-1 flex-1 max-h-[310px] overflow-y-auto space-y-1.5 pr-1">
            {filteredFoods.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#132240] rounded-xl border border-dashed border-slate-200 dark:border-blue-900">
                Nenhum alimento encontrado para esta busca.
              </div>
            ) : (
              filteredFoods.map((food) => {
                const itemInPlate = currentSlot.items.find((it) => it.food.id === food.id);
                return (
                  <div
                    key={food.id}
                    className="p-2 bg-white dark:bg-[#132240] hover:bg-teal-50/70 dark:hover:bg-[#1b2f56] border border-slate-200 dark:border-blue-900/80 hover:border-teal-300 dark:hover:border-blue-500 rounded-xl transition flex items-center justify-between gap-2 shadow-xs group"
                  >
                    <div
                      onClick={() => {
                        playClickSound();
                        setSelectedFoodInfo(food);
                      }}
                      className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                      title="Clique para ver informações nutricionais e contexto"
                    >
                      <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                        {food.iconEmoji}
                      </span>
                      <div className="flex flex-col leading-tight truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900 dark:text-slate-100 truncate group-hover:text-teal-800 dark:group-hover:text-blue-300">
                            {food.name}
                          </span>
                          {itemInPlate && (
                            <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                              {itemInPlate.portions}x
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          <span>{food.servingLabel}</span>
                          <span>•</span>
                          <span className="font-mono text-teal-700 dark:text-blue-300 font-bold">
                            {food.per100g.energyKcal} kcal/100g
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={() => {
                        playClickSound();
                        onAddFoodToMeal(food);
                      }}
                      className="w-7 h-7 rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-95 text-white flex items-center justify-center shadow-xs cursor-pointer shrink-0 transition"
                      title={`Adicionar ${food.name} ao prato`}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-blue-900/60 text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
              Toque no alimento para ver contexto e nutrientes
            </span>
          </div>
        </div>

        {/* Center: Warm Wooden Kitchen Table Area with Plate & Scale */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#fbf3e6] via-[#f5e6cf] to-[#e8cca8] dark:from-[#0d1b34] dark:via-[#0a1529] dark:to-[#070e1d] rounded-2xl p-3 border-2 border-[#d4b08c] dark:border-blue-900/80 flex flex-col justify-between relative shadow-inner overflow-hidden min-h-[380px] transition-colors">
          {/* Sunny Window Glow Backdrop */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-sky-100/60 dark:from-blue-900/20 to-transparent pointer-events-none" />

          {/* Top 4 Nutrient Pills: Carboidratos, Proteínas, Gorduras, Fibras */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 z-10">
            {/* 1. Carboidratos (Blue Pill) */}
            <div className="bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200 px-2 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
              <span className="text-xs">🌾</span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-extrabold uppercase">Carboidratos</span>
                <span className="text-[11px] font-mono font-black text-sky-950 dark:text-sky-100">
                  {totalCarbs.toFixed(1)}g
                </span>
              </div>
            </div>

            {/* 2. Proteínas (Green Pill) */}
            <div className="bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 px-2 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
              <span className="text-xs">🥩</span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-extrabold uppercase">Proteínas</span>
                <span className="text-[11px] font-mono font-black text-emerald-950 dark:text-emerald-100">
                  {totalProtein.toFixed(1)}g
                </span>
              </div>
            </div>

            {/* 3. Gorduras (Orange Pill) */}
            <div className="bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-2 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
              <span className="text-xs">🥑</span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-extrabold uppercase">Gorduras</span>
                <span className="text-[11px] font-mono font-black text-amber-950 dark:text-amber-100">
                  {totalFat.toFixed(1)}g
                </span>
              </div>
            </div>

            {/* 4. Fibras (Purple Pill) */}
            <div className="bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200 px-2 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
              <span className="text-xs">🍇</span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-extrabold uppercase">Fibras</span>
                <span className="text-[11px] font-mono font-black text-purple-950 dark:text-purple-100">
                  {totalFiber.toFixed(1)}g
                </span>
              </div>
            </div>
          </div>

          {/* Spacious Meal Platter / Plate on the Kitchen Table */}
          <div className="w-full my-2 bg-gradient-to-b from-white via-slate-50/95 to-slate-100 dark:from-[#132342] dark:via-[#0f1d38] dark:to-[#0c172e] rounded-2xl sm:rounded-3xl border-4 border-white dark:border-blue-800 shadow-xl shadow-amber-950/10 dark:shadow-black/50 p-3 flex flex-col justify-between flex-1 min-h-[270px]">
            {/* Plate Header Bar with Meal Title & Table Props */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 dark:border-blue-800/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-teal-700 dark:bg-blue-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
                  🍽️
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-blue-100 leading-tight">
                    Prato de {mealTitles[activeMealId].name}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                    {currentSlot.items.length === 0
                      ? 'Nenhum alimento adicionado'
                      : `${currentSlot.items.length} ${currentSlot.items.length === 1 ? 'alimento montado' : 'alimentos montados no prato'}`}
                  </span>
                </div>
              </div>

              {/* Table Accents (Juice/Drink + Fruit indicator) */}
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/80 px-2 py-1 rounded-xl text-[10px] font-bold text-amber-900 dark:text-amber-300 shadow-xs">
                <span>🥤</span>
                <span className="hidden sm:inline">Mesa Brasileira</span>
                <span>🍎</span>
              </div>
            </div>

            {/* Plate Content: Food items list or empty state */}
            <div className="flex-1 flex flex-col justify-center">
              {currentSlot.items.length === 0 ? (
                <div className="my-auto py-6 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-blue-950/60 border-2 border-dashed border-teal-200 dark:border-blue-700 flex items-center justify-center text-2xl mb-2 text-teal-600 dark:text-blue-300 animate-pulse">
                    🍽️
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 block">
                    Prato Vazio
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[240px] mx-auto mt-1 leading-snug">
                    Selecione os alimentos ao lado e toque no botão <strong className="text-teal-700 dark:text-blue-300 font-bold">+</strong> para montar seu {mealTitles[activeMealId].name}.
                  </span>
                </div>
              ) : (
                <div className="max-h-[240px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                  {currentSlot.items.map(({ food, portions }) => {
                    const itemWeightG = food.servingSizeGrams * portions;
                    const itemKcal = Math.round(
                      (food.per100g.energyKcal * itemWeightG) / 100
                    );

                    return (
                      <div
                        key={food.id}
                        className="p-2 sm:px-2.5 bg-white dark:bg-[#152747] hover:bg-teal-50/50 dark:hover:bg-[#1c325c] border border-slate-200 dark:border-blue-900/80 hover:border-teal-200 dark:hover:border-blue-700 rounded-xl transition flex items-center justify-between gap-2 shadow-xs"
                      >
                        {/* Food Emoji + Full Name + Nutrition grams/kcal */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-2xl shrink-0 w-8 h-8 rounded-xl bg-slate-50 dark:bg-[#0b162b] border border-slate-100 dark:border-blue-900/70 flex items-center justify-center shadow-xs">
                            {food.iconEmoji}
                          </span>
                          <div className="flex flex-col min-w-0 leading-tight">
                            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                              {food.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
                              <span className="font-bold text-teal-700 dark:text-blue-300 font-mono">
                                {itemWeightG}g
                              </span>
                              <span>•</span>
                              <span className="font-mono text-amber-800 dark:text-amber-300 font-bold">
                                {itemKcal} kcal
                              </span>
                              <span className="hidden sm:inline text-slate-400 dark:text-slate-500">
                                ({food.servingLabel})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Portion Controls: Minus, Count, Plus, Trash */}
                        <div className="flex items-center gap-1 shrink-0 bg-slate-50 dark:bg-[#0b162b] border border-slate-200 dark:border-blue-900/80 p-0.5 rounded-xl">
                          <button
                            onClick={() => {
                              playClickSound();
                              onAdjustPortion(food.id, -1);
                            }}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-[#16274a] hover:bg-slate-200 dark:hover:bg-[#203666] active:scale-95 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer transition shadow-xs"
                            title="Diminuir porção"
                          >
                            <Minus className="w-3 h-3 stroke-[2.5]" />
                          </button>
                          <span className="text-xs font-black text-slate-900 dark:text-slate-100 px-1.5 font-mono min-w-[20px] text-center">
                            {portions}x
                          </span>
                          <button
                            onClick={() => {
                              playClickSound();
                              onAdjustPortion(food.id, 1);
                            }}
                            className="w-6 h-6 rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-95 text-white flex items-center justify-center text-xs font-bold cursor-pointer transition shadow-xs"
                            title="Aumentar porção"
                          >
                            <Plus className="w-3 h-3 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => {
                              playClickSound();
                              onRemoveFoodFromMeal(food.id);
                            }}
                            className="w-6 h-6 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 dark:hover:text-rose-300 active:scale-95 flex items-center justify-center cursor-pointer transition ml-0.5"
                            title="Remover do prato"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Table Bar: Digital Kitchen Scale + Note with Pencil */}
          <div className="flex items-center justify-between gap-2 z-10 pt-2 border-t border-[#d4b08c]/60 dark:border-blue-900/60">
            {/* Digital Kitchen Scale (Gray body with blue LCD display) */}
            <div className="flex items-center gap-2 bg-slate-800 dark:bg-[#060e1c] border-2 border-slate-700 dark:border-blue-800 px-3 py-1.5 rounded-xl shadow-md">
              <Scale className="w-3.5 h-3.5 text-sky-400" />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-bold text-slate-400">Balança</span>
                <span className="font-mono text-base font-black text-sky-300 tracking-wider">
                  {mealTotalGrams} g
                </span>
              </div>
            </div>

            {/* Total Kcal */}
            <div className="bg-white/95 dark:bg-[#101e38] border border-slate-300 dark:border-blue-800 px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
              <span className="text-xs">🔥</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Total:</span>
                <span className="text-xs font-black text-amber-900 dark:text-amber-300 font-mono">
                  {totalKcal} kcal
                </span>
              </div>
            </div>

            {currentSlot.items.length > 0 && (
              <button
                onClick={() => {
                  playClickSound();
                  onResetMeal();
                }}
                className="px-2 py-1.5 bg-white/90 dark:bg-[#142340] hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-slate-200 dark:border-blue-800 text-rose-700 dark:text-rose-300 rounded-xl transition cursor-pointer text-xs font-bold flex items-center gap-1"
                title="Limpar o prato para montar do zero"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Subpanel: "Distribuição da refeição" (Donut Chart & TACO info) */}
        <div className="md:col-span-3 bg-slate-50/90 dark:bg-[#0b162b]/90 rounded-2xl p-3 border border-slate-200 dark:border-blue-900/80 flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-blue-100 mb-1 uppercase tracking-wide">
              Distribuição da refeição
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-2">
              Proporção de macronutrientes no prato montado
            </p>

            {/* SVG Donut Chart */}
            <div className="flex justify-center my-2 relative">
              <svg width="105" height="105" viewBox="0 0 100 100" className="rotate-[-90deg]">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="14"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="14"
                  strokeDasharray={`${strokeCarb} ${circumference}`}
                  strokeDashoffset={offsetCarb}
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="14"
                  strokeDasharray={`${strokeProt} ${circumference}`}
                  strokeDashoffset={offsetProt}
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="14"
                  strokeDasharray={`${strokeFat} ${circumference}`}
                  strokeDashoffset={offsetFat}
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="14"
                  strokeDasharray={`${strokeFiber} ${circumference}`}
                  strokeDashoffset={offsetFiber}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">{mealTotalGrams}g</span>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">peso total</span>
              </div>
            </div>

            {/* Legend with Color Dots */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-1 bg-white dark:bg-[#132240] rounded-lg border border-slate-100 dark:border-blue-900/80">
                <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Carboidratos
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{carbPct}%</span>
              </div>
              <div className="flex items-center justify-between p-1 bg-white dark:bg-[#132240] rounded-lg border border-slate-100 dark:border-blue-900/80">
                <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  Proteínas
                </span>
                <span className="font-mono font-bold text-green-600 dark:text-green-400">{proteinPct}%</span>
              </div>
              <div className="flex items-center justify-between p-1 bg-white dark:bg-[#132240] rounded-lg border border-slate-100 dark:border-blue-900/80">
                <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  Gorduras
                </span>
                <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{fatPct}%</span>
              </div>
              <div className="flex items-center justify-between p-1 bg-white dark:bg-[#132240] rounded-lg border border-slate-100 dark:border-blue-900/80">
                <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Fibras
                </span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{fiberPct}%</span>
              </div>
            </div>
          </div>

          {/* TACO / UNICAMP Reference Footer Label */}
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-blue-900/60 text-center">
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block">
              Tabela TACO 4ª Ed. / UNICAMP
            </span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-0.5">
              Guia Alimentar para a População Brasileira
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BALANÇO DIÁRIO DAS 4 REFEIÇÕES & BOTÃO DE TRANSIÇÃO PARA PESO E SAÚDE     */}
      {/* ========================================================================= */}
      <div className="mt-4 bg-gradient-to-r from-teal-900 via-teal-800 to-sky-900 dark:from-[#09152b] dark:via-[#0e2145] dark:to-[#0a1833] text-white rounded-3xl p-4 sm:p-5 border-2 border-teal-500/40 dark:border-blue-700/80 shadow-xl shadow-teal-950/20 transition-all">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 border-b border-teal-700/60 dark:border-blue-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500 dark:bg-blue-600 text-white flex items-center justify-center shadow-md font-bold text-lg">
              ⚖️
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight text-white font-display flex items-center gap-2">
                <span>Consumo Total do Dia</span>
                <span className="text-[10px] font-bold text-teal-200 dark:text-blue-200 bg-teal-950/50 dark:bg-blue-900/60 px-2 py-0.5 rounded-full border border-teal-600/40">
                  Balanço das 4 Refeições
                </span>
              </h3>
              <p className="text-[11px] text-teal-200 dark:text-blue-200 font-medium">
                Soma acumulada de massa e energia de todo o seu dia escolar
              </p>
            </div>
          </div>

          {/* Completion Status Badge */}
          <div>
            {allFourMealsCompleted ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 rounded-2xl text-xs font-black shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>🎉 4 de 4 Refeições Concluídas!</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-400/50 text-amber-200 rounded-2xl text-xs font-black shadow-xs">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{dailyStats.completedCount} de 4 Refeições Montadas</span>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3.5">
          {/* Card 1: Peso Total Consumido */}
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xs rounded-2xl p-3 border border-white/15 dark:border-blue-800/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-teal-200 dark:text-blue-200 uppercase tracking-tight">
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" />
                Peso Total do Dia
              </span>
              <span className="text-[10px] font-mono text-teal-300">4 refeições</span>
            </div>
            <div className="my-1.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                {dailyStats.totalGrams.toLocaleString('pt-BR')}
              </span>
              <span className="text-sm font-bold text-teal-200">g</span>
              {dailyStats.totalGrams >= 1000 && (
                <span className="text-xs font-mono font-bold text-teal-300 ml-1">
                  ({(dailyStats.totalGrams / 1000).toFixed(2)} kg)
                </span>
              )}
            </div>
            <p className="text-[10px] text-teal-200/80 leading-tight">
              Massa de alimentos sólidos e bebidas consumidos hoje.
            </p>
          </div>

          {/* Card 2: Energia Total do Dia */}
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xs rounded-2xl p-3 border border-white/15 dark:border-blue-800/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-200 uppercase tracking-tight">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Energia Total (Calorias)
              </span>
              <span className="text-[10px] font-mono text-amber-300">Meta: ~2.000 kcal</span>
            </div>
            <div className="my-1.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300 tracking-tight">
                {dailyStats.totalKcal.toLocaleString('pt-BR')}
              </span>
              <span className="text-sm font-bold text-amber-200">kcal</span>
            </div>
            {/* Progress bar compared to 2000 kcal */}
            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((dailyStats.totalKcal / 2000) * 100))}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[9px] font-mono text-teal-200">
              <span>{Math.round((dailyStats.totalKcal / 2000) * 100)}% da meta de 2.000 kcal</span>
              <span>{Math.max(0, 2000 - dailyStats.totalKcal)} kcal restantes</span>
            </div>
          </div>

          {/* Card 3: Distribuição por Refeição */}
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xs rounded-2xl p-3 border border-white/15 dark:border-blue-800/60 flex flex-col justify-between">
            <div className="text-[11px] font-bold text-teal-200 dark:text-blue-200 uppercase tracking-tight mb-1.5">
              Composição das 4 Refeições
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {[
                { id: 'breakfast', label: 'Café', icon: '☀️' },
                { id: 'lunch', label: 'Almoço', icon: '🍽️' },
                { id: 'snack', label: 'Lanche', icon: '🥪' },
                { id: 'dinner', label: 'Jantar', icon: '🌙' },
              ].map((m) => {
                const st = dailyStats.details[m.id as MealTimeId];
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      playClickSound();
                      onSelectMealTime(m.id as MealTimeId);
                    }}
                    className={`p-1.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      st?.hasItems
                        ? 'bg-white/15 hover:bg-white/25 border-emerald-400/40 text-white'
                        : 'bg-black/20 hover:bg-black/30 border-white/10 text-white/50'
                    }`}
                    title={`Ver ou editar ${m.label}`}
                  >
                    <span className="font-bold flex items-center gap-1">
                      <span>{m.icon}</span>
                      <span className="text-[10px]">{m.label}</span>
                    </span>
                    <span className="font-mono font-bold text-[10px] text-teal-200">
                      {st?.hasItems ? `${st.kcal} kcal` : '0 kcal'}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-teal-200/80 mt-1.5 text-center">
              Toque em uma refeição acima para inspecionar ou editar
            </p>
          </div>
        </div>

        {/* Bottom Action Row: Callout + Next Step Button */}
        <div className="pt-3 border-t border-teal-700/60 dark:border-blue-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left leading-tight">
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              {allFourMealsCompleted ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Pronto para o próximo passo! Todas as 4 refeições foram registradas.</span>
                </>
              ) : (
                <>
                  <Info className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>
                    Faltam {4 - dailyStats.completedCount} refeição(ões) para o balanço energético completo do dia.
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-teal-200/90 font-medium mt-0.5">
              Na aba <strong>"2. Peso e Saúde"</strong>, investigue como as calorias diárias impactam a massa corporal, o gasto calórico e o cálculo do IMC!
            </p>
          </div>

          <button
            onClick={() => {
              if (allFourMealsCompleted) {
                playFanfare();
                try {
                  confetti({
                    particleCount: 65,
                    spread: 70,
                    origin: { y: 0.65 },
                    colors: ['#0d9488', '#3b82f6', '#f59e0b', '#10b981'],
                  });
                } catch {}
              } else {
                playClickSound();
              }
              onNavigateToWeight?.();
            }}
            className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shrink-0 ${
              allFourMealsCompleted
                ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 shadow-amber-950/20 scale-[1.02] hover:scale-105 border-2 border-white'
                : 'bg-white hover:bg-teal-50 text-teal-950 dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-white border-2 border-teal-400 dark:border-blue-400'
            }`}
          >
            <span>
              {allFourMealsCompleted
                ? '🎉 Avançar para "2. Peso e Saúde"'
                : 'Avançar para "2. Peso e Saúde"'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Food Detail Modal / Tooltip */}
      {selectedFoodInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0f1b33] rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-blue-700">
            <div className="bg-teal-700 dark:bg-blue-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{selectedFoodInfo.iconEmoji}</span>
                <div>
                  <h3 className="text-base font-black">{selectedFoodInfo.name}</h3>
                  <p className="text-xs text-teal-100">{selectedFoodInfo.servingLabel}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFoodInfo(null)}
                className="w-7 h-7 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3 text-slate-800 dark:text-slate-100">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedFoodInfo.description}
              </p>

              {selectedFoodInfo.popularContext && (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 rounded-xl text-[11px] text-amber-900 dark:text-amber-200">
                  <span className="font-black">Contexto Social e Cultural: </span>
                  {selectedFoodInfo.popularContext}
                </div>
              )}

              <div className="bg-slate-50 dark:bg-[#0b162b] p-3 rounded-xl border border-slate-200 dark:border-blue-900/80 space-y-1 text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Valores TACO por 100g de alimento:
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="bg-white dark:bg-[#152547] p-1.5 rounded-lg border border-slate-200 dark:border-blue-800">
                    <span className="text-slate-500 dark:text-slate-400">Energia: </span>
                    <span className="font-bold font-mono text-teal-900 dark:text-blue-300">{selectedFoodInfo.per100g.energyKcal} kcal</span>
                  </div>
                  <div className="bg-white dark:bg-[#152547] p-1.5 rounded-lg border border-slate-200 dark:border-blue-800">
                    <span className="text-slate-500 dark:text-slate-400">Carboidratos: </span>
                    <span className="font-bold font-mono text-blue-600 dark:text-blue-400">{selectedFoodInfo.per100g.carbsG}g</span>
                  </div>
                  <div className="bg-white dark:bg-[#152547] p-1.5 rounded-lg border border-slate-200 dark:border-blue-800">
                    <span className="text-slate-500 dark:text-slate-400">Proteínas: </span>
                    <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{selectedFoodInfo.per100g.proteinG}g</span>
                  </div>
                  <div className="bg-white dark:bg-[#152547] p-1.5 rounded-lg border border-slate-200 dark:border-blue-800">
                    <span className="text-slate-500 dark:text-slate-400">Gorduras: </span>
                    <span className="font-bold font-mono text-amber-600 dark:text-amber-400">{selectedFoodInfo.per100g.fatG}g</span>
                  </div>
                  <div className="bg-white dark:bg-[#152547] p-1.5 rounded-lg border border-slate-200 dark:border-blue-800 col-span-2">
                    <span className="text-slate-500 dark:text-slate-400">Fibras Alimentares: </span>
                    <span className="font-bold font-mono text-purple-600 dark:text-purple-400">{selectedFoodInfo.per100g.fiberG}g</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  onAddFoodToMeal(selectedFoodInfo);
                  setSelectedFoodInfo(null);
                }}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Adicionar {selectedFoodInfo.name} ao Prato
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
