// ==============================================================================
// AI FINANCE DEALS — TRUSTED SERVER-SIDE NETLIFY FUNCTION
// Endpoint: /.netlify/functions/upload-article-image
//
// SECURITY ARCHITECTURE:
// - Executes strictly inside server-side Netlify Function runtime.
// - Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from trusted server env.
// - Verifies caller's Supabase JWT and confirms Administrator or Managing Editor
//   role before writing to Supabase Storage bucket `article-featured-images`.
// - Updates ONLY `featured_image`, `image_alt`, `image_caption`,
//   `image_metadata`, and `updated_at` on `public.articles`.
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

const ALLOWED_BUCKETS = new Set(['article-featured-images']);
const ALLOWED_MIME_TYPES = new Set(['image/webp', 'image/png', 'image/jpeg']);

interface UploadRequestBody {
  articleId?: string;
  slug?: string;
  categoryFolder?: string;
  base64Data?: string;
  mimeType?: string;
  imageAlt?: string;
  imageCaption?: string;
  promptSummary?: string;
  width?: number;
  height?: number;
}

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
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: JSON_HEADERS,
    });
  }

  const supabaseUrl = normalizeSupabaseUrl(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
  );
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({
        error: 'Server environment is missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.',
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

    const { data: profile } = await adminClient
      .from('admin_profiles')
      .select('id, role, is_active')
      .eq('id', userData.user.id)
      .maybeSingle();

    const appRole = String(userData.user.app_metadata?.role || '').toLowerCase();
    const isStaffAllowed =
      Boolean(
        profile &&
          profile.is_active &&
          (profile.role === 'Administrator' || profile.role === 'Managing Editor')
      ) ||
      appRole === 'administrator' ||
      appRole === 'editor';

    if (!isStaffAllowed) {
      return new Response(
        JSON.stringify({
          error: 'Forbidden: Only active Managing Editor or Administrator accounts may upload featured images.',
        }),
        { status: 403, headers: JSON_HEADERS }
      );
    }

    const body = (await req.json()) as UploadRequestBody;
    const rawBase64 = (body.base64Data || '').replace(/^data:[^;]+;base64,/, '').trim();
    const mimeType = ALLOWED_MIME_TYPES.has(body.mimeType || '') ? (body.mimeType as string) : 'image/webp';
    const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/jpeg' ? 'jpg' : 'webp';

    if (!rawBase64) {
      return new Response(
        JSON.stringify({ error: 'Missing base64 image payload.' }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const cleanFolder = (body.categoryFolder || 'personal-finance')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const cleanSlug = (body.slug || body.articleId || `article-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const storagePath = `${cleanFolder}/${cleanSlug}.${ext}`;
    const bucket = 'article-featured-images';

    if (!ALLOWED_BUCKETS.has(bucket)) {
      return new Response(JSON.stringify({ error: 'Invalid storage bucket.' }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const binaryString = atob(rawBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i += 1) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const { error: uploadError } = await adminClient.storage
      .from(bucket)
      .upload(storagePath, bytes, {
        contentType: mimeType,
        cacheControl: '2592000',
        upsert: true,
      });

    if (uploadError) {
      return new Response(
        JSON.stringify({ error: `Storage upload failed: ${uploadError.message}` }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    const { data: publicUrlData } = adminClient.storage.from(bucket).getPublicUrl(storagePath);
    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
      return new Response(
        JSON.stringify({ error: 'Uploaded image did not return a public URL.' }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    // Verify public HTTP accessibility
    let reachable = false;
    try {
      const headRes = await fetch(publicUrl, { method: 'HEAD' });
      reachable = headRes.ok;
    } catch {
      reachable = false;
    }

    const now = new Date().toISOString();
    const imageMetadata = {
      width: body.width || 1280,
      height: body.height || 720,
      format: ext,
      bucket,
      storagePath,
      generationStatus: 'COMPLETED',
      promptSummary: (body.promptSummary || '').slice(0, 320),
      generatedAt: now,
      approvedAt: now,
      source: 'supabase_storage',
      verifiedPublicHttp: reachable,
    };

    // Safely update ONLY image fields on matching article record (if article exists in Postgres)
    if (body.articleId || body.slug) {
      const updatePayload: Record<string, unknown> = {
        featured_image: publicUrl,
        image_alt: body.imageAlt || `${cleanSlug.replace(/-/g, ' ')} editorial illustration`,
        image_metadata: imageMetadata,
        updated_at: now,
      };
      if (typeof body.imageCaption === 'string' && body.imageCaption.trim()) {
        updatePayload.image_caption = body.imageCaption.trim();
      }

      const query = adminClient.from('articles').update(updatePayload);
      if (body.slug) {
        await query.eq('slug', body.slug);
      } else if (body.articleId) {
        await query.eq('id', body.articleId);
      }
    }

    // Record in public.media table
    await adminClient.from('media').insert({
      file_name: `${cleanSlug}.${ext}`,
      file_url: publicUrl,
      mime_type: mimeType,
      file_size_bytes: bytes.byteLength,
      alt_text: body.imageAlt || cleanSlug,
      uploaded_by: userData.user.id,
    });

    return new Response(
      JSON.stringify({
        status: 'ok',
        publicUrl,
        bucket,
        storagePath,
        fileSizeBytes: bytes.byteLength,
        verifiedPublicHttp: reachable,
        imageMetadata,
      }),
      { status: 200, headers: JSON_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Failed uploading featured image to Supabase Storage.',
      }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
}
