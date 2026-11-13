// ==============================================================================
// AI FINANCE DEALS — CENTRALIZED GOOGLE ADSENSE CONFIGURATION ENGINE
// Publisher ID: pub-7571394117486446 / ca-pub-7571394117486446
// ==============================================================================

export type AdFormatType = 
  | 'horizontal' 
  | 'square' 
  | 'vertical' 
  | 'in-article' 
  | 'in-feed' 
  | 'multiplex'
  | 'responsive';

export type DeviceVisibility = 
  | 'all' 
  | 'desktop-only' 
  | 'mobile-only' 
  | 'desktop-tablet';

export type AdvertisingMode = 
  | 'hybrid'      // MODE C: Auto Ads + Administrator Selected Manual Units
  | 'auto_only'   // MODE A: Google Auto Ads Only (Manual ad units suppressed)
  | 'manual_only'; // MODE B: Manual Ad Units Only (Auto Ads script directives disabled)

export interface ManualAdUnit {
  id: string;
  name: string;
  slotId: string;
  format: AdFormatType;
  layout: string;
  placementTarget: string;
  fullWidthResponsive: boolean;
  desktopVisible: boolean;
  tabletVisible: boolean;
  mobileVisible: boolean;
  status: 'active' | 'inactive';
  minHeight: number;
  maxWidth?: number;
  layoutKey?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdPlacementConfig {
  id: string;
  name: string;
  slotId: string;
  format: AdFormatType;
  deviceVisibility: DeviceVisibility;
  enabled: boolean;
  minHeight: number;
  maxWidth?: number;
  fullWidthResponsive: boolean;
  description: string;
  layoutKey?: string;
  categoryTargeting?: string[];
  articleSection?: 'before' | 'within' | 'between_paragraphs' | 'after' | 'related';
}

export interface AutoAdsConfig {
  enabled: boolean;
  desktop: boolean;
  mobile: boolean;
  inPage: boolean;
  anchor: boolean;
  vignette: boolean;
  multiplex: boolean;
  frequency: 'conservative' | 'balanced' | 'aggressive';
  excludedPages: string[];
}

export interface CategoryTargetingConfig {
  personalFinance: boolean;
  insurance: boolean;
  banking: boolean;
  creditLoans: boolean;
  deals: boolean;
  comparisons: boolean;
  fintech: boolean;
}

export interface ArticleTargetingConfig {
  beforeContent: boolean;
  withinContent: boolean;
  betweenParagraphs: boolean;
  afterContent: boolean;
  relatedSection: boolean;
}

export interface ReportingApiConfig {
  connected: boolean;
  clientEmail?: string;
  serviceAccountConfigured: boolean;
  lastSyncedAt?: string;
}

export interface AdSenseGlobalConfig {
  publisherId: string;
  advertisingMode: AdvertisingMode;
  globalEnabled: boolean;
  autoAdsEnabled: boolean;
  manualAdsEnabled: boolean;
  responsiveAdsEnabled: boolean;
  lazyLoadingEnabled: boolean;
  desktopEnabled: boolean;
  tabletEnabled: boolean;
  mobileEnabled: boolean;
  testMode: boolean; // Shows structured AdSense container preview when waiting for Google ad delivery
  autoAds: AutoAdsConfig;
  manualUnits: ManualAdUnit[];
  placements: Record<string, AdPlacementConfig>;
  categoryTargeting: CategoryTargetingConfig;
  articleTargeting: ArticleTargetingConfig;
  reporting: ReportingApiConfig;
  excludedPages: string[];
  updatedAt: string;
}

export const STORAGE_KEY = 'aifinancedeals_adsense_settings';
export const ADSENSE_UPDATE_EVENT = 'aifinancedeals_adsense_updated';

export const INITIAL_MANUAL_UNITS: ManualAdUnit[] = [
  {
    id: 'unit-1',
    name: 'Header Horizontal Leaderboard',
    slotId: '1092837465',
    format: 'horizontal',
    layout: 'display',
    placementTarget: 'headerBanner',
    fullWidthResponsive: true,
    desktopVisible: true,
    tabletVisible: true,
    mobileVisible: true,
    status: 'active',
    minHeight: 90,
    maxWidth: 970,
    description: 'Prominent leaderboard positioned below header navigation across all public views',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-15',
  },
  {
    id: 'unit-2',
    name: 'Footer Horizontal Banner',
    slotId: '2093847561',
    format: 'horizontal',
    layout: 'display',
    placementTarget: 'footerBanner',
    fullWidthResponsive: true,
    desktopVisible: true,
    tabletVisible: true,
    mobileVisible: true,
    status: 'active',
    minHeight: 90,
    maxWidth: 970,
    description: 'Above-footer horizontal display banner prior to footer navigation links',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-15',
  },
  {
    id: 'unit-3',
    name: 'Homepage Mid-Section Display',
    slotId: '3094857612',
    format: 'horizontal',
    layout: 'display',
    placementTarget: 'homepageMid',
    fullWidthResponsive: true,
    desktopVisible: true,
    tabletVisible: true,
    mobileVisible: true,
    status: 'active',
    minHeight: 90,
    maxWidth: 970,
    description: 'Separating banking guides and financial deal listings on the homepage',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-15',
  },
  {
    id: 'unit-4',
    name: 'In-Article Fluid Native Unit',
    slotId: '4095867123',
    format: 'in-article',
    layout: 'in-article',
    placementTarget: 'inArticlePrimary',
    fullWidthResponsive: true,
    desktopVisible: true,
    tabletVisible: true,
    mobileVisible: true,
    status: 'active',
    minHeight: 120,
    description: 'Native contextual in-article unit nested naturally between editorial paragraphs',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-15',
  },
  {
    id: 'unit-5',
    name: 'In-Feed Editorial & Deal Grid Unit',
    slotId: '5096871234',
    format: 'in-feed',
    layout: '-fb+5w+4e-db+86',
    placementTarget: 'inFeedNative',
    fullWidthResponsive: true,
    desktopVisible: true,
    tabletVisible: true,
    mobileVisible: true,
    status: 'active',
    minHeight: 280,
    layoutKey: '-fb+5w+4e-db+86',
    description: 'Native card ad styled identically to article and deal cards in discovery grids',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-15',
  },
  {
    id: 'unit-6',
    name: 'Multiplex Recommendation Grid',
    slotId: '6097882345',
    format: 'multiplex',
    layout: 'multiplex',
    placementTarget: 'multiplexFooter',
    fullWidthResponsive: true,
    desktopVisible: true,
    tabletVisible: true,
    mobileVisible: true,
    status: 'active',
    minHeight: 250,
    description: 'Multi-card sponsored content recommendation grid positioned below articles and deal pages',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-15',
  },
  {
    id: 'unit-7',
    name: 'Desktop Sidebar Vertical Skyscraper',
    slotId: '7098893456',
    format: 'vertical',
    layout: 'display',
    placementTarget: 'sidebarSkyscraper',
    fullWidthResponsive: false,
    desktopVisible: true,
    tabletVisible: false,
    mobileVisible: false,
    status: 'active',
    minHeight: 600,
    maxWidth: 300,
    description: 'High-visibility 160x600 or 300x600 skyscraper ad for desktop editorial sidebars',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-15',
  },
  {
    id: 'unit-8',
    name: 'High-Impact Content Square',
    slotId: '8099904567',
    format: 'square',
    layout: 'display',
    placementTarget: 'contentSquare',
    fullWidthResponsive: true,
    desktopVisible: true,
    tabletVisible: true,
    mobileVisible: true,
    status: 'active',
    minHeight: 250,
    maxWidth: 336,
    description: 'Standard 300x250 or 336x280 square display unit for content columns and sidebars',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-15',
  },
];

export const DEFAULT_ADSENSE_CONFIG: AdSenseGlobalConfig = {
  publisherId: 'ca-pub-7571394117486446',
  advertisingMode: 'hybrid', // Hybrid Mode: Auto Ads + Selected Manual Units
  globalEnabled: true,
  autoAdsEnabled: true,
  manualAdsEnabled: true,
  responsiveAdsEnabled: true,
  lazyLoadingEnabled: true,
  desktopEnabled: true,
  tabletEnabled: true,
  mobileEnabled: true,
  testMode: false,
  autoAds: {
    enabled: true,
    desktop: true,
    mobile: true,
    inPage: true,
    anchor: true,
    vignette: true,
    multiplex: true,
    frequency: 'balanced',
    excludedPages: ['/admin/*', '/admin/login'],
  },
  manualUnits: INITIAL_MANUAL_UNITS,
  placements: {
    headerBanner: {
      id: 'headerBanner',
      name: 'Header Horizontal Banner',
      slotId: '1092837465',
      format: 'horizontal',
      deviceVisibility: 'all',
      enabled: true,
      minHeight: 90,
      maxWidth: 970,
      fullWidthResponsive: true,
      description: 'Leaderboard banner positioned directly below main navigation',
    },
    footerBanner: {
      id: 'footerBanner',
      name: 'Footer Horizontal Banner',
      slotId: '2093847561',
      format: 'horizontal',
      deviceVisibility: 'all',
      enabled: true,
      minHeight: 90,
      maxWidth: 970,
      fullWidthResponsive: true,
      description: 'Above-footer horizontal display banner',
    },
    homepageMid: {
      id: 'homepageMid',
      name: 'Homepage Mid-Section Display',
      slotId: '3094857612',
      format: 'horizontal',
      deviceVisibility: 'all',
      enabled: true,
      minHeight: 90,
      maxWidth: 970,
      fullWidthResponsive: true,
      description: 'Horizontal display ad positioned between banking and deals sections',
    },
    articleTop: {
      id: 'articleTop',
      name: 'Article Top Horizontal Display',
      slotId: '9012837465',
      format: 'horizontal',
      deviceVisibility: 'all',
      enabled: true,
      minHeight: 90,
      maxWidth: 970,
      fullWidthResponsive: true,
      description: 'Responsive display unit placed above article body content',
      articleSection: 'before',
    },
    inArticlePrimary: {
      id: 'inArticlePrimary',
      name: 'In-Article Fluid Ad',
      slotId: '4095867123',
      format: 'in-article',
      deviceVisibility: 'all',
      enabled: true,
      minHeight: 120,
      fullWidthResponsive: true,
      description: 'Fluid native in-article ad inserted between paragraphs',
      articleSection: 'between_paragraphs',
    },
    inFeedNative: {
      id: 'inFeedNative',
      name: 'In-Feed Article & Deal Grid Unit',
      slotId: '5096871234',
      format: 'in-feed',
      deviceVisibility: 'all',
      enabled: true,
      minHeight: 280,
      fullWidthResponsive: true,
      layoutKey: '-fb+5w+4e-db+86',
      description: 'Native card ad matching the design of financial article cards',
    },
    multiplexFooter: {
      id: 'multiplexFooter',
      name: 'Horizontal Multiplex Unit',
      slotId: '6097882345',
      format: 'multiplex',
      deviceVisibility: 'all',
      enabled: true,
      minHeight: 250,
      fullWidthResponsive: true,
      description: 'Grid of recommended content placed below articles',
      articleSection: 'after',
    },
    sidebarSkyscraper: {
      id: 'sidebarSkyscraper',
      name: 'Sidebar Vertical Skyscraper',
      slotId: '7098893456',
      format: 'vertical',
      deviceVisibility: 'desktop-only',
      enabled: true,
      minHeight: 600,
      maxWidth: 300,
      fullWidthResponsive: true,
      description: 'High-visibility vertical ad for desktop article and category sidebars',
    },
    contentSquare: {
      id: 'contentSquare',
      name: 'Content Square Display',
      slotId: '8099904567',
      format: 'square',
      deviceVisibility: 'all',
      enabled: true,
      minHeight: 250,
      maxWidth: 336,
      fullWidthResponsive: true,
      description: 'Standard 300x250 or 336x280 square display unit',
    },
  },
  categoryTargeting: {
    personalFinance: true,
    insurance: true,
    banking: true,
    creditLoans: true,
    deals: true,
    comparisons: true,
    fintech: true,
  },
  articleTargeting: {
    beforeContent: true,
    withinContent: true,
    betweenParagraphs: true,
    afterContent: true,
    relatedSection: true,
  },
  reporting: {
    connected: false,
    serviceAccountConfigured: false,
  },
  excludedPages: ['/admin', '/admin/*', '/admin/login'],
  updatedAt: new Date().toISOString(),
};

/**
 * Validate Google AdSense Publisher Client ID format
 */
export function validatePublisherId(id: string): { valid: boolean; formatted: string; message: string } {
  const trimmed = id.trim();
  if (!trimmed) {
    return { valid: false, formatted: '', message: 'Publisher ID cannot be blank.' };
  }

  // Accept ca-pub-XXXXXXXXXXXXXXXX or pub-XXXXXXXXXXXXXXXX (16 digits)
  const regex = /^(ca-)?pub-\d{16}$/;
  if (regex.test(trimmed)) {
    const formatted = trimmed.startsWith('ca-') ? trimmed : `ca-${trimmed}`;
    return { valid: true, formatted, message: 'Valid AdSense Publisher ID format.' };
  }

  return {
    valid: false,
    formatted: trimmed,
    message: 'Publisher ID must follow the standard pub-XXXXXXXXXXXXXXXX format (16 digits).',
  };
}

/**
 * Validate Ad Unit Slot ID format (numeric digits)
 */
export function validateSlotId(slotId: string): { valid: boolean; message: string } {
  const trimmed = slotId.trim();
  if (!trimmed) {
    return { valid: false, message: 'Ad Unit Slot ID is required.' };
  }
  if (!/^\d{8,12}$/.test(trimmed)) {
    return { valid: false, message: 'Ad Unit Slot ID must be an 8-to-12 digit numeric identifier provided by Google AdSense.' };
  }
  return { valid: true, message: 'Valid Ad Unit Slot ID.' };
}

/**
 * Retrieve centralized AdSense configuration from persistent storage
 */
export function getAdSenseConfig(): AdSenseGlobalConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_ADSENSE_CONFIG,
        ...parsed,
        autoAds: {
          ...DEFAULT_ADSENSE_CONFIG.autoAds,
          ...(parsed.autoAds || {}),
        },
        manualUnits: Array.isArray(parsed.manualUnits) && parsed.manualUnits.length > 0 
          ? parsed.manualUnits 
          : DEFAULT_ADSENSE_CONFIG.manualUnits,
        placements: {
          ...DEFAULT_ADSENSE_CONFIG.placements,
          ...(parsed.placements || {}),
        },
        categoryTargeting: {
          ...DEFAULT_ADSENSE_CONFIG.categoryTargeting,
          ...(parsed.categoryTargeting || {}),
        },
        articleTargeting: {
          ...DEFAULT_ADSENSE_CONFIG.articleTargeting,
          ...(parsed.articleTargeting || {}),
        },
        reporting: {
          ...DEFAULT_ADSENSE_CONFIG.reporting,
          ...(parsed.reporting || {}),
        },
      };
    }
  } catch (e) {
    console.warn('Could not read AdSense settings from localStorage', e);
  }
  return DEFAULT_ADSENSE_CONFIG;
}

/**
 * Persist centralized AdSense configuration to storage and broadcast update event
 */
export function saveAdSenseConfig(config: AdSenseGlobalConfig) {
  try {
    const updated = {
      ...config,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(ADSENSE_UPDATE_EVENT, { detail: updated }));
    }
  } catch (e) {
    console.warn('Could not save AdSense settings to localStorage', e);
  }
}

/**
 * Reset AdSense configuration to initial certified baseline
 */
export function resetAdSenseConfigToDefaults(): AdSenseGlobalConfig {
  saveAdSenseConfig(DEFAULT_ADSENSE_CONFIG);
  return DEFAULT_ADSENSE_CONFIG;
}

/**
 * Evaluates whether a manual ad placement is eligible to render based on current mode and targeting
 */
export function isManualPlacementAllowed(
  config: AdSenseGlobalConfig,
  placementId?: string,
  categorySlug?: string,
  pathname?: string
): boolean {
  if (!config.globalEnabled) return false;
  if (!config.manualAdsEnabled) return false;

  // Mode check
  if (config.advertisingMode === 'auto_only') {
    // Mode A: Only Auto Ads run; manual slots are suppressed
    return false;
  }

  // Route check
  if (pathname) {
    const isExcluded = config.excludedPages.some((pattern) => {
      if (pattern.endsWith('/*')) {
        const prefix = pattern.slice(0, -2);
        return pathname.startsWith(prefix);
      }
      return pathname === pattern;
    });
    if (isExcluded) return false;
  }

  // Category targeting check
  if (categorySlug && config.categoryTargeting) {
    const catMap: Record<string, keyof CategoryTargetingConfig> = {
      'personal-finance': 'personalFinance',
      'insurance': 'insurance',
      'banking': 'banking',
      'credit-loans': 'creditLoans',
      'deals': 'deals',
      'comparisons': 'comparisons',
      'fintech': 'fintech',
    };
    const key = catMap[categorySlug];
    if (key && config.categoryTargeting[key] === false) {
      return false;
    }
  }

  // Specific placement enable check
  if (placementId && config.placements[placementId]) {
    return config.placements[placementId].enabled;
  }

  return true;
}

/**
 * Checks whether live Google AdSense network requests are explicitly authorized
 * via deployment environment configuration (VITE_ADSENSE_ENABLED="true").
 */
export function isAdSenseEnvAuthorized(config?: AdSenseGlobalConfig): boolean {
  const envEnabled = import.meta.env.VITE_ADSENSE_ENABLED === 'true';
  if (!envEnabled) return false;
  const pubId = config?.publisherId || import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-7571394117486446';
  return validatePublisherId(pubId).valid;
}

/**
 * Determines whether an ad container should render in the DOM:
 * - Renders when live AdSense is authorized via env, OR
 * - Renders when administrator explicitly enables Test Preview Mode in CMS.
 * Prevents oversized blank boxes on public pages before external AdSense approval.
 */
export function shouldRenderAdContainer(config: AdSenseGlobalConfig): boolean {
  return isAdSenseEnvAuthorized(config) || Boolean(config.testMode);
}

