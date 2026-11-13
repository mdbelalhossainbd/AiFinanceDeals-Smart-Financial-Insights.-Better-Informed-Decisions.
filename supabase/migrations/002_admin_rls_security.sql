-- ============================================================================
-- AI FINANCE DEALS — SUPABASE RLS HARDENING & ADMIN/INFRASTRUCTURE SECURITY
-- Migration ID: 002_admin_rls_security (Security-Hardened Revision)
-- Requires: 001_initial_schema.sql
-- Purpose:
--   1. Create `public.admin_profiles` and `public.api_connection_metadata`
--   2. Implement SECURITY DEFINER role verification helpers with locked
--      `search_path = public, pg_temp` and strict EXECUTE grants
--   3. Eliminate recursive RLS policy lookups on `public.profiles` via
--      `public.get_my_profile_role()`
--   4. Default `get_my_cms_role()` fallback to `'none'` (never `'author'`)
--   5. Restrict `admin_profiles` and `api_connection_metadata` strictly to
--      active `'Administrator'` accounts via RLS
--   6. Seed non-secret integration placeholders honestly (`config_required` /
--      `pending`) with zero fabricated key prefixes or timestamps
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ADMIN PROFILES TABLE (Strictly Administrator-Only via RLS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Managing Editor'
        CHECK (role IN ('Administrator', 'Managing Editor', 'administrator', 'editor')),
    department TEXT DEFAULT 'Editorial Operations',
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON public.admin_profiles(email);

-- ----------------------------------------------------------------------------
-- 2. API CONNECTION METADATA TABLE (Strictly Administrator-Only via RLS)
--    Stores non-raw secret references and metadata. Raw API secrets must live
--    exclusively in server-side deployment environment variables / Vault.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.api_connection_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_key TEXT UNIQUE NOT NULL,
    service_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'infrastructure'
        CHECK (category IN ('google', 'analytics_seo', 'monetization', 'infrastructure', 'testing', 'ai')),
    environment TEXT NOT NULL DEFAULT 'production'
        CHECK (environment IN ('development', 'staging', 'production')),
    endpoint_url TEXT,
    auth_method TEXT NOT NULL DEFAULT 'api_key'
        CHECK (auth_method IN ('oauth2', 'service_account', 'api_key', 'dns_txt', 'html_meta', 'env_secret')),
    key_prefix TEXT,
    secret_env_ref TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (verification_status IN ('connected', 'pending', 'disconnected', 'config_required', 'error')),
    rotation_interval_days INTEGER NOT NULL DEFAULT 90 CHECK (rotation_interval_days > 0),
    last_rotated_at TIMESTAMPTZ,
    last_verified_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_conn_service_key ON public.api_connection_metadata(service_key);
CREATE INDEX IF NOT EXISTS idx_api_conn_status ON public.api_connection_metadata(verification_status);

-- ----------------------------------------------------------------------------
-- 3. UPDATED_AT TRIGGER HELPER (Pinned search_path)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER trg_admin_profiles_updated_at
    BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_api_connection_metadata_updated_at ON public.api_connection_metadata;
CREATE TRIGGER trg_api_connection_metadata_updated_at
    BEFORE UPDATE ON public.api_connection_metadata
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. SECURITY DEFINER ROLE VERIFICATION HELPERS
--    - Pinned `SET search_path = public, pg_temp` prevents search_path hijacking.
--    - Respects `admin_profiles.is_active = FALSE` deactivation immediately.
--    - Never trusts client-mutable `user_metadata`.
--    - Non-privileged fallback is strictly `'none'` (never `'author'`).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_administrator()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_role TEXT;
    v_active BOOLEAN;
    v_jwt_role TEXT;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    -- 1. Authoritative lookup against admin_profiles
    SELECT role, is_active INTO v_role, v_active
    FROM public.admin_profiles
    WHERE id = auth.uid();

    IF FOUND THEN
        IF NOT COALESCE(v_active, FALSE) THEN
            RETURN FALSE;
        END IF;
        RETURN v_role IN ('Administrator', 'administrator');
    END IF;

    -- 2. Secondary lookup against legacy profiles table
    SELECT role INTO v_role
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_role IN ('Administrator', 'administrator') THEN
        RETURN TRUE;
    END IF;

    -- 3. Server-signed JWT app_metadata claim (never user_metadata)
    v_jwt_role := auth.jwt() -> 'app_metadata' ->> 'role';
    IF v_jwt_role IN ('Administrator', 'administrator') THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;

-- Safe scalar role lookup for authenticated session initialization without
-- exposing rows from admin_profiles to Managing Editors or non-admin accounts.
CREATE OR REPLACE FUNCTION public.get_my_cms_role()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_role TEXT;
    v_active BOOLEAN;
    v_jwt_role TEXT;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN 'anon';
    END IF;

    SELECT role, is_active INTO v_role, v_active
    FROM public.admin_profiles
    WHERE id = auth.uid();

    IF FOUND THEN
        IF NOT COALESCE(v_active, FALSE) THEN
            RETURN 'none';
        END IF;
        RETURN v_role;
    END IF;

    SELECT role INTO v_role
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_role IS NOT NULL THEN
        RETURN v_role;
    END IF;

    v_jwt_role := auth.jwt() -> 'app_metadata' ->> 'role';
    IF v_jwt_role IN ('Administrator', 'administrator', 'Managing Editor', 'editor', 'author') THEN
        RETURN v_jwt_role;
    END IF;

    -- Least-privilege default: unmapped authenticated users receive zero CMS privileges
    RETURN 'none';
END;
$$;

-- Non-recursive helper returning ONLY the caller's current public.profiles.role
-- so the UPDATE policy on public.profiles never queries public.profiles via RLS.
CREATE OR REPLACE FUNCTION public.get_my_profile_role()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_role TEXT;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT role INTO v_role
    FROM public.profiles
    WHERE id = auth.uid();

    RETURN v_role;
END;
$$;

REVOKE ALL ON FUNCTION public.is_administrator() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_administrator() TO authenticated;

REVOKE ALL ON FUNCTION public.get_my_cms_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_cms_role() TO authenticated;

REVOKE ALL ON FUNCTION public.get_my_profile_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_profile_role() TO authenticated;

-- ----------------------------------------------------------------------------
-- 5. PRIVILEGE REVOKE & FORCE ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
REVOKE ALL ON TABLE public.admin_profiles FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_profiles TO authenticated;

REVOKE ALL ON TABLE public.api_connection_metadata FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.api_connection_metadata TO authenticated;

REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO authenticated;

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles FORCE ROW LEVEL SECURITY;

ALTER TABLE public.api_connection_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_connection_metadata FORCE ROW LEVEL SECURITY;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 6. STRICT RLS POLICIES: public.admin_profiles (Administrator ONLY)
--    Managing Editors and anonymous users receive 0 rows on SELECT and
--    42501 insufficient_privilege on INSERT / UPDATE / DELETE.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Administrators select admin_profiles" ON public.admin_profiles;
CREATE POLICY "Administrators select admin_profiles"
    ON public.admin_profiles
    FOR SELECT
    TO authenticated
    USING (public.is_administrator());

DROP POLICY IF EXISTS "Administrators insert admin_profiles" ON public.admin_profiles;
CREATE POLICY "Administrators insert admin_profiles"
    ON public.admin_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_administrator());

DROP POLICY IF EXISTS "Administrators update admin_profiles" ON public.admin_profiles;
CREATE POLICY "Administrators update admin_profiles"
    ON public.admin_profiles
    FOR UPDATE
    TO authenticated
    USING (public.is_administrator())
    WITH CHECK (public.is_administrator());

DROP POLICY IF EXISTS "Administrators delete admin_profiles" ON public.admin_profiles;
CREATE POLICY "Administrators delete admin_profiles"
    ON public.admin_profiles
    FOR DELETE
    TO authenticated
    USING (public.is_administrator() AND id <> auth.uid());

-- ----------------------------------------------------------------------------
-- 7. STRICT RLS POLICIES: public.api_connection_metadata (Administrator ONLY)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Administrators select api_connection_metadata" ON public.api_connection_metadata;
CREATE POLICY "Administrators select api_connection_metadata"
    ON public.api_connection_metadata
    FOR SELECT
    TO authenticated
    USING (public.is_administrator());

DROP POLICY IF EXISTS "Administrators insert api_connection_metadata" ON public.api_connection_metadata;
CREATE POLICY "Administrators insert api_connection_metadata"
    ON public.api_connection_metadata
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_administrator());

DROP POLICY IF EXISTS "Administrators update api_connection_metadata" ON public.api_connection_metadata;
CREATE POLICY "Administrators update api_connection_metadata"
    ON public.api_connection_metadata
    FOR UPDATE
    TO authenticated
    USING (public.is_administrator())
    WITH CHECK (public.is_administrator());

DROP POLICY IF EXISTS "Administrators delete api_connection_metadata" ON public.api_connection_metadata;
CREATE POLICY "Administrators delete api_connection_metadata"
    ON public.api_connection_metadata
    FOR DELETE
    TO authenticated
    USING (public.is_administrator());

-- ----------------------------------------------------------------------------
-- 8. HARDEN LEGACY public.profiles TABLE (Non-Recursive, Anti-Escalation)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Staff read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Administrators read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Administrators insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Administrators update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Administrators delete profiles" ON public.profiles;

CREATE POLICY "Administrators read all profiles"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (public.is_administrator());

CREATE POLICY "Users read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Administrators insert profiles"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_administrator());

CREATE POLICY "Administrators update all profiles"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (public.is_administrator())
    WITH CHECK (public.is_administrator());

-- Non-administrators may update own profile fields ONLY while keeping role unchanged.
-- Uses SECURITY DEFINER helper `get_my_profile_role()` to avoid RLS recursion.
CREATE POLICY "Users update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id AND NOT public.is_administrator())
    WITH CHECK (
        auth.uid() = id
        AND role = public.get_my_profile_role()
    );

CREATE POLICY "Administrators delete profiles"
    ON public.profiles
    FOR DELETE
    TO authenticated
    USING (public.is_administrator() AND id <> auth.uid());

-- ----------------------------------------------------------------------------
-- 9. SEED NON-SECRET INFRASTRUCTURE METADATA (HONEST UNVERIFIED DEFAULTS)
--    Zero fabricated key prefixes, verification dates, or connected claims.
-- ----------------------------------------------------------------------------
INSERT INTO public.api_connection_metadata (
    service_key,
    service_name,
    category,
    environment,
    endpoint_url,
    auth_method,
    key_prefix,
    secret_env_ref,
    verification_status,
    rotation_interval_days,
    last_rotated_at,
    last_verified_at,
    metadata
)
VALUES
    (
        'gemini_ai',
        'Google Gemini Editorial API',
        'ai',
        'production',
        'https://generativelanguage.googleapis.com',
        'env_secret',
        NULL,
        'GEMINI_API_KEY',
        'config_required',
        90,
        NULL,
        NULL,
        '{"scope": "editorial_assistant_server_only"}'::jsonb
    ),
    (
        'adsense_management',
        'Google AdSense Management API',
        'monetization',
        'production',
        'https://adsense.googleapis.com/v2',
        'service_account',
        NULL,
        'ADSENSE_SERVICE_ACCOUNT_KEY',
        'config_required',
        90,
        NULL,
        NULL,
        '{"scope": "adsense.readonly"}'::jsonb
    ),
    (
        'cloudflare_edge',
        'Cloudflare Edge CDN & Security API',
        'infrastructure',
        'production',
        'https://api.cloudflare.com/client/v4',
        'api_key',
        NULL,
        'CLOUDFLARE_API_TOKEN',
        'pending',
        90,
        NULL,
        NULL,
        '{"ssl_mode": "Full (Strict)"}'::jsonb
    ),
    (
        'supabase_service_role',
        'Supabase Admin Service Role',
        'infrastructure',
        'production',
        NULL,
        'env_secret',
        NULL,
        'SUPABASE_SERVICE_ROLE_KEY',
        'config_required',
        90,
        NULL,
        NULL,
        '{"isolation": "server_side_only"}'::jsonb
    )
ON CONFLICT (service_key) DO NOTHING;
