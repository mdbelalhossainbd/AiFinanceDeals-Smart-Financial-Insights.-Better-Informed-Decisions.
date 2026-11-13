-- ============================================================================
-- AI FINANCE DEALS — RLS VERIFICATION TEST SUITE
-- Tests least-privilege Row Level Security across:
--   - public.admin_profiles (Administrator ONLY; deactivated admin blocked)
--   - public.api_connection_metadata (Administrator ONLY)
--   - public.profiles (non-recursive UPDATE prevents role self-escalation)
--   - public.articles (anon published only; author owns drafts & cannot publish/delete)
--   - public.newsletter_subscribers (consent_recorded defaults FALSE; anon opt-in only)
--   - public.site_settings (non-public rows hidden from anon/authors/editors)
--   - `get_my_cms_role()` unmapped user fallback returns `'none'`
-- Run inside Supabase SQL Editor or psql; wrapped in ROLLBACK so zero test
-- records persist in production tables.
-- ============================================================================

BEGIN;

-- 1. Seed temporary auth.users + profiles / admin_profiles entries
INSERT INTO auth.users (id, email)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'rls-test-admin@aifinancedeals.com'),
    ('22222222-2222-2222-2222-222222222222', 'rls-test-editor@aifinancedeals.com'),
    ('33333333-3333-3333-3333-333333333333', 'rls-test-author1@aifinancedeals.com'),
    ('44444444-4444-4444-4444-444444444444', 'rls-test-author2@aifinancedeals.com'),
    ('55555555-5555-5555-5555-555555555555', 'rls-test-unmapped@aifinancedeals.com'),
    ('66666666-6666-6666-6666-666666666666', 'rls-test-inactive-admin@aifinancedeals.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.admin_profiles (id, email, full_name, role, is_active)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'rls-test-admin@aifinancedeals.com', 'Test Administrator', 'Administrator', TRUE),
    ('22222222-2222-2222-2222-222222222222', 'rls-test-editor@aifinancedeals.com', 'Test Managing Editor', 'Managing Editor', TRUE),
    ('66666666-6666-6666-6666-666666666666', 'rls-test-inactive-admin@aifinancedeals.com', 'Deactivated Admin', 'Administrator', FALSE)
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, is_active = EXCLUDED.is_active;

INSERT INTO public.profiles (id, email, full_name, role)
VALUES
    ('33333333-3333-3333-3333-333333333333', 'rls-test-author1@aifinancedeals.com', 'Test Author 1', 'author'),
    ('44444444-4444-4444-4444-444444444444', 'rls-test-author2@aifinancedeals.com', 'Test Author 2', 'author'),
    ('66666666-6666-6666-6666-666666666666', 'rls-test-inactive-admin@aifinancedeals.com', 'Deactivated Admin', 'administrator')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;

-- Seed temporary draft, published, and site_settings records
INSERT INTO public.articles (id, title, slug, excerpt, content, featured_image, status, created_by)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Author 1 Draft', 'rls-test-draft-1', 'Draft 1', '<p>Body 1</p>', '/images/articles/personal-finance/50-30-20-budgeting-rule-guide.webp', 'draft', '33333333-3333-3333-3333-333333333333'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Author 2 Draft', 'rls-test-draft-2', 'Draft 2', '<p>Body 2</p>', '/images/articles/banking/high-yield-savings-accounts-hysa-guide.webp', 'draft', '44444444-4444-4444-4444-444444444444'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Published Article', 'rls-test-published', 'Pub excerpt', '<p>Pub body</p>', '/images/articles/insurance/term-vs-whole-life-insurance-comparison.webp', 'published', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (key, value, is_public)
VALUES
    ('rls_public_tagline', '{"tagline":"Smart Insights"}'::jsonb, TRUE),
    ('rls_private_config', '{"internalWebhook":"hidden"}'::jsonb, FALSE)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, is_public = EXCLUDED.is_public;

-- ----------------------------------------------------------------------------
-- TEST A: Anonymous user (`anon`) restrictions & explicit newsletter consent
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_draft_count INTEGER;
    v_pub_count INTEGER;
    v_sub_count INTEGER;
    v_priv_setting_count INTEGER;
    v_pub_setting_count INTEGER;
    v_implicit_consent_blocked BOOLEAN := FALSE;
BEGIN
    PERFORM set_config('role', 'anon', TRUE);

    SELECT COUNT(*) INTO v_draft_count FROM public.articles WHERE slug LIKE 'rls-test-draft-%';
    SELECT COUNT(*) INTO v_pub_count FROM public.articles WHERE slug = 'rls-test-published';
    SELECT COUNT(*) INTO v_sub_count FROM public.newsletter_subscribers;
    SELECT COUNT(*) INTO v_priv_setting_count FROM public.site_settings WHERE key = 'rls_private_config';
    SELECT COUNT(*) INTO v_pub_setting_count FROM public.site_settings WHERE key = 'rls_public_tagline';

    IF v_draft_count <> 0 THEN
        RAISE EXCEPTION 'RLS FAILURE: anon was able to read draft articles';
    END IF;
    IF v_pub_count <> 1 THEN
        RAISE EXCEPTION 'RLS FAILURE: anon expected to read published article';
    END IF;
    IF v_sub_count <> 0 THEN
        RAISE EXCEPTION 'RLS FAILURE: anon read % subscriber PII rows', v_sub_count;
    END IF;
    IF v_priv_setting_count <> 0 THEN
        RAISE EXCEPTION 'RLS FAILURE: anon read non-public site_settings';
    END IF;
    IF v_pub_setting_count <> 1 THEN
        RAISE EXCEPTION 'RLS FAILURE: anon expected to read is_public=TRUE site_settings';
    END IF;

    -- Omitting consent_recorded MUST fail because default is now FALSE
    BEGIN
        INSERT INTO public.newsletter_subscribers (email, cadence)
        VALUES ('anon-no-consent@aifinancedeals.com', 'weekly');
    EXCEPTION WHEN insufficient_privilege OR SQLSTATE '42501' THEN
        v_implicit_consent_blocked := TRUE;
    END;

    IF NOT v_implicit_consent_blocked THEN
        RAISE EXCEPTION 'RLS FAILURE: anon inserted subscriber without explicit consent_recorded = TRUE';
    END IF;

    -- Explicit consent_recorded = TRUE & status = active MUST succeed
    INSERT INTO public.newsletter_subscribers (email, cadence, consent_recorded, status)
    VALUES ('anon-optin-test@aifinancedeals.com', 'weekly', TRUE, 'active');

    RESET role;
END $$;

-- ----------------------------------------------------------------------------
-- TEST B: Unmapped authenticated user defaults to `'none'` (no staff access)
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_role TEXT;
    v_insert_blocked BOOLEAN := FALSE;
BEGIN
    PERFORM set_config('role', 'authenticated', TRUE);
    PERFORM set_config(
        'request.jwt.claims',
        json_build_object(
            'sub', '55555555-5555-5555-5555-555555555555',
            'role', 'authenticated',
            'email', 'rls-test-unmapped@aifinancedeals.com'
        )::text,
        TRUE
    );

    v_role := public.get_my_cms_role();
    IF v_role <> 'none' THEN
        RAISE EXCEPTION 'RLS FAILURE: Unmapped authenticated user resolved role "%" instead of "none"', v_role;
    END IF;

    BEGIN
        INSERT INTO public.articles (title, slug, excerpt, content, featured_image, status)
        VALUES ('Unmapped Probe', 'rls-unmapped-probe', 'e', '<p>c</p>', '/images/x.webp', 'draft');
    EXCEPTION WHEN insufficient_privilege OR SQLSTATE '42501' THEN
        v_insert_blocked := TRUE;
    END;

    IF NOT v_insert_blocked THEN
        RAISE EXCEPTION 'RLS FAILURE: Unmapped authenticated user inserted an article';
    END IF;

    RESET role;
END $$;

-- ----------------------------------------------------------------------------
-- TEST C: Author ownership, anti-publish, anti-delete, anti-escalation
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_other_draft_count INTEGER;
    v_publish_blocked BOOLEAN := FALSE;
    v_delete_blocked BOOLEAN := FALSE;
    v_other_update_blocked BOOLEAN := FALSE;
    v_role_escalation_blocked BOOLEAN := FALSE;
    v_settings_blocked BOOLEAN := FALSE;
BEGIN
    PERFORM set_config('role', 'authenticated', TRUE);
    PERFORM set_config(
        'request.jwt.claims',
        json_build_object(
            'sub', '33333333-3333-3333-3333-333333333333',
            'role', 'authenticated',
            'email', 'rls-test-author1@aifinancedeals.com'
        )::text,
        TRUE
    );

    -- Author 1 CAN update their own draft
    UPDATE public.articles SET title = 'Author 1 Updated Draft'
    WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

    -- Author 1 CANNOT read Author 2's draft
    SELECT COUNT(*) INTO v_other_draft_count FROM public.articles
    WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    IF v_other_draft_count <> 0 THEN
        RAISE EXCEPTION 'RLS FAILURE: Author 1 read Author 2 draft article';
    END IF;

    -- Author 1 CANNOT update Author 2's draft
    UPDATE public.articles SET title = 'Hijacked'
    WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    IF NOT FOUND THEN
        v_other_update_blocked := TRUE;
    END IF;
    IF NOT v_other_update_blocked THEN
        RAISE EXCEPTION 'RLS FAILURE: Author 1 modified Author 2 draft article';
    END IF;

    -- Author 1 CANNOT publish their own draft
    BEGIN
        UPDATE public.articles SET status = 'published'
        WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    EXCEPTION WHEN insufficient_privilege OR SQLSTATE '42501' THEN
        v_publish_blocked := TRUE;
    END;
    IF NOT v_publish_blocked THEN
        RAISE EXCEPTION 'RLS FAILURE: Author was allowed to publish an article';
    END IF;

    -- Author 1 CANNOT delete their own draft
    DELETE FROM public.articles WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    IF NOT FOUND THEN
        v_delete_blocked := TRUE;
    END IF;
    IF NOT v_delete_blocked THEN
        RAISE EXCEPTION 'RLS FAILURE: Author was allowed to delete an article';
    END IF;

    -- Author 1 CANNOT escalate their own profiles.role (non-recursive policy check)
    BEGIN
        UPDATE public.profiles SET role = 'administrator'
        WHERE id = '33333333-3333-3333-3333-333333333333';
    EXCEPTION WHEN insufficient_privilege OR SQLSTATE '42501' THEN
        v_role_escalation_blocked := TRUE;
    END;
    IF NOT v_role_escalation_blocked THEN
        RAISE EXCEPTION 'RLS FAILURE: Author escalated own profiles.role';
    END IF;

    -- Author 1 CAN update non-role fields on their own profile
    UPDATE public.profiles SET full_name = 'Test Author 1 Renamed'
    WHERE id = '33333333-3333-3333-3333-333333333333';

    -- Author 1 CANNOT write site_settings
    BEGIN
        INSERT INTO public.site_settings (key, value) VALUES ('rls_probe', '{}'::jsonb);
    EXCEPTION WHEN insufficient_privilege OR SQLSTATE '42501' THEN
        v_settings_blocked := TRUE;
    END;
    IF NOT v_settings_blocked THEN
        RAISE EXCEPTION 'RLS FAILURE: Author was allowed to write site_settings';
    END IF;

    RESET role;
END $$;

-- ----------------------------------------------------------------------------
-- TEST D: Managing Editor permissions & boundaries
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_admin_profiles_count INTEGER;
    v_api_meta_count INTEGER;
    v_priv_settings_count INTEGER;
    v_insert_blocked BOOLEAN := FALSE;
    v_update_blocked BOOLEAN := FALSE;
    v_settings_blocked BOOLEAN := FALSE;
BEGIN
    PERFORM set_config('role', 'authenticated', TRUE);
    PERFORM set_config(
        'request.jwt.claims',
        json_build_object(
            'sub', '22222222-2222-2222-2222-222222222222',
            'role', 'authenticated',
            'email', 'rls-test-editor@aifinancedeals.com'
        )::text,
        TRUE
    );

    SELECT COUNT(*) INTO v_admin_profiles_count FROM public.admin_profiles;
    SELECT COUNT(*) INTO v_api_meta_count FROM public.api_connection_metadata;
    SELECT COUNT(*) INTO v_priv_settings_count FROM public.site_settings WHERE key = 'rls_private_config';

    IF v_admin_profiles_count <> 0 THEN
        RAISE EXCEPTION 'RLS FAILURE: Managing Editor read % rows from admin_profiles', v_admin_profiles_count;
    END IF;
    IF v_api_meta_count <> 0 THEN
        RAISE EXCEPTION 'RLS FAILURE: Managing Editor read % rows from api_connection_metadata', v_api_meta_count;
    END IF;
    IF v_priv_settings_count <> 0 THEN
        RAISE EXCEPTION 'RLS FAILURE: Managing Editor read non-public site_settings';
    END IF;

    BEGIN
        INSERT INTO public.api_connection_metadata (service_key, service_name, secret_env_ref)
        VALUES ('unauthorized_test', 'Unauthorized Service', 'FAKE_KEY');
    EXCEPTION WHEN insufficient_privilege OR SQLSTATE '42501' THEN
        v_insert_blocked := TRUE;
    END;
    IF NOT v_insert_blocked THEN
        RAISE EXCEPTION 'RLS FAILURE: Managing Editor was allowed to INSERT into api_connection_metadata';
    END IF;

    UPDATE public.admin_profiles SET role = 'Administrator'
    WHERE id = '22222222-2222-2222-2222-222222222222';
    IF NOT FOUND THEN
        v_update_blocked := TRUE;
    END IF;
    IF NOT v_update_blocked THEN
        RAISE EXCEPTION 'RLS FAILURE: Managing Editor escalated role in admin_profiles';
    END IF;

    BEGIN
        INSERT INTO public.site_settings (key, value) VALUES ('rls_editor_probe', '{}'::jsonb);
    EXCEPTION WHEN insufficient_privilege OR SQLSTATE '42501' THEN
        v_settings_blocked := TRUE;
    END;
    IF NOT v_settings_blocked THEN
        RAISE EXCEPTION 'RLS FAILURE: Managing Editor was allowed to write site_settings';
    END IF;

    -- Managing Editor CAN publish Author 1's draft
    UPDATE public.articles SET status = 'published'
    WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

    RESET role;
END $$;

-- ----------------------------------------------------------------------------
-- TEST E: Deactivated Administrator (`is_active = FALSE`) MUST have zero access
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_role TEXT;
    v_admin_count INTEGER;
BEGIN
    PERFORM set_config('role', 'authenticated', TRUE);
    PERFORM set_config(
        'request.jwt.claims',
        json_build_object(
            'sub', '66666666-6666-6666-6666-666666666666',
            'role', 'authenticated',
            'email', 'rls-test-inactive-admin@aifinancedeals.com'
        )::text,
        TRUE
    );

    v_role := public.get_my_cms_role();
    IF v_role <> 'none' THEN
        RAISE EXCEPTION 'RLS FAILURE: Deactivated admin resolved role "%" instead of "none"', v_role;
    END IF;

    SELECT COUNT(*) INTO v_admin_count FROM public.admin_profiles;
    IF v_admin_count <> 0 THEN
        RAISE EXCEPTION 'RLS FAILURE: Deactivated admin read % rows from admin_profiles', v_admin_count;
    END IF;

    RESET role;
END $$;

-- ----------------------------------------------------------------------------
-- TEST F: Active Administrator MUST have full access (except self-delete)
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_admin_profiles_count INTEGER;
    v_api_meta_count INTEGER;
    v_self_delete_blocked BOOLEAN := FALSE;
BEGIN
    PERFORM set_config('role', 'authenticated', TRUE);
    PERFORM set_config(
        'request.jwt.claims',
        json_build_object(
            'sub', '11111111-1111-1111-1111-111111111111',
            'role', 'authenticated',
            'email', 'rls-test-admin@aifinancedeals.com'
        )::text,
        TRUE
    );

    SELECT COUNT(*) INTO v_admin_profiles_count FROM public.admin_profiles;
    SELECT COUNT(*) INTO v_api_meta_count FROM public.api_connection_metadata;

    IF v_admin_profiles_count < 2 THEN
        RAISE EXCEPTION 'RLS FAILURE: Administrator expected >= 2 admin_profiles rows, got %', v_admin_profiles_count;
    END IF;
    IF v_api_meta_count < 1 THEN
        RAISE EXCEPTION 'RLS FAILURE: Administrator expected >= 1 api_connection_metadata rows, got %', v_api_meta_count;
    END IF;

    -- Self-deletion of own admin_profiles row must be blocked
    DELETE FROM public.admin_profiles WHERE id = '11111111-1111-1111-1111-111111111111';
    IF NOT FOUND THEN
        v_self_delete_blocked := TRUE;
    END IF;
    IF NOT v_self_delete_blocked THEN
        RAISE EXCEPTION 'RLS FAILURE: Administrator deleted own admin_profiles record';
    END IF;

    INSERT INTO public.api_connection_metadata (service_key, service_name, secret_env_ref, verification_status)
    VALUES ('rls_verified_service', 'RLS Verified Integration', 'VERIFIED_REF', 'connected');

    UPDATE public.api_connection_metadata
    SET verification_status = 'pending'
    WHERE service_key = 'rls_verified_service';

    DELETE FROM public.api_connection_metadata
    WHERE service_key = 'rls_verified_service';

    RESET role;
END $$;

ROLLBACK;
