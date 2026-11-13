import React, { useEffect, useState } from 'react';
import { articleService } from '../../services/articleService';
import { Article } from '../../types';
import { ArticleCard } from '../../components/articles/ArticleCard';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { InFeedAd } from '../../components/ads/InFeedAd';
import { MultiplexAd } from '../../components/ads/MultiplexAd';
import { MetaTags } from '../../components/seo/MetaTags';
import { CATEGORIES } from '../../data/mockData';
import { Search } from 'lucide-react';

export const ArticlesIndexPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    async function loadArticles() {
      const data = await articleService.getPublishedArticles();
      setArticles(data);
      window.scrollTo(0, 0);
    }
    loadArticles();
  }, []);

  const breadcrumbs = [{ label: 'All Articles' }];

  const filtered = articles.filter((a) => {
    const matchesCat = selectedCat === 'all' || a.category_id === selectedCat;
    const matchesSearch = search.trim() === '' || 
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.author?.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <MetaTags
        title="Complete Archive of Financial Guides & Educational Analysis"
        description="Browse all published articles, practical budgeting frameworks, insurance reviews, and banking guides written and reviewed by financial experts."
        canonicalPath="/articles/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <div className="bg-[#F5F8FC] border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 space-y-2">
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Financial Guides & Editorial Archive
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] max-w-2xl leading-relaxed">
          Comprehensive, fact-checked educational resources on personal wealth management, insurance underwriting, banking options, and financial technology.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-[#E2E8F0] rounded-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCat === 'all' ? 'bg-[#0D1F3C] text-white' : 'bg-[#F5F8FC] text-[#303846] hover:bg-[#E2E8F0]'
            }`}
          >
            All Guides ({articles.length})
          </button>
          {CATEGORIES.filter((c) => !c.parent_id && c.id !== 'cat-deals' && c.id !== 'cat-comp').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedCat === cat.id ? 'bg-[#0D1F3C] text-white' : 'bg-[#F5F8FC] text-[#303846] hover:bg-[#E2E8F0]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F5F8FC] border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none focus:ring-1 focus:ring-[#00B894]"
          />
          <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Articles Grid with Integrated In-Feed Native Ad Unit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.slice(0, 2).map((art) => (
          <ArticleCard key={art.id} article={art} variant="grid" />
        ))}
        {/* Native In-Feed Unit */}
        <InFeedAd placementId="inFeedNative" />
        {filtered.slice(2).map((art) => (
          <ArticleCard key={art.id} article={art} variant="grid" />
        ))}
      </div>

      {/* AdSense Multiplex Recommendation Unit */}
      <MultiplexAd placementId="multiplexFooter" variant="horizontal" />
    </div>
  );
};
