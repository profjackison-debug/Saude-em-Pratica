import React from 'react';
import { Plus } from 'lucide-react';
import { FoodItem } from '../../types';
import { playClickSound } from '../../utils/audio';

interface FoodDetailModalProps {
  food: FoodItem;
  onClose: () => void;
  onAddFood: (food: FoodItem) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ food, onClose, onAddFood }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0f1b33] rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-blue-700">
        <div className="bg-teal-700 dark:bg-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{food.iconEmoji}</span>
            <div>
              <h3 className="text-base font-black">{food.name}</h3>
              <p className="text-xs text-teal-100">{food.servingLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-3 text-slate-800 dark:text-slate-100">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {food.description}
          </p>

          {food.popularContext && (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 rounded-xl text-[11px] text-amber-900 dark:text-amber-200">
              <span className="font-black">Contexto Social e Cultural: </span>
              {food.popularContext}
            </div>
          )}

          <div className="bg-slate-50 dark:bg-[#0b162b] p-3 rounded-xl border border-slate-200 dark:border-blue-900/80 space-y-1 text-xs">
            <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">
              Valores nutricionais por 100g de alimento:
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="bg-white dark:bg-[#152547] p-1.5 rounded-lg border border-slate-200 dark:border-blue-800">
                <span className="text-slate-500 dark:text-slate-400">Energia: </span>
                <span className="font-bold font-mono text-teal-900 dark:text-blue-300">{food.per100g.energyKcal} kcal</span>
              </div>
              <div className="bg-white dark:bg-[#152547] p-1.5 rounded-lg border border-slate-200 dark:border-blue-800">
                <span className="text-slate-500 dark:text-slate-400">Carboidratos: </span>
                <span className="font-bold font-mono text-blue-600 dark:text-blue-400">{food.per100g.carbsG}g</span>
              </div>
              <div className="bg-white dark:bg-[#152547] p-1.5 rounded-lg border border-slate-200 dark:border-blue-800">
                <span className="text-slate-500 dark:text-slate-400">Proteínas: </span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{food.per100g.proteinG}g</span>
              </div>
              <div className="bg-white dark:bg-[#152547] p-1.5 rounded-lg border border-slate-200 dark:border-blue-800">
                <span className="text-slate-500 dark:text-slate-400">Gorduras: </span>
                <span className="font-bold font-mono text-amber-600 dark:text-amber-400">{food.per100g.fatG}g</span>
              </div>
              <div className="bg-white dark:bg-[#152547] p-1.5 rounded-lg border border-slate-200 dark:border-blue-800 col-span-2">
                <span className="text-slate-500 dark:text-slate-400">Fibras Alimentares: </span>
                <span className="font-bold font-mono text-purple-600 dark:text-purple-400">{food.per100g.fiberG}g</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onAddFood(food);
              onClose();
            }}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Adicionar {food.name} ao Prato
          </button>
        </div>
      </div>
    </div>
  );
};
