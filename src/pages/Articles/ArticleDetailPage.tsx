import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { useAuth } from '../../contexts/AuthContext';
import { Article } from '../../types';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { TableOfContents } from '../../components/articles/TableOfContents';
import { AuthorBio } from '../../components/articles/AuthorBio';
import { ArticleCard } from '../../components/articles/ArticleCard';
import { ArticleFeaturedImage } from '../../components/articles/ArticleFeaturedImage';
import { DisclaimerNotice } from '../../components/common/DisclaimerNotice';
import { InArticleAd } from '../../components/ads/InArticleAd';
import { MultiplexAd } from '../../components/ads/MultiplexAd';
import { AdSkyscraper } from '../../components/ads/AdSkyscraper';
import { DisplayAd } from '../../components/ads/DisplayAd';
import { NewsletterForm } from '../../components/forms/NewsletterForm';
import { MetaTags } from '../../components/seo/MetaTags';
import { StructuredData } from '../../components/seo/StructuredData';
import { Clock, Calendar, Share2, Check, ExternalLink, ShieldCheck, ArrowLeft } from 'lucide-react';

function buildAnchoredContent(html: string) {
  const items: { id: string; text: string; level: number }[] = [];
  let idx = 0;
  const processedHtml = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_match, attrs, inner) => {
    const plainText = inner.replace(/<[^>]+>/g, '').trim();
    const id = `section-${idx + 1}`;
    idx += 1;
    items.push({ id, text: plainText, level: 2 });
    const hasId = /\bid=/i.test(attrs);
    return hasId ? `<h2${attrs}>${inner}</h2>` : `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });
  return { processedHtml, headingItems: items };
}

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      setIsLoading(true);
      if (!slug) {
        setIsLoading(false);
        return;
      }
      const found = await articleService.getArticleBySlug(slug);
      // Enforce published-only visibility for public visitors; allow preview for authenticated CMS staff
      if (found && (found.status === 'published' || Boolean(user))) {
        setArticle(found);
        const allPublished = await articleService.getPublishedArticles();
        const related = allPublished
          .filter((a) => a.id !== found.id && a.category_id === found.category_id)
          .slice(0, 3);
        setRelatedArticles(related);
      } else {
        setArticle(null);
      }
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
    loadArticle();
  }, [slug, user]);

  const { processedHtml, headingItems } = useMemo(
    () => buildAnchoredContent(article?.content || ''),
    [article?.content]
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-[#6B7280]">
        Loading verified financial guide...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <MetaTags
          title="Article Not Found"
          description="The requested financial guide could not be located."
          canonicalPath={`/articles/${slug || ''}`}
          robots="noindex, nofollow"
        />
        <h1 className="font-heading text-2xl font-bold text-[#0D1F3C]">Article Not Found</h1>
        <p className="text-xs text-[#6B7280]">
          The financial guide you requested may have been relocated, is still undergoing editorial fact-checking, or has been archived.
        </p>
        <Link to="/articles/" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D1F3C] text-white rounded-lg text-xs font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse All Published Guides</span>
        </Link>
      </div>
    );
  }

  const tocItems = [
    ...headingItems,
    ...(article.sources && article.sources.length > 0
      ? [{ id: 'section-sources', text: 'Verified Primary Sources & References', level: 2 }]
      : []),
  ];

  const breadcrumbs = [
    { label: article.category?.name || 'Category', href: `/${article.category?.slug || 'articles'}/` },
    { label: article.title },
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <MetaTags
        title={article.seo_title || article.title}
        description={article.meta_description || article.excerpt}
        canonicalPath={`/articles/${article.slug}`}
        type="article"
        image={article.featured_image}
        publishedTime={article.published_at}
        modifiedTime={article.updated_at}
        authorName={article.author?.name}
        robots={article.status === 'published' ? 'index, follow' : 'noindex, nofollow'}
      />
      <StructuredData type="article" data={article} />
      <StructuredData type="breadcrumbs" data={breadcrumbs} />

      <Breadcrumbs items={breadcrumbs} />

      {article.status !== 'published' && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
          CMS Staff Preview Mode: This article is currently in <strong>{article.status.replace('_', ' ')}</strong> stage and is not publicly indexed.
        </div>
      )}

      {/* Header Container */}
      <header className="max-w-4xl space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
          <Link
            to={`/${article.category?.slug || 'articles'}/`}
            className="font-bold text-[#163A5F] hover:text-[#00B894] uppercase tracking-wider"
          >
            {article.category?.name}
          </Link>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
            {article.read_time}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-[#00B894] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Fact-Checked
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1F3C] tracking-tight leading-[1.2] [text-wrap:balance]">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed font-sans">
          {article.excerpt}
        </p>

        {/* Byline & Timestamps */}
        <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0D1F3C] text-white flex items-center justify-center font-heading font-bold text-sm shrink-0">
              {article.author?.name ? article.author.name[0] : 'E'}
            </div>
            <div>
              <div className="font-bold text-[#0D1F3C]">
                Written by{' '}
                {article.author?.slug ? (
                  <Link to={`/authors/${article.author.slug}`} className="hover:text-[#00B894] hover:underline">
                    {article.author.name}
                  </Link>
                ) : (
                  article.author?.name || 'Editorial Team'
                )}
              </div>
              <div className="text-[11px] text-[#00B894] font-mono">
                {article.author?.credentials}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-mono">
            {article.published_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                <span>
                  Published: {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            )}
            {article.published_at && <span aria-hidden="true">·</span>}
            <span>
              Updated: {new Date(article.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F8FC] hover:bg-[#E2E8F0] text-[#303846] rounded-md transition-colors cursor-pointer text-xs"
              title="Copy Guide Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00B894]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <figure className="max-w-4xl overflow-hidden rounded-2xl border border-[#E2E8F0] bg-slate-900">
        <ArticleFeaturedImage
          src={article.featured_image}
          alt={article.image_alt || article.title}
          title={article.title}
          categoryName={article.category?.name || 'Financial Guide'}
          priority
          aspectClassName="aspect-video"
        />
        {article.image_caption && (
          <figcaption className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-xs text-[#6B7280] italic">
            {article.image_caption}
          </figcaption>
        )}
      </figure>

      {/* Article Top Display Ad Unit */}
      <div className="max-w-4xl">
        <DisplayAd placementId="articleTop" categorySlug={article.category?.slug} label="Advertisement" className="my-2" />
      </div>

      {/* Main Grid: Body + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Article Body: 8 Cols */}
        <div className="lg:col-span-8 min-w-0 space-y-8">
          <TableOfContents items={tocItems} />

          <div
            className="prose prose-slate max-w-none text-[#303846] leading-relaxed text-sm sm:text-base space-y-6 overflow-x-auto [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:text-[#0D1F3C] [&>h2]:pt-6 [&>h2]:border-t [&>h2]:border-[#E2E8F0] [&>h2]:scroll-mt-24 [&>h3]:font-heading [&>h3]:font-bold [&>h3]:text-lg [&>h3]:text-[#163A5F] [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />

          <InArticleAd placementId="inArticlePrimary" categorySlug={article.category?.slug} />

          {/* Sources and References Section */}
          <div id="section-sources" className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#0D1F3C]">
              <ShieldCheck className="w-4 h-4 text-[#00B894]" />
              <span>Verified Primary Sources & Editorial References</span>
            </div>
            <p className="text-xs text-[#6B7280]">
              In accordance with our strict fact-checking charter, regulatory benchmarks, statutory guidelines, and baseline figures are cross-checked against authoritative primary documents.
            </p>
            <ul className="space-y-1.5 text-xs text-[#163A5F] list-none p-0 m-0">
              {article.sources.map((src, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="font-mono text-[#00B894] font-semibold shrink-0">[{idx + 1}]</span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center gap-1 font-medium break-words"
                  >
                    <span>{src.title} ({src.publisher})</span>
                    <ExternalLink className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <DisclaimerNotice />
          <AuthorBio author={article.author} />
        </div>

        {/* Sidebar: 4 Cols */}
        <aside className="lg:col-span-4 min-w-0 space-y-8">
          {relatedArticles.length > 0 && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
              <h3 className="font-heading font-bold text-base text-[#0D1F3C] mb-4 pb-2 border-b border-[#F1F5F9]">
                Related Financial Guides
              </h3>
              <div className="divide-y divide-[#F1F5F9]">
                {relatedArticles.map((rel) => (
                  <ArticleCard key={rel.id} article={rel} variant="compact" />
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl p-5 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#163A5F]">
              Explore Topics
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <Link to="/personal-finance/budgeting/" className="px-2.5 py-1 bg-white border border-[#CBD5E1] rounded text-[#303846] hover:border-[#00B894]">
                Budgeting
              </Link>
              <Link to="/personal-finance/saving/" className="px-2.5 py-1 bg-white border border-[#CBD5E1] rounded text-[#303846] hover:border-[#00B894]">
                Emergency Funds
              </Link>
              <Link to="/banking/bank-accounts/" className="px-2.5 py-1 bg-white border border-[#CBD5E1] rounded text-[#303846] hover:border-[#00B894]">
                High-Yield Accounts
              </Link>
              <Link to="/insurance/life-insurance/" className="px-2.5 py-1 bg-white border border-[#CBD5E1] rounded text-[#303846] hover:border-[#00B894]">
                Life Insurance
              </Link>
              <Link to="/credit-loans/" className="px-2.5 py-1 bg-white border border-[#CBD5E1] rounded text-[#303846] hover:border-[#00B894]">
                Credit Scores
              </Link>
            </div>
          </div>

          <AdSkyscraper placementId="sidebarSkyscraper" isSticky={true} />

          <DisplayAd
            placementId="contentSquare"
            format="square"
            deviceVisibility="mobile-only"
            minHeight={250}
            maxWidth={300}
            categorySlug={article.category?.slug}
            className="my-4"
          />
        </aside>
      </div>

      {/* Article Bottom AdSense Multiplex Grid */}
      <MultiplexAd placementId="multiplexFooter" variant="horizontal" categorySlug={article.category?.slug} />

      <NewsletterForm />
    </article>
  );
};
