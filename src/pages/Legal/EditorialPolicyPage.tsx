import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { ShieldCheck } from 'lucide-react';

export const EditorialPolicyPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Editorial Policy' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <MetaTags
        title="Editorial Policy, Content Update Standards & Fact-Checking"
        description="Review AI Finance Deals' editorial guidelines, research methodology, content update schedule, source attribution rules, and advertiser independence standards."
        canonicalPath="/editorial-policy/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-[#E2E8F0]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F4] text-[#00B894] rounded-full text-xs font-mono font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Journalistic Integrity</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Editorial Policy & Content Update Standards
        </h1>
        <p className="text-xs text-[#6B7280]">
          Last Updated: March 2026 · Standard Version 2.5
        </p>
      </header>

      <div className="prose prose-slate max-w-none text-[#303846] text-sm sm:text-base leading-relaxed space-y-6 [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-xl [&>h2]:text-[#0D1F3C] [&>h3]:font-heading [&>h3]:font-bold [&>h3]:text-base [&>h3]:text-[#163A5F]">
        <h2>1. Fundamental Editorial Mission</h2>
        <p>
          At AI Finance Deals, our mission is to empower consumers, savers, and households to make well-informed financial decisions through clear, accurate, and unbiased educational information. Financial literacy content must be practical, mathematically sound, and free from deceptive marketing.
        </p>

        <h2>2. Independence from Commercial Partners</h2>
        <p>
          Our editorial team operates independently from commercial advertisers, sponsors, and affiliate networks:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Editorial Sovereignty:</strong> Commercial partners cannot pay for favorable reviews, higher editorial ratings, or preferential positioning in comparison tables.</li>
          <li><strong>No Pre-Publication Review:</strong> Advertisers and financial institutions are never permitted to preview or alter editorial articles prior to publication.</li>
          <li><strong>Clear Commercial Separation:</strong> Sponsored placements and affiliate disclosures are visibly separated from editorial evaluation criteria.</li>
        </ul>

        <h2>3. Multi-Stage Review & Human Oversight Workflow</h2>
        <p>
          Every article enters a structured editorial pipeline before reaching public readers:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Drafting & Primary Source Citation:</strong> Articles must reference authoritative regulatory bodies or primary institutional filings (e.g., FDIC, CFPB, IRS, Federal Reserve, Healthcare.gov, SEC).</li>
          <li><strong>Editorial & Mathematical Review:</strong> Drafts undergo human editorial review and fact-checking verification before status promotion. Unreviewed AI-assisted drafts are never automatically published.</li>
          <li><strong>Approval & Publication Gate:</strong> Only managing editors or administrators may approve and publish completed guides after verifying disclosures and citations.</li>
        </ol>

        <h2>4. Content Update Policy & Periodic Rate Audits</h2>
        <p>
          Financial rules, tax limits, interest rates, and deposit terms change continuously. AI Finance Deals maintains a structured Content Update Policy:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Scheduled Review Cycle:</strong> Evergreen guides are reviewed quarterly for statutory accuracy (e.g., IRS contribution caps, FDIC insurance thresholds, CFPB regulations), while rate-sensitive banking and loan comparisons are audited bi-weekly.</li>
          <li><strong>Event-Driven Updates:</strong> Significant central bank rate adjustments, regulatory rulemakings, or issuer fee changes trigger immediate out-of-cycle editorial reviews.</li>
          <li><strong>Transparent Timestamps:</strong> Every published guide displays both its original publication date and its most recent substantive update date.</li>
        </ul>

        <h2>5. Corrections & Reader Accountability</h2>
        <p>
          When a factual inaccuracy is reported or identified, we verify the claim against primary sources and update the article promptly. Review our full{' '}
          <Link to="/fact-checking-policy/" className="text-[#163A5F] font-semibold hover:underline">
            Fact-Checking Charter
          </Link>
          ,{' '}
          <Link to="/corrections-policy/" className="text-[#163A5F] font-semibold hover:underline">
            Corrections Policy
          </Link>
          , and{' '}
          <Link to="/editorial-team/" className="text-[#163A5F] font-semibold hover:underline">
            Editorial Team Profiles
          </Link>.
        </p>
      </div>
    </div>
  );
};
