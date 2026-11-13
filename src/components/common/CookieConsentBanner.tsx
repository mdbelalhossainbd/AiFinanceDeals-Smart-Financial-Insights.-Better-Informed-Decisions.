import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck } from 'lucide-react';

export type CookieConsentLevel = 'unset' | 'essential_only' | 'all';

export const COOKIE_CONSENT_STORAGE_KEY = 'aifinancedeals_cookie_consent';
export const COOKIE_CONSENT_EVENT = 'aifinancedeals_cookie_consent_updated';
export const OPEN_COOKIE_PREFS_EVENT = 'aifinancedeals_open_cookie_prefs';

export function getCookieConsent(): CookieConsentLevel {
  try {
    const val = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (val === 'essential_only' || val === 'all') {
      return val;
    }
  } catch {
    // Ignore storage read errors
  }
  return 'unset';
}

export function setCookieConsent(level: 'essential_only' | 'all') {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, level);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: level }));
    }
  } catch {
    // Ignore storage write errors
  }
}

export function openCookiePreferences() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFS_EVENT));
  }
}

export const CookieConsentBanner: React.FC = () => {
  const [consent, setConsent] = useState<CookieConsentLevel>(() => getCookieConsent());
  const [forceOpen, setForceOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setForceOpen(true);
    window.addEventListener(OPEN_COOKIE_PREFS_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFS_EVENT, handleOpen);
  }, []);

  const handleChoose = (level: 'essential_only' | 'all') => {
    setCookieConsent(level);
    setConsent(level);
    setForceOpen(false);
  };

  if (consent !== 'unset' && !forceOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie and Privacy Preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-50 bg-white border border-[#CBD5E1] rounded-2xl shadow-xl p-4 sm:p-5 text-xs text-[#303846]"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#F5F8FC] text-[#163A5F] flex items-center justify-center shrink-0 mt-0.5">
          <Cookie className="w-4 h-4 text-[#00B894]" />
        </div>
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading font-bold text-sm text-[#0D1F3C]">
              Privacy & Cookie Preferences
            </h2>
            {consent !== 'unset' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#00B894] font-semibold">
                <ShieldCheck className="w-3 h-3" />
                {consent === 'all' ? 'All Accepted' : 'Essential Only'}
              </span>
            )}
          </div>
          <p className="text-[#4B5563] leading-relaxed">
            AI Finance Deals uses strictly necessary browser storage for core navigation and preferences. Optional analytics and contextual advertising scripts are only loaded when enabled and permitted. Read our{' '}
            <Link to="/cookie-policy/" className="text-[#163A5F] font-semibold hover:underline">
              Cookie Policy
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy/" className="text-[#163A5F] font-semibold hover:underline">
              Privacy Policy
            </Link>.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleChoose('essential_only')}
              className="px-3.5 py-2 bg-[#F5F8FC] hover:bg-[#E2E8F0] text-[#0D1F3C] font-semibold rounded-lg border border-[#CBD5E1] transition-colors cursor-pointer"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={() => handleChoose('all')}
              className="px-4 py-2 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Accept Analytics & Ads
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
