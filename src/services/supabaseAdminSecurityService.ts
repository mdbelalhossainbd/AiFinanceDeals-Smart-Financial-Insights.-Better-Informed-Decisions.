// ==============================================================================
// AI FINANCE DEALS — SUPABASE RLS & ADMIN INFRASTRUCTURE SECURITY SERVICE
// Enforces Administrator-only access to `admin_profiles` and
// `api_connection_metadata` in alignment with Supabase PostgreSQL RLS policies.
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../integrations/supabase/client';
import { UserRole } from '../types';

export interface AdminProfileRecord {
  id: string;
  email: string;
  full_name: string;
  role: 'Administrator' | 'Managing Editor' | 'administrator' | 'editor';
  department: string;
  mfa_enabled: boolean;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiConnectionMetadataRecord {
  id: string;
  service_key: string;
  service_name: string;
  category: 'google' | 'analytics_seo' | 'monetization' | 'infrastructure' | 'testing' | 'ai';
  environment: 'development' | 'staging' | 'production';
  endpoint_url?: string | null;
  auth_method: 'oauth2' | 'service_account' | 'api_key' | 'dns_txt' | 'html_meta' | 'env_secret';
  key_prefix?: string | null;
  secret_env_ref: string;
  verification_status: 'connected' | 'pending' | 'disconnected' | 'config_required' | 'error';
  rotation_interval_days: number;
  last_rotated_at?: string | null;
  last_verified_at?: string | null;
  metadata?: Record<string, unknown>;
  updated_at: string;
}

export interface RlsQueryResult<T> {
  data: T[];
  source: 'supabase_rls' | 'rls_blocked' | 'unconfigured';
  error?: string;
}

export const supabaseAdminSecurityService = {
  /**
   * Retrieve `admin_profiles` strictly for Administrator role.
   * Managing Editors and non-admins are blocked both by defense-in-depth
   * and by PostgreSQL RLS (`public.is_administrator()`).
   */
  async fetchAdminProfiles(userRole?: UserRole): Promise<RlsQueryResult<AdminProfileRecord>> {
    if (userRole !== 'administrator') {
      return {
        data: [],
        source: 'rls_blocked',
        error: 'Access denied: Supabase RLS restricts admin_profiles strictly to the Administrator role.',
      };
    }

    if (!isSupabaseConfigured || !supabase) {
      return {
        data: [],
        source: 'unconfigured',
        error: 'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not configured.',
      };
    }

    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('id, email, full_name, role, department, mfa_enabled, is_active, last_login_at, created_at, updated_at')
        .order('created_at', { ascending: true });

      if (error) {
        return {
          data: [],
          source: error.code === '42501' ? 'rls_blocked' : 'supabase_rls',
          error: error.message,
        };
      }

      return {
        data: (data || []) as AdminProfileRecord[],
        source: 'supabase_rls',
      };
    } catch (err: any) {
      return {
        data: [],
        source: 'supabase_rls',
        error: err?.message || 'Failed querying admin_profiles.',
      };
    }
  },

  /**
   * Retrieve `api_connection_metadata` strictly for Administrator role.
   * Prevents Managing Editors from viewing sensitive API connection metadata,
   * endpoint references, or key prefixes.
   */
  async fetchApiConnectionMetadata(userRole?: UserRole): Promise<RlsQueryResult<ApiConnectionMetadataRecord>> {
    if (userRole !== 'administrator') {
      return {
        data: [],
        source: 'rls_blocked',
        error: 'Access denied: Supabase RLS restricts api_connection_metadata strictly to the Administrator role.',
      };
    }

    if (!isSupabaseConfigured || !supabase) {
      return {
        data: [],
        source: 'unconfigured',
        error: 'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not configured.',
      };
    }

    try {
      const { data, error } = await supabase
        .from('api_connection_metadata')
        .select('id, service_key, service_name, category, environment, endpoint_url, auth_method, key_prefix, secret_env_ref, verification_status, rotation_interval_days, last_rotated_at, last_verified_at, metadata, updated_at')
        .order('service_name', { ascending: true });

      if (error) {
        return {
          data: [],
          source: error.code === '42501' ? 'rls_blocked' : 'supabase_rls',
          error: error.message,
        };
      }

      return {
        data: (data || []) as ApiConnectionMetadataRecord[],
        source: 'supabase_rls',
      };
    } catch (err: any) {
      return {
        data: [],
        source: 'supabase_rls',
        error: err?.message || 'Failed querying api_connection_metadata.',
      };
    }
  },

  /**
   * Update verification metadata in `api_connection_metadata` (Administrator only)
   */
  async updateApiConnectionStatus(
    userRole: UserRole | undefined,
    serviceKey: string,
    verificationStatus: ApiConnectionMetadataRecord['verification_status']
  ): Promise<{ success: boolean; error?: string }> {
    if (userRole !== 'administrator') {
      return {
        success: false,
        error: '42501 RLS Violation: Managing Editors cannot modify api_connection_metadata.',
      };
    }

    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Supabase client is not configured.',
      };
    }

    try {
      const { error } = await supabase
        .from('api_connection_metadata')
        .update({
          verification_status: verificationStatus,
          last_verified_at: new Date().toISOString(),
        })
        .eq('service_key', serviceKey);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Update failed.' };
    }
  },
};
