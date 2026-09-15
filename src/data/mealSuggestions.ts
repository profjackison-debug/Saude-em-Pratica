import { MealTimeId } from '../types';

export interface MealSuggestion {
  title: string;
  items: { foodId: string; portions: number }[];
}

export const MEAL_SUGGESTIONS: Record<MealTimeId, MealSuggestion[]> = {
  breakfast: [
    {
      title: '🥖 Pão na Chapa & Pingado (Clássico)',
      items: [
        { foodId: 'pao', portions: 1 },
        { foodId: 'manteiga', portions: 1 },
        { foodId: 'cafe_pingado', portions: 1 },
        { foodId: 'mamao', portions: 1 },
      ],
    },
    {
      title: '🌽 Cuscuz com Ovo & Café (Nordestino)',
      items: [
        { foodId: 'cuscuz', portions: 1 },
        { foodId: 'ovo_mexido', portions: 1 },
        { foodId: 'manteiga', portions: 1 },
        { foodId: 'cafe_preto', portions: 1 },
      ],
    },
    {
      title: '🫓 Tapioca com Queijo & Suco de Caju',
      items: [
        { foodId: 'tapioca', portions: 1 },
        { foodId: 'queijo', portions: 1 },
        { foodId: 'suco_caju', portions: 1 },
      ],
    },
    {
      title: '🥣 Mingau com Fruta (Nutritivo)',
      items: [
        { foodId: 'mingau_aveia', portions: 1 },
        { foodId: 'banana', portions: 1 },
        { foodId: 'queijo', portions: 1 },
      ],
    },
  ],
  lunch: [
    {
      title: '🍗 PF Tradicional (Arroz, Feijão & Frango)',
      items: [
        { foodId: 'arroz', portions: 1 },
        { foodId: 'feijao', portions: 1 },
        { foodId: 'frango', portions: 1 },
        { foodId: 'verduras', portions: 1 },
        { foodId: 'suco_laranja', portions: 1 },
      ],
    },
    {
      title: '🍍 Peixe com Salada & Suco de Abacaxi',
      items: [
        { foodId: 'arroz', portions: 1 },
        { foodId: 'feijao', portions: 1 },
        { foodId: 'peixe', portions: 1 },
        { foodId: 'verduras', portions: 1 },
        { foodId: 'suco_abacaxi_hortela', portions: 1 },
      ],
    },
    {
      title: '🍳 Almoço Popular com Ovo Frito & Farofa',
      items: [
        { foodId: 'arroz', portions: 1 },
        { foodId: 'feijao', portions: 1 },
        { foodId: 'ovo', portions: 1 },
        { foodId: 'farofa', portions: 1 },
        { foodId: 'suco_limao', portions: 1 },
      ],
    },
    {
      title: '🥩 Carne Moída com Mandioca & Suco de Maracujá',
      items: [
        { foodId: 'arroz', portions: 1 },
        { foodId: 'feijao', portions: 1 },
        { foodId: 'carne_bovina', portions: 1 },
        { foodId: 'mandioca', portions: 1 },
        { foodId: 'suco_maracuja', portions: 1 },
      ],
    },
  ],
  snack: [
    {
      title: '🥤 Suco de Goiaba & Pão de Queijo',
      items: [
        { foodId: 'pao_queijo', portions: 1 },
        { foodId: 'suco_goiaba', portions: 1 },
      ],
    },
    {
      title: '🥭 Suco de Manga Fresca & Biscoito Polvilho',
      items: [
        { foodId: 'suco_manga', portions: 1 },
        { foodId: 'biscoito_polvilho', portions: 1 },
      ],
    },
    {
      title: '🥥 Água de Coco & Salada de Frutas',
      items: [
        { foodId: 'agua_coco', portions: 1 },
        { foodId: 'maca', portions: 1 },
        { foodId: 'banana', portions: 1 },
      ],
    },
    {
      title: '🍿 Pipoca de Panela & Suco de Uva Integral',
      items: [
        { foodId: 'pipoca', portions: 1 },
        { foodId: 'suco_uva_integral', portions: 1 },
      ],
    },
  ],
  dinner: [
    {
      title: '🍲 Sopa Caseira de Legumes & Suco de Maracujá',
      items: [
        { foodId: 'sopa_legumes', portions: 1 },
        { foodId: 'pao', portions: 1 },
        { foodId: 'suco_maracuja', portions: 1 },
      ],
    },
    {
      title: '🥣 Canja de Galinha & Limonada Fresca',
      items: [
        { foodId: 'canja', portions: 1 },
        { foodId: 'pao', portions: 1 },
        { foodId: 'suco_limao', portions: 1 },
      ],
    },
    {
      title: '🍳 Omelete Rápido com Pão & Suco de Caju',
      items: [
        { foodId: 'omelete', portions: 1 },
        { foodId: 'pao', portions: 1 },
        { foodId: 'verduras', portions: 1 },
        { foodId: 'suco_caju', portions: 1 },
      ],
    },
  ],
};
