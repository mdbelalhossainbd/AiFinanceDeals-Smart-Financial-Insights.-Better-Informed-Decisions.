import React from 'react';
import { Link } from 'react-router-dom';
import { MetaTags } from '../../components/seo/MetaTags';
import { Home, Search, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <MetaTags
        title="Page Not Found (404) — AI Finance Deals"
        description="The requested page could not be located on AI Finance Deals. Explore our financial guides and comparison center."
        canonicalPath="/404"
        robots="noindex, nofollow"
      />

      <div className="w-16 h-16 rounded-2xl bg-[#F5F8FC] border border-[#CBD5E1] text-[#0D1F3C] mx-auto flex items-center justify-center font-heading font-extrabold text-2xl shadow-sm">
        404
      </div>

      <div className="space-y-2">
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Page Not Found
        </h1>
        <p className="text-sm text-[#4B5563] max-w-md mx-auto leading-relaxed">
          The link you followed may be expired or the financial guide may have been updated during our scheduled editorial reorganization.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          to="/articles/"
          className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-[#F5F8FC] text-[#0D1F3C] border border-[#CBD5E1] font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
        >
          <span>Browse All Guides</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Quick Category Directory */}
      <div className="pt-10 border-t border-[#E2E8F0] space-y-3">
        <span className="text-xs font-mono uppercase text-[#6B7280]">
          Popular Financial Categories
        </span>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <Link to="/personal-finance/" className="px-3 py-1 bg-[#F5F8FC] hover:bg-[#E2E8F0] rounded text-[#303846]">
            Personal Finance
          </Link>
          <Link to="/banking/" className="px-3 py-1 bg-[#F5F8FC] hover:bg-[#E2E8F0] rounded text-[#303846]">
            Banking & Savings
          </Link>
          <Link to="/insurance/" className="px-3 py-1 bg-[#F5F8FC] hover:bg-[#E2E8F0] rounded text-[#303846]">
            Insurance Coverage
          </Link>
          <Link to="/finance-deals/" className="px-3 py-1 bg-[#F5F8FC] hover:bg-[#E2E8F0] rounded text-[#303846]">
            Finance Deals
          </Link>
        </div>
      </div>
    </div>
  );
};
