import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const BASE_URL = (process.env.VITE_SITE_URL || 'https://aifinancedeals.com').trim().replace(/\/+$/, '');

const baseHtmlPath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(baseHtmlPath)) {
  console.error('[prerender] dist/index.html not found. Run vite build first.');
  process.exit(1);
}
const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Extract published articles cleanly from src/data/mockData.ts without importing TSX/Vite runtime
function extractPublishedArticles() {
  const mockPath = path.join(ROOT_DIR, 'src', 'data', 'mockData.ts');
  const source = fs.readFileSync(mockPath, 'utf8');
  const articlesMatch = source.match(/export const ARTICLES:\s*Article\[\]\s*=\s*\[([\s\S]*?)\n\];\s*\nexport const FINANCIAL_DEALS/);
  if (!articlesMatch) {
    console.warn('[prerender] Could not locate ARTICLES block in mockData.ts');
    return [];
  }

  const block = articlesMatch[1];
  const entries = block.split(/\n  \{\s*\n    id:\s*'art-/).slice(1);
  const published = [];

  for (const rawEntry of entries) {
    const statusMatch = rawEntry.match(/status:\s*'([^']+)'/);
    if (!statusMatch || statusMatch[1] !== 'published') {
      continue; // Never prerender drafts, fact_check, or editorial_review articles
    }
    const slugMatch = rawEntry.match(/slug:\s*'([^']+)'/);
    const titleMatch = rawEntry.match(/title:\s*'((?:\\'|[^'])*)'/);
    const seoTitleMatch = rawEntry.match(/seo_title:\s*'((?:\\'|[^'])*)'/);
    const metaDescMatch = rawEntry.match(/meta_description:\s*'((?:\\'|[^'])*)'/);
    const excerptMatch = rawEntry.match(/excerpt:\s*'((?:\\'|[^'])*)'/);
    const imageMatch = rawEntry.match(/featured_image:\s*'([^']+)'/);
    const publishedAtMatch = rawEntry.match(/published_at:\s*'([^']*)'/);
    const updatedAtMatch = rawEntry.match(/updated_at:\s*'([^']*)'/);
    const contentMatch = rawEntry.match(/content:\s*`([\s\S]*?)`,/);

    if (!slugMatch || !titleMatch) continue;

    published.push({
      slug: slugMatch[1],
      title: titleMatch[1].replace(/\\'/g, "'"),
      seoTitle: (seoTitleMatch ? seoTitleMatch[1] : titleMatch[1]).replace(/\\'/g, "'"),
      description: (metaDescMatch ? metaDescMatch[1] : (excerptMatch ? excerptMatch[1] : '')).replace(/\\'/g, "'"),
      excerpt: (excerptMatch ? excerptMatch[1] : '').replace(/\\'/g, "'"),
      image: imageMatch ? imageMatch[1] : '/og-default.jpg',
      publishedAt: publishedAtMatch ? publishedAtMatch[1] : '2026-03-30T00:00:00Z',
      updatedAt: updatedAtMatch ? updatedAtMatch[1] : '2026-03-31T00:00:00Z',
      contentHtml: contentMatch ? contentMatch[1].trim() : '',
    });
  }

  return published;
}

const STATIC_ROUTES = [
  {
    route: '/',
    title: 'AI Finance Deals — Smart Financial Insights. Better Informed Decisions.',
    description: 'Explore practical financial guides, compare financial services, and discover helpful insights to make more informed decisions.',
    heading: 'Make Smarter Financial Decisions',
    summary: 'Independent personal finance research, banking comparisons, insurance guides, credit education, and consumer protection resources.',
  },
  {
    route: '/articles/',
    title: 'Complete Archive of Financial Guides & Educational Analysis — AI Finance Deals',
    description: 'Browse all published articles, practical budgeting frameworks, insurance reviews, and banking guides written and reviewed by financial experts.',
    heading: 'Financial Guides & Editorial Archive',
    summary: 'Comprehensive educational guides covering personal finance, insurance, banking, credit & loans, and financial technology.',
  },
  {
    route: '/personal-finance/',
    title: 'Personal Finance Guides & Analysis — AI Finance Deals',
    description: 'Practical budgeting frameworks, emergency fund strategies, debt reduction techniques, and smart wealth foundations.',
    heading: 'Personal Finance Guides & Analysis',
    summary: 'Evidence-based budgeting rules, emergency liquidity reserves, retirement structuring, and debt payoff strategies.',
  },
  {
    route: '/personal-finance/budgeting/',
    title: 'Budgeting Guides & Reviews — AI Finance Deals',
    description: 'Methods for tracking cash flow, envelope budgeting, and 50/30/20 allocation.',
    heading: 'Budgeting Guides & Cash Flow Frameworks',
    summary: 'Practical approaches to after-tax income allocation and sustainable household budgeting.',
  },
  {
    route: '/personal-finance/saving/',
    title: 'Saving Strategies & Guides — AI Finance Deals',
    description: 'High-yield cash preservation, automated savings rules, and short-term liquidity reserves.',
    heading: 'Saving & Liquidity Strategies',
    summary: 'Structuring emergency reserves, CD ladders, and high-yield cash preservation.',
  },
  {
    route: '/insurance/',
    title: 'Insurance Guides & Analysis — AI Finance Deals',
    description: 'Clear, unbiased guides comparing term life, health plans, casualty, and auto coverage options.',
    heading: 'Insurance Protection Guides',
    summary: 'Objective actuarial insights comparing life, health, HSA-eligible plans, and auto liability policies.',
  },
  {
    route: '/insurance/life-insurance/',
    title: 'Life Insurance Guides & Reviews — AI Finance Deals',
    description: 'Term vs. whole life policies, underwriting criteria, and family coverage calculations.',
    heading: 'Life Insurance Guides & Analysis',
    summary: 'Comparing pure death-benefit term policies with permanent coverage structures.',
  },
  {
    route: '/insurance/health-insurance/',
    title: 'Health Insurance Guides & Reviews — AI Finance Deals',
    description: 'HSA vs. FSA optimization, deductible thresholds, and out-of-pocket maximum rules.',
    heading: 'Health Insurance & HSA Strategy',
    summary: 'Understanding HDHP deductibles, out-of-pocket limits, and triple-tax-advantaged HSAs.',
  },
  {
    route: '/insurance/auto-insurance/',
    title: 'Auto Insurance Guides & Reviews — AI Finance Deals',
    description: 'Comprehensive vs. collision options, state minimums, and discount strategies.',
    heading: 'Auto Insurance Liability & Coverage Limits',
    summary: 'Calibrating split liability coverage, comprehensive deductibles, and gap insurance.',
  },
  {
    route: '/banking/',
    title: 'Banking Guides & Analysis — AI Finance Deals',
    description: 'High-yield savings accounts, certificate of deposits (CDs), checking perks, and FDIC insurance limits.',
    heading: 'Banking Guides & Rate Comparisons',
    summary: 'Independent coverage of high-yield savings, fee-free checking, CDs, and FDIC deposit protection.',
  },
  {
    route: '/banking/bank-accounts/',
    title: 'Bank Accounts & HYSA Guides — AI Finance Deals',
    description: 'Fee-free checking accounts, high-yield cash sweep accounts, and business banking.',
    heading: 'Bank Accounts & High-Yield Savings',
    summary: 'Comparing APY tiers, fee structures, and transfer rules across FDIC-insured institutions.',
  },
  {
    route: '/credit-loans/',
    title: 'Credit & Loans Guides & Analysis — AI Finance Deals',
    description: 'FICO score optimization, fixed-rate mortgages, personal loan APR comparisons, and balance transfer rules.',
    heading: 'Credit Scores & Consumer Lending',
    summary: 'Understanding FICO scoring weights, Truth in Lending APR rules, mortgages, and debt consolidation.',
  },
  {
    route: '/financial-technology/',
    title: 'Financial Technology Guides & Analysis — AI Finance Deals',
    description: 'Robo-advisors, AI-powered budgeting engines, open banking APIs, and financial cryptographic security.',
    heading: 'Financial Technology & Open Banking',
    summary: 'Exploring CFPB Section 1033 open banking, automated investing, and payment tokenization.',
  },
  {
    route: '/finance-deals/',
    title: 'Verified Financial Deals & Banking Offers — AI Finance Deals',
    description: 'Verified promotional rates, high-yield savings accounts, and credit opportunities audited against issuer terms.',
    heading: 'Verified Financial Product Deals',
    summary: 'Curated banking and credit offers verified against official issuer disclosures and expiration dates.',
  },
  {
    route: '/comparisons/',
    title: 'Side-by-Side Financial Product Comparisons — AI Finance Deals',
    description: 'Objective matrices comparing top high-yield savings accounts, term life insurers, cash-back cards, personal loans, and robo-advisors.',
    heading: 'Financial Product Comparison Center',
    summary: 'Rigorous side-by-side benchmarks evaluating fees, APRs, APYs, pros, cons, and regulatory standings.',
  },
  {
    route: '/about-us/',
    title: 'About AI Finance Deals — Independent Financial Research & Editorial Charter',
    description: 'Learn about our mission, editorial independence, fact-checking methodology, and consumer-first standards.',
    heading: 'About AI Finance Deals',
    summary: 'An independent financial publishing platform focused on clarity, source verification, and transparent disclosures.',
  },
  {
    route: '/editorial-team/',
    title: 'Editorial Board & Financial Analysts — AI Finance Deals',
    description: 'Meet the credentialed financial planners, CFA charterholders, and insurance analysts reviewing our research.',
    heading: 'Editorial Board & Analysts',
    summary: 'Meet the editors and contributors responsible for AI Finance Deals educational guides and product benchmarks.',
  },
  {
    route: '/authors/',
    title: 'Author Profiles & Editorial Contributors — AI Finance Deals',
    description: 'Browse verified contributor profiles, academic credentials, and published guides on AI Finance Deals.',
    heading: 'Authors & Editorial Contributors',
    summary: 'Profiles, credentials, and published guides by AI Finance Deals editorial contributors.',
  },
  {
    route: '/authors/sarah-jenkins',
    title: 'Sarah Jenkins, CFP® — Senior Financial Planning Editor | AI Finance Deals',
    description: 'Profile and published financial guides by Sarah Jenkins, CFP®, Senior Financial Planning Editor.',
    heading: 'Sarah Jenkins, CFP®',
    summary: 'Senior Financial Planning Editor covering budgeting frameworks, credit modeling, and household wealth.',
  },
  {
    route: '/authors/marcus-vance',
    title: 'Marcus Vance — Banking & Financial Technology Lead | AI Finance Deals',
    description: 'Profile and published financial guides by Marcus Vance, CFA Charterholder and Banking & FinTech Lead.',
    heading: 'Marcus Vance, CFA',
    summary: 'Banking & Financial Technology Lead covering retail banking innovation, deposit protection, and fintech security.',
  },
  {
    route: '/authors/elena-rostova',
    title: 'Elena Rostova, ChFC® — Insurance & Risk Specialist | AI Finance Deals',
    description: 'Profile and published insurance guides by Elena Rostova, ChFC®, FSA.',
    heading: 'Elena Rostova, ChFC®',
    summary: 'Insurance & Risk Analysis Specialist covering term life, health insurance, HSAs, and auto coverage.',
  },
  {
    route: '/contact/',
    title: 'Contact Editorial & Corrections Desk — AI Finance Deals',
    description: 'Reach AI Finance Deals for editorial inquiries, rate corrections, and partnership compliance.',
    heading: 'Contact AI Finance Deals',
    summary: 'Editorial inquiries, factual correction requests, and advertising compliance contacts.',
  },
  {
    route: '/editorial-policy/',
    title: 'Editorial Policy & Content Update Standards — AI Finance Deals',
    description: 'Our separation of editorial judgment from commercial partners, AI assistance governance, and periodic rate audit standards.',
    heading: 'Editorial & Content Update Policy',
    summary: 'Editorial independence firewall, human expert review requirements, and scheduled rate auditing.',
  },
  {
    route: '/fact-checking-policy/',
    title: 'Fact-Checking Policy & Primary Source Standards — AI Finance Deals',
    description: 'How AI Finance Deals verifies APYs, APRs, FDIC limits, and regulatory rules against government and issuer sources.',
    heading: 'Fact-Checking Policy',
    summary: 'Primary source verification rules and pre-publication editorial sign-off procedures.',
  },
  {
    route: '/corrections-policy/',
    title: 'Corrections & Accuracy Policy — AI Finance Deals',
    description: 'How readers can report factual errors and how AI Finance Deals documents material updates.',
    heading: 'Corrections Policy',
    summary: 'Transparent procedures for investigating and publishing timely factual corrections.',
  },
  {
    route: '/affiliate-disclosure/',
    title: 'Affiliate Disclosure — AI Finance Deals',
    description: 'Transparent disclosure of how affiliate links work and how editorial integrity remains independent of commissions.',
    heading: 'Affiliate Disclosure',
    summary: 'Disclosure of referral compensation relationships and editorial ranking independence.',
  },
  {
    route: '/advertising-disclosure/',
    title: 'Advertising Disclosure — AI Finance Deals',
    description: 'How paid advertising is clearly labeled and kept separate from editorial financial guides.',
    heading: 'Advertising Disclosure',
    summary: 'Clear demarcation between paid advertising units and independent editorial content.',
  },
  {
    route: '/cookie-policy/',
    title: 'Cookie Policy & Consent Controls — AI Finance Deals',
    description: 'Details on essential storage, optional analytics/advertising consent controls, and browser privacy preferences.',
    heading: 'Cookie Policy',
    summary: 'How essential storage and consent-gated analytics and advertising cookies operate on AI Finance Deals.',
  },
  {
    route: '/disclaimer/',
    title: 'Financial & Editorial Disclaimer — AI Finance Deals',
    description: 'Educational-only informational disclaimer confirming content is not personalized fiduciary, tax, or legal advice.',
    heading: 'Financial Disclaimer',
    summary: 'Informational educational scope and recommendation to consult licensed professionals for individual guidance.',
  },
  {
    route: '/privacy-policy/',
    title: 'Privacy Policy — AI Finance Deals',
    description: 'How AI Finance Deals handles newsletter opt-ins, cookie consent preferences, and data security via Supabase.',
    heading: 'Privacy Policy',
    summary: 'Accurate disclosure of collected data, consent controls, third-party services, and user privacy rights.',
  },
  {
    route: '/terms-and-conditions/',
    title: 'Terms & Conditions — AI Finance Deals',
    description: 'Terms of use governing access to AI Finance Deals educational guides, comparison tables, and disclosures.',
    heading: 'Terms & Conditions',
    summary: 'Permitted informational use, intellectual property, third-party links, and limitation of liability.',
  },
];

function buildPrerenderedHtml(meta) {
  const canonicalUrl = `${BASE_URL}${meta.route === '/' ? '/' : meta.route}`;
  const ogImage = meta.image?.startsWith('http') ? meta.image : `${BASE_URL}${meta.image || '/og-default.jpg'}`;
  const robots = meta.robots || 'index, follow';

  let html = baseHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${escapeHtml(robots)}" />`
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`
  );

  const schemaJson = meta.schema
    ? JSON.stringify(meta.schema)
    : JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: meta.title,
        description: meta.description,
        url: canonicalUrl,
        isPartOf: { '@type': 'WebSite', name: 'AI Finance Deals', url: `${BASE_URL}/` },
      });

  const rawGsc = (process.env.VITE_GSC_VERIFICATION || '').trim().replace(/^google-site-verification=/i, '');
  const isRealGsc = Boolean(rawGsc && !rawGsc.toUpperCase().includes('PLACEHOLDER') && !rawGsc.toUpperCase().includes('YOUR_'));
  const gscMetaTag =
    isRealGsc && robots !== 'noindex, nofollow'
      ? `  <meta name="google-site-verification" content="${escapeHtml(rawGsc)}" />\n`
      : '';

  const schemaTag = `<script type="application/ld+json">${schemaJson}</script>`;
  html = html.replace('</head>', `${gscMetaTag}  ${schemaTag}\n  </head>`);

  const fallbackBody = `<div id="root"><main style="max-width:960px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif;color:#0D1F3C;"><header style="border-bottom:1px solid #E2E8F0;padding-bottom:16px;margin-bottom:24px;"><a href="/" style="font-weight:800;font-size:18px;text-decoration:none;color:#0D1F3C;">AI Finance Deals</a><nav style="margin-top:8px;font-size:13px;display:flex;gap:12px;flex-wrap:wrap;"><a href="/articles/">Guides</a><a href="/personal-finance/">Personal Finance</a><a href="/insurance/">Insurance</a><a href="/banking/">Banking</a><a href="/credit-loans/">Credit &amp; Loans</a><a href="/comparisons/">Comparisons</a><a href="/about-us/">About</a></nav></header><article><h1 style="font-size:32px;line-height:1.2;margin-bottom:12px;">${escapeHtml(meta.heading)}</h1><p style="font-size:16px;line-height:1.6;color:#4B5563;">${escapeHtml(meta.summary || meta.description)}</p>${meta.contentHtml ? `<section style="margin-top:20px;line-height:1.7;">${meta.contentHtml}</section>` : ''}</article></main></div>`;

  html = html.replace('<div id="root"></div>', fallbackBody);
  return html;
}

function writeRouteFile(routePath, html) {
  if (routePath === '/') {
    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html, 'utf8');
    return;
  }
  const clean = routePath.replace(/^\/+|\/+$/g, '');
  const targetDir = path.join(DIST_DIR, clean);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
}

const publishedArticles = extractPublishedArticles();
let count = 0;

for (const page of STATIC_ROUTES) {
  const html = buildPrerenderedHtml(page);
  writeRouteFile(page.route, html);
  count++;
}

for (const article of publishedArticles) {
  const route = `/articles/${article.slug}`;
  const normalizedSeoTitle = article.seoTitle.includes('AI Finance Deals')
    ? article.seoTitle
    : `${article.seoTitle} | AI Finance Deals`;
  const html = buildPrerenderedHtml({
    route,
    title: normalizedSeoTitle,
    description: article.description,
    heading: article.title,
    summary: article.excerpt,
    image: article.image,
    contentHtml: article.contentHtml,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      image: [`${BASE_URL}${article.image}`],
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}${route}` },
      publisher: {
        '@type': 'Organization',
        name: 'AI Finance Deals',
        url: `${BASE_URL}/`,
        logo: { '@type': 'ImageObject', url: `${BASE_URL}/icons/logo.svg` },
      },
    },
  });
  writeRouteFile(route, html);
  count++;
}

// Generate noindex 404.html fallback
const notFoundHtml = buildPrerenderedHtml({
  route: '/404.html',
  title: 'Page Not Found (404) — AI Finance Deals',
  description: 'The requested financial guide or page could not be found on AI Finance Deals.',
  heading: '404 — Page Not Found',
  summary: 'We could not find the page you requested. Explore our published financial guides or return to the homepage.',
  robots: 'noindex, nofollow',
});
fs.writeFileSync(path.join(DIST_DIR, '404.html'), notFoundHtml, 'utf8');

console.log(`[prerender] Generated static SEO HTML for ${count} routes (${publishedArticles.length} published articles) + 404.html`);
