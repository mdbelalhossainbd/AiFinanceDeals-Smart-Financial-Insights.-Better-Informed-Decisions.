import React from 'react';
import { ArrowUpRight, Shield, Globe, Lock } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (categorySlug: string | null) => void;
  onSubmitDealClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onSubmitDealClick }) => {
  return (
    <footer className="w-full border-t border-stone-200 dark:border-stone-800 bg-[#FAF9F5] dark:bg-[#111215] text-stone-700 dark:text-stone-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-stone-200 dark:border-stone-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              AI Finance Deals
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-sm leading-relaxed">
              The premier intelligence publication and real-time deal tracker for artificial intelligence venture funding, enterprise M&A, compute infrastructure debt, and sovereign capital syndicates.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-stone-400" />
                <span>New York · London · San Francisco · Singapore</span>
              </span>
            </div>
            <div className="pt-1">
              <button
                onClick={onSubmitDealClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-900 dark:text-white bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded transition-colors cursor-pointer"
              >
                <span>Submit Confidential Term Sheet Tip</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Intelligence Coverage Column */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-stone-900 dark:text-stone-200 font-semibold mb-3">
              Sector Coverage
            </div>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <button
                  onClick={() => onSelectCategory('generative-infra')}
                  className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Generative Infrastructure
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('autonomous-finance')}
                  className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Autonomous Finance & Agents
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('algorithmic-trading')}
                  className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Algorithmic Asset Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('sovereign-funds')}
                  className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Sovereign Capital Syndicates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('enterprise-compliance')}
                  className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Compliance & Regulatory AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('bio-fintech')}
                  className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Bio-FinTech & Health AI
                </button>
              </li>
            </ul>
          </div>

          {/* Capital Stages Column */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-stone-900 dark:text-stone-200 font-semibold mb-3">
              Deal Stages
            </div>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <a href="#deals-stream" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Early Stage: Seed & Pre-Seed
                </a>
              </li>
              <li>
                <a href="#deals-stream" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Venture Rounds: Series A & B
                </a>
              </li>
              <li>
                <a href="#deals-stream" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Growth & Mega-Rounds ($100M+)
                </a>
              </li>
              <li>
                <a href="#deals-stream" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Strategic M&A & Buyouts
                </a>
              </li>
              <li>
                <a href="#deals-stream" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Sovereign Debt Facilities
                </a>
              </li>
            </ul>
          </div>

          {/* Institutional Services Column */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-stone-900 dark:text-stone-200 font-semibold mb-3">
              Institutional
            </div>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <a href="#newsletter" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Daily Briefing Subscription
                </a>
              </li>
              <li>
                <button 
                  onClick={onSubmitDealClick} 
                  className="hover:text-stone-900 dark:hover:text-white transition-colors text-left"
                >
                  Submit a Funding Round
                </button>
              </li>
              <li>
                <a href="#market-metrics" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Market Barometer & Benchmarks
                </a>
              </li>
              <li>
                <a href="#editorial-charter" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Editorial Methodology & SEC Reconciliations
                </a>
              </li>
              <li>
                <span className="text-stone-400 dark:text-stone-600">Enterprise API (Coming in Phase 2)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Editorial Integrity & Financial Disclaimers */}
        <div id="editorial-charter" className="py-6 border-b border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 space-y-2 leading-relaxed">
          <div className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-stone-400" />
            <span>Editorial Independence & Financial Advisory Disclosure</span>
          </div>
          <p>
            AI Finance Deals publishes analytical reporting and curated deal intelligence for informational purposes only. Nothing on this website constitutes financial, investment, legal, or tax advice, nor an endorsement of any company, syndicate, security, or investment strategy. All deal data, round sizes, and valuation multiples are independently verified through SEC Form D disclosures, lead institutional syndicate releases, and authorized primary sources.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Live Timestamp */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-stone-400 gap-3">
          <div>
            © 2026 AI Finance Deals Publishing Group. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>Terminal Live: NYC 09:42 ET</span>
            <span aria-hidden="true">·</span>
            <span>Latency: Real-Time</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
