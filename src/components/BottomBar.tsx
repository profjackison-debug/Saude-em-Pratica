import React from 'react';
import { BookOpen, Users, Star, BarChart3, Play } from 'lucide-react';
import { CetiRobot } from './Illustrations';
import { playClickSound } from '../utils/audio';

interface BottomBarProps {
  onStartMission: () => void;
  onOpenCategory: (category: 'aprender' | 'colaborar' | 'conquistar' | 'evoluir') => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ onStartMission, onOpenCategory }) => {
  return (
    <div className="mt-4 w-full flex flex-col md:flex-row items-center justify-between gap-4 px-2">
      {/* Left: Mascot Robot CETi & Speech Bubble */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
        <div className="relative group cursor-pointer transition-transform hover:scale-105">
          <CetiRobot size={90} className="filter drop-shadow-md" />
        </div>

        {/* Speech Bubble */}
        <div className="relative bg-white/95 dark:bg-[#0f1b33]/95 border-2 border-teal-200/90 dark:border-blue-700 text-slate-800 dark:text-slate-100 px-4 py-2.5 rounded-2xl shadow-sm max-w-[220px] text-xs font-bold leading-snug transition-colors">
          {/* Bubble pointer tail */}
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-8 border-r-teal-200 dark:border-r-blue-700" />
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-5 border-t-transparent border-b-5 border-b-transparent border-r-7 border-r-white dark:border-r-[#0f1b33]" />
          <p className="text-teal-950 dark:text-blue-100 font-extrabold text-[12px]">
            Pequenas escolhas fazem grandes mudanças! 💙
          </p>
        </div>
      </div>

      {/* Center: Giant Green 3D "Começar missão" Button */}
      <div className="flex-1 max-w-md w-full flex justify-center">
        <button
          id="btn-main-start-mission"
          onClick={() => {
            playClickSound();
            onStartMission();
          }}
          className="group relative w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-lg sm:text-xl rounded-full shadow-lg shadow-teal-700/30 border-b-4 border-teal-800 hover:border-teal-900 active:translate-y-0.5 active:border-b-2 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
          </span>
          <span className="tracking-wide">Começar missão</span>
          {/* Sparkle effects */}
          <span className="text-amber-300 text-lg group-hover:rotate-12 transition-transform animate-pulse">
            ✨
          </span>
        </button>
      </div>

      {/* Right: 4 Category Circle Buttons + Yellow Sticky Note */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end flex-wrap">
        {/* 4 Circular Buttons */}
        <div className="flex items-center gap-3">
          {/* 1. Aprender (Purple) */}
          <button
            onClick={() => {
              playClickSound();
              onOpenCategory('aprender');
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Conceitos & Saberes"
          >
            <div className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md shadow-purple-600/30 border-2 border-purple-300 group-hover:scale-105 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-extrabold text-purple-900 dark:text-purple-300">Aprender</span>
          </button>

          {/* 2. Colaborar (Red/Coral) */}
          <button
            onClick={() => {
              playClickSound();
              onOpenCategory('colaborar');
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Trabalho em Equipe & Convivência"
          >
            <div className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-600/30 border-2 border-rose-300 group-hover:scale-105 transition">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-extrabold text-rose-900 dark:text-rose-300">Colaborar</span>
          </button>

          {/* 3. Conquistar (Gold/Amber) */}
          <button
            onClick={() => {
              playClickSound();
              onOpenCategory('conquistar');
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Estrelas & Conquistas"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-500/30 border-2 border-amber-200 group-hover:scale-105 transition">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <span className="text-[11px] font-extrabold text-amber-900 dark:text-amber-300">Conquistar</span>
          </button>

          {/* 4. Evoluir (Teal) */}
          <button
            onClick={() => {
              playClickSound();
              onOpenCategory('evoluir');
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Evolução & Gráficos"
          >
            <div className="w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-600/30 border-2 border-teal-300 group-hover:scale-105 transition">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-extrabold text-teal-900 dark:text-blue-300">Evoluir</span>
          </button>
        </div>

        {/* Yellow Sticky Note on far right */}
        <div className="relative bg-amber-100 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-700 px-3 py-2 rounded-xl shadow-xs rotate-2 hover:rotate-0 transition-transform">
          {/* Green leaf badge */}
          <div className="absolute -top-2 -right-1 text-emerald-600 dark:text-emerald-400 text-xs">🌱</div>
          <div className="text-[11px] font-black text-amber-950 dark:text-amber-200 leading-tight">
            Mais saúde,
            <br />
            mais futuro! 💚
          </div>
        </div>
      </div>
    </div>
  );
};
