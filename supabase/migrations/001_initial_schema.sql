-- ============================================================================
-- AI FINANCE DEALS — SUPABASE POSTGRESQL INITIAL SCHEMA MIGRATION
-- Database Version: PostgreSQL 15+
-- Migration ID: 001_initial_schema
-- Created: 2026-11-03
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES & ROLES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'author' CHECK (role IN ('administrator', 'editor', 'author')),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. CATEGORIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. AUTHORS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    credentials TEXT,
    avatar_url TEXT,
    verified BOOLEAN DEFAULT true,
    twitter_handle TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. TAGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. ARTICLES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
    seo_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    sources JSONB DEFAULT '[]'::jsonb,
    read_time TEXT DEFAULT '5 min read',
    status TEXT NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'editorial_review', 'fact_check', 'approved', 'published')),
    featured BOOLEAN DEFAULT false,
    trending BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. FINANCE DEALS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    description TEXT NOT NULL,
    offer_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    terms_url TEXT NOT NULL,
    official_url TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'US',
    currency TEXT NOT NULL DEFAULT 'USD',
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'verified'
        CHECK (verification_status IN ('pending', 'verified', 'expired', 'under_review')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. COMPARISONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    comparison_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    sources JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. STATIC PAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    meta_description TEXT,
    canonical_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. MEDIA LIBRARY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size_bytes BIGINT,
    alt_text TEXT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. NEWSLETTER SUBSCRIBERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    cadence TEXT DEFAULT 'weekly' CHECK (cadence IN ('daily', 'weekly')),
    consent_recorded BOOLEAN NOT NULL DEFAULT true,
    ip_hash TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. SITE SETTINGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Only published content is readable by anon)
CREATE POLICY "Public articles read" ON public.articles
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public categories read" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Public authors read" ON public.authors
    FOR SELECT USING (true);

CREATE POLICY "Public tags read" ON public.tags
    FOR SELECT USING (true);

CREATE POLICY "Public deals read" ON public.deals
    FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Public comparisons read" ON public.comparisons
    FOR SELECT USING (true);

CREATE POLICY "Public pages read" ON public.pages
    FOR SELECT USING (true);

CREATE POLICY "Public site settings read" ON public.site_settings
    FOR SELECT USING (true);

-- Anonymous Newsletter Subscription
CREATE POLICY "Public newsletter subscribe" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Authenticated Admin/Staff Policies (Full Access)
CREATE POLICY "Staff full access articles" ON public.articles
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff full access deals" ON public.deals
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff full access categories" ON public.categories
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff full access authors" ON public.authors
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff full access comparisons" ON public.comparisons
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff full access pages" ON public.pages
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff full access media" ON public.media
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff full access newsletter" ON public.newsletter_subscribers
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff full access settings" ON public.site_settings
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff read profiles" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_verification ON public.deals(verification_status);
CREATE INDEX IF NOT EXISTS idx_deals_valid_dates ON public.deals(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_comparisons_slug ON public.comparisons(slug);
