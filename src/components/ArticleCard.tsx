import React, { useState } from 'react';
import { DealArticle } from '../types';
import { ArrowUpRight, Clock, Building2, DollarSign, User } from 'lucide-react';

interface ArticleCardProps {
  article: DealArticle;
  variant?: 'hero' | 'featured' | 'grid' | 'compact';
  onSelect: (article: DealArticle) => void;
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'grid',
  onSelect,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Fallback visual container if image fails
  const renderFallbackVisual = (aspectRatioClass: string) => (
    <div className={`w-full ${aspectRatioClass} bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-800 dark:to-stone-900 flex flex-col items-center justify-center p-6 text-stone-500 dark:text-stone-400 select-none`}>
      <Building2 className="w-8 h-8 mb-2 opacity-50" />
      <span className="font-serif text-sm font-medium text-stone-700 dark:text-stone-300 text-center">
        {article.company.name}
      </span>
      <span className="text-[11px] font-mono mt-1 opacity-75">
        {article.stage} · {article.amount}
      </span>
    </div>
  );

  // Variant: HERO (The primary front-page lead story)
  if (variant === 'hero') {
    return (
      <article
        onClick={() => onSelect(article)}
        className={`group cursor-pointer bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden hover:border-stone-300 dark:hover:border-stone-700 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${className}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          {/* Visual Column */}
          <div className="lg:col-span-7 relative overflow-hidden bg-stone-950 min-h-[300px] sm:min-h-[400px]">
            {!imageError ? (
              <img
                src={article.imageUrl}
                alt={article.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                loading="eager"
              />
            ) : (
              renderFallbackVisual('h-full min-h-[350px]')
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:hidden" />
            
            {/* Quick Deal Tag Overlay on Image */}
            <div className="absolute bottom-4 left-4 right-4 lg:hidden text-white">
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400">
                Exclusive Deal Briefing
              </span>
              <div className="text-xl font-serif font-semibold mt-1">
                {article.company.name}
              </div>
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              {/* Unboxed Metadata Header (Anti-Slop Rule §1.A) */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-3">
                <span className="font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  {article.category.name}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono font-medium text-emerald-700 dark:text-emerald-400">
                  {article.stage} ({article.amount})
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              {/* Title with balanced wrap */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.25] group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors [text-wrap:balance]">
                {article.title}
              </h1>

              {/* Subtitle / Dek */}
              <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                {article.dek}
              </p>

              {/* Key Financial Terms Box */}
              <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                <div>
                  <span className="block text-[11px] font-mono uppercase text-stone-500 dark:text-stone-400">
                    Lead Investors
                  </span>
                  <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 line-clamp-1">
                    {article.leadInvestors.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase text-stone-500 dark:text-stone-400">
                    Post Valuation
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                    {article.valuation || 'Proprietary'}
                  </span>
                </div>
              </div>
            </div>

            {/* Author Byline & CTA */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-mono text-xs font-bold">
                  {article.author.avatar || 'ED'}
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-stone-200">
                    {article.author.name}
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400">
                    {article.author.role}
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                Read Intelligence Briefing
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variant: FEATURED (2-Column deep dive or prominent secondary story)
  if (variant === 'featured') {
    return (
      <article
        onClick={() => onSelect(article)}
        className={`group cursor-pointer bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden hover:border-stone-300 dark:hover:border-stone-700 transition-all p-5 flex flex-col justify-between ${className}`}
      >
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800 mb-4">
            {!imageError ? (
              <img
                src={article.imageUrl}
                alt={article.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              renderFallbackVisual('aspect-[16/10]')
            )}
            <div className="absolute top-2.5 left-2.5 bg-stone-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 uppercase tracking-wider">
              {article.stage} · {article.amount}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
            <span className="font-medium text-stone-700 dark:text-stone-300">{article.category.name}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors leading-snug [text-wrap:balance]">
            {article.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
            {article.dek}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
          <div className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">
            Lead: <span className="text-stone-700 dark:text-stone-200 font-sans font-medium">{article.leadInvestors[0]}</span>
          </div>
          <span className="flex items-center gap-0.5 text-stone-900 dark:text-amber-400 font-medium group-hover:translate-x-0.5 transition-transform text-xs">
            Dossier <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </article>
    );
  }

  // Variant: COMPACT (Sidebar / Editorial Dispatch row)
  if (variant === 'compact') {
    return (
      <article
        onClick={() => onSelect(article)}
        className={`group cursor-pointer py-3.5 border-b border-stone-200 dark:border-stone-800 last:border-b-0 transition-colors ${className}`}
      >
        <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mb-1">
          <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">{article.amount}</span>
          <span aria-hidden="true">·</span>
          <span>{article.stage}</span>
          <span aria-hidden="true">·</span>
          <span>{article.publishedAt}</span>
        </div>

        <h4 className="font-serif text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors leading-snug">
          {article.title}
        </h4>

        <div className="mt-1.5 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span className="line-clamp-1">{article.company.name} · {article.company.sector}</span>
          <span className="shrink-0 flex items-center gap-0.5 text-stone-700 dark:text-stone-300 group-hover:text-amber-700 dark:group-hover:text-amber-400 font-medium text-[11px]">
            Inspect <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </article>
    );
  }

  // Variant: GRID (Default responsive multi-column feed card)
  return (
    <article
      onClick={() => onSelect(article)}
      className={`group cursor-pointer bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden hover:border-stone-300 dark:hover:border-stone-700 transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Card Visual with 4:3 Aspect Ratio */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
          {!imageError ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-400 ease-out"
              loading="lazy"
            />
          ) : (
            renderFallbackVisual('aspect-[4/3]')
          )}
          
          {/* Subtle Stage & Amount Watermark / Floating Badge */}
          <div className="absolute top-3 left-3 bg-stone-950/85 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-mono font-medium">
            <span className="text-emerald-400">{article.amount}</span>
            <span className="text-stone-400 mx-1">·</span>
            <span>{article.stage}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              {article.category.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
            {article.dek}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
        <div className="text-stone-500 dark:text-stone-400">
          <span>By </span>
          <span className="font-medium text-stone-800 dark:text-stone-200">{article.author.name}</span>
        </div>

        <span className="inline-flex items-center gap-1 font-semibold text-amber-800 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform text-xs">
          View Terms
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
