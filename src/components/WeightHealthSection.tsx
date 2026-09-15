import React, { useState } from 'react';
import { Scale, Heart, Info, X, CheckCircle2, BookOpen, ArrowRight, Sparkles, Lock } from 'lucide-react';
import {
  Calculator3D,
  MeasuringTapeGraphic,
  SpiralNotepadGraphic,
} from './Illustrations';
import physicalActivityPhoto from '../assets/atividade_fisica_jovens.jpg';
import { playClickSound, playFanfare } from '../utils/audio';

interface WeightHealthSectionProps {
  onChallengeClick: () => void;
  isFocusedView?: boolean;
  onCloseFocus?: () => void;
  consumedKcal?: number;
  consumedGrams?: number;
  isQuizSolved?: boolean;
  onNavigateToNext?: () => void;
}

export interface BmiCategory {
  id: string;
  rangeLabel: string;
  classification: string;
  min: number;
  max: number;
  badgeBg: string;
  activeRowBg: string;
  borderActive: string;
  textBadge: string;
  icon: string;
  explanation: string;
}

export const BMI_REFERENCE_TABLE: BmiCategory[] = [
  {
    id: 'underweight',
    rangeLabel: 'Menor que 18,5',
    classification: 'Baixo peso',
    min: 0,
    max: 18.5,
    badgeBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    activeRowBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200',
    borderActive: 'border-l-4 border-l-amber-500 bg-amber-50/90 dark:bg-amber-950/50',
    textBadge: 'text-amber-700 dark:text-amber-400',
    icon: '⚠️',
    explanation: 'Abaixo da faixa esperada para adultos. É importante garantir nutrientes e energia adequados.',
  },
  {
    id: 'normal',
    rangeLabel: '18,5 a menos de 25,0',
    classification: 'Faixa adequada / Eutrofia',
    min: 18.5,
    max: 25.0,
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
    activeRowBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200',
    borderActive: 'border-l-4 border-l-emerald-500 bg-emerald-100/90 dark:bg-emerald-950/60 font-bold',
    textBadge: 'text-emerald-700 dark:text-emerald-400',
    icon: '✅',
    explanation: 'Proporção equilibrada entre massa e estatura segundo os padrões do Ministério da Saúde.',
  },
  {
    id: 'overweight',
    rangeLabel: '25,0 a menos de 30,0',
    classification: 'Sobrepeso',
    min: 25.0,
    max: 30.0,
    badgeBg: 'bg-orange-100 dark:bg-orange-950/80 text-orange-950 dark:text-orange-200 border-orange-300 dark:border-orange-700',
    activeRowBg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200',
    borderActive: 'border-l-4 border-l-orange-500 bg-orange-50/90 dark:bg-orange-950/50',
    textBadge: 'text-orange-700 dark:text-orange-400',
    icon: '📊',
    explanation: 'Massa corporal um pouco acima da média. Hábitos ativos e alimentação colorida auxiliam o equilíbrio.',
  },
  {
    id: 'obesity1',
    rangeLabel: '30,0 a menos de 35,0',
    classification: 'Obesidade grau I',
    min: 30.0,
    max: 35.0,
    badgeBg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-700',
    activeRowBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200',
    borderActive: 'border-l-4 border-l-rose-500 bg-rose-50/90 dark:bg-rose-950/50',
    textBadge: 'text-rose-700 dark:text-rose-400',
    icon: '🩺',
    explanation: 'Primeiro nível epidemiológico que recomenda acompanhamento integral de saúde e bem-estar.',
  },
  {
    id: 'obesity2',
    rangeLabel: '35,0 a menos de 40,0',
    classification: 'Obesidade grau II',
    min: 35.0,
    max: 40.0,
    badgeBg: 'bg-rose-200 dark:bg-rose-900/80 text-rose-950 dark:text-rose-100 border-rose-400 dark:border-rose-600',
    activeRowBg: 'bg-rose-100 dark:bg-rose-900/40 text-rose-950 dark:text-rose-100',
    borderActive: 'border-l-4 border-l-rose-600 bg-rose-100/90 dark:bg-rose-900/50',
    textBadge: 'text-rose-800 dark:text-rose-300',
    icon: '🩺',
    explanation: 'Nível intermediário de alerta que requer atenção interdisciplinar para saúde metabólica.',
  },
  {
    id: 'obesity3',
    rangeLabel: '40,0 ou mais',
    classification: 'Obesidade grau III',
    min: 40.0,
    max: Infinity,
    badgeBg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-700',
    activeRowBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200',
    borderActive: 'border-l-4 border-l-purple-600 bg-purple-100/90 dark:bg-purple-950/50',
    textBadge: 'text-purple-800 dark:text-purple-300',
    icon: '🏥',
    explanation: 'Nível que requer acompanhamento especializado contínuo e planos de cuidado multiprofissional.',
  },
];

export function getBmiCategory(rawBmi: number): BmiCategory {
  if (rawBmi < 18.5) return BMI_REFERENCE_TABLE[0]!;
  if (rawBmi < 25.0) return BMI_REFERENCE_TABLE[1]!;
  if (rawBmi < 30.0) return BMI_REFERENCE_TABLE[2]!;
  if (rawBmi < 35.0) return BMI_REFERENCE_TABLE[3]!;
  if (rawBmi < 40.0) return BMI_REFERENCE_TABLE[4]!;
  return BMI_REFERENCE_TABLE[5]!;
}

// Sub-component: Ministry of Health Reference Table
interface ReferenceTableProps {
  currentCategoryId: string;
}

export const MinistryOfHealthTable: React.FC<ReferenceTableProps> = ({ currentCategoryId }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <span className="text-base sm:text-lg">📖</span>
        <div>
          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-display">
            Tabela de Referência para Adultos
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
            Referência epidemiológica do Ministério da Saúde para adultos de 20 a 59 anos (fora do período gestacional).
          </p>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-blue-800/80 rounded-2xl overflow-hidden bg-white dark:bg-[#0c1830] shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#0f1f3d] border-b border-slate-200 dark:border-blue-800/80 text-xs font-bold text-slate-800 dark:text-slate-200">
              <th className="py-2.5 px-3">Faixa de IMC (kg/m²)</th>
              <th className="py-2.5 px-3">Classificação do Ministério da Saúde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-blue-900/50 text-xs sm:text-sm">
            {BMI_REFERENCE_TABLE.map((item) => {
              const isSelected = item.id === currentCategoryId;
              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    isSelected
                      ? `${item.borderActive} font-black`
                      : 'hover:bg-slate-50/80 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono">
                    <div className="flex items-center gap-1.5">
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      )}
                      <span>{item.rangeLabel}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-between gap-1">
                      <span>{item.classification}</span>
                      {isSelected && (
                        <span className="text-xs font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs shrink-0">
                          Sua Faixa
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-slate-500 dark:text-slate-400 italic leading-snug">
        A classificação é obtida usando o valor exato contínuo do IMC antes de qualquer arredondamento de exibição.
      </p>
    </div>
  );
};

export const WeightHealthSection: React.FC<WeightHealthSectionProps> = ({
  onChallengeClick,
  isFocusedView = false,
  onCloseFocus,
  consumedKcal,
  consumedGrams,
  isQuizSolved = false,
  onNavigateToNext,
}) => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [massKg, setMassKg] = useState<number>(65);
  const [heightM, setHeightM] = useState<number>(1.65);

  const exactBmi = heightM > 0 ? massKg / (heightM * heightM) : 0;
  const heightSquared = Number((heightM * heightM).toFixed(4));
  const calculatedBMI = Number(exactBmi.toFixed(1));
  const currentCategory = getBmiCategory(exactBmi);

  const handleMassInput = (val: number) => {
    if (isNaN(val)) return;
    setMassKg(Math.max(20, Math.min(200, val)));
  };

  const handleHeightInput = (val: number) => {
    if (isNaN(val)) return;
    setHeightM(Math.max(1.0, Math.min(2.3, val)));
  };

  return (
    <section className={`bg-white/95 dark:bg-[#0f1b33]/95 rounded-3xl p-4 sm:p-5 border-2 border-teal-200/90 dark:border-blue-800 shadow-lg shadow-teal-900/5 dark:shadow-black/40 flex flex-col justify-between relative overflow-hidden transition-colors ${
      isFocusedView ? 'max-w-5xl mx-auto w-full' : 'h-full'
    }`}>
      {/* Header: "2. Peso e Saúde" */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 dark:bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 border-2 border-white dark:border-blue-500">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-none">
                2. Peso e Saúde
              </h2>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                Investigue grandezas, calcule seu IMC e veja sua classificação
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

        {/* Consumed Food Banner from Meal Diary */}
        {consumedKcal !== undefined && consumedKcal > 0 && (
          <div className="mb-3.5 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-blue-950/60 dark:to-teal-950/50 border border-teal-200 dark:border-blue-800 rounded-2xl p-3 flex items-center justify-between gap-2.5 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🥗</span>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-teal-800 dark:text-blue-300">
                  Energia Ingerida no Diário de Hoje
                </div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-bold mt-0.5">
                  {consumedGrams?.toLocaleString('pt-BR')}g consumidos • <span className="text-emerald-700 dark:text-emerald-400 font-black">{consumedKcal.toLocaleString('pt-BR')} kcal</span>
                </div>
              </div>
            </div>
            <div className="text-xs font-bold text-teal-700 dark:text-blue-300 bg-teal-100/70 dark:bg-blue-900/60 px-2.5 py-1 rounded-xl hidden sm:block">
              Ingestão vs Gasto Energético
            </div>
          </div>
        )}

        {/* Content Container: If focused view, display side-by-side or stacked on mobile */}
        <div className={isFocusedView ? 'grid grid-cols-1 lg:grid-cols-12 gap-5 items-start' : 'space-y-3'}>
          {/* Left Column in Focused (or Full in Sidebar) */}
          <div className={isFocusedView ? 'lg:col-span-6 space-y-3' : 'space-y-3'}>
            {/* Diverse Students Physical Activity Photo with Floating Badge */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-teal-100 dark:border-blue-900/80 shadow-md group">
              <img
                src={physicalActivityPhoto}
                alt="Jovens de diferentes gêneros praticando atividade física com alegria e bem-estar"
                className="w-full h-48 sm:h-56 md:h-64 object-cover object-[center_35%] transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10 pointer-events-none" />

              {/* Floating Badge: "Saúde vai além de um número!" */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-[#0f1b33]/95 backdrop-blur-xs border border-rose-200 dark:border-blue-700 text-slate-900 dark:text-blue-100 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                <span className="text-sm">❤️</span>
                <span className="text-xs sm:text-sm font-black tracking-tight text-teal-950 dark:text-blue-200">
                  Saúde vai além de um número!
                </span>
              </div>
            </div>

            {/* Formula Card */}
            <div className="bg-slate-50/90 dark:bg-[#132240] border-2 border-slate-200/90 dark:border-blue-800/80 rounded-2xl p-3.5 text-center shadow-xs">
              <div className="font-mono text-sm sm:text-base font-black text-indigo-950 dark:text-sky-300">
                IMC = massa (kg) ÷ [altura (m)]²
              </div>
              <div className="text-xs sm:text-sm font-mono font-bold text-sky-700 dark:text-sky-300 mt-1">
                {massKg} kg ÷ ({heightM.toFixed(2)} m)² = {calculatedBMI} kg/m²
              </div>
            </div>

            {/* Data input controls for the student */}
            <div className="bg-sky-50/70 dark:bg-[#0d1b34] border-2 border-sky-200 dark:border-blue-800/80 rounded-2xl p-3.5 sm:p-4 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-sky-200/80 dark:border-blue-800/80">
                <span className="text-xs sm:text-sm font-black uppercase text-sky-950 dark:text-sky-200 flex items-center gap-2">
                  <span>✍️</span> Seus Dados de Medição
                </span>
                <span className="text-xs font-bold text-sky-800 dark:text-sky-300 bg-sky-200/60 dark:bg-sky-900/60 px-2.5 py-0.5 rounded-md">
                  Digite ou deslize
                </span>
              </div>

              {/* Mass (kg) */}
              <div className="bg-white dark:bg-[#132240] p-3 rounded-xl border border-sky-100 dark:border-blue-800/80 shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <span>Massa / Peso:</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="30"
                      max="180"
                      step="0.5"
                      value={massKg}
                      onChange={(e) => handleMassInput(parseFloat(e.target.value))}
                      className="w-22 px-2.5 py-1 text-right font-mono font-black text-sm sm:text-base text-sky-900 dark:text-sky-200 bg-sky-50 dark:bg-blue-950/80 border border-sky-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="text-xs sm:text-sm font-black text-slate-500">kg</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="35"
                  max="140"
                  step="0.5"
                  value={massKg}
                  onChange={(e) => setMassKg(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              {/* Height (m) */}
              <div className="bg-white dark:bg-[#132240] p-3 rounded-xl border border-sky-100 dark:border-blue-800/80 shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <span>Estatura / Altura:</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1.20"
                      max="2.15"
                      step="0.01"
                      value={heightM}
                      onChange={(e) => handleHeightInput(parseFloat(e.target.value))}
                      className="w-22 px-2.5 py-1 text-right font-mono font-black text-sm sm:text-base text-sky-900 dark:text-sky-200 bg-sky-50 dark:bg-blue-950/80 border border-sky-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="text-xs sm:text-sm font-black text-slate-500">m</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1.30"
                  max="2.05"
                  step="0.01"
                  value={heightM}
                  onChange={(e) => setHeightM(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Student Classification Card */}
            <div className={`p-4 rounded-2xl border-2 shadow-xs transition-all ${currentCategory.badgeBg}`}>
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{currentCategory.icon}</span>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider opacity-80">
                      Sua Classificação (Ministério da Saúde)
                    </div>
                    <div className="text-base sm:text-lg font-black tracking-tight">
                      {currentCategory.classification}
                    </div>
                  </div>
                </div>
                <div className="bg-white/90 dark:bg-black/40 px-3.5 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-right">
                  <div className="text-xs font-bold opacity-75">IMC do Aluno</div>
                  <div className="text-base sm:text-lg font-mono font-black">
                    {calculatedBMI} <span className="text-xs font-normal">kg/m²</span>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed opacity-95">
                {currentCategory.explanation}
              </p>
            </div>

            {/* In sidebar mode, show button to view full Ministry of Health table */}
            {!isFocusedView && (
              <button
                onClick={() => {
                  playClickSound();
                  setIsCalculatorOpen(true);
                }}
                className="w-full py-2 px-3 bg-teal-50 dark:bg-blue-950/60 hover:bg-teal-100 dark:hover:bg-blue-900/60 border border-teal-200 dark:border-blue-800 text-teal-900 dark:text-blue-200 text-xs font-bold rounded-xl flex items-center justify-between transition cursor-pointer"
              >
                <span>Ver Tabela de Referência Completa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Bottom Tools Row: 3D Calculator, Measuring Tape, Spiral Notepad */}
            <div className="grid grid-cols-3 gap-2 items-center justify-items-center pt-2 border-t border-slate-100 dark:border-blue-900/60">
              <button
                onClick={() => {
                  playClickSound();
                  setIsCalculatorOpen(true);
                }}
                className="flex flex-col items-center group cursor-pointer hover:scale-105 transition"
                title="Abrir Calculadora de Grandezas"
              >
                <Calculator3D size={56} className="filter drop-shadow-sm group-hover:drop-shadow-md" />
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setIsCalculatorOpen(true);
                }}
                className="flex flex-col items-center group cursor-pointer hover:scale-105 transition"
                title="Explorar relação quadrática da altura"
              >
                <MeasuringTapeGraphic size={52} className="filter drop-shadow-sm group-hover:drop-shadow-md" />
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onChallengeClick();
                }}
                className="flex flex-col items-center group cursor-pointer hover:scale-105 transition"
                title="Ver checklist e desafios matemáticos"
              >
                <SpiralNotepadGraphic size={86} className="filter drop-shadow-sm group-hover:drop-shadow-md" />
              </button>
            </div>
          </div>

          {/* Right Column (Only in Focused View): Full Ministry of Health Table + Pedagogical Reflection */}
          {isFocusedView && (
            <div className="lg:col-span-6 bg-slate-50/70 dark:bg-[#0d1b34] border-2 border-slate-200 dark:border-blue-800 rounded-3xl p-4 sm:p-5 flex flex-col space-y-3">
              {/* Reference Table Component */}
              <MinistryOfHealthTable currentCategoryId={currentCategory.id} />

              {/* Formula Step-by-Step Educational Box */}
              <div className="p-3.5 bg-white dark:bg-[#132240] border border-slate-200 dark:border-blue-800/80 rounded-2xl shadow-2xs space-y-2">
                <div className="text-xs sm:text-sm font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Passo a Passo do Seu Cálculo:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div className="p-2.5 bg-slate-50 dark:bg-blue-950/40 rounded-xl border border-slate-100 dark:border-blue-900/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">1. Altura ao Quadrado</span>
                    <span className="font-mono font-extrabold text-sky-800 dark:text-sky-300 text-xs sm:text-sm">
                      {heightM.toFixed(2)} × {heightM.toFixed(2)} = {heightSquared} m²
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-blue-950/40 rounded-xl border border-slate-100 dark:border-blue-900/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">2. Divisão da Massa</span>
                    <span className="font-mono font-extrabold text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm">
                      {massKg} ÷ {heightSquared} = {calculatedBMI}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pedagogical Notice */}
              <div className="p-3 bg-amber-50/90 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 rounded-2xl flex items-start gap-2.5 text-amber-950 dark:text-amber-200 text-xs leading-relaxed">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Nota Pedagógica:</strong> A tabela acima representa o padrão populacional do Ministério da Saúde para adultos. Para crianças e adolescentes em fase de crescimento e puberdade, os profissionais de saúde utilizam curvas de percentis de crescimento da OMS (Z-score), avaliando o desenvolvimento individual com respeito à diversidade corporal.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Modal for BMI and Mathematical Grandezas */}
      {isCalculatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white dark:bg-[#0f1b33] rounded-3xl max-w-xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 dark:border-blue-700">
            {/* Modal Header */}
            <div className="bg-sky-600 dark:bg-sky-700 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black">Investigação do IMC & Classificação</h3>
                  <p className="text-xs text-sky-100">Ministério da Saúde • Relação entre Grandezas</p>
                </div>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setIsCalculatorOpen(false);
                }}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-[#0b162b] p-3.5 rounded-2xl border border-slate-200 dark:border-blue-900/80">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Massa (kg)</span>
                    <span className="font-mono text-sky-700 dark:text-sky-300 font-black">{massKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="140"
                    step="0.5"
                    value={massKg}
                    onChange={(e) => setMassKg(Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Altura (m)</span>
                    <span className="font-mono text-sky-700 dark:text-sky-300 font-black">{heightM.toFixed(2)} m</span>
                  </div>
                  <input
                    type="range"
                    min="1.30"
                    max="2.05"
                    step="0.01"
                    value={heightM}
                    onChange={(e) => setHeightM(Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>
              </div>

              {/* Student Classification Banner in Modal */}
              <div className={`p-4 rounded-2xl border-2 shadow-xs ${currentCategory.badgeBg}`}>
                <div className="flex items-center justify-between gap-2.5 mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{currentCategory.icon}</span>
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider opacity-80">
                        Classificação do Aluno
                      </div>
                      <div className="text-base sm:text-lg font-black">
                        {currentCategory.classification}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 dark:bg-black/40 px-3.5 py-1.5 rounded-xl text-right">
                    <div className="text-xs font-bold opacity-75">IMC Calculado</div>
                    <div className="text-base sm:text-lg font-mono font-black">
                      {calculatedBMI} kg/m²
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed opacity-95">
                  {currentCategory.explanation}
                </p>
              </div>

              {/* Reference Table in Modal */}
              <MinistryOfHealthTable currentCategoryId={currentCategory.id} />

              {/* Ethical Pedagogy Notice */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 rounded-2xl flex items-start gap-2 text-amber-900 dark:text-amber-200 text-xs">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Observação Curricular: </span>
                  O IMC é uma ferramenta epidemiológica de grandezas proporcionais. Em crianças e adolescentes, avalia-se o crescimento por curvas de percentis da OMS.
                </div>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  setIsCalculatorOpen(false);
                }}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition"
              >
                Concluir Investigação
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
