import React, { useState } from 'react';
import { TickerDeal } from '../types';
import { Pause, Play, ChevronRight, Zap } from 'lucide-react';

interface DealTickerProps {
  deals: TickerDeal[];
  onSelectDeal: (dealId: string) => void;
}

export const DealTicker: React.FC<DealTickerProps> = ({ deals, onSelectDeal }) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full bg-stone-900 text-stone-100 border-b border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Fixed Title Label */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-stone-950 border-r border-stone-800 font-mono text-[11px] uppercase tracking-wider text-amber-400 select-none">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold hidden sm:inline">Dealflow Wire</span>
          <span className="font-semibold sm:hidden">Wire</span>
        </div>

        {/* Scrolling or Flex Items */}
        <div 
          className="relative overflow-x-auto no-scrollbar flex-1 flex items-center divide-x divide-stone-800/80 py-2 px-2 scroll-smooth"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center gap-6 shrink-0 px-2">
            {deals.map((deal) => (
              <button
                key={deal.id}
                onClick={() => onSelectDeal(deal.id)}
                className="group flex items-center gap-2.5 text-left hover:text-amber-300 transition-colors cursor-pointer shrink-0 py-0.5"
              >
                <span className="font-semibold text-stone-200 group-hover:text-amber-300 transition-colors">
                  {deal.company}
                </span>
                <span className="font-mono font-medium text-emerald-400 tabular-nums">
                  {deal.amount}
                </span>
                <span className="text-stone-400 text-[11px]">
                  ({deal.stage})
                </span>
                <span className="text-stone-500 hidden md:inline">
                  led by {deal.leadInvestor}
                </span>
                <span className="text-stone-600 font-mono text-[10px]">
                  {deal.timeAgo}
                </span>
                <ChevronRight className="w-3 h-3 text-stone-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="shrink-0 hidden sm:flex items-center px-3 border-l border-stone-800 text-stone-400">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:text-stone-200 transition-colors cursor-pointer"
            aria-label={isPaused ? 'Resume deal ticker' : 'Pause deal ticker'}
            title={isPaused ? 'Resume deal ticker' : 'Pause deal ticker'}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
};
