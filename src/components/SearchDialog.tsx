import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowUpRight, DollarSign, Building2 } from 'lucide-react';
import { DealArticle } from '../types';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  articles: DealArticle[];
  onSelectArticle: (article: DealArticle) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? articles.slice(0, 4)
    : articles.filter((a) => {
        const q = query.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.company.name.toLowerCase().includes(q) ||
          a.company.sector.toLowerCase().includes(q) ||
          a.leadInvestors.some((inv: string) => inv.toLowerCase().includes(q)) ||
          a.category.name.toLowerCase().includes(q) ||
          a.stage.toLowerCase().includes(q)
        );
      });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 transition-all">
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-[#FAF9F5] dark:bg-[#15171B] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-stone-900 dark:text-stone-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200 dark:border-stone-800 gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals by company, investor (e.g. Sequoia), sector, or stage..."
            className="w-full bg-transparent border-0 outline-none text-sm placeholder:text-stone-400 dark:placeholder:text-stone-500 text-stone-900 dark:text-stone-100"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline font-mono text-[10px] text-stone-400 bg-stone-200/60 dark:bg-stone-800 px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 px-2 mb-2 font-medium">
            {query.trim() === '' ? 'Recent Verified Deals' : `Search Results (${filtered.length})`}
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500 dark:text-stone-400">
              No matching deals found for "{query}". Try searching "Sequoia", "Series A", or "Compute".
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectArticle(item);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                    <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                      {item.amount}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.stage}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.company.headquarters}</span>
                  </div>
                  <div className="font-serif text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors line-clamp-1">
                    {item.title}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                    Lead: {item.leadInvestors.join(', ')} · {item.category.name}
                  </div>
                </div>

                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700 dark:group-hover:text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
