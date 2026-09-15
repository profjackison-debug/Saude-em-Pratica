import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Sparkles,
  Heart,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  X,
  Timer,
} from 'lucide-react';
import { FoodItem, MealTimeId } from '../types';
import { getMealNutritionalTips, MealEducationalTip } from '../data/nutritionTips';
import { playClickSound } from '../utils/audio';

interface MealTipCardProps {
  mealId: MealTimeId;
  mealName: string;
  items: { food: FoodItem; portions: number }[];
}

export const MealTipCard: React.FC<MealTipCardProps> = ({ mealId, mealName, items }) => {
  const tips = getMealNutritionalTips(mealId, items);
  const [tipIndex, setTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(10);

  // When switching to another meal, always show the tip and reset the 10-second timer
  useEffect(() => {
    setIsVisible(true);
    setSecondsRemaining(10);
    setTipIndex(0);
  }, [mealId]);

  // Countdown timer for 10 seconds
  useEffect(() => {
    if (!isVisible) return;

    if (secondsRemaining <= 0) {
      setIsVisible(false);
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, secondsRemaining, mealId]);

  const currentTip: MealEducationalTip = tips[tipIndex % tips.length] ?? tips[0]!;

  const handleNextTip = () => {
    playClickSound();
    setTipIndex((prev) => (prev + 1) % tips.length);
    // Give student another 10s to read the new tip
    setSecondsRemaining(10);
  };

  const handleManualHide = () => {
    playClickSound();
    setIsVisible(false);
  };

  const handleReopen = () => {
    playClickSound();
    setIsVisible(true);
    setSecondsRemaining(10);
  };

  if (!currentTip) return null;

  // When hidden after 10s, show a subtle compact pill allowing the student to reopen if desired
  if (!isVisible) {
    return (
      <div className="mb-3">
        <button
          onClick={handleReopen}
          className="w-full py-1.5 px-3 bg-amber-50/80 hover:bg-amber-100/90 dark:bg-[#0c1a33]/80 dark:hover:bg-[#13264a] border border-amber-300/80 dark:border-blue-800/80 rounded-2xl flex items-center justify-between text-xs font-bold text-amber-950 dark:text-blue-200 transition-all cursor-pointer shadow-2xs group"
          title={`Reabrir dica de ${mealName}`}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-amber-400/90 dark:bg-blue-600 text-amber-950 dark:text-white flex items-center justify-center text-[10px] shrink-0 font-black">
              💡
            </div>
            <span className="text-[11px] font-black text-amber-950 dark:text-amber-200 uppercase tracking-tight">
              Dica Nutricional • {mealName}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              (oculta após 10s — reabre na próxima refeição)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-800 dark:text-blue-300 group-hover:text-amber-900 dark:group-hover:text-white">
            <span>Ver Dica</span>
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-3 relative overflow-hidden bg-gradient-to-r from-amber-50/95 via-amber-50/70 to-emerald-50/85 dark:from-[#0f1f3d] dark:via-[#112448] dark:to-[#0f283d] border-2 border-amber-300/90 dark:border-blue-700/80 rounded-2xl p-3 sm:p-3.5 shadow-sm transition-all duration-300">
      {/* 10-Second Countdown Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-200/60 dark:bg-blue-900/60 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000 ease-linear"
          style={{ width: `${(secondsRemaining / 10) * 100}%` }}
        />
      </div>

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap pt-0.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 dark:bg-blue-600 text-amber-950 dark:text-white flex items-center justify-center shadow-xs border border-amber-500/40 dark:border-blue-400 font-bold shrink-0">
            <Lightbulb className="w-4 h-4 fill-amber-950/20 text-amber-950 dark:text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <h4 className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-300 font-display uppercase tracking-tight flex items-center gap-1.5">
              <span>Dica Nutricional do Dia</span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 lowercase">
                • {mealName}
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* 10s Timer Countdown Chip */}
          <div
            className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-200/70 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-amber-300/80 dark:border-blue-700/70 flex items-center gap-1 shadow-2xs"
            title="A dica se recolherá automaticamente ao fim da contagem até você selecionar outra refeição"
          >
            <Timer className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span>Oculta em {secondsRemaining}s</span>
          </div>

          {/* Badge */}
          <span
            className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border shadow-xs ${currentTip.badgeColor}`}
          >
            {currentTip.badge}
          </span>

          {/* Cycle tips button if more than 1 tip available */}
          {tips.length > 1 && (
            <button
              onClick={handleNextTip}
              className="text-[10px] font-bold px-2 py-1 bg-white/90 dark:bg-[#18305c] hover:bg-amber-100 dark:hover:bg-[#203d75] text-amber-900 dark:text-blue-200 border border-amber-300 dark:border-blue-600 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs"
              title="Ver outra dica sobre este prato (+10s para ler)"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Outra Dica ({tipIndex + 1}/{tips.length})</span>
              <span className="sm:hidden">{tipIndex + 1}/{tips.length}</span>
            </button>
          )}

          {/* Manual close button */}
          <button
            onClick={handleManualHide}
            className="text-[10px] font-bold p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
            title="Ocultar dica agora"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content: Title & Explanation */}
      <div className="space-y-1.5 text-left">
        <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug">
          {currentTip.title}
        </h5>
        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          {currentTip.explanation}
        </p>

        {/* Nutrients Involved & Health Benefit Grid */}
        <div className="pt-2 mt-2 border-t border-amber-200/70 dark:border-blue-800/80 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
          {/* Nutrients Involved Pills */}
          <div className="sm:col-span-6 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              Nutrientes-chave:
            </span>
            {currentTip.nutrientsInvolved.map((nut, i) => (
              <span
                key={i}
                className="text-[10.5px] font-bold bg-white dark:bg-[#142647] border border-amber-200 dark:border-blue-800 text-slate-800 dark:text-blue-100 px-2 py-0.5 rounded-lg shadow-2xs"
              >
                {nut}
              </span>
            ))}
          </div>

          {/* Health Benefit Callout */}
          <div className="sm:col-span-6 flex items-start gap-1.5 bg-white/80 dark:bg-[#122442]/80 border border-amber-200/80 dark:border-blue-800/80 rounded-xl p-1.5 px-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-tight block">
                Impacto no Corpo & Estudos:
              </span>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                {currentTip.healthBenefit}
              </span>
            </div>
          </div>
        </div>

        {/* Actionable Advice / Guia Note */}
        {currentTip.actionableAdvice && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-teal-900 dark:text-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-blue-400 shrink-0" />
            <span>
              <strong>Dica prática:</strong> {currentTip.actionableAdvice}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
