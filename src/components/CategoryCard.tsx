import React from 'react';
import { CategoryInfo } from '../types';
import { ArrowUpRight, TrendingUp, Layers, Cpu, ShieldCheck, Landmark, Activity, Compass } from 'lucide-react';

interface CategoryCardProps {
  category: CategoryInfo;
  isSelected?: boolean;
  onSelect: (slug: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onSelect,
}) => {
  // Icon selector based on slug
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'generative-infra':
        return <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'autonomous-finance':
        return <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'algorithmic-trading':
        return <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'enterprise-compliance':
        return <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'sovereign-funds':
        return <Compass className="w-5 h-5 text-amber-700 dark:text-amber-300" />;
      case 'bio-fintech':
        return <Activity className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      default:
        return <Layers className="w-5 h-5 text-stone-600 dark:text-stone-300" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(category.slug)}
      className={`group cursor-pointer rounded-xl p-5 border transition-all flex flex-col justify-between ${
        isSelected
          ? 'bg-stone-900 text-white dark:bg-stone-800 border-stone-900 dark:border-amber-400 ring-2 ring-stone-900/20 shadow-md'
          : 'bg-white dark:bg-stone-900/80 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${isSelected ? 'bg-stone-800 text-white' : 'bg-stone-100 dark:bg-stone-800'}`}>
            {getCategoryIcon(category.slug)}
          </div>
          <span className={`text-xs font-mono font-medium flex items-center gap-0.5 ${
            isSelected ? 'text-emerald-300' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            <TrendingUp className="w-3 h-3" />
            {category.growthYoY}
          </span>
        </div>

        <h3 className={`font-serif text-lg font-bold leading-snug ${
          isSelected ? 'text-white' : 'text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400'
        } transition-colors`}>
          {category.name}
        </h3>

        <p className={`mt-2 text-xs leading-relaxed line-clamp-2 ${
          isSelected ? 'text-stone-300' : 'text-stone-500 dark:text-stone-400'
        }`}>
          {category.description}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-stone-100 dark:border-stone-800/80">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className={`block text-[10px] font-mono uppercase ${
              isSelected ? 'text-stone-400' : 'text-stone-400 dark:text-stone-500'
            }`}>
              Capital Allocated
            </span>
            <span className={`font-mono text-sm font-semibold tabular-nums ${
              isSelected ? 'text-white' : 'text-stone-900 dark:text-stone-100'
            }`}>
              {category.totalVolume}
            </span>
          </div>

          <div>
            <span className={`block text-[10px] font-mono uppercase ${
              isSelected ? 'text-stone-400' : 'text-stone-400 dark:text-stone-500'
            }`}>
              Tracked Rounds
            </span>
            <span className={`font-mono text-sm font-semibold tabular-nums ${
              isSelected ? 'text-white' : 'text-stone-900 dark:text-stone-100'
            }`}>
              {category.dealCount} Deals
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span className={`truncate max-w-[180px] ${
            isSelected ? 'text-stone-400' : 'text-stone-500 dark:text-stone-400'
          }`}>
            Top: {category.topBackers.slice(0, 2).join(', ')}
          </span>
          <span className={`inline-flex items-center font-medium ${
            isSelected ? 'text-amber-300' : 'text-stone-900 dark:text-amber-400'
          } group-hover:translate-x-0.5 transition-transform`}>
            Explore <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
