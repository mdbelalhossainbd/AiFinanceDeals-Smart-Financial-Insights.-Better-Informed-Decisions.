import React, { useEffect, useState } from 'react';
import { DealArticle } from '../types';
import { X, Building2, Calendar, MapPin, DollarSign, Share2, Bookmark, Check, ArrowUpRight, TrendingUp, ShieldCheck } from 'lucide-react';

interface DealDossierModalProps {
  article: DealArticle | null;
  onClose: () => void;
}

export const DealDossierModal: React.FC<DealDossierModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 transition-all animate-in fade-in duration-200">
      {/* Backdrop click handler */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-title"
        className="relative w-full max-w-4xl bg-[#FAF9F5] dark:bg-[#15171B] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-stone-900 dark:text-stone-100 max-h-[92vh] flex flex-col"
      >
        {/* Modal Top Utility Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 border-b border-stone-200 dark:border-stone-800 bg-[#FAF9F5]/95 dark:bg-[#15171B]/95 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span className="font-mono uppercase font-semibold text-amber-800 dark:text-amber-400">
              Verified Deal Intelligence
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.publishedAt}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Copy Briefing URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share'}</span>
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                bookmarked ? 'text-amber-700 dark:text-amber-400' : 'text-stone-600 dark:text-stone-300'
              }`}
              title="Bookmark for Dealflow Memo"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 rounded-md transition-colors cursor-pointer ml-2"
              aria-label="Close deal dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Header Title Section */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-3">
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                {article.category.name}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                {article.stage} Round
              </span>
              <span aria-hidden="true">·</span>
              <span>{article.readTime}</span>
            </div>

            <h1 id="dossier-title" className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
              {article.title}
            </h1>

            <p className="mt-3 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              {article.dek}
            </p>
          </div>

          {/* Key Financial Terms Box */}
          <div className="bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-xl p-5 sm:p-6">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-4 font-semibold flex items-center justify-between">
              <span>Capital Structure & Terms</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> SEC Form D Reconciled
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="block text-[11px] font-mono uppercase text-stone-500 dark:text-stone-400">
                  Round Size
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {article.amount}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-mono uppercase text-stone-500 dark:text-stone-400">
                  Valuation
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                  {article.valuation || 'Proprietary'}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-mono uppercase text-stone-500 dark:text-stone-400">
                  Stage & Type
                </span>
                <span className="font-sans text-sm sm:text-base font-semibold text-stone-800 dark:text-stone-200">
                  {article.stage} Equity
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-mono uppercase text-stone-500 dark:text-stone-400">
                  Headquarters
                </span>
                <span className="font-sans text-sm sm:text-base font-semibold text-stone-800 dark:text-stone-200">
                  {article.company.headquarters}
                </span>
              </div>
            </div>

            {/* Syndicates */}
            <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-[11px] font-mono uppercase text-stone-500 dark:text-stone-400 mb-1">
                  Lead Syndicate
                </span>
                <div className="flex flex-wrap gap-1.5 font-medium text-stone-800 dark:text-stone-200">
                  {article.leadInvestors.map((inv: string) => (
                    <span key={inv} className="bg-white dark:bg-stone-800 px-2 py-1 rounded border border-stone-200 dark:border-stone-700">
                      {inv}
                    </span>
                  ))}
                </div>
              </div>

              {article.coInvestors && (
                <div>
                  <span className="block text-[11px] font-mono uppercase text-stone-500 dark:text-stone-400 mb-1">
                    Participating Investors
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-stone-600 dark:text-stone-400">
                    {article.coInvestors.map((inv: string) => (
                      <span key={inv} className="bg-white/60 dark:bg-stone-800/60 px-2 py-1 rounded border border-stone-200 dark:border-stone-700/60">
                        {inv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image if present */}
          {article.imageUrl && (
            <figure className="overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800">
              <img
                src={article.imageUrl}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[380px] object-cover"
              />
              {article.imageCaption && (
                <figcaption className="p-2.5 text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 font-sans italic">
                  {article.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Key Strategic Takeaways */}
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">
              Strategic Deal Highlights
            </h3>
            <ul className="space-y-2.5">
              {article.keyTakeaways.map((takeaway: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                  <span className="font-mono text-amber-700 dark:text-amber-400 font-bold shrink-0 mt-0.5">
                    {`0${idx + 1}.`}
                  </span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Full Narrative */}
          <div className="space-y-4 text-stone-700 dark:text-stone-300 leading-relaxed text-sm sm:text-base font-sans border-t border-stone-200 dark:border-stone-800 pt-6">
            {article.content.map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Company Dossier Snapshot */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 bg-white dark:bg-stone-900">
            <h4 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
              Entity Profile: {article.company.name}
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mb-4">
              {article.company.description}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-stone-100 dark:border-stone-800">
              <div>
                <span className="text-stone-400 block font-mono text-[10px] uppercase">Founded</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">{article.company.founded}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-mono text-[10px] uppercase">Chief Executive</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">{article.company.ceo}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-mono text-[10px] uppercase">Sector Focus</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">{article.company.sector}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Strip */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-[#FAF9F5] dark:bg-[#15171B] flex items-center justify-between">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            Reported by <span className="font-medium text-stone-800 dark:text-stone-200">{article.author.name}</span> · {article.author.role}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-md transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
