export type NutrientType = 'carb' | 'protein' | 'fat' | 'fiber';

export interface FoodItem {
  id: string;
  name: string;
  category: 'cereal' | 'legume' | 'meat' | 'bread' | 'dairy' | 'fruit' | 'vegetable' | 'beverage' | 'tuber' | 'fat' | 'prepared';
  servingSizeGrams: number;
  servingLabel: string;
  // TACO 4a ed. verified values per 100g
  per100g: {
    energyKcal: number;
    carbsG: number;
    proteinG: number;
    fatG: number;
    fiberG: number;
  };
  iconEmoji: string;
  color: string;
  description: string;
  meals?: MealTimeId[]; // Recommended meals (breakfast, lunch, snack, dinner)
  popularContext?: string; // Social and cultural context in Brazilian households
}

export type MealTimeId = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface MealSlot {
  id: MealTimeId;
  label: string;
  timeRange: string;
  targetProportion: string;
  items: {
    food: FoodItem;
    portions: number; // multiplier of standard serving
  }[];
}

export interface FictionalAdult {
  id: string;
  name: string;
  role: string;
  massKg: number;
  heightM: number;
  avatarSeed: string;
  context: string;
}

export interface ActiveDay {
  dayId: string;
  shortName: string;
  fullName: string;
  activities: {
    id: string;
    type: 'walk' | 'bike' | 'dance' | 'sports' | 'adapted';
    name: string;
    minutes: number;
    isStrengthening: boolean;
  }[];
}

export interface LearningBadge {
  id: string;
  title: string;
  category: 'investigacao' | 'colaboracao' | 'participacao';
  description: string;
  iconName: string;
  unlocked: boolean;
  progressText: string;
}

export interface MathChallenge {
  id: string;
  title: string;
  area: 'refeicoes' | 'imc' | 'movimento';
  question: string;
  context: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export type AppScreenId = 'meals' | 'weight' | 'active_week' | 'ranking';

export interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  school?: string;
  avatarEmoji: string;
  avatarBg: string;
  starsCount: number;
  score: number;
  completedMissions: number;
  platesBalanced: number;
  activeMinutesTotal: number;
  joinedAt: string;
}

export interface RankEntry {
  id: string;
  name: string;
  grade: string;
  school?: string;
  avatarEmoji: string;
  avatarBg: string;
  starsCount: number;
  score: number;
  completedMissions: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}
