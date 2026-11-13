import { Article } from '../types';
import { CATEGORIES } from '../data/mockData';

export const ARTICLE_IMAGE_BUCKET = 'article-featured-images';

export type CategoryImageFolder =
  | 'personal-finance'
  | 'insurance'
  | 'banking'
  | 'credit-loans'
  | 'finance-deals'
  | 'comparisons'
  | 'financial-technology';

export const CATEGORY_FOLDER_LABELS: Record<CategoryImageFolder, string> = {
  'personal-finance': 'Personal Finance',
  insurance: 'Insurance',
  banking: 'Banking',
  'credit-loans': 'Credit & Loans',
  'finance-deals': 'Finance Deals',
  comparisons: 'Comparisons',
  'financial-technology': 'Financial Technology',
};

export function resolveCategoryFolder(categoryId?: string, categorySlug?: string): CategoryImageFolder {
  const cat =
    CATEGORIES.find((c) => c.id === categoryId) ||
    CATEGORIES.find((c) => c.slug === categorySlug);

  const resolvedId = cat?.parent_id || cat?.id || categoryId || '';
  const slug = CATEGORIES.find((c) => c.id === resolvedId)?.slug || categorySlug || '';

  switch (slug) {
    case 'insurance':
    case 'life-insurance':
    case 'health-insurance':
    case 'auto-insurance':
      return 'insurance';
    case 'banking':
    case 'bank-accounts':
      return 'banking';
    case 'credit-loans':
      return 'credit-loans';
    case 'finance-deals':
      return 'finance-deals';
    case 'comparisons':
      return 'comparisons';
    case 'financial-technology':
      return 'financial-technology';
    case 'personal-finance':
    case 'budgeting':
    case 'saving':
    default:
      return 'personal-finance';
  }
}

export function getExpectedStoragePath(article: Pick<Article, 'slug' | 'category_id' | 'category'>): string {
  const folder = resolveCategoryFolder(article.category_id, article.category?.slug);
  const safeSlug = (article.slug || 'financial-guide')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${folder}/${safeSlug}.webp`;
}

export function getLocalArticleImagePath(article: Pick<Article, 'slug' | 'category_id' | 'category'>): string {
  return `/images/articles/${getExpectedStoragePath(article)}`;
}

export const LEGACY_SHARED_IMAGES = new Set([
  '/images/hero_ai_datacenter_finance_1793743607871.jpg',
  '/images/fintech_algorithmic_trading_1793743608886.jpg',
  '/images/sovereign_ai_investment_1793743609559.jpg',
  '/images/autonomous_agent_banking_1793743609762.jpg',
]);

export function buildEditorialImagePrompt(article: Pick<Article, 'title' | 'excerpt' | 'content' | 'category_id' | 'category'>): string {
  const folder = resolveCategoryFolder(article.category_id, article.category?.slug);
  const plainSnippet = (article.content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 260);

  const topicFocus = [
    article.title,
    article.excerpt ? `Key theme: ${article.excerpt}` : '',
    plainSnippet ? `Core concepts: ${plainSnippet}` : '',
  ]
    .filter(Boolean)
    .join('. ');

  return [
    `Editorial photography and clean modern fintech magazine art direction for an article titled "${article.title}" in the ${CATEGORY_FOLDER_LABELS[folder]} section.`,
    `Visually represent the core concept: ${topicFocus}`,
    `Color palette: deep navy blue (#0D1F3C), slate blue (#163A5F), subtle teal/emerald accents (#00B894), crisp white and cool neutral architectural stone surfaces.`,
    `Composition: widescreen 16:9 editorial layout with clean lighting, realistic studio depth of field, and clear focal balance.`,
    `Strict constraints: NO text overlays, NO words, NO numbers, NO watermarks, NO brand logos, NO cliché shiny cryptocurrency coins.`,
  ].join(' ');
}
