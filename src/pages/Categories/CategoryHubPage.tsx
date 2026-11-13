import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { dealService } from '../../services/dealService';
import { Article, Category, Comparison } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { ArticleCard } from '../../components/articles/ArticleCard';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ComparisonTable } from '../../components/comparisons/ComparisonTable';
import { AdBanner } from '../../components/ads/AdBanner';
import { InFeedAd } from '../../components/ads/InFeedAd';
import { MultiplexAd } from '../../components/ads/MultiplexAd';
import { MetaTags } from '../../components/seo/MetaTags';
import { StructuredData } from '../../components/seo/StructuredData';
import { NewsletterForm } from '../../components/forms/NewsletterForm';
import { 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  Scale, 
  BookOpen, 
  CheckCircle2, 
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CategoryHubPageProps {
  categorySlug: string;
  subCategorySlug?: string;
  customTitle?: string;
  customDescription?: string;
}

interface CategoryFAQ {
  question: string;
  answer: string;
}

interface CategoryEducationalPillar {
  title: string;
  description: string;
  iconName: string;
}

// Category Intelligence: Curated Pillar Guidance & Structured FAQs
const CATEGORY_INTELLIGENCE: Record<string, {
  pillars: CategoryEducationalPillar[];
  faqs: CategoryFAQ[];
  comparisonSlug?: string;
}> = {
  'personal-finance': {
    pillars: [
      {
        title: 'Cash Flow & Sustainable Allocation',
        description: 'Prioritize essential needs without rigid micro-budgeting using proven proportional systems like the 50/30/20 framework.',
        iconName: 'budget',
      },
      {
        title: 'Guaranteed Liquidity Buffers',
        description: 'Structure 3 to 9 months of non-discretionary expenses in FDIC-insured cash accounts to prevent forced equity liquidations.',
        iconName: 'shield',
      },
      {
        title: 'Strategic Debt Elimination',
        description: 'Systematically extinguish high-interest revolving balances using mathematically modeled Avalanche and Snowball schedules.',
        iconName: 'trending',
      },
    ],
    faqs: [
      {
        question: 'What is the most effective budgeting method for beginners?',
        answer: 'The 50/30/20 rule is generally the most sustainable starting point: allocate 50% of take-home pay to essential needs (housing, utilities, groceries), 30% to discretionary wants, and 20% to savings and accelerated debt reduction. It avoids tedious line-item tracking while ensuring steady wealth accumulation.',
      },
      {
        question: 'How much money should I keep in an emergency savings fund?',
        answer: 'Most financial planners recommend 3 to 6 months of baseline living expenses for dual-income salaried households, and 6 to 9 months for single-earner households, commission-based workers, or freelancers. Funds should be held in high-yield savings accounts or short-term Treasury bills with zero capital risk.',
      },
      {
        question: 'Which is better: the Debt Avalanche or Debt Snowball method?',
        answer: 'Mathematically, the Debt Avalanche (paying highest APR first) saves the most money in total interest charges. However, the Debt Snowball (paying smallest balance first) provides rapid psychological momentum that helps many borrowers stick with their debt payoff plan to completion.',
      },
      {
        question: 'Should I contribute to a Traditional 401(k) or a Roth IRA first?',
        answer: 'Always capture your full employer 401(k) match first, as this represents a guaranteed 50% to 100% immediate return on capital. After capturing the match, young savers in lower tax brackets typically benefit most from tax-free Roth IRA growth, while peak earners benefit from pre-tax Traditional 401(k) deductions.',
      },
    ],
    comparisonSlug: 'best-high-yield-savings-accounts-comparison',
  },
  'insurance': {
    pillars: [
      {
        title: 'Income Replacement Horizon',
        description: 'Calculate term life coverage based on genuine debt liabilities and dependent dependency years, avoiding expensive permanent fee loads.',
        iconName: 'shield',
      },
      {
        title: 'Catastrophic Health Insulation',
        description: 'Pair High-Deductible Health Plans with Health Savings Accounts to capture triple-tax benefits while capping maximum out-of-pocket liabilities.',
        iconName: 'health',
      },
      {
        title: 'Casualty Liability Calibration',
        description: 'Maintain 250/500/100 auto liability limits to shield home equity and accumulated savings from devastating third-party judgment liens.',
        iconName: 'car',
      },
    ],
    faqs: [
      {
        question: 'Why do financial advisors generally favor Term Life over Whole Life?',
        answer: 'Term life provides pure death benefit protection at a fraction of the cost—often 10x to 15x cheaper than permanent whole life. Mainstream households obtain maximum coverage during their peak liability years (raising children, paying mortgages) while investing the massive premium savings in diversified index funds.',
      },
      {
        question: 'How does an HSA provide a triple-tax advantage?',
        answer: 'Health Savings Accounts (HSAs) allow tax-deductible contributions (including 7.65% FICA exemption via payroll), 100% tax-free investment growth, and completely tax-free withdrawals for qualified medical expenses at any time during your life.',
      },
      {
        question: 'Why is state-minimum auto insurance dangerous for drivers?',
        answer: 'State minimum liability limits (e.g., $25,000 property damage) are severely outdated. A multi-vehicle accident with modern luxury vehicles or serious bodily injury can easily generate claims exceeding $150,000. If your policy limits are exhausted, you are personally liable for the remaining balance.',
      },
      {
        question: 'What is the difference between Actual Cash Value and Replacement Cost in property insurance?',
        answer: 'Actual Cash Value (ACV) reimburses the depreciated value of damaged property at the time of loss. Replacement Cost Coverage reimburses the actual current retail cost to replace the item with brand-new materials of like kind and quality, without subtracting depreciation.',
      },
    ],
    comparisonSlug: 'best-term-life-insurance-providers-comparison',
  },
  'banking': {
    pillars: [
      {
        title: 'Competitive Risk-Free Yields',
        description: 'Maintain liquid cash in high-yield accounts earning 8x to 10x national brick-and-mortar averages, fully backed by FDIC or NCUA insurance.',
        iconName: 'trending',
      },
      {
        title: 'Zero Administrative Surcharges',
        description: 'Eliminate account maintenance charges and out-of-network ATM penalties using modern digital banks with fee-free partner networks.',
        iconName: 'check',
      },
      {
        title: 'Deposit Sweep Protection',
        description: 'Leverage multi-bank custodial sweep networks to expand statutory deposit insurance up to $2,000,000 to $5,000,000 for high-balance savers.',
        iconName: 'shield',
      },
    ],
    faqs: [
      {
        question: 'Are high-yield online savings accounts as safe as traditional brick-and-mortar banks?',
        answer: 'Yes. Chartered online banks carry identical Federal Deposit Insurance Corporation (FDIC) protection as major national branch chains, insuring deposits up to $250,000 per depositor, per institution, per ownership category. Online banks pass interest savings to consumers because they do not bear physical branch maintenance overhead.',
      },
      {
        question: 'What is the practical difference between APY and interest rate?',
        answer: 'The nominal interest rate is the base rate applied to your deposit. Annual Percentage Yield (APY) accounts for the compounding frequency (daily or monthly) over 365 days. Always look at the APY when comparing deposit accounts, as it reflects your actual annual cash return.',
      },
      {
        question: 'How does a Certificate of Deposit (CD) ladder work?',
        answer: 'A CD ladder divides a lump sum across multiple maturity terms (e.g., 3-month, 6-month, 9-month, and 12-month CDs). As each CD matures, you can either access the liquidity or roll the proceeds into a new 12-month CD at prevailing rates, ensuring regular liquidity while locking in higher yields.',
      },
      {
        question: 'How can I avoid bank overdraft and maintenance fees completely?',
        answer: 'Select chartered digital checking accounts that explicitly guarantee $0 monthly maintenance fees with no direct deposit minimums, decline transactions at point-of-sale instead of charging overdraft fees, and provide fee-free access to nationwide ATM networks like Allpoint and MoneyPass.',
      },
    ],
    comparisonSlug: 'best-high-yield-savings-accounts-comparison',
  },
  'credit-loans': {
    pillars: [
      {
        title: 'Credit Score Optimization',
        description: 'Understand the algorithmic weighting of payment history, statement-date credit utilization, and credit age to secure top lending tiers.',
        iconName: 'trending',
      },
      {
        title: 'Fixed Installment Refinancing',
        description: 'Lower 24%+ revolving card debt to single-digit fixed rates using personal loans with structured, debt-free amortization schedules.',
        iconName: 'scale',
      },
      {
        title: 'Truth in Lending APR Transparency',
        description: 'Audit true borrowing costs incorporating origination fees, closing discount points, and compounding frequencies under Regulation Z.',
        iconName: 'shield',
      },
    ],
    faqs: [
      {
        question: 'What is the fastest way to improve my FICO credit score?',
        answer: 'The quickest metric to optimize is your credit utilization ratio (which accounts for 30% of your score). Pay down balances prior to your monthly statement closing date so that reported utilization drops below 10%. Unlike payment history, credit utilization has no memory—your score updates as soon as the lower balance is reported to bureaus.',
      },
      {
        question: 'When does a personal loan make sense for debt consolidation?',
        answer: 'A personal loan makes mathematical sense if you qualify for an APR substantially lower than your current credit card rates (e.g., 10%–14% vs. 24%+), the loan has $0 or low origination fees, and you commit to not running up new balances on the paid-off credit cards.',
      },
      {
        question: 'Should I choose a 15-year or 30-year fixed-rate mortgage?',
        answer: 'A 15-year mortgage offers lower interest rates and saves hundreds of thousands of dollars in total interest. However, a 30-year mortgage provides lower contractual monthly payments, giving you essential cash flow flexibility during economic shocks while still allowing you to make voluntary principal prepayments.',
      },
      {
        question: 'Why does a loan APR differ from its nominal interest rate?',
        answer: 'The nominal interest rate only reflects the ongoing borrowing percentage. The Annual Percentage Rate (APR) incorporates upfront origination charges, closing points, and mandatory fees, reflecting the comprehensive true annual cost of credit under the Truth in Lending Act.',
      },
    ],
    comparisonSlug: 'best-no-annual-fee-cash-back-credit-cards',
  },
  'financial-technology': {
    pillars: [
      {
        title: 'Automated Portfolio Algorithms',
        description: 'Deploy low-fee robo-advisors to automate tax-loss harvesting, asset drift rebalancing, and fractional dividend reinvestment.',
        iconName: 'trending',
      },
      {
        title: 'Open Banking Data Rights',
        description: 'Leverage CFPB Section 1033 API standards to permission financial accounts securely without sharing vulnerable static credentials.',
        iconName: 'shield',
      },
      {
        title: 'Cryptographic Payment Tokenization',
        description: 'Render card skimming obsolete by adopting dynamic NFC mobile tokens backed by federal Regulation E consumer liability protections.',
        iconName: 'check',
      },
    ],
    faqs: [
      {
        question: 'What is a robo-advisor and how does it manage investments?',
        answer: 'A robo-advisor is an automated investment platform that builds and maintains diversified portfolios of low-cost exchange-traded funds (ETFs) based on your risk tolerance. For a modest fee (typically 0.25% AUM), algorithms automate daily tax-loss harvesting, dividend reinvestment, and portfolio rebalancing.',
      },
      {
        question: 'Are digital wallets like Apple Pay and Google Wallet safer than physical credit cards?',
        answer: 'Yes. Digital wallets utilize EMV tokenization: your actual 16-digit card number is never transmitted or stored on merchant systems. Each contactless transaction generates a one-time dynamic cryptogram requiring biometric authorization (Face ID or fingerprint), making card skimming physically impossible.',
      },
      {
        question: 'What are consumer open banking rights under CFPB Section 1033?',
        answer: 'CFPB Section 1033 rules grant consumers legal ownership of their financial transaction data. Banks are required to provide standardized, secure API access so consumers can share their data with budgeting, saving, and investment apps without handing over sensitive account passwords.',
      },
      {
        question: 'How does automated tax-loss harvesting generate tax alpha?',
        answer: 'When market pullbacks create temporary paper losses in specific ETF holdings, automated algorithms sell those lots to harvest capital losses that offset taxable capital gains and ordinary income, immediately replacing them with correlated non-identical funds to maintain market exposure without violating IRS wash-sale rules.',
      },
    ],
    comparisonSlug: 'best-automated-robo-advisor-platforms-comparison',
  },
};

export const CategoryHubPage: React.FC<CategoryHubPageProps> = ({
  categorySlug,
  subCategorySlug,
  customTitle,
  customDescription,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const location = useLocation();

  const primaryCategory = CATEGORIES.find((c) => c.slug === categorySlug);
  const subCategory = subCategorySlug ? CATEGORIES.find((c) => c.slug === subCategorySlug) : null;
  const childCategories = CATEGORIES.filter((c) => c.parent_id === primaryCategory?.id);

  const title = customTitle || (subCategory ? `${subCategory.name} Guides & Reviews` : `${primaryCategory?.name || 'Financial'} Guides & Analysis`);
  const description = customDescription || (subCategory ? subCategory.description : primaryCategory?.description || 'Practical financial insights.');

  // Intelligence metadata
  const intel = CATEGORY_INTELLIGENCE[categorySlug] || CATEGORY_INTELLIGENCE['personal-finance'];

  useEffect(() => {
    async function loadCategoryData() {
      const [allArticles, allComparisons] = await Promise.all([
        articleService.getPublishedArticles(),
        dealService.getComparisons(),
      ]);

      let filtered = allArticles;

      if (subCategory) {
        filtered = allArticles.filter(
          (a) => a.category_id === subCategory.id || a.category_id === primaryCategory?.id
        );
      } else if (primaryCategory) {
        const allowedIds = [primaryCategory.id, ...childCategories.map((c) => c.id)];
        filtered = allArticles.filter((a) => allowedIds.includes(a.category_id));
      }

      setArticles(filtered);

      // Find relevant comparison for this category
      if (intel.comparisonSlug) {
        const matchedComp = allComparisons.find((c) => c.slug === intel.comparisonSlug) || allComparisons[0];
        setComparison(matchedComp || null);
      } else {
        const catComp = allComparisons.find((c) => c.category_id === primaryCategory?.id);
        setComparison(catComp || allComparisons[0] || null);
      }

      window.scrollTo(0, 0);
    }
    loadCategoryData();
  }, [categorySlug, subCategorySlug, primaryCategory?.id, intel.comparisonSlug]);

  const breadcrumbs = [
    { label: primaryCategory?.name || 'Category', href: `/${primaryCategory?.slug}/` },
    ...(subCategory ? [{ label: subCategory.name }] : []),
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <MetaTags
        title={`${title} — AI Finance Deals`}
        description={description}
        canonicalPath={location.pathname}
      />
      <StructuredData type="breadcrumbs" data={breadcrumbs} />

      {/* Structured Data for FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: intel.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Category Header */}
      <div className="bg-[#F5F8FC] border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E2E8F0] rounded-full text-xs font-mono font-semibold text-[#163A5F]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00B894]" />
          <span>Independent Editorial Hub · Fact-Checked Coverage</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1F3C] tracking-tight">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-[#4B5563] max-w-3xl leading-relaxed">
          {description}
        </p>

        {/* Subcategory Navigation Pills/Buttons */}
        {childCategories.length > 0 && (
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[#6B7280] mr-2">Subcategories:</span>
            <Link
              to={`/${primaryCategory?.slug}/`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                !subCategorySlug ? 'bg-[#0D1F3C] text-white shadow-sm' : 'bg-white text-[#303846] border border-[#CBD5E1] hover:bg-stone-50'
              }`}
            >
              All {primaryCategory?.name}
            </Link>
            {childCategories.map((sub) => (
              <Link
                key={sub.slug}
                to={`/${primaryCategory?.slug}/${sub.slug}/`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  subCategorySlug === sub.slug ? 'bg-[#0D1F3C] text-white shadow-sm' : 'bg-white text-[#303846] border border-[#CBD5E1] hover:bg-stone-50'
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Unique Category Educational Pillars */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00B894] font-semibold">
            Editorial Methodology
          </span>
          <span className="text-xs text-[#6B7280] font-mono">CFP® / CFA Audited</span>
        </div>
        <h2 className="font-heading text-2xl font-bold text-[#0D1F3C]">
          Core Principles in {primaryCategory?.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {intel.pillars.map((pillar, idx) => (
            <div key={idx} className="p-6 bg-white border border-[#E2E8F0] rounded-xl space-y-2 shadow-sm hover:border-[#CBD5E1] transition-all">
              <div className="w-8 h-8 rounded-lg bg-[#E6F8F4] text-[#00B894] flex items-center justify-center font-bold text-xs font-mono">
                0{idx + 1}
              </div>
              <h3 className="font-heading font-bold text-base text-[#0D1F3C]">
                {pillar.title}
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured / Lead Article in Category */}
      {articles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#163A5F] font-semibold">
              Spotlight Guide
            </span>
          </div>
          <ArticleCard article={articles[0]} variant="featured" />
        </section>
      )}

      {/* AdSense In-Content Horizontal Display Banner */}
      <AdBanner position="content" placementId="homepageMid" className="my-6" />

      {/* Remaining Articles Grid with In-Feed Ad Unit */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#6B7280] font-semibold">
              Curated Research
            </span>
            <h2 className="font-heading text-2xl font-bold text-[#0D1F3C]">
              Published Guides & Analysis ({articles.length})
            </h2>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="py-16 text-center bg-white border border-[#E2E8F0] rounded-xl p-8 text-xs text-[#6B7280]">
            No articles found in this subcategory yet. Check back soon for updated guides.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(1, 3).map((art) => (
              <ArticleCard key={art.id} article={art} variant="grid" />
            ))}
            {/* Native In-Feed Ad Unit within Article Card Grid */}
            <InFeedAd placementId="inFeedNative" />
            {articles.slice(3).map((art) => (
              <ArticleCard key={art.id} article={art} variant="grid" />
            ))}
          </div>
        )}
      </div>

      {/* Category Benchmark Comparison Section */}
      {comparison && (
        <section className="space-y-4 pt-6 border-t border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#163A5F] font-semibold">
                Objective Benchmarks
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#0D1F3C]">
                Featured {primaryCategory?.name} Comparison
              </h2>
            </div>
            <Link
              to="/comparisons/"
              className="text-xs font-semibold text-[#163A5F] hover:text-[#00B894] inline-flex items-center gap-1"
            >
              <span>All Comparisons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ComparisonTable comparison={comparison} />
        </section>
      )}

      {/* Interactive FAQ Accordion with Schema.org Integration */}
      <section className="space-y-6 pt-6 border-t border-[#E2E8F0]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#00B894] font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#0D1F3C]">
            Common Questions About {primaryCategory?.name}
          </h2>
          <p className="text-xs text-[#6B7280]">
            Fact-checked editorial answers to reader inquiries regarding terms, regulatory rules, and optimal strategies.
          </p>
        </div>

        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0] bg-white shadow-sm">
          {intel.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-semibold text-sm text-[#0D1F3C]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B7280] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#00B894]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#4B5563] leading-relaxed border-t border-[#F1F5F9] pt-3 bg-[#FAFAFA]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Cross-Topic Exploration Links */}
      <div className="p-6 bg-[#F5F8FC] border border-[#E2E8F0] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-[#0D1F3C] block text-sm">Explore Other Financial Disciplines</span>
          <p className="text-[#6B7280] mt-0.5">Browse related comparative research, verified promotions, and legal consumer protections.</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link to="/personal-finance/" className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg hover:border-[#00B894] font-medium text-[#0D1F3C]">
            Personal Finance
          </Link>
          <Link to="/banking/" className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg hover:border-[#00B894] font-medium text-[#0D1F3C]">
            Banking & HYSA
          </Link>
          <Link to="/insurance/" className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg hover:border-[#00B894] font-medium text-[#0D1F3C]">
            Insurance
          </Link>
          <Link to="/credit-loans/" className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg hover:border-[#00B894] font-medium text-[#0D1F3C]">
            Credit & Loans
          </Link>
          <Link to="/financial-technology/" className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg hover:border-[#00B894] font-medium text-[#0D1F3C]">
            FinTech
          </Link>
        </div>
      </div>

      {/* AdSense Multiplex Content Recommendations */}
      <MultiplexAd placementId="multiplexFooter" variant="horizontal" />

      <NewsletterForm />
    </div>
  );
};
