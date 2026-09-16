import { StudentProfile, RankEntry } from '../types';

export interface AvatarOption {
  id: string;
  emoji: string;
  label: string;
  role: string;
  tag: string;
  badgeEmoji: string;
  bgColor: string;
  motto: string;
}

export const STUDENT_AVATARS: AvatarOption[] = [
  {
    id: 'student_1',
    emoji: '🧑‍🎓',
    label: 'Explorador',
    role: 'Lógica & Mente',
    tag: 'Lógica',
    badgeEmoji: '🧭',
    bgColor: 'from-emerald-400 via-teal-500 to-cyan-600',
    motto: 'Curioso e focado em desvendar os cálculos e mistérios da saúde!',
  },
  {
    id: 'student_2',
    emoji: '👩‍🔬',
    label: 'Cientista',
    role: 'Dados & Pesquisa',
    tag: 'Ciência',
    badgeEmoji: '🔬',
    bgColor: 'from-amber-400 via-orange-500 to-red-500',
    motto: 'Analisa proporções, tabelas nutricionais e dados com precisão.',
  },
  {
    id: 'student_3',
    emoji: '🏃‍♂️',
    label: 'Atleta',
    role: 'Energia & Foco',
    tag: 'Energia',
    badgeEmoji: '⚡',
    bgColor: 'from-sky-400 via-blue-500 to-indigo-600',
    motto: 'Movimento diário constante para alcançar a meta de minutos ativos!',
  },
  {
    id: 'student_4',
    emoji: '🏃‍♀️',
    label: 'Corredora',
    role: 'Ritmo & Velocidade',
    tag: 'Ritmo',
    badgeEmoji: '🔥',
    bgColor: 'from-rose-400 via-pink-500 to-purple-600',
    motto: 'Supera desafios a cada semana com determinação e dinamismo.',
  },
  {
    id: 'student_5',
    emoji: '🧑‍🦽',
    label: 'Campeão',
    role: 'Inclusão & Garra',
    tag: 'Inclusão',
    badgeEmoji: '🏆',
    bgColor: 'from-indigo-400 via-purple-500 to-violet-600',
    motto: 'Resiliência, inclusão e força de vontade para vencer qualquer desafio!',
  },
  {
    id: 'student_6',
    emoji: '🧑‍🌾',
    label: 'Nutri-Júnior',
    role: 'Horta & Alimentos',
    tag: 'Nutrição',
    badgeEmoji: '🥗',
    bgColor: 'from-teal-400 via-emerald-500 to-green-600',
    motto: 'Especialista em alimentos in natura e na montagem do prato colorido.',
  },
  {
    id: 'student_7',
    emoji: '🧑‍🍳',
    label: 'Chef Saudável',
    role: 'Culinária & Sabor',
    tag: 'Culinária',
    badgeEmoji: '🍳',
    bgColor: 'from-orange-400 via-amber-500 to-yellow-500',
    motto: 'Combina ingredientes saudáveis em receitas balanceadas e saborosas.',
  },
  {
    id: 'student_8',
    emoji: '🧑‍🎨',
    label: 'Criativo',
    role: 'Arte & Expressão',
    tag: 'Criativo',
    badgeEmoji: '🎨',
    bgColor: 'from-fuchsia-400 via-pink-500 to-rose-500',
    motto: 'Traz cor, originalidade e inovação para toda a jornada escolar.',
  },
];

export const GRADE_OPTIONS = [
  '9° Ano',
  '1° Ano E.M',
  '2° Ano E.M',
  '3° Ano E.M',
];

export const INITIAL_PEER_RANKINGS: RankEntry[] = [];

const LOCAL_STORAGE_KEY_CURRENT_STUDENT = 'saude_pratica_active_student_v2';
const LOCAL_STORAGE_KEY_ALL_STUDENTS = 'saude_pratica_saved_students_v2';
const PURGE_FLAG_KEY = 'saude_pratica_clean_slate_users_v2';

/**
 * Remove todos os estudantes cadastrados e dados de progresso associados
 * deixando o sistema 100% limpo, sem nenhum usuário logado ou salvo.
 */
export const purgeAllStudents = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_STUDENT);
      localStorage.removeItem(LOCAL_STORAGE_KEY_ALL_STUDENTS);
      localStorage.removeItem('saude_pratica_active_student_v1');
      localStorage.removeItem('saude_pratica_saved_students_v1');
      localStorage.removeItem('saude_pratica_badges_guest_v2');
      localStorage.removeItem('saude_pratica_solved_guest_v2');
      localStorage.removeItem('saude_pratica_meals_v2');
      localStorage.removeItem('saude_pratica_badges_v1');
      localStorage.removeItem('saude_pratica_solved_v1');
      localStorage.removeItem('saude_pratica_progress_v1');

      // Limpar chaves antigas de estudantes específicos
      const toRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (
          k &&
          (k.startsWith('saude_pratica_badges_student_') ||
            k.startsWith('saude_pratica_solved_student_') ||
            k.startsWith('saude_pratica_meals_student_') ||
            k.startsWith('saude_pratica_quiz_answers_'))
        ) {
          toRemove.push(k);
        }
      }
      toRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem('saude_pratica_quiz_answers_guest_v1');
      localStorage.setItem(PURGE_FLAG_KEY, 'true');
    }
  } catch {
    /* ignore */
  }
};

// Executa a limpeza inicial se ainda não tiver sido efetuada
if (typeof window !== 'undefined') {
  try {
    if (!localStorage.getItem(PURGE_FLAG_KEY)) {
      purgeAllStudents();
    }
  } catch {
    /* ignore */
  }
}

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
        if (parsed.id === 'student_default_1' || parsed.name === 'Lucas Estudante') {
          localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_STUDENT);
          return null;
        }
        const completedMissions = Number.isFinite(parsed.completedMissions) ? Math.max(0, parsed.completedMissions) : 0;
        const currentStars = Number.isFinite(parsed.starsCount) ? Math.max(0, parsed.starsCount) : 0;
        const finalStars = currentStars;
        const currentScore = Number.isFinite(parsed.score) ? Math.max(0, parsed.score) : finalStars * 100;
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
    localStorage.removeItem('saude_pratica_active_student_v1');
  } catch (e) {
    console.warn('Erro ao limpar estudante do localStorage:', e);
  }
};

export const removeSavedStudent = (studentId: string): void => {
  try {
    const saved = loadSavedStudentsList().filter((s) => s.id !== studentId);
    localStorage.setItem(LOCAL_STORAGE_KEY_ALL_STUDENTS, JSON.stringify(saved));
    const current = loadStoredStudent();
    if (current && current.id === studentId) {
      clearStoredStudent();
    }
  } catch (e) {
    console.warn('Erro ao remover estudante:', e);
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

    // Atualiza na lista de alunos salvos
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
            const finalStars = currentStars;
            const currentScore = Number.isFinite(s.score) ? Math.max(0, s.score) : finalStars * 100;
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
