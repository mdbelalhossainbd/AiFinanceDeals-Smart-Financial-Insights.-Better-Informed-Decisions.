import { createClient } from '@supabase/supabase-js';

const normalizeSupabaseUrl = (rawUrl: string): string => {
  const trimmed = rawUrl.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname === 'supabase.com' || parsed.hostname === 'app.supabase.com') {
      const match = parsed.pathname.match(/^\/(?:dashboard\/)?project\/([a-z0-9]{10,40})/i);
      if (match?.[1]) {
        return `https://${match[1].toLowerCase()}.supabase.co`;
      }
    }
    return trimmed;
  } catch {
    return trimmed;
  }
};

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const isHttp = parsed.protocol === 'https:' || parsed.protocol === 'http:';
    const isDashboardHtmlPage =
      parsed.hostname === 'supabase.com' || parsed.hostname === 'app.supabase.com';
    return isHttp && !isDashboardHtmlPage;
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  isValidUrl(supabaseUrl) &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('example.com')
);

// If valid keys are provided, initialize client; otherwise fallback to local persistence
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);
