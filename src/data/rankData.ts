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
  '6° Ano',
  '7° Ano',
  '8° Ano',
  '9° Ano',
  '1° Ano E.M',
  '2° Ano E.M',
  '3° Ano E.M',
];

export const INITIAL_PEER_RANKINGS: RankEntry[] = [];

const LOCAL_STORAGE_KEY_CURRENT_STUDENT = 'saude_pratica_active_student_v1';
const LOCAL_STORAGE_KEY_ALL_STUDENTS = 'saude_pratica_saved_students_v1';

export const loadStoredStudent = (): StudentProfile | null => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_STUDENT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed.id === 'string' &&
        typeof parsed.name === 'string' &&
        parsed.name.trim().length > 0
      ) {
        // Remover dados de usuário fictício de testes anteriores se existirem
        if (parsed.id === 'student_default_1' || parsed.name === 'Lucas Estudante') {
          localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_STUDENT);
          return null;
        }
        const completedMissions = Number.isFinite(parsed.completedMissions) ? Math.max(0, parsed.completedMissions) : 0;
        const currentStars = Number.isFinite(parsed.starsCount) ? Math.max(0, parsed.starsCount) : 0;
        // Cada missão concluída vale 4 perguntas/estrelas (totalizando 12 estrelas no jogo)
        const finalStars = Math.max(currentStars, completedMissions * 4);
        const currentScore = Number.isFinite(parsed.score) ? Math.max(0, parsed.score) : 0;
        const finalScore = Math.max(currentScore, finalStars * 100);

        return {
          ...parsed,
          name: parsed.name.trim().slice(0, 40),
          school: (parsed.school || 'CETi Agostinho Ernesto de Almeida').trim().slice(0, 50),
          starsCount: finalStars,
          score: finalScore,
          completedMissions,
        };
      }
    }
  } catch (e) {
    console.warn('Erro ao carregar estudante do localStorage:', e);
  }
  return null;
};

export const clearStoredStudent = (): void => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_STUDENT);
  } catch (e) {
    console.warn('Erro ao limpar estudante do localStorage:', e);
  }
};

export const saveStoredStudent = (student: StudentProfile): void => {
  try {
    const sanitizedStudent: StudentProfile = {
      ...student,
      name: (student.name || '').trim().slice(0, 40),
      school: (student.school || 'CETi Agostinho Ernesto de Almeida').trim().slice(0, 50),
      starsCount: Number.isFinite(student.starsCount) ? Math.max(0, student.starsCount) : 0,
      score: Number.isFinite(student.score) ? Math.max(0, student.score) : 0,
      completedMissions: Number.isFinite(student.completedMissions) ? Math.max(0, student.completedMissions) : 0,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_STUDENT, JSON.stringify(sanitizedStudent));

    // Also add/update in saved students list
    const saved = loadSavedStudentsList();
    const existingIndex = saved.findIndex((s) => s.id === sanitizedStudent.id);
    if (existingIndex >= 0) {
      saved[existingIndex] = sanitizedStudent;
    } else {
      saved.unshift(sanitizedStudent);
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
        const cleaned = parsed
          .filter(
            (s): s is StudentProfile =>
              Boolean(
                s &&
                typeof s.id === 'string' &&
                typeof s.name === 'string' &&
                s.name.trim().length > 0 &&
                s.id !== 'student_default_1' &&
                s.name !== 'Lucas Estudante'
              )
          )
          .map((s) => {
            const completedMissions = Number.isFinite(s.completedMissions) ? Math.max(0, s.completedMissions) : 0;
            const currentStars = Number.isFinite(s.starsCount) ? Math.max(0, s.starsCount) : 0;
            const finalStars = Math.max(currentStars, completedMissions * 4);
            const currentScore = Number.isFinite(s.score) ? Math.max(0, s.score) : 0;
            const finalScore = Math.max(currentScore, finalStars * 100);

            return {
              ...s,
              name: s.name.trim().slice(0, 40),
              school: (s.school || 'CETi Agostinho Ernesto de Almeida').trim().slice(0, 50),
              starsCount: finalStars,
              score: finalScore,
              completedMissions,
            };
          });

        if (cleaned.length !== parsed.length) {
          localStorage.setItem(LOCAL_STORAGE_KEY_ALL_STUDENTS, JSON.stringify(cleaned));
        }
        return cleaned;
      }
    }
  } catch (e) {
    console.warn('Erro ao carregar lista de estudantes:', e);
  }
  return [];
};
