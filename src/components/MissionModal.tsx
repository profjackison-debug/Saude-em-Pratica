import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Star, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MathChallenge, LearningBadge, AppScreenId, QuizQuestion, QuizOption } from '../types';
import { playClickSound, playStarSound, playFanfare } from '../utils/audio';

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

interface MissionModalProps {
  challenges: MathChallenge[];
  initialChallengeIndex?: number;
  badges: LearningBadge[];
  solvedChallengeIds: string[];
  areAllFourMealsCompleted?: boolean;
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
  areAllFourMealsCompleted = false,
  onClose,
  onSolveChallenge,
  onUnlockBadge,
  onNavigateToScreen,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialChallengeIndex);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Record<string, boolean>>({});
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<Record<string, QuizOption[]>>({});
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCurrentIndex(initialChallengeIndex);
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);

    // Embaralha as alternativas de todas as questões desta missão ao abrir
    const targetChallenge = challenges[initialChallengeIndex];
    if (targetChallenge) {
      const qList: QuizQuestion[] =
        targetChallenge.questions && targetChallenge.questions.length > 0
          ? targetChallenge.questions
          : [
              {
                id: targetChallenge.id,
                title: targetChallenge.title,
                question: targetChallenge.question || '',
                context: targetChallenge.context || '',
                options: targetChallenge.options || [],
              },
            ];
      const initialMap: Record<string, QuizOption[]> = {};
      qList.forEach((q) => {
        initialMap[q.id] = shuffleArray(q.options || []);
      });
      setShuffledOptionsMap(initialMap);
    }
  }, [initialChallengeIndex, challenges]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  const currentChallenge = challenges[currentIndex];
  if (!currentChallenge) return null;

  const questions: QuizQuestion[] =
    currentChallenge.questions && currentChallenge.questions.length > 0
      ? currentChallenge.questions
      : [
          {
            id: currentChallenge.id,
            title: currentChallenge.title,
            question: currentChallenge.question || '',
            context: currentChallenge.context || '',
            options: currentChallenge.options || [],
          },
        ];

  const currentQuestion = questions[currentQuestionIndex] || questions[0]!;

  // Alternativas embaralhadas para a questão atual
  const displayOptions: QuizOption[] = useMemo(() => {
    if (shuffledOptionsMap[currentQuestion.id]) {
      return shuffledOptionsMap[currentQuestion.id];
    }
    return currentQuestion.options || [];
  }, [shuffledOptionsMap, currentQuestion]);

  useEffect(() => {
    if (currentQuestion && !shuffledOptionsMap[currentQuestion.id] && currentQuestion.options?.length) {
      setShuffledOptionsMap((prev) => ({
        ...prev,
        [currentQuestion.id]: shuffleArray(currentQuestion.options),
      }));
    }
  }, [currentQuestion, shuffledOptionsMap]);

  const selectedOption =
    displayOptions.find((o) => o.id === selectedOptionId) ||
    (hasSubmitted ? displayOptions.find((o) => o.isCorrect) : undefined);

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
  const isAlreadySolved = solvedChallengeIds.includes(currentChallenge.id);

  const handleSelectOption = (id: string) => {
    if (hasSubmitted) return;
    playClickSound();
    setSelectedOptionId(id);
  };

  const handleAdvanceToNextScreen = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    playFanfare();
    if (onNavigateToScreen) {
      onNavigateToScreen(nextScreen.id);
    }
    onClose();
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allCompleted = questions.every((q) => answeredQuestionIds[q.id]);

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;
    setHasSubmitted(true);

    if (selectedOption.isCorrect) {
      playStarSound();
      const updatedAnswered = { ...answeredQuestionIds, [currentQuestion.id]: true };
      setAnsweredQuestionIds(updatedAnswered);

      const allNowCompleted = questions.every((q) => updatedAnswered[q.id]);

      if (allNowCompleted) {
        if (!isAlreadySolved) {
          onSolveChallenge(currentChallenge.id);

          try {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {
            // ignore
          }

          if (currentChallenge.area === 'refeicoes') {
            onUnlockBadge('badge-investigacao');
          } else if (currentChallenge.area === 'movimento') {
            onUnlockBadge('badge-participacao');
          } else if (currentChallenge.area === 'imc') {
            onUnlockBadge('badge-colaboracao');
          }
        }

        const canAdvanceDirectly = currentIndex === 0 ? areAllFourMealsCompleted : true;
        if (canAdvanceDirectly) {
          if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
          advanceTimerRef.current = setTimeout(() => {
            handleAdvanceToNextScreen();
          }, 2200);
        }
      }
    }
  };

  const handleNextQuestion = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    playClickSound();
    const nextIdx = Math.min(questions.length - 1, currentQuestionIndex + 1);
    setCurrentQuestionIndex(nextIdx);
    const isNextDone = Boolean(answeredQuestionIds[questions[nextIdx]?.id ?? '']);
    setSelectedOptionId(null);
    setHasSubmitted(isNextDone);
  };

  const handleCloseModal = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    playClickSound();
    const canAdvanceDirectly = currentIndex === 0 ? areAllFourMealsCompleted : true;
    if (hasSubmitted && selectedOption?.isCorrect && allCompleted && canAdvanceDirectly) {
      handleAdvanceToNextScreen();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#0f1b33] rounded-3xl max-w-xl w-full border-4 border-teal-500 dark:border-blue-600 shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 text-white p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/30 dark:bg-blue-500/30 border border-teal-300/40 dark:border-blue-300/40 flex items-center justify-center text-xl">
                🎯
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black font-display tracking-wide">
                    {currentChallenge.title}
                  </h3>
                  <span className="text-[10px] font-bold bg-teal-400 dark:bg-blue-400 text-teal-950 dark:text-blue-950 px-2 py-0.5 rounded-full uppercase">
                    Etapa {currentIndex + 1} de {challenges.length}
                  </span>
                </div>
                <p className="text-xs text-teal-200 dark:text-blue-200 font-medium">
                  {currentQuestion.title || `Pergunta ${currentQuestionIndex + 1}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="p-1.5 rounded-xl hover:bg-white/20 text-teal-100 dark:text-blue-100 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper for questions (1, 2, 3, 4) */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/15 flex-wrap">
            <span className="text-[11px] text-teal-200 dark:text-blue-200 font-bold mr-0.5">
              Questões:
            </span>
            {questions.map((q, idx) => {
              const isDone = Boolean(answeredQuestionIds[q.id]);
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
                    playClickSound();
                    setCurrentQuestionIndex(idx);
                    setSelectedOptionId(null);
                    setHasSubmitted(isDone);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${
                    isCurrent
                      ? 'bg-white dark:bg-[#0f1b33] text-teal-950 dark:text-blue-100 border-white shadow-sm ring-2 ring-teal-300/60'
                      : isDone
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : 'bg-white/15 text-white/80 hover:bg-white/25 border-white/20'
                  }`}
                  title={`Ir para a Pergunta ${idx + 1}`}
                >
                  {isDone ? <span className="font-bold">✓</span> : <span>{idx + 1}</span>}
                  <span>P{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-3.5 max-h-[72vh] overflow-y-auto">
          {/* Context box */}
          <div className="bg-teal-50/60 dark:bg-[#0b162b] border border-teal-200/80 dark:border-blue-800 rounded-2xl p-3 sm:p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-blue-300 mb-1">
              Contexto Pedagógico • {currentQuestion.title || `Pergunta ${currentQuestionIndex + 1}`}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {currentQuestion.context}
            </p>
          </div>

          {/* Question Text */}
          <div className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white leading-snug">
            {currentQuestion.question}
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2 pt-1">
            {currentQuestion.options.map((option) => {
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
                  allCompleted ? (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Sensacional! Você concluiu as {questions.length} perguntas da missão! (+1 Estrela ⭐️)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Resposta Correta! ({currentQuestionIndex + 1} de {questions.length})</span>
                    </>
                  )
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Quase lá! Veja a explicação pedagógica:</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {selectedOption.explanation}
              </p>

              {/* Action Inside Feedback */}
              {selectedOption.isCorrect && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-blue-900/60 flex items-center justify-between gap-2 flex-wrap">
                  {allCompleted ? (
                    <>
                      <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <span>{nextScreen.icon}</span>
                        {currentIndex === 0 && !areAllFourMealsCompleted ? (
                          <span>Missão concluída! Monte as 4 refeições no Diário para liberar <strong>{nextScreen.name}</strong></span>
                        ) : (
                          <span>Próxima etapa desbloqueada: <strong>{nextScreen.name}</strong></span>
                        )}
                      </span>
                      {currentIndex === 0 && !areAllFourMealsCompleted ? (
                        <button
                          onClick={() => {
                            playClickSound();
                            onClose();
                          }}
                          className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <span>🍽️ Ir para o Diário</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={handleAdvanceToNextScreen}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer animate-pulse"
                        >
                          <span>Avançar para {nextScreen.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                        Pergunta {currentQuestionIndex + 1} concluída! Continue para finalizar a missão.
                      </span>
                      <button
                        onClick={handleNextQuestion}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <span>Próxima Pergunta ({currentQuestionIndex + 2}/{questions.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0b162b] border-t border-slate-200 dark:border-blue-900/80 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>
              {allCompleted
                ? 'Missão 100% concluída! Recompensa liberada.'
                : `Progresso da Missão: ${Object.keys(answeredQuestionIds).length} de ${questions.length} respondidas`}
            </span>
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
            ) : selectedOption?.isCorrect ? (
              allCompleted ? (
                currentIndex === 0 && !areAllFourMealsCompleted ? (
                  <button
                    onClick={() => {
                      playClickSound();
                      onClose();
                    }}
                    className="game-button-teal text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>🍽️ Missão Concluída! Montar as 4 Refeições</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleAdvanceToNextScreen}
                    className="game-button-teal text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md animate-pulse"
                  >
                    <span>🎉 Avançar para {nextScreen.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="game-button-teal text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Próxima Pergunta ({currentQuestionIndex + 2}/{questions.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )
            ) : (
              <button
                onClick={() => {
                  playClickSound();
                  setHasSubmitted(false);
                  setSelectedOptionId(null);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Tentar Novamente</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
