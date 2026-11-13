import React, { useEffect, useState } from 'react';
import { dealService } from '../../services/dealService';
import { Comparison } from '../../types';
import { ComparisonTable } from '../../components/comparisons/ComparisonTable';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { DisclaimerNotice } from '../../components/common/DisclaimerNotice';
import { DisplayAd } from '../../components/ads/DisplayAd';
import { MultiplexAd } from '../../components/ads/MultiplexAd';
import { MetaTags } from '../../components/seo/MetaTags';
import { Scale } from 'lucide-react';

export const ComparisonsPage: React.FC = () => {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);

  useEffect(() => {
    async function loadComp() {
      const data = await dealService.getComparisons();
      setComparisons(data);
      window.scrollTo(0, 0);
    }
    loadComp();
  }, []);

  const breadcrumbs = [{ label: 'Comparisons' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <MetaTags
        title="Financial Service Comparisons & Side-by-Side Reviews"
        description="Compare leading bank accounts, credit cards, insurance providers, and fintech tools side-by-side with objective editorial ratings and fee analysis."
        canonicalPath="/comparisons/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <div className="bg-[#F5F8FC] border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#163A5F] text-[#00C2E0] rounded-full text-xs font-mono font-semibold">
          <Scale className="w-3.5 h-3.5" />
          <span>Independent Benchmarks</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Financial Product & Service Comparison Center
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] max-w-3xl leading-relaxed">
          We systematically analyze fee structures, minimum balance rules, customer service reputation, and regulatory standing to deliver clear, unbiased product comparisons.
        </p>
      </div>

      <div className="space-y-10">
        {comparisons.map((comp) => (
          <ComparisonTable key={comp.id} comparison={comp} />
        ))}
      </div>

      {/* Horizontal Display Ad */}
      <DisplayAd placementId="homepageMid" label="Advertisement · Sponsored Comparison Resource" />

      {/* Recommended Financial Products Multiplex Grid */}
      <MultiplexAd placementId="multiplexFooter" variant="horizontal" />

      <DisclaimerNotice />
    </div>
  );
};
