import React, { useState } from 'react';
import { Activity, Clock, Dumbbell, Check, Plus, X, Sparkles, CheckCircle2 } from 'lucide-react';
import inclusiveMovementPhoto from '../assets/movimento_inclusivo_jovens.jpg';
import { playClickSound } from '../utils/audio';

interface ActiveWeekSectionProps {
  onChallengeClick?: () => void;
  isFocusedView?: boolean;
  onCloseFocus?: () => void;
  isQuizSolved?: boolean;
  onNavigateToNext?: () => void;
}

interface DayActivity {
  id: string;
  shortDay: string;
  iconEmoji: string;
  iconBg: string;
  minutes: number;
  isStrengthening: boolean;
  name: string;
}

export const ActiveWeekSection: React.FC<ActiveWeekSectionProps> = ({
  onChallengeClick,
  isFocusedView = false,
  onCloseFocus,
  isQuizSolved = false,
  onNavigateToNext,
}) => {
  const [days, setDays] = useState<DayActivity[]>([
    { id: 'seg', shortDay: 'Seg', iconEmoji: '🚶‍♂️', iconBg: 'text-sky-600', minutes: 30, isStrengthening: false, name: 'Caminhada escolar' },
    { id: 'ter', shortDay: 'Ter', iconEmoji: '🚴‍♀️', iconBg: 'text-emerald-600', minutes: 45, isStrengthening: false, name: 'Pedalada no parque' },
    { id: 'qua', shortDay: 'Qua', iconEmoji: '🏋️‍♂️', iconBg: 'text-emerald-700', minutes: 30, isStrengthening: true, name: 'Treino funcional' },
    { id: 'qui', shortDay: 'Qui', iconEmoji: '🏃‍♀️', iconBg: 'text-purple-600', minutes: 40, isStrengthening: false, name: 'Corrida e ritmo' },
    { id: 'sex', shortDay: 'Sex', iconEmoji: '⚽', iconBg: 'text-emerald-600', minutes: 60, isStrengthening: false, name: 'Futsal na quadra' },
    { id: 'sab', shortDay: 'Sáb', iconEmoji: '♿', iconBg: 'text-sky-600', minutes: 30, isStrengthening: true, name: 'Basquete adaptado' },
    { id: 'dom', shortDay: 'Dom', iconEmoji: '🌳', iconBg: 'text-emerald-700', minutes: 45, isStrengthening: false, name: 'Passeio em família' },
  ]);

  const [selectedDay, setSelectedDay] = useState<DayActivity | null>(null);

  // Metrics
  const totalMinutes = days.reduce((sum, d) => sum + d.minutes, 0);
  const dailyAverage = Math.round(totalMinutes / days.length);
  const strengtheningDaysCount = days.filter((d) => d.isStrengthening).length;

  const handleUpdateMinutes = (dayId: string, newMinutes: number) => {
    setDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, minutes: Math.max(0, newMinutes) } : d))
    );
  };

  return (
    <section className={`bg-white/95 dark:bg-[#0f1b33]/95 rounded-3xl p-4 sm:p-5 border-2 border-teal-200/90 dark:border-blue-800 shadow-lg shadow-teal-900/5 dark:shadow-black/40 flex flex-col justify-between relative overflow-hidden transition-colors ${
      isFocusedView ? 'max-w-4xl mx-auto w-full' : 'h-full'
    }`}>
      <div>
        {/* Header: "3. Semana Ativa" */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 dark:bg-blue-600 text-white flex items-center justify-center shadow-md shadow-teal-700/20 border-2 border-white dark:border-blue-500">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-none">
                3. Semana Ativa
              </h2>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                Movimento também conta!
              </p>
            </div>
          </div>

          {isFocusedView && onCloseFocus && (
            <button
              onClick={onCloseFocus}
              className="text-xs font-bold text-teal-800 dark:text-blue-200 bg-teal-50 dark:bg-blue-950/60 hover:bg-teal-100 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-blue-800 transition cursor-pointer"
            >
              ← Voltar à Visão Geral
            </button>
          )}
        </div>

        {/* 7 Days Calendar Row (Seg, Ter, Qua, Qui, Sex, Sáb, Dom) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3">
          {days.map((day) => (
            <div
              key={day.id}
              onClick={() => {
                playClickSound();
                setSelectedDay(day);
              }}
              className="bg-slate-50 dark:bg-[#132240] hover:bg-teal-50 dark:hover:bg-[#1b2f56] border border-slate-200 dark:border-blue-900/80 hover:border-teal-300 dark:hover:border-blue-500 rounded-xl p-1.5 sm:p-2 flex flex-col items-center justify-between text-center transition cursor-pointer shadow-xs group"
              title={`${day.shortDay}: ${day.name} (${day.minutes} min)`}
            >
              {/* Day Name */}
              <span className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-200">
                {day.shortDay}
              </span>

              {/* Activity Icon */}
              <span className="text-lg sm:text-xl my-1 group-hover:scale-110 transition-transform">
                {day.iconEmoji}
              </span>

              {/* Green Checkmark Badge */}
              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center my-0.5 shadow-xs">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>

              {/* Minutes */}
              <span className="text-[9.5px] sm:text-[11px] font-extrabold text-slate-800 dark:text-slate-100 font-mono">
                {day.minutes}m
              </span>
            </div>
          ))}
        </div>

        {/* Two Statistics Pills: Média diária & Dias de fortalecimento */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Média diária */}
          <div className="bg-sky-50 dark:bg-[#0d1b34] border border-sky-200 dark:border-blue-900/80 rounded-2xl p-2.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-sky-200/80 dark:bg-blue-900/60 flex items-center justify-center text-sky-800 dark:text-blue-200 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Média diária</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-teal-900 dark:text-blue-200 font-mono">
                  {dailyAverage}
                </span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">minutos</span>
              </div>
            </div>
          </div>

          {/* Dias de fortalecimento */}
          <div className="bg-emerald-50 dark:bg-[#0d1b34] border border-emerald-200 dark:border-blue-900/80 rounded-2xl p-2.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-200/80 dark:bg-blue-900/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shrink-0">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Dias de fortalecimento</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-emerald-900 dark:text-emerald-300 font-mono">
                  {strengtheningDaysCount}
                </span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">dias</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mathematical Breakdown when in Focused View */}
        {isFocusedView && (
          <div className="mb-3 p-3 bg-teal-50/80 dark:bg-[#0d1b34] border border-teal-200 dark:border-blue-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧮</span>
              <div>
                <span className="font-black text-teal-950 dark:text-blue-100 block">
                  Cálculo Curricular da Média Aritmética Semanal:
                </span>
                <span className="font-mono text-teal-800 dark:text-blue-300 font-bold">
                  Soma Total ({totalMinutes} min) ÷ 7 dias = {dailyAverage} minutos/dia
                </span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#132240] border border-teal-300 dark:border-blue-700 px-3 py-1 rounded-xl font-bold text-teal-900 dark:text-blue-200 text-xs">
              Meta OMS: ≥ 60 min/dia
            </div>
          </div>
        )}

        {/* Diverse Inclusive Youth Moving in Park Real Photo */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200/80 dark:border-blue-900/80 shadow-md">
          <img
            src={inclusiveMovementPhoto}
            alt="Jovens brasileiros diversos praticando atividades físicas inclusivas no parque"
            className="w-full h-48 sm:h-60 md:h-72 object-cover object-[center_40%]"
            loading="eager"
          />
        </div>

        {/* Step 3 -> Step 4 Advance Action Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-teal-900 via-emerald-950 to-blue-950 text-white flex flex-col sm:flex-row items-center justify-between gap-3 border-2 border-teal-500/40 shadow-md">
          <div className="text-left">
            <div className="text-xs sm:text-sm font-black flex items-center gap-2">
              {isQuizSolved ? (
                <>
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>Desafio de Movimento Concluído! Ranking Desbloqueado.</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-amber-300 shrink-0" />
                  <span>Etapa 3 em andamento: responda à Missão de Movimento para avançar!</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm text-teal-200 mt-0.5">
              {isQuizSolved
                ? 'Você completou a jornada de desafios! Veja suas conquistas e estrelas no Ranking da Turma pelas abas no topo.'
                : 'Aperte no botão "Começar missão" para responder ao quiz da média ativa e liberar o Ranking!'}
            </p>
          </div>

          {isQuizSolved ? (
            <div className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Etapa 3 Concluída</span>
            </div>
          ) : (
            <div className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-teal-950/70 border border-teal-500/40 text-teal-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <span>Quiz Pendente</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Activity Day Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0f1b33] rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-blue-700">
            <div className="bg-teal-700 dark:bg-blue-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedDay.iconEmoji}</span>
                <div>
                  <h3 className="text-base font-black">{selectedDay.shortDay}: {selectedDay.name}</h3>
                  <p className="text-xs text-teal-100">Registro de Movimento Saudável</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-1 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-[#0b162b] p-3 rounded-xl border border-slate-200 dark:border-blue-900/80">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tempo ativo:</span>
                <span className="text-sm font-black font-mono text-teal-800 dark:text-blue-300">
                  {selectedDay.minutes} minutos
                </span>
              </div>

              {/* Slider to adjust */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Ajustar minutos da atividade:
                </label>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={selectedDay.minutes}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    handleUpdateMinutes(selectedDay.id, val);
                    setSelectedDay({ ...selectedDay, minutes: val });
                  }}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-[11px] text-emerald-900 dark:text-emerald-200">
                <span className="font-black">Princípio de Ouro: </span>
                O movimento é para convivência, vitalidade e alegria — sem compensação alimentar!
              </div>

              <button
                onClick={() => setSelectedDay(null)}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
