import React, { useEffect, useState } from 'react';
import {
  COOKIE_CONSENT_EVENT,
  CookieConsentLevel,
  getCookieConsent,
} from '../common/CookieConsentBanner';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const isRealGaId = (id?: string) =>
  Boolean(id && /^G-[A-Z0-9]{6,}$/i.test(id.trim()) && !id.includes('XXXX') && !id.includes('MEASUREMENT'));

const isRealGtmId = (id?: string) =>
  Boolean(id && /^GTM-[A-Z0-9]{4,}$/i.test(id.trim()) && !id.includes('XXXX'));

export const GoogleServicesScript: React.FC = () => {
  const [consent, setConsent] = useState<CookieConsentLevel>(() => getCookieConsent());

  useEffect(() => {
    const handleConsentChange = (e: Event) => {
      const detail = (e as CustomEvent<CookieConsentLevel>).detail;
      setConsent(detail || getCookieConsent());
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
  }, []);

  // Google Search Console verification meta tag (only mounted if env var is set)
  useEffect(() => {
    const gscToken = (import.meta.env.VITE_GSC_VERIFICATION || '').trim();
    if (!gscToken) return;

    let meta = document.querySelector('meta[name="google-site-verification"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'google-site-verification';
      document.head.appendChild(meta);
    }
    meta.content = gscToken.replace(/^google-site-verification=/i, '');
  }, []);

  // Google Analytics 4 & Google Tag Manager (only mounted when real env ID is provided AND user accepts optional cookies)
  useEffect(() => {
    if (consent !== 'all') return;

    const gaId = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
    if (isRealGaId(gaId) && !document.getElementById('afd-ga4-script')) {
      const script = document.createElement('script');
      script.id = 'afd-ga4-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaId, { anonymize_ip: true });
    }

    const gtmId = (import.meta.env.VITE_GTM_ID || '').trim();
    if (isRealGtmId(gtmId) && !document.getElementById('afd-gtm-script')) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const gtmScript = document.createElement('script');
      gtmScript.id = 'afd-gtm-script';
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      document.head.appendChild(gtmScript);
    }
  }, [consent]);

  return null;
};
