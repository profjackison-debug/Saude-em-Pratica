import React, { useState } from 'react';
import { X, Star, Award, CheckCircle2, AlertCircle, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MathChallenge, LearningBadge, AppScreenId } from '../types';
import { playClickSound, playStarSound, playFanfare } from '../utils/audio';

interface MissionModalProps {
  challenges: MathChallenge[];
  initialChallengeIndex?: number;
  badges: LearningBadge[];
  solvedChallengeIds: string[];
  onClose: () => void;
  onSolveChallenge: (challengeId: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onNavigateToScreen?: (screen: AppScreenId) => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  challenges,
  initialChallengeIndex = 0,
  badges,
  solvedChallengeIds,
  onClose,
  onSolveChallenge,
  onUnlockBadge,
  onNavigateToScreen,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialChallengeIndex);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentChallenge = challenges[currentIndex];
  if (!currentChallenge) return null;
  const selectedOption = currentChallenge.options.find((o) => o.id === selectedOptionId);

  const getNextScreen = (index: number): { id: AppScreenId; name: string; icon: string } => {
    if (index === 0) {
      return { id: 'weight', name: '2. Peso e Saúde', icon: '⚖️' };
    }
    if (index === 1) {
      return { id: 'active_week', name: '3. Semana Ativa', icon: '🏃' };
    }
    return { id: 'ranking', name: '4. Ranking da Turma', icon: '🏆' };
  };

  const nextScreen = getNextScreen(currentIndex);

  const handleSelectOption = (id: string) => {
    if (hasSubmitted) return;
    playClickSound();
    setSelectedOptionId(id);
  };

  const isAlreadySolved = solvedChallengeIds.includes(currentChallenge.id);

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;
    setHasSubmitted(true);

    if (selectedOption.isCorrect && !isAlreadySolved) {
      playStarSound();
      onSolveChallenge(currentChallenge.id);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      // Check badge unlock
      if (currentChallenge.area === 'refeicoes') {
        onUnlockBadge('badge-investigacao');
      } else if (currentChallenge.area === 'movimento') {
        onUnlockBadge('badge-participacao');
      } else if (currentChallenge.area === 'imc') {
        onUnlockBadge('badge-colaboracao');
      }
    }
  };

  const handleAdvanceToNextScreen = () => {
    playFanfare();
    if (onNavigateToScreen) {
      onNavigateToScreen(nextScreen.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f1b33] rounded-3xl max-w-xl w-full border-4 border-teal-500 dark:border-blue-600 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/30 dark:bg-blue-500/30 border border-teal-300/40 dark:border-blue-300/40 flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-display tracking-wide">
                  Missão Matemática
                </h3>
                <span className="text-[10px] font-bold bg-teal-400 dark:bg-blue-400 text-teal-950 dark:text-blue-950 px-2 py-0.5 rounded-full uppercase">
                  Desafio {currentIndex + 1} de {challenges.length}
                </span>
              </div>
              <p className="text-xs text-teal-200 dark:text-blue-200 font-medium">
                {currentChallenge.title}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-white/20 text-teal-100 dark:text-blue-100 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Context box */}
          <div className="bg-teal-50/60 dark:bg-[#0b162b] border border-teal-200/80 dark:border-blue-800 rounded-2xl p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-blue-300 mb-1">
              Contexto Pedagógico
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {currentChallenge.context}
            </p>
          </div>

          {/* Question Text */}
          <div className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white leading-snug">
            {currentChallenge.question}
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2 pt-1">
            {currentChallenge.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              let optionClass =
                'border-slate-200 dark:border-blue-900/80 bg-white dark:bg-[#132240] hover:border-teal-300 dark:hover:border-blue-500 text-slate-800 dark:text-slate-200';

              if (hasSubmitted) {
                if (option.isCorrect) {
                  optionClass =
                    'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-400/30';
                } else if (isSelected && !option.isCorrect) {
                  optionClass =
                    'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 font-medium line-through';
                }
              } else if (isSelected) {
                optionClass =
                  'border-teal-600 dark:border-blue-400 bg-teal-50/80 dark:bg-blue-950/80 text-teal-950 dark:text-blue-100 font-bold ring-2 ring-teal-400/30 dark:ring-blue-400/30';
              }

              return (
                <button
                  key={option.id}
                  disabled={hasSubmitted}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full text-left p-3 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-3 text-xs sm:text-sm ${optionClass}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-[#0b162b] flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs uppercase shrink-0">
                      {option.id}
                    </span>
                    <span>{option.text}</span>
                  </div>
                  {hasSubmitted && option.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {hasSubmitted && isSelected && !option.isCorrect && (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result Feedback Banner */}
          {hasSubmitted && selectedOption && (
            <div
              className={`p-3.5 rounded-2xl border ${
                selectedOption.isCorrect
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100'
                  : 'bg-amber-50/90 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100'
              } animate-in fade-in duration-200`}
            >
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm mb-1">
                {selectedOption.isCorrect ? (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Excelente raciocínio matemático! (+1 Estrela ⭐️)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Quase lá! Veja a explicação:</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {selectedOption.explanation}
              </p>

              {/* Direct Navigation Button to the Challenge's Screen */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-blue-900/60 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>{targetScreen.icon}</span>
                  <span>Aplicar na tela: <strong>{targetScreen.name}</strong></span>
                </span>
                <button
                  onClick={handleGoToTargetScreen}
                  className="bg-teal-700 dark:bg-blue-600 hover:bg-teal-800 dark:hover:bg-blue-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Abrir Tela {targetScreen.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0b162b] border-t border-slate-200 dark:border-blue-900/80 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>Recompensa: 1 Estrela e Progresso</span>
          </div>

          <div className="flex items-center gap-2">
            {!hasSubmitted ? (
              <button
                disabled={!selectedOptionId}
                onClick={handleSubmitAnswer}
                className="game-button-teal text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                Confirmar Resposta
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {currentIndex < challenges.length - 1 ? (
                  <>
                    <button
                      onClick={handleGoToTargetScreen}
                      className="bg-white dark:bg-[#132240] hover:bg-teal-50 dark:hover:bg-[#1b2f56] border border-teal-300 dark:border-blue-700 text-teal-800 dark:text-blue-200 font-bold text-xs px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
                      title={`Ir agora para ${targetScreen.name}`}
                    >
                      <span>Ir para Tela</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleNextChallenge}
                      className="game-button-teal text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Próximo Desafio</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleGoToTargetScreen}
                    className="game-button-teal text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Concluir e Ir para {targetScreen.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
