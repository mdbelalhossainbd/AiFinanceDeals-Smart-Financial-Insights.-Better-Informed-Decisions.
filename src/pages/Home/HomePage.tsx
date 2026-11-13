import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { dealService } from '../../services/dealService';
import { Article, Category, FinancialDeal, Comparison } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { ArticleCard } from '../../components/articles/ArticleCard';
import { CategoryCard } from '../../components/categories/CategoryCard';
import { DealCard } from '../../components/deals/DealCard';
import { ComparisonTable } from '../../components/comparisons/ComparisonTable';
import { NewsletterForm } from '../../components/forms/NewsletterForm';
import { DisplayAd } from '../../components/ads/DisplayAd';
import { InFeedAd } from '../../components/ads/InFeedAd';
import { MultiplexAd } from '../../components/ads/MultiplexAd';
import { MetaTags } from '../../components/seo/MetaTags';
import { StructuredData } from '../../components/seo/StructuredData';
import { ArrowRight, ShieldCheck, TrendingUp, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [deals, setDeals] = useState<FinancialDeal[]>([]);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedArticles, loadedDeals, loadedComparisons] = await Promise.all([
          articleService.getPublishedArticles(),
          dealService.getVerifiedDeals(),
          dealService.getComparisons(),
        ]);
        setArticles(loadedArticles);
        setDeals(loadedDeals);
        setComparisons(loadedComparisons);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const trendingArticles = articles.filter((a) => a.trending).slice(0, 3);
  const personalFinanceArticles = articles.filter((a) => a.category_id === 'cat-pf');
  const insuranceArticles = articles.filter((a) => a.category_id === 'cat-ins');
  const bankingArticles = articles.filter((a) => a.category_id === 'cat-bank' || a.category_id === 'cat-credit');
  const latestArticles = articles.slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      <MetaTags
        title="AI Finance Deals — Smart Financial Insights. Better Informed Decisions."
        description="Explore practical financial guides, compare financial services, and discover helpful insights to make more informed decisions."
        canonicalPath="/"
      />
      <StructuredData type="organization" />

      {/* SECTION 1: HERO */}
      <section className="bg-gradient-to-b from-[#F5F8FC] to-white border-b border-[#E2E8F0] pt-12 pb-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E2E8F0] rounded-full text-xs font-mono font-semibold text-[#163A5F] shadow-sm mb-6">
            <ShieldCheck className="w-4 h-4 text-[#00B894]" />
            <span>Independent Financial Research & Clear Editorial Standards</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0D1F3C] tracking-tight max-w-4xl mx-auto leading-[1.15] [text-wrap:balance]">
            Make Smarter Financial Decisions
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            Explore practical financial guides, compare financial services, and discover helpful insights to make more informed decisions.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/articles/"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-heading font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Explore Financial Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/comparisons/"
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-[#F5F8FC] text-[#0D1F3C] border border-[#CBD5E1] font-heading font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center"
            >
              <span>Compare Financial Services</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-[#E2E8F0]/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00B894] shrink-0" />
              <span className="font-medium text-[#303846]">CFP® & CFA Editorial Review</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00B894] shrink-0" />
              <span className="font-medium text-[#303846]">FDIC & NCUA Rate Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00B894] shrink-0" />
              <span className="font-medium text-[#303846]">Zero Fabricated Offers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00B894] shrink-0" />
              <span className="font-medium text-[#303846]">Strict Fact-Checking Charter</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED GUIDES */}
      {featuredArticle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#00B894] font-semibold">
                Editor's Spotlight
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0D1F3C]">
                Featured Financial Guide
              </h2>
            </div>
            <Link
              to="/articles/"
              className="text-xs font-semibold text-[#163A5F] hover:text-[#00B894] inline-flex items-center gap-1"
            >
              <span>View All Guides</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <ArticleCard article={featuredArticle} variant="featured" />
        </section>
      )}

      {/* Mid-Section AdSense Horizontal Display Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DisplayAd placementId="homepageMid" label="Advertisement · Sponsored Recommendation" />
      </div>

      {/* SECTION 3: EXPLORE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00B894] font-semibold">
            Knowledge Base
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0D1F3C]">
            Explore Financial Categories
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Browse targeted guides, tools, and consumer protection resources organized by discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.filter((c) => !c.parent_id).slice(0, 8).map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              articleCount={articles.filter((a) => a.category_id === cat.id).length || 3}
            />
          ))}
        </div>
      </section>

      {/* SECTION 4: TRENDING ARTICLES */}
      {trendingArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#E6F8F4] text-[#00B894]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0D1F3C]">
                Trending Financial Articles
              </h2>
            </div>
            <Link
              to="/articles/"
              className="text-xs font-semibold text-[#163A5F] hover:text-[#00B894] flex items-center gap-1"
            >
              <span>More Insights</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingArticles.map((art) => (
              <ArticleCard key={art.id} article={art} variant="grid" />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 5: PERSONAL FINANCE */}
      <section className="bg-[#F8FAFC] py-16 border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#00B894] font-semibold">
                Core Principles
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0D1F3C]">
                Personal Finance & Budgeting Education
              </h2>
            </div>
            <Link
              to="/personal-finance/"
              className="text-xs font-semibold text-[#163A5F] hover:text-[#00B894] flex items-center gap-1"
            >
              <span>Explore Personal Finance</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personalFinanceArticles.slice(0, 2).map((art) => (
              <ArticleCard key={art.id} article={art} variant="horizontal" />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: INSURANCE EDUCATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#163A5F] font-semibold">
              Risk Management
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0D1F3C]">
              Insurance Protection Guides
            </h2>
            <p className="text-xs text-[#6B7280] mt-1">
              Objective actuarial insights comparing life, health, disability, and auto policies.
            </p>
          </div>
          <Link
            to="/insurance/"
            className="text-xs font-semibold text-[#163A5F] hover:text-[#00B894] flex items-center gap-1"
          >
            <span>All Insurance Guides</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insuranceArticles.length > 0 ? (
            insuranceArticles.map((art) => (
              <ArticleCard key={art.id} article={art} variant="grid" />
            ))
          ) : (
            <p className="text-xs text-[#6B7280]">Insurance guides loading...</p>
          )}
        </div>
      </section>

      {/* SECTION 7: BANKING & CREDIT */}
      <section className="bg-[#F8FAFC] py-16 border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#00C2E0] font-semibold">
                Banking Architecture
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0D1F3C]">
                Banking & Consumer Credit Education
              </h2>
            </div>
            <Link
              to="/banking/"
              className="text-xs font-semibold text-[#163A5F] hover:text-[#00B894] flex items-center gap-1"
            >
              <span>Explore Banking</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bankingArticles.slice(0, 2).map((art) => (
              <ArticleCard key={art.id} article={art} variant="horizontal" />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: FINANCE DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#00B894] font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Independently Verified & Dated Offers</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0D1F3C]">
              Featured Financial Product Deals
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1 max-w-xl">
              Strictly verified promotions from FDIC-insured banks, reputable credit issuers, and licensed carriers. No artificial promotional rates.
            </p>
          </div>
          <Link
            to="/finance-deals/"
            className="text-xs font-semibold text-[#163A5F] hover:text-[#00B894] flex items-center gap-1 shrink-0"
          >
            <span>View All Deals</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.slice(0, 2).map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
          {/* Native In-Feed Ad Unit matching card grid */}
          <InFeedAd placementId="inFeedNative" />
        </div>
      </section>

      {/* SECTION 9: COMPARISON CENTER */}
      {comparisons.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#163A5F] font-semibold">
                Objective Benchmarks
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0D1F3C]">
                Financial Product Comparison Center
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Rigorous side-by-side matrices evaluating fees, benefits, and minimum requirements.
              </p>
            </div>
            <Link
              to="/comparisons/"
              className="text-xs font-semibold text-[#163A5F] hover:text-[#00B894] flex items-center gap-1 shrink-0"
            >
              <span>All Comparisons</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <ComparisonTable comparison={comparisons[0]} />
        </section>
      )}

      {/* AdSense Multiplex Content Recommendation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MultiplexAd placementId="multiplexFooter" variant="horizontal" />
      </div>

      {/* SECTION 10: LATEST ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#6B7280] font-semibold">
              Recent Dispatches
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0D1F3C]">
              Latest Published Articles
            </h2>
          </div>
          <Link
            to="/articles/"
            className="text-xs font-semibold text-[#163A5F] hover:text-[#00B894] flex items-center gap-1"
          >
            <span>Article Archive</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestArticles.map((art) => (
            <ArticleCard key={art.id} article={art} variant="grid" />
          ))}
        </div>
      </section>

      {/* SECTION 11: NEWSLETTER SUBSCRIPTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterForm />
      </div>
    </div>
  );
};
