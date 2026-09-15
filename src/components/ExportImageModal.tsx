import React, { useRef, useEffect, useState } from 'react';
import { X, Download, Eye, Sparkles, Check } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface ExportImageModalProps {
  onClose: () => void;
}

export const ExportImageModal: React.FC<ExportImageModalProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Render high-res 16:9 1920x1080 canvas of the 2.5D game interface
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // Helper rounded rect
    const roundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      radius: number,
      fillColor: string,
      strokeColor?: string,
      strokeWidth?: number
    ) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fillStyle = fillColor;
      ctx.fill();
      if (strokeColor && strokeWidth) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }
    };

    // 1. Background (Light warm teal gradient)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#f0f7f7');
    bgGrad.addColorStop(0.5, '#e6f3f3');
    bgGrad.addColorStop(1, '#ddf0ee');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle ambient background pattern (circles)
    ctx.fillStyle = 'rgba(15, 118, 110, 0.03)';
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.arc((i * 180 + 90) % width, (i * 120 + 80) % height, 90, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Game Header (Top Bar)
    roundRect(40, 30, width - 80, 90, 24, '#ffffff', '#0f766e25', 2);

    // Logo Icon & Title
    roundRect(60, 48, 54, 54, 16, '#0f766e');
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨', 87, 75);

    // Title text
    ctx.textAlign = 'left';
    ctx.font = '900 32px "Outfit", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0f766e';
    ctx.fillText('Saúde em Prática', 130, 68);

    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Matemática, Alimentação e Movimento  •  Ensino Fundamental II e Médio', 130, 94);

    // Header Center: Progress Bar
    roundRect(750, 52, 420, 48, 16, '#f8fafc', '#cbd5e1', 1);
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('Progresso das Missões', 768, 70);

    ctx.fillStyle = '#0f766e';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('75%', 1120, 70);

    // Progress line
    roundRect(768, 80, 380, 10, 5, '#e2e8f0');
    roundRect(768, 80, 285, 10, 5, '#0d9488');

    // Header Stars & Badges
    roundRect(1200, 52, 130, 46, 14, '#fffbeb', '#fde68a', 2);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#b45309';
    ctx.fillText('⭐ 3 Estrelas', 1215, 80);

    roundRect(1345, 52, 140, 46, 14, '#faf5ff', '#e9d5ff', 2);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#6b21a8';
    ctx.fillText('🏅 2 Medalhas', 1358, 80);

    // Header Action Button: "Começar missão"
    const btnGrad = ctx.createLinearGradient(1510, 48, 1510, 102);
    btnGrad.addColorStop(0, '#14b8a6');
    btnGrad.addColorStop(1, '#0f766e');
    roundRect(1510, 48, 330, 54, 18, btnGrad as unknown as string, '#0d5a54', 2);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ Começar missão', 1675, 82);

    // ==========================================
    // THREE EXPLORATION PANELS (16:9 Horizontal Composition)
    // ==========================================
    const panelY = 145;
    const panelHeight = 890;

    // ------------------------------------------
    // AREA 1: DIÁRIO DE 4 REFEIÇÕES (CENTER MAIN FOCUS)
    // Position: Center, widest panel (x: 540, w: 840)
    // ------------------------------------------
    const cX = 530;
    const cW = 860;
    roundRect(cX, panelY, cW, panelHeight, 28, '#ffffff', '#0f766e40', 3);

    // Panel 1 Title & Challenge
    ctx.textAlign = 'left';
    roundRect(cX + 24, panelY + 22, 36, 36, 10, '#0f766e');
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('1', cX + 42, panelY + 45);

    ctx.textAlign = 'left';
    ctx.font = '900 24px "Outfit", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('DIÁRIO DE 4 REFEIÇÕES', cX + 72, panelY + 40);

    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#0d9488';
    ctx.fillText('MISSÃO PRINCIPAL', cX + 72, panelY + 58);

    // Challenge Pill: "Explore porções e proporções!"
    roundRect(cX + cW - 320, panelY + 22, 295, 40, 14, '#fef3c7', '#fcd34d', 2);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#92400e';
    ctx.fillText('💡 Explore porções e proporções!', cX + cW - 305, panelY + 47);

    // 4 Meal Tabs: Café da Manhã, Almoço, Lanche da Tarde, Jantar
    const tabs = ['Café da Manhã', 'Almoço (Ativo)', 'Lanche da Tarde', 'Jantar'];
    const tabW = (cW - 60) / 4;
    tabs.forEach((tabName, idx) => {
      const isSelected = idx === 1;
      const tX = cX + 24 + idx * (tabW + 4);
      roundRect(
        tX,
        panelY + 76,
        tabW,
        42,
        12,
        isSelected ? '#0f766e' : '#f1f5f9',
        isSelected ? undefined : '#cbd5e1',
        1
      );
      ctx.font = isSelected ? 'bold 14px sans-serif' : '600 13px sans-serif';
      ctx.fillStyle = isSelected ? '#ffffff' : '#475569';
      ctx.textAlign = 'center';
      ctx.fillText(tabName, tX + tabW / 2, panelY + 102);
    });

    // Dinner Table & Ceramic Plate
    const tableY = panelY + 135;
    roundRect(cX + 24, tableY, cW - 48, 380, 24, '#fff7ed', '#fed7aa', 2);

    ctx.textAlign = 'left';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#78350f';
    ctx.fillText('🍽️ Mesa de Refeição — Prato Brasileiro em 2.5D', cX + 44, tableY + 30);

    // Big 2.5D Plate (Center of table)
    const plateCenterX = cX + (cW - 48) / 2;
    const plateCenterY = tableY + 195;

    // Plate Outer Shadow
    ctx.beginPath();
    ctx.arc(plateCenterX, plateCenterY + 8, 140, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 118, 110, 0.12)';
    ctx.fill();

    // Plate Rim
    ctx.beginPath();
    ctx.arc(plateCenterX, plateCenterY, 140, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 12;
    ctx.stroke();
    ctx.fill();

    // Plate Base
    ctx.beginPath();
    ctx.arc(plateCenterX, plateCenterY, 120, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#99f6e4';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fill();

    // Foods placed on the plate with badges
    const plateFoods = [
      { name: 'Arroz Cozido', icon: '🍚', grams: '160g', x: plateCenterX - 55, y: plateCenterY - 45 },
      { name: 'Feijão Carioca', icon: '🫘', grams: '80g', x: plateCenterX + 45, y: plateCenterY - 45 },
      { name: 'Frango Grelhado', icon: '🍗', grams: '100g', x: plateCenterX - 45, y: plateCenterY + 45 },
      { name: 'Salada Colorida', icon: '🥗', grams: '80g', x: plateCenterX + 50, y: plateCenterY + 45 },
    ];

    plateFoods.forEach((food) => {
      roundRect(food.x - 48, food.y - 25, 96, 50, 12, '#ffffff', '#0d9488', 1.5);
      ctx.textAlign = 'center';
      ctx.font = '22px sans-serif';
      ctx.fillText(food.icon, food.x, food.y - 2);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#0f766e';
      ctx.fillText(`${food.name} (${food.grams})`, food.x, food.y + 16);
    });

    // Kitchen Scale (Balança de Cozinha)
    roundRect(cX + 44, tableY + 300, 260, 60, 16, '#0f172a', '#334155', 2);
    ctx.textAlign = 'left';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('⚖️ BALANÇA DE COZINHA', cX + 60, tableY + 324);
    ctx.font = '900 24px monospace';
    ctx.fillStyle = '#2dd4bf';
    ctx.fillText('420 g  •  560 kcal', cX + 60, tableY + 350);

    // Meal Proportions Donut / mini chart
    roundRect(cX + cW - 320, tableY + 300, 250, 60, 16, '#ffffff', '#e2e8f0', 1);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('Gráfico de Distribuição:', cX + cW - 305, tableY + 322);

    // 4 mini bar segments
    roundRect(cX + cW - 305, tableY + 334, 100, 14, 4, '#3b82f6');
    roundRect(cX + cW - 200, tableY + 334, 60, 14, 4, '#10b981');
    roundRect(cX + cW - 135, tableY + 334, 40, 14, 4, '#f97316');
    roundRect(cX + cW - 90, tableY + 334, 25, 14, 4, '#a855f7');

    // 4 Consistent Nutrient Cards (Blue, Green, Orange, Purple)
    const nutrientY = panelY + 530;
    const nW = (cW - 68) / 4;

    const nutrientData = [
      { name: 'Carboidratos', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', grams: '76.2g', icon: '🍞' },
      { name: 'Proteínas', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', grams: '41.5g', icon: '🥩' },
      { name: 'Gorduras', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', grams: '8.4g', icon: '🥑' },
      { name: 'Fibras', color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff', grams: '12.8g', icon: '🌾' },
    ];

    nutrientData.forEach((nut, i) => {
      const nX = cX + 24 + i * (nW + 6);
      roundRect(nX, nutrientY, nW, 105, 16, nut.bg, nut.border, 2);
      ctx.textAlign = 'left';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = nut.color;
      ctx.fillText(`${nut.icon} ${nut.name}`, nX + 14, nutrientY + 28);

      ctx.font = '900 26px monospace';
      ctx.fillText(nut.grams, nX + 14, nutrientY + 68);

      ctx.font = '600 11px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Valor verificado', nX + 14, nutrientY + 90);
    });

    // Brazilian Food Cards Grid (arroz, feijão, frango, pão, leite, queijo, frutas, verduras)
    const cardsY = nutrientY + 120;
    ctx.textAlign = 'left';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('🇧🇷 Cartas de Alimentos Brasileiros (Toque para montar o prato):', cX + 24, cardsY);

    const bCards = [
      { name: 'Arroz', icon: '🍚', grams: '100g' },
      { name: 'Feijão', icon: '🫘', grams: '80g' },
      { name: 'Frango', icon: '🍗', grams: '100g' },
      { name: 'Pão', icon: '🥖', grams: '50g' },
      { name: 'Leite', icon: '🥛', grams: '200ml' },
      { name: 'Queijo', icon: '🧀', grams: '30g' },
      { name: 'Banana', icon: '🍌', grams: '100g' },
      { name: 'Verduras', icon: '🥗', grams: '80g' },
    ];

    const cardW = (cW - 84) / 8;
    bCards.forEach((c, idx) => {
      const cardX = cX + 24 + idx * (cardW + 8);
      roundRect(cardX, cardsY + 12, cardW, 105, 14, '#ffffff', '#cbd5e1', 1.5);
      ctx.textAlign = 'center';
      ctx.font = '32px sans-serif';
      ctx.fillText(c.icon, cardX + cardW / 2, cardsY + 54);
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(c.name, cardX + cardW / 2, cardsY + 84);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#0d9488';
      ctx.fillText(c.grams, cardX + cardW / 2, cardsY + 102);
    });

    // Reference
    ctx.textAlign = 'right';
    ctx.font = 'italic 12px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Guia Alimentar para a População Brasileira', cX + cW - 24, panelY + panelHeight - 16);

    // ------------------------------------------
    // AREA 2: PESO E SAÚDE (LEFT LATERAL PANEL)
    // Position: Left (x: 40, w: 465)
    // ------------------------------------------
    const lX = 40;
    const lW = 465;
    roundRect(lX, panelY, lW, panelHeight, 28, '#ffffff', '#cbd5e1', 2);

    roundRect(lX + 20, panelY + 22, 36, 36, 10, '#4f46e5');
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('2', lX + 38, panelY + 45);

    ctx.textAlign = 'left';
    ctx.font = '900 22px "Outfit", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('PESO E SAÚDE', lX + 68, panelY + 40);

    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#6366f1';
    ctx.fillText('INVESTIGAÇÃO MATEMÁTICA', lX + 68, panelY + 56);

    // Banner: "Saúde vai além de um número"
    roundRect(lX + 20, panelY + 75, lW - 40, 68, 16, '#0f766e');
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.fillText('❤️ “Saúde vai além de um número”', lX + 36, panelY + 104);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#ccfbf1';
    ctx.fillText('Exploração de grandezas sem estigmas ou metas estéticas.', lX + 36, panelY + 128);

    // Readable Formula: IMC = massa (kg) ÷ altura² (m²)
    roundRect(lX + 20, panelY + 160, lW - 40, 85, 18, '#eef2ff', '#c7d2fe', 2);
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#4338ca';
    ctx.fillText('FÓRMULA MATEMÁTICA DE PROPORCIONALIDADE', lX + lW / 2, panelY + 185);

    ctx.font = '900 20px monospace';
    ctx.fillStyle = '#1e1b4b';
    ctx.fillText('IMC = massa (kg) ÷ altura² (m²)', lX + lW / 2, panelY + 218);

    // Diverse Fictional Adults cards
    ctx.textAlign = 'left';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('👥 Personagens Adultos Fictícios:', lX + 20, panelY + 275);

    const adults = [
      { name: 'Clara Mendes', role: 'Professora', m: '64kg', h: '1.65m', icon: '👩‍🏫' },
      { name: 'Marcos Souza', role: 'Agrônomo', m: '85kg', h: '1.82m', icon: '👨‍🌾' },
      { name: 'Beatriz Lima', role: 'Ciclista', m: '58kg', h: '1.70m', icon: '🚴‍♀️' },
      { name: 'Roberto Rocha', role: 'Marceneiro', m: '92kg', h: '1.76m', icon: '🧔' },
    ];

    adults.forEach((ad, i) => {
      const aY = panelY + 295 + i * 66;
      roundRect(lX + 20, aY, lW - 40, 56, 14, '#f8fafc', '#e2e8f0', 1);
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(ad.icon, lX + 32, aY + 38);
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(ad.name, lX + 76, aY + 26);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(ad.role, lX + 76, aY + 44);

      ctx.textAlign = 'right';
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#4338ca';
      ctx.fillText(`${ad.m} | ${ad.h}`, lX + lW - 36, aY + 34);
    });

    // Calculator and Ruler visual
    const calcY = panelY + 580;
    roundRect(lX + 20, calcY, lW - 40, 160, 20, '#0f172a', '#334155', 2);
    ctx.textAlign = 'left';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('🧮 CALCULADORA DE GRANDEZAS', lX + 38, calcY + 30);

    ctx.font = '14px monospace';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Massa: 64 kg  |  Altura: 1.65 m', lX + 38, calcY + 60);
    ctx.fillText('Altura²: 1.65 × 1.65 = 2.7225 m²', lX + 38, calcY + 86);

    roundRect(lX + 38, calcY + 104, lW - 76, 42, 12, '#1e293b');
    ctx.font = '900 20px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('IMC = 64 ÷ 2.72 = 23.5 kg/m²', lX + 54, calcY + 132);

    // Respect & Adolescent Note
    roundRect(lX + 20, panelY + 760, lW - 40, 105, 16, '#f8fafc', '#cbd5e1', 1);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('⚠️ Observação Curricular Ética:', lX + 34, panelY + 788);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Tabelas de IMC adulto não se aplicam a adolescentes.', lX + 34, panelY + 810);
    ctx.fillText('Estudantes avaliam crescimento por curvas de percentil,', lX + 34, panelY + 830);
    ctx.fillText('respeitando diversidade corporal e desenvolvimento biológico.', lX + 34, panelY + 850);

    // ------------------------------------------
    // AREA 3: SEMANA ATIVA (RIGHT LATERAL PANEL)
    // Position: Right (x: 1415, w: 465)
    // ------------------------------------------
    const rX = 1415;
    const rW = 465;
    roundRect(rX, panelY, rW, panelHeight, 28, '#ffffff', '#cbd5e1', 2);

    roundRect(rX + 20, panelY + 22, 36, 36, 10, '#059669');
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('3', rX + 38, panelY + 45);

    ctx.textAlign = 'left';
    ctx.font = '900 22px "Outfit", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('SEMANA ATIVA', rX + 68, panelY + 40);

    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#059669';
    ctx.fillText('MOVIMENTO & CONVIVÊNCIA', rX + 68, panelY + 56);

    // Inclusion Banner: Wheelchair student
    roundRect(rX + 20, panelY + 75, rW - 40, 68, 16, '#065f46');
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.fillText('♿ Atividades Inclusivas & Adaptadas', rX + 36, panelY + 104);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('Estudantes com diferentes habilidades praticando juntos.', rX + 36, panelY + 128);

    // Indicators: Minutos de Movimento, Média Diária, Fortalecimento
    const statW = (rW - 60) / 3;
    const stats = [
      { title: 'Total Minutos', val: '290 min', col: '#065f46', bg: '#ecfdf5' },
      { title: 'Média Diária', val: '41.4 min', col: '#047857', bg: '#f0fdf4' },
      { title: 'Fortalecimento', val: '3 dias', col: '#0f766e', bg: '#f0fdfa' },
    ];

    stats.forEach((st, i) => {
      const sX = rX + 20 + i * (statW + 10);
      roundRect(sX, panelY + 160, statW, 85, 16, st.bg, '#a7f3d0', 1.5);
      ctx.textAlign = 'center';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#065f46';
      ctx.fillText(st.title, sX + statW / 2, panelY + 186);

      ctx.font = '900 20px monospace';
      ctx.fillStyle = st.col;
      ctx.fillText(st.val, sX + statW / 2, panelY + 224);
    });

    // 7-day Calendar
    const calY = panelY + 265;
    ctx.textAlign = 'left';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('📅 Calendário de Sete Dias:', rX + 20, calY);

    const days = [
      { d: 'Seg', act: '🚶‍♂️ 60m', name: 'Caminhada & Futsal' },
      { d: 'Ter', act: '♿ 45m', name: 'Basquete Adaptado' },
      { d: 'Qua', act: '🚴‍♀️ 55m', name: 'Bicicleta & Escada' },
      { d: 'Qui', act: '💃 50m', name: 'Dança e Ritmo' },
      { d: 'Sex', act: '⚽ 60m', name: 'Vôlei & Circuito' },
      { d: 'Sáb', act: '🚴‍♀️ 60m', name: 'Ciclovia Parque' },
      { d: 'Dom', act: '🚶‍♂️ 35m', name: 'Passeio em Família' },
    ];

    days.forEach((day, i) => {
      const dY = calY + 14 + i * 58;
      roundRect(rX + 20, dY, rW - 40, 50, 14, '#f8fafc', '#e2e8f0', 1);

      roundRect(rX + 30, dY + 8, 50, 34, 10, '#047857');
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(day.d, rX + 55, dY + 30);

      ctx.textAlign = 'left';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.fillText(day.name, rX + 92, dY + 24);

      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#047857';
      ctx.fillText('Movimento alegre e cooperativo', rX + 92, dY + 42);

      ctx.textAlign = 'right';
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#065f46';
      ctx.fillText(day.act, rX + rW - 34, dY + 32);
    });

    // Vitality Principle: SEM COMPENSAÇÃO ALIMENTAR
    const vitY = panelY + 740;
    roundRect(rX + 20, vitY, rW - 40, 125, 18, '#ecfdf5', '#6ee7b7', 2);
    ctx.textAlign = 'left';
    ctx.font = '900 13px sans-serif';
    ctx.fillStyle = '#065f46';
    ctx.fillText('🌟 PRINCÍPIO PEDAGÓGICO DE OURO:', rX + 36, vitY + 32);

    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#047857';
    ctx.fillText('Movimento sem compensação alimentar.', rX + 36, vitY + 56);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#166534';
    ctx.fillText('O exercício físico NÃO é moeda de troca para comer.', rX + 36, vitY + 80);
    ctx.fillText('Movemo-nos para conviver, fortalecer ossos, mente e coração!', rX + 36, vitY + 102);

    // Save download URL
    try {
      const url = canvas.toDataURL('image/png');
      setDownloadUrl(url);
      setIsGenerated(true);
    } catch {
      // ignore
    }
  }, []);

  const handleDownload = () => {
    playClickSound();
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'saude_em_pratica_interface_16_9.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-[#0f1b33] rounded-3xl max-w-6xl w-full border-4 border-teal-500 dark:border-blue-600 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="bg-teal-800 dark:bg-blue-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 dark:bg-blue-700 flex items-center justify-center text-xl">
              🖼️
            </div>
            <div>
              <h3 className="text-lg font-black font-display">
                Imagem Conceitual da Interface do Jogo (16:9)
              </h3>
              <p className="text-xs text-teal-200 dark:text-blue-200 font-medium">
                Renderização em alta resolução (1920×1080) com os 3 painéis de exploração
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-white/20 text-teal-100 dark:text-blue-100 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview of Canvas */}
        <div className="p-4 bg-slate-100 dark:bg-[#0b162b] overflow-y-auto flex flex-col items-center justify-center">
          <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-300 dark:border-blue-900 bg-white aspect-video relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain block"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Proporção widescreen horizontal 16:9 • Vista frontal sem molduras ou marcas d'água
          </p>
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-white dark:bg-[#0f1b33] border-t border-slate-200 dark:border-blue-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-300 font-medium text-center sm:text-left">
            <span>Inclui: Refeições Diárias (centro), Peso e Saúde e Semana Ativa (laterais).</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#132240] rounded-xl border border-slate-200 dark:border-blue-800 transition cursor-pointer w-full sm:w-auto text-center"
            >
              Voltar ao Jogo Interativo
            </button>
            <button
              onClick={handleDownload}
              disabled={!isGenerated}
              className="game-button-teal text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Imagem PNG (1920×1080)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
