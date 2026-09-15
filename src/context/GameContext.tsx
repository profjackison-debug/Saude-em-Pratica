import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { FoodItem, MealSlot, MealTimeId, LearningBadge, AppScreenId, StudentProfile } from '../types';
import { BRAZILIAN_FOODS, INITIAL_BADGES } from '../data/tacoData';
import { loadStoredStudent, saveStoredStudent, clearStoredStudent, loadSavedStudentsList } from '../data/rankData';
import { applyTheme, getInitialTheme, ThemeMode } from '../utils/theme';
import { setAudioMuted } from '../utils/audio';

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------
const STORAGE_MEALS = 'saude_pratica_meals_v1';
const STORAGE_SOLVED = 'saude_pratica_solved_v1';
const STORAGE_BADGES = 'saude_pratica_badges_v1';
const STORAGE_PROGRESS = 'saude_pratica_progress_v1';
const STORAGE_MUTED = 'saude_pratica_muted_v1';

// ---------------------------------------------------------------------------
// Safe food lookup helpers (replaces non-null assertions)
// ---------------------------------------------------------------------------
export function findFood(id: string, fallbackId?: string): FoodItem | undefined {
  return (
    BRAZILIAN_FOODS.find((f) => f.id === id) ??
    (fallbackId ? BRAZILIAN_FOODS.find((f) => f.id === fallbackId) : undefined)
  );
}

function buildMealItems(
  specs: { id: string; portions: number; fallback?: string }[],
): { food: FoodItem; portions: number }[] {
  return specs
    .map(({ id, portions, fallback }) => {
      const food = findFood(id, fallback);
      return food ? { food, portions } : null;
    })
    .filter((item): item is { food: FoodItem; portions: number } => item !== null);
}

// ---------------------------------------------------------------------------
// Default initial meals (safe — no `!` assertions)
// ---------------------------------------------------------------------------
function createDefaultMealSlots(): Record<MealTimeId, MealSlot> {
  return {
    breakfast: {
      id: 'breakfast',
      label: 'Café da Manhã',
      timeRange: '07:00 - 08:30',
      targetProportion: '20% do dia',
      items: [],
    },
    lunch: {
      id: 'lunch',
      label: 'Almoço',
      timeRange: '12:00 - 13:30',
      targetProportion: '35% do dia',
      items: [],
    },
    snack: {
      id: 'snack',
      label: 'Lanche da Tarde',
      timeRange: '16:00 - 16:45',
      targetProportion: '15% do dia',
      items: [],
    },
    dinner: {
      id: 'dinner',
      label: 'Jantar',
      timeRange: '19:30 - 20:30',
      targetProportion: '30% do dia',
      items: [],
    },
  };
}

// ---------------------------------------------------------------------------
// Meal slot persistence helpers
// ---------------------------------------------------------------------------
interface StoredMeal {
  [key: string]: { foodId: string; portions: number }[];
}

function getMealsStorageKey(studentId?: string | null): string {
  return studentId ? `saude_pratica_meals_student_${studentId}` : 'saude_pratica_meals_v2';
}

function saveMealSlotsToStorage(slots: Record<MealTimeId, MealSlot>, studentId?: string | null): void {
  try {
    const serialized: StoredMeal = {};
    for (const [key, slot] of Object.entries(slots)) {
      serialized[key] = slot.items.map((it) => ({ foodId: it.food.id, portions: it.portions }));
    }
    localStorage.setItem(getMealsStorageKey(studentId), JSON.stringify(serialized));
  } catch {
    /* quota exceeded or similar */
  }
}

function loadMealSlotsFromStorage(studentId?: string | null): Record<MealTimeId, MealSlot> {
  try {
    // Clear legacy v1 mock meals so pre-filled test foods are never loaded
    if (localStorage.getItem('saude_pratica_meals_v1')) {
      localStorage.removeItem('saude_pratica_meals_v1');
    }
    const key = getMealsStorageKey(studentId);
    const raw = localStorage.getItem(key);
    const defaults = createDefaultMealSlots();
    if (!raw) return defaults;
    const parsed: StoredMeal = JSON.parse(raw);
    const mealIds: MealTimeId[] = ['breakfast', 'lunch', 'snack', 'dinner'];

    for (const mealId of mealIds) {
      const stored = parsed[mealId];
      if (Array.isArray(stored) && stored.length > 0) {
        defaults[mealId].items = stored
          .map(({ foodId, portions }) => {
            const food = BRAZILIAN_FOODS.find((f) => f.id === foodId);
            return food ? { food, portions } : null;
          })
          .filter((it): it is { food: FoodItem; portions: number } => it !== null);
      }
    }
    return defaults;
  } catch {
    return createDefaultMealSlots();
  }
}

// ---------------------------------------------------------------------------
// Student-scoped badge and challenge persistence helpers
// ---------------------------------------------------------------------------
export function getBadgesStorageKey(studentId?: string | null): string {
  return studentId ? `saude_pratica_badges_student_${studentId}` : 'saude_pratica_badges_guest_v2';
}

export function getSolvedStorageKey(studentId?: string | null): string {
  return studentId ? `saude_pratica_solved_student_${studentId}` : 'saude_pratica_solved_guest_v2';
}

export function loadBadgesFromStorage(studentId?: string | null): LearningBadge[] {
  try {
    // Clear legacy test keys so past mock data never leaks into new students
    if (typeof window !== 'undefined') {
      localStorage.removeItem('saude_pratica_badges_v1');
      localStorage.removeItem('saude_pratica_solved_v1');
      localStorage.removeItem('saude_pratica_solved_challenges_v1');
    }
    const key = getBadgesStorageKey(studentId);
    const raw = localStorage.getItem(key);
    const storedMap: Record<string, boolean> = {};
    if (raw) {
      const parsed: LearningBadge[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach((b) => {
          if (b.unlocked) storedMap[b.id] = true;
        });
      }
    }

    return INITIAL_BADGES.map((b) => ({
      ...b,
      unlocked: Boolean(storedMap[b.id]),
    }));
  } catch {
    /* ignore */
  }
  return INITIAL_BADGES.map((b) => ({ ...b, unlocked: false }));
}

export function loadSolvedFromStorage(studentId?: string | null): string[] {
  try {
    const key = getSolvedStorageKey(studentId);
    const raw = localStorage.getItem(key);
    let list: string[] = [];
    if (raw) {
      const parsed: string[] = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    }

    // Auto-sync com o perfil do estudante se houver missões concluídas
    const activeStudent = loadStoredStudent();
    const targetStudent =
      (activeStudent && (!studentId || activeStudent.id === studentId))
        ? activeStudent
        : loadSavedStudentsList().find((s) => s.id === studentId);

    if (targetStudent && targetStudent.completedMissions > 0) {
      if (targetStudent.completedMissions >= 1 && !list.includes('chal-1')) list.push('chal-1');
      if (targetStudent.completedMissions >= 2 && !list.includes('chal-2')) list.push('chal-2');
      if (targetStudent.completedMissions >= 3 && !list.includes('chal-3')) list.push('chal-3');
    }
    return list;
  } catch {
    /* ignore */
  }
  return [];
}

// ---------------------------------------------------------------------------
// Generic localStorage helpers
// ---------------------------------------------------------------------------
function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
}

function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------
export interface GameState {
  currentStudent: StudentProfile | null;
  guestStarsCount: number;
  solvedQuestionIds: string[];
  mealSlots: Record<MealTimeId, MealSlot>;
  activeMealId: MealTimeId;
  activeScreen: AppScreenId;
  badges: LearningBadge[];
  progressPercentage: number;
  solvedChallengeIds: string[];
  theme: ThemeMode;
  isMuted: boolean;
  studentMassKg: number;
  studentHeightM: number;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export type GameAction =
  | { type: 'ADD_FOOD'; food: FoodItem }
  | { type: 'REMOVE_FOOD'; foodId: string }
  | { type: 'ADJUST_PORTION'; foodId: string; delta: number }
  | { type: 'RESET_MEAL' }
  | { type: 'LOAD_MEAL_TEMPLATE'; mealId: MealTimeId; foods: { foodId: string; portions: number }[] }
  | { type: 'SET_ACTIVE_MEAL'; mealId: MealTimeId }
  | { type: 'SET_ACTIVE_SCREEN'; screen: AppScreenId }
  | { type: 'AWARD_QUESTION_STAR'; questionId: string; badgeId?: string }
  | { type: 'SOLVE_CHALLENGE'; challengeId: string }
  | { type: 'UNLOCK_BADGE'; badgeId: string }
  | { type: 'LOGIN_STUDENT'; student: StudentProfile }
  | { type: 'LOGOUT_STUDENT' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SET_BODY_METRICS'; massKg: number; heightM: number };

// ---------------------------------------------------------------------------
// Reducer — single source of truth, atomic updates, no race conditions
// ---------------------------------------------------------------------------
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    // ---- Meal management ----
    case 'ADD_FOOD': {
      const current = state.mealSlots[state.activeMealId];
      const existingIdx = current.items.findIndex((it) => it.food.id === action.food.id);
      const updatedItems =
        existingIdx >= 0
          ? current.items.map((it, idx) =>
              idx === existingIdx ? { ...it, portions: it.portions + 1 } : it,
            )
          : [...current.items, { food: action.food, portions: 1 }];

      return {
        ...state,
        mealSlots: {
          ...state.mealSlots,
          [state.activeMealId]: { ...current, items: updatedItems },
        },
        progressPercentage: Math.min(100, state.progressPercentage + 2),
      };
    }

    case 'REMOVE_FOOD': {
      const current = state.mealSlots[state.activeMealId];
      return {
        ...state,
        mealSlots: {
          ...state.mealSlots,
          [state.activeMealId]: {
            ...current,
            items: current.items.filter((it) => it.food.id !== action.foodId),
          },
        },
      };
    }

    case 'ADJUST_PORTION': {
      const current = state.mealSlots[state.activeMealId];
      const updatedItems = current.items
        .map((it) => {
          if (it.food.id === action.foodId) {
            const next = it.portions + action.delta;
            return next > 0 ? { ...it, portions: next } : null;
          }
          return it;
        })
        .filter((it): it is { food: FoodItem; portions: number } => it !== null);

      return {
        ...state,
        mealSlots: {
          ...state.mealSlots,
          [state.activeMealId]: { ...current, items: updatedItems },
        },
      };
    }

    case 'RESET_MEAL': {
      const current = state.mealSlots[state.activeMealId];
      return {
        ...state,
        mealSlots: {
          ...state.mealSlots,
          [state.activeMealId]: { ...current, items: [] },
        },
      };
    }

    case 'LOAD_MEAL_TEMPLATE': {
      const newItems = action.foods
        .map(({ foodId, portions }) => {
          const food = BRAZILIAN_FOODS.find((f) => f.id === foodId);
          return food ? { food, portions } : null;
        })
        .filter((it): it is { food: FoodItem; portions: number } => it !== null);

      return {
        ...state,
        mealSlots: {
          ...state.mealSlots,
          [action.mealId]: { ...state.mealSlots[action.mealId], items: newItems },
        },
      };
    }

    case 'SET_ACTIVE_MEAL':
      return { ...state, activeMealId: action.mealId };

    case 'SET_ACTIVE_SCREEN':
      return { ...state, activeScreen: action.screen };

    // ---- Challenge / gamification (atomic — fixes race condition) ----
    case 'AWARD_QUESTION_STAR': {
      if (state.solvedQuestionIds.includes(action.questionId)) {
        return state;
      }
      const updatedQuestionIds = [...state.solvedQuestionIds, action.questionId];
      const updatedBadges = action.badgeId
        ? state.badges.map((b) => (b.id === action.badgeId ? { ...b, unlocked: true } : b))
        : state.badges;

      const updatedStudent: StudentProfile | null = state.currentStudent
        ? {
            ...state.currentStudent,
            starsCount: (state.currentStudent.starsCount || 0) + 1,
            score: (state.currentStudent.score || 0) + 100,
          }
        : null;

      return {
        ...state,
        solvedQuestionIds: updatedQuestionIds,
        badges: updatedBadges,
        guestStarsCount: state.currentStudent ? state.guestStarsCount : state.guestStarsCount + 1,
        currentStudent: updatedStudent,
      };
    }

    case 'SOLVE_CHALLENGE': {
      const alreadySolved = state.solvedChallengeIds.includes(action.challengeId);
      const updatedSolvedIds = alreadySolved
        ? state.solvedChallengeIds
        : [...state.solvedChallengeIds, action.challengeId];

      const targetMissions = Math.max(
        state.currentStudent?.completedMissions || 0,
        updatedSolvedIds.length
      );

      const updatedStudent: StudentProfile | null = state.currentStudent
        ? {
            ...state.currentStudent,
            completedMissions: targetMissions,
            starsCount: state.currentStudent.starsCount || 0,
            score: state.currentStudent.score || (state.currentStudent.starsCount || 0) * 100,
          }
        : null;

      return {
        ...state,
        currentStudent: updatedStudent,
        solvedChallengeIds: updatedSolvedIds,
        progressPercentage: Math.min(100, Math.round((targetMissions / 3) * 100)),
      };
    }

    case 'UNLOCK_BADGE':
      return {
        ...state,
        badges: state.badges.map((b) =>
          b.id === action.badgeId ? { ...b, unlocked: true } : b,
        ),
      };

    // ---- Student ----
    case 'LOGIN_STUDENT': {
      const raw = action.student;
      const solvedList = loadSolvedFromStorage(raw.id);
      const minMissions = Math.max(raw.completedMissions || 0, solvedList.length);
      const currentStars = Number.isFinite(raw.starsCount) ? Math.max(0, raw.starsCount) : 0;
      const scaledStars = Math.max(currentStars, state.guestStarsCount);
      const scaledScore = Number.isFinite(raw.score) ? Math.max(0, raw.score) : scaledStars * 100;
      const scaledStudent: StudentProfile = {
        ...raw,
        completedMissions: minMissions,
        starsCount: scaledStars,
        score: scaledScore,
      };
      return {
        ...state,
        currentStudent: scaledStudent,
        mealSlots: loadMealSlotsFromStorage(scaledStudent.id),
        badges: loadBadgesFromStorage(scaledStudent.id),
        solvedChallengeIds: solvedList,
        progressPercentage: minMissions
          ? Math.min(100, Math.round((minMissions / 3) * 100))
          : 0,
        activeScreen: 'meals',
        activeMealId: 'breakfast',
      };
    }

    case 'LOGOUT_STUDENT':
      clearStoredStudent();
      return {
        ...state,
        currentStudent: null,
        guestStarsCount: 0,
        solvedQuestionIds: [],
        mealSlots: createDefaultMealSlots(),
        badges: INITIAL_BADGES.map((b) => ({ ...b, unlocked: false })),
        solvedChallengeIds: [],
        progressPercentage: 0,
      };

    // ---- Theme / Audio ----
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark',
      };

    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };

    case 'SET_BODY_METRICS':
      return {
        ...state,
        studentMassKg: action.massKg,
        studentHeightM: action.heightM,
      };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Initial state loader
// ---------------------------------------------------------------------------
function loadInitialState(): GameState {
  const student = loadStoredStudent();
  const solved = student ? loadSolvedFromStorage(student.id) : [];
  const badges = student ? loadBadgesFromStorage(student.id) : INITIAL_BADGES.map((b) => ({ ...b, unlocked: false }));
  const missionsCount = student ? Math.max(student.completedMissions || 0, solved.length) : 0;
  const metricsKey = student ? `saude_pratica_metrics_${student.id}` : 'saude_pratica_metrics_guest';
  const savedMetrics = loadJson<{ massKg: number; heightM: number }>(metricsKey, { massKg: 65, heightM: 1.65 });

  return {
    currentStudent: student,
    guestStarsCount: 0,
    solvedQuestionIds: [],
    mealSlots: student ? loadMealSlotsFromStorage(student.id) : createDefaultMealSlots(),
    activeMealId: 'breakfast',
    activeScreen: 'meals',
    badges,
    progressPercentage: missionsCount
      ? Math.min(100, Math.round((missionsCount / 3) * 100))
      : 0,
    solvedChallengeIds: solved,
    theme: getInitialTheme(),
    isMuted: (() => {
      const muted = loadJson<boolean>(STORAGE_MUTED, false);
      setAudioMuted(muted);
      return muted;
    })(),
    studentMassKg: savedMetrics?.massKg ?? 65,
    studentHeightM: savedMetrics?.heightM ?? 1.65,
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider — persistence side-effects
// ---------------------------------------------------------------------------
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadInitialState);

  // Persist student
  useEffect(() => {
    if (state.currentStudent) {
      saveStoredStudent(state.currentStudent);
    } else {
      clearStoredStudent();
    }
  }, [state.currentStudent]);

  // Persist body metrics
  useEffect(() => {
    const metricsKey = state.currentStudent ? `saude_pratica_metrics_${state.currentStudent.id}` : 'saude_pratica_metrics_guest';
    saveJson(metricsKey, { massKg: state.studentMassKg, heightM: state.studentHeightM });
  }, [state.studentMassKg, state.studentHeightM, state.currentStudent?.id]);

  // Persist meal slots
  useEffect(() => {
    saveMealSlotsToStorage(state.mealSlots, state.currentStudent?.id);
  }, [state.mealSlots, state.currentStudent?.id]);

  // Persist solved challenges
  useEffect(() => {
    try {
      localStorage.setItem(
        getSolvedStorageKey(state.currentStudent?.id),
        JSON.stringify(state.solvedChallengeIds)
      );
    } catch {
      /* ignore */
    }
  }, [state.solvedChallengeIds, state.currentStudent?.id]);

  // Persist badges
  useEffect(() => {
    try {
      localStorage.setItem(
        getBadgesStorageKey(state.currentStudent?.id),
        JSON.stringify(state.badges)
      );
    } catch {
      /* ignore */
    }
  }, [state.badges, state.currentStudent?.id]);

  // Persist progress
  useEffect(() => {
    saveJson(STORAGE_PROGRESS, state.progressPercentage);
  }, [state.progressPercentage]);

  // Persist and apply theme
  useEffect(() => {
    applyTheme(state.theme);
  }, [state.theme]);

  // Persist muted and synchronize audio engine
  useEffect(() => {
    saveJson(STORAGE_MUTED, state.isMuted);
    setAudioMuted(state.isMuted);
  }, [state.isMuted]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
