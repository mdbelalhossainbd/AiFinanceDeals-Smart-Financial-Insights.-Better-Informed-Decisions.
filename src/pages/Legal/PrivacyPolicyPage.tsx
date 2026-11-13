import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { openCookiePreferences } from '../../components/common/CookieConsentBanner';
import { Lock } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Privacy Policy' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <MetaTags
        title="Privacy Policy — AI Finance Deals"
        description="Learn how AI Finance Deals collects, safeguards, and respects user data in compliance with GDPR, CCPA, and Google AdSense privacy disclosures."
        canonicalPath="/privacy-policy/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-[#E2E8F0]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F8FC] text-[#00B894] rounded-full text-xs font-mono font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Data Protection & Privacy</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#6B7280]">
          Last Updated: March 2026
        </p>
      </header>

      <div className="prose prose-slate max-w-none text-[#303846] text-sm sm:text-base leading-relaxed space-y-6 [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-xl [&>h2]:text-[#0D1F3C]">
        <h2>1. Overview and Commitment</h2>
        <p>
          AI Finance Deals (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects visitor privacy. This Privacy Policy describes what information may be collected when you browse https://aifinancedeals.com, how browser storage and optional analytics/advertising scripts work, and how you can manage your preferences.
        </p>

        <h2>2. Information We Collect & Browser Storage</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Voluntary Submissions:</strong> If you subscribe to our newsletter or submit an editorial contact inquiry, we collect the email address, cadence preference, name, and message you voluntarily enter. Newsletter consent is explicitly recorded before submission.</li>
          <li><strong>Essential Browser Preferences:</strong> We store your cookie consent selection (<code>essential_only</code> or <code>all</code>) in browser <code>localStorage</code> so the site remembers your privacy preference across visits.</li>
          <li><strong>Infrastructure Logs:</strong> Our hosting provider (Netlify) and database provider (Supabase, when enabled) process standard HTTP/TLS connection metadata (such as IP address and request timestamps) for delivery, DDoS mitigation, and security auditing.</li>
        </ul>

        <h2>3. Optional Analytics & Google AdSense</h2>
        <p>
          Optional third-party scripts (such as Google Analytics 4 or Google AdSense) are <strong>disabled by default</strong> until explicitly enabled in our production configuration and permitted through your cookie preference selection:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Google Analytics 4:</strong> When enabled and consented, collects aggregated usage metrics with IP anonymization enabled.</li>
          <li><strong>Google AdSense:</strong> When active, third-party vendors, including Google, may use cookies (including the DoubleClick cookie) to serve contextual or personalized ads based on prior visits to this or other websites.</li>
        </ul>
        <p>
          You can adjust your on-site preference anytime using our{' '}
          <button
            type="button"
            onClick={openCookiePreferences}
            className="text-[#163A5F] font-semibold underline cursor-pointer"
          >
            Cookie Preferences Manager
          </button>
          , or opt out of personalized Google advertising via{' '}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#163A5F] underline">
            Google Ad Settings
          </a>{' '}
          and{' '}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#163A5F] underline">
            www.aboutads.info/choices
          </a>. Review our full{' '}
          <Link to="/cookie-policy/" className="text-[#163A5F] underline">
            Cookie Policy
          </Link>{' '}
          for storage specifics.
        </p>

        <h2>4. Data Sharing & Security</h2>
        <p>
          We do not sell, rent, or trade personally identifiable visitor data to third parties. Database access is encrypted via HTTPS/TLS and governed by PostgreSQL Row Level Security (RLS) policies restricting administrative tables and subscriber records strictly to authorized personnel.
        </p>

        <h2>5. Exercising Your Privacy Rights</h2>
        <p>
          To request access to, correction of, or deletion of any personal information you have submitted (such as newsletter subscriptions), contact us at <span className="font-mono text-[#0D1F3C]">privacy@aifinancedeals.com</span> or via our{' '}
          <Link to="/contact/" className="text-[#163A5F] underline">Contact Page</Link>.
        </p>
      </div>
    </div>
  );
};
