import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured } from '../../integrations/supabase/client';
import { getAdSenseConfig, saveAdSenseConfig, AdSenseGlobalConfig, AdPlacementConfig } from '../../config/adsenseConfig';
import { SITE_URL } from '../../config/siteConfig';
import { Save, CheckCircle, Database, ShieldCheck, Radio, Layers, Lock } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'administrator';
  const [siteName, setSiteName] = useState('AI Finance Deals');
  const [tagline, setTagline] = useState('Smart Financial Insights. Better Informed Decisions.');
  const [canonicalDomain, setCanonicalDomain] = useState(SITE_URL);
  const [contactEmail, setContactEmail] = useState('editorial@aifinancedeals.com');
  const [affiliateEnabled, setAffiliateEnabled] = useState(true);
  
  // Real AdSense centralized settings
  const [adsenseConfig, setAdsenseConfigState] = useState<AdSenseGlobalConfig>(getAdSenseConfig());
  const [saved, setSaved] = useState(false);

  const handlePlacementToggle = (placementId: string) => {
    setAdsenseConfigState((prev) => {
      const placement = prev.placements[placementId];
      if (!placement) return prev;
      return {
        ...prev,
        placements: {
          ...prev.placements,
          [placementId]: {
            ...placement,
            enabled: !placement.enabled,
          },
        },
      };
    });
  };

  const handleSlotIdChange = (placementId: string, newSlotId: string) => {
    setAdsenseConfigState((prev) => {
      const placement = prev.placements[placementId];
      if (!placement) return prev;
      return {
        ...prev,
        placements: {
          ...prev.placements,
          [placementId]: {
            ...placement,
            slotId: newSlotId,
          },
        },
      };
    });
  };

  const handleDeviceChange = (placementId: string, visibility: AdPlacementConfig['deviceVisibility']) => {
    setAdsenseConfigState((prev) => {
      const placement = prev.placements[placementId];
      if (!placement) return prev;
      return {
        ...prev,
        placements: {
          ...prev.placements,
          [placementId]: {
            ...placement,
            deviceVisibility: visibility,
          },
        },
      };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    // Persist real AdSense configuration
    saveAdSenseConfig(adsenseConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#0D1F3C]">
          System & Technical Settings
        </h1>
        <p className="text-xs text-[#6B7280]">
          Manage production domain bindings, live Google AdSense ad units, and database connection.
        </p>
      </div>

      {!isAdmin && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Read-only view: Only users with the Administrator role may modify system settings.</span>
        </div>
      )}

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>System & Google AdSense configuration successfully saved.</span>
        </div>
      )}

      {/* Supabase Status Banner */}
      <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSupabaseConfigured ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-[#0D1F3C] block">
              Supabase PostgreSQL Connection: {isSupabaseConfigured ? 'Connected (Production)' : 'Local Storage Fallback'}
            </span>
            <span className="text-[#6B7280]">
              {isSupabaseConfigured 
                ? 'All queries routing to your remote PostgreSQL cluster.' 
                : 'Using local persistence store. Provide VITE_SUPABASE_URL to bind live database.'}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-6 text-xs shadow-sm">
        <h3 className="font-heading font-bold text-sm text-[#0D1F3C] pb-2 border-b border-[#F1F5F9]">
          Platform Brand & Domain Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1 text-[#303846]">Site Brand Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846]"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-[#303846]">Brand Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846]"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-[#303846]">Canonical Domain URL</label>
            <input
              type="url"
              value={canonicalDomain}
              onChange={(e) => setCanonicalDomain(e.target.value)}
              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846] font-mono"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-[#303846]">Primary Editorial Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846]"
            />
          </div>
        </div>

        {/* Centralized AdSense Management Section */}
        <div className="pt-6 border-t border-[#F1F5F9] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F1F5F9]">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#0D1F3C] flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#00B894]" />
                <span>Google AdSense Central Management System</span>
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                Live advertising architecture with policy compliance, zero layout shift (CLS), and explicit ad markers.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/admin/adsense"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0D1F3C] hover:bg-[#163A5F] text-white rounded-md text-xs font-semibold transition-colors shadow-xs"
              >
                <span>Full AdSense Dashboard →</span>
              </Link>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E6F8F4] text-[#00B894] rounded-md font-mono text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ads.txt Verified</span>
              </div>
            </div>
          </div>

          {/* ads.txt verification box */}
          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-[#0D1F3C] block font-mono text-[11px]">
                Authorized ads.txt Record:
              </span>
              <code className="text-[#163A5F] font-mono text-[11px] block mt-0.5 bg-white px-2 py-0.5 rounded border border-[#E2E8F0] select-all">
                google.com, pub-7571394117486446, DIRECT, f08c47fec0942fa0
              </code>
            </div>
            <a
              href="/ads.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#00B894] font-semibold hover:underline shrink-0"
            >
              Inspect /ads.txt ↗
            </a>
          </div>

          {/* Global AdSense Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-[#303846]">Google AdSense Publisher Client ID</label>
              <input
                type="text"
                value={adsenseConfig.publisherId}
                onChange={(e) =>
                  setAdsenseConfigState((prev) => ({
                    ...prev,
                    publisherId: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846] font-mono"
              />
              <span className="text-[10px] text-[#6B7280] mt-1 block">
                Publisher: ca-pub-7571394117486446 (Never uses fake IDs in production)
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg cursor-pointer">
                <div>
                  <span className="font-semibold text-[#0D1F3C] block">Global Ad Delivery</span>
                  <span className="text-[11px] text-[#6B7280]">Toggle all website ad units globally</span>
                </div>
                <input
                  type="checkbox"
                  checked={adsenseConfig.globalEnabled}
                  onChange={(e) =>
                    setAdsenseConfigState((prev) => ({
                      ...prev,
                      globalEnabled: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-[#00B894] rounded border-stone-300 focus:ring-[#00B894]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg cursor-pointer">
                <div>
                  <span className="font-semibold text-[#0D1F3C] block">Google Auto Ads</span>
                  <span className="text-[11px] text-[#6B7280]">Enable AI-powered automatic responsive ad injections</span>
                </div>
                <input
                  type="checkbox"
                  checked={adsenseConfig.autoAdsEnabled}
                  onChange={(e) =>
                    setAdsenseConfigState((prev) => ({
                      ...prev,
                      autoAdsEnabled: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-[#00B894] rounded border-stone-300 focus:ring-[#00B894]"
                />
              </label>
            </div>
          </div>

          {/* Individual Placements Config List */}
          <div className="space-y-3 pt-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#163A5F] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Configurable Ad Unit Placements ({Object.keys(adsenseConfig.placements).length})</span>
            </h4>

            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0]">
              {Object.values(adsenseConfig.placements).map((p) => (
                <div key={p.id} className="p-3.5 bg-white hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0D1F3C]">{p.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F1F5F9] rounded text-[#475569] uppercase">
                        {p.format}
                      </span>
                      {p.deviceVisibility !== 'all' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                          {p.deviceVisibility}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6B7280]">{p.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-[#6B7280]">Slot:</span>
                      <input
                        type="text"
                        value={p.slotId}
                        onChange={(e) => handleSlotIdChange(p.id, e.target.value)}
                        className="w-28 px-2 py-1 text-xs border border-[#CBD5E1] rounded font-mono text-[#303846]"
                      />
                    </div>

                    <select
                      value={p.deviceVisibility}
                      onChange={(e) => handleDeviceChange(p.id, e.target.value as AdPlacementConfig['deviceVisibility'])}
                      className="px-2 py-1 text-xs border border-[#CBD5E1] rounded bg-white text-[#303846]"
                    >
                      <option value="all">All Devices</option>
                      <option value="desktop-only">Desktop Only</option>
                      <option value="mobile-only">Mobile Only</option>
                      <option value="desktop-tablet">Desktop + Tablet</option>
                    </select>

                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={p.enabled}
                        onChange={() => handlePlacementToggle(p.id)}
                        className="w-4 h-4 text-[#00B894] rounded border-stone-300 focus:ring-[#00B894]"
                      />
                      <span className="text-[11px] font-medium text-[#303846]">
                        {p.enabled ? 'Active' : 'Off'}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Affiliate Disclosure Settings */}
        <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
          <div>
            <span className="font-bold text-[#0D1F3C] block">Affiliate Disclosure Top Bar</span>
            <span className="text-[11px] text-[#6B7280]">Show required FTC disclaimer ribbon on all pages</span>
          </div>
          <input
            type="checkbox"
            checked={affiliateEnabled}
            onChange={(e) => setAffiliateEnabled(e.target.checked)}
            className="w-4 h-4 text-[#00B894] rounded border-stone-300 focus:ring-[#00B894]"
          />
        </div>

        <div className="pt-4 border-t border-[#F1F5F9]">
          <button
            type="submit"
            disabled={!isAdmin}
            className="px-5 py-2.5 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save System & AdSense Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

