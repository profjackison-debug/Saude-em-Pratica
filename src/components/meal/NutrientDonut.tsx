import React from 'react';

interface NutrientDonutProps {
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  totalFiber: number;
  mealTotalGrams: number;
}

export const NutrientDonut: React.FC<NutrientDonutProps> = ({
  totalCarbs,
  totalProtein,
  totalFat,
  totalFiber,
  mealTotalGrams,
}) => {
  const rawSum = totalCarbs + totalProtein + totalFat + totalFiber;
  const hasMacros = rawSum > 0 && mealTotalGrams > 0;
  const macroSum = hasMacros ? rawSum : 1;
  const carbPct = hasMacros ? Math.round((totalCarbs / macroSum) * 100) : 0;
  const proteinPct = hasMacros ? Math.round((totalProtein / macroSum) * 100) : 0;
  const fatPct = hasMacros ? Math.round((totalFat / macroSum) * 100) : 0;
  const fiberPct = hasMacros ? Math.max(0, 100 - carbPct - proteinPct - fatPct) : 0;

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

  return (
    <div className="lg:col-span-3 bg-slate-50/90 dark:bg-[#0b162b]/90 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-blue-900/80 flex flex-col justify-between transition-colors">
      <div>
        <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-blue-100 mb-1 uppercase tracking-wide">
          Distribuição da refeição
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-3">
          Proporção de macronutrientes no prato montado
        </p>

        {/* SVG Donut Chart */}
        <div className="flex justify-center my-3 relative">
          <svg width="120" height="120" viewBox="0 0 100 100" className="rotate-[-90deg]">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#E2E8F0" className="dark:stroke-slate-700" strokeWidth="14" />
            {hasMacros && (
              <>
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#3B82F6" strokeWidth="14" strokeDasharray={`${strokeCarb} ${circumference}`} strokeDashoffset={offsetCarb} />
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#22C55E" strokeWidth="14" strokeDasharray={`${strokeProt} ${circumference}`} strokeDashoffset={offsetProt} />
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#F97316" strokeWidth="14" strokeDasharray={`${strokeFat} ${circumference}`} strokeDashoffset={offsetFat} />
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#A855F7" strokeWidth="14" strokeDasharray={`${strokeFiber} ${circumference}`} strokeDashoffset={offsetFiber} />
              </>
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">{mealTotalGrams}g</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">peso total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs sm:text-sm">
          {[
            { label: 'Carboidratos', pct: carbPct, color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400' },
            { label: 'Proteínas', pct: proteinPct, color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' },
            { label: 'Gorduras', pct: fatPct, color: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400' },
            { label: 'Fibras', pct: fiberPct, color: 'bg-purple-500', textColor: 'text-purple-600 dark:text-purple-400' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-1.5 bg-white dark:bg-[#132240] rounded-xl border border-slate-100 dark:border-blue-900/80">
              <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                <span className={`w-3 h-3 rounded-full ${item.color}`} />
                {item.label}
              </span>
              <span className={`font-mono font-black ${item.textColor}`}>{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reference */}
      <div className="mt-3.5 pt-2 border-t border-slate-200 dark:border-blue-900/60 text-center">
        <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 block">
          Guia Alimentar para a População Brasileira
        </span>
      </div>
    </div>
  );
};
