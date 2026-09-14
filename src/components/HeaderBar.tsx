import React from 'react';
import { Star, Award, Settings, Sparkles, Volume2, VolumeX, Camera, Trophy, User, Moon, Sun } from 'lucide-react';
import { LearningBadge, StudentProfile } from '../types';
import { playClickSound, playStarSound } from '../utils/audio';

interface HeaderBarProps {
  progressPercentage: number;
  starsCount: number;
  badges: LearningBadge[];
  currentStudent?: StudentProfile;
  onStartMission: () => void;
  onOpenExportModal: () => void;
  onOpenSettings: () => void;
  onOpenRank?: () => void;
  onOpenLoginModal?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  progressPercentage,
  starsCount,
  badges,
  currentStudent,
  onStartMission,
  onOpenExportModal,
  onOpenSettings,
  onOpenRank,
  onOpenLoginModal,
  isMuted,
  onToggleMute,
  theme = 'light',
  onToggleTheme,
}) => {
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <header className="w-full bg-transparent px-3 sm:px-6 py-2.5 z-30">
      <div className="max-w-[1750px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Logo with Leaves & Speech Bubble */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2">
            {/* Logo Graphic with 2 Sprouting Green Leaves */}
            <div className="relative flex items-center">
              {/* Sprouting Green Leaves on the 'S' */}
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  {/* Two Leaves SVG */}
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="filter drop-shadow-xs"
                  >
                    <path
                      d="M10 24 C8 12 18 4 28 6 C30 18 20 26 10 24Z"
                      fill="#22C55E"
                      stroke="#16A34A"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M20 28 C26 18 36 14 38 22 C34 32 24 32 20 28Z"
                      fill="#15803D"
                    />
                    <path
                      d="M12 24 Q20 22 28 6"
                      stroke="#DCFCE7"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-teal-950 dark:text-teal-100 font-display flex items-center gap-1.5 leading-none">
                    Saúde em Prática
                  </h1>
                  <p className="text-[11px] sm:text-xs font-bold text-teal-900 dark:text-blue-300 tracking-tight mt-0.5">
                    Matemática, Alimentação e Movimento
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Speech Bubble: "Conhecimento hoje, mais saúde amanhã!" */}
          <div className="hidden sm:flex relative bg-white/95 dark:bg-[#0f1b33] border border-teal-200/90 dark:border-blue-700/80 text-teal-950 dark:text-blue-100 px-3 py-1.5 rounded-2xl shadow-xs text-xs font-bold items-center leading-snug">
            {/* Pointer tail */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-6 border-r-teal-200 dark:border-r-blue-700" />
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-3 border-t-transparent border-b-3 border-b-transparent border-r-5 border-r-white dark:border-r-[#0f1b33]" />
            <span className="text-[11px] font-extrabold text-teal-900 dark:text-blue-200">
              Conhecimento hoje, mais saúde amanhã!
            </span>
          </div>

          {/* Mobile settings button */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {onToggleTheme && (
              <button
                onClick={() => {
                  playClickSound();
                  onToggleTheme();
                }}
                className="p-2 rounded-xl bg-white dark:bg-[#0f1b33] border border-slate-200 dark:border-blue-800 text-teal-700 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-blue-900/40 transition"
                title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-700" />}
              </button>
            )}
            <button
              onClick={onToggleMute}
              className="p-2 rounded-xl bg-white dark:bg-[#0f1b33] border border-slate-200 dark:border-blue-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-blue-900/40 transition"
              title={isMuted ? 'Ativar som' : 'Desativar som'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-teal-600 dark:text-blue-400" />}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-white dark:bg-[#0f1b33] border border-slate-200 dark:border-blue-800 text-teal-700 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-blue-900/40 transition"
              title="Configurações"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: "Seu progresso" (Green Progress Bar Pill) */}
        <div className="flex items-center gap-3 bg-white/90 dark:bg-[#0f1b33]/90 border border-teal-200/80 dark:border-blue-700/80 px-4 py-1.5 rounded-2xl shadow-xs w-full lg:w-auto min-w-[280px]">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-extrabold text-teal-950 dark:text-blue-100 text-[11px]">Seu progresso</span>
              <span className="font-bold text-teal-800 dark:text-blue-300 text-[10px]">3 de 4 missões</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 dark:from-blue-500 dark:via-sky-400 dark:to-blue-600 rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${Math.max(15, progressPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Gamification Badges, Ranking Button & Student Profile Pill */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end flex-wrap">
          {/* Ranking Button with Golden Trophy */}
          {onOpenRank && (
            <button
              onClick={() => {
                playStarSound();
                onOpenRank();
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black px-3 py-1.5 rounded-2xl shadow-sm border border-amber-300 transition cursor-pointer hover:scale-102"
              title="Abrir Ranking e Hall da Fama da Turma"
            >
              <Trophy className="w-4 h-4 fill-amber-950/20 text-amber-950" />
              <span className="text-xs">Ranking</span>
            </button>
          )}

          {/* 12 estrelas */}
          <div className="flex items-center gap-1.5 bg-white/95 dark:bg-[#0f1b33] border border-amber-300 dark:border-amber-500/50 text-amber-900 dark:text-amber-200 px-3 py-1.5 rounded-2xl shadow-xs">
            <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-white shadow-xs">
              <Star className="w-3.5 h-3.5 fill-white text-white" />
            </div>
            <span className="text-xs font-black">{starsCount || 12}</span>
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">estrelas</span>
          </div>

          {/* 4 medalhas */}
          <div className="flex items-center gap-1.5 bg-white/95 dark:bg-[#0f1b33] border border-amber-200 dark:border-blue-700/60 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-2xl shadow-xs">
            <div className="w-5 h-5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xs">
              <Award className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-black">{unlockedBadgesCount || 4}</span>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">medalhas</span>
          </div>

          {/* Student Profile Badge */}
          <div
            onClick={() => {
              playClickSound();
              if (onOpenLoginModal) {
                onOpenLoginModal();
              } else {
                onOpenSettings();
              }
            }}
            className="flex items-center gap-2 bg-white/95 dark:bg-[#0f1b33] border border-teal-200/90 dark:border-blue-700 hover:border-teal-400 dark:hover:border-blue-500 px-2.5 py-1 rounded-2xl shadow-xs cursor-pointer transition group"
            title="Clique para abrir perfil, trocar de estudante ou ver conquistas"
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${currentStudent?.avatarBg || 'from-sky-400 to-teal-500'} p-0.5 shadow-xs`}>
              <div className="w-full h-full bg-white dark:bg-[#162544] rounded-full flex items-center justify-center text-sm">
                {currentStudent?.avatarEmoji || '🧑‍🎓'}
              </div>
            </div>
            <div className="flex flex-col text-left leading-tight max-w-[130px]">
              <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-blue-300 transition truncate">
                {currentStudent?.name || 'Estudante'}
              </span>
              <span className="text-[9.5px] font-bold text-slate-500 dark:text-blue-300/80 truncate">
                {currentStudent?.grade || '8º Ano A'}
              </span>
            </div>
            {/* User switch indicator */}
            <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-blue-300 transition-all ml-0.5" />
          </div>

          {/* Dark / Light Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={() => {
                playClickSound();
                onToggleTheme();
              }}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-[#0f1b33] border border-teal-200 dark:border-blue-700 text-teal-800 dark:text-blue-200 hover:bg-teal-50 dark:hover:bg-blue-900/40 transition shadow-xs cursor-pointer"
              title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro (Modo Noturno Azul)'}
              aria-label="Alternar tema de cores"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-300" />
                  <span className="hidden xl:inline text-xs font-bold text-amber-300">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-teal-700 animate-in spin-in-90 duration-300" />
                  <span className="hidden xl:inline text-xs font-bold text-teal-900">Escuro</span>
                </>
              )}
            </button>
          )}

          {/* Settings button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-white dark:bg-[#0f1b33] border border-slate-200 dark:border-blue-700 text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-blue-200 hover:bg-slate-50 dark:hover:bg-blue-900/40 transition shadow-xs cursor-pointer"
            title="Configurações gerais e som"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Export 16:9 Image Shortcut Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenExportModal();
            }}
            className="hidden xl:flex items-center gap-1 p-2 rounded-xl bg-white dark:bg-[#0f1b33] border border-teal-200 dark:border-blue-700 text-teal-700 dark:text-blue-300 hover:bg-teal-50 dark:hover:bg-blue-900/40 transition shadow-xs cursor-pointer"
            title="Exportar imagem da interface (16:9)"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
