-- ============================================================================
-- AI FINANCE DEALS — EDITORIAL RBAC & CONTENT TABLE RLS HARDENING
-- Migration ID: 003_editorial_rbac_rls (Security-Hardened Revision)
-- Requires: 001_initial_schema.sql, 002_admin_rls_security.sql
-- Purpose:
--   Replaces overly permissive policies from `001_initial_schema.sql` with
--   non-overlapping, role-based least-privilege rules:
--     * Anonymous visitors (`anon`) & non-staff users:
--         - Read ONLY published articles, verified deals, public taxonomies,
--           and non-sensitive `site_settings` (`is_public = TRUE`)
--         - Insert into `newsletter_subscribers` ONLY with explicit `consent_recorded = TRUE`
--     * Authors (`author`):
--         - Ownership enforced via `articles.created_by = auth.uid()`
--         - May read published articles + their own drafts; insert/update ONLY
--           their own non-published drafts; CANNOT publish, delete, or edit
--           other authors' articles
--     * Managing Editors (`Managing Editor` / `editor`) & Administrators:
--         - Full editorial CRUD across articles, deals, categories, authors,
--           tags, comparisons, pages, media, and subscriber reads/updates
--     * Administrators (`Administrator` / `administrator`) ONLY:
--         - Full access to `site_settings` (reads including non-public & writes)
--         - Subscriber deletion + `admin_profiles` / `api_connection_metadata`
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SCHEMA HARDENING (PRESERVES ALL EXISTING CONTENT & RELATIONSHIPS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.articles
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid();

CREATE INDEX IF NOT EXISTS idx_articles_created_by ON public.articles(created_by);

-- Require explicit opt-in consent (never default to TRUE)
ALTER TABLE public.newsletter_subscribers
    ALTER COLUMN consent_recorded SET DEFAULT FALSE;

-- Isolate sensitive settings from public SELECT queries by default
ALTER TABLE public.site_settings
    ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT FALSE;

-- ----------------------------------------------------------------------------
-- 2. ROLE HELPER FUNCTIONS (SECURITY DEFINER, PINNED SEARCH_PATH, ACTIVE GUARD)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_staff()
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

    SELECT role, is_active INTO v_role, v_active
    FROM public.admin_profiles
    WHERE id = auth.uid();

    IF FOUND THEN
        IF NOT COALESCE(v_active, FALSE) THEN
            RETURN FALSE;
        END IF;
        RETURN v_role IN ('Administrator', 'administrator', 'Managing Editor', 'editor', 'author');
    END IF;

    SELECT role INTO v_role
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_role IN ('Administrator', 'administrator', 'Managing Editor', 'editor', 'author') THEN
        RETURN TRUE;
    END IF;

    v_jwt_role := auth.jwt() -> 'app_metadata' ->> 'role';
    IF v_jwt_role IN ('Administrator', 'administrator', 'Managing Editor', 'editor', 'author') THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
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

    SELECT role, is_active INTO v_role, v_active
    FROM public.admin_profiles
    WHERE id = auth.uid();

    IF FOUND THEN
        IF NOT COALESCE(v_active, FALSE) THEN
            RETURN FALSE;
        END IF;
        RETURN v_role IN ('Administrator', 'administrator', 'Managing Editor', 'editor');
    END IF;

    SELECT role INTO v_role
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_role IN ('Administrator', 'administrator', 'Managing Editor', 'editor') THEN
        RETURN TRUE;
    END IF;

    v_jwt_role := auth.jwt() -> 'app_metadata' ->> 'role';
    IF v_jwt_role IN ('Administrator', 'administrator', 'Managing Editor', 'editor') THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_author_only()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN public.is_staff() AND NOT public.is_editor_or_admin();
END;
$$;

REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;

REVOKE ALL ON FUNCTION public.is_editor_or_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_editor_or_admin() TO authenticated;

REVOKE ALL ON FUNCTION public.is_author_only() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_author_only() TO authenticated;

-- ----------------------------------------------------------------------------
-- 3. FORCE ROW LEVEL SECURITY ON CONTENT & SETTINGS TABLES
-- ----------------------------------------------------------------------------
ALTER TABLE public.categories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.authors FORCE ROW LEVEL SECURITY;
ALTER TABLE public.tags FORCE ROW LEVEL SECURITY;
ALTER TABLE public.articles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.deals FORCE ROW LEVEL SECURITY;
ALTER TABLE public.comparisons FORCE ROW LEVEL SECURITY;
ALTER TABLE public.pages FORCE ROW LEVEL SECURITY;
ALTER TABLE public.media FORCE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers FORCE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings FORCE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 4. ARTICLES — AUTHOR OWNERSHIP & NON-OVERLAPPING WORKFLOW GOVERNANCE
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public articles read" ON public.articles;
DROP POLICY IF EXISTS "Staff full access articles" ON public.articles;
DROP POLICY IF EXISTS "Staff read all articles" ON public.articles;
DROP POLICY IF EXISTS "Editors manage articles" ON public.articles;
DROP POLICY IF EXISTS "Editors and admins manage articles" ON public.articles;
DROP POLICY IF EXISTS "Authors insert draft articles" ON public.articles;
DROP POLICY IF EXISTS "Authors update non-published articles" ON public.articles;
DROP POLICY IF EXISTS "Authors update draft articles" ON public.articles;
DROP POLICY IF EXISTS "Public read published articles" ON public.articles;
DROP POLICY IF EXISTS "Authors read own articles" ON public.articles;
DROP POLICY IF EXISTS "Editors and admins read all articles" ON public.articles;
DROP POLICY IF EXISTS "Authors insert own draft articles" ON public.articles;
DROP POLICY IF EXISTS "Editors and admins insert articles" ON public.articles;
DROP POLICY IF EXISTS "Authors update own draft articles" ON public.articles;
DROP POLICY IF EXISTS "Editors and admins update articles" ON public.articles;
DROP POLICY IF EXISTS "Editors and admins delete articles" ON public.articles;

-- SELECT: public reads published; authors read own; editors/admins read all
CREATE POLICY "Public read published articles"
    ON public.articles
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Authors read own articles"
    ON public.articles
    FOR SELECT
    TO authenticated
    USING (public.is_author_only() AND created_by = auth.uid());

CREATE POLICY "Editors and admins read all articles"
    ON public.articles
    FOR SELECT
    TO authenticated
    USING (public.is_editor_or_admin());

-- INSERT: authors insert own drafts only; editors/admins insert any
CREATE POLICY "Authors insert own draft articles"
    ON public.articles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_author_only()
        AND created_by = auth.uid()
        AND status IN ('draft', 'editorial_review', 'fact_check')
    );

CREATE POLICY "Editors and admins insert articles"
    ON public.articles
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor_or_admin());

-- UPDATE: authors update ONLY their own non-published drafts (cannot publish/reassign);
-- editors/admins update any article
CREATE POLICY "Authors update own draft articles"
    ON public.articles
    FOR UPDATE
    TO authenticated
    USING (
        public.is_author_only()
        AND created_by = auth.uid()
        AND status IN ('draft', 'editorial_review', 'fact_check')
    )
    WITH CHECK (
        public.is_author_only()
        AND created_by = auth.uid()
        AND status IN ('draft', 'editorial_review', 'fact_check')
    );

CREATE POLICY "Editors and admins update articles"
    ON public.articles
    FOR UPDATE
    TO authenticated
    USING (public.is_editor_or_admin())
    WITH CHECK (public.is_editor_or_admin());

-- DELETE: strictly Editors and Administrators
CREATE POLICY "Editors and admins delete articles"
    ON public.articles
    FOR DELETE
    TO authenticated
    USING (public.is_editor_or_admin());

-- ----------------------------------------------------------------------------
-- 5. DEALS — VERIFIED PUBLIC READ / EDITOR+ADMIN WRITE (NO OVERLAPPING FOR ALL)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public deals read" ON public.deals;
DROP POLICY IF EXISTS "Staff full access deals" ON public.deals;
DROP POLICY IF EXISTS "Staff read all deals" ON public.deals;
DROP POLICY IF EXISTS "Editors manage deals" ON public.deals;
DROP POLICY IF EXISTS "Editors and admins manage deals" ON public.deals;
DROP POLICY IF EXISTS "Public read verified deals" ON public.deals;
DROP POLICY IF EXISTS "Editors and admins read all deals" ON public.deals;
DROP POLICY IF EXISTS "Editors and admins insert deals" ON public.deals;
DROP POLICY IF EXISTS "Editors and admins update deals" ON public.deals;
DROP POLICY IF EXISTS "Editors and admins delete deals" ON public.deals;

CREATE POLICY "Public read verified deals"
    ON public.deals
    FOR SELECT
    TO anon, authenticated
    USING (verification_status = 'verified');

CREATE POLICY "Staff read all deals"
    ON public.deals
    FOR SELECT
    TO authenticated
    USING (public.is_staff());

CREATE POLICY "Editors and admins insert deals"
    ON public.deals
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins update deals"
    ON public.deals
    FOR UPDATE
    TO authenticated
    USING (public.is_editor_or_admin())
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins delete deals"
    ON public.deals
    FOR DELETE
    TO authenticated
    USING (public.is_editor_or_admin());

-- ----------------------------------------------------------------------------
-- 6. TAXONOMIES, AUTHORS, COMPARISONS, PAGES, MEDIA (NON-OVERLAPPING POLICIES)
-- ----------------------------------------------------------------------------
-- Categories
DROP POLICY IF EXISTS "Staff full access categories" ON public.categories;
DROP POLICY IF EXISTS "Editors and admins manage categories" ON public.categories;
DROP POLICY IF EXISTS "Editors and admins insert categories" ON public.categories;
DROP POLICY IF EXISTS "Editors and admins update categories" ON public.categories;
DROP POLICY IF EXISTS "Editors and admins delete categories" ON public.categories;

CREATE POLICY "Editors and admins insert categories"
    ON public.categories
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins update categories"
    ON public.categories
    FOR UPDATE
    TO authenticated
    USING (public.is_editor_or_admin())
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins delete categories"
    ON public.categories
    FOR DELETE
    TO authenticated
    USING (public.is_editor_or_admin());

-- Authors
DROP POLICY IF EXISTS "Staff full access authors" ON public.authors;
DROP POLICY IF EXISTS "Editors and admins manage authors" ON public.authors;
DROP POLICY IF EXISTS "Editors and admins insert authors" ON public.authors;
DROP POLICY IF EXISTS "Editors and admins update authors" ON public.authors;
DROP POLICY IF EXISTS "Editors and admins delete authors" ON public.authors;

CREATE POLICY "Editors and admins insert authors"
    ON public.authors
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins update authors"
    ON public.authors
    FOR UPDATE
    TO authenticated
    USING (public.is_editor_or_admin())
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins delete authors"
    ON public.authors
    FOR DELETE
    TO authenticated
    USING (public.is_editor_or_admin());

-- Tags
DROP POLICY IF EXISTS "Editors and admins insert tags" ON public.tags;
DROP POLICY IF EXISTS "Editors and admins update tags" ON public.tags;
DROP POLICY IF EXISTS "Editors and admins delete tags" ON public.tags;

CREATE POLICY "Editors and admins insert tags"
    ON public.tags
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins update tags"
    ON public.tags
    FOR UPDATE
    TO authenticated
    USING (public.is_editor_or_admin())
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins delete tags"
    ON public.tags
    FOR DELETE
    TO authenticated
    USING (public.is_editor_or_admin());

-- Comparisons
DROP POLICY IF EXISTS "Staff full access comparisons" ON public.comparisons;
DROP POLICY IF EXISTS "Editors and admins manage comparisons" ON public.comparisons;
DROP POLICY IF EXISTS "Editors and admins insert comparisons" ON public.comparisons;
DROP POLICY IF EXISTS "Editors and admins update comparisons" ON public.comparisons;
DROP POLICY IF EXISTS "Editors and admins delete comparisons" ON public.comparisons;

CREATE POLICY "Editors and admins insert comparisons"
    ON public.comparisons
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins update comparisons"
    ON public.comparisons
    FOR UPDATE
    TO authenticated
    USING (public.is_editor_or_admin())
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins delete comparisons"
    ON public.comparisons
    FOR DELETE
    TO authenticated
    USING (public.is_editor_or_admin());

-- Pages
DROP POLICY IF EXISTS "Staff full access pages" ON public.pages;
DROP POLICY IF EXISTS "Editors and admins manage pages" ON public.pages;
DROP POLICY IF EXISTS "Editors and admins insert pages" ON public.pages;
DROP POLICY IF EXISTS "Editors and admins update pages" ON public.pages;
DROP POLICY IF EXISTS "Editors and admins delete pages" ON public.pages;

CREATE POLICY "Editors and admins insert pages"
    ON public.pages
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins update pages"
    ON public.pages
    FOR UPDATE
    TO authenticated
    USING (public.is_editor_or_admin())
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins delete pages"
    ON public.pages
    FOR DELETE
    TO authenticated
    USING (public.is_editor_or_admin());

-- Media
DROP POLICY IF EXISTS "Staff full access media" ON public.media;
DROP POLICY IF EXISTS "Staff read media" ON public.media;
DROP POLICY IF EXISTS "Staff upload media" ON public.media;
DROP POLICY IF EXISTS "Editors and admins manage media" ON public.media;
DROP POLICY IF EXISTS "Editors and admins delete media" ON public.media;

CREATE POLICY "Staff read media"
    ON public.media
    FOR SELECT
    TO authenticated
    USING (public.is_staff());

CREATE POLICY "Staff upload media"
    ON public.media
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_staff()
        AND (uploaded_by IS NULL OR uploaded_by = auth.uid())
    );

CREATE POLICY "Editors and admins manage media"
    ON public.media
    FOR UPDATE
    TO authenticated
    USING (public.is_editor_or_admin())
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins delete media"
    ON public.media
    FOR DELETE
    TO authenticated
    USING (public.is_editor_or_admin());

-- ----------------------------------------------------------------------------
-- 7. NEWSLETTER SUBSCRIBERS — EXPLICIT OPT-IN & PII PROTECTION
-- ----------------------------------------------------------------------------
REVOKE ALL ON TABLE public.newsletter_subscribers FROM PUBLIC, anon;
GRANT INSERT ON TABLE public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.newsletter_subscribers TO authenticated;

DROP POLICY IF EXISTS "Public newsletter subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Staff full access newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Public newsletter opt-in insert" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Editors and admins manage newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Editors and admins read newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Editors and admins update newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins delete newsletter" ON public.newsletter_subscribers;

CREATE POLICY "Public newsletter opt-in insert"
    ON public.newsletter_subscribers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        consent_recorded IS TRUE
        AND status = 'active'
        AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    );

CREATE POLICY "Editors and admins read newsletter"
    ON public.newsletter_subscribers
    FOR SELECT
    TO authenticated
    USING (public.is_editor_or_admin());

CREATE POLICY "Editors and admins update newsletter"
    ON public.newsletter_subscribers
    FOR UPDATE
    TO authenticated
    USING (public.is_editor_or_admin())
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Admins delete newsletter"
    ON public.newsletter_subscribers
    FOR DELETE
    TO authenticated
    USING (public.is_administrator());

-- ----------------------------------------------------------------------------
-- 8. SITE SETTINGS — NON-SENSITIVE PUBLIC READ / ADMINISTRATOR-ONLY WRITE
-- ----------------------------------------------------------------------------
REVOKE ALL ON TABLE public.site_settings FROM PUBLIC, anon;
GRANT SELECT ON TABLE public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.site_settings TO authenticated;

DROP POLICY IF EXISTS "Public site settings read" ON public.site_settings;
DROP POLICY IF EXISTS "Staff full access settings" ON public.site_settings;
DROP POLICY IF EXISTS "Administrators manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public read safe site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Administrators read all site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Administrators insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Administrators update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Administrators delete site settings" ON public.site_settings;

-- Public visitors may ONLY read settings explicitly flagged `is_public = TRUE`
-- and never secret-bearing key names.
CREATE POLICY "Public read safe site settings"
    ON public.site_settings
    FOR SELECT
    TO anon, authenticated
    USING (
        is_public = TRUE
        AND key !~* '(secret|token|key|password|credential|private|service_role|database_url|webhook|smtp|oauth|api_key)'
    );

CREATE POLICY "Administrators read all site settings"
    ON public.site_settings
    FOR SELECT
    TO authenticated
    USING (public.is_administrator());

CREATE POLICY "Administrators insert site settings"
    ON public.site_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_administrator());

CREATE POLICY "Administrators update site settings"
    ON public.site_settings
    FOR UPDATE
    TO authenticated
    USING (public.is_administrator())
    WITH CHECK (public.is_administrator());

CREATE POLICY "Administrators delete site settings"
    ON public.site_settings
    FOR DELETE
    TO authenticated
    USING (public.is_administrator());
