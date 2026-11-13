# AI Finance Deals — Production Deployment & Manual Onboarding Guide

**Primary Domain:** `https://aifinancedeals.com`  
**Hosting Target:** Netlify  
**Backend Database & Auth:** Supabase Cloud

---

## 1. Environment Variables & Netlify Secret Scoping

Configure environment variables in **Netlify Dashboard -> Site configuration -> Environment variables**. Never prefix server-only secrets with `VITE_`.

### A. Public Client-Side Variables (Required for Live Supabase)
- `VITE_SUPABASE_URL` — Your Supabase project URL (e.g. `https://your-project-ref.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` — Your Supabase public anonymous/publishable key

### B. Optional Public Configuration (`VITE_*` — Site Runs Without These)
- `VITE_SITE_URL` — Canonical site origin (defaults to `https://aifinancedeals.com`)
- `VITE_GA_MEASUREMENT_ID` — Optional GA4 Measurement ID (`G-...`), consent-gated
- `VITE_GTM_ID` — Optional Google Tag Manager Container ID (`GTM-...`), consent-gated
- `VITE_GSC_VERIFICATION` — Optional Google Search Console HTML verification meta token
- `VITE_ADSENSE_ENABLED` — Defaults to `"false"`; set to `"true"` only after AdSense approval
- `VITE_ADSENSE_CLIENT_ID` — Optional publisher ID (`ca-pub-7571394117486446`)

### C. Server-Side Only Secrets (Netlify Functions & Migrations — NEVER `VITE_*`)
When adding these in Netlify Dashboard:
1. Check **Contains secret values** (enables write-only masking in UI and build logs).
2. Under **Scopes**, select **Functions** ONLY (uncheck **Builds** and **Post processing** so Vite never receives them).
3. Restrict contexts appropriately (e.g., `Production` and `Deploy Previews` as needed).

Variables:
- `SUPABASE_SERVICE_ROLE_KEY` — Trusted server-side admin operations (`netlify/functions/admin-api-health.ts`)
- `SUPABASE_URL` — Server-side Supabase URL (matches project URL)
- `DATABASE_URL` — Direct PostgreSQL connection string for offline CLI migrations/tests only
- `GEMINI_API_KEY` — Optional server-side AI endpoint secret (if enabled later)

---

## 2. Supabase Schema & RLS Migration Order

Run the SQL migrations in exact sequence in **Supabase Dashboard -> SQL Editor** (or via `psql "$DATABASE_URL"`):

1. `supabase/migrations/001_initial_schema.sql` — Base tables (`profiles`, `categories`, `authors`, `tags`, `articles`, `deals`, `comparisons`, `pages`, `media`, `newsletter_subscribers`, `site_settings`)
2. `supabase/migrations/002_admin_rls_security.sql` — Administrator-only RLS (`admin_profiles`, `api_connection_metadata`, hardened `profiles`)
3. `supabase/migrations/003_editorial_rbac_rls.sql` — Least-privilege editorial RBAC replacing broad authenticated policies (`is_staff()`, `is_editor_or_admin()`, draft-only author protection, newsletter PII isolation, Admin-only `site_settings` writes)
4. `supabase/tests/verify_admin_rls.sql` — Rolled-back verification suite checking `anon`, `author`, `Managing Editor`, and `Administrator` permissions

### Creating Staff Auth Users
In **Supabase Dashboard -> Authentication -> Users**, create real staff logins and assign their matching UUIDs in `public.admin_profiles` (`role`: `'Administrator'` or `'Managing Editor'`) and `app_metadata.role`.

---

## 3. Netlify Deployment Verification

1. Connect your repository to Netlify (build command: `npm run build`, publish directory: `dist` as defined in `netlify.toml`).
2. Confirm HTTP 200 and non-empty rendered HTML on key endpoints after deploy:
   - `https://aifinancedeals.com/`
   - `https://aifinancedeals.com/articles/50-30-20-budgeting-rule-guide`
   - `https://aifinancedeals.com/about-us/`
   - `https://aifinancedeals.com/ads.txt`
   - `https://aifinancedeals.com/robots.txt`
   - `https://aifinancedeals.com/sitemap.xml`
   - `https://aifinancedeals.com/images/hero_ai_datacenter_finance_1793743607871.jpg`
3. Run Google PageSpeed Insights and Google Rich Results Test on the live URL.

---

## 4. Google Services & AdSense Activation

1. **Google Search Console:** Add domain property `aifinancedeals.com`, verify via DNS TXT or `VITE_GSC_VERIFICATION` HTML tag, and submit `https://aifinancedeals.com/sitemap.xml`.
2. **Google Analytics 4 & GTM:** Add real IDs to `VITE_GA_MEASUREMENT_ID` and `VITE_GTM_ID`. Both tags remain suppressed until visitors click **Accept Analytics & Ads** in the cookie consent banner.
3. **Google AdSense:** Confirm `https://aifinancedeals.com/ads.txt` serves `google.com, pub-7571394117486446, DIRECT, f08c47fec0942fa0`. Submit site for AdSense review. Only after approval, set `VITE_ADSENSE_ENABLED="true"` and redeploy on Netlify.
