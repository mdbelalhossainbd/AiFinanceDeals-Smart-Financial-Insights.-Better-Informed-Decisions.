-- ============================================================================
-- AI FINANCE DEALS — ARTICLE FEATURED IMAGES & SUPABASE STORAGE MIGRATION
-- Migration ID: 004_article_featured_images (Security-Hardened & Idempotent)
-- Requires: 001_initial_schema.sql, 002_admin_rls_security.sql, 003_editorial_rbac_rls.sql
-- Purpose:
--   1. Adds `image_alt`, `image_caption`, and `image_metadata` JSONB columns
--      to `public.articles` without altering existing articles or SEO metadata.
--   2. Provisions the `article-featured-images` public bucket with strict
--      5 MB file size limit (5242880 bytes) and WebP/PNG/JPEG MIME restrictions.
--   3. Configures idempotent least-privilege Storage RLS policies:
--        - Public HTTP read access for `article-featured-images`
--        - Strictly Managing Editor / Administrator upload, update & delete
--        - Safe object path & extension checks preventing traversal
-- ============================================================================

ALTER TABLE public.articles
    ADD COLUMN IF NOT EXISTS image_alt TEXT,
    ADD COLUMN IF NOT EXISTS image_caption TEXT,
    ADD COLUMN IF NOT EXISTS image_metadata JSONB DEFAULT '{}'::jsonb;

-- Provision or synchronize dedicated bucket with 5 MB limit & strict MIME types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'article-featured-images',
    'article-featured-images',
    TRUE,
    5242880,
    ARRAY['image/webp', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE
SET
    name = EXCLUDED.name,
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop prior policies so migration can be safely rerun idempotently
DROP POLICY IF EXISTS "Public read article featured images" ON storage.objects;
DROP POLICY IF EXISTS "Editors upload article featured images" ON storage.objects;
DROP POLICY IF EXISTS "Editors update article featured images" ON storage.objects;
DROP POLICY IF EXISTS "Editors delete article featured images" ON storage.objects;

-- Allow public reads strictly within the `article-featured-images` bucket
CREATE POLICY "Public read article featured images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'article-featured-images');

-- Allow Managing Editors and Administrators to upload verified image paths
CREATE POLICY "Editors upload article featured images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'article-featured-images'
        AND public.is_editor_or_admin()
        AND name !~ '\.\.'
        AND name ~* '^[a-z0-9/_-]+\.(webp|png|jpe?g)$'
    );

-- Allow Managing Editors and Administrators to overwrite/update editorial images
CREATE POLICY "Editors update article featured images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'article-featured-images'
        AND public.is_editor_or_admin()
    )
    WITH CHECK (
        bucket_id = 'article-featured-images'
        AND public.is_editor_or_admin()
        AND name !~ '\.\.'
        AND name ~* '^[a-z0-9/_-]+\.(webp|png|jpe?g)$'
    );

-- Allow Managing Editors and Administrators to delete deprecated images
CREATE POLICY "Editors delete article featured images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'article-featured-images'
        AND public.is_editor_or_admin()
    );
