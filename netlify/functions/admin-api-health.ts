// ==============================================================================
// AI FINANCE DEALS — TRUSTED SERVER-SIDE NETLIFY FUNCTION
// Endpoint: /.netlify/functions/admin-api-health
//
// SECURITY ARCHITECTURE:
// - Executes strictly in trusted server-side Netlify Function runtime.
// - Accesses SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, and GEMINI_API_KEY
//   from server-side environment variables only (NEVER VITE_*).
// - Verifies caller's Supabase JWT and confirms active Administrator role in
//   `public.admin_profiles` before returning non-secret health status.
// - Never logs or returns secret values.
// ==============================================================================

import { createClient } from '@supabase/supabase-js';

declare const process: {
  env: Record<string, string | undefined>;
};

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

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

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: JSON_HEADERS,
    });
  }

  const supabaseUrl = normalizeSupabaseUrl(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
  );
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const databaseUrlConfigured = Boolean((process.env.DATABASE_URL || '').trim());
  const geminiApiConfigured = Boolean((process.env.GEMINI_API_KEY || '').trim());

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({
        error: 'Server environment is missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.',
        supabaseServiceRoleConfigured: Boolean(serviceRoleKey),
        databaseUrlConfigured,
        geminiApiConfigured,
      }),
      { status: 503, headers: JSON_HEADERS }
    );
  }

  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Missing Authorization Bearer token.' }),
      { status: 401, headers: JSON_HEADERS }
    );
  }

  try {
    // Trusted server-side admin client — never exposed to browser bundles
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: userData, error: userError } = await adminClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired Supabase session token.' }),
        { status: 401, headers: JSON_HEADERS }
      );
    }

    // Verify caller holds an active Administrator profile
    const { data: profile, error: profileError } = await adminClient
      .from('admin_profiles')
      .select('id, role, is_active')
      .eq('id', userData.user.id)
      .maybeSingle();

    const appRole = String(userData.user.app_metadata?.role || '').toLowerCase();
    const isProfileAdmin = Boolean(
      !profileError && profile && profile.is_active && profile.role === 'Administrator'
    );

    if (!isProfileAdmin && appRole !== 'administrator') {
      return new Response(
        JSON.stringify({
          error: 'Forbidden: Only active Administrator accounts may query server infrastructure health.',
        }),
        { status: 403, headers: JSON_HEADERS }
      );
    }

    const { count: adminCount } = await adminClient
      .from('admin_profiles')
      .select('id', { count: 'exact', head: true });

    const { count: apiConnectionsCount } = await adminClient
      .from('api_connection_metadata')
      .select('id', { count: 'exact', head: true });

    return new Response(
      JSON.stringify({
        status: 'ok',
        runtime: 'netlify-function-server',
        supabaseServiceRoleConfigured: true,
        databaseUrlConfigured,
        geminiApiConfigured,
        adminProfilesCount: adminCount ?? 0,
        apiConnectionsCount: apiConnectionsCount ?? 0,
        checkedAt: new Date().toISOString(),
      }),
      { status: 200, headers: JSON_HEADERS }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed executing server-side infrastructure verification.' }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
}
