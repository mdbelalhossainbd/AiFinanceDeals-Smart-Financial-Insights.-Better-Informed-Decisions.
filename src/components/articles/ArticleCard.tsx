import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types';
import { ArticleFeaturedImage } from './ArticleFeaturedImage';
import { Clock, ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'grid' | 'compact' | 'horizontal';
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'grid',
  className = '',
}) => {
  const altText = article.image_alt || article.title;
  const categoryName = article.category?.name || 'Personal Finance';

  // Variant: Featured (Large horizontal banner for top of categories or homepage)
  if (variant === 'featured') {
    return (
      <article className={`group bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden hover:border-[#CBD5E1] transition-all hover:shadow-md ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 relative overflow-hidden bg-slate-900">
            <ArticleFeaturedImage
              src={article.featured_image}
              alt={altText}
              title={article.title}
              categoryName={categoryName}
              priority
              aspectClassName="aspect-video lg:h-full"
              imgClassName="group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute top-4 left-4 bg-[#0D1F3C]/90 backdrop-blur-sm text-[#00C2E0] px-3 py-1 rounded-md text-xs font-mono font-semibold uppercase tracking-wider">
              Featured Guide
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2.5">
                <span className="font-semibold text-[#163A5F] uppercase tracking-wider">
                  {categoryName}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.read_time}
                </span>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0D1F3C] group-hover:text-[#163A5F] transition-colors leading-tight">
                <Link to={`/articles/${article.slug}`}>
                  {article.title}
                </Link>
              </h2>

              <p className="mt-3 text-sm text-[#303846] leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#E2E8F0] text-[#163A5F] flex items-center justify-center font-bold text-xs">
                  {article.author?.name ? article.author.name[0] : 'E'}
                </div>
                <div>
                  <span className="block text-xs font-semibold text-[#0D1F3C]">
                    {article.author?.name || 'Editorial Staff'}
                  </span>
                  <span className="block text-[10px] text-[#6B7280]">
                    {article.author?.credentials || 'Verified Contributor'}
                  </span>
                </div>
              </div>

              <Link
                to={`/articles/${article.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#00B894] hover:text-[#008f73] transition-colors"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variant: Compact (For sidebars and latest dispatches)
  if (variant === 'compact') {
    return (
      <article className={`group py-3.5 border-b border-[#F1F5F9] last:border-b-0 ${className}`}>
        <div className="flex items-start gap-3">
          <Link to={`/articles/${article.slug}`} className="w-20 shrink-0 rounded-md overflow-hidden border border-[#E2E8F0]">
            <ArticleFeaturedImage
              src={article.featured_image}
              alt={altText}
              title={article.title}
              categoryName={categoryName}
              aspectClassName="aspect-video"
              imgClassName="group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[11px] text-[#6B7280] mb-1">
              <span className="font-semibold text-[#163A5F] truncate">{article.category?.name}</span>
              <span aria-hidden="true">·</span>
              <span className="shrink-0">{article.read_time}</span>
            </div>

            <h4 className="font-heading text-sm font-bold text-[#0D1F3C] group-hover:text-[#163A5F] transition-colors line-clamp-2 leading-snug">
              <Link to={`/articles/${article.slug}`}>
                {article.title}
              </Link>
            </h4>

            <div className="mt-1.5 flex items-center justify-between text-xs text-[#6B7280]">
              <span className="text-[11px] truncate">By {article.author?.name}</span>
              <Link
                to={`/articles/${article.slug}`}
                className="text-[11px] font-semibold text-[#00B894] hover:underline shrink-0 ml-2"
              >
                Read →
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variant: Horizontal (split row card for index pages)
  if (variant === 'horizontal') {
    return (
      <article className={`group bg-white border border-[#E2E8F0] rounded-xl overflow-hidden hover:border-[#CBD5E1] transition-all hover:shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-start ${className}`}>
        <Link to={`/articles/${article.slug}`} className="w-full sm:w-52 shrink-0 rounded-lg overflow-hidden bg-slate-100 relative">
          <ArticleFeaturedImage
            src={article.featured_image}
            alt={altText}
            title={article.title}
            categoryName={categoryName}
            aspectClassName="aspect-video"
            imgClassName="group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-1.5">
              <span className="font-semibold text-[#163A5F]">{article.category?.name}</span>
              <span aria-hidden="true">·</span>
              <span>{article.read_time}</span>
            </div>

            <h3 className="font-heading text-base sm:text-lg font-bold text-[#0D1F3C] group-hover:text-[#163A5F] transition-colors leading-snug line-clamp-2">
              <Link to={`/articles/${article.slug}`}>
                {article.title}
              </Link>
            </h3>

            <p className="mt-2 text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F8FAFC] flex items-center justify-between text-xs">
            <span className="text-[#6B7280] text-[11px]">
              By <strong>{article.author?.name}</strong>
            </span>
            <Link
              to={`/articles/${article.slug}`}
              className="font-semibold text-[#00B894] hover:underline inline-flex items-center gap-0.5 text-xs"
            >
              Read Guide <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Variant: Grid (Standard 3-column / 2-column card)
  return (
    <article className={`group bg-white border border-[#E2E8F0] rounded-xl overflow-hidden hover:border-[#CBD5E1] transition-all hover:shadow-md flex flex-col justify-between ${className}`}>
      <div>
        <div className="relative overflow-hidden bg-slate-100">
          <Link to={`/articles/${article.slug}`} className="block">
            <ArticleFeaturedImage
              src={article.featured_image}
              alt={altText}
              title={article.title}
              categoryName={categoryName}
              aspectClassName="aspect-video"
              imgClassName="group-hover:scale-105 transition-transform duration-400 ease-out"
            />
          </Link>
          <div className="absolute top-3 left-3 bg-[#0D1F3C]/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded text-[11px] font-semibold">
            {article.category?.name || 'Finance'}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.read_time}
            </span>
            <span aria-hidden="true">·</span>
            <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h3 className="font-heading text-lg font-bold text-[#0D1F3C] group-hover:text-[#163A5F] transition-colors leading-snug line-clamp-2">
            <Link to={`/articles/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          <p className="mt-2 text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-[#F8FAFC] flex items-center justify-between text-xs">
        <span className="text-[#6B7280] text-[11px] truncate max-w-[160px]">
          By {article.author?.name}
        </span>
        <Link
          to={`/articles/${article.slug}`}
          className="font-semibold text-[#00B894] hover:text-[#008f73] transition-colors inline-flex items-center gap-1 shrink-0"
        >
          <span>Read More</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
};
