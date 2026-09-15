import React, { useState, useMemo } from 'react';
import { ArrowLeft, Sparkles, ChefHat, Lightbulb } from 'lucide-react';
import { FoodItem, MealSlot, MealTimeId } from '../types';
import { BRAZILIAN_FOODS } from '../data/tacoData';
import { MEAL_SUGGESTIONS } from '../data/mealSuggestions';
import { playClickSound } from '../utils/audio';
import { FoodCatalog, FoodFilterTab } from './meal/FoodCatalog';
import { PlateView } from './meal/PlateView';
import { NutrientDonut } from './meal/NutrientDonut';
import { DailyBalanceBanner } from './meal/DailyBalanceBanner';
import { FoodDetailModal } from './meal/FoodDetailModal';

interface MealDiarySectionProps {
  mealSlots: Record<MealTimeId, MealSlot>;
  activeMealId: MealTimeId;
  onSelectMealTime: (mealId: MealTimeId) => void;
  onAddFoodToMeal: (food: FoodItem) => void;
  onRemoveFoodFromMeal: (foodId: string) => void;
  onAdjustPortion: (foodId: string, delta: number) => void;
  onResetMeal: () => void;
  onOpenProportionChallenge: () => void;
  onLoadMealTemplate: (mealId: MealTimeId, foods: { foodId: string; portions: number }[]) => void;
  isFocusedView?: boolean;
  onCloseFocus?: () => void;
  onNavigateToWeight?: () => void;
  isMissionSolved?: boolean;
  onStartMission?: () => void;
}

const MEAL_TABS = [
  {
    id: 'breakfast' as const,
    label: 'Café da Manhã',
    icon: '☀️',
    tag: 'Desjejum',
    activeGradient: 'bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 dark:from-amber-600 dark:via-orange-700 dark:to-amber-800',
    activeBorder: 'border-amber-300 dark:border-amber-400',
    activeShadow: 'shadow-lg shadow-amber-500/25 dark:shadow-amber-900/30',
    activeRing: 'ring-2 ring-amber-300/40',
    inactiveBorderHover: 'hover:border-amber-300/90 dark:hover:border-amber-600/80',
    inactiveBgHover: 'hover:bg-amber-50/60 dark:hover:bg-amber-950/20',
    inactiveIconBg: 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60',
    inactiveBadge: 'text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80',
  },
  {
    id: 'lunch' as const,
    label: 'Almoço',
    icon: '🍽️',
    tag: 'Principal',
    activeGradient: 'bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-800 dark:from-teal-600 dark:via-emerald-700 dark:to-cyan-900',
    activeBorder: 'border-teal-300 dark:border-teal-400',
    activeShadow: 'shadow-lg shadow-teal-600/25 dark:shadow-teal-900/30',
    activeRing: 'ring-2 ring-teal-300/40',
    inactiveBorderHover: 'hover:border-teal-300/90 dark:hover:border-teal-600/80',
    inactiveBgHover: 'hover:bg-teal-50/60 dark:hover:bg-teal-950/20',
    inactiveIconBg: 'bg-teal-100/80 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60',
    inactiveBadge: 'text-teal-800 dark:text-teal-300 bg-teal-100/70 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80',
  },
  {
    id: 'snack' as const,
    label: 'Lanche da Tarde',
    icon: '🥤',
    tag: 'Lanche',
    activeGradient: 'bg-gradient-to-br from-orange-500 via-rose-500 to-amber-600 dark:from-orange-600 dark:via-rose-700 dark:to-amber-800',
    activeBorder: 'border-orange-300 dark:border-orange-400',
    activeShadow: 'shadow-lg shadow-orange-500/25 dark:shadow-orange-900/30',
    activeRing: 'ring-2 ring-orange-300/40',
    inactiveBorderHover: 'hover:border-orange-300/90 dark:hover:border-orange-600/80',
    inactiveBgHover: 'hover:bg-orange-50/60 dark:hover:bg-orange-950/20',
    inactiveIconBg: 'bg-orange-100/80 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200/60 dark:border-orange-800/60',
    inactiveBadge: 'text-orange-800 dark:text-orange-300 bg-orange-100/70 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/80',
  },
  {
    id: 'dinner' as const,
    label: 'Jantar',
    icon: '🌙',
    tag: 'Noturno',
    activeGradient: 'bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 dark:from-indigo-600 dark:via-purple-800 dark:to-slate-900',
    activeBorder: 'border-indigo-300 dark:border-indigo-400',
    activeShadow: 'shadow-lg shadow-indigo-600/25 dark:shadow-indigo-900/30',
    activeRing: 'ring-2 ring-indigo-300/40',
    inactiveBorderHover: 'hover:border-indigo-300/90 dark:hover:border-indigo-600/80',
    inactiveBgHover: 'hover:bg-indigo-50/60 dark:hover:bg-indigo-950/20',
    inactiveIconBg: 'bg-indigo-100/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60',
    inactiveBadge: 'text-indigo-800 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80',
  },
];

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
  isMissionSolved,
  onStartMission,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FoodFilterTab>('suggested');
  const [selectedFoodInfo, setSelectedFoodInfo] = useState<FoodItem | null>(null);

  const currentSlot = mealSlots[activeMealId];
  const suggestions = MEAL_SUGGESTIONS[activeMealId] ?? [];

  // Calories per meal slot for summary cards
  const slotCalories = useMemo(() => {
    const res: Record<MealTimeId, number> = {
      breakfast: 0,
      lunch: 0,
      snack: 0,
      dinner: 0,
    };
    (Object.keys(mealSlots) as MealTimeId[]).forEach((key) => {
      const slot = mealSlots[key];
      res[key] = Math.round(
        slot.items.reduce((sum, item) => {
          const weight = item.food.servingSizeGrams * item.portions;
          return sum + (item.food.per100g.energyKcal * weight) / 100;
        }, 0)
      );
    });
    return res;
  }, [mealSlots]);

  // ---- Computed meal metrics ----
  const mealMetrics = useMemo(() => {
    const items = currentSlot.items;
    let totalGrams = 0;
    let totalKcal = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalFiber = 0;

    for (const { food, portions } of items) {
      const weight = food.servingSizeGrams * portions;
      totalGrams += weight;
      totalKcal += (food.per100g.energyKcal * weight) / 100;
      totalCarbs += (food.per100g.carbsG * weight) / 100;
      totalProtein += (food.per100g.proteinG * weight) / 100;
      totalFat += (food.per100g.fatG * weight) / 100;
      totalFiber += (food.per100g.fiberG * weight) / 100;
    }

    return {
      totalGrams,
      totalKcal: Math.round(totalKcal),
      totalCarbs,
      totalProtein,
      totalFat,
      totalFiber,
    };
  }, [currentSlot.items]);

  // ---- Handlers ----
  const handleApplySuggestion = (suggestion: (typeof suggestions)[0]) => {
    playClickSound();
    onLoadMealTemplate(activeMealId, suggestion.items);
  };

  return (
    <section className="bg-white/95 dark:bg-[#0f1b33]/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-teal-200/90 dark:border-blue-800 shadow-xl shadow-teal-950/5 dark:shadow-black/40 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b-2 border-teal-100 dark:border-blue-900/60 mb-4">
        <div className="flex items-center gap-3">
          {isFocusedView && onCloseFocus && (
            <button
              onClick={() => { playClickSound(); onCloseFocus(); }}
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-blue-900/60 text-slate-700 hover:text-teal-700 dark:text-slate-200 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition cursor-pointer shadow-xs active:scale-95"
              title="Voltar à visão geral"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 text-2xl border-2 border-white/40 dark:border-blue-400/30 shrink-0">
            🍽️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight font-display leading-tight">
                1. Diário de Refeições
              </h2>
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-500/15 to-emerald-500/15 dark:from-teal-400/20 dark:to-emerald-400/20 text-teal-800 dark:text-teal-300 border border-teal-500/30 text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Monte seu Prato
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
              Arraste ou adicione alimentos no prato para calcular macronutrientes e calorias em tempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Meal Time Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 mb-4">
        {MEAL_TABS.map((meal) => {
          const isActive = activeMealId === meal.id;
          const slotItems = mealSlots[meal.id].items;
          const hasItems = slotItems.length > 0;
          const kcal = slotCalories[meal.id];

          return (
            <button
              key={meal.id}
              onClick={() => { playClickSound(); onSelectMealTime(meal.id); }}
              className={`group relative p-3 sm:p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer border-2 flex flex-col justify-between overflow-hidden shadow-xs ${isActive
                ? `${meal.activeGradient} text-white ${meal.activeBorder} ${meal.activeShadow} ${meal.activeRing} scale-[1.02]`
                : `bg-white dark:bg-[#0f1b33] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-900/80 ${meal.inactiveBgHover} ${meal.inactiveBorderHover} hover:shadow-md hover:-translate-y-0.5`
                }`}
            >
              {/* Top line: Icon + Time Chip / Active Pill */}
              <div className="flex items-center justify-between gap-2 w-full">
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0 transition-transform group-hover:scale-105 ${isActive
                    ? 'bg-white/20 backdrop-blur-sm text-white shadow-inner border border-white/25'
                    : meal.inactiveIconBg
                    }`}
                >
                  {meal.icon}
                </div>

                {isActive ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white px-2.5 py-1 rounded-full border border-white/25 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                    {meal.tag}
                  </span>
                )}
              </div>

              {/* Middle: Title */}
              <div className="mt-3 mb-2">
                <h3
                  className={`text-sm sm:text-base font-black tracking-tight leading-tight font-display ${isActive ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                    }`}
                >
                  {meal.label}
                </h3>
              </div>

              {/* Bottom Bar: Items count & Calories */}
              <div
                className={`flex items-center justify-between gap-1.5 pt-2.5 border-t mt-1 ${isActive ? 'border-white/20' : 'border-slate-100 dark:border-slate-800'
                  }`}
              >
                <div className="flex items-center gap-1 text-xs sm:text-sm font-bold">
                  {hasItems ? (
                    <span className={isActive ? 'text-white font-black' : 'text-slate-700 dark:text-slate-200'}>
                      {slotItems.length} {slotItems.length === 1 ? 'alimento' : 'alimentos'}
                    </span>
                  ) : (
                    <span className={isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-500 font-medium'}>
                      {isActive ? 'Adicione itens' : 'Nenhum item'}
                    </span>
                  )}
                </div>

                <span
                  className={`text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg transition-colors ${isActive
                    ? 'bg-white/20 text-white border border-white/20 shadow-xs'
                    : hasItems
                      ? meal.inactiveBadge
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500'
                    }`}
                >
                  {kcal} kcal
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Suggestion Bar */}
      {suggestions.length > 0 && (
        <div className="mb-3.5 p-3 sm:p-3.5 bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-amber-50/90 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-amber-200/80 dark:bg-amber-800/60 flex items-center justify-center text-amber-900 dark:text-amber-100">
              <ChefHat className="w-4 h-4" />
            </div>
            <span>Sugestões para {currentSlot.label}:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin py-1">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleApplySuggestion(sug)}
                className="px-3 py-1.5 bg-white dark:bg-[#132240] hover:bg-amber-100/90 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-700/80 hover:border-amber-400 rounded-xl text-xs sm:text-sm font-extrabold text-amber-950 dark:text-amber-100 whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-2 shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-95"
              >
                <span>🍽️ {sug.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Meal Tip Card */}
      <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-sky-50 via-teal-50/30 to-sky-50 dark:from-sky-950/40 dark:via-teal-950/20 dark:to-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 rounded-2xl text-xs sm:text-sm text-sky-950 dark:text-sky-200 shadow-xs">
        <div className="w-7 h-7 rounded-lg bg-sky-200/80 dark:bg-sky-800/60 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
          <Lightbulb className="w-4 h-4" />
        </div>
        <p className="font-medium text-xs sm:text-sm leading-relaxed">
          Dica Nutricional: O <strong>{currentSlot.label}</strong> ideal corresponde a cerca de{' '}
          <span className="font-black text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-md">
            {currentSlot.targetProportion}
          </span>{' '}
          da sua ingestão calórica diária recomendada.
        </p>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch min-h-[400px]">
        {/* Left: Food Catalog */}
        <FoodCatalog
          activeMealId={activeMealId}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          currentPlateItems={currentSlot.items}
          onAddFood={onAddFoodToMeal}
          onSelectFoodInfo={setSelectedFoodInfo}
        />

        {/* Center: Plate */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#faf6ee] via-[#f6efe4] to-[#f0e6d6] dark:from-[#0c1d3a] dark:via-[#0e1f3c] dark:to-[#0b1a33] rounded-2xl p-3 sm:p-4 border-2 border-[#e3d3be] dark:border-blue-800/80 shadow-xs flex flex-col justify-between transition-colors relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 dark:opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #c4a984 0.75px, transparent 0.75px), radial-gradient(circle at 80% 30%, #c4a984 0.75px, transparent 0.75px)', backgroundSize: '28px 28px' }} />
          <div className="relative z-10 flex flex-col h-full">
            <PlateView
              activeMealId={activeMealId}
              mealName={currentSlot.label}
              items={currentSlot.items}
              mealTotalGrams={mealMetrics.totalGrams}
              totalKcal={mealMetrics.totalKcal}
              onAdjustPortion={onAdjustPortion}
              onRemoveFood={onRemoveFoodFromMeal}
              onResetMeal={onResetMeal}
            />
          </div>
        </div>

        {/* Right: Nutrient Donut */}
        <NutrientDonut
          totalCarbs={mealMetrics.totalCarbs}
          totalProtein={mealMetrics.totalProtein}
          totalFat={mealMetrics.totalFat}
          totalFiber={mealMetrics.totalFiber}
          mealTotalGrams={mealMetrics.totalGrams}
        />
      </div>

      {/* Daily Balance Banner */}
      <DailyBalanceBanner
        mealSlots={mealSlots}
        onSelectMealTime={onSelectMealTime}
        onNavigateToWeight={onNavigateToWeight}
        isMissionSolved={isMissionSolved}
        onStartMission={onStartMission}
      />

      {/* Food Detail Modal */}
      {selectedFoodInfo && (
        <FoodDetailModal
          food={selectedFoodInfo}
          onClose={() => setSelectedFoodInfo(null)}
          onAddFood={onAddFoodToMeal}
        />
      )}
    </section>
  );
};
