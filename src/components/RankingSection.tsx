import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Star,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Target,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { StudentProfile, RankEntry } from '../types';
import { INITIAL_PEER_RANKINGS } from '../data/rankData';
import { playClickSound, playStarSound } from '../utils/audio';

interface RankingSectionProps {
  currentStudent: StudentProfile;
  onOpenLoginModal: () => void;
  onStartMission: () => void;
  isFocusedView?: boolean;
  onCloseFocus?: () => void;
}

export const RankingSection: React.FC<RankingSectionProps> = ({
  currentStudent,
  onOpenLoginModal,
  onStartMission,
  isFocusedView = true,
  onCloseFocus,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'class'>('all');
  const [sortBy, setSortBy] = useState<'stars' | 'score' | 'missions'>('stars');

  // Merge the current student into the rankings
  const combinedRankings = useMemo(() => {
    const userEntry: RankEntry = {
      id: currentStudent.id,
      name: currentStudent.name,
      grade: currentStudent.grade,
      school: currentStudent.school || 'CETi Central',
      avatarEmoji: currentStudent.avatarEmoji,
      avatarBg: currentStudent.avatarBg,
      starsCount: currentStudent.starsCount,
      score: currentStudent.score || currentStudent.starsCount * 100,
      completedMissions: currentStudent.completedMissions,
      badgesCount: 4,
      isCurrentUser: true,
    };

    // Filter peers if user has an existing peer id, replace or append
    const list = INITIAL_PEER_RANKINGS.filter((p) => p.id !== currentStudent.id);
    list.push(userEntry);

    // Apply class filter if selected
    let filtered = list;
    if (filterType === 'class') {
      filtered = list.filter((item) => item.grade === currentStudent.grade);
      // Ensure at least 3 entries in class for nice podium
      if (filtered.length < 3) {
        filtered = list;
      }
    }

    // Sort entries
    return filtered.sort((a, b) => {
      if (sortBy === 'stars') {
        return b.starsCount - a.starsCount || b.score - a.score;
      }
      if (sortBy === 'missions') {
        return b.completedMissions - a.completedMissions || b.starsCount - a.starsCount;
      }
      return b.score - a.score || b.starsCount - a.starsCount;
    });
  }, [currentStudent, filterType, sortBy]);

  // Find user rank
  const currentUserIndex = combinedRankings.findIndex((r) => r.isCurrentUser);
  const userRankPosition = currentUserIndex >= 0 ? currentUserIndex + 1 : 1;

  // Podium top 3
  const top1 = combinedRankings[0];
  const top2 = combinedRankings[1];
  const top3 = combinedRankings[2];

  // Difference to next position
  const nextAboveStudent = currentUserIndex > 0 ? combinedRankings[currentUserIndex - 1] : null;
  const starsToSurpass = nextAboveStudent ? nextAboveStudent.starsCount - currentStudent.starsCount + 1 : 0;

  return (
    <section className="bg-white/95 dark:bg-[#0f1b33]/95 rounded-3xl p-4 sm:p-6 border-2 border-teal-200/90 dark:border-blue-800 shadow-lg shadow-teal-900/5 dark:shadow-black/40 max-w-5xl mx-auto w-full relative overflow-hidden animate-in fade-in duration-200 transition-colors">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-teal-100 dark:border-blue-900/70">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 border-2 border-white dark:border-blue-700">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-none flex items-center gap-2">
              <span>Hall da Fama & Ranking</span>
              <span className="text-xs bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-black px-2 py-0.5 rounded-full">
                Temporada Escolar
              </span>
            </h2>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
              Pontuação saudável baseada em estrelas, missões resolvidas e pratos nutritivos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => {
              playClickSound();
              onOpenLoginModal();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-teal-800 dark:text-blue-200 bg-teal-50 dark:bg-blue-950/60 hover:bg-teal-100 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-blue-800 transition cursor-pointer"
            title="Trocar de estudante ou editar perfil"
          >
            <User className="w-3.5 h-3.5" />
            <span>Perfil: <strong>{currentStudent.name}</strong></span>
          </button>

          {isFocusedView && onCloseFocus && (
            <button
              onClick={onCloseFocus}
              className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#132240] hover:bg-slate-200 dark:hover:bg-[#1b2f56] px-3 py-1.5 rounded-xl border border-slate-300 dark:border-blue-800 transition cursor-pointer"
            >
              ← Voltar ao Jogo
            </button>
          )}
        </div>
      </div>

      {/* User Current Position Highlight Bar */}
      <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900 dark:from-blue-950 dark:via-[#0c1a36] dark:to-indigo-950 text-white shadow-md border border-blue-700/50 dark:border-blue-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${currentStudent.avatarBg} p-0.5 shadow-md flex items-center justify-center text-2xl`}>
              {currentStudent.avatarEmoji}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 text-amber-950 flex items-center justify-center font-black text-xs shadow-xs">
              #{userRankPosition}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black">{currentStudent.name}</span>
              <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                Seu Perfil
              </span>
            </div>
            <p className="text-xs text-teal-200 font-medium">
              {currentStudent.grade} • {currentStudent.school || 'CETi Central'}
            </p>
          </div>
        </div>

        {/* Stats & Encouragement */}
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
          <div className="text-center px-3 py-1.5 bg-white/10 rounded-xl border border-white/10">
            <span className="text-xs text-teal-200 block">Posição</span>
            <span className="text-lg font-black text-amber-300 font-mono">
              {userRankPosition}º Lugar
            </span>
          </div>

          <div className="text-center px-3 py-1.5 bg-white/10 rounded-xl border border-white/10">
            <span className="text-xs text-teal-200 block">Estrelas</span>
            <span className="text-lg font-black text-white font-mono flex items-center gap-1 justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
              {currentStudent.starsCount}
            </span>
          </div>

          <div className="text-center px-3 py-1.5 bg-white/10 rounded-xl border border-white/10">
            <span className="text-xs text-teal-200 block">Pontos XP</span>
            <span className="text-lg font-black text-emerald-300 font-mono">
              {currentStudent.score || currentStudent.starsCount * 100}
            </span>
          </div>

          <button
            onClick={() => {
              playStarSound();
              onStartMission();
            }}
            className="game-button-teal text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Ganhe mais estrelas para subir no ranking"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {starsToSurpass > 0
                ? `+${starsToSurpass} ⭐ p/ subir!`
                : 'Conquistar Estrelas'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Podium of Top 3 Champions */}
      <div className="my-5 p-4 sm:p-5 bg-gradient-to-b from-sky-50/80 to-teal-50/50 dark:from-[#0d1b34] dark:to-[#071120] rounded-3xl border border-teal-100 dark:border-blue-900/80 shadow-inner">
        <h3 className="text-center text-xs font-black text-teal-900 dark:text-blue-200 uppercase tracking-wider mb-4 flex items-center justify-center gap-1.5">
          <Crown className="w-4 h-4 text-amber-500" />
          <span>Pódio de Destaque da Escola</span>
        </h3>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto items-end pt-3">
          {/* 2nd Place (Silver) */}
          {top2 && (
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-1">
                <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-tr ${top2.avatarBg} p-0.5 shadow-md flex items-center justify-center text-xl sm:text-2xl`}>
                  {top2.avatarEmoji}
                </div>
                <div className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-500 border-2 border-white dark:border-slate-800 text-slate-800 dark:text-white flex items-center justify-center font-black text-[10px] shadow-xs">
                  🥈
                </div>
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-slate-100 truncate max-w-[90px] sm:max-w-[120px]">
                {top2.name}
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{top2.grade}</span>
              <div className="mt-1 flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400 bg-white dark:bg-[#132240] px-2 py-0.5 rounded-full border border-slate-200 dark:border-blue-800 shadow-xs">
                <span>⭐</span>
                <span>{top2.starsCount}</span>
              </div>
              {/* Silver Pillar */}
              <div className="w-full h-16 sm:h-20 mt-2 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-t-2xl flex items-center justify-center font-black text-slate-600 dark:text-slate-300 text-lg sm:text-xl shadow-xs">
                2º
              </div>
            </div>
          )}

          {/* 1st Place (Gold) */}
          {top1 && (
            <div className="flex flex-col items-center text-center z-10">
              <div className="relative mb-1">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Crown className="w-6 h-6 text-amber-500 fill-amber-400 filter drop-shadow-xs animate-bounce" />
                </div>
                <div className={`w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-tr ${top1.avatarBg} p-0.5 shadow-lg ring-4 ring-amber-300/60 dark:ring-amber-400/40 flex items-center justify-center text-2xl sm:text-3xl`}>
                  {top1.avatarEmoji}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 text-amber-950 flex items-center justify-center font-black text-xs shadow-xs">
                  🥇
                </div>
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-950 dark:text-white truncate max-w-[100px] sm:max-w-[130px]">
                {top1.name}
              </span>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{top1.grade}</span>
              <div className="mt-1 flex items-center gap-1 text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 px-2.5 py-0.5 rounded-full shadow-xs">
                <span>⭐</span>
                <span>{top1.starsCount}</span>
              </div>
              {/* Gold Pillar */}
              <div className="w-full h-24 sm:h-28 mt-2 bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-500 dark:from-amber-600 dark:via-amber-500 dark:to-yellow-600 border-2 border-amber-400 dark:border-amber-500 rounded-t-2xl flex items-center justify-center font-black text-amber-950 text-xl sm:text-2xl shadow-md">
                1º
              </div>
            </div>
          )}

          {/* 3rd Place (Bronze) */}
          {top3 && (
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-1">
                <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-tr ${top3.avatarBg} p-0.5 shadow-md flex items-center justify-center text-xl sm:text-2xl`}>
                  {top3.avatarEmoji}
                </div>
                <div className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-amber-600 border-2 border-white dark:border-slate-800 text-white flex items-center justify-center font-black text-[10px] shadow-xs">
                  🥉
                </div>
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-slate-100 truncate max-w-[90px] sm:max-w-[120px]">
                {top3.name}
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{top3.grade}</span>
              <div className="mt-1 flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400 bg-white dark:bg-[#132240] px-2 py-0.5 rounded-full border border-slate-200 dark:border-blue-800 shadow-xs">
                <span>⭐</span>
                <span>{top3.starsCount}</span>
              </div>
              {/* Bronze Pillar */}
              <div className="w-full h-12 sm:h-16 mt-2 bg-gradient-to-b from-amber-600/80 to-amber-700 dark:from-amber-800 dark:to-amber-900 border-2 border-amber-700/80 dark:border-amber-800 rounded-t-2xl flex items-center justify-center font-black text-white text-base sm:text-lg shadow-xs">
                3º
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Sorting Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
        {/* Class Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0b162b] rounded-2xl border border-slate-200 dark:border-blue-900/80 w-full sm:w-auto">
          <button
            onClick={() => {
              playClickSound();
              setFilterType('all');
            }}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              filterType === 'all'
                ? 'bg-white dark:bg-[#152547] text-teal-900 dark:text-blue-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Toda a Escola</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setFilterType('class');
            }}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              filterType === 'class'
                ? 'bg-white dark:bg-[#152547] text-teal-900 dark:text-blue-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Minha Turma ({currentStudent.grade})</span>
          </button>
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 w-full sm:w-auto justify-end">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Ordenar por:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white dark:bg-[#132240] border border-slate-300 dark:border-blue-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="stars">Mais Estrelas ⭐</option>
            <option value="score">Maior Pontuação XP</option>
            <option value="missions">Mais Missões Resolvidas 🎯</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="border border-slate-200 dark:border-blue-900/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0b162b] border-b border-slate-200 dark:border-blue-900/80 text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                <th className="py-2.5 px-3 text-center w-12">Posição</th>
                <th className="py-2.5 px-3">Estudante</th>
                <th className="py-2.5 px-3">Turma</th>
                <th className="py-2.5 px-3 text-center">Missões</th>
                <th className="py-2.5 px-3 text-center">Estrelas</th>
                <th className="py-2.5 px-3 text-right">Pontos XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-blue-950/80 text-xs">
              {combinedRankings.map((entry, idx) => {
                const position = idx + 1;
                const isCurrent = entry.isCurrentUser;

                return (
                  <tr
                    key={entry.id}
                    className={`transition ${
                      isCurrent
                        ? 'bg-blue-50/90 dark:bg-blue-950/60 font-black border-l-4 border-l-blue-600 dark:border-l-blue-400 ring-1 ring-blue-300 dark:ring-blue-700'
                        : 'hover:bg-slate-50/80 dark:hover:bg-[#132240]/50 font-medium'
                    }`}
                  >
                    {/* Position */}
                    <td className="py-3 px-3 text-center">
                      {position === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-xs">
                          1º
                        </span>
                      ) : position === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-black text-xs shadow-xs">
                          2º
                        </span>
                      ) : position === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white font-black text-xs shadow-xs">
                          3º
                        </span>
                      ) : (
                        <span className="font-bold text-slate-500 dark:text-slate-400 font-mono">
                          {position}º
                        </span>
                      )}
                    </td>

                    {/* Student Info */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${entry.avatarBg} flex items-center justify-center text-base shadow-xs shrink-0`}
                        >
                          {entry.avatarEmoji}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className={`truncate ${isCurrent ? 'text-teal-950 dark:text-blue-200 font-black' : 'text-slate-900 dark:text-slate-100'}`}>
                              {entry.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[9.5px] font-black bg-teal-600 dark:bg-blue-600 text-white px-1.5 py-0.2 rounded-md">
                                VOCÊ
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                            {entry.school || 'CETi Central'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Grade */}
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {entry.grade}
                    </td>

                    {/* Missions */}
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-[#0b162b] px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        <Target className="w-3 h-3 text-teal-600 dark:text-blue-400" />
                        {entry.completedMissions}
                      </span>
                    </td>

                    {/* Stars */}
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2.5 py-0.5 rounded-full text-xs font-black text-amber-700 dark:text-amber-300 shadow-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {entry.starsCount}
                      </span>
                    </td>

                    {/* XP Score */}
                    <td className="py-3 px-3 text-right font-mono font-black text-slate-800 dark:text-slate-100">
                      {entry.score} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Motivational Footer Banner */}
      <div className="mt-4 p-3 bg-emerald-50 dark:bg-[#0b162b] border border-emerald-200 dark:border-blue-800/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="font-medium text-[11.5px]">
            <strong>Aprendizado Cooperativo:</strong> Cada desafio que você completa fortalece a saúde da sua rotina e soma pontos para sua turma no ranking!
          </p>
        </div>

        <button
          onClick={() => {
            playStarSound();
            onStartMission();
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs shrink-0 cursor-pointer transition"
        >
          Jogar Missão Agora 🚀
        </button>
      </div>
    </section>
  );
};
