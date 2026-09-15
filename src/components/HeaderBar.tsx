import React from 'react';
import { Star, Award, Settings, Sparkles, Volume2, VolumeX, Trophy, User, Moon, Sun, LogOut } from 'lucide-react';
import { LearningBadge, StudentProfile } from '../types';
import { playClickSound, playStarSound } from '../utils/audio';

interface HeaderBarProps {
  progressPercentage: number;
  starsCount: number;
  badges: LearningBadge[];
  currentStudent?: StudentProfile | null;
  solvedMissionsCount?: number;
  totalMissionsCount?: number;
  onStartMission: () => void;
  onOpenExportModal: () => void;
  onOpenSettings: () => void;
  onOpenRank?: () => void;
  onOpenLoginModal?: () => void;
  onLogout?: () => void;
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
  solvedMissionsCount = 0,
  totalMissionsCount = 3,
  onStartMission,
  onOpenExportModal,
  onOpenSettings,
  onOpenRank,
  onOpenLoginModal,
  onLogout,
  isMuted,
  onToggleMute,
  theme = 'light',
  onToggleTheme,
}) => {
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;
  const solvedCount = currentStudent ? currentStudent.completedMissions : solvedMissionsCount;
  const progressPercent = totalMissionsCount > 0 ? Math.round((solvedCount / totalMissionsCount) * 100) : 0;

  return (
    <header className="w-full bg-transparent px-3 sm:px-6 py-2.5 z-30">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
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
                    width="40"
                    height="40"
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
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-teal-950 dark:text-teal-100 font-display flex items-center gap-1.5 leading-none">
                    Saúde em Prática
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-teal-900 dark:text-blue-300 tracking-tight mt-1">
                    Matemática, Alimentação e Movimento
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar Pill: "Seu progresso" (in place of speech bubble) */}
          <div className="flex items-center gap-3 bg-white/90 dark:bg-[#0f1b33]/90 border border-teal-200/80 dark:border-blue-700/80 px-4 py-2 rounded-2xl shadow-xs w-full sm:w-auto min-w-[220px] sm:min-w-[260px]">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-black text-teal-950 dark:text-blue-100 text-xs sm:text-sm">Seu progresso</span>
                <span className="font-bold text-teal-800 dark:text-blue-300 text-xs sm:text-sm">
                  {solvedCount} de {totalMissionsCount} missões
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 dark:from-blue-500 dark:via-sky-400 dark:to-blue-600 rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Mobile settings button */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {onToggleTheme && (
              <button
                onClick={() => {
                  playClickSound();
                  onToggleTheme();
                }}
                className="p-2.5 rounded-xl bg-white dark:bg-[#0f1b33] border border-slate-200 dark:border-blue-800 text-teal-700 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-blue-900/40 transition"
                title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-teal-700" />}
              </button>
            )}
            <button
              onClick={onToggleMute}
              className="p-2.5 rounded-xl bg-white dark:bg-[#0f1b33] border border-slate-200 dark:border-blue-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-blue-900/40 transition"
              title={isMuted ? 'Ativar som' : 'Desativar som'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-teal-600 dark:text-blue-400" />}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl bg-white dark:bg-[#0f1b33] border border-slate-200 dark:border-blue-800 text-teal-700 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-blue-900/40 transition"
              title="Configurações"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Gamification Badges, Ranking Button & Student Profile Pill */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end flex-wrap">
          {/* Ranking Button with Golden Trophy */}
          {onOpenRank && (
            <button
              onClick={() => {
                playStarSound();
                onOpenRank();
              }}
              className="p-2 sm:p-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 rounded-2xl shadow-sm border border-amber-300 transition cursor-pointer hover:scale-105 flex items-center justify-center"
              title="Abrir Ranking da Turma"
              aria-label="Abrir Ranking"
            >
              <Trophy className="w-5 h-5 fill-amber-950/20 text-amber-950" />
            </button>
          )}

          {/* Estrelas */}
          <div
            className="flex items-center gap-1.5 bg-white/95 dark:bg-[#0f1b33] border border-amber-300 dark:border-amber-500/50 text-amber-900 dark:text-amber-200 px-3 py-1.5 rounded-2xl shadow-xs"
            title={`${starsCount ?? 0} estrelas`}
          >
            <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-white shadow-xs">
              <Star className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="text-sm sm:text-base font-black">{starsCount ?? 0}</span>
          </div>

          {/* Medalhas */}
          <div
            className="flex items-center gap-1.5 bg-white/95 dark:bg-[#0f1b33] border border-amber-200 dark:border-blue-700/60 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-2xl shadow-xs"
            title={`${unlockedBadgesCount} medalhas`}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xs">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm sm:text-base font-black">{unlockedBadgesCount}</span>
          </div>

          {/* Student Profile Badge or Login Button */}
          {currentStudent ? (
            <div className="flex items-center gap-1.5 bg-white/95 dark:bg-[#0f1b33] border border-teal-200/90 dark:border-blue-700 hover:border-teal-400 dark:hover:border-blue-500 pl-2.5 pr-2 py-1.5 rounded-2xl shadow-xs transition group">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  if (onOpenLoginModal) onOpenLoginModal();
                  else onOpenSettings();
                }}
                className="flex items-center gap-2.5 text-left cursor-pointer transition"
                title="Clique para abrir perfil ou trocar de estudante"
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${currentStudent.avatarBg || 'from-sky-400 to-teal-500'} p-0.5 shadow-xs`}>
                  <div className="w-full h-full bg-white dark:bg-[#162544] rounded-full flex items-center justify-center text-base">
                    {currentStudent.avatarEmoji || '🧑‍🎓'}
                  </div>
                </div>
                <div className="flex flex-col text-left leading-tight max-w-[130px]">
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-blue-300 transition truncate">
                    {currentStudent.name}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-blue-300/80 truncate mt-0.5">
                    {currentStudent.grade}
                  </span>
                </div>
              </button>

              {/* Logout button */}
              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onLogout();
                  }}
                  className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer ml-1"
                  title={`Sair da conta de ${currentStudent.name} (Logout)`}
                  aria-label="Sair da conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onOpenLoginModal?.();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-xs border border-teal-400/40 transition cursor-pointer active:scale-95"
              title="Entrar ou cadastrar perfil de estudante"
            >
              <User className="w-4 h-4" />
              <span>Entrar como Aluno</span>
            </button>
          )}

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
        </div>

      </div>
    </header>
  );
};
