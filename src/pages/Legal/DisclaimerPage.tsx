import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Legal Disclaimer' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <MetaTags
        title="Financial & Advisory Disclaimer — AI Finance Deals"
        description="Read the complete financial disclaimer for AI Finance Deals: educational purposes only, not personalized investment, legal, or tax counsel."
        canonicalPath="/disclaimer/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-[#E2E8F0]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F8FC] text-[#0D1F3C] rounded-full text-xs font-mono font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-[#0D1F3C]" />
          <span>Statutory Notice</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Financial & Advisory Disclaimer
        </h1>
        <p className="text-xs text-[#6B7280]">
          Effective Date: January 1, 2026
        </p>
      </header>

      <div className="prose prose-slate max-w-none text-[#303846] text-sm sm:text-base leading-relaxed space-y-6 [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-xl [&>h2]:text-[#0D1F3C]">
        <h2>1. General Educational Information Only</h2>
        <p>
          The materials, articles, calculators, comparisons, and guides provided on AI Finance Deals (https://aifinancedeals.com) are intended solely for general informational and educational purposes. Nothing on this website constitutes, or is intended to constitute, personalized financial, investment, legal, accounting, tax, or actuarial advice.
        </p>

        <h2>2. No Fiduciary or Advisor Relationship</h2>
        <p>
          Your use of this website does not establish a client, advisory, or fiduciary relationship between you and AI Finance Deals, its parent entity, authors, editors, or contributors. Financial decisions should be tailored to your unique financial situation, risk tolerance, investment horizon, and tax jurisdiction. We strongly urge you to consult with a licensed professional—such as a Certified Financial Planner (CFP®), Certified Public Accountant (CPA), or FINRA-registered financial advisor—before executing significant transactions.
        </p>

        <h2>3. Accuracy of Product Terms & Third-Party Rates</h2>
        <p>
          While we make every reasonable effort to verify promotional annual percentage yields (APYs), mortgage APRs, credit card terms, and insurance premiums at the time of publication, financial institutions adjust terms dynamically without prior notice. Always verify final figures, terms, and eligibility conditions on the respective institution’s official application portal before entering into any financial commitment.
        </p>

        <h2>4. Limitation of Liability</h2>
        <p>
          Under no circumstances shall AI Finance Deals, its affiliates, directors, officers, employees, or content contributors be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising from the use of, or inability to use, information provided on this platform.
        </p>
      </div>
    </div>
  );
};
