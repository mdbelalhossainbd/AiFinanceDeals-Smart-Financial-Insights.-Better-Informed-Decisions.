import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { Radio, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AdvertisingDisclosurePage: React.FC = () => {
  const breadcrumbs = [{ label: 'Advertising Disclosure' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <MetaTags
        title="Advertising Disclosure & Sponsorship Standards — AI Finance Deals"
        description="Learn how AI Finance Deals handles display advertising, Google AdSense units, and commercial sponsorships while preserving editorial objectivity."
        canonicalPath="/advertising-disclosure/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-[#E2E8F0]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F8FC] text-[#00B894] rounded-full text-xs font-mono font-semibold">
          <Radio className="w-3.5 h-3.5" />
          <span>Advertising Transparency</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Advertising Disclosure & Standards
        </h1>
        <p className="text-xs text-[#6B7280]">
          Last Updated: March 2026 · Compliant with FTC 16 CFR Part 255 & Google AdSense Publisher Policies
        </p>
      </header>

      <div className="prose prose-slate max-w-none text-[#303846] text-sm sm:text-base leading-relaxed space-y-6 [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-xl [&>h2]:text-[#0D1F3C] [&>h3]:font-heading [&>h3]:font-bold [&>h3]:text-base [&>h3]:text-[#163A5F]">
        <h2>1. The Editorial and Advertising Firewall</h2>
        <p>
          AI Finance Deals maintains an uncompromised institutional separation between our editorial staff and commercial advertising operations. Our financial planners, quantitative analysts, and insurance researchers operate independently from ad sales and commercial partnerships. Advertisers and sponsors have zero authority or influence over:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Which financial products, banks, or insurance carriers we choose to review.</li>
          <li>Star ratings, comparison matrices, pros/cons assessments, or editorial verdicts.</li>
          <li>The publication timing, factual updates, or critical commentary in our guides.</li>
        </ul>

        <h2>2. Google AdSense & Contextual Display Units</h2>
        <p>
          We utilize the official Google AdSense platform to deliver automated, responsive display advertisements across eligible public pages of our website. In accordance with Google Publisher Policies:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Clear Labeling:</strong> Every individual ad unit is distinctly marked with prominent labels such as <em>"Advertisement"</em> or <em>"Sponsored Recommendation"</em> to ensure visitors can immediately differentiate paid placements from editorial content.</li>
          <li><strong>Zero Deceptive Placement:</strong> Advertisements are positioned with explicit reserved geometric spacing (preventing layout shifts) and never placed in a manner designed to provoke accidental clicks or mimic organic navigation links.</li>
          <li><strong>Restricted Pages:</strong> Advertisements are strictly prohibited on non-editorial utility routes, user account screens, administrative CMS portals, and error pages.</li>
        </ul>

        <h2>3. Affiliate Links and Partner Offers</h2>
        <p>
          Certain product links on AI Finance Deals are affiliate links. If a reader clicks an affiliate link and subsequently opens a verified account or purchases a financial service, AI Finance Deals may receive referral compensation. However:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Referral fees are paid by the financial institution, not the consumer. Using our links never increases user rates, account fees, or costs.</li>
          <li>We consistently feature and recommend institutions with which we have no commercial relationship whenever their product terms or APY rates represent the superior choice for consumers.</li>
        </ul>

        <h2>4. Prohibited Advertising Categories</h2>
        <p>
          To protect reader welfare and financial security, AI Finance Deals rejects all advertising and promotional partnerships involving:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Predatory payday loans, title loans, and unregulated high-cost advance lenders.</li>
          <li>Unregistered binary options, speculative foreign exchange schemes, or guaranteed get-rich-quick programs.</li>
          <li>Deceptive credit repair operations claiming to legally erase accurate negative marks.</li>
        </ul>

        <h2>5. Reader Questions & Inquiries</h2>
        <p>
          If you encounter an advertisement that appears misleading or deceptive, please notify our compliance desk immediately at <span className="font-mono text-[#0D1F3C]">compliance@aifinancedeals.com</span> with a screenshot and URL.
        </p>
      </div>
    </div>
  );
};
