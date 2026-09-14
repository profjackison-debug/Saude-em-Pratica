import { StudentProfile, RankEntry } from '../types';

export interface AvatarOption {
  id: string;
  emoji: string;
  label: string;
  bgColor: string;
}

export const STUDENT_AVATARS: AvatarOption[] = [
  { id: 'student_1', emoji: '🧑‍🎓', label: 'Explorador', bgColor: 'from-teal-400 to-emerald-500' },
  { id: 'student_2', emoji: '👧🏽', label: 'Cientista', bgColor: 'from-amber-400 to-orange-500' },
  { id: 'student_3', emoji: '👦🏻', label: 'Atleta', bgColor: 'from-sky-400 to-blue-600' },
  { id: 'student_4', emoji: '👩🏾', label: 'Corredora', bgColor: 'from-rose-400 to-pink-500' },
  { id: 'student_5', emoji: '🧑🏼‍🦽', label: 'Campeão', bgColor: 'from-indigo-400 to-purple-600' },
  { id: 'student_6', emoji: '🧒🏿', label: 'Nutri-Júnior', bgColor: 'from-emerald-400 to-teal-600' },
  { id: 'student_7', emoji: '🧑🏽‍🍳', label: 'Chef Saudável', bgColor: 'from-orange-400 to-amber-600' },
  { id: 'student_8', emoji: '🎨', label: 'Criativo', bgColor: 'from-purple-400 to-pink-500' },
];

export const GRADE_OPTIONS = [
  '7º Ano A',
  '7º Ano B',
  '8º Ano A',
  '8º Ano B',
  '6º Ano A',
  '6º Ano B',
  '9º Ano A',
  '9º Ano B',
  'Ensino Médio 1ª Série',
];

export const INITIAL_PEER_RANKINGS: RankEntry[] = [
  {
    id: 'peer_1',
    name: 'Sofia Ribeiro',
    grade: '8º Ano A',
    school: 'CETi Central',
    avatarEmoji: '👧🏽',
    avatarBg: 'from-amber-400 to-orange-500',
    starsCount: 18,
    score: 1850,
    completedMissions: 6,
    badgesCount: 5,
  },
  {
    id: 'peer_2',
    name: 'Lucas Rocha',
    grade: '8º Ano A',
    school: 'CETi Central',
    avatarEmoji: '👦🏻',
    avatarBg: 'from-sky-400 to-blue-600',
    starsCount: 16,
    score: 1620,
    completedMissions: 5,
    badgesCount: 4,
  },
  {
    id: 'peer_3',
    name: 'Gabriel Santos',
    grade: '8º Ano B',
    school: 'CETi Central',
    avatarEmoji: '🧑🏼‍🦽',
    avatarBg: 'from-indigo-400 to-purple-600',
    starsCount: 15,
    score: 1480,
    completedMissions: 5,
    badgesCount: 4,
  },
  {
    id: 'peer_4',
    name: 'Mariana Lima',
    grade: '7º Ano A',
    school: 'CETi Central',
    avatarEmoji: '👩🏾',
    avatarBg: 'from-rose-400 to-pink-500',
    starsCount: 14,
    score: 1350,
    completedMissions: 4,
    badgesCount: 4,
  },
  {
    id: 'peer_5',
    name: 'Enzo Ferreira',
    grade: '7º Ano B',
    school: 'CETi Central',
    avatarEmoji: '🧑‍🎓',
    avatarBg: 'from-teal-400 to-emerald-500',
    starsCount: 13,
    score: 1220,
    completedMissions: 4,
    badgesCount: 3,
  },
  {
    id: 'peer_6',
    name: 'Beatriz Souza',
    grade: '8º Ano A',
    school: 'CETi Central',
    avatarEmoji: '🎨',
    avatarBg: 'from-purple-400 to-pink-500',
    starsCount: 11,
    score: 1040,
    completedMissions: 3,
    badgesCount: 3,
  },
  {
    id: 'peer_7',
    name: 'Pedro Álvares',
    grade: '7º Ano A',
    school: 'CETi Central',
    avatarEmoji: '🧒🏿',
    avatarBg: 'from-emerald-400 to-teal-600',
    starsCount: 10,
    score: 950,
    completedMissions: 3,
    badgesCount: 3,
  },
  {
    id: 'peer_8',
    name: 'Camila Duarte',
    grade: '8º Ano B',
    school: 'CETi Central',
    avatarEmoji: '🧑🏽‍🍳',
    avatarBg: 'from-orange-400 to-amber-600',
    starsCount: 9,
    score: 870,
    completedMissions: 2,
    badgesCount: 2,
  },
];

const LOCAL_STORAGE_KEY_CURRENT_STUDENT = 'saude_pratica_active_student_v1';
const LOCAL_STORAGE_KEY_ALL_STUDENTS = 'saude_pratica_saved_students_v1';

export const DEFAULT_STUDENT: StudentProfile = {
  id: 'student_default_1',
  name: 'Lucas Estudante',
  grade: '8º Ano A',
  school: 'CETi Central',
  avatarEmoji: '🧑‍🎓',
  avatarBg: 'from-teal-400 to-emerald-500',
  starsCount: 12,
  score: 1200,
  completedMissions: 3,
  platesBalanced: 4,
  activeMinutesTotal: 280,
  joinedAt: 'Hoje',
};

export const loadStoredStudent = (): StudentProfile => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_STUDENT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao carregar estudante do localStorage:', e);
  }
  return DEFAULT_STUDENT;
};

export const saveStoredStudent = (student: StudentProfile): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_STUDENT, JSON.stringify(student));
    
    // Also add/update in saved students list
    const saved = loadSavedStudentsList();
    const existingIndex = saved.findIndex((s) => s.id === student.id);
    if (existingIndex >= 0) {
      saved[existingIndex] = student;
    } else {
      saved.unshift(student);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_ALL_STUDENTS, JSON.stringify(saved.slice(0, 10)));
  } catch (e) {
    console.warn('Erro ao salvar estudante no localStorage:', e);
  }
};

export const loadSavedStudentsList = (): StudentProfile[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_ALL_STUDENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao carregar lista de estudantes:', e);
  }
  return [DEFAULT_STUDENT];
};
