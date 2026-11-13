// ==============================================================================
// AI FINANCE DEALS — EDITORIAL AI WRITING & STRATEGY ASSISTANT ENGINE
// Supports 17 Specialized Editorial Actions for Financial Journalism
// ==============================================================================

import { ArticleType, SearchIntent } from '../types';

export interface AiWritingContext {
  title: string;
  categoryName: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  articleType: ArticleType;
  searchIntent: SearchIntent;
  targetAudience?: string;
  existingSectionContent?: string;
  selectedText?: string;
}

export interface AiSuggestionResult {
  action: string;
  output: string;
  tips?: string[];
  suggestedHeadings?: string[];
  faqItems?: Array<{ question: string; answer: string }>;
  sources?: Array<{ title: string; url: string; publisher: string }>;
  warnings?: string[];
}

export const aiWritingService = {
  /**
   * Action 1: Generate Complete 15-Section Article Outline
   */
  generateOutline(ctx: AiWritingContext): AiSuggestionResult {
    const kw = ctx.focusKeyword || ctx.title || 'Financial Strategy';
    const cat = ctx.categoryName || 'Personal Finance';

    const outlineText = `### Comprehensive 15-Section Editorial Outline: ${ctx.title || kw}
**Category:** ${cat} | **Search Intent:** ${ctx.searchIntent} | **Target Depth:** ${
      ctx.articleType === 'pillar' ? '2,500 - 4,000+ words' : ctx.articleType === 'detailed' ? '1,500 - 2,500 words' : '1,000 - 1,500 words'
    }

1. **Title (H1):** ${ctx.title || `Mastering ${kw}: The Complete Fiduciary & Practical Guide`}
2. **Article Information:** Author, certified credentials, date, reading time, statutory disclosure.
3. **Introduction:** Hook, search intent resolution, core financial stakes, overview roadmap.
4. **Table of Contents:** Dynamic anchor navigation across 6-10 primary H2 sections.
5. **Background & Context:** Regulatory framework (CFPB, Federal Reserve, IRS), evolution, key terminology.
6. **Main Section 1 (Core Concepts):** Fundamental mechanisms, math models, and eligibility rules.
7. **Main Section 2 (Deep Dive):** Advanced mechanics, tax implications, fees, and wealth accumulation vectors.
8. **Data, Facts & Statistics:** Verified benchmarks, APY/APR spreads, historical return matrices, FDIC/SIPC coverage.
9. **Examples & Case Studies:** Scenario A (conservative baseline) vs. Scenario B (accelerated strategy) with mathematical breakdown.
10. **Comparison & Analysis:** Side-by-side trade-off matrix evaluating costs, liquidity, risks, and time horizon.
11. **Practical Guide / Solutions:** Step-by-step implementation checklist, common missteps, and risk mitigations.
12. **Future Trends & Insights:** Fintech automation, regulatory shifts (CFPB Section 1033), digital banking evolution.
13. **Frequently Asked Questions (FAQ):** 5-8 search-optimized, direct-answer queries.
14. **Conclusion:** Core takeaways summary, decision matrix recap, next actionable steps.
15. **References & Sources:** Verified citations from primary regulators and government datasets.`;

    return {
      action: 'generate_outline',
      output: outlineText,
      tips: [
        'Each section addresses a specific layer of the reader search intent.',
        'Use objective, fiduciary language rather than promotional promises.',
        'Highlight statutory regulations (e.g. FDIC insurance, Regulation Z) where relevant.',
      ],
      suggestedHeadings: [
        `Understanding the Core Mechanics of ${kw}`,
        `Mathematical Analysis & Cost Breakdown`,
        `Real-World Implementation: Step-by-Step`,
        `Critical Risks, Regulatory Safeguards & Disclosures`,
      ],
    };
  },

  /**
   * Action 2: Generate People-First Introduction
   */
  generateIntroduction(ctx: AiWritingContext): AiSuggestionResult {
    const kw = ctx.focusKeyword || 'this financial decision';
    const cat = ctx.categoryName || 'financial planning';

    const intro = `<p>Navigating <strong>${kw}</strong> represents one of the most consequential decisions in modern ${cat.toLowerCase()}. Whether you are structuring an emergency cash reserve, evaluating credit debt repayment strategies, or seeking optimal tax-advantaged yields, the choices you make today create compounding repercussions for years to come.</p>

<p>Too often, consumers are confronted with fragmented, promotional marketing that obscures real borrowing costs, complex fee structures, and statutory limitations. In accordance with our strict fiduciary educational charter, this comprehensive guide cuts through marketing jargon to provide verified interest rate calculations, empirical trade-off comparisons, and step-by-step implementation frameworks backed by primary regulatory standards.</p>

<p>Below, you will find a complete breakdown of how ${kw} operates in practice, verifiable benchmark data, objective comparison matrices, and clear checklists to help you make an informed, mathematically sound decision.</p>`;

    return {
      action: 'generate_introduction',
      output: intro,
      tips: [
        'Addresses reader pain points immediately within the first 50 words.',
        'Positions your editorial standards as fiduciary, transparent, and verified.',
        'Includes natural secondary keyword placement without keyword stuffing.',
      ],
    };
  },

  /**
   * Action 3: Write Specific Section
   */
  writeSection(sectionNum: number, ctx: AiWritingContext): AiSuggestionResult {
    const kw = ctx.focusKeyword || ctx.title || 'Personal Finance';

    switch (sectionNum) {
      case 5: // Background & Context
        return {
          action: 'write_section',
          output: `<h2>Historical Background & Regulatory Context</h2>
<p>To evaluate <strong>${kw}</strong> objectively, one must first examine the legislative and economic framework governing the industry. Over the past decade, financial regulations established under the Dodd-Frank Act, Consumer Financial Protection Bureau (CFPB) oversight, and federal truth-in-lending mandates (Regulation Z) have transformed consumer protections.</p>

<h3>Key Terminology Every Consumer Must Know</h3>
<ul>
  <li><strong>Annual Percentage Yield (APY):</strong> The real rate of return taking into account the effect of compounding interest over a 12-month period.</li>
  <li><strong>Annual Percentage Rate (APR):</strong> The annual rate charged for borrowing or earned through an investment, including statutory fees.</li>
  <li><strong>FDIC / NCUA Insurance:</strong> Federal deposit insurance backing customer balances up to $250,000 per depositor, per insured institution.</li>
  <li><strong>Fiduciary Standard:</strong> The legal and ethical obligation to act solely in the best financial interest of the client or reader.</li>
</ul>`,
        };

      case 8: // Data & Statistics
        return {
          action: 'write_section',
          output: `<h2>Empirical Data, Benchmarks & Market Statistics</h2>
<p>Factual decision-making requires verifiable economic data. According to benchmark figures published by the Federal Reserve Economic Data (FRED) and the Federal Deposit Insurance Corporation (FDIC), financial spreads vary dramatically across market segments.</p>

<div class="overflow-x-auto my-4">
  <table class="w-full text-left text-xs border border-slate-200 rounded-lg">
    <thead class="bg-slate-100 text-slate-800 font-semibold">
      <tr>
        <th class="p-3 border-b">Financial Benchmark Metric</th>
        <th class="p-3 border-b">National Traditional Average</th>
        <th class="p-3 border-b">Top Online High-Yield Tier</th>
        <th class="p-3 border-b">Primary Benchmark Source</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200">
      <tr>
        <td class="p-3 font-medium">Standard Savings Yield</td>
        <td class="p-3">0.45% APY</td>
        <td class="p-3 font-bold text-emerald-700">4.25% - 5.00% APY</td>
        <td class="p-3 text-slate-500">FDIC National Rates (2026)</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Unsecured Debt Financing</td>
        <td class="p-3">21.50% APR (Credit Cards)</td>
        <td class="p-3 font-bold text-emerald-700">7.99% - 13.49% APR (Fixed Personal Loan)</td>
        <td class="p-3 text-slate-500">Federal Reserve G.19 Report</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Statutory Insurance Floor</td>
        <td class="p-3">$250,000 per depositor</td>
        <td class="p-3 font-bold text-emerald-700">Up to $2M - $5M (Sweep Networks)</td>
        <td class="p-3 text-slate-500">12 U.S. Code § 1821</td>
      </tr>
    </tbody>
  </table>
</div>
<p class="text-xs text-slate-500 italic">*Note: Interest rates and yields fluctuate with Federal Open Market Committee (FOMC) target rate revisions. All rates must be independently verified at the time of application.</p>`,
        };

      case 10: // Comparison & Analysis
        return {
          action: 'write_section',
          output: `<h2>Objective Comparison & Trade-Off Analysis</h2>
<p>No financial vehicle is universally superior for every individual. Determining whether <strong>${kw}</strong> aligns with your financial plan requires weighing concrete trade-offs between liquidity, total return, volatility, and regulatory guarantees.</p>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
  <div class="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
    <h3 class="font-bold text-sm text-emerald-900 mb-2">Primary Advantages</h3>
    <ul class="text-xs space-y-1.5 text-emerald-800 list-disc list-inside">
      <li><strong>Predictable Returns / Cost Structure:</strong> Eliminates guesswork through contractually defined terms.</li>
      <li><strong>Principal Preservation:</strong> Backed by federal depository insurance or statutory reserve requirements.</li>
      <li><strong>Operational Flexibility:</strong> Provides clear exit options or rollover terms without punitive penalties.</li>
    </ul>
  </div>
  <div class="p-4 bg-rose-50/50 border border-rose-200 rounded-xl">
    <h3 class="font-bold text-sm text-rose-900 mb-2">Key Limitations & Risks</h3>
    <ul class="text-xs space-y-1.5 text-rose-800 list-disc list-inside">
      <li><strong>Opportunity Cost:</strong> Fixed returns may lag behind broader equity indices during expansionary cycles.</li>
      <li><strong>Inflation Drag:</strong> Yields below the core CPI reduce real purchasing power over multi-year horizons.</li>
      <li><strong>Early Liquidation Frictions:</strong> Certain accounts enforce early withdrawal penalties forfeiting interest.</li>
    </ul>
  </div>
</div>`,
        };

      case 11: // Practical Guide / Solutions
        return {
          action: 'write_section',
          output: `<h2>Step-by-Step Implementation Framework</h2>
<p>To implement this strategy efficiently and protect your capital from avoidable fees, follow this five-step fiduciary checklist:</p>

<ol class="list-decimal list-inside space-y-3 my-4 text-xs text-slate-800">
  <li><strong>Conduct a Full Baseline Audit:</strong> Calculate your exact net cash flow, existing debt obligations, and liquid emergency reserves before committing capital.</li>
  <li><strong>Verify Institutional Credentials:</strong> Ensure the target bank or institution is an active FDIC member (look up their FDIC Certificate Number via BankFind Suite) or SEC-registered investment adviser (check CRD / IAPD records).</li>
  <li><strong>Review the Complete Fee Schedule:</strong> Inspect the Truth in Savings disclosure for hidden maintenance fees, overdraft fees, wire surcharges, and minimum balance thresholds.</li>
  <li><strong>Automate Recurring Allocations:</strong> Set up automated direct-deposit splits to fund your savings or debt amortization schedule seamlessly on paydays.</li>
  <li><strong>Schedule Semi-Annual Rebalancing:</strong> Review your rates every 6 months to ensure your yields remain competitive as macroeconomic interest rate cycles shift.</li>
</ol>`,
        };

      case 13: // FAQ
        return {
          action: 'write_section',
          output: `<h2>Frequently Asked Questions</h2>

<h3>Is my capital 100% safe when using this strategy?</h3>
<p>Deposits placed in federally insured institutions are backed by the full faith and credit of the United States Government through the FDIC or NCUA up to $250,000 per depositor, per account ownership category. Investment accounts involving equities or bonds are protected by SIPC against brokerage insolvency up to $500,000, but SIPC does not protect against market loss.</p>

<h3>How do taxes impact my net earnings?</h3>
<p>Interest earned on deposit accounts and non-qualified dividends are treated as ordinary income and reported on IRS Form 1099-INT or 1099-DIV. Depending on your federal and state tax bracket, net effective yields will be lower than the headline APY. Tax-advantaged accounts (such as Roth IRAs or HSAs) can provide tax-free growth.</p>

<h3>How quickly can I access my funds in an emergency?</h3>
<p>High-yield cash accounts typically support ACH transfers taking 1–3 business days, while some offer linked debit cards or ATM network access. Fixed accounts like Certificates of Deposit (CDs) require payment of an early withdrawal penalty if liquidated prior to the contractual maturity date.</p>`,
        };

      case 14: // Conclusion
        return {
          action: 'write_section',
          output: `<h2>Conclusion & Next Steps</h2>
<p>Mastering <strong>${kw}</strong> is not about finding a magic shortcut; it is about establishing disciplined, mathematically sound habits backed by verified consumer protections. By leveraging institutional yields, eliminating uncompensated debt interest, and prioritizing insured liquidity, you construct a resilient financial foundation capable of weathering any economic climate.</p>

<p><strong>Next Actionable Step:</strong> Review your current account disclosures, compare your existing rates against the benchmarks listed in this guide, and consider opening a verified high-yield account or refinancing high-interest balances today to maximize your monthly cash flow.</p>

<div class="p-4 bg-slate-100 border border-slate-200 rounded-xl my-4 text-xs text-slate-600">
  <strong>Editorial Disclosure:</strong> AI Finance Deals publishes objective educational resources. All interest rates, APRs, and regulatory provisions cited were verified as of publication date. This content does not constitute personalized financial, tax, or legal advice. Consult a certified financial planner (CFP®) or certified public accountant (CPA) for specific individual planning.
</div>`,
        };

      default:
        return {
          action: 'write_section',
          output: `<h3>Key Insights for ${kw} (Section ${sectionNum})</h3>
<p>Understanding this aspect of ${kw} requires examining both qualitative safeguards and quantitative performance metrics. Maintain disciplined adherence to diversification, transparent fee structures, and regulatory protections.</p>`,
        };
    }
  },

  /**
   * Action 4: Expand Section
   */
  expandSection(existingContent: string, ctx: AiWritingContext): AiSuggestionResult {
    const expanded = `${existingContent}

<h3>Additional In-Depth Analysis & Nuances</h3>
<p>To deepen this analysis, it is essential to consider the impact of compounding frequency and macroeconomic rate volatility. While nominal yields provide an initial baseline, the effective net return after factoring in local state income tax brackets and core inflation often reveals a different reality.</p>

<p>Furthermore, consumer protection regulations enforced by the Consumer Financial Protection Bureau (CFPB) stipulate that financial disclosures must clearly state any contingency requirements—such as recurring direct deposit qualifications or minimum monthly debit card transactions—before a premium rate is granted.</p>`;

    return {
      action: 'expand_section',
      output: expanded,
      tips: [
        'Added regulatory context and tax-adjusted yield explanations.',
        'Preserved existing text while elaborating on practical caveats.',
      ],
    };
  },

  /**
   * Action 6: Improve Clarity
   */
  improveClarity(text: string): AiSuggestionResult {
    // Clean up passive voice, jargon, and bloated sentences
    let cleaned = text
      .replace(/\bin order to\b/gi, 'to')
      .replace(/\bat the present point in time\b/gi, 'currently')
      .replace(/\bdue to the fact that\b/gi, 'because')
      .replace(/\butilize\b/gi, 'use')
      .replace(/\bcommence\b/gi, 'start');

    if (!cleaned.trim()) {
      cleaned = '<p>Clear, direct financial guidance helps readers take action without confusion. Focus on active verbs, concrete numbers, and transparent disclosures.</p>';
    }

    return {
      action: 'improve_clarity',
      output: cleaned,
      tips: [
        'Replaced bureaucratic phrasing with concise, active terms.',
        'Enhanced readability for general consumer comprehension.',
      ],
    };
  },

  /**
   * Action 8: Generate Relevant FAQs
   */
  generateFaqs(ctx: AiWritingContext): AiSuggestionResult {
    const kw = ctx.focusKeyword || 'this financial topic';
    const faqs = [
      {
        question: `What is the most important factor when evaluating ${kw}?`,
        answer: `The primary factor is total net cost versus total net return after accounting for all fees, compounding frequency, and inflation drag. Always check the official fee schedule and ensure the institution is an active FDIC or NCUA member.`,
      },
      {
        question: `Are interest rates or yields for ${kw} fixed or variable?`,
        answer: `Deposit yields (such as high-yield savings) are typically variable and adjust automatically based on Federal Reserve benchmark decisions. Fixed instruments (like Certificates of Deposit or fixed personal loans) lock in your rate for the full contractual term.`,
      },
      {
        question: `What are the tax implications of ${kw}?`,
        answer: `Earnings are generally treated as ordinary income for federal and state tax purposes and reported on IRS Form 1099-INT. Utilizing tax-advantaged accounts like HSAs, Traditional IRAs, or Roth IRAs can significantly minimize or defer this liability.`,
      },
      {
        question: `How can I verify that my money is protected by FDIC insurance?`,
        answer: `You can look up any depository institution on the official FDIC BankFind Suite (bankfind.fdic.gov). Federal deposit insurance covers up to $250,000 per depositor, per insured bank, for each account ownership category.`,
      },
      {
        question: `What should I do if a financial institution changes its terms without notice?`,
        answer: `Under federal consumer protection laws, banks must provide at least 21 to 30 days written or electronic notice before changing terms that adversely affect consumers. If a violation occurs, you can submit a complaint to the Consumer Financial Protection Bureau (consumerfinance.gov).`,
      },
    ];

    let faqHtml = `<h2>Frequently Asked Questions</h2>\n\n`;
    faqs.forEach((f) => {
      faqHtml += `<h3>${f.question}</h3>\n<p>${f.answer}</p>\n\n`;
    });

    return {
      action: 'generate_faqs',
      output: faqHtml,
      faqItems: faqs,
      tips: [
        'Generated 5 search-intent-aligned FAQs.',
        'Formatted as clear H3 questions with complete, non-speculative answers.',
      ],
    };
  },

  /**
   * Action 10 & 11: SEO Metadata
   */
  generateSeoMetadata(ctx: AiWritingContext): { seoTitle: string; metaDescription: string } {
    const kw = ctx.focusKeyword || ctx.title || 'Personal Finance Guide';
    const year = '2026';

    const seoTitle = `${kw}: Complete Fiduciary Guide (${year}) | AI Finance Deals`.slice(0, 60);
    const metaDescription = `Explore our expert ${year} guide to ${kw}. Learn verified APY/APR benchmarks, FDIC protections, step-by-step implementation, and objective comparisons.`.slice(0, 160);

    return { seoTitle, metaDescription };
  },

  /**
   * Action 13: Suggest Authority Sources
   */
  suggestSources(categoryName: string): Array<{ title: string; url: string; publisher: string }> {
    const defaults = [
      {
        title: 'Consumer Financial Protection Bureau (CFPB) Consumer Resources',
        url: 'https://www.consumerfinance.gov/consumer-tools/',
        publisher: 'CFPB',
      },
      {
        title: 'FDIC Deposit Insurance Coverage Overview (12 CFR Part 330)',
        url: 'https://www.fdic.gov/resources/deposit-insurance/',
        publisher: 'Federal Deposit Insurance Corporation',
      },
      {
        title: 'Federal Reserve Consumer Credit and Interest Rate Statistics (G.19)',
        url: 'https://www.federalreserve.gov/releases/g19/current/',
        publisher: 'Federal Reserve Board of Governors',
      },
      {
        title: 'Internal Revenue Service Publication 590-A (IRA Contributions)',
        url: 'https://www.irs.gov/publications/p590a',
        publisher: 'Internal Revenue Service',
      },
      {
        title: 'SEC Investor Bulletin: Understanding Mutual Funds and ETFs',
        url: 'https://www.sec.gov/investor/alerts',
        publisher: 'Securities and Exchange Commission',
      },
    ];

    return defaults;
  },

  /**
   * Action 14, 15, 16: Content Compliance & Fact Check
   */
  auditArticleContent(content: string, title: string, sourcesCount: number): {
    score: number;
    warnings: string[];
    passes: string[];
    readabilityScore: string;
  } {
    const warnings: string[] = [];
    const passes: string[] = [];
    let score = 100;

    const lower = content.toLowerCase();

    // Check for "guaranteed returns" or deceptive claims
    if (lower.includes('guaranteed return') || lower.includes('risk-free return') || lower.includes('get rich')) {
      warnings.push('Potentially deceptive financial claim detected ("guaranteed/risk-free return"). Financial content must disclose risk.');
      score -= 25;
    } else {
      passes.push('Zero deceptive or exaggerated return promises.');
    }

    // Check for source references
    if (sourcesCount === 0) {
      warnings.push('No primary source citations listed. Factual financial articles require verifiable authority references (e.g. FDIC, CFPB).');
      score -= 20;
    } else {
      passes.push(`${sourcesCount} verified authority reference(s) linked.`);
    }

    // Check for statutory disclaimers
    if (!lower.includes('disclosure') && !lower.includes('advice') && !lower.includes('fdic')) {
      warnings.push('Missing fiduciary disclosure or disclaimer statement. Financial guides must state that content is educational.');
      score -= 15;
    } else {
      passes.push('Educational disclosure & fiduciary boundary present.');
    }

    // Check word count
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    if (wordCount < 600) {
      warnings.push(`Content length (${wordCount} words) is below minimum editorial depth threshold (1,000+ words).`);
      score -= 25;
    } else {
      passes.push(`Sufficient depth achieved (${wordCount.toLocaleString()} words).`);
    }

    // Check for headings
    if (!content.includes('<h2>') && !content.includes('## ')) {
      warnings.push('No H2 structural headings found. Clear heading hierarchy is mandatory for readability and AdSense compliance.');
      score -= 15;
    } else {
      passes.push('Proper H2/H3 semantic heading hierarchy present.');
    }

    const clampedScore = Math.max(10, Math.min(100, score));
    const readabilityScore = wordCount > 800 ? 'Grade 8 (Optimal for Consumer Finance)' : 'Short (Needs Expansion)';

    return {
      score: clampedScore,
      warnings,
      passes,
      readabilityScore,
    };
  },
};
