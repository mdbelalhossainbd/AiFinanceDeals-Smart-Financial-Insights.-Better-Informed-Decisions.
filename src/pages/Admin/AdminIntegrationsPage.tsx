// ==============================================================================
// AI FINANCE DEALS — INTEGRATION STACK MANAGEMENT SYSTEM
// Protected Route: /admin/integrations
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  getIntegrationStackSettings, 
  saveIntegrationStackSettings, 
  resetIntegrationStackSettings,
  IntegrationStackSettings,
  IntegrationCategory,
  IntegrationStatus,
  IntegrationActivityLog
} from '../../config/integrationStackConfig';
import { getAdSenseConfig, isAdSenseEnvAuthorized } from '../../config/adsenseConfig';
import { isSupabaseConfigured } from '../../integrations/supabase/client';
import {
  supabaseAdminSecurityService,
  AdminProfileRecord,
  ApiConnectionMetadataRecord,
} from '../../services/supabaseAdminSecurityService';
import { 
  Network, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  XCircle, 
  ExternalLink, 
  Save, 
  RotateCcw, 
  ShieldCheck, 
  Lock, 
  BarChart3, 
  Activity, 
  Layers, 
  Globe, 
  Megaphone, 
  Zap, 
  Key, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  Server, 
  Smartphone, 
  Cpu, 
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const AdminIntegrationsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'administrator';

  const [settings, setSettings] = useState<IntegrationStackSettings>(getIntegrationStackSettings());
  const adsenseConfig = getAdSenseConfig();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | IntegrationCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | IntegrationStatus>('all');

  // Active configure modal state
  const [activeConfigModal, setActiveConfigModal] = useState<string | null>(null);

  // Notification banners
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [testNotice, setTestNotice] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Administrator-only RLS-protected Supabase tables
  const [adminProfiles, setAdminProfiles] = useState<AdminProfileRecord[]>([]);
  const [apiMetadata, setApiMetadata] = useState<ApiConnectionMetadataRecord[]>([]);
  const [rlsSourceStatus, setRlsSourceStatus] = useState<'supabase_rls' | 'rls_blocked' | 'unconfigured'>('unconfigured');
  const [rlsMessage, setRlsMessage] = useState<string>('');

  useEffect(() => {
    setSettings(getIntegrationStackSettings());
  }, []);

  useEffect(() => {
    let active = true;
    async function loadRlsProtectedTables() {
      const [profilesRes, apiMetaRes] = await Promise.all([
        supabaseAdminSecurityService.fetchAdminProfiles(user?.role),
        supabaseAdminSecurityService.fetchApiConnectionMetadata(user?.role),
      ]);
      if (!active) return;
      setAdminProfiles(profilesRes.data);
      setApiMetadata(apiMetaRes.data);
      setRlsSourceStatus(apiMetaRes.source);
      setRlsMessage(apiMetaRes.error || '');
    }
    loadRlsProtectedTables();
    return () => {
      active = false;
    };
  }, [user?.role]);

  const handleSave = () => {
    if (!isAdmin) return;
    saveIntegrationStackSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (!isAdmin) return;
    if (window.confirm('Reset all integrations to initial certified defaults?')) {
      const reset = resetIntegrationStackSettings();
      setSettings(reset);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestConnection = (serviceName: string) => {
    setTestNotice(`Checking local configuration for ${serviceName}...`);
    setTimeout(() => {
      setTestNotice(`Configuration audit complete for ${serviceName}. Live external verification requires deployment credentials.`);
      const newLog: IntegrationActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        service: serviceName,
        event: `Local configuration check triggered by ${user?.fullName || 'Administrator'}.`,
        status: 'info',
      };
      setSettings((prev) => ({
        ...prev,
        activityLogs: [newLog, ...prev.activityLogs],
      }));
      setTimeout(() => setTestNotice(null), 4000);
    }, 500);
  };

  // Build the list of integration items
  const integrationItems = useMemo(() => {
    const adsenseAuthorized = isAdSenseEnvAuthorized(adsenseConfig);
    return [
      {
        id: 'gsc',
        name: settings.googleSearchConsole.name,
        service: 'Google',
        category: 'google' as IntegrationCategory,
        description: settings.googleSearchConsole.description,
        status: settings.googleSearchConsole.status,
        docsUrl: settings.googleSearchConsole.docsUrl,
        badge: settings.googleSearchConsole.verificationToken ? 'Verification Meta Set' : 'Awaiting VITE_GSC_VERIFICATION',
        lastChecked: settings.googleSearchConsole.lastChecked,
      },
      {
        id: 'ga4',
        name: settings.googleAnalytics4.name,
        service: 'Google',
        category: 'analytics_seo' as IntegrationCategory,
        description: settings.googleAnalytics4.description,
        status: settings.googleAnalytics4.status,
        docsUrl: settings.googleAnalytics4.docsUrl,
        badge: settings.googleAnalytics4.measurementId ? `ID: ${settings.googleAnalytics4.measurementId}` : 'Awaiting VITE_GA_MEASUREMENT_ID',
        lastChecked: settings.googleAnalytics4.lastChecked,
      },
      {
        id: 'gtm',
        name: settings.googleTagManager.name,
        service: 'Google',
        category: 'google' as IntegrationCategory,
        description: settings.googleTagManager.description,
        status: settings.googleTagManager.status,
        docsUrl: settings.googleTagManager.docsUrl,
        badge: settings.googleTagManager.containerId ? `Container: ${settings.googleTagManager.containerId}` : 'Awaiting VITE_GTM_ID',
        lastChecked: settings.googleTagManager.lastChecked,
      },
      {
        id: 'adsense',
        name: 'Google AdSense (Consent & Env Gated)',
        service: 'Google',
        category: 'monetization' as IntegrationCategory,
        description: 'Requires VITE_ADSENSE_ENABLED="true" plus user cookie consent to load external adsbygoogle.js.',
        status: (adsenseAuthorized ? 'connected' : 'config_required') as IntegrationStatus,
        docsUrl: '/admin/adsense',
        badge: `Publisher: ${adsenseConfig.publisherId}`,
        lastChecked: adsenseAuthorized ? 'Enabled via VITE_ADSENSE_ENABLED' : 'Gated pre-approval',
        isInternalLink: true,
      },
      {
        id: 'adstxt',
        name: 'Google Publisher ads.txt',
        service: 'Google',
        category: 'monetization' as IntegrationCategory,
        description: 'Static publisher record served at /ads.txt in public root for domain ownership verification.',
        status: 'connected' as IntegrationStatus,
        docsUrl: '/ads.txt',
        badge: 'pub-7571394117486446 DIRECT',
        lastChecked: 'Static file /ads.txt ready',
      },
      {
        id: 'bing',
        name: settings.bingWebmaster.name,
        service: 'Microsoft',
        category: 'analytics_seo' as IntegrationCategory,
        description: settings.bingWebmaster.description,
        status: settings.bingWebmaster.status,
        docsUrl: settings.bingWebmaster.docsUrl,
        badge: settings.bingWebmaster.verificationToken ? 'Verification Token Set' : 'Awaiting Webmaster Setup',
        lastChecked: settings.bingWebmaster.lastChecked,
      },
      {
        id: 'cloudflare',
        name: settings.cloudflare.name,
        service: 'Cloudflare',
        category: 'infrastructure' as IntegrationCategory,
        description: settings.cloudflare.description,
        status: settings.cloudflare.status,
        docsUrl: settings.cloudflare.docsUrl,
        badge: `SSL: ${settings.cloudflare.sslMode}`,
        lastChecked: settings.cloudflare.lastChecked,
      },
      {
        id: 'pagespeed',
        name: settings.pageSpeed.name,
        service: 'Google',
        category: 'testing' as IntegrationCategory,
        description: settings.pageSpeed.description,
        status: settings.pageSpeed.status,
        docsUrl: settings.pageSpeed.docsUrl,
        badge: settings.pageSpeed.mobileScore > 0
          ? `Mobile: ${settings.pageSpeed.mobileScore} / Desktop: ${settings.pageSpeed.desktopScore}`
          : 'Run live audit post-deploy',
        lastChecked: settings.pageSpeed.lastTestedAt,
      },
      {
        id: 'richresults',
        name: settings.richResults.name,
        service: 'Google',
        category: 'testing' as IntegrationCategory,
        description: settings.richResults.description,
        status: settings.richResults.status,
        docsUrl: settings.richResults.docsUrl,
        badge: 'JSON-LD Schemas Built In',
        lastChecked: settings.richResults.lastTestedAt,
      },
      {
        id: 'gam',
        name: settings.googleAdManager.name,
        service: 'Google',
        category: 'monetization' as IntegrationCategory,
        description: settings.googleAdManager.description,
        status: settings.googleAdManager.status,
        docsUrl: settings.googleAdManager.docsUrl,
        badge: settings.googleAdManager.networkCode ? `Network: ${settings.googleAdManager.networkCode}` : 'Not configured',
        lastChecked: settings.googleAdManager.lastChecked,
      },
      {
        id: 'admob',
        name: settings.googleAdMob.name,
        service: 'Google',
        category: 'monetization' as IntegrationCategory,
        description: settings.googleAdMob.description,
        status: settings.googleAdMob.status,
        docsUrl: settings.googleAdMob.docsUrl,
        badge: 'Web App Only (Optional)',
        lastChecked: settings.googleAdMob.lastChecked,
      },
      {
        id: 'apicreds',
        name: settings.apiCredentials.name,
        service: 'Security',
        category: 'infrastructure' as IntegrationCategory,
        description: settings.apiCredentials.description,
        status: settings.apiCredentials.status,
        docsUrl: settings.apiCredentials.docsUrl,
        badge: 'Server Env Isolated',
        lastChecked: settings.apiCredentials.lastRotated,
      },
    ];
  }, [settings, adsenseConfig]);

  // Sensitive infrastructure integrations restricted strictly to Administrators
  const SENSITIVE_ADMIN_ONLY_IDS = new Set(['apicreds', 'cloudflare']);

  // Filter integrations (Managing Editors cannot inspect sensitive infrastructure data)
  const filteredIntegrations = useMemo(() => {
    return integrationItems.filter((item) => {
      if (!isAdmin && SENSITIVE_ADMIN_ONLY_IDS.has(item.id)) {
        return false;
      }
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.badge.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [integrationItems, searchQuery, selectedCategory, selectedStatus, isAdmin]);

  // Counters
  const totalCount = integrationItems.length;
  const connectedCount = integrationItems.filter((i) => i.status === 'connected').length;
  const pendingCount = integrationItems.filter((i) => i.status === 'pending' || i.status === 'config_required').length;
  const disconnectedCount = integrationItems.filter((i) => i.status === 'disconnected').length;
  const errorCount = integrationItems.filter((i) => i.status === 'error').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#E6F8F4] text-[#00B894] font-mono text-[10px] font-bold rounded-full flex items-center gap-1">
                <Network className="w-3 h-3" />
                Infrastructure & API Pipeline
              </span>
              <span className="px-2.5 py-0.5 bg-blue-50 text-[#163A5F] font-mono text-[10px] font-semibold rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#00B894]" />
                Zero-Leakage Security Charter
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#0D1F3C] flex items-center gap-2.5">
              <span>Integration Stack Management System</span>
            </h1>
            <p className="text-xs text-[#6B7280] max-w-3xl">
              Centralized orchestration hub for Google Search Console, GA4, GTM, Google AdSense, Cloudflare CDN, Bing Webmaster Tools, and Core Web Vitals telemetry for AI Finance Deals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleReset}
              disabled={!isAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#475569] text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Reset to certified defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleSave}
              disabled={!isAdmin}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00B894] hover:bg-[#009b7c] text-[#0D1F3C] font-heading text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 bg-[#0D1F3C] hover:bg-[#163A5F] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <span>View /sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Notifications */}
        {saveSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Integration stack configuration successfully saved and persisted.</span>
          </div>
        )}
        {resetSuccess && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Integration configurations restored to certified baseline defaults.</span>
          </div>
        )}
        {testNotice && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-[#163A5F] text-xs rounded-xl flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#00C2E0] animate-spin shrink-0" />
            <span>{testNotice}</span>
          </div>
        )}

        {/* Managing Editor notice */}
        {!isAdmin && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Managing Editor view: API credentials and infrastructure settings are read-only. Administrator authentication required to edit.</span>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* SECTION 4: INTEGRATION OVERVIEW SUMMARY CARDS                         */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#6B7280]">Total Integrations</span>
          <div className="font-heading font-bold text-xl text-[#0D1F3C]">{totalCount} Services</div>
          <span className="text-[10px] text-[#64748B]">Configured modules</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-emerald-700">Configured & Active</span>
          <div className="font-heading font-bold text-xl text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{connectedCount}</span>
          </div>
          <span className="text-[10px] text-[#64748B]">Active env/static modules</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-amber-700">Needs Env / Manual Setup</span>
          <div className="font-heading font-bold text-xl text-amber-600 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>{pendingCount}</span>
          </div>
          <span className="text-[10px] text-[#64748B]">Awaiting external IDs</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-600">Disconnected</span>
          <div className="font-heading font-bold text-xl text-slate-700 flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            <span>{disconnectedCount}</span>
          </div>
          <span className="text-[10px] text-[#64748B]">Optional services</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-rose-700">Errors</span>
          <div className="font-heading font-bold text-xl text-rose-600 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" />
            <span>{errorCount}</span>
          </div>
          <span className="text-[10px] text-[#64748B]">Local status check</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search integrations by service, name, or credential..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] focus:ring-1 focus:ring-[#00B894] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="google">Google Services</option>
            <option value="analytics_seo">Analytics & SEO</option>
            <option value="monetization">Advertising & Monetization</option>
            <option value="infrastructure">Infrastructure & CDN</option>
            <option value="testing">Testing & Performance</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="connected">Connected</option>
            <option value="config_required">Config Required</option>
            <option value="pending">Pending</option>
            <option value="disconnected">Disconnected</option>
          </select>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header with status badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#0D1F3C]">
                    {item.service === 'Google' && <span className="text-[#00B894] font-heading font-extrabold">G</span>}
                    {item.service === 'Microsoft' && <span className="text-[#00C2E0] font-heading font-extrabold">M</span>}
                    {item.service === 'Cloudflare' && <span className="text-amber-600 font-heading font-extrabold">CF</span>}
                    {item.service === 'Security' && <Key className="w-4 h-4 text-[#163A5F]" />}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#0D1F3C] leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-mono text-[#6B7280]">{item.service} Ecosystem</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold shrink-0 ${
                    item.status === 'connected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'pending' || item.status === 'config_required'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.status.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed">
                {item.description}
              </p>

              <div className="pt-1">
                <span className="inline-block px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg font-mono text-[10px] text-[#163A5F] max-w-full truncate select-all">
                  {item.badge}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-[#94A3B8] truncate max-w-[130px]">
                {item.lastChecked}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleTestConnection(item.name)}
                  className="p-1.5 text-slate-500 hover:text-[#0D1F3C] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  title="Test Connection"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {item.isInternalLink ? (
                  <Link
                    to={item.docsUrl}
                    className="px-2.5 py-1 bg-[#0D1F3C] hover:bg-[#163A5F] text-white rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Manage</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : isAdmin ? (
                  <button
                    type="button"
                    onClick={() => setActiveConfigModal(item.id)}
                    className="px-2.5 py-1 bg-[#00B894] hover:bg-[#009b7c] text-[#0D1F3C] rounded-md text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Configure
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-[11px] font-semibold">
                    <Lock className="w-3 h-3" />
                    <span>View Only</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* SUPABASE RLS GOVERNANCE: admin_profiles & api_connection_metadata     */}
      {/* ==================================================================== */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-bold text-sm text-[#0D1F3C] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00B894]" />
              <span>Supabase Row Level Security (RLS): Admin & Infrastructure Tables</span>
            </h3>
            <p className="text-xs text-[#6B7280]">
              Access to <code className="font-mono text-[#163A5F]">public.admin_profiles</code> and <code className="font-mono text-[#163A5F]">public.api_connection_metadata</code> is enforced at the database layer via <code className="font-mono text-[#163A5F]">public.is_administrator()</code>.
            </p>
          </div>
          <span
            className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold self-start sm:self-center ${
              !isAdmin
                ? 'bg-rose-100 text-rose-800'
                : rlsSourceStatus === 'supabase_rls'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {!isAdmin
              ? 'RESTRICTED (MANAGING EDITOR)'
              : rlsSourceStatus === 'supabase_rls'
              ? 'SUPABASE RLS LIVE'
              : 'MIGRATION READY'}
          </span>
        </div>

        {!isAdmin ? (
          <div className="p-6 bg-slate-50/70 flex items-start gap-3 text-xs">
            <Lock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#0D1F3C] block">
                Sensitive Infrastructure Data Hidden by Row Level Security
              </span>
              <p className="text-[#475569] leading-relaxed">
                Your current session holds the <strong>Managing Editor</strong> role. Supabase PostgreSQL RLS policies strictly deny <code className="font-mono">SELECT</code>, <code className="font-mono">INSERT</code>, <code className="font-mono">UPDATE</code>, and <code className="font-mono">DELETE</code> on <code className="font-mono">admin_profiles</code> and <code className="font-mono">api_connection_metadata</code> for non-Administrator accounts.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0D1F3C]">public.admin_profiles</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    FORCE RLS · ADMIN ONLY
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  {isSupabaseConfigured
                    ? `Live query returned ${adminProfiles.length} authorized administrator/staff records.`
                    : rlsMessage || 'Configure VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to inspect live rows.'}
                </p>
              </div>

              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0D1F3C]">public.api_connection_metadata</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    FORCE RLS · ADMIN ONLY
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  {isSupabaseConfigured
                    ? `Live query returned ${apiMetadata.length} infrastructure metadata records.`
                    : rlsMessage || 'Migration 002_admin_rls_security.sql defines strict Administrator-only policies.'}
                </p>
              </div>
            </div>

            {apiMetadata.length > 0 && (
              <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#6B7280]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Service Key</th>
                      <th className="py-2.5 px-3 font-semibold">Secret Env Reference</th>
                      <th className="py-2.5 px-3 font-semibold">Auth Method</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {apiMetadata.map((row) => (
                      <tr key={row.id}>
                        <td className="py-2.5 px-3 font-mono font-semibold text-[#0D1F3C]">{row.service_key}</td>
                        <td className="py-2.5 px-3 font-mono text-[#163A5F]">{row.secret_env_ref}</td>
                        <td className="py-2.5 px-3 font-mono text-[#475569]">{row.auth_method}</td>
                        <td className="py-2.5 px-3 font-mono uppercase font-bold text-[#00B894]">{row.verification_status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* SECTION N: INTEGRATION HEALTH & ACTIVITY LOGS                         */}
      {/* ==================================================================== */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#FAFAFA] flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-sm text-[#0D1F3C] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00B894]" />
              <span>Integration Health & Activity Audit Log</span>
            </h3>
            <p className="text-xs text-[#6B7280]">
              Automated record of crawler checks, sitemap synchronization, and protocol handshakes.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
            Zero Failures
          </span>
        </div>

        <div className="divide-y divide-[#F1F5F9] text-xs">
          {settings.activityLogs.map((log) => (
            <div key={log.id} className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0D1F3C]">{log.service}</span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">({log.timestamp})</span>
                </div>
                <p className="text-[#475569]">{log.event}</p>
              </div>

              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 self-start sm:self-center ${
                log.status === 'success' ? 'bg-emerald-50 text-emerald-700' :
                log.status === 'warning' ? 'bg-amber-50 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {log.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODAL: INDIVIDUAL INTEGRATION CONFIGURATION                          */}
      {/* ==================================================================== */}
      {activeConfigModal && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-[#00B894]" />
                <h3 className="font-heading font-bold text-base text-[#0D1F3C]">
                  Configure {integrationItems.find((i) => i.id === activeConfigModal)?.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveConfigModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Based on Modal ID */}
            {activeConfigModal === 'gsc' && (
              <div className="space-y-3">
                <p className="text-[#6B7280]">
                  Configure verification tokens for Google Search Console to monitor search impression analytics and index coverage.
                </p>
                <div>
                  <label className="block font-medium text-[#303846] mb-1">Site Verification Token</label>
                  <input
                    type="text"
                    value={settings.googleSearchConsole.verificationToken}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        googleSearchConsole: { ...prev.googleSearchConsole, verificationToken: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg font-mono text-[11px] text-[#163A5F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#303846] mb-1">Sitemap Index URL</label>
                  <input
                    type="text"
                    value={settings.googleSearchConsole.sitemapUrl}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        googleSearchConsole: { ...prev.googleSearchConsole, sitemapUrl: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg font-mono text-[11px] text-[#163A5F] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeConfigModal === 'ga4' && (
              <div className="space-y-3">
                <p className="text-[#6B7280]">
                  Google Analytics 4 collects privacy-first telemetry on reader interaction with financial guides and comparisons.
                </p>
                <div>
                  <label className="block font-medium text-[#303846] mb-1">GA4 Measurement ID</label>
                  <input
                    type="text"
                    value={settings.googleAnalytics4.measurementId}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        googleAnalytics4: { ...prev.googleAnalytics4, measurementId: e.target.value },
                      }))
                    }
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg font-mono text-[11px] text-[#163A5F] focus:outline-none"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={settings.googleAnalytics4.enhancedMeasurement}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        googleAnalytics4: { ...prev.googleAnalytics4, enhancedMeasurement: e.target.checked },
                      }))
                    }
                    className="accent-[#00B894] w-4 h-4"
                  />
                  <span>Enable Enhanced Measurement (Scroll depth, affiliate clicks, site search)</span>
                </label>
              </div>
            )}

            {activeConfigModal === 'gtm' && (
              <div className="space-y-3">
                <p className="text-[#6B7280]">
                  Google Tag Manager deploys web measurement tags in a unified container.
                </p>
                <div>
                  <label className="block font-medium text-[#303846] mb-1">GTM Container ID</label>
                  <input
                    type="text"
                    value={settings.googleTagManager.containerId}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        googleTagManager: { ...prev.googleTagManager, containerId: e.target.value },
                      }))
                    }
                    placeholder="GTM-XXXXXXX"
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg font-mono text-[11px] text-[#163A5F] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeConfigModal === 'bing' && (
              <div className="space-y-3">
                <p className="text-[#6B7280]">
                  Microsoft Bing Webmaster Tools & IndexNow protocol immediately notifies Bing and Yahoo when financial content updates.
                </p>
                <div>
                  <label className="block font-medium text-[#303846] mb-1">IndexNow API Key</label>
                  <input
                    type="text"
                    value={settings.bingWebmaster.indexNowApiKey}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        bingWebmaster: { ...prev.bingWebmaster, indexNowApiKey: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg font-mono text-[11px] text-[#163A5F] focus:outline-none"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={settings.bingWebmaster.indexNowEnabled}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        bingWebmaster: { ...prev.bingWebmaster, indexNowEnabled: e.target.checked },
                      }))
                    }
                    className="accent-[#00B894] w-4 h-4"
                  />
                  <span>Enable Instant IndexNow Broadcast on Article Publish</span>
                </label>
              </div>
            )}

            {activeConfigModal === 'cloudflare' && (
              <div className="space-y-3">
                <p className="text-[#6B7280]">
                  Cloudflare provides global edge caching, DDoS mitigation, and HTTP/3 acceleration.
                </p>
                <div>
                  <label className="block font-medium text-[#303846] mb-1">Cloudflare Zone ID</label>
                  <input
                    type="text"
                    value={settings.cloudflare.zoneId}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        cloudflare: { ...prev.cloudflare, zoneId: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg font-mono text-[11px] text-[#163A5F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#303846] mb-1">SSL / TLS Encryption Mode</label>
                  <select
                    value={settings.cloudflare.sslMode}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        cloudflare: { ...prev.cloudflare, sslMode: e.target.value as any },
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846] bg-white focus:outline-none"
                  >
                    <option value="Full (Strict)">Full (Strict) — Recommended for Financial Fiduciary</option>
                    <option value="Full">Full</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>
            )}

            {activeConfigModal === 'admob' && (
              <div className="space-y-3">
                <p className="text-[#6B7280]">
                  Google AdMob SDK credentials for the native iOS and Android application releases.
                </p>
                <div>
                  <label className="block font-medium text-[#303846] mb-1">AdMob App ID</label>
                  <input
                    type="text"
                    value={settings.googleAdMob.appId}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        googleAdMob: { ...prev.googleAdMob, appId: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg font-mono text-[11px] text-[#163A5F] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeConfigModal === 'gam' && (
              <div className="space-y-3">
                <p className="text-[#6B7280]">
                  Google Ad Manager (GAM 360) connects direct programmatic campaigns and header bidding.
                </p>
                <div>
                  <label className="block font-medium text-[#303846] mb-1">Network Code</label>
                  <input
                    type="text"
                    value={settings.googleAdManager.networkCode}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        googleAdManager: { ...prev.googleAdManager, networkCode: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg font-mono text-[11px] text-[#163A5F] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeConfigModal === 'apicreds' && isAdmin && (
              <div className="space-y-3">
                <p className="text-[#6B7280]">
                  Backend API secret keys must be stored exclusively in server/deployment environment variables (never exposed in the browser) and indexed via Supabase RLS (<code className="font-mono">api_connection_metadata</code>).
                </p>
                <div className="p-3 bg-slate-100 rounded-xl space-y-1 font-mono text-[11px] text-[#303846]">
                  <div>SUPABASE_SERVICE_ROLE_KEY: <span className="text-[#163A5F] font-bold">Server / Backend Only (Never in VITE_*)</span></div>
                  <div>DATABASE_URL: <span className="text-[#163A5F] font-bold">Server / CLI Migrations Only</span></div>
                  <div>GEMINI_API_KEY: <span className="text-[#163A5F] font-bold">Server / Edge Function Env</span></div>
                  <div>ADSENSE_SERVICE_ACCOUNT_KEY: <span className="text-[#163A5F] font-bold">Server Secret (adsense.readonly)</span></div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#F1F5F9] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveConfigModal(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSave();
                  setActiveConfigModal(null);
                }}
                disabled={!isAdmin}
                className="px-4 py-1.5 bg-[#00B894] hover:bg-[#009b7c] text-[#0D1F3C] font-heading font-bold rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
