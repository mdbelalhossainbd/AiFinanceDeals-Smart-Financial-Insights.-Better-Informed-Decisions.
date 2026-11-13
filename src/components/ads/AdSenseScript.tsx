import React, { useEffect, useState } from 'react';
import {
  getAdSenseConfig,
  ADSENSE_UPDATE_EVENT,
  AdSenseGlobalConfig,
  isAdSenseEnvAuthorized,
} from '../../config/adsenseConfig';
import {
  COOKIE_CONSENT_EVENT,
  CookieConsentLevel,
  getCookieConsent,
} from '../common/CookieConsentBanner';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSenseScriptProps {
  publisherId?: string;
}

export const AdSenseScript: React.FC<AdSenseScriptProps> = ({ publisherId }) => {
  const [config, setConfig] = useState<AdSenseGlobalConfig>(getAdSenseConfig());
  const [consent, setConsent] = useState<CookieConsentLevel>(() => getCookieConsent());

  useEffect(() => {
    const handleConfigUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AdSenseGlobalConfig>;
      setConfig(customEvent.detail || getAdSenseConfig());
    };
    const handleConsentUpdate = (e: Event) => {
      const detail = (e as CustomEvent<CookieConsentLevel>).detail;
      setConsent(detail || getCookieConsent());
    };

    window.addEventListener(ADSENSE_UPDATE_EVENT, handleConfigUpdate);
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentUpdate);
    return () => {
      window.removeEventListener(ADSENSE_UPDATE_EVENT, handleConfigUpdate);
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentUpdate);
    };
  }, []);

  const activePublisherId =
    publisherId ||
    import.meta.env.VITE_ADSENSE_CLIENT_ID ||
    config.publisherId ||
    'ca-pub-7571394117486446';

  const isAuthorized = config.globalEnabled && isAdSenseEnvAuthorized(config) && consent === 'all';
  const shouldAutoAdsRun =
    isAuthorized &&
    (config.advertisingMode === 'auto_only' || config.advertisingMode === 'hybrid') &&
    config.autoAdsEnabled &&
    config.autoAds.enabled;

  useEffect(() => {
    const scriptId = 'google-adsense-script';
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!isAuthorized) {
      if (existingScript) {
        existingScript.remove();
      }
      return;
    }

    if (!existingScript) {
      const scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${activePublisherId}`;
      scriptElement.async = true;
      scriptElement.crossOrigin = 'anonymous';

      if (shouldAutoAdsRun) {
        scriptElement.setAttribute('data-ad-client', activePublisherId);
      }

      document.head.appendChild(scriptElement);
    } else {
      if (shouldAutoAdsRun) {
        existingScript.setAttribute('data-ad-client', activePublisherId);
      } else {
        existingScript.removeAttribute('data-ad-client');
      }
    }
  }, [activePublisherId, isAuthorized, shouldAutoAdsRun]);

  return null;
};
