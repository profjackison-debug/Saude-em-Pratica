import React from 'react';
import { Scale, Flame, Sparkles, Info, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { MealTimeId } from '../../types';
import { playClickSound, playFanfare } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface DailyBalanceBannerProps {
  mealSlots: Record<MealTimeId, { items: { food: { servingSizeGrams: number; per100g: { energyKcal: number } }; portions: number }[] }>;
  onSelectMealTime: (mealId: MealTimeId) => void;
  onNavigateToWeight?: () => void;
}

export const DailyBalanceBanner: React.FC<DailyBalanceBannerProps> = ({
  mealSlots,
  onSelectMealTime,
  onNavigateToWeight,
}) => {
  const allMealKeys: MealTimeId[] = ['breakfast', 'lunch', 'snack', 'dinner'];

  const dailyStats = allMealKeys.reduce(
    (acc, key) => {
      const slot = mealSlots[key];
      const hasItems = slot.items.length > 0;
      const weight = slot.items.reduce((sum, item) => sum + item.food.servingSizeGrams * item.portions, 0);
      const kcal = slot.items.reduce(
        (sum, item) => sum + (item.food.per100g.energyKcal * (item.food.servingSizeGrams * item.portions)) / 100,
        0,
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
    },
  );

  const allFourMealsCompleted = dailyStats.completedCount === 4;

  return (
    <div className="mt-4 bg-gradient-to-r from-teal-900 via-teal-800 to-sky-900 dark:from-[#09152b] dark:via-[#0e2145] dark:to-[#0a1833] text-white rounded-3xl p-4 sm:p-5 border-2 border-teal-500/40 dark:border-blue-700/80 shadow-xl shadow-teal-950/20 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-teal-700/60 dark:border-blue-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-500 dark:bg-blue-600 text-white flex items-center justify-center shadow-md font-bold text-xl">
            ⚖️
          </div>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white font-display flex items-center gap-2 flex-wrap">
              <span>Consumo Total do Dia</span>
              <span className="text-xs font-extrabold text-teal-200 dark:text-blue-200 bg-teal-950/50 dark:bg-blue-900/60 px-2.5 py-0.5 rounded-full border border-teal-600/40">
                Balanço das 4 Refeições
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-teal-200 dark:text-blue-200 font-medium mt-0.5">
              Soma acumulada de massa e energia de todo o seu dia escolar
            </p>
          </div>
        </div>

        <div>
          {allFourMealsCompleted ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 rounded-2xl text-xs sm:text-sm font-black shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>🎉 4 de 4 Refeições Concluídas!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/20 border border-amber-400/50 text-amber-200 rounded-2xl text-xs sm:text-sm font-black shadow-xs">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{dailyStats.completedCount} de 4 Refeições Montadas</span>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-4">
        {/* Card 1: Peso Total */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xs rounded-2xl p-3.5 sm:p-4 border border-white/15 dark:border-blue-800/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-teal-200 dark:text-blue-200 uppercase tracking-tight">
            <span className="flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              Peso Total do Dia
            </span>
            <span className="text-xs font-mono text-teal-300">4 refeições</span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
              {dailyStats.totalGrams.toLocaleString('pt-BR')}
            </span>
            <span className="text-base font-bold text-teal-200">g</span>
            {dailyStats.totalGrams >= 1000 && (
              <span className="text-xs sm:text-sm font-mono font-bold text-teal-300 ml-1">
                ({(dailyStats.totalGrams / 1000).toFixed(2)} kg)
              </span>
            )}
          </div>
          <p className="text-xs text-teal-200/90 leading-relaxed font-medium">
            Massa de alimentos sólidos e bebidas consumidos hoje.
          </p>
        </div>

        {/* Card 2: Energia Total */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xs rounded-2xl p-3.5 sm:p-4 border border-white/15 dark:border-blue-800/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-amber-200 uppercase tracking-tight">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              Energia Total (Calorias)
            </span>
            <span className="text-xs font-mono text-amber-300">Meta: ~2.000 kcal</span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-amber-300 tracking-tight">
              {dailyStats.totalKcal.toLocaleString('pt-BR')}
            </span>
            <span className="text-base font-bold text-amber-200">kcal</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((dailyStats.totalKcal / 2000) * 100))}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-xs font-mono text-teal-200">
            <span>{Math.round((dailyStats.totalKcal / 2000) * 100)}% da meta</span>
            <span>{Math.max(0, 2000 - dailyStats.totalKcal)} kcal restantes</span>
          </div>
        </div>

        {/* Card 3: Composição */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xs rounded-2xl p-3.5 sm:p-4 border border-white/15 dark:border-blue-800/60 flex flex-col justify-between">
          <div className="text-xs sm:text-sm font-extrabold text-teal-200 dark:text-blue-200 uppercase tracking-tight mb-2">
            Composição das 4 Refeições
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
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
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                    st?.hasItems
                      ? 'bg-white/15 hover:bg-white/25 border-emerald-400/40 text-white'
                      : 'bg-black/20 hover:bg-black/30 border-white/10 text-white/50'
                  }`}
                  title={`Ver ou editar ${m.label}`}
                >
                  <span className="font-extrabold flex items-center gap-1.5">
                    <span>{m.icon}</span>
                    <span className="text-xs">{m.label}</span>
                  </span>
                  <span className="font-mono font-bold text-xs text-teal-200">
                    {st?.hasItems ? `${st.kcal} kcal` : '0 kcal'}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-teal-200/90 mt-2 text-center font-medium">
            Toque em uma refeição acima para inspecionar ou editar
          </p>
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="pt-3.5 border-t border-teal-700/60 dark:border-blue-800/80 flex flex-col sm:flex-row items-center justify-between gap-3.5">
        <div className="text-left leading-normal">
          <div className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
            {allFourMealsCompleted ? (
              <>
                <Sparkles className="w-4.5 h-4.5 text-amber-300 shrink-0" />
                <span>Pronto para o próximo passo! Todas as 4 refeições foram registradas.</span>
              </>
            ) : (
              <>
                <Info className="w-4.5 h-4.5 text-teal-300 shrink-0" />
                <span>
                  Faltam {4 - dailyStats.completedCount} refeição(ões) para o balanço energético completo do dia.
                </span>
              </>
            )}
          </div>
          <p className="text-xs sm:text-sm text-teal-200/95 font-medium mt-1">
            {allFourMealsCompleted ? (
              <>Clique no botão ao lado para avançar e investigar o impacto no peso corporal e IMC!</>
            ) : (
              <>Monte ao menos 1 alimento em cada refeição (Café, Almoço, Lanche e Jantar) para liberar o <strong>Passo 2</strong>.</>
            )}
          </p>
        </div>

        <button
          disabled={!allFourMealsCompleted}
          onClick={() => {
            if (!allFourMealsCompleted) return;
            playFanfare();
            try {
              confetti({
                particleCount: 65,
                spread: 70,
                origin: { y: 0.65 },
                colors: ['#0d9488', '#3b82f6', '#f59e0b', '#10b981'],
              });
            } catch { /* ignore */ }
            onNavigateToWeight?.();
          }}
          title={
            !allFourMealsCompleted
              ? `Bloqueado: Monte as 4 refeições para liberar (${dailyStats.completedCount}/4 concluídas)`
              : 'Avançar para o passo 2. Peso e Saúde'
          }
          className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shrink-0 ${
            allFourMealsCompleted
              ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 shadow-amber-950/20 scale-[1.02] hover:scale-105 border-2 border-white cursor-pointer'
              : 'bg-teal-950/50 border-2 border-teal-600/40 text-teal-200/60 cursor-not-allowed opacity-75'
          }`}
        >
          {allFourMealsCompleted ? (
            <>
              <span>🎉 Avançar para "2. Peso e Saúde"</span>
              <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              <Lock className="w-4.5 h-4.5 text-teal-300/80 shrink-0" />
              <span>Bloqueado: Monte as 4 Refeições ({dailyStats.completedCount}/4)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
