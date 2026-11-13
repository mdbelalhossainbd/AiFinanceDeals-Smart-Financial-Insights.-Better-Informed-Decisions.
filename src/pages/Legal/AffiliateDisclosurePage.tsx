import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { Info, ShieldAlert } from 'lucide-react';

export const AffiliateDisclosurePage: React.FC = () => {
  const breadcrumbs = [{ label: 'Affiliate Disclosure' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <MetaTags
        title="Affiliate Compensation & Advertising Disclosure"
        description="Transparent disclosure regarding affiliate partnerships, advertising models, and how AI Finance Deals maintains editorial independence."
        canonicalPath="/affiliate-disclosure/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-[#E2E8F0]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F8FC] text-[#163A5F] rounded-full text-xs font-mono font-semibold">
          <Info className="w-3.5 h-3.5" />
          <span>Full Commercial Transparency</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Affiliate & Commercial Disclosure
        </h1>
        <p className="text-xs text-[#6B7280]">
          In compliance with Federal Trade Commission (FTC) 16 CFR Part 255 Guidelines
        </p>
      </header>

      <div className="prose prose-slate max-w-none text-[#303846] text-sm sm:text-base leading-relaxed space-y-6 [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-xl [&>h2]:text-[#0D1F3C]">
        <h2>How We Fund Our Independent Research</h2>
        <p>
          AI Finance Deals is a free-to-access educational publication. To sustain our operations, compensate full-time research analysts, and keep all guides free of charge, we participate in affiliate marketing programs with certain financial service providers, banks, credit issuers, and insurance platforms.
        </p>

        <h2>What This Means for You as a Reader</h2>
        <p>
          When you click links to financial products or promotional offers featured on our website and subsequently open an account or make a purchase, we may receive compensation from that institution at no additional cost to you. In fact, promotional links on our platform frequently provide readers with verified fee waivers or sign-up bonuses.
        </p>

        <h2>Our Uncompromising Editorial Boundary</h2>
        <p>
          Affiliate relationships never dictate our editorial verdicts:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>We regularly review and recommend products from institutions with whom we have no affiliate or commercial agreement.</li>
          <li>We explicitly highlight drawbacks, high fees, and customer service limitations of partner products when warranted.</li>
          <li>Star ratings, comparison rankings, and editorial badges are determined solely by objective metrics (such as APY, fees, minimum deposit requirements, and regulatory compliance standing).</li>
        </ul>

        <h2>Google AdSense & Contextual Advertising</h2>
        <p>
          Portions of AI Finance Deals display contextual advertising provided by Google AdSense or similar networks. These advertisements are clearly labeled with "Advertisement" and are visually demarcated from organic editorial text. We do not endorse any third-party product advertised via automated ad exchanges.
        </p>
      </div>
    </div>
  );
};
