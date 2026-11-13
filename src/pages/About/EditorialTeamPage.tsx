import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { AUTHORS } from '../../data/mockData';
import { AuthorBio } from '../../components/articles/AuthorBio';
import { Users, Award, ShieldCheck, BookOpen, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EditorialTeamPage: React.FC = () => {
  const breadcrumbs = [
    { label: 'About Us', href: '/about-us/' },
    { label: 'Editorial Team' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <MetaTags
        title="Editorial Board & Credentialed Financial Analysts — AI Finance Deals"
        description="Meet the Certified Financial Planners (CFP®), Chartered Financial Analysts (CFA), and insurance actuaries who research, write, and verify content on AI Finance Deals."
        canonicalPath="/editorial-team/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-[#E2E8F0]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F4] text-[#00B894] rounded-full text-xs font-mono font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>Credentialed Financial Writers</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1F3C]">
          Our Editorial Board & Financial Analysts
        </h1>
        <p className="text-sm sm:text-base text-[#4B5563] max-w-3xl leading-relaxed">
          At AI Finance Deals, our educational articles, banking matrices, and insurance analyses are produced exclusively by experienced financial practitioners holding certified industry designations.
        </p>
      </header>

      {/* Editorial Standards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#E6F8F4] text-[#00B894] flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="font-heading font-bold text-sm text-[#0D1F3C]">Rigorous Credentialing</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Every author maintains active professional designations including CFP®, CFA, or ChFC®, upholding fiduciary education and ethics standards.
          </p>
        </div>

        <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#E6F8F4] text-[#00B894] flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-heading font-bold text-sm text-[#0D1F3C]">Commercial Independence</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Our writers have no personal financial stake or affiliate incentives tied to individual product evaluations or ratings.
          </p>
        </div>

        <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#E6F8F4] text-[#00B894] flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="font-heading font-bold text-sm text-[#0D1F3C]">Continuous Verification</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Content is reviewed bi-weekly against primary regulatory filings to ensure rates and statutory parameters reflect current markets.
          </p>
        </div>
      </div>

      {/* Author Profiles List */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-[#0D1F3C]">
            Active Editorial Staff & Contributors
          </h2>
          <span className="text-xs font-mono text-[#00B894] font-semibold">
            All Profiles Verified
          </span>
        </div>

        <div className="space-y-6">
          {AUTHORS.map((author) => (
            <div key={author.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#0D1F3C] text-white flex items-center justify-center font-heading font-bold text-xl shrink-0">
                    {author.name[0]}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#0D1F3C]">
                      {author.name}
                    </h3>
                    <span className="text-xs text-[#163A5F] font-semibold block">
                      {author.role}
                    </span>
                    <span className="text-xs font-mono text-[#00B894] block mt-0.5">
                      {author.credentials}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Link
                    to={`/authors/${author.slug}`}
                    className="px-3 py-1.5 bg-[#0D1F3C] hover:bg-[#163A5F] text-white rounded-lg transition-colors font-semibold"
                  >
                    Author Profile & Guides
                  </Link>
                  {author.linkedin_url && (
                    <a
                      href={author.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#F5F8FC] hover:bg-[#E2E8F0] text-[#0D1F3C] rounded-lg transition-colors inline-flex items-center gap-1 font-medium"
                    >
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="w-3 h-3 text-[#6B7280]" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed pt-2 border-t border-[#F1F5F9]">
                {author.bio}
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#6B7280]">
                <span className="font-semibold text-[#0D1F3C]">Coverage Disciplines:</span>
                {author.id === 'auth-1' && (
                  <>
                    <span className="px-2 py-0.5 bg-[#F5F8FC] rounded border border-[#E2E8F0]">Household Budgeting</span>
                    <span className="px-2 py-0.5 bg-[#F5F8FC] rounded border border-[#E2E8F0]">Debt Acceleration</span>
                    <span className="px-2 py-0.5 bg-[#F5F8FC] rounded border border-[#E2E8F0]">Retirement Tax Strategy</span>
                  </>
                )}
                {author.id === 'auth-2' && (
                  <>
                    <span className="px-2 py-0.5 bg-[#F5F8FC] rounded border border-[#E2E8F0]">High-Yield Banking</span>
                    <span className="px-2 py-0.5 bg-[#F5F8FC] rounded border border-[#E2E8F0]">Treasury Fixed Income</span>
                    <span className="px-2 py-0.5 bg-[#F5F8FC] rounded border border-[#E2E8F0]">FinTech & Open Banking APIs</span>
                  </>
                )}
                {author.id === 'auth-3' && (
                  <>
                    <span className="px-2 py-0.5 bg-[#F5F8FC] rounded border border-[#E2E8F0]">Term Life Underwriting</span>
                    <span className="px-2 py-0.5 bg-[#F5F8FC] rounded border border-[#E2E8F0]">HDHP & HSA Optimization</span>
                    <span className="px-2 py-0.5 bg-[#F5F8FC] rounded border border-[#E2E8F0]">Auto Liability Actuarial Math</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Standards Cross-Links */}
      <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-[#0D1F3C] block text-sm">Review Our Core Editorial Standards</span>
          <p className="text-[#6B7280] mt-0.5">Learn how we enforce fact-checking, advertiser independence, and reader transparency.</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link to="/editorial-policy/" className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg hover:border-[#00B894] font-medium text-[#0D1F3C]">
            Editorial Policy
          </Link>
          <Link to="/fact-checking-policy/" className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg hover:border-[#00B894] font-medium text-[#0D1F3C]">
            Fact-Checking Charter
          </Link>
          <Link to="/corrections-policy/" className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg hover:border-[#00B894] font-medium text-[#0D1F3C]">
            Corrections Policy
          </Link>
        </div>
      </div>
    </div>
  );
};
