import React from 'react';
import { MarketIndicator } from '../types';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface MarketBarometerProps {
  indicators: MarketIndicator[];
}

export const MarketBarometer: React.FC<MarketBarometerProps> = ({ indicators }) => {
  return (
    <section id="market-metrics" className="w-full border-y border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/50 py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Q1 2026 Dealflow Intelligence
            </div>
            <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100">
              Global AI Capital Barometer
            </h2>
          </div>
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <span>Verified across PitchBook, SEC Form D & Lead Syndicate Disclosures</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {indicators.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-lg p-4 transition-all hover:border-stone-300 dark:hover:border-stone-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                  {item.label}
                </span>
                <span className="flex items-center text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                  {item.change}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-stone-900 dark:text-stone-100 tabular-nums">
                {item.value}
              </div>
              <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                {item.context}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
