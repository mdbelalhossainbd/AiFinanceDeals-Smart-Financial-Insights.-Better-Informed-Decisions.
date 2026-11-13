import React, { useEffect, useState } from 'react';
import { dealService } from '../../services/dealService';
import { FinancialDeal } from '../../types';
import { DealCard } from '../../components/deals/DealCard';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { DisclaimerNotice } from '../../components/common/DisclaimerNotice';
import { InFeedAd } from '../../components/ads/InFeedAd';
import { MultiplexAd } from '../../components/ads/MultiplexAd';
import { MetaTags } from '../../components/seo/MetaTags';
import { ShieldCheck, Filter, Search } from 'lucide-react';

export const FinanceDealsPage: React.FC = () => {
  const [deals, setDeals] = useState<FinancialDeal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    async function loadDeals() {
      const data = await dealService.getVerifiedDeals();
      setDeals(data);
      window.scrollTo(0, 0);
    }
    loadDeals();
  }, []);

  const breadcrumbs = [
    { label: 'Finance Deals' },
  ];

  const filteredDeals = deals.filter((d) => {
    const matchesCat = selectedCategory === 'all' || d.category_id === selectedCategory;
    const matchesSearch = search.trim() === '' || 
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.provider.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <MetaTags
        title="Verified Finance Deals, Bank Bonuses & Low APR Offers"
        description="Explore verified, dated financial product offers, high-yield savings account rates, and zero-fee credit cards reviewed by our editorial team."
        canonicalPath="/finance-deals/"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Page Header */}
      <div className="bg-[#F5F8FC] border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F4] text-[#00B894] rounded-full text-xs font-mono font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Independent Rate Verification</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Verified Financial Deals & Promotional Offers
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] max-w-3xl leading-relaxed">
          Every promotional APY, welcome bonus, and fee waiver published below is verified against primary regulatory disclosures and issuer terms. We never publish unverified promotional claims.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-[#E2E8F0] rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'all' ? 'bg-[#0D1F3C] text-white' : 'bg-[#F5F8FC] text-[#303846] hover:bg-[#E2E8F0]'
            }`}
          >
            All Verified Deals ({deals.length})
          </button>
          <button
            onClick={() => setSelectedCategory('cat-bank')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'cat-bank' ? 'bg-[#0D1F3C] text-white' : 'bg-[#F5F8FC] text-[#303846] hover:bg-[#E2E8F0]'
            }`}
          >
            Banking & Savings
          </button>
          <button
            onClick={() => setSelectedCategory('cat-credit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'cat-credit' ? 'bg-[#0D1F3C] text-white' : 'bg-[#F5F8FC] text-[#303846] hover:bg-[#E2E8F0]'
            }`}
          >
            Credit Cards & Loans
          </button>
          <button
            onClick={() => setSelectedCategory('cat-ins')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'cat-ins' ? 'bg-[#0D1F3C] text-white' : 'bg-[#F5F8FC] text-[#303846] hover:bg-[#E2E8F0]'
            }`}
          >
            Insurance Offers
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search provider, APY, bonus..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F5F8FC] border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none focus:ring-1 focus:ring-[#00B894]"
          />
          <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Deals Grid with Integrated In-Feed Ad Unit */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.slice(0, 2).map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        {/* Native In-Feed Ad Unit */}
        <InFeedAd placementId="inFeedNative" />
        {filteredDeals.slice(2).map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>

      {/* AdSense Multiplex Recommendation Grid */}
      <MultiplexAd placementId="multiplexFooter" variant="horizontal" />

      <DisclaimerNotice />
    </div>
  );
};
