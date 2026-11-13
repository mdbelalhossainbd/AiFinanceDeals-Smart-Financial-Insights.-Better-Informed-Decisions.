-- ============================================================================
-- AI FINANCE DEALS — SEED INTEGRITY RECONCILIATION MIGRATION
-- Migration ID: 005_seed_integrity_reconciliation
-- Requires: 001_initial_schema.sql, 002_admin_rls_security.sql,
--           003_editorial_rbac_rls.sql, 004_article_featured_images.sql
-- Purpose:
--   Safely reconciles environments where an earlier version of 002 seeded
--   fabricated `key_prefix`, `last_rotated_at`, `last_verified_at`, or
--   unverified `'connected'` statuses into `public.api_connection_metadata`.
--   Only untouched placeholder rows are reset; any genuine verified records
--   configured by an Administrator remain untouched.
-- ============================================================================

UPDATE public.api_connection_metadata
SET
    key_prefix = NULL,
    verification_status = CASE
        WHEN service_key = 'cloudflare_edge' THEN 'pending'
        ELSE 'config_required'
    END,
    last_rotated_at = NULL,
    last_verified_at = NULL,
    endpoint_url = CASE
        WHEN service_key = 'supabase_service_role' AND endpoint_url = 'https://your-project-ref.supabase.co' THEN NULL
        ELSE endpoint_url
    END,
    metadata = CASE
        WHEN service_key = 'cloudflare_edge' THEN '{"ssl_mode": "Full (Strict)"}'::jsonb
        WHEN service_key = 'adsense_management' THEN '{"scope": "adsense.readonly"}'::jsonb
        ELSE metadata
    END
WHERE
    key_prefix IN ('AIza***', 'sa-adsense***', 'cf-tok***', 'sb_sec***')
    OR endpoint_url = 'https://your-project-ref.supabase.co';
