import React from 'react';
import { X, BookOpen, Users, Star, BarChart3, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface CategoryInfoModalProps {
  category: 'aprender' | 'colaborar' | 'conquistar' | 'evoluir';
  onClose: () => void;
  starsCount: number;
}

export const CategoryInfoModal: React.FC<CategoryInfoModalProps> = ({
  category,
  onClose,
  starsCount,
}) => {
  const contentMap = {
    aprender: {
      title: 'Aprender: Conceitos & Saberes',
      subtitle: 'Matemática e Ciências da Natureza em diálogo',
      icon: <BookOpen className="w-6 h-6 text-purple-600" />,
      headerBg: 'bg-purple-600',
      badgeBg: 'bg-purple-100 text-purple-800',
      sections: [
        {
          title: 'Grandezas e Proporções',
          desc: 'Aprenda a analisar razões matemáticas entre massa e altura, proporções de nutrientes no prato e frações do dia dedicadas ao movimento.',
        },
        {
          title: 'Tabela TACO / UNICAMP',
          desc: 'Todos os valores nutricionais do jogo são reais, extraídos da 4ª edição da Tabela Brasileira de Composição de Alimentos.',
        },
        {
          title: 'Educação para a Saúde',
          desc: 'Compreenda a função vital dos carboidratos, proteínas, gorduras e fibras no organismo sem estigmas estéticos.',
        },
      ],
    },
    colaborar: {
      title: 'Colaborar: Convivência & Empatia',
      subtitle: 'Ninguém fica para trás na prática saudável',
      icon: <Users className="w-6 h-6 text-rose-600" />,
      headerBg: 'bg-rose-600',
      badgeBg: 'bg-rose-100 text-rose-800',
      sections: [
        {
          title: 'Movimento Inclui Todos',
          desc: 'Práticas corporais adaptadas para colegas com deficiência física e mobilidade reduzida, garantindo alegria e inclusão plena.',
        },
        {
          title: 'Troca de Ideias em Equipe',
          desc: 'Monte refeições equilibradas coletivamente em sala de aula, comparando custos e acessibilidade dos alimentos da sua região.',
        },
        {
          title: 'Respeito à Diversidade Corporal',
          desc: 'Corpos humanos possuem biotipos, ritmos de crescimento e histórias diferentes. A saúde nunca é padronizada.',
        },
      ],
    },
    conquistar: {
      title: 'Conquistar: Desafios & Missões',
      subtitle: 'Resolva problemas matemáticos e ganhe medalhas',
      icon: <Star className="w-6 h-6 text-amber-500" />,
      headerBg: 'bg-amber-500',
      badgeBg: 'bg-amber-100 text-amber-800',
      sections: [
        {
          title: `${starsCount} Estrelas Acumuladas`,
          desc: 'Cada problema de razão, porcentagem ou regra de três resolvido rende estrelas para o seu perfil de estudante!',
        },
        {
          title: 'Medalhas Pedagógicas',
          desc: 'Desbloqueie condecorações de Investigação Científica, Trabalho Colaborativo e Participação Ativa.',
        },
        {
          title: 'Metas Sem Punição',
          desc: 'O objetivo é aprender com entusiasmo, experimentando diferentes porções e rotinas de movimento.',
        },
      ],
    },
    evoluir: {
      title: 'Evoluir: Gráficos & Estatísticas',
      subtitle: 'Acompanhe seu histórico de exploração',
      icon: <BarChart3 className="w-6 h-6 text-teal-600" />,
      headerBg: 'bg-teal-600',
      badgeBg: 'bg-teal-100 text-teal-800',
      sections: [
        {
          title: 'Média Aritmética Semanal',
          desc: 'Calcule a média diária de minutos em movimento dividindo o somatório da semana por 7 dias.',
        },
        {
          title: 'Distribuição dos Macronutrientes',
          desc: 'Observe como o gráfico em anel varia dinamicamente conforme você adiciona feijão, arroz, frango e legumes.',
        },
        {
          title: 'Fortalecimento Musculoesquelético',
          desc: 'A Organização Mundial da Saúde (OMS) orienta pelo menos 3 dias de fortalecimento ósseo e muscular para jovens.',
        },
      ],
    },
  };

  const item = contentMap[category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0f1b33] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-blue-800 transition-colors">
        {/* Modal Header */}
        <div className={`${item.headerBg} text-white p-5 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg font-black">{item.title}</h3>
              <p className="text-xs text-white/80">{item.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-slate-800 dark:text-slate-100">
          {item.sections.map((sec, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 dark:bg-[#132240] border border-slate-200 dark:border-blue-800 rounded-2xl flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{sec.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{sec.desc}</p>
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-md cursor-pointer transition"
          >
            Entendido, continuar jogando!
          </button>
        </div>
      </div>
    </div>
  );
};
