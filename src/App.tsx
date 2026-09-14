import React, { useState, useEffect } from 'react';
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
import { FoodItem, MealSlot, MealTimeId, LearningBadge, AppScreenId, StudentProfile } from './types';
import { BRAZILIAN_FOODS, INITIAL_BADGES, MATH_CHALLENGES } from './data/tacoData';
import { loadStoredStudent, saveStoredStudent } from './data/rankData';
import { toggleAudioMute, getAudioMuted, playClickSound, playStarSound } from './utils/audio';
import { getInitialTheme, applyTheme, ThemeMode } from './utils/theme';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreenId>('all');
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(loadStoredStudent());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  // Apply theme class on mount and changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initial meal states with authentic Brazilian foods across all 4 meals
  const [mealSlots, setMealSlots] = useState<Record<MealTimeId, MealSlot>>({
    breakfast: {
      id: 'breakfast',
      label: 'Café da Manhã',
      timeRange: '07:00 - 08:30',
      targetProportion: '20% do dia',
      items: [
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'pao')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'manteiga')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'cafe_pingado') || BRAZILIAN_FOODS.find((f) => f.id === 'leite')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'ovo_mexido') || BRAZILIAN_FOODS.find((f) => f.id === 'ovo')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'mamao') || BRAZILIAN_FOODS.find((f) => f.id === 'banana')!, portions: 1 },
      ].filter((it) => it.food !== undefined),
    },
    lunch: {
      id: 'lunch',
      label: 'Almoço',
      timeRange: '12:00 - 13:30',
      targetProportion: '35% do dia',
      items: [
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'arroz')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'feijao')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'frango')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'verduras')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'cenoura_beterraba') || BRAZILIAN_FOODS.find((f) => f.id === 'verduras')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'suco_laranja')!, portions: 1 },
      ].filter((it) => it.food !== undefined),
    },
    snack: {
      id: 'snack',
      label: 'Lanche da Tarde',
      timeRange: '16:00 - 16:45',
      targetProportion: '15% do dia',
      items: [
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'vitamina_banana') || BRAZILIAN_FOODS.find((f) => f.id === 'leite')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'pipoca') || BRAZILIAN_FOODS.find((f) => f.id === 'pao_queijo')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'maca') || BRAZILIAN_FOODS.find((f) => f.id === 'banana')!, portions: 1 },
      ].filter((it) => it.food !== undefined),
    },
    dinner: {
      id: 'dinner',
      label: 'Jantar',
      timeRange: '19:30 - 20:30',
      targetProportion: '30% do dia',
      items: [
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'sopa_legumes') || BRAZILIAN_FOODS.find((f) => f.id === 'arroz')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'pao')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'queijo')!, portions: 1 },
        { food: BRAZILIAN_FOODS.find((f) => f.id === 'laranja') || BRAZILIAN_FOODS.find((f) => f.id === 'maca')!, portions: 1 },
      ].filter((it) => it.food !== undefined),
    },
  });

  const [activeMealId, setActiveMealId] = useState<MealTimeId>('lunch');
  const [starsCount, setStarsCount] = useState(12);
  const [badges, setBadges] = useState<LearningBadge[]>(
    INITIAL_BADGES.map((b) => ({ ...b, unlocked: true }))
  );
  const [progressPercentage, setProgressPercentage] = useState(75);

  // Modals
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [initialChallengeIdx, setInitialChallengeIdx] = useState(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeCategoryModal, setActiveCategoryModal] = useState<
    'aprender' | 'colaborar' | 'conquistar' | 'evoluir' | null
  >(null);
  const [isMuted, setIsMuted] = useState(getAudioMuted());

  // Handle adding food to current meal
  const handleAddFoodToMeal = (food: FoodItem) => {
    setMealSlots((prev) => {
      const current = prev[activeMealId];
      const existingIdx = current.items.findIndex((it) => it.food.id === food.id);

      if (existingIdx >= 0) {
        const updated = [...current.items];
        updated[existingIdx] = {
          ...updated[existingIdx],
          portions: updated[existingIdx].portions + 1,
        };
        return {
          ...prev,
          [activeMealId]: { ...current, items: updated },
        };
      } else {
        return {
          ...prev,
          [activeMealId]: {
            ...current,
            items: [...current.items, { food, portions: 1 }],
          },
        };
      }
    });

    setProgressPercentage((prev) => Math.min(100, prev + 2));
  };

  // Adjust portion multiplier
  const handleAdjustPortion = (foodId: string, delta: number) => {
    setMealSlots((prev) => {
      const current = prev[activeMealId];
      const updated = current.items
        .map((it) => {
          if (it.food.id === foodId) {
            const nextPortion = it.portions + delta;
            return nextPortion > 0 ? { ...it, portions: nextPortion } : null;
          }
          return it;
        })
        .filter(Boolean) as { food: FoodItem; portions: number }[];

      return {
        ...prev,
        [activeMealId]: { ...current, items: updated },
      };
    });
  };

  // Remove food
  const handleRemoveFood = (foodId: string) => {
    setMealSlots((prev) => {
      const current = prev[activeMealId];
      return {
        ...prev,
        [activeMealId]: {
          ...current,
          items: current.items.filter((it) => it.food.id !== foodId),
        },
      };
    });
  };

  // Reset current plate
  const handleResetMeal = () => {
    setMealSlots((prev) => ({
      ...prev,
      [activeMealId]: {
        ...prev[activeMealId],
        items: [],
      },
    }));
  };

  // Load a suggested Brazilian meal template
  const handleLoadMealTemplate = (
    mealId: MealTimeId,
    templateFoods: { foodId: string; portions: number }[]
  ) => {
    const newItems = templateFoods
      .map(({ foodId, portions }) => {
        const food = BRAZILIAN_FOODS.find((f) => f.id === foodId);
        return food ? { food, portions } : null;
      })
      .filter(Boolean) as { food: FoodItem; portions: number }[];

    setMealSlots((prev) => ({
      ...prev,
      [mealId]: {
        ...prev[mealId],
        items: newItems,
      },
    }));
  };

  // Open mission challenges
  const handleStartMission = (challengeIndex = 0) => {
    setInitialChallengeIdx(challengeIndex);
    setIsMissionModalOpen(true);
  };

  // Solve challenge
  const handleSolveChallenge = (challengeId: string) => {
    setStarsCount((prev) => {
      const nextStars = prev + 1;
      setCurrentStudent((stud) => {
        const updatedStudent: StudentProfile = {
          ...stud,
          starsCount: nextStars,
          score: (stud.score || 0) + 150,
          completedMissions: (stud.completedMissions || 0) + 1,
        };
        saveStoredStudent(updatedStudent);
        return updatedStudent;
      });
      return nextStars;
    });
    setProgressPercentage((prev) => Math.min(100, prev + 10));
  };

  const handleLoginStudent = (student: StudentProfile) => {
    setCurrentStudent(student);
    if (student.starsCount !== undefined) {
      setStarsCount(student.starsCount);
    }
    // Direct student to 1. Refeições Diárias screen and Café da Manhã tab
    setActiveScreen('meals');
    setActiveMealId('breakfast');

    // Smooth scroll to top of meals view
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Unlock badge
  const handleUnlockBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) => (b.id === badgeId ? { ...b, unlocked: true } : b))
    );
  };

  const handleToggleMute = () => {
    const muted = toggleAudioMute();
    setIsMuted(muted);
  };

  // Total daily intake calculated across all 4 meal slots
  const slotsList: MealSlot[] = Object.values(mealSlots);
  const totalDailyKcal = Math.round(
    slotsList.reduce((sum, slot) => {
      return (
        sum +
        slot.items.reduce((mSum, item) => {
          return mSum + (item.food.per100g.energyKcal * (item.food.servingSizeGrams * item.portions)) / 100;
        }, 0)
      );
    }, 0)
  );

  const totalDailyGrams = slotsList.reduce((sum, slot) => {
    return (
      sum +
      slot.items.reduce((mSum, item) => {
        return mSum + item.food.servingSizeGrams * item.portions;
      }, 0)
    );
  }, 0);

  return (
    <div className="min-h-screen bg-[#c8ebe6] dark:bg-[#070e1e] bg-gradient-to-br from-[#d4f2ec] via-[#bfebe4] to-[#aae4dc] dark:from-[#060b17] dark:via-[#0c1833] dark:to-[#080f22] text-slate-800 dark:text-slate-100 flex flex-col font-sans p-2 sm:p-4 transition-colors duration-300">
      {/* Top Header Bar */}
      <HeaderBar
        progressPercentage={progressPercentage}
        starsCount={starsCount}
        badges={badges}
        currentStudent={currentStudent}
        onStartMission={() => handleStartMission(0)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRank={() => {
          playStarSound();
          setActiveScreen('ranking');
        }}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Educational Game Screen: 16:9 Composition Frame */}
      <main className="flex-1 w-full max-w-[1750px] mx-auto flex flex-col justify-center my-auto">
        {/* Screen Navigation Selector (1. Refeições Diárias | 2. Peso e Saúde | 3. Semana Ativa | 4. Ranking | Visão Completa) */}
        <div className="mb-2.5 w-full flex items-center justify-between gap-2 flex-wrap px-1">
          <div className="flex items-center gap-1.5 p-1 bg-white/80 dark:bg-[#0f1b33]/90 backdrop-blur-xs rounded-2xl border-2 border-teal-200/90 dark:border-blue-800/80 shadow-sm flex-wrap">
            <button
              onClick={() => {
                playClickSound();
                setActiveScreen('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeScreen === 'all'
                  ? 'bg-teal-800 dark:bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-blue-900/40'
              }`}
            >
              <span>🔲</span>
              <span className="hidden sm:inline">Visão Completa</span>
              <span className="sm:hidden">Todas</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveScreen('meals');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeScreen === 'meals'
                  ? 'bg-teal-800 dark:bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-blue-900/40'
              }`}
            >
              <span>🍽️</span>
              <span>1. Refeições Diárias</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveScreen('weight');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeScreen === 'weight'
                  ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/40'
              }`}
            >
              <span>⚖️</span>
              <span>2. Peso e Saúde</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveScreen('active_week');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeScreen === 'active_week'
                  ? 'bg-teal-600 dark:bg-blue-500 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-blue-900/40'
              }`}
            >
              <span>🏃</span>
              <span>3. Semana Ativa</span>
            </button>

            <button
              onClick={() => {
                playStarSound();
                setActiveScreen('ranking');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeScreen === 'ranking'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-xs border border-amber-300'
                  : 'text-amber-900 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800'
              }`}
            >
              <span>🏆</span>
              <span>4. Ranking</span>
            </button>
          </div>

          {/* Quick Mission Trigger for Active Screen */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleStartMission(
                  activeScreen === 'weight' ? 1 : activeScreen === 'active_week' ? 2 : 0
                )
              }
              className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs px-3.5 py-1.5 rounded-xl border border-amber-500/50 shadow-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <span>🎯</span>
              <span>
                {activeScreen === 'all'
                  ? 'Começar Missão Geral'
                  : activeScreen === 'meals'
                  ? 'Missão das Refeições'
                  : activeScreen === 'weight'
                  ? 'Missão IMC & Grandezas'
                  : 'Missão Semana Ativa'}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Display: Panoramic 3-Section Grid OR Dedicated Screen View */}
        {activeScreen === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            {/* AREA 2: PESO E SAÚDE (Left Lateral Panel) */}
            <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col">
              <WeightHealthSection
                onChallengeClick={() => handleStartMission(1)}
                consumedKcal={totalDailyKcal}
                consumedGrams={totalDailyGrams}
              />
            </div>

            {/* AREA 1: DIÁRIO DE 4 REFEIÇÕES (Center Main Exploration Focus) */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col">
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
                onNavigateToWeight={() => {
                  setActiveScreen('weight');
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

            {/* AREA 3: SEMANA ATIVA (Right Lateral Panel) */}
            <div className="lg:col-span-3 order-3 flex flex-col">
              <ActiveWeekSection onChallengeClick={() => handleStartMission(2)} />
            </div>
          </div>
        )}

        {/* Dedicated Screen 1: Refeições Diárias */}
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
              onCloseFocus={() => setActiveScreen('all')}
              onNavigateToWeight={() => {
                setActiveScreen('weight');
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Dedicated Screen 2: Peso e Saúde */}
        {activeScreen === 'weight' && (
          <div className="w-full">
            <WeightHealthSection
              onChallengeClick={() => handleStartMission(1)}
              isFocusedView={true}
              onCloseFocus={() => setActiveScreen('all')}
              consumedKcal={totalDailyKcal}
              consumedGrams={totalDailyGrams}
            />
          </div>
        )}

        {/* Dedicated Screen 3: Semana Ativa */}
        {activeScreen === 'active_week' && (
          <div className="w-full">
            <ActiveWeekSection
              onChallengeClick={() => handleStartMission(2)}
              isFocusedView={true}
              onCloseFocus={() => setActiveScreen('all')}
            />
          </div>
        )}

        {/* Dedicated Screen 4: Ranking da Turma & Hall da Fama */}
        {activeScreen === 'ranking' && (
          <div className="w-full">
            <RankingSection
              currentStudent={currentStudent}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              onStartMission={() => handleStartMission(0)}
              isFocusedView={true}
              onCloseFocus={() => setActiveScreen('all')}
            />
          </div>
        )}

        {/* Bottom Bar: Mascot Robot CETi + Big "Começar missão" + 4 Circle Category Buttons */}
        <BottomBar
          onStartMission={() =>
            handleStartMission(
              activeScreen === 'weight' ? 1 : activeScreen === 'active_week' ? 2 : 0
            )
          }
          onOpenCategory={(cat) => {
            if (cat === 'conquistar') {
              playStarSound();
              setActiveScreen('ranking');
            } else {
              setActiveCategoryModal(cat);
            }
          }}
        />
      </main>

      {/* Challenge / Mission Modal with onNavigateToScreen */}
      {isMissionModalOpen && (
        <MissionModal
          challenges={MATH_CHALLENGES}
          initialChallengeIndex={initialChallengeIdx}
          badges={badges}
          onClose={() => setIsMissionModalOpen(false)}
          onSolveChallenge={handleSolveChallenge}
          onUnlockBadge={handleUnlockBadge}
          onNavigateToScreen={(screen) => setActiveScreen(screen)}
        />
      )}

      {/* Category Info Modal (Aprender, Colaborar, Conquistar, Evoluir) */}
      {activeCategoryModal && (
        <CategoryInfoModal
          category={activeCategoryModal}
          onClose={() => setActiveCategoryModal(null)}
          starsCount={starsCount}
        />
      )}

      {/* Settings / Profile Modal */}
      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          starsCount={starsCount}
          currentStudent={currentStudent}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenRank={() => {
            playStarSound();
            setActiveScreen('ranking');
          }}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      )}

      {/* Student Login / Profile Switcher Modal */}
      <StudentLoginModal
        isOpen={isLoginModalOpen}
        currentStudent={currentStudent}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginStudent={handleLoginStudent}
      />

      {/* 16:9 Conceptual Image Viewer & Downloader Modal */}
      {isExportModalOpen && (
        <ExportImageModal onClose={() => setIsExportModalOpen(false)} />
      )}
    </div>
  );
}

