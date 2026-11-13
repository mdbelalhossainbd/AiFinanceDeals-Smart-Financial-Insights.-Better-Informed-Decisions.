import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { AUTHORS } from '../../data/mockData';
import { AuthorBio } from '../../components/articles/AuthorBio';
import { ShieldCheck, Target, Award, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const breadcrumbs = [{ label: 'About Us' }];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <MetaTags
        title="About AI Finance Deals — Editorial Mission & Standards"
        description="Learn about the financial planners, quantitative analysts, and insurance actuaries behind AI Finance Deals and our commitment to objective publishing."
        canonicalPath="/about-us/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-[#00B894] font-semibold">
          Publisher Transparency
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1F3C]">
          Smart Financial Insights. Better Informed Decisions.
        </h1>
        <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
          AI Finance Deals was founded with a singular objective: to cut through the marketing noise of modern consumer finance by pairing rigorous human financial expertise with automated data verification.
        </p>
      </header>

      {/* Editorial Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#E6F8F4] text-[#00B894] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-[#0D1F3C]">
            Objective Methodology
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Our evaluations, rankings, and product ratings are driven by objective scoring rubrics—never advertising dollars or affiliate commissions.
          </p>
        </div>

        <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#E6F8F4] text-[#00B894] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-[#0D1F3C]">
            Credentialed Writers
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Articles are written and audited by Certified Financial Planners (CFP®), Chartered Financial Analysts (CFA), and licensed actuaries.
          </p>
        </div>

        <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#E6F8F4] text-[#00B894] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-[#0D1F3C]">
            Zero Fabricated Offers
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            All banking APYs, promotional rates, and loan APRs are independently cross-referenced against primary SEC and FDIC filings.
          </p>
        </div>
      </div>

      {/* Editorial Team */}
      <section className="space-y-6 pt-6 border-t border-[#E2E8F0]">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#0D1F3C]">
            Our Editorial Board & Analysts
          </h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Meet the experienced financial professionals who research, write, and verify our content.
          </p>
        </div>

        <div className="space-y-4">
          {AUTHORS.map((author) => (
            <AuthorBio key={author.id} author={author} />
          ))}
        </div>
      </section>

      {/* Trust & Independence Statement */}
      <div className="p-8 bg-[#0D1F3C] text-white rounded-2xl space-y-4">
        <h3 className="font-heading text-xl font-bold text-white">
          Our Independence Pledge
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          While we participate in affiliate partnerships to support our free educational content, our editorial opinions remain sovereign. If a financial institution changes its fee schedule, reduces customer support quality, or lowers interest rates, our reviews reflect that immediately—regardless of any business relationship.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
          <Link to="/editorial-policy/" className="text-[#00B894] hover:underline">
            Read Our Full Editorial Policy →
          </Link>
          <Link to="/affiliate-disclosure/" className="text-[#00C2E0] hover:underline">
            Read Our Affiliate Disclosures →
          </Link>
        </div>
      </div>
    </div>
  );
};
