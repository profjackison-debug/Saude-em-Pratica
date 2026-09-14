import React from 'react';
import { X, Volume2, VolumeX, Camera, User, Sparkles, Award, Trophy, UserCheck, Moon, Sun } from 'lucide-react';
import { playClickSound, playStarSound } from '../utils/audio';
import { StudentProfile } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenExportModal: () => void;
  starsCount: number;
  currentStudent?: StudentProfile;
  onOpenLoginModal?: () => void;
  onOpenRank?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  isMuted,
  onToggleMute,
  onOpenExportModal,
  starsCount,
  currentStudent,
  onOpenLoginModal,
  onOpenRank,
  theme = 'light',
  onToggleTheme,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0f1b33] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-blue-800">
        {/* Header */}
        <div className="bg-teal-700 dark:bg-blue-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black">Perfil do Estudante</h3>
              <p className="text-xs text-teal-100 dark:text-blue-200">Configurações & Conquistas</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-slate-800 dark:text-slate-100">
          {/* Avatar card with Edit/Switch button */}
          <div className="p-4 bg-teal-50/70 dark:bg-[#132240] border border-teal-200 dark:border-blue-700/80 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${currentStudent?.avatarBg || 'from-teal-500 to-sky-400'} p-0.5 shadow-md flex items-center justify-center text-2xl`}>
                {currentStudent?.avatarEmoji || '🧑‍🎓'}
              </div>
              <div>
                <h4 className="text-base font-black text-teal-950 dark:text-blue-100">
                  {currentStudent?.name || 'Estudante Explorador'}
                </h4>
                <p className="text-xs text-teal-700 dark:text-blue-300 font-medium">
                  {currentStudent?.grade || '8º Ano A'} • {currentStudent?.school || 'CETi Central'}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{starsCount} estrelas acumuladas</span>
                </div>
              </div>
            </div>

            {onOpenLoginModal && (
              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                  onOpenLoginModal();
                }}
                className="p-2 rounded-xl bg-white dark:bg-[#1b2f56] hover:bg-teal-100 dark:hover:bg-blue-900/50 text-teal-800 dark:text-blue-200 border border-teal-300 dark:border-blue-600 text-xs font-bold transition cursor-pointer flex flex-col items-center gap-0.5"
                title="Trocar de estudante ou editar perfil"
              >
                <UserCheck className="w-4 h-4" />
                <span className="text-[10px]">Trocar</span>
              </button>
            )}
          </div>

          {/* Direct Ranking Shortcut */}
          {onOpenRank && (
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-50 to-amber-100/60 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-300 dark:border-amber-700/60 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-black text-amber-950 dark:text-amber-200">Ranking da Turma</div>
                  <div className="text-xs text-amber-800 dark:text-amber-300/80 font-medium">Veja sua posição e o pódio dos alunos</div>
                </div>
              </div>
              <button
                onClick={() => {
                  playStarSound();
                  onClose();
                  onOpenRank();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition cursor-pointer"
              >
                Ver Rank
              </button>
            </div>
          )}

          {/* Theme Mode Toggle (Light / Dark) */}
          {onToggleTheme && (
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-[#132240] border border-slate-200 dark:border-blue-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#1b2f56] flex items-center justify-center text-slate-700 dark:text-amber-400">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Tema da Interface</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {theme === 'dark' ? 'Modo Escuro Azul Marinho' : 'Modo Claro clássico'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  onToggleTheme();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                  theme === 'dark'
                    ? 'bg-blue-700 text-blue-100 border-blue-600'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {theme === 'dark' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-blue-300" />
                    <span>Escuro</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Claro</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-[#132240] border border-slate-200 dark:border-blue-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#1b2f56] flex items-center justify-center text-slate-700 dark:text-blue-300">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-teal-600 dark:text-blue-400" />}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Efeitos Sonoros</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Áudios educativos de clique e acerto</div>
              </div>
            </div>
            <button
              onClick={() => {
                playClickSound();
                onToggleMute();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                !isMuted
                  ? 'bg-teal-600 dark:bg-blue-600 text-white border-teal-700 dark:border-blue-700'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
              }`}
            >
              {!isMuted ? 'Ligado' : 'Mudo'}
            </button>
          </div>

          {/* Export 16:9 Image */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-[#132240] border border-slate-200 dark:border-blue-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#1b2f56] flex items-center justify-center text-teal-700 dark:text-blue-300">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Imagem da Interface (16:9)</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Visualizar ou baixar renderização PNG</div>
              </div>
            </div>
            <button
              onClick={() => {
                playClickSound();
                onClose();
                onOpenExportModal();
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 dark:bg-blue-950/60 hover:bg-teal-100 dark:hover:bg-blue-900/60 text-teal-800 dark:text-blue-200 border border-teal-200 dark:border-blue-700 transition cursor-pointer"
            >
              Abrir
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-full py-2.5 bg-slate-100 dark:bg-[#132240] hover:bg-slate-200 dark:hover:bg-[#1b2f56] text-slate-700 dark:text-slate-200 font-bold text-sm rounded-xl transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

