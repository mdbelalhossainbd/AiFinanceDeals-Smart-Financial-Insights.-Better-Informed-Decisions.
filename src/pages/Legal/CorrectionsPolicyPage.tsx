import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { AlertCircle, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export const CorrectionsPolicyPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Corrections Policy' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <MetaTags
        title="Corrections & Updates Policy — AI Finance Deals"
        description="Read AI Finance Deals' corrections policy: our commitment to prompt factual accuracy, rate verification protocols, and transparent editorial correction notes."
        canonicalPath="/corrections-policy/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-[#E2E8F0]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F4] text-[#00B894] rounded-full text-xs font-mono font-semibold">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Factual Accountability</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Corrections & Updates Policy
        </h1>
        <p className="text-xs text-[#6B7280]">
          Last Updated: March 2026 · Editorial Transparency Charter
        </p>
      </header>

      <div className="prose prose-slate max-w-none text-[#303846] text-sm sm:text-base leading-relaxed space-y-6 [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-xl [&>h2]:text-[#0D1F3C] [&>h3]:font-heading [&>h3]:font-bold [&>h3]:text-base [&>h3]:text-[#163A5F]">
        <h2>1. Commitment to Factual Accuracy</h2>
        <p>
          AI Finance Deals strives for complete factual and numerical accuracy across all published articles, comparison matrices, and financial deals. In the dynamic landscape of consumer finance—where central bank benchmark rates shift, promotional bank bonuses expire, and regulatory statutes evolve—occasional discrepancies can occur. We view the prompt correction of errors as a core editorial responsibility, not an embarrassment.
        </p>

        <h2>2. Distinction Between Updates and Factual Corrections</h2>
        <p>
          We differentiate between routine rate adjustments and substantive factual errors:
        </p>
        <ul>
          <li><strong>Routine Rate Updates:</strong> When a bank adjusts its high-yield savings APY or an insurer updates policy premiums, we update the figures and advance the <em>"Last Updated"</em> timestamp displayed at the top of the article.</li>
          <li><strong>Substantive Factual Corrections:</strong> If an article contains a factual error regarding tax rules, underwriting criteria, statutory limits, or historical figures, we correct the text immediately and append a formal <strong>Editorial Correction Notice</strong> at the bottom of the article specifying what was amended, why, and the exact timestamp.</li>
        </ul>

        <h2>3. How to Report a Factual Error</h2>
        <p>
          We welcome active oversight from our readers, financial practitioners, and institutional representatives. If you identify an inaccuracy, out-of-date interest rate, or broken citation on AI Finance Deals, please contact our corrections desk:
        </p>
        <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-3 not-prose my-4">
          <Mail className="w-5 h-5 text-[#00B894] shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-[#0D1F3C] block">Editorial Corrections Desk</span>
            <span className="font-mono text-[#163A5F]">editorial@aifinancedeals.com</span>
            <p className="text-[#6B7280] mt-0.5">Please provide the article URL, specific sentence, and credible primary source documentation.</p>
          </div>
        </div>

        <h2>4. Our Review and Verification Timeline</h2>
        <p>
          Upon receiving a correction inquiry:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>Our compliance editor logs the inquiry within 4 business hours.</li>
          <li>The underlying primary regulatory documents (e.g., FDIC, CFPB, SEC, or issuer terms) are re-verified.</li>
          <li>If an error is confirmed, the article is updated and the correction notice appended within 24 business hours.</li>
        </ol>

        <h2>5. Unretracted Opinions and Objective Ratings</h2>
        <p>
          While we vigorously correct factual inaccuracies, we do not alter objective editorial ratings, pros/cons assessments, or critical commentary simply at the request of financial institutions, advertisers, or PR agencies. Our evaluations remain sovereign and focused solely on consumer benefit.
        </p>
      </div>
    </div>
  );
};
