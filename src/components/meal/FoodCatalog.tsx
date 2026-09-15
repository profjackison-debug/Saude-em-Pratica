import React from 'react';
import { Search, Plus } from 'lucide-react';
import { FoodItem, MealTimeId } from '../../types';
import { BRAZILIAN_FOODS } from '../../data/tacoData';
import { playClickSound } from '../../utils/audio';

type FoodFilterTab =
  | 'suggested'
  | 'all'
  | 'juices'
  | 'cereal'
  | 'meat'
  | 'dairy'
  | 'fruit'
  | 'vegetable'
  | 'beverage'
  | 'tuber';

interface FoodCatalogProps {
  activeMealId: MealTimeId;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeFilter: FoodFilterTab;
  onFilterChange: (filter: FoodFilterTab) => void;
  currentPlateItems: { food: FoodItem; portions: number }[];
  onAddFood: (food: FoodItem) => void;
  onSelectFoodInfo: (food: FoodItem) => void;
}

export type { FoodFilterTab };

export const FoodCatalog: React.FC<FoodCatalogProps> = ({
  activeMealId,
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  currentPlateItems,
  onAddFood,
  onSelectFoodInfo,
}) => {
  const filteredFoods = BRAZILIAN_FOODS.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'suggested') {
      return food.meals ? food.meals.includes(activeMealId) : true;
    }
    if (activeFilter === 'all') return true;
    if (activeFilter === 'juices') {
      return food.id.startsWith('suco_') || food.id === 'agua_coco';
    }
    if (activeFilter === 'cereal') return food.category === 'cereal' || food.category === 'bread';
    if (activeFilter === 'meat') return food.category === 'meat' || food.category === 'legume';
    if (activeFilter === 'dairy') return food.category === 'dairy';
    if (activeFilter === 'fruit') return food.category === 'fruit' || food.id.startsWith('suco_');
    if (activeFilter === 'vegetable') return food.category === 'vegetable';
    if (activeFilter === 'beverage')
      return food.category === 'beverage' || food.id.startsWith('suco_') || food.id === 'agua_coco';
    if (activeFilter === 'tuber') return food.category === 'tuber';
    return true;
  });

  return (
    <div className="lg:col-span-4 bg-slate-50/90 dark:bg-[#0b162b]/90 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-blue-900/80 flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-blue-100 uppercase tracking-wide flex items-center gap-1.5">
            <span>Alimentos Brasileiros</span>
            <span className="text-xs font-extrabold text-teal-700 dark:text-blue-300 bg-teal-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-teal-200 dark:border-blue-800">
              {filteredFoods.length}
            </span>
          </h3>
        </div>

        {/* Search Input */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar (suco, caju, arroz, feijão...)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#132240] border border-slate-200 dark:border-blue-800/80 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:border-blue-500 font-medium shadow-xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="grid grid-cols-2 gap-1.5 mb-2.5">
          <button
            onClick={() => {
              playClickSound();
              onFilterChange('suggested');
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeFilter === 'suggested'
                ? 'bg-teal-700 dark:bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#132240] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-blue-900/80 hover:bg-slate-100 dark:hover:bg-[#1b2f56]'
            }`}
          >
            <span>🌟</span>
            <span>Típicos desta refeição</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              onFilterChange('all');
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-teal-700 dark:bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#132240] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-blue-900/80 hover:bg-slate-100 dark:hover:bg-[#1b2f56]'
            }`}
          >
            <span>🌐</span>
            <span>Todos os alimentos</span>
          </button>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-2.5 scrollbar-thin">
          {[
            { id: 'juices', label: 'Sucos Naturais', icon: '🍹', highlight: true },
            { id: 'beverage', label: 'Bebidas & Cafés', icon: '☕' },
            { id: 'fruit', label: 'Frutas', icon: '🍎' },
            { id: 'cereal', label: 'Pães & Cereais', icon: '🥖' },
            { id: 'meat', label: 'Carnes & Ovos', icon: '🥩' },
            { id: 'dairy', label: 'Laticínios', icon: '🥛' },
            { id: 'vegetable', label: 'Verduras', icon: '🥬' },
            { id: 'tuber', label: 'Raízes/Tubérculos', icon: '🥔' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playClickSound();
                onFilterChange(cat.id as FoodFilterTab);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === cat.id
                  ? cat.id === 'juices'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                    : 'bg-slate-800 dark:bg-blue-600 text-white'
                  : cat.id === 'juices'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 font-extrabold'
                    : 'bg-white dark:bg-[#132240] border border-slate-200 dark:border-blue-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1b2f56]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Food Items Catalog */}
      <div className="mt-1 flex-1 max-h-[330px] overflow-y-auto space-y-2 pr-1">
        {filteredFoods.length === 0 ? (
          <div className="p-4 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-[#132240] rounded-xl border border-dashed border-slate-200 dark:border-blue-900">
            Nenhum alimento encontrado para esta busca.
          </div>
        ) : (
          filteredFoods.map((food) => {
            const itemInPlate = currentPlateItems.find((it) => it.food.id === food.id);
            return (
              <div
                key={food.id}
                className="p-2.5 sm:p-3 bg-white dark:bg-[#132240] hover:bg-teal-50/70 dark:hover:bg-[#1b2f56] border border-slate-200 dark:border-blue-900/80 hover:border-teal-300 dark:hover:border-blue-500 rounded-xl transition flex items-center justify-between gap-2.5 shadow-xs group"
              >
                <div
                  onClick={() => {
                    playClickSound();
                    onSelectFoodInfo(food);
                  }}
                  className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                  title="Clique para ver informações nutricionais e contexto"
                >
                  <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    {food.iconEmoji}
                  </span>
                  <div className="flex flex-col leading-tight truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 truncate group-hover:text-teal-800 dark:group-hover:text-blue-300">
                        {food.name}
                      </span>
                      {itemInPlate && (
                        <span className="bg-emerald-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                          {itemInPlate.portions}x
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      <span>{food.servingLabel}</span>
                      <span>•</span>
                      <span className="font-mono text-teal-700 dark:text-blue-300 font-bold">
                        {food.per100g.energyKcal} kcal/100g
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    onAddFood(food);
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-600 hover:bg-teal-500 dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-95 text-white flex items-center justify-center shadow-xs cursor-pointer shrink-0 transition"
                  title={`Adicionar ${food.name} ao prato`}
                >
                  <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-blue-900/60 text-center">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
          Toque no alimento para ver contexto e nutrientes
        </span>
      </div>
    </div>
  );
};
