# AI Finance Deals — Production Financial Publishing Platform

> **Smart Financial Insights. Better Informed Decisions.**  
> **Target Domain:** [https://aifinancedeals.com](https://aifinancedeals.com)  
> **Stack:** React 19 + TypeScript + Vite 8 + Tailwind CSS + Supabase (PostgreSQL & Auth) + Netlify Functions

---

## 1. Architecture Summary

- **Frontend Framework:** React 19 + TypeScript (`browserRouter` via `react-router-dom`)
- **Build Tool & Prerenderer:** Vite 8 + `scripts/prerender-routes.mjs` (emits static SEO HTML files per published route + `404.html` into `dist/`)
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Serverless Functions:** `netlify/functions/` (`esbuild` bundler)
  - `admin-api-health.ts`: Authenticated staff check inspecting server-side integration readiness without returning secrets.
  - `upload-article-image.ts`: Authenticated Administrator/Managing Editor upload pipeline to Supabase Storage bucket `article-featured-images`.
- **Database & Auth:** Supabase Cloud (PostgreSQL + Row Level Security + Storage + Supabase Auth)

---

## 2. GitHub Repository Connection (Netlify)

1. Push this repository (excluding `.env`, `node_modules`, and `dist`) to your GitHub account or organization.
2. Sign in to [Netlify](https://app.netlify.com) and click **Add new site → Import an existing project → GitHub**.
3. Authorize Netlify to access the repository and select the production branch (typically `main`).

---

## 3. Netlify Build Settings

`netlify.toml` is already configured at the repository root. Confirm Netlify matches:

| Setting | Value |
| --- | --- |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |
| **Functions directory** | `netlify/functions` |
| **Node.js version** | `22` (configured in `netlify.toml`) |

Routing & headers configured in `netlify.toml`:
- Missing static asset paths (`/assets/*`, `/images/*`, `/icons/*`) return HTTP `404` via `/404.html`.
- Dynamic SPA paths fall back cleanly to `/index.html` (`200`), while pre-rendered static HTML files (`dist/articles/<slug>/index.html`, `/about-us/index.html`, `/ads.txt`, `/robots.txt`, `/sitemap.xml`) are served directly.
- `/admin/*` and `/.netlify/functions/*` send `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store`.

---

## 4. Environment Variables (Netlify Site Configuration)

Configure environment variables under **Netlify Dashboard → Site configuration → Environment variables** using `.env.example` as a template.

### A. Required Client-Side Variables (Live Supabase Auth & Data)
Scope in Netlify: **Builds + Functions**
- `VITE_SUPABASE_URL` — Supabase Project **API URL** (e.g., `https://<project-ref>.supabase.co` — **not** the `https://supabase.com/dashboard/...` URL)
- `VITE_SUPABASE_ANON_KEY` — Supabase public anonymous/publishable key

### B. Optional Client-Side Variables (Site builds & runs without these)
Scope in Netlify: **Builds**
- `VITE_SITE_URL` — Canonical origin (`https://aifinancedeals.com`)
- `VITE_GTM_ID` — Google Tag Manager Container ID (`GTM-XXXXXXX`, consent-gated)
- `VITE_GA_MEASUREMENT_ID` — Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`, consent-gated)
- `VITE_GSC_VERIFICATION` — Google Search Console HTML meta verification token
- `VITE_ADSENSE_ENABLED` — Defaults to `"false"`; set to `"true"` only after AdSense approval
- `VITE_ADSENSE_CLIENT_ID` — Publisher ID (`ca-pub-7571394117486446`)

### C. Server-Side Only Secrets (NEVER prefix with `VITE_`!)
Scope in Netlify: **Functions ONLY** (check **Contains secret values**, uncheck **Builds** and **Post processing**):
- `SUPABASE_URL` — Same `https://<project-ref>.supabase.co` API URL for Netlify Functions
- `SUPABASE_SERVICE_ROLE_KEY` — Privileged service-role key used exclusively by `netlify/functions/admin-api-health.ts` and `netlify/functions/upload-article-image.ts`

*(Note: `DATABASE_URL` is optional for offline CLI SQL migrations only and is never used by frontend code or Netlify Functions.)*

---

## 5. Supabase Database & Storage Setup

1. Create or open your project in [Supabase](https://supabase.com/dashboard).
2. Open **SQL Editor** and run the migrations in strict order:
   1. `supabase/migrations/001_initial_schema.sql`
   2. `supabase/migrations/002_admin_rls_security.sql`
   3. `supabase/migrations/003_editorial_rbac_rls.sql`
   4. `supabase/migrations/004_article_featured_images.sql`
   5. `supabase/migrations/005_seed_integrity_reconciliation.sql`
3. Optionally run `supabase/tests/verify_admin_rls.sql` in a rolled-back transaction to validate least-privilege RLS across `anon`, unmapped users (`none`), `author`, `Managing Editor`, deactivated admins, and `Administrator`.
4. Confirm in **Settings → API** that your Project URL (`https://<project-ref>.supabase.co`) and `anon`/publishable key match Netlify's `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, and your `service_role` key matches `SUPABASE_SERVICE_ROLE_KEY` (Functions scope only).

---

## 6. First Administrator & Managing Editor Setup (Supabase Dashboard)

Production builds strictly enforce **Supabase Authentication** and **never** include default administrator passwords or local demo fallbacks.

1. In **Supabase Dashboard → Authentication → Users**, click **Add user → Create new user** with your real Administrator email and a strong password (enable **Auto Confirm User**).
2. Copy the newly created user's **UUID** (`id`).
3. Run the following SQL in **Supabase Dashboard → SQL Editor** (replacing the UUID, email, and name):

```sql
INSERT INTO public.admin_profiles (id, email, full_name, role, department, is_active)
VALUES (
  'YOUR-ADMIN-USER-UUID',
  'admin@yourdomain.com',
  'Chief Financial Editor',
  'Administrator',
  'Editorial Leadership',
  true
);
```

4. Optionally repeat the same steps for **Managing Editor** accounts using `'Managing Editor'` as the `role`. Managing Editors can manage articles, categories, deals, comparisons, and featured images, while `public.admin_profiles`, `public.api_connection_metadata`, and system settings writes remain strictly restricted to `Administrator` via RLS.
5. Sign in at `https://aifinancedeals.com/admin/login`. Public articles, hubs, comparisons, deals, and legal pages remain accessible without login.

---

## 7. Custom Domain Connection & HTTPS Setup

> DNS records are intentionally left untouched by this repository and must be configured manually in your registrar/DNS provider and Netlify UI.

1. In Netlify, open **Domain management → Production domains → Add a domain** and add `aifinancedeals.com` (primary) and `www.aifinancedeals.com`.
2. Update DNS records at your domain registrar or Cloudflare following Netlify's instructions (typically an `ALIAS`/`ANAME` or `A` record at the apex `aifinancedeals.com` pointing to Netlify's load balancer, plus a `CNAME` for `www` pointing to `<your-site>.netlify.app` — or delegate nameservers to Netlify DNS).
3. Once DNS propagates, open **Domain management → HTTPS** in Netlify and click **Verify DNS configuration** to automatically provision and renew a **Let's Encrypt TLS certificate** and enable **Force HTTPS**.

---

## 8. Production Deployment & Post-Deploy Checklist

1. After setting environment variables and connecting GitHub, click **Trigger deploy → Clear cache and deploy site** in Netlify.
2. Verify HTTP `200` and content integrity on live URLs:
   - `/`
   - `/articles/50-30-20-budgeting-rule-guide`
   - `/about-us/`
   - `/ads.txt` (serves `google.com, pub-7571394117486446, DIRECT, f08c47fec0942fa0`)
   - `/robots.txt`
   - `/sitemap.xml`
   - `/admin/login`
3. Verify a missing asset path (e.g. `/images/nonexistent.webp`) returns HTTP `404`.
4. Test Administrator sign-in at `/admin/login` and check **Integration Stack** (`/.netlify/functions/admin-api-health`) shows live server-side status without errors.

---

## 9. Troubleshooting

| Symptom | Cause | Resolution |
| --- | --- | --- |
| `Authentication service is temporarily unreachable` on `/admin/login` | `VITE_SUPABASE_URL` points to a paused project or a `supabase.com/dashboard/...` URL instead of `https://<ref>.supabase.co`, or key is missing. | Set `VITE_SUPABASE_URL` to `https://<project-ref>.supabase.co`, confirm the Supabase project is active, and redeploy. |
| `Invalid email or password` in production | User has not been created in Supabase `Authentication → Users` or email confirmation is pending. | Create/confirm the user in Supabase Auth and ensure an active row exists in `public.admin_profiles`. |
| `Editorial Staff Role Required` after signing in | Authenticated user has no active `Administrator` or `Managing Editor` row in `public.admin_profiles`. | Insert the user's UUID into `public.admin_profiles` with `is_active = true`. |
| `503` from `/.netlify/functions/admin-api-health` or `upload-article-image` | `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing from Netlify Functions scope. | Add both under **Netlify Environment variables** scoped to **Functions**, then redeploy. |
| Google AdSense ads do not load | Expected before approval when `VITE_ADSENSE_ENABLED` is `"false"`, or visitor declined optional cookies. | Keep `VITE_ADSENSE_ENABLED="false"` until Google approves `aifinancedeals.com`; set to `"true"` and redeploy afterward. |
