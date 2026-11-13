import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Globe } from 'lucide-react';
import { openCookiePreferences } from '../common/CookieConsentBanner';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0D1F3C] text-white border-t border-[#163A5F]">
      {/* Upper Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#163A5F] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#00B894]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                AI FINANCE <span className="text-[#00B894]">DEALS</span>
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              Smart Financial Insights. Better Informed Decisions. AI Finance Deals is an independent educational publisher and comparative research platform dedicated to helping consumers and professionals navigate personal finance, banking, insurance, and financial technology.
            </p>

            <div className="space-y-1.5 text-xs text-stone-300 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#00C2E0]" />
                <span>editorial@aifinancedeals.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#00C2E0]" />
                <span>Primary Domain: https://aifinancedeals.com</span>
              </div>
            </div>
          </div>

          {/* Editorial Categories */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#00C2E0] mb-4">
              Editorial Guides
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li><Link to="/personal-finance/" className="hover:text-white transition-colors">Personal Finance</Link></li>
              <li><Link to="/personal-finance/budgeting/" className="hover:text-white transition-colors">Budgeting Guides</Link></li>
              <li><Link to="/personal-finance/saving/" className="hover:text-white transition-colors">Saving Strategies</Link></li>
              <li><Link to="/banking/" className="hover:text-white transition-colors">Banking & Accounts</Link></li>
              <li><Link to="/credit-loans/" className="hover:text-white transition-colors">Credit & Loans</Link></li>
              <li><Link to="/insurance/" className="hover:text-white transition-colors">Insurance Coverage</Link></li>
              <li><Link to="/financial-technology/" className="hover:text-white transition-colors">Financial Technology</Link></li>
            </ul>
          </div>

          {/* Research & Comparisons */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#00C2E0] mb-4">
              Comparisons & Deals
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li><Link to="/finance-deals/" className="hover:text-white transition-colors">Verified Finance Deals</Link></li>
              <li><Link to="/comparisons/" className="hover:text-white transition-colors">Comparison Center</Link></li>
              <li><Link to="/banking/bank-accounts/" className="hover:text-white transition-colors">Top High-Yield Savings</Link></li>
              <li><Link to="/insurance/life-insurance/" className="hover:text-white transition-colors">Life Insurance Reviews</Link></li>
              <li><Link to="/insurance/health-insurance/" className="hover:text-white transition-colors">Health Insurance Guides</Link></li>
              <li><Link to="/articles/" className="hover:text-white transition-colors">All Published Articles</Link></li>
              <li><a href="/sitemap.xml" className="hover:text-white transition-colors">XML Sitemap</a></li>
            </ul>
          </div>

          {/* Trust & Legal Disclosures */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#00C2E0] mb-4">
              Editorial Standards & Trust
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-300">
              <li><Link to="/about-us/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/editorial-team/" className="hover:text-white transition-colors">Editorial Board & Analysts</Link></li>
              <li><Link to="/authors/" className="hover:text-white transition-colors">Author Profiles</Link></li>
              <li><Link to="/editorial-policy/" className="hover:text-white transition-colors">Editorial Policy</Link></li>
              <li><Link to="/fact-checking-policy/" className="hover:text-white transition-colors">Fact-Checking Charter</Link></li>
              <li><Link to="/corrections-policy/" className="hover:text-white transition-colors">Corrections Policy</Link></li>
              <li><Link to="/affiliate-disclosure/" className="hover:text-white transition-colors">Affiliate Disclosure</Link></li>
              <li><Link to="/advertising-disclosure/" className="hover:text-white transition-colors">Advertising Disclosure</Link></li>
              <li><Link to="/cookie-policy/" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link to="/disclaimer/" className="hover:text-white transition-colors">Financial Disclaimer</Link></li>
              <li><Link to="/privacy-policy/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions/" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/contact/" className="hover:text-white transition-colors">Contact Editorial Desk</Link></li>
            </ul>
          </div>
        </div>

        {/* AdSense & Regulatory Compliance Statement */}
        <div className="mt-12 pt-8 border-t border-[#163A5F] text-[11px] text-stone-400 space-y-2.5 leading-relaxed">
          <div className="flex items-center gap-2 text-stone-200 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#00B894] shrink-0" />
            <span>Editorial Integrity, Transparency & Regulatory Compliance</span>
          </div>
          <p>
            AI Finance Deals participates in affiliate marketing programs, which means we may earn fees or commissions when readers click links to products or services reviewed on our website. However, our editorial evaluations, star ratings, and rankings are strictly independent and are never determined, altered, or influenced by affiliate partnerships or advertising arrangements.
          </p>
          <p>
            Information published on AI Finance Deals is intended solely for educational, informational, and general comparative purposes and must not be construed as individualized legal, financial, accounting, or tax counsel. All product offers, interest rates, APYs, and fee schedules are independently verified at the time of publication but are subject to change without notice by respective third-party institutions.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Rights */}
        <div className="mt-8 pt-6 border-t border-[#163A5F]/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} AI Finance Deals. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-stone-400">
            <Link to="/privacy-policy/" className="hover:text-white transition-colors">Privacy</Link>
            <span>·</span>
            <Link to="/terms-and-conditions/" className="hover:text-white transition-colors">Terms</Link>
            <span>·</span>
            <Link to="/affiliate-disclosure/" className="hover:text-white transition-colors">Disclosures</Link>
            <span>·</span>
            <button
              type="button"
              onClick={openCookiePreferences}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cookie Preferences
            </button>
            <span>·</span>
            <Link to="/contact/" className="hover:text-white transition-colors">Inquiries</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
