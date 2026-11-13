import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { dealService } from '../../services/dealService';
import { Article, FinancialDeal } from '../../types';
import { ArticleCard } from '../../components/articles/ArticleCard';
import { DealCard } from '../../components/deals/DealCard';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { DisplayAd } from '../../components/ads/DisplayAd';
import { MultiplexAd } from '../../components/ads/MultiplexAd';
import { MetaTags } from '../../components/seo/MetaTags';
import { Search } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [articles, setArticles] = useState<Article[]>([]);
  const [deals, setDeals] = useState<FinancialDeal[]>([]);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    async function performSearch() {
      const [allArticles, allDeals] = await Promise.all([
        articleService.getPublishedArticles(),
        dealService.getVerifiedDeals(),
      ]);

      if (!query.trim()) {
        setArticles(allArticles.slice(0, 4));
        setDeals(allDeals.slice(0, 3));
        return;
      }

      const q = query.toLowerCase();
      const matchedArticles = allArticles.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category?.name.toLowerCase().includes(q) ||
        a.author?.name.toLowerCase().includes(q)
      );

      const matchedDeals = allDeals.filter((d) =>
        d.title.toLowerCase().includes(q) ||
        d.provider.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );

      setArticles(matchedArticles);
      setDeals(matchedDeals);
    }
    performSearch();
  }, [query]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const breadcrumbs = [{ label: 'Search Results' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <MetaTags
        title={`Search Results${query ? ` for "${query}"` : ''}`}
        description={`Browse financial guides and verified deals matching "${query}" on AI Finance Deals.`}
        canonicalPath="/search"
        robots="noindex, follow"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Search Bar Banner */}
      <div className="bg-[#F5F8FC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 space-y-4">
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0D1F3C]">
          Search Financial Knowledge Base
        </h1>
        <form onSubmit={handleFormSubmit} className="max-w-2xl flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search guides, terms, banks, deals, insurance..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#303846] focus:outline-none focus:ring-2 focus:ring-[#00B894]"
            />
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* AdSense In-Content Horizontal Display Banner */}
      <DisplayAd placementId="homepageMid" className="my-6" />

      {/* Results Header */}
      <div>
        <div className="text-xs font-mono uppercase text-[#6B7280]">
          {query ? `Results for "${query}"` : 'Recommended Highlights'}
        </div>
        <div className="text-sm font-semibold text-[#0D1F3C] mt-1">
          Found {articles.length} Guides and {deals.length} Product Deals
        </div>
      </div>

      {/* Matched Articles */}
      <div className="space-y-6">
        <h2 className="font-heading text-xl font-bold text-[#0D1F3C]">
          Matching Financial Guides
        </h2>
        {articles.length === 0 ? (
          <p className="text-xs text-[#6B7280]">No matching educational guides found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <ArticleCard key={art.id} article={art} variant="grid" />
            ))}
          </div>
        )}
      </div>

      {/* Matched Deals */}
      {deals.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[#E2E8F0]">
          <h2 className="font-heading text-xl font-bold text-[#0D1F3C]">
            Matching Verified Financial Deals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      )}

      {/* AdSense Multiplex Unit */}
      <MultiplexAd placementId="multiplexFooter" variant="horizontal" />
    </div>
  );
};
