export type ArticleStatus = 'draft' | 'editorial_review' | 'fact_check' | 'approved' | 'published';

export type UserRole = 'administrator' | 'editor' | 'author' | 'none';

export interface Author {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  credentials: string;
  avatar_url?: string;
  verified: boolean;
  twitter_handle?: string;
  linkedin_url?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id?: string | null;
  featured?: boolean;
}

export interface ArticleSource {
  title: string;
  url: string;
  publisher: string;
  date_accessed?: string;
}

export type ArticleType = 'general' | 'detailed' | 'pillar';
export type SearchIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';

export interface ArticleSectionsData {
  section01_title?: string;
  section02_meta?: string;
  section03_intro?: string;
  section04_toc?: string;
  section05_background?: string;
  section06_main1?: string;
  section07_main2?: string;
  section08_data_stats?: string;
  section09_case_studies?: string;
  section10_comparison?: string;
  section11_practical_guide?: string;
  section12_future_trends?: string;
  section13_faq?: string;
  section14_conclusion?: string;
  section15_references?: string;
}

export interface ArticleFaqItem {
  question: string;
  answer: string;
}

export type ArticleImageStatus =
  | 'PENDING'
  | 'GENERATING'
  | 'GENERATED'
  | 'UPLOADING'
  | 'COMPLETED'
  | 'FAILED'
  | 'NEEDS_REVIEW';

export interface ArticleImageMetadata {
  width?: number;
  height?: number;
  format?: 'webp' | 'png' | 'jpg';
  storagePath?: string;
  bucket?: string;
  generationStatus?: ArticleImageStatus;
  promptSummary?: string;
  generatedAt?: string;
  approvedAt?: string;
  source?: 'ai_generated' | 'supabase_storage' | 'local_webp' | 'custom';
  errorMessage?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  image_caption?: string;
  image_alt?: string;
  image_metadata?: ArticleImageMetadata;
  category_id: string;
  category?: Category;
  subcategory?: string;
  secondary_categories?: string[];
  author_id: string;
  author?: Author;
  reviewer_name?: string;
  seo_title?: string;
  meta_description?: string;
  canonical_url?: string;
  sources: ArticleSource[];
  read_time: string;
  status: ArticleStatus;
  featured?: boolean;
  trending?: boolean;
  published_at: string;
  updated_at: string;
  created_at: string;
  article_type?: ArticleType;
  focus_keyword?: string;
  secondary_keywords?: string[];
  search_intent?: SearchIntent;
  language?: string;
  quality_score?: number;
  sections_data?: ArticleSectionsData;
  faq_items?: ArticleFaqItem[];
}

export interface DealOfferDetail {
  apr?: string;
  bonus?: string;
  annual_fee?: string;
  min_credit_score?: string;
  highlight?: string;
}

export interface FinancialDeal {
  id: string;
  title: string;
  provider: string;
  category_id: string;
  description: string;
  offer_details: DealOfferDetail;
  terms_url: string;
  official_url: string;
  country: string;
  currency: string;
  valid_from: string;
  valid_until: string;
  verification_status: 'pending' | 'verified' | 'expired' | 'under_review';
  created_at: string;
  updated_at: string;
}

export interface ComparisonItem {
  name: string;
  provider: string;
  rating: number; // Editorial score
  best_for: string;
  fees: string;
  key_feature: string;
  pros: string[];
  cons: string[];
  official_url: string;
}

export interface Comparison {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  description: string;
  comparison_data: ComparisonItem[];
  sources: ArticleSource[];
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  cadence: 'daily' | 'weekly';
  consent_recorded: boolean;
  status: 'active' | 'unsubscribed';
  created_at: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  canonical_domain: string;
  contact_email: string;
  affiliate_disclosure_enabled: boolean;
  google_analytics_id?: string;
  adsense_client_id?: string;
  social_links: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Backward-compatible venture intelligence types
export type DealStage = 
  | 'Seed' 
  | 'Series A' 
  | 'Series B' 
  | 'Series C+' 
  | 'Growth' 
  | 'M&A' 
  | 'IPO' 
  | 'Sovereign Debt';

export type DealCategorySlug = 
  | 'generative-infra'
  | 'autonomous-finance'
  | 'algorithmic-trading'
  | 'enterprise-compliance'
  | 'sovereign-funds'
  | 'bio-fintech';

export interface DealArticle {
  id: string;
  slug: string;
  title: string;
  dek: string;
  category: {
    name: string;
    slug: string;
  };
  stage: DealStage;
  amount: string;
  valuation?: string;
  leadInvestors: string[];
  coInvestors?: string[];
  company: {
    name: string;
    headquarters: string;
    founded: string;
    ceo: string;
    sector: string;
    description: string;
  };
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  imageUrl: string;
  imageCaption?: string;
  content: string[];
  keyTakeaways: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  featured?: boolean;
  breaking?: boolean;
  exclusive?: boolean;
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  dealCount: number;
  totalVolume: string;
  growthYoY: string;
  topBackers: string[];
}

export interface MarketIndicator {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  context: string;
}

export interface TickerDeal {
  id: string;
  company: string;
  amount: string;
  stage: DealStage;
  leadInvestor: string;
  timeAgo: string;
  sector: string;
}
