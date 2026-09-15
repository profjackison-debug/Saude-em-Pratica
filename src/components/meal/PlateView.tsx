import React from 'react';
import { Plus, Minus, Trash2, RotateCcw, Scale } from 'lucide-react';
import { FoodItem, MealTimeId } from '../../types';
import { playClickSound } from '../../utils/audio';

interface PlateViewProps {
  activeMealId: MealTimeId;
  mealName: string;
  items: { food: FoodItem; portions: number }[];
  mealTotalGrams: number;
  totalKcal: number;
  onAdjustPortion: (foodId: string, delta: number) => void;
  onRemoveFood: (foodId: string) => void;
  onResetMeal: () => void;
}

export const PlateView: React.FC<PlateViewProps> = ({
  activeMealId,
  mealName,
  items,
  mealTotalGrams,
  totalKcal,
  onAdjustPortion,
  onRemoveFood,
  onResetMeal,
}) => {
  return (
    <>
      {/* Plate Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#e3d3be] dark:border-blue-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-700 dark:bg-blue-600 text-white flex items-center justify-center text-base sm:text-lg font-black shadow-xs">
            🍽️
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-blue-100 leading-tight">
              Prato de {mealName}
            </h4>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">
              {items.length === 0
                ? 'Nenhum alimento adicionado'
                : `${items.length} ${items.length === 1 ? 'alimento montado' : 'alimentos montados no prato'}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/80 px-2.5 py-1 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-300 shadow-xs">
          <span>🥤</span>
          <span className="hidden sm:inline font-bold">Mesa Brasileira</span>
          <span>🍎</span>
        </div>
      </div>

      {/* Plate Content */}
      <div className="flex-1 flex flex-col justify-center">
        {items.length === 0 ? (
          <div className="my-auto py-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-blue-950/60 border-2 border-dashed border-teal-200 dark:border-blue-700 flex items-center justify-center text-3xl mb-2.5 text-teal-600 dark:text-blue-300 animate-pulse">
              🍽️
            </div>
            <span className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 block">
              Prato Vazio
            </span>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-[280px] mx-auto mt-1.5 leading-relaxed font-medium">
              Selecione os alimentos ao lado e toque no botão{' '}
              <strong className="text-teal-700 dark:text-blue-300 font-bold">+</strong> para montar seu{' '}
              {mealName}.
            </span>
          </div>
        ) : (
          <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {items.map(({ food, portions }) => {
              const itemWeightG = food.servingSizeGrams * portions;
              const itemKcal = Math.round((food.per100g.energyKcal * itemWeightG) / 100);

              return (
                <div
                  key={food.id}
                  className="p-2 sm:p-2.5 bg-white dark:bg-[#152747] hover:bg-teal-50/50 dark:hover:bg-[#1c325c] border border-slate-200 dark:border-blue-900/80 hover:border-teal-200 dark:hover:border-blue-700 rounded-xl transition flex items-center justify-between gap-2.5 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="text-2xl shrink-0 w-9 h-9 rounded-xl bg-slate-50 dark:bg-[#0b162b] border border-slate-100 dark:border-blue-900/70 flex items-center justify-center shadow-xs">
                      {food.iconEmoji}
                    </span>
                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                        {food.name}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                        <span className="font-bold text-teal-700 dark:text-blue-300 font-mono">
                          {itemWeightG}g
                        </span>
                        <span>•</span>
                        <span className="font-mono text-amber-800 dark:text-amber-300 font-bold">
                          {itemKcal} kcal
                        </span>
                        <span className="hidden sm:inline text-slate-500 dark:text-slate-400">
                          ({food.servingLabel})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 dark:bg-[#0b162b] border border-slate-200 dark:border-blue-900/80 p-1 rounded-xl">
                    <button
                      onClick={() => {
                        playClickSound();
                        onAdjustPortion(food.id, -1);
                      }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white dark:bg-[#16274a] hover:bg-slate-200 dark:hover:bg-[#203666] active:scale-95 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer transition shadow-xs"
                      title="Diminuir porção"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 px-1.5 font-mono min-w-[22px] text-center">
                      {portions}x
                    </span>
                    <button
                      onClick={() => {
                        playClickSound();
                        onAdjustPortion(food.id, 1);
                      }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-95 text-white flex items-center justify-center text-xs font-bold cursor-pointer transition shadow-xs"
                      title="Aumentar porção"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        onRemoveFood(food.id);
                      }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 dark:hover:text-rose-300 active:scale-95 flex items-center justify-center cursor-pointer transition ml-0.5"
                      title="Remover do prato"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Scale Bar */}
      <div className="flex items-center justify-between gap-2.5 z-10 pt-2.5 border-t border-[#e3d3be] dark:border-blue-900/60">
        <div className="flex items-center gap-2 bg-slate-800 dark:bg-[#060e1c] border-2 border-slate-700 dark:border-blue-800 px-3 py-1.5 rounded-xl shadow-md">
          <Scale className="w-4 h-4 text-sky-400" />
          <div className="flex flex-col leading-none">
            <span className="text-xs font-bold text-slate-400">Balança</span>
            <span className="font-mono text-base sm:text-lg font-black text-sky-300 tracking-wider">
              {mealTotalGrams} g
            </span>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-[#101e38] border border-slate-300 dark:border-blue-800 px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-2">
          <span className="text-sm">🔥</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Total:</span>
            <span className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-300 font-mono">
              {totalKcal} kcal
            </span>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => {
              playClickSound();
              onResetMeal();
            }}
            className="px-2.5 py-2 bg-white/90 dark:bg-[#142340] hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-slate-200 dark:border-blue-800 text-rose-700 dark:text-rose-300 rounded-xl transition cursor-pointer text-xs sm:text-sm font-bold flex items-center gap-1.5"
            title="Limpar o prato para montar do zero"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline font-bold">Limpar</span>
          </button>
        )}
      </div>
    </>
  );
};
