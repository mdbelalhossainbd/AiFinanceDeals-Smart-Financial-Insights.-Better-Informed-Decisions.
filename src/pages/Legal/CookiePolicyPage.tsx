import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { openCookiePreferences } from '../../components/common/CookieConsentBanner';
import { Cookie, SlidersHorizontal } from 'lucide-react';

export const CookiePolicyPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Cookie Policy' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <MetaTags
        title="Cookie & Tracking Technologies Policy — AI Finance Deals"
        description="Review AI Finance Deals' cookie and browser storage policy: essential preferences, optional analytics, advertising controls, and how to manage consent."
        canonicalPath="/cookie-policy/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-[#E2E8F0]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F8FC] text-[#163A5F] rounded-full text-xs font-mono font-semibold">
          <Cookie className="w-3.5 h-3.5" />
          <span>Tracking & Storage Disclosures</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Cookie & Tracking Technologies Policy
        </h1>
        <p className="text-xs text-[#6B7280]">
          Last Updated: March 2026
        </p>
      </header>

      <div className="p-5 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-[#303846]">
          <strong className="text-[#0D1F3C] block text-sm mb-0.5">Manage Your On-Site Consent Preference</strong>
          Choose whether optional analytics and contextual advertising scripts may load during your visit.
        </div>
        <button
          type="button"
          onClick={openCookiePreferences}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D1F3C] hover:bg-[#163A5F] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Update Cookie Preferences</span>
        </button>
      </div>

      <div className="prose prose-slate max-w-none text-[#303846] text-sm sm:text-base leading-relaxed space-y-6 [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-xl [&>h2]:text-[#0D1F3C] [&>h3]:font-heading [&>h3]:font-bold [&>h3]:text-base [&>h3]:text-[#163A5F]">
        <h2>1. How Cookies and Local Storage Are Used</h2>
        <p>
          Cookies and browser storage (<code>localStorage</code>) are small text entries stored by your browser to preserve user choices, support site functionality, and—only when enabled and consented—measure aggregate site traffic or deliver advertisements.
        </p>

        <h2>2. Categories of Storage & Cookies</h2>

        <h3>Tier 1: Strictly Necessary Storage (Essential)</h3>
        <p>
          Always active to support core site behavior and privacy choices:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Consent State (<code>aifinancedeals_cookie_consent</code>):</strong> Remembers whether you selected &quot;Essential Only&quot; or &quot;Accept Analytics &amp; Ads&quot;.</li>
          <li><strong>CMS Authentication Session (Admin Staff Only):</strong> Stores session state solely for authorized editorial staff signing into <code>/admin</code>.</li>
        </ul>

        <h3>Tier 2: Optional Analytics Scripts</h3>
        <p>
          Optional Google Analytics 4 telemetry is <strong>only</strong> loaded when a valid measurement ID is configured for the deployment <strong>and</strong> you select &quot;Accept Analytics &amp; Ads&quot; in the preference banner:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Google Analytics 4:</strong> Measures aggregated page visits and referral paths with <code>anonymize_ip</code> enabled.</li>
        </ul>

        <h3>Tier 3: Optional Advertising Cookies (Google AdSense)</h3>
        <p>
          Google AdSense scripts and third-party advertising cookies are <strong>only</strong> loaded when advertising is explicitly enabled in production configuration <strong>and</strong> you accept optional cookies:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Google / DoubleClick Cookies:</strong> Used by Google and certified ad partners to serve ads and prevent repeated ad impressions.</li>
        </ul>

        <h2>3. Controlling & Opting Out of Cookies</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>On-Site Banner:</strong> Click &quot;Update Cookie Preferences&quot; above or &quot;Cookie Preferences&quot; in the website footer at any time.</li>
          <li><strong>Browser Controls:</strong> Configure Chrome, Safari, Firefox, or Edge to block or clear cookies and site data.</li>
          <li><strong>External Ad Opt-Outs:</strong> Visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#163A5F] underline">Google Ad Settings</a> or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#163A5F] underline">www.aboutads.info/choices</a>.</li>
        </ul>
      </div>
    </div>
  );
};
