import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { FileText } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Terms & Conditions' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <MetaTags
        title="Terms & Conditions — AI Finance Deals"
        description="Review the terms and conditions governing access to and usage of AI Finance Deals financial editorial publications and comparison tools."
        canonicalPath="/terms-and-conditions/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-[#E2E8F0]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F8FC] text-[#0D1F3C] rounded-full text-xs font-mono font-semibold">
          <FileText className="w-3.5 h-3.5 text-[#0D1F3C]" />
          <span>User Agreement</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-[#6B7280]">
          Last Updated: March 2026
        </p>
      </header>

      <div className="prose prose-slate max-w-none text-[#303846] text-sm sm:text-base leading-relaxed space-y-6 [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-xl [&>h2]:text-[#0D1F3C]">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using AI Finance Deals (https://aifinancedeals.com), you confirm that you have read, understood, and agreed to be bound by these Terms and Conditions. If you do not agree, you must discontinue use of the site.
        </p>

        <h2>2. Intellectual Property Rights</h2>
        <p>
          All editorial articles, guides, graphics, matrices, trademarks, and design components are the proprietary intellectual property of AI Finance Deals and are protected by applicable copyright and trademark laws. You may quote brief excerpts with clear attribution and a direct hyperlink to the original article. Wholesale republication or scraping is strictly prohibited.
        </p>

        <h2>3. Acceptable Use Policy</h2>
        <p>
          You agree not to engage in any activity that impairs or interferes with the normal operation of this website, including transmitting automated scraping bots, attempting unauthorized administrative access, or submitting fraudulent information.
        </p>

        <h2>4. Governing Law</h2>
        <p>
          These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.
        </p>
      </div>
    </div>
  );
};
