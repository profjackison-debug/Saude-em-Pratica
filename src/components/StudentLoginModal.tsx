import React, { useState } from 'react';
import { X, User, Check, Sparkles, BookOpen, GraduationCap, ArrowRight, UserPlus, Users } from 'lucide-react';
import { StudentProfile } from '../types';
import { STUDENT_AVATARS, GRADE_OPTIONS, loadSavedStudentsList, saveStoredStudent } from '../data/rankData';
import { playClickSound, playStarSound, playFanfare } from '../utils/audio';

interface StudentLoginModalProps {
  currentStudent: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onLoginStudent: (student: StudentProfile) => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  currentStudent,
  isOpen,
  onClose,
  onLoginStudent,
}) => {
  const savedStudents = loadSavedStudentsList();

  const [activeTab, setActiveTab] = useState<'create' | 'saved'>(
    savedStudents.length > 1 ? 'saved' : 'create'
  );

  const [name, setName] = useState(currentStudent.name || '');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(
    STUDENT_AVATARS.find((a) => a.emoji === currentStudent.avatarEmoji)?.id || STUDENT_AVATARS[0].id
  );
  const [grade, setGrade] = useState<string>(currentStudent.grade || GRADE_OPTIONS[0]);
  const [school, setSchool] = useState<string>(currentStudent.school || 'CETi Central');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSelectSaved = (student: StudentProfile) => {
    playStarSound();
    onLoginStudent(student);
    onClose();
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Por favor, digite seu nome ou apelido de estudante!');
      return;
    }

    const selectedAvatar = STUDENT_AVATARS.find((a) => a.id === selectedAvatarId) || STUDENT_AVATARS[0];

    const newProfile: StudentProfile = {
      id: currentStudent.id && currentStudent.id !== 'student_default_1'
        ? currentStudent.id
        : `student_${Date.now()}`,
      name: name.trim(),
      grade,
      school: school.trim() || 'CETi Central',
      avatarEmoji: selectedAvatar.emoji,
      avatarBg: selectedAvatar.bgColor,
      starsCount: currentStudent.starsCount || 12,
      score: currentStudent.score || (currentStudent.starsCount ? currentStudent.starsCount * 100 : 1200),
      completedMissions: currentStudent.completedMissions || 3,
      platesBalanced: currentStudent.platesBalanced || 4,
      activeMinutesTotal: currentStudent.activeMinutesTotal || 280,
      joinedAt: currentStudent.joinedAt || 'Hoje',
    };

    playFanfare();
    saveStoredStudent(newProfile);
    onLoginStudent(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f1b33] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-teal-200 dark:border-blue-800 flex flex-col max-h-[92vh] transition-colors">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl shadow-inner">
                🎓
              </div>
              <div>
                <h3 className="text-xl font-black font-display tracking-tight leading-tight">
                  Área do Estudante
                </h3>
                <p className="text-xs text-blue-100 font-medium">
                  Identifique-se para salvar suas conquistas e ranking!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs (Cadastrar/Editar vs Selecionar Salvo) */}
          <div className="mt-4 flex items-center gap-2 p-1 bg-black/20 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('create');
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'create'
                  ? 'bg-white dark:bg-[#132240] text-teal-900 dark:text-blue-100 shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Novo / Editar Perfil</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('saved');
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-white dark:bg-[#132240] text-teal-900 dark:text-blue-100 shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Trocar de Aluno ({savedStudents.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-800 dark:text-slate-100">
          {activeTab === 'saved' ? (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Alunos cadastrados neste dispositivo:
              </div>

              <div className="grid grid-cols-1 gap-2">
                {savedStudents.map((student) => {
                  const isCurrent = student.id === currentStudent.id;
                  return (
                    <div
                      key={student.id}
                      onClick={() => handleSelectSaved(student)}
                      className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/70 shadow-xs'
                          : 'border-slate-200 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-[#132240]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${student.avatarBg} p-0.5 shadow-sm flex items-center justify-center text-xl`}
                        >
                          {student.avatarEmoji}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                              {student.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                Ativo agora
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {student.grade} • {student.school || 'CETi Central'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-1 rounded-xl">
                          <span>⭐</span>
                          <span>{student.starsCount || 0}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setName('');
                  setActiveTab('create');
                }}
                className="w-full mt-2 py-2.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Cadastrar Outro Estudante</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Escolha seu Avatar de Estudante
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
                  {STUDENT_AVATARS.map((avatar) => {
                    const isSelected = selectedAvatarId === avatar.id;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setSelectedAvatarId(avatar.id);
                        }}
                        className={`p-2 rounded-2xl border-2 flex flex-col items-center gap-1 transition cursor-pointer relative ${
                          isSelected
                            ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/80 shadow-md ring-2 ring-blue-400/40'
                            : 'border-slate-200 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-[#132240]'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${avatar.bgColor} flex items-center justify-center text-xl shadow-xs`}
                        >
                          {avatar.emoji}
                        </div>
                        <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                          {avatar.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Seu Nome ou Apelido <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Lucas Rocha, Ana Clara..."
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-blue-800 bg-white dark:bg-[#132240] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm font-bold text-slate-900 dark:text-white transition"
                />
                {errorMessage && (
                  <p className="text-xs font-bold text-rose-500 mt-1">{errorMessage}</p>
                )}
              </div>

              {/* Grade & School Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Turma / Série
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-blue-800 focus:border-blue-500 outline-none text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#132240]"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g} className="bg-white dark:bg-[#0f1b33] text-slate-800 dark:text-slate-100">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Escola
                  </label>
                  <input
                    type="text"
                    placeholder="CETi Central"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-blue-800 bg-white dark:bg-[#132240] focus:border-blue-500 outline-none text-xs font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Pedagogical Note */}
              <div className="p-3 bg-blue-50 dark:bg-[#0b162b] border border-blue-200 dark:border-blue-800 rounded-2xl flex items-start gap-2 text-blue-950 dark:text-blue-200 text-xs">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[11.5px] leading-relaxed font-medium">
                  Seu perfil salvará suas <strong>estrelas acumuladas</strong>, desafios matemáticos concluídos e posição no <strong>Ranking da Turma</strong>!
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full game-button-teal text-white font-extrabold text-sm py-3 px-5 rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <span>Entrar no Jogo & Salvar Perfil</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
