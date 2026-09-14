import { FoodItem, MealTimeId } from '../types';

export interface MealEducationalTip {
  id: string;
  badge: string;
  badgeColor: string; // Tailwind class string for badge
  title: string;
  explanation: string;
  nutrientsInvolved: string[];
  healthBenefit: string;
  actionableAdvice: string;
}

export interface MealSlotAnalysis {
  totalGrams: number;
  totalKcal: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
  fiberG: number;
  hasRice: boolean;
  hasBeans: boolean;
  hasFruitOrCitrus: boolean;
  hasDairyOrEgg: boolean;
  hasGreensOrVegetables: boolean;
  hasMeatOrFish: boolean;
  hasRootsOrBread: boolean;
  hasCoffeeOrTea: boolean;
}

export function analyzePlateComposition(
  items: { food: FoodItem; portions: number }[]
): MealSlotAnalysis {
  let totalGrams = 0;
  let totalKcal = 0;
  let carbsG = 0;
  let proteinG = 0;
  let fatG = 0;
  let fiberG = 0;

  let hasRice = false;
  let hasBeans = false;
  let hasFruitOrCitrus = false;
  let hasDairyOrEgg = false;
  let hasGreensOrVegetables = false;
  let hasMeatOrFish = false;
  let hasRootsOrBread = false;
  let hasCoffeeOrTea = false;

  for (const { food, portions } of items) {
    const itemG = food.servingSizeGrams * portions;
    totalGrams += itemG;
    totalKcal += (food.per100g.energyKcal * itemG) / 100;
    carbsG += (food.per100g.carbsG * itemG) / 100;
    proteinG += (food.per100g.proteinG * itemG) / 100;
    fatG += (food.per100g.fatG * itemG) / 100;
    fiberG += (food.per100g.fiberG * itemG) / 100;

    const id = food.id;
    const cat = food.category;

    if (id === 'arroz') hasRice = true;
    if (id === 'feijao') hasBeans = true;
    if (cat === 'fruit' || id.includes('suco') || id === 'laranja' || id === 'banana' || id === 'maca' || id === 'mamao') {
      hasFruitOrCitrus = true;
    }
    if (id.includes('leite') || id.includes('queijo') || id.includes('ovo') || id.includes('iogurte') || cat === 'dairy') {
      hasDairyOrEgg = true;
    }
    if (cat === 'vegetable' || id === 'verduras' || id.includes('cenoura') || id.includes('sopa')) {
      hasGreensOrVegetables = true;
    }
    if (cat === 'meat' || id === 'frango' || id === 'peixe' || id === 'carne_bovina') {
      hasMeatOrFish = true;
    }
    if (cat === 'bread' || cat === 'cereal' || cat === 'tuber' || id === 'pao' || id === 'cuscuz' || id === 'tapioca' || id === 'mandioca' || id === 'pipoca') {
      hasRootsOrBread = true;
    }
    if (id.includes('cafe') || id.includes('cha')) {
      hasCoffeeOrTea = true;
    }
  }

  return {
    totalGrams,
    totalKcal: Math.round(totalKcal),
    carbsG: Number(carbsG.toFixed(1)),
    proteinG: Number(proteinG.toFixed(1)),
    fatG: Number(fatG.toFixed(1)),
    fiberG: Number(fiberG.toFixed(1)),
    hasRice,
    hasBeans,
    hasFruitOrCitrus,
    hasDairyOrEgg,
    hasGreensOrVegetables,
    hasMeatOrFish,
    hasRootsOrBread,
    hasCoffeeOrTea,
  };
}

/**
 * Generates tailored educational tips for a specific meal slot and its current foods.
 */
export function getMealNutritionalTips(
  mealId: MealTimeId,
  items: { food: FoodItem; portions: number }[]
): MealEducationalTip[] {
  const analysis = analyzePlateComposition(items);
  const tips: MealEducationalTip[] = [];

  // ========================================================
  // 1. Specific Nutrient Combinations in the Current Plate
  // ========================================================

  // Case A: Arroz + Feijão
  if (analysis.hasRice && analysis.hasBeans) {
    tips.push({
      id: 'arroz_feijao_combo',
      badge: '🧬 Dupla Perfeita',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800',
      title: 'Arroz com Feijão: Química Biológica Nota 10!',
      explanation:
        'O feijão é rico no aminoácido lisina, mas tem pouca metionina. Já o arroz tem muita metionina e pouca lisina. Quando consumidos juntos neste prato, seus aminoácidos se completam perfeitamente para formar proteínas completas de alta qualidade!',
      nutrientsInvolved: ['Lisina (Feijão)', 'Metionina (Arroz)', 'Fibras Vegetais', 'Ferro'],
      healthBenefit: 'Reparação muscular, síntese celular e suporte ao crescimento no estirão escolar.',
      actionableAdvice: 'Mantenha a proporção tradicional brasileira de 2 partes de arroz para 1 de feijão.',
    });
  }

  // Case B: Vitamina C (Fruta/Suco) + Ferro de Vegetais/Feijão
  if (analysis.hasFruitOrCitrus && (analysis.hasBeans || analysis.hasGreensOrVegetables)) {
    tips.push({
      id: 'vit_c_iron_synergy',
      badge: '⚡ Absorção Potencializada',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800',
      title: 'Vitamina C + Ferro: Sinergia Contra a Fadiga!',
      explanation:
        'O ferro presente em vegetais e leguminosas (ferro não-heme) é mais difícil de absorver pelo intestino. Porém, a Vitamina C das frutas e sucos do seu prato converte quimicamente o ferro, multiplicando sua taxa de absorção celular em até 3 vezes!',
      nutrientsInvolved: ['Vitamina C (Ácido Ascórbico)', 'Ferro Não-Heme', 'Flavonoides'],
      healthBenefit: 'Oxigenação cerebral eficiente, combate à anemia e mais ânimo para as aulas.',
      actionableAdvice: 'Finalizar a refeição com uma fruta cítrica (como laranja ou caju) é um hábito de ouro.',
    });
  }

  // Case C: Alto Teor de Fibras (>= 4g)
  if (analysis.fiberG >= 4) {
    tips.push({
      id: 'high_fiber_smart',
      badge: '🌱 Digestão & Saciedade',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800',
      title: `${analysis.fiberG}g de Fibras: Foco Sem Picos de Sonolência`,
      explanation:
        'Os alimentos ricos em fibras que você escolheu criam uma digestão gradual. Em vez da glicose entrar toda de uma vez na corrente sanguínea (o que causaria aquele "sono pesado" pós-refeição), a energia é liberada de forma constante e contínua.',
      nutrientsInvolved: ['Fibras Solúveis e Insolúveis', 'Amido Resistente'],
      healthBenefit: 'Flora intestinal saudável, controle glicêmico e concentração prolongada nos estudos.',
      actionableAdvice: 'Beba sempre bastante água ao longo do dia para que as fibras funcionem com máxima eficácia.',
    });
  }

  // Case D: Presença de Proteínas Estruturais (Ovos, Carnes, Peixe ou Queijo)
  if (analysis.hasDairyOrEgg || analysis.hasMeatOrFish) {
    tips.push({
      id: 'protein_growth',
      badge: '💪 Estrutura & Músculos',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800',
      title: 'Proteínas & Minerais para a Juventude em Desenvolvimento',
      explanation:
        'As proteínas selecionadas fornecem os blocos de construção (aminoácidos) que o seu corpo usa para renovar tecidos, produzir hormônios e sintetizar anticorpos para o sistema imunológico mantê-lo protegido.',
      nutrientsInvolved: ['Proteínas de Alto Valor Biológico', 'Cálcio', 'Zinco', 'Vitamina B12'],
      healthBenefit: 'Fortalecimento de ossos, dentes, músculos e resposta imune rápida a infecções.',
      actionableAdvice: 'Alterne fontes de proteínas entre carnes magras, peixes, ovos e leguminosas ao longo da semana.',
    });
  }

  // Case E: Carboidratos Complexos como Energia Cerebral
  if (analysis.carbsG >= 30) {
    tips.push({
      id: 'brain_energy_carbs',
      badge: '🧠 Combustível Cerebral',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/80 dark:text-sky-200 dark:border-sky-800',
      title: `${analysis.carbsG}g de Carboidratos: O Alimento dos Seus Neurônios`,
      explanation:
        'O cérebro consome cerca de 20% de toda a energia do corpo humano em repouso, utilizando exclusivamente glicose como combustível. Os carboidratos da sua refeição garantem raciocínio rápido para cálculos matemáticos e retenção de memória.',
      nutrientsInvolved: ['Glicose', 'Amido', 'Vitaminas do Complexo B'],
      healthBenefit: 'Agilidade cognitiva, tempo de reação rápido e disposição nas atividades físicas.',
      actionableAdvice: 'Prefira fontes naturais e tradicionais de carboidratos como arroz, feijão, milho e mandioca.',
    });
  }

  // ========================================================
  // 2. Meal-Specific Pedagogical Tips (Guia Alimentar)
  // ========================================================
  if (mealId === 'breakfast') {
    tips.push({
      id: 'breakfast_pedagogical_core',
      badge: '☀️ Desjejum Escolar',
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800',
      title: 'Café da Manhã: Quebrando o Jejum da Noite',
      explanation:
        'Após 8 a 10 horas de sono, o corpo esgota as reservas de glicogênio hepático. Tomar um café da manhã nutritivo acorda o metabolismo, previne dores de cabeça na escola e melhora a atenção no primeiro período de aula.',
      nutrientsInvolved: ['Cálcio (Leite/Queijo)', 'Carboidratos (Pão/Cuscuz)', 'Vitamina C (Frutas)'],
      healthBenefit: 'Melhor rendimento escolar matutino e humor equilibrado durante a manhã.',
      actionableAdvice: 'Mesmo com pressa, consuma pelo menos uma fruta e uma fonte de carboidrato ou leite antes de sair!',
    });
    tips.push({
      id: 'breakfast_calcium_fact',
      badge: '🦴 Formação Óssea',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/80 dark:text-teal-200 dark:border-teal-800',
      title: 'Cálcio Matinal: Investimento para a Vida Toda',
      explanation:
        'Mais de 90% da massa óssea do ser humano é construída até o final da adolescência. O cálcio ingerido no café da manhã (seja pelo leite, queijo ou iogurte) é fixado diretamente nos ossos em crescimento.',
      nutrientsInvolved: ['Cálcio', 'Fósforo', 'Vitamina D'],
      healthBenefit: 'Ossos fortes, prevenção de fraturas e dentes resistentes a cáries.',
      actionableAdvice: 'Combine o café com leite a um pedaço de queijo branco ou cuscuz nordestino com ovo.',
    });
  } else if (mealId === 'lunch') {
    tips.push({
      id: 'lunch_plate_rule',
      badge: '🍽️ Regra do Prato Colorido',
      badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800',
      title: 'A Geometria do Prato Saudável (Divisão em 4 Partes)',
      explanation:
        'O Guia Alimentar recomenda que metade (50%) do prato do almoço seja ocupada por verduras e legumes variados, 1/4 (25%) por carboidratos (arroz, batata ou mandioca) e 1/4 (25%) por proteínas (feijão + carne, peixe ou ovos).',
      nutrientsInvolved: ['Fibras', 'Antioxidantes', 'Proteínas', 'Carboidratos Complexos'],
      healthBenefit: 'Equilíbrio calórico natural, fornecendo micronutrientes essenciais sem sobrepeso.',
      actionableAdvice: 'Tente colocar pelo menos 3 cores diferentes de vegetais no seu prato hoje!',
    });
    tips.push({
      id: 'lunch_hydration_water',
      badge: '💧 Hidratação & Digestão',
      badgeColor: 'bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-950/70 dark:text-sky-200 dark:border-sky-800',
      title: 'Bebidas no Almoço: O Papel dos Sucos Naturais',
      explanation:
        'Sucos de frutas brasileiras da estação (como maracujá, caju, laranja ou limão) hidratam o organismo e fornecem eletrólitos naturais, sendo opções muito superiores a refrigerantes ultraprocessados cheios de açúcar.',
      nutrientsInvolved: ['Eletrólitos', 'Água', 'Vitamina C', 'Potássio'],
      healthBenefit: 'Regulação da temperatura corporal e digestão mais leve.',
      actionableAdvice: 'Prefira sucos frescos sem adição excessiva de açúcar refinado para valorizar o sabor natural da fruta.',
    });
  } else if (mealId === 'snack') {
    tips.push({
      id: 'snack_pedagogical_smart',
      badge: '🥪 Pausa da Tarde',
      badgeColor: 'bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950/70 dark:text-orange-200 dark:border-orange-800',
      title: 'Lanche da Tarde: Ponte Estratégica Entre Almoço e Jantar',
      explanation:
        'Um lanche intermediário à tarde estabiliza os níveis de insulina e glicose no sangue, evitando que o aluno chegue ao jantar faminto e coma porções exageradas. Frutas, pipoca e vitaminas caseiras são escolhas campeãs.',
      nutrientsInvolved: ['Carboidratos de Absorção Média', 'Fibras Solúveis', 'Água'],
      healthBenefit: 'Disposição para deveres de casa, treinos esportivos e brincadeiras ativas.',
      actionableAdvice: 'A pipoca de panela feita com pouco óleo e milho integral é rica em polifenóis antioxidantes e fibras!',
    });
  } else if (mealId === 'dinner') {
    tips.push({
      id: 'dinner_sleep_repair',
      badge: '🌙 Nutrição Noturna',
      badgeColor: 'bg-indigo-100 text-indigo-950 border-indigo-300 dark:bg-indigo-950/70 dark:text-indigo-200 dark:border-indigo-800',
      title: 'Jantar Saudável: O Segredo de um Sono Reparador',
      explanation:
        'Refeições noturnas leves contendo vegetais cozidos, sopas, pão com queijo ou tapioca nutrem as células sem sobrecarregar o trato digestivo, permitindo que o organismo libere o hormônio do crescimento (GH) durante o sono profundo.',
      nutrientsInvolved: ['Triptofano', 'Magnésio', 'Vitaminas do Complexo B'],
      healthBenefit: 'Facilidade para adormecer, descanso mental e regeneração física noturna.',
      actionableAdvice: 'Tente jantar pelo menos 1h30 a 2h antes de deitar para dormir com a digestão concluída.',
    });
  }

  // If no specific item conditions matched (empty plate)
  if (items.length === 0) {
    tips.unshift({
      id: 'empty_plate_guidance',
      badge: '🎯 Comece a Montar',
      badgeColor: 'bg-teal-100 text-teal-950 border-teal-300 dark:bg-teal-950/80 dark:text-teal-200 dark:border-teal-800',
      title: `Como Montar o Prato Ideal de ${mealId === 'breakfast' ? 'Café da Manhã' : mealId === 'lunch' ? 'Almoço' : mealId === 'snack' ? 'Lanche da Tarde' : 'Jantar'}`,
      explanation:
        'Selecione alimentos na coluna da esquerda e toque no botão "+" para adicioná-los. Observe a balança digital calcular os gramas e o gráfico de rosca revelar o equilíbrio exato entre carboidratos, proteínas, gorduras e fibras!',
      nutrientsInvolved: ['Carboidratos', 'Proteínas', 'Gorduras Boas', 'Fibras'],
      healthBenefit: 'Autonomia alimentar e consciência matemática sobre a quantidade e qualidade da comida.',
      actionableAdvice: 'Use as sugestões rápidas acima se quiser inspiração de pratos típicos brasileiros!',
    });
  }

  return tips;
}
