import React, { useState, useEffect } from 'react';
import { useGame } from './context/GameContext';
import { HeaderBar } from './components/HeaderBar';
import { MealDiarySection } from './components/MealDiarySection';
import { WeightHealthSection } from './components/WeightHealthSection';
import { ActiveWeekSection } from './components/ActiveWeekSection';
import { BottomBar } from './components/BottomBar';
import { MissionModal } from './components/MissionModal';
import { ExportImageModal } from './components/ExportImageModal';
import { CategoryInfoModal } from './components/CategoryInfoModal';
import { SettingsModal } from './components/SettingsModal';
import { StudentLoginModal } from './components/StudentLoginModal';
import { RankingSection } from './components/RankingSection';
import { FoodItem, MealTimeId, StudentProfile } from './types';
import { MATH_CHALLENGES } from './data/tacoData';
import { playClickSound, playStarSound } from './utils/audio';

export default function App() {
  const { state, dispatch } = useGame();
  const {
    activeScreen,
    currentStudent,
    guestStarsCount,
    mealSlots,
    activeMealId,
    badges,
    progressPercentage,
    solvedChallengeIds,
    theme,
    isMuted,
  } = state;

  // ---- Local UI-only state (modals) ----
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [initialChallengeIdx, setInitialChallengeIdx] = useState(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeCategoryModal, setActiveCategoryModal] = useState<
    'aprender' | 'colaborar' | 'conquistar' | 'evoluir' | null
  >(null);

  // ---- Handlers → dispatch actions (no nested setters, no race conditions) ----
  const handleAddFoodToMeal = (food: FoodItem) => {
    dispatch({ type: 'ADD_FOOD', food });
  };

  const handleAdjustPortion = (foodId: string, delta: number) => {
    dispatch({ type: 'ADJUST_PORTION', foodId, delta });
  };

  const handleRemoveFood = (foodId: string) => {
    dispatch({ type: 'REMOVE_FOOD', foodId });
  };

  const handleResetMeal = () => {
    dispatch({ type: 'RESET_MEAL' });
  };

  const handleLoadMealTemplate = (
    mealId: MealTimeId,
    templateFoods: { foodId: string; portions: number }[],
  ) => {
    dispatch({ type: 'LOAD_MEAL_TEMPLATE', mealId, foods: templateFoods });
  };

  const handleStartMission = (challengeIndex = 0) => {
    setInitialChallengeIdx(challengeIndex);
    setIsMissionModalOpen(true);
  };

  const handleAwardQuestionStar = (questionId: string, badgeId?: string) => {
    dispatch({ type: 'AWARD_QUESTION_STAR', questionId, badgeId });
  };

  // Atomic — updates student stars, score, missions, and solvedIds in a single dispatch
  const handleSolveChallenge = (challengeId: string) => {
    dispatch({ type: 'SOLVE_CHALLENGE', challengeId });
  };

  const handleUnlockBadge = (badgeId: string) => {
    dispatch({ type: 'UNLOCK_BADGE', badgeId });
  };

  const handleLoginStudent = (student: StudentProfile) => {
    dispatch({ type: 'LOGIN_STUDENT', student });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT_STUDENT' });
  };

  const handleToggleMute = () => {
    dispatch({ type: 'TOGGLE_MUTE' });
  };

  const handleToggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setActiveScreen = (screen: typeof activeScreen) => {
    dispatch({ type: 'SET_ACTIVE_SCREEN', screen });
  };

  const setActiveMealId = (mealId: MealTimeId) => {
    dispatch({ type: 'SET_ACTIVE_MEAL', mealId });
  };

  // ---- Computed values ----
  const slotsList = Object.values(mealSlots);
  const totalDailyKcal = slotsList.reduce(
    (sum, slot) =>
      sum +
      Math.round(
        slot.items.reduce(
          (mSum, item) =>
            mSum + (item.food.per100g.energyKcal * (item.food.servingSizeGrams * item.portions)) / 100,
          0,
        ),
      ),
    0,
  );

  const totalDailyGrams = slotsList.reduce(
    (sum, slot) =>
      sum +
      slot.items.reduce((mSum, item) => mSum + item.food.servingSizeGrams * item.portions, 0),
    0,
  );

  const completedMealsCount = (['breakfast', 'lunch', 'snack', 'dinner'] as MealTimeId[]).filter(
    (id) => (mealSlots[id]?.items?.length ?? 0) > 0,
  ).length;
  const areAllFourMealsCompleted = completedMealsCount === 4;

  // Quiz completion per stage
  const isStep1QuizSolved = solvedChallengeIds.includes('chal-1');
  const isStep2QuizSolved = solvedChallengeIds.includes('chal-2');
  const isStep3QuizSolved = solvedChallengeIds.includes('chal-3');

  // Strict pedagogical progression: only advance to next stage after playing & solving current quiz
  const canAccessWeight = areAllFourMealsCompleted && isStep1QuizSolved;
  const canAccessActiveWeek = canAccessWeight && isStep2QuizSolved;
  const canAccessRanking = canAccessActiveWeek && isStep3QuizSolved;

  // Guard: if user is on a locked screen, immediately bounce back to latest accessible screen
  useEffect(() => {
    if (activeScreen === 'weight' && !canAccessWeight) {
      dispatch({ type: 'SET_ACTIVE_SCREEN', screen: 'meals' });
    } else if (activeScreen === 'active_week' && !canAccessActiveWeek) {
      dispatch({ type: 'SET_ACTIVE_SCREEN', screen: canAccessWeight ? 'weight' : 'meals' });
    } else if (activeScreen === 'ranking' && !canAccessRanking) {
      dispatch({
        type: 'SET_ACTIVE_SCREEN',
        screen: canAccessActiveWeek ? 'active_week' : canAccessWeight ? 'weight' : 'meals',
      });
    }
  }, [activeScreen, canAccessWeight, canAccessActiveWeek, canAccessRanking, dispatch]);

  return (
    <div className="min-h-screen bg-[#c8ebe6] dark:bg-[#070e1e] bg-gradient-to-br from-[#d4f2ec] via-[#bfebe4] to-[#aae4dc] dark:from-[#060b17] dark:via-[#0c1833] dark:to-[#080f22] text-slate-800 dark:text-slate-100 flex flex-col font-sans p-2 sm:p-4 transition-colors duration-300">
      {/* Top Header Bar */}
      <HeaderBar
        progressPercentage={progressPercentage}
        starsCount={currentStudent ? currentStudent.starsCount : (guestStarsCount || 0)}
        badges={badges}
        currentStudent={currentStudent}
        solvedMissionsCount={solvedChallengeIds.length}
        totalMissionsCount={MATH_CHALLENGES.length}
        onStartMission={() => {
          const missionIdx = activeScreen === 'weight' ? 1 : activeScreen === 'active_week' ? 2 : 0;
          handleStartMission(missionIdx);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRank={() => {
          if (!canAccessRanking) {
            playClickSound();
            const missionIdx = !canAccessWeight ? 0 : !canAccessActiveWeek ? 1 : 2;
            handleStartMission(missionIdx);
            return;
          }
          playStarSound();
          setActiveScreen('ranking');
        }}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Educational Game Screen */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col justify-center my-auto">
        {/* Screen Navigation Selector - Centered across all tabs */}
        <div className="mb-3.5 w-full flex items-center justify-center relative px-1 flex-wrap gap-2.5">
          <div className="flex items-center justify-center gap-1.5 p-1.5 bg-white/85 dark:bg-[#0f1b33]/90 backdrop-blur-xs rounded-2xl border-2 border-teal-200/90 dark:border-blue-800/80 shadow-sm flex-wrap">
            <button
              onClick={() => {
                playClickSound();
                setActiveScreen('meals');
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 ${
                activeScreen === 'meals'
                  ? 'bg-teal-800 dark:bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-blue-900/40'
              }`}
            >
              <span className="text-base sm:text-lg">🍽️</span>
              <span>1. Refeições Diárias</span>
            </button>

            <button
              disabled={!canAccessWeight}
              onClick={() => {
                if (!canAccessWeight) {
                  if (!areAllFourMealsCompleted) {
                    playClickSound();
                  } else if (!isStep1QuizSolved) {
                    handleStartMission(0);
                  }
                  return;
                }
                playClickSound();
                setActiveScreen('weight');
              }}
              title={
                !areAllFourMealsCompleted
                  ? `Bloqueado: Monte as 4 refeições no diário antes (${completedMealsCount}/4 concluídas)`
                  : !isStep1QuizSolved
                  ? 'Bloqueado: Responda ao Quiz da Etapa 1 para desbloquear'
                  : '2. Peso e Saúde'
              }
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ${
                !canAccessWeight
                  ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-700'
                  : activeScreen === 'weight'
                  ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-xs cursor-pointer'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer'
              }`}
            >
              <span className="text-base sm:text-lg">{canAccessWeight ? '⚖️' : '🔒'}</span>
              <span>2. Peso e Saúde</span>
              {!areAllFourMealsCompleted ? (
                <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  {completedMealsCount}/4
                </span>
              ) : !isStep1QuizSolved ? (
                <span className="text-[10px] bg-amber-100 dark:bg-amber-900/70 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
                  Quiz Pendente
                </span>
              ) : null}
            </button>

            <button
              disabled={!canAccessActiveWeek}
              onClick={() => {
                if (!canAccessActiveWeek) {
                  if (canAccessWeight && !isStep2QuizSolved) {
                    handleStartMission(1);
                  } else {
                    playClickSound();
                  }
                  return;
                }
                playClickSound();
                setActiveScreen('active_week');
              }}
              title={
                !canAccessActiveWeek
                  ? !canAccessWeight
                    ? 'Bloqueado: Conclua as etapas anteriores primeiro'
                    : 'Bloqueado: Responda ao Quiz do IMC na Etapa 2 para desbloquear'
                  : '3. Semana Ativa'
              }
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ${
                !canAccessActiveWeek
                  ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-700'
                  : activeScreen === 'active_week'
                  ? 'bg-teal-600 dark:bg-blue-500 text-white shadow-xs cursor-pointer'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-blue-900/40 cursor-pointer'
              }`}
            >
              <span className="text-base sm:text-lg">{canAccessActiveWeek ? '🏃' : '🔒'}</span>
              <span>3. Semana Ativa</span>
              {canAccessWeight && !isStep2QuizSolved && (
                <span className="text-[10px] bg-amber-100 dark:bg-amber-900/70 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
                  Quiz Pendente
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Display */}
        {activeScreen === 'meals' && (
          <div className="w-full">
            <MealDiarySection
              mealSlots={mealSlots}
              activeMealId={activeMealId}
              onSelectMealTime={setActiveMealId}
              onAddFoodToMeal={handleAddFoodToMeal}
              onRemoveFoodFromMeal={handleRemoveFood}
              onAdjustPortion={handleAdjustPortion}
              onResetMeal={handleResetMeal}
              onOpenProportionChallenge={() => handleStartMission(0)}
              onLoadMealTemplate={handleLoadMealTemplate}
              isFocusedView={true}
              isMissionSolved={isStep1QuizSolved}
              onStartMission={() => handleStartMission(0)}
              onNavigateToWeight={() => {
                if (!canAccessWeight) return;
                setActiveScreen('weight');
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeScreen === 'weight' && (
          <div className="w-full">
            <WeightHealthSection
              onChallengeClick={() => handleStartMission(1)}
              isFocusedView={true}
              consumedKcal={totalDailyKcal}
              consumedGrams={totalDailyGrams}
              isQuizSolved={isStep2QuizSolved}
              onNavigateToNext={() => {
                if (!canAccessActiveWeek) return;
                setActiveScreen('active_week');
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeScreen === 'active_week' && (
          <div className="w-full">
            <ActiveWeekSection
              onChallengeClick={() => handleStartMission(2)}
              isFocusedView={true}
              isQuizSolved={isStep3QuizSolved}
              onNavigateToNext={() => {
                if (!canAccessRanking) return;
                setActiveScreen('ranking');
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeScreen === 'ranking' && (
          <div className="w-full">
            <RankingSection
              currentStudent={currentStudent}
              badges={badges}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              onStartMission={() => handleStartMission(0)}
              onLogout={handleLogout}
              isFocusedView={true}
            />
          </div>
        )}

        {/* Bottom Bar */}
        <BottomBar
          onStartMission={() =>
            handleStartMission(
              activeScreen === 'weight' ? 1 : activeScreen === 'active_week' ? 2 : 0,
            )
          }
          onOpenCategory={(cat) => {
            if (cat === 'conquistar') {
              if (!canAccessRanking) {
                playClickSound();
                const missionIdx = !canAccessWeight ? 0 : !canAccessActiveWeek ? 1 : 2;
                handleStartMission(missionIdx);
                return;
              }
              playStarSound();
              setActiveScreen('ranking');
            } else {
              setActiveCategoryModal(cat);
            }
          }}
        />
      </main>

      {/* Challenge / Mission Modal */}
      {isMissionModalOpen && (
        <MissionModal
          challenges={MATH_CHALLENGES}
          initialChallengeIndex={initialChallengeIdx}
          badges={badges}
          solvedChallengeIds={solvedChallengeIds}
          areAllFourMealsCompleted={areAllFourMealsCompleted}
          onClose={() => setIsMissionModalOpen(false)}
          onSolveChallenge={handleSolveChallenge}
          onUnlockBadge={handleUnlockBadge}
          onAwardQuestionStar={handleAwardQuestionStar}
          onNavigateToScreen={(screen) => {
            if (screen === 'weight' && !areAllFourMealsCompleted) {
              setActiveScreen('meals');
              return;
            }
            setActiveScreen(screen);
            if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Category Info Modal */}
      {activeCategoryModal && (
        <CategoryInfoModal
          category={activeCategoryModal}
          onClose={() => setActiveCategoryModal(null)}
          starsCount={currentStudent ? currentStudent.starsCount : (guestStarsCount || 0)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          starsCount={currentStudent ? currentStudent.starsCount : (guestStarsCount || 0)}
          currentStudent={currentStudent}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenRank={() => {
            playStarSound();
            setActiveScreen('ranking');
          }}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      )}

      {/* Student Login Modal */}
      <StudentLoginModal
        isOpen={isLoginModalOpen}
        currentStudent={currentStudent}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginStudent={handleLoginStudent}
        onLogout={handleLogout}
      />

      {/* Export Image Modal */}
      {isExportModalOpen && (
        <ExportImageModal onClose={() => setIsExportModalOpen(false)} />
      )}
    </div>
  );
}
