import React, { useState } from 'react';
import { Search, Sun, Moon, Menu, X, PlusCircle, ArrowUpRight, TrendingUp } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  onSubmitDealClick: () => void;
  onSelectCategory: (categorySlug: string | null) => void;
  selectedCategory: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onSubmitDealClick,
  onSelectCategory,
  selectedCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'All Deals', slug: null },
    { label: 'Generative Infra', slug: 'generative-infra' },
    { label: 'Autonomous Finance', slug: 'autonomous-finance' },
    { label: 'Algorithmic Trading', slug: 'algorithmic-trading' },
    { label: 'Sovereign Capital', slug: 'sovereign-funds' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-[#FAF9F5]/95 dark:bg-[#121316]/95 backdrop-blur-md transition-colors">
      {/* Top Utility Ribbon */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 border-b border-stone-200/60 dark:border-stone-800/60 text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-stone-800 dark:text-stone-200">Global Financial Edition</span>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
          <span>Tuesday, March 31, 2026</span>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>AI Venture Volume: $28.4B (+38.6% YoY)</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#market-metrics" className="hover:text-stone-900 dark:hover:text-white transition-colors">Market Benchmarks</a>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
          <a href="#sector-intelligence" className="hover:text-stone-900 dark:hover:text-white transition-colors">Sector Matrix</a>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
          <a href="#newsletter" className="hover:text-stone-900 dark:hover:text-white transition-colors">Daily Dealflow Dossier</a>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1, Zone 2, Zone 3 */}
      <div className="flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5 max-w-7xl mx-auto">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onSelectCategory(null)}
            className="text-left group cursor-pointer focus-visible:ring-1 focus-visible:ring-stone-900 dark:focus-visible:ring-stone-100 rounded"
          >
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors whitespace-nowrap">
              AI Finance Deals
            </span>
          </button>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
          {navLinks.map((link) => {
            const isActive = selectedCategory === link.slug;
            return (
              <button
                key={link.label}
                onClick={() => onSelectCategory(link.slug)}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 text-sm ${
                  isActive
                    ? 'text-stone-950 dark:text-white font-semibold border-b-2 border-stone-900 dark:border-amber-400'
                    : 'hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + search and theme affordances */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="Search deals and investors"
            aria-label="Search deals"
          >
            <Search className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span className="hidden sm:inline">Search Deals</span>
            <kbd className="hidden lg:inline text-[10px] font-mono text-stone-400 dark:text-stone-500 bg-stone-200/60 dark:bg-stone-700/60 px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors cursor-pointer shrink-0"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
          </button>

          <button
            onClick={onSubmitDealClick}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 dark:bg-amber-600 hover:bg-stone-800 dark:hover:bg-amber-500 rounded-md transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit Deal</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-[#FAF9F5] dark:bg-[#121316] px-4 py-4 space-y-3">
          <div className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold px-2">
            Coverage Sectors
          </div>
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = selectedCategory === link.slug;
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    onSelectCategory(link.slug);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white dark:bg-amber-600 font-medium'
                      : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onSubmitDealClick();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 dark:bg-amber-600 rounded-md hover:bg-stone-800 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Breaking Deal</span>
            </button>
            <a
              href="#newsletter"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-md hover:bg-stone-200 transition-colors"
            >
              <span>Get Daily Dealflow Briefing</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
