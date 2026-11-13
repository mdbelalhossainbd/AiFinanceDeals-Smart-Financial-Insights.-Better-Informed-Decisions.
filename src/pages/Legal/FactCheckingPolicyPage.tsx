import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { CheckCheck, ShieldCheck, Database, FileCheck, Award } from 'lucide-react';

export const FactCheckingPolicyPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Fact-Checking Policy' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <MetaTags
        title="Fact-Checking & Research Verification Policy — AI Finance Deals"
        description="Learn about our rigorous fact-checking charter: primary source verification, credentialed editorial audits, and zero-fabrication standards."
        canonicalPath="/fact-checking-policy/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-[#E2E8F0]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F4] text-[#00B894] rounded-full text-xs font-mono font-semibold">
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Research Verification Charter</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Fact-Checking & Research Verification Policy
        </h1>
        <p className="text-xs text-[#6B7280]">
          Last Updated: March 2026 · Standard Version 3.1
        </p>
      </header>

      <div className="prose prose-slate max-w-none text-[#303846] text-sm sm:text-base leading-relaxed space-y-6 [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-xl [&>h2]:text-[#0D1F3C] [&>h3]:font-heading [&>h3]:font-bold [&>h3]:text-base [&>h3]:text-[#163A5F]">
        <h2>1. Why Rigorous Verification Matters in Finance</h2>
        <p>
          Financial publishing carries substantial real-world consequences for household budgets, debt timelines, and retirement security. In accordance with Google's Your Money or Your Life (YMYL) quality rater guidelines and our own ethical charter, every piece of content published on AI Finance Deals is subjected to strict empirical verification before publication.
        </p>

        <h2>2. Hierarchy of Acceptable Primary Sources</h2>
        <p>
          Our researchers and credentialed writers are strictly prohibited from using unverified second-hand blogs, promotional press releases, or marketing claims. All factual assertions, interest rates, and legal frameworks must be anchored in authoritative primary documentation:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-4">
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1 text-xs">
            <span className="font-bold text-[#0D1F3C] flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#00B894]" />
              <span>Government Regulators</span>
            </span>
            <p className="text-[#6B7280]">
              Federal Deposit Insurance Corporation (FDIC), Consumer Financial Protection Bureau (CFPB), Federal Reserve System, Internal Revenue Service (IRS), and Securities and Exchange Commission (SEC).
            </p>
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1 text-xs">
            <span className="font-bold text-[#0D1F3C] flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#00B894]" />
              <span>Actuarial & Insurance Bodies</span>
            </span>
            <p className="text-[#6B7280]">
              National Association of Insurance Commissioners (NAIC), A.M. Best Credit Rating Agency, and Society of Actuaries benchmark mortality studies.
            </p>
          </div>
        </div>

        <h2>3. Three-Tier Review Protocol</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Author Primary Research:</strong> The initial draft is authored by a credentialed subject matter specialist (CFP®, CFA, or ChFC®) who compiles primary source links for every statutory threshold, tax rate, and fee schedule.</li>
          <li><strong>Mathematical & Actuarial Audit:</strong> A secondary reviewer independently recalculates all amortization models, compound interest yields (APY vs APR), tax bracket scenarios, and deductible break-even points.</li>
          <li><strong>Compliance & Disclosure Check:</strong> The editorial director verifies that all affiliate relationships are clearly disclosed, all risks and limitations are prominently highlighted, and no misleading promotional claims exist.</li>
        </ol>

        <h2>4. Prohibition of Fabricated or Outdated Data</h2>
        <p>
          We maintain a zero-tolerance policy against:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Publishing expired banking bonus offers or artificial promotional rates.</li>
          <li>Fabricating customer testimonials, review ratings, or institutional endorsements.</li>
          <li>Misrepresenting hypothetical historical returns as guaranteed future outcomes.</li>
        </ul>

        <h2>5. Scheduled Rate & Terms Audits</h2>
        <p>
          Because central banks adjust monetary policy and retail institutions alter deposit yields dynamically, our editorial team conducts bi-weekly audits of all featured banking APYs, mortgage APRs, and loan terms. If an institution changes its rate structure, our published tables are updated immediately.
        </p>
      </div>
    </div>
  );
};
