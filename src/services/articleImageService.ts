import { Article, ArticleImageMetadata, ArticleImageStatus } from '../types';
import { supabase } from '../integrations/supabase/client';
import { articleService } from './articleService';
import {
  ARTICLE_IMAGE_BUCKET,
  buildEditorialImagePrompt,
  getExpectedStoragePath,
  getLocalArticleImagePath,
  LEGACY_SHARED_IMAGES,
  resolveCategoryFolder,
} from '../utils/categoryFolder';

const JOB_STORAGE_KEY = 'aifinancedeals_image_jobs_v1';
const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export interface ArticleImageJob {
  articleId: string;
  slug: string;
  title: string;
  categoryFolder: string;
  expectedStoragePath: string;
  currentImageUrl: string;
  previewDataUrl?: string;
  generatedMimeType?: string;
  altText: string;
  caption: string;
  prompt: string;
  status: ArticleImageStatus;
  isDuplicate: boolean;
  isLegacyShared: boolean;
  isMissing: boolean;
  isSupabaseHosted: boolean;
  errorMessage?: string;
  updatedAt: string;
}

export interface OptimizedImageResult {
  dataUrl: string;
  mimeType: string;
  width: number;
  height: number;
}

type PersistedJobState = Record<
  string,
  Pick<
    ArticleImageJob,
    'status' | 'previewDataUrl' | 'generatedMimeType' | 'altText' | 'caption' | 'prompt' | 'errorMessage' | 'updatedAt'
  >
>;

function readPersistedJobs(): PersistedJobState {
  try {
    const raw = localStorage.getItem(JOB_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PersistedJobState;
  } catch {
    return {};
  }
}

function writePersistedJobs(map: PersistedJobState) {
  try {
    const compact: PersistedJobState = {};
    for (const [id, val] of Object.entries(map)) {
      compact[id] = {
        status: val.status,
        altText: val.altText,
        caption: val.caption,
        prompt: val.prompt,
        errorMessage: val.errorMessage,
        updatedAt: val.updatedAt,
      };
    }
    localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(compact));
  } catch {
    // Ignore localStorage quota warnings safely
  }
}

async function getBearerToken(): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  } catch {
    return null;
  }
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  maxRetries = 2
): Promise<Response> {
  let attempt = 0;
  let lastError: unknown;
  while (attempt <= maxRetries) {
    try {
      const res = await fetch(url, init);
      if (res.status !== 429 && res.status < 500) {
        return res;
      }
      if (attempt === maxRetries) return res;
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) throw err;
    }
    const backoffMs = 900 * Math.pow(2, attempt);
    await new Promise((r) => setTimeout(r, backoffMs));
    attempt += 1;
  }
  throw lastError instanceof Error ? lastError : new Error('Request failed');
}

function renderToExact16x9Canvas(img: HTMLImageElement): OptimizedImageResult {
  const canvas = document.createElement('canvas');
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Browser Canvas 2D context is unavailable.');
  }

  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;
  if (!srcW || !srcH) {
    throw new Error('Selected image has invalid dimensions.');
  }

  // Center-crop to exact 16:9 without distortion
  const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
  const srcRatio = srcW / srcH;

  let drawW = srcW;
  let drawH = srcH;
  let offsetX = 0;
  let offsetY = 0;

  if (srcRatio > targetRatio) {
    drawW = srcH * targetRatio;
    offsetX = (srcW - drawW) / 2;
  } else if (srcRatio < targetRatio) {
    drawH = srcW / targetRatio;
    offsetY = (srcH - drawH) / 2;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, offsetX, offsetY, drawW, drawH, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

  const webpDataUrl = canvas.toDataURL('image/webp', 0.88);
  if (webpDataUrl.startsWith('data:image/webp')) {
    return {
      dataUrl: webpDataUrl,
      mimeType: 'image/webp',
      width: TARGET_WIDTH,
      height: TARGET_HEIGHT,
    };
  }

  return {
    dataUrl: canvas.toDataURL('image/png'),
    mimeType: 'image/png',
    width: TARGET_WIDTH,
    height: TARGET_HEIGHT,
  };
}

export { buildEditorialImagePrompt };

export const articleImageService = {
  async hasLiveSupabaseSession(): Promise<boolean> {
    return Boolean(await getBearerToken());
  },

  scanInventory(articles: Article[]): ArticleImageJob[] {
    const persisted = readPersistedJobs();
    const urlCounts = new Map<string, number>();

    for (const art of articles) {
      const normalized = (art.featured_image || '').trim();
      if (normalized) {
        urlCounts.set(normalized, (urlCounts.get(normalized) || 0) + 1);
      }
    }

    return articles.map((art) => {
      const currentUrl = (art.featured_image || '').trim();
      const isMissing = !currentUrl;
      const isLegacyShared = LEGACY_SHARED_IMAGES.has(currentUrl);
      const isDuplicate = Boolean(currentUrl && (urlCounts.get(currentUrl) || 0) > 1);
      const isSupabaseHosted =
        currentUrl.includes('/storage/v1/object/public/') ||
        art.image_metadata?.source === 'supabase_storage';
      const categoryFolder = resolveCategoryFolder(art.category_id, art.category?.slug);
      const expectedStoragePath = getExpectedStoragePath(art);
      const saved = persisted[art.id];

      let defaultStatus: ArticleImageStatus = 'COMPLETED';
      if (isMissing || isLegacyShared) {
        defaultStatus = 'PENDING';
      } else if (isDuplicate || art.image_metadata?.generationStatus === 'NEEDS_REVIEW') {
        defaultStatus = 'NEEDS_REVIEW';
      } else if (art.image_metadata?.generationStatus) {
        defaultStatus = art.image_metadata.generationStatus;
      }

      const resolvedStatus =
        saved?.status === 'GENERATING' || saved?.status === 'UPLOADING'
          ? 'NEEDS_REVIEW'
          : saved?.status || defaultStatus;

      return {
        articleId: art.id,
        slug: art.slug,
        title: art.title,
        categoryFolder,
        expectedStoragePath,
        currentImageUrl: currentUrl || getLocalArticleImagePath(art),
        previewDataUrl: saved?.previewDataUrl,
        generatedMimeType: saved?.generatedMimeType,
        altText: saved?.altText || art.image_alt || `${art.title} financial editorial visual`,
        caption: saved?.caption || art.image_caption || '',
        prompt: saved?.prompt || buildEditorialImagePrompt(art),
        status: resolvedStatus,
        isDuplicate,
        isLegacyShared,
        isMissing,
        isSupabaseHosted,
        errorMessage: saved?.errorMessage,
        updatedAt: saved?.updatedAt || art.updated_at || new Date().toISOString(),
      };
    });
  },

  saveJobSnapshot(job: ArticleImageJob) {
    const persisted = readPersistedJobs();
    persisted[job.articleId] = {
      status: job.status,
      altText: job.altText,
      caption: job.caption,
      prompt: job.prompt,
      errorMessage: job.errorMessage,
      updatedAt: new Date().toISOString(),
    };
    writePersistedJobs(persisted);
  },

  async processUploadedImageFile(file: File): Promise<OptimizedImageResult> {
    if (!['image/webp', 'image/png', 'image/jpeg'].includes(file.type)) {
      throw new Error('Unsupported file format. Please select a WebP, PNG, or JPEG image.');
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error('Image exceeds the 10 MB upload limit. Please pick a smaller file.');
    }

    const objectUrl = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('Could not decode the selected image file.'));
        el.src = objectUrl;
      });
      return renderToExact16x9Canvas(img);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  },

  async fetchAssetAsWebpDataUrl(assetUrl: string): Promise<OptimizedImageResult> {
    const res = await fetch(assetUrl);
    if (!res.ok) {
      throw new Error(`Could not load local image asset (${res.status}) at ${assetUrl}`);
    }
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('Could not decode local WebP asset for upload.'));
        el.src = objectUrl;
      });
      return renderToExact16x9Canvas(img);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  },

  async approveAndUpload(
    article: Article,
    params: {
      imageUrlOrDataUrl: string;
      mimeType?: string;
      altText: string;
      caption?: string;
      promptSummary?: string;
      uploadToSupabase?: boolean;
    }
  ): Promise<Article> {
    const folder = resolveCategoryFolder(article.category_id, article.category?.slug);
    const storagePath = getExpectedStoragePath(article);
    const token = await getBearerToken();

    let payloadDataUrl = params.imageUrlOrDataUrl;
    let payloadMime = params.mimeType || 'image/webp';

    if (params.uploadToSupabase && !payloadDataUrl.startsWith('data:')) {
      const converted = await this.fetchAssetAsWebpDataUrl(payloadDataUrl);
      payloadDataUrl = converted.dataUrl;
      payloadMime = converted.mimeType;
    }

    const isDataUrl = payloadDataUrl.startsWith('data:');
    let finalUrl = params.imageUrlOrDataUrl;
    let sourceKind: ArticleImageMetadata['source'] = isDataUrl ? 'custom' : 'local_webp';

    if (isDataUrl) {
      if (token) {
        const res = await fetchWithRetry('/.netlify/functions/upload-article-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            articleId: article.id,
            slug: article.slug,
            categoryFolder: folder,
            base64Data: payloadDataUrl,
            mimeType: payloadMime,
            imageAlt: params.altText,
            imageCaption: params.caption || article.image_caption,
            promptSummary: params.promptSummary,
            width: TARGET_WIDTH,
            height: TARGET_HEIGHT,
          }),
        });

        const payload = (await res.json().catch(() => ({}))) as {
          error?: string;
          publicUrl?: string;
        };

        if (!res.ok || !payload.publicUrl) {
          throw new Error(payload.error || `Upload function failed with HTTP ${res.status}`);
        }

        finalUrl = payload.publicUrl;
        sourceKind = 'supabase_storage';
      } else {
        if (params.uploadToSupabase) {
          throw new Error(
            'Active Supabase Admin/Managing Editor session required to upload directly to Supabase Storage.'
          );
        }
        // Without a live Supabase session, preserve optimized data URL in local editorial state
        finalUrl = payloadDataUrl;
        sourceKind = 'custom';
      }
    }

    const now = new Date().toISOString();
    const metadata: ArticleImageMetadata = {
      width: TARGET_WIDTH,
      height: TARGET_HEIGHT,
      format: finalUrl.endsWith('.png') || payloadMime === 'image/png' ? 'png' : 'webp',
      bucket: ARTICLE_IMAGE_BUCKET,
      storagePath,
      generationStatus: 'COMPLETED',
      promptSummary: (params.promptSummary || '').slice(0, 300),
      generatedAt: article.image_metadata?.generatedAt || now,
      approvedAt: now,
      source: sourceKind,
    };

    return articleService.updateArticleImageOnly(article.id, {
      featured_image: finalUrl,
      image_alt: params.altText,
      image_caption: params.caption ?? article.image_caption,
      image_metadata: metadata,
    });
  },
};
