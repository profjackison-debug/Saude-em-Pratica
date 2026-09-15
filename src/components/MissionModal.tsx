import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Star, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MathChallenge, LearningBadge, AppScreenId, QuizQuestion, QuizOption } from '../types';
import { playClickSound, playStarSound, playFanfare } from '../utils/audio';

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const QUESTION_BADGE_MAP: Record<string, string> = {
  // Missão 1 (Refeições - 4 questões / 4 medalhas)
  'chal-1-q1': 'badge-investigacao',
  'chal-1-q2': 'badge-prato-verde',
  'chal-1-q3': 'badge-regra-tres',
  'chal-1-q4': 'badge-nutri-energia',
  'chal-1': 'badge-investigacao',

  // Missão 2 (IMC - 4 questões / 4 medalhas)
  'chal-2-q1': 'badge-grandezas-imc',
  'chal-2-q2': 'badge-potenciacao',
  'chal-2-q3': 'badge-divisao-decimal',
  'chal-2-q4': 'badge-colaboracao',
  'chal-2': 'badge-grandezas-imc',

  // Missão 3 (Movimento - 4 questões / 4 medalhas)
  'chal-3-q1': 'badge-participacao',
  'chal-3-q2': 'badge-estrategista-movimento',
  'chal-3-q3': 'badge-tempo-ativo',
  'chal-3-q4': 'badge-constancia-semanal',
  'chal-3': 'badge-participacao',
};

export interface QuizAnswerRecord {
  selectedOptionId: string;
  isCorrect: boolean;
}

export function getQuizAnswersStorageKey(studentId?: string | null): string {
  return studentId ? `saude_pratica_quiz_answers_student_${studentId}` : 'saude_pratica_quiz_answers_guest_v1';
}

export function loadQuizAnswersFromStorage(studentId?: string | null): Record<string, QuizAnswerRecord> {
  try {
    if (typeof window !== 'undefined') {
      const key = getQuizAnswersStorageKey(studentId);
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    }
  } catch {
    /* ignore */
  }
  return {};
}

export function saveQuizAnswersToStorage(answers: Record<string, QuizAnswerRecord>, studentId?: string | null): void {
  try {
    if (typeof window !== 'undefined') {
      const key = getQuizAnswersStorageKey(studentId);
      localStorage.setItem(key, JSON.stringify(answers));
    }
  } catch {
    /* ignore */
  }
}

interface MissionModalProps {
  challenges: MathChallenge[];
  initialChallengeIndex?: number;
  badges: LearningBadge[];
  solvedChallengeIds: string[];
  areAllFourMealsCompleted?: boolean;
  studentId?: string | null;
  onClose: () => void;
  onSolveChallenge: (challengeId: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onAwardQuestionStar?: (questionId: string, badgeId?: string) => void;
  onNavigateToScreen?: (screen: AppScreenId) => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  challenges,
  initialChallengeIndex = 0,
  badges,
  solvedChallengeIds,
  areAllFourMealsCompleted = false,
  studentId,
  onClose,
  onSolveChallenge,
  onUnlockBadge,
  onAwardQuestionStar,
  onNavigateToScreen,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialChallengeIndex);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, QuizAnswerRecord>>(() =>
    loadQuizAnswersFromStorage(studentId)
  );
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<Record<string, QuizOption[]>>({});
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCurrentIndex(initialChallengeIndex);
    const saved = loadQuizAnswersFromStorage(studentId);
    setUserAnswers(saved);

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

      // Abre na primeira pergunta pendente, ou na 0 se todas respondidas
      const firstUnansweredIdx = qList.findIndex((q) => !saved[q.id]);
      const targetIdx = firstUnansweredIdx >= 0 ? firstUnansweredIdx : 0;
      setCurrentQuestionIndex(targetIdx);

      const activeQ = qList[targetIdx];
      if (activeQ && saved[activeQ.id]) {
        setSelectedOptionId(saved[activeQ.id].selectedOptionId);
        setHasSubmitted(true);
      } else {
        setSelectedOptionId(null);
        setHasSubmitted(false);
      }

      // Embaralha as alternativas de todas as questões desta missão ao abrir
      const initialMap: Record<string, QuizOption[]> = {};
      qList.forEach((q) => {
        initialMap[q.id] = shuffleArray(q.options || []);
      });
      setShuffledOptionsMap(initialMap);
    }
  }, [initialChallengeIndex, challenges, studentId]);

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

  // Contadores de respostas e acertos reais
  const allCompleted = questions.every((q) => Boolean(userAnswers[q.id]));
  const answeredCount = questions.filter((q) => Boolean(userAnswers[q.id])).length;
  const correctCount = questions.filter((q) => userAnswers[q.id]?.isCorrect).length;

  const handleSubmitAnswer = () => {
    if (!selectedOption || hasSubmitted) return;
    setHasSubmitted(true);

    const isCorrect = Boolean(selectedOption.isCorrect);
    const updatedAnswers: Record<string, QuizAnswerRecord> = {
      ...userAnswers,
      [currentQuestion.id]: {
        selectedOptionId: selectedOption.id,
        isCorrect,
      },
    };
    setUserAnswers(updatedAnswers);
    saveQuizAnswersToStorage(updatedAnswers, studentId);

    if (isCorrect) {
      playStarSound();
      const targetBadgeId = QUESTION_BADGE_MAP[currentQuestion.id] || QUESTION_BADGE_MAP[currentChallenge.id];
      if (onAwardQuestionStar) {
        onAwardQuestionStar(currentQuestion.id, targetBadgeId);
      } else if (targetBadgeId) {
        onUnlockBadge(targetBadgeId);
      }
    } else {
      playClickSound();
    }

    // Se respondeu a todas as questões da missão (certas ou erradas), conclui o desafio da etapa
    const allNowCompleted = questions.every((q) => Boolean(updatedAnswers[q.id]));
    if (allNowCompleted && !isAlreadySolved) {
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
    }
  };

  const handleSelectQuestion = (idx: number) => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    playClickSound();
    setCurrentQuestionIndex(idx);
    const targetQ = questions[idx];
    const recorded = targetQ ? userAnswers[targetQ.id] : undefined;
    if (recorded) {
      setSelectedOptionId(recorded.selectedOptionId);
      setHasSubmitted(true);
    } else {
      setSelectedOptionId(null);
      setHasSubmitted(false);
      if (targetQ && targetQ.options?.length && !shuffledOptionsMap[targetQ.id]) {
        setShuffledOptionsMap((prev) => ({
          ...prev,
          [targetQ.id]: shuffleArray(targetQ.options),
        }));
      }
    }
  };

  const handleNextQuestion = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    playClickSound();

    // Avança para a próxima pergunta sequencial ou próxima não respondida
    let nextIdx = currentQuestionIndex + 1;
    if (nextIdx >= questions.length) {
      const firstUnanswered = questions.findIndex((q) => !userAnswers[q.id]);
      nextIdx = firstUnanswered >= 0 ? firstUnanswered : questions.length - 1;
    }

    handleSelectQuestion(nextIdx);
  };

  const handleCloseModal = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    playClickSound();
    const canAdvanceDirectly = currentIndex === 0 ? areAllFourMealsCompleted : true;
    if (allCompleted && canAdvanceDirectly) {
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

          {/* Stepper for questions (1, 2, 3, 4) com indicadores claros de acerto (✓) e erro (✗) */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/15 flex-wrap">
            <span className="text-[11px] text-teal-200 dark:text-blue-200 font-bold mr-0.5">
              Questões:
            </span>
            {questions.map((q, idx) => {
              const answer = userAnswers[q.id];
              const isAnswered = Boolean(answer);
              const isCorrect = answer?.isCorrect;
              const isCurrent = idx === currentQuestionIndex;

              let btnClass = 'bg-white/15 text-white/80 hover:bg-white/25 border-white/20';
              if (isCurrent) {
                btnClass =
                  'bg-white dark:bg-[#0f1b33] text-teal-950 dark:text-blue-100 border-white shadow-sm ring-2 ring-teal-300/60';
              } else if (isAnswered) {
                btnClass = isCorrect
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : 'bg-rose-500 text-white border-rose-400';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleSelectQuestion(idx)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${btnClass}`}
                  title={
                    isAnswered
                      ? `Pergunta ${idx + 1} (${isCorrect ? 'Correta ✓' : 'Incorreta ✗'})`
                      : `Ir para a Pergunta ${idx + 1}`
                  }
                >
                  {isAnswered ? (
                    isCorrect ? <span className="font-bold">✓</span> : <span className="font-bold">✗</span>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
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

          {/* Multiple Choice Options (Embaralhadas dinamicamente com letras A, B, C, D sequenciais) */}
          <div className="space-y-2 pt-1">
            {displayOptions.map((option, optIdx) => {
              const letter = OPTION_LETTERS[optIdx] ?? String.fromCharCode(65 + optIdx);
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
                      {letter}
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
                  : 'bg-rose-50/90 dark:bg-rose-950/70 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-100'
              } animate-in fade-in duration-200`}
            >
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm mb-1">
                {selectedOption.isCorrect ? (
                  allCompleted ? (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        Sensacional! Missão concluída com {correctCount} de {questions.length}{' '}
                        {correctCount === 1 ? 'acerto' : 'acertos'} (+{correctCount} ⭐)!
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        Resposta Correta! (+1 Estrela ⭐ e Medalha Conquistada 🏅) — Questão {currentQuestionIndex + 1} de {questions.length}
                      </span>
                    </>
                  )
                ) : (
                  allCompleted ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>
                        Resposta Incorreta. Missão finalizada com {correctCount} de {questions.length}{' '}
                        {correctCount === 1 ? 'acerto' : 'acertos'} ({correctCount} ⭐).
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>
                        Resposta Incorreta! Veja a explicação pedagógica e avance para a próxima pergunta:
                      </span>
                    </>
                  )
                )}
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {selectedOption.explanation}
              </p>

              {/* Action Inside Feedback */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-blue-900/60 flex items-center justify-between gap-2 flex-wrap">
                {allCompleted ? (
                  currentIndex === 0 && !areAllFourMealsCompleted ? (
                    <>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        Missão concluída! Monte as 4 refeições no Diário para liberar <strong>{nextScreen.name}</strong>
                      </span>
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
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <span>{nextScreen.icon}</span>
                        <span>Próxima etapa desbloqueada: <strong>{nextScreen.name}</strong></span>
                      </span>
                      <button
                        onClick={handleAdvanceToNextScreen}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer animate-pulse"
                      >
                        <span>Avançar para {nextScreen.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )
                ) : (
                  <>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {selectedOption.isCorrect
                        ? `Pergunta ${currentQuestionIndex + 1} acertada! Continue para somar pontos.`
                        : `Resposta registrada. Siga para a próxima pergunta para pontuar no Ranking!`}
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
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0b162b] border-t border-slate-200 dark:border-blue-900/80 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>
              {allCompleted
                ? `Missão concluída! ${correctCount} de ${questions.length} acertos (${correctCount} estrelas ⭐)`
                : `Progresso da Missão: ${answeredCount} de ${questions.length} respondidas (${correctCount} acerto${correctCount === 1 ? '' : 's'})`}
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
            ) : allCompleted ? (
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
                  <span>🎉 Concluir Missão & Avançar para {nextScreen.name}</span>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
