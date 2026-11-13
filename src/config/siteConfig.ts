// ==============================================================================
// AI FINANCE DEALS — PUBLIC SITE CONFIGURATION
// Reads public VITE_* variables safely with production domain defaults.
// Never place secret credentials or server-only tokens in this file.
// ==============================================================================

const rawSiteUrl = (import.meta.env.VITE_SITE_URL || 'https://aifinancedeals.com').trim();

export const SITE_URL = rawSiteUrl.replace(/\/+$/, '') || 'https://aifinancedeals.com';
