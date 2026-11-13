// ==============================================================================
// AI FINANCE DEALS — CENTRALIZED INTEGRATION STACK ENGINE & STORAGE
// Domain: https://aifinancedeals.com
// ==============================================================================

import { getAdSenseConfig } from './adsenseConfig';

export type IntegrationStatus = 
  | 'connected' 
  | 'pending' 
  | 'disconnected' 
  | 'config_required' 
  | 'error';

export type IntegrationCategory = 
  | 'google' 
  | 'analytics_seo' 
  | 'monetization' 
  | 'infrastructure' 
  | 'testing';

export interface BaseIntegration {
  id: string;
  name: string;
  service: string;
  category: IntegrationCategory;
  description: string;
  status: IntegrationStatus;
  docsUrl: string;
  lastChecked?: string;
  errorMessage?: string;
}

export interface GoogleSearchConsoleConfig extends BaseIntegration {
  verificationMethod: 'html_tag' | 'dns_txt' | 'oauth';
  verificationToken: string;
  sitemapUrl: string;
  indexedPagesCount: number;
}

export interface GoogleAnalytics4Config extends BaseIntegration {
  measurementId: string;
  enhancedMeasurement: boolean;
  streamName: string;
}

export interface GoogleTagManagerConfig extends BaseIntegration {
  containerId: string;
  environment: 'production' | 'staging';
}

export interface BingWebmasterConfig extends BaseIntegration {
  verificationToken: string;
  indexNowEnabled: boolean;
  indexNowApiKey: string;
  sitemapUrl: string;
}

export interface CloudflareConfig extends BaseIntegration {
  zoneId: string;
  sslMode: 'Full (Strict)' | 'Full' | 'Flexible';
  edgeCacheTtl: string;
  ddosProtection: boolean;
  webAnalyticsToken: string;
}

export interface PageSpeedConfig extends BaseIntegration {
  mobileScore: number;
  desktopScore: number;
  lcp: string;
  fid: string;
  cls: string;
  lastTestedAt: string;
}

export interface RichResultsConfig extends BaseIntegration {
  articleSchemaValid: boolean;
  faqSchemaValid: boolean;
  breadcrumbSchemaValid: boolean;
  organizationSchemaValid: boolean;
  lastTestedAt: string;
}

export interface GoogleAdManagerConfig extends BaseIntegration {
  networkCode: string;
  inventoryMapping: string;
  prebidHeaderBidding: boolean;
}

export interface GoogleAdMobConfig extends BaseIntegration {
  appId: string;
  bannerAdUnitId: string;
  interstitialAdUnitId: string;
}

export interface ApiCredentialsConfig extends BaseIntegration {
  serviceAccountConfigured: boolean;
  geminiApiConfigured: boolean;
  keyRotationDays: number;
  lastRotated: string;
}

export interface IntegrationActivityLog {
  id: string;
  timestamp: string;
  service: string;
  event: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

export interface IntegrationStackSettings {
  googleSearchConsole: GoogleSearchConsoleConfig;
  googleAnalytics4: GoogleAnalytics4Config;
  googleTagManager: GoogleTagManagerConfig;
  bingWebmaster: BingWebmasterConfig;
  cloudflare: CloudflareConfig;
  pageSpeed: PageSpeedConfig;
  richResults: RichResultsConfig;
  googleAdManager: GoogleAdManagerConfig;
  googleAdMob: GoogleAdMobConfig;
  apiCredentials: ApiCredentialsConfig;
  activityLogs: IntegrationActivityLog[];
  updatedAt: string;
}

export const INTEGRATION_STORAGE_KEY = 'aifinancedeals_integration_stack';
export const INTEGRATIONS_UPDATE_EVENT = 'aifinancedeals_integrations_updated';

const ENV_GSC_TOKEN = (import.meta.env.VITE_GSC_VERIFICATION || '')
  .trim()
  .replace(/^google-site-verification=/i, '');
const ENV_GA4_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
const ENV_GTM_ID = (import.meta.env.VITE_GTM_ID || '').trim();

const IS_VALID_GA4 = /^G-[A-Z0-9]+$/i.test(ENV_GA4_ID) && !ENV_GA4_ID.includes('XXX');
const IS_VALID_GTM = /^GTM-[A-Z0-9]+$/i.test(ENV_GTM_ID) && !ENV_GTM_ID.includes('XXX');
const IS_VALID_GSC = ENV_GSC_TOKEN.length > 0 && !ENV_GSC_TOKEN.toUpperCase().includes('PLACEHOLDER');

export const DEFAULT_INTEGRATION_STACK: IntegrationStackSettings = {
  googleSearchConsole: {
    id: 'gsc',
    name: 'Google Search Console',
    service: 'google',
    category: 'google',
    description: 'Monitor Google organic search crawling, index coverage, and sitemap synchronization.',
    status: IS_VALID_GSC ? 'connected' : 'config_required',
    docsUrl: 'https://search.google.com/search-console',
    verificationMethod: 'html_tag',
    verificationToken: ENV_GSC_TOKEN,
    sitemapUrl: 'https://aifinancedeals.com/sitemap.xml',
    indexedPagesCount: 0,
    lastChecked: IS_VALID_GSC ? 'Configured via VITE_GSC_VERIFICATION' : 'Awaiting VITE_GSC_VERIFICATION env var',
  },
  googleAnalytics4: {
    id: 'ga4',
    name: 'Google Analytics 4',
    service: 'google',
    category: 'analytics_seo',
    description: 'Consent-gated telemetry for reader engagement and editorial analytics.',
    status: IS_VALID_GA4 ? 'connected' : 'config_required',
    docsUrl: 'https://analytics.google.com',
    measurementId: IS_VALID_GA4 ? ENV_GA4_ID : '',
    enhancedMeasurement: true,
    streamName: 'AI Finance Deals Web Stream',
    lastChecked: IS_VALID_GA4 ? 'Consent-gated via VITE_GA_MEASUREMENT_ID' : 'Awaiting VITE_GA_MEASUREMENT_ID env var',
  },
  googleTagManager: {
    id: 'gtm',
    name: 'Google Tag Manager',
    service: 'google',
    category: 'google',
    description: 'Consent-gated container deployment for tag triggers and privacy rules.',
    status: IS_VALID_GTM ? 'connected' : 'config_required',
    docsUrl: 'https://tagmanager.google.com',
    containerId: IS_VALID_GTM ? ENV_GTM_ID : '',
    environment: 'production',
    lastChecked: IS_VALID_GTM ? 'Consent-gated via VITE_GTM_ID' : 'Awaiting VITE_GTM_ID env var',
  },
  bingWebmaster: {
    id: 'bing',
    name: 'Bing Webmaster Tools & IndexNow',
    service: 'microsoft',
    category: 'analytics_seo',
    description: 'Search indexation configuration for Microsoft Bing Webmaster Tools.',
    status: 'config_required',
    docsUrl: 'https://www.bing.com/webmasters',
    verificationToken: '',
    indexNowEnabled: false,
    indexNowApiKey: '',
    sitemapUrl: 'https://aifinancedeals.com/sitemap.xml',
    lastChecked: 'Manual Webmaster verification required',
  },
  cloudflare: {
    id: 'cloudflare',
    name: 'Cloudflare Edge DNS & Security',
    service: 'cloudflare',
    category: 'infrastructure',
    description: 'Optional external CDN/DNS proxy configuration when routed ahead of Netlify.',
    status: 'pending',
    docsUrl: 'https://dash.cloudflare.com',
    zoneId: '',
    sslMode: 'Full (Strict)',
    edgeCacheTtl: '4 hours',
    ddosProtection: true,
    webAnalyticsToken: '',
    lastChecked: 'Managed externally via DNS/Netlify',
  },
  pageSpeed: {
    id: 'pagespeed',
    name: 'Google PageSpeed Insights',
    service: 'google',
    category: 'testing',
    description: 'Run Core Web Vitals field & lab audits on the live production URL after Netlify deployment.',
    status: 'pending',
    docsUrl: 'https://pagespeed.web.dev',
    mobileScore: 0,
    desktopScore: 0,
    lcp: 'Run live audit post-deploy',
    fid: 'Run live audit post-deploy',
    cls: 'Reserved containers',
    lastTestedAt: 'Not run on live domain yet',
  },
  richResults: {
    id: 'richresults',
    name: 'Google Rich Results & Schema Validator',
    service: 'google',
    category: 'testing',
    description: 'Local Schema.org JSON-LD blocks (Organization, Article, BreadcrumbList, FAQPage, Person) built into routes.',
    status: 'pending',
    docsUrl: 'https://search.google.com/test/rich-results',
    articleSchemaValid: true,
    faqSchemaValid: true,
    breadcrumbSchemaValid: true,
    organizationSchemaValid: true,
    lastTestedAt: 'Validate live domain URL post-deploy',
  },
  googleAdManager: {
    id: 'gam',
    name: 'Google Ad Manager (GAM)',
    service: 'google',
    category: 'monetization',
    description: 'Optional direct programmatic inventory management after AdSense approval.',
    status: 'disconnected',
    docsUrl: 'https://admanager.google.com',
    networkCode: '',
    inventoryMapping: 'aifinancedeals_primary_network',
    prebidHeaderBidding: false,
    lastChecked: 'Optional post-AdSense setup',
  },
  googleAdMob: {
    id: 'admob',
    name: 'Google AdMob Mobile App SDK',
    service: 'google',
    category: 'monetization',
    description: 'Reserved configuration slot for future iOS/Android native apps.',
    status: 'disconnected',
    docsUrl: 'https://admob.google.com',
    appId: '',
    bannerAdUnitId: '',
    interstitialAdUnitId: '',
    lastChecked: 'Web app only',
  },
  apiCredentials: {
    id: 'apicreds',
    name: 'API Credentials & Cloud Secrets',
    service: 'security',
    category: 'infrastructure',
    description: 'Server secrets (SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, GEMINI_API_KEY) must remain exclusively in server/Netlify env.',
    status: 'config_required',
    docsUrl: 'https://app.netlify.com',
    serviceAccountConfigured: false,
    geminiApiConfigured: false,
    keyRotationDays: 90,
    lastRotated: 'Verify in host env panel',
  },
  activityLogs: [
    {
      id: 'log-1',
      timestamp: 'Build configuration',
      service: 'Google Services Gating',
      event: 'GA4, GTM, and AdSense scripts are consent-gated and require explicit environment IDs to activate in production.',
      status: 'info',
    },
    {
      id: 'log-2',
      timestamp: 'Build configuration',
      service: 'ads.txt Publisher Record',
      event: 'Static /ads.txt deployed for publisher ID pub-7571394117486446 (DIRECT, f08c47fec0942fa0).',
      status: 'info',
    },
    {
      id: 'log-3',
      timestamp: 'Build configuration',
      service: 'XML Sitemap & Robots',
      event: 'Static /sitemap.xml and /robots.txt prepared for Search Console submission after Netlify deploy.',
      status: 'info',
    },
  ],
  updatedAt: new Date().toISOString(),
};

/**
 * Retrieve Integration Stack settings from persistent storage
 */
export function getIntegrationStackSettings(): IntegrationStackSettings {
  try {
    const raw = localStorage.getItem(INTEGRATION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_INTEGRATION_STACK,
        ...parsed,
        googleSearchConsole: { ...DEFAULT_INTEGRATION_STACK.googleSearchConsole, ...(parsed.googleSearchConsole || {}) },
        googleAnalytics4: { ...DEFAULT_INTEGRATION_STACK.googleAnalytics4, ...(parsed.googleAnalytics4 || {}) },
        googleTagManager: { ...DEFAULT_INTEGRATION_STACK.googleTagManager, ...(parsed.googleTagManager || {}) },
        bingWebmaster: { ...DEFAULT_INTEGRATION_STACK.bingWebmaster, ...(parsed.bingWebmaster || {}) },
        cloudflare: { ...DEFAULT_INTEGRATION_STACK.cloudflare, ...(parsed.cloudflare || {}) },
        pageSpeed: { ...DEFAULT_INTEGRATION_STACK.pageSpeed, ...(parsed.pageSpeed || {}) },
        richResults: { ...DEFAULT_INTEGRATION_STACK.richResults, ...(parsed.richResults || {}) },
        googleAdManager: { ...DEFAULT_INTEGRATION_STACK.googleAdManager, ...(parsed.googleAdManager || {}) },
        googleAdMob: { ...DEFAULT_INTEGRATION_STACK.googleAdMob, ...(parsed.googleAdMob || {}) },
        apiCredentials: { ...DEFAULT_INTEGRATION_STACK.apiCredentials, ...(parsed.apiCredentials || {}) },
        activityLogs: Array.isArray(parsed.activityLogs) && parsed.activityLogs.length > 0 
          ? parsed.activityLogs 
          : DEFAULT_INTEGRATION_STACK.activityLogs,
      };
    }
  } catch (e) {
    console.warn('Could not read Integration Stack settings from localStorage', e);
  }
  return DEFAULT_INTEGRATION_STACK;
}

/**
 * Persist Integration Stack settings
 */
export function saveIntegrationStackSettings(settings: IntegrationStackSettings) {
  try {
    const updated = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(INTEGRATION_STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(INTEGRATIONS_UPDATE_EVENT, { detail: updated }));
    }
  } catch (e) {
    console.warn('Could not save Integration Stack settings to localStorage', e);
  }
}

/**
 * Reset Integration Stack to certified defaults
 */
export function resetIntegrationStackSettings(): IntegrationStackSettings {
  saveIntegrationStackSettings(DEFAULT_INTEGRATION_STACK);
  return DEFAULT_INTEGRATION_STACK;
}
