import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { articleImageService, ArticleImageJob } from '../../services/articleImageService';
import { Article, ArticleImageStatus } from '../../types';
import { CATEGORY_FOLDER_LABELS, CategoryImageFolder } from '../../utils/categoryFolder';
import { ArticleFeaturedImage } from '../../components/articles/ArticleFeaturedImage';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Search,
  Eye,
  Upload,
  Pause,
  Play,
  XCircle,
  X,
  Image as ImageIcon,
  ShieldCheck,
  Edit3,
  ExternalLink,
  Copy,
  Check,
  CloudUpload,
} from 'lucide-react';

const STATUS_BADGE_MAP: Record<ArticleImageStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'PENDING',
    className: 'bg-slate-100 text-slate-700 border border-slate-300',
  },
  GENERATING: {
    label: 'PROCESSING',
    className: 'bg-sky-50 text-sky-800 border border-sky-200',
  },
  GENERATED: {
    label: 'READY_FOR_REVIEW',
    className: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
  },
  UPLOADING: {
    label: 'UPLOADING',
    className: 'bg-cyan-50 text-cyan-800 border border-cyan-200',
  },
  COMPLETED: {
    label: 'COMPLETED',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  FAILED: {
    label: 'FAILED',
    className: 'bg-rose-50 text-rose-700 border border-rose-200',
  },
  NEEDS_REVIEW: {
    label: 'NEEDS_REVIEW',
    className: 'bg-amber-50 text-amber-800 border border-amber-200',
  },
};

const MAX_CONCURRENT_UPLOADS = 2;

export const AdminFeaturedImagesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [jobs, setJobs] = useState<ArticleImageJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSupabaseSession, setHasSupabaseSession] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [folderFilter, setFolderFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Batch Supabase Storage sync queue controls
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchPaused, setBatchPaused] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });
  const batchPauseRef = useRef(false);
  const batchCancelRef = useRef(false);

  // Hidden file input for quick row uploads
  const rowFileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

  // Side-by-side preview modal state
  const [reviewJobId, setReviewJobId] = useState<string | null>(null);
  const [draftAlt, setDraftAlt] = useState('');
  const [draftCaption, setDraftCaption] = useState('');
  const [draftPrompt, setDraftPrompt] = useState('');

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const [list, sessionActive] = await Promise.all([
        articleService.getAllArticlesForAdmin(),
        articleImageService.hasLiveSupabaseSession(),
      ]);
      setArticles(list);
      setHasSupabaseSession(sessionActive);
      const scanned = articleImageService.scanInventory(list);
      setJobs(scanned);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const updateJob = (articleId: string, updater: (prev: ArticleImageJob) => ArticleImageJob) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.articleId !== articleId) return j;
        const next = updater(j);
        articleImageService.saveJobSnapshot(next);
        return next;
      })
    );
  };

  const stats = useMemo(() => {
    const total = jobs.length;
    const completed = jobs.filter((j) => j.status === 'COMPLETED').length;
    const needsAction = jobs.filter(
      (j) => j.status === 'PENDING' || j.status === 'NEEDS_REVIEW' || j.status === 'FAILED'
    ).length;
    const readyReview = jobs.filter((j) => j.status === 'GENERATED').length;
    const duplicates = jobs.filter((j) => j.isDuplicate).length;
    const missingAlt = jobs.filter((j) => !j.altText.trim()).length;
    const supabaseSynced = jobs.filter((j) => j.isSupabaseHosted).length;
    return { total, completed, needsAction, readyReview, duplicates, missingAlt, supabaseSynced };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
      const matchesFolder = folderFilter === 'all' || j.categoryFolder === folderFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.slug.toLowerCase().includes(q) ||
        j.expectedStoragePath.toLowerCase().includes(q);
      return matchesStatus && matchesFolder && matchesSearch;
    });
  }, [jobs, statusFilter, folderFilter, search]);

  const activeReviewJob = useMemo(
    () => jobs.find((j) => j.articleId === reviewJobId) || null,
    [jobs, reviewJobId]
  );

  const openReviewModal = (job: ArticleImageJob) => {
    setReviewJobId(job.articleId);
    setDraftAlt(job.altText);
    setDraftCaption(job.caption);
    setDraftPrompt(job.prompt);
  };

  const handleCopyPrompt = async (job: ArticleImageJob, customPrompt?: string) => {
    try {
      await navigator.clipboard.writeText(customPrompt || job.prompt);
      setCopiedPromptId(job.articleId);
      setTimeout(() => setCopiedPromptId(null), 2000);
      showToast('info', `Copied tailored editorial prompt for "${job.title}".`);
    } catch {
      showToast('error', 'Clipboard access unavailable in this browser context.');
    }
  };

  const handleProcessSelectedFile = async (articleId: string, file: File) => {
    const article = articles.find((a) => a.id === articleId);
    if (!article) return;

    updateJob(articleId, (prev) => ({
      ...prev,
      status: 'GENERATING',
      errorMessage: undefined,
      updatedAt: new Date().toISOString(),
    }));

    try {
      const optimized = await articleImageService.processUploadedImageFile(file);
      updateJob(articleId, (prev) => ({
        ...prev,
        status: 'GENERATED',
        previewDataUrl: optimized.dataUrl,
        generatedMimeType: optimized.mimeType,
        errorMessage: undefined,
        updatedAt: new Date().toISOString(),
      }));
      showToast(
        'success',
        `Optimized "${file.name}" to exact 1280×720 16:9 WebP for "${article.title}". Review & click Approve to save.`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed processing uploaded image.';
      updateJob(articleId, (prev) => ({
        ...prev,
        status: 'FAILED',
        errorMessage: msg,
        updatedAt: new Date().toISOString(),
      }));
      showToast('error', msg);
    }
  };

  const triggerRowUpload = (articleId: string) => {
    setUploadTargetId(articleId);
    if (rowFileInputRef.current) {
      rowFileInputRef.current.value = '';
      rowFileInputRef.current.click();
    }
  };

  const handleApproveAndSave = async (
    articleId: string,
    overrides?: { altText?: string; caption?: string; prompt?: string; uploadToSupabase?: boolean }
  ) => {
    const article = articles.find((a) => a.id === articleId);
    const job = jobs.find((j) => j.articleId === articleId);
    if (!article || !job) return;

    const imageSource = job.previewDataUrl || job.currentImageUrl;
    const altToSave = (overrides?.altText ?? job.altText).trim() || article.title;
    const captionToSave = (overrides?.caption ?? job.caption).trim();

    updateJob(articleId, (prev) => ({
      ...prev,
      status: 'UPLOADING',
      altText: altToSave,
      caption: captionToSave,
      errorMessage: undefined,
    }));

    try {
      const updatedArticle = await articleImageService.approveAndUpload(article, {
        imageUrlOrDataUrl: imageSource,
        mimeType: job.generatedMimeType || 'image/webp',
        altText: altToSave,
        caption: captionToSave,
        promptSummary: overrides?.prompt ?? job.prompt,
        uploadToSupabase: overrides?.uploadToSupabase,
      });

      setArticles((prev) => prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a)));
      updateJob(articleId, (prev) => ({
        ...prev,
        currentImageUrl: updatedArticle.featured_image,
        previewDataUrl: undefined,
        status: 'COMPLETED',
        isDuplicate: false,
        isLegacyShared: false,
        isMissing: false,
        isSupabaseHosted:
          updatedArticle.featured_image.includes('/storage/v1/object/public/') ||
          updatedArticle.image_metadata?.source === 'supabase_storage',
        altText: altToSave,
        caption: captionToSave,
        errorMessage: undefined,
        updatedAt: new Date().toISOString(),
      }));
      setReviewJobId(null);
      showToast('success', `Saved featured image & alt text for "${article.title}".`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      updateJob(articleId, (prev) => ({
        ...prev,
        status: 'FAILED',
        errorMessage: msg,
      }));
      showToast('error', msg);
    }
  };

  const handleBatchSyncToSupabase = async () => {
    const targets = jobs.filter((j) => !j.isSupabaseHosted);
    if (targets.length === 0) {
      showToast('info', 'All featured images are already synced to Supabase Storage.');
      return;
    }

    if (!hasSupabaseSession) {
      showToast(
        'error',
        'Sign in with a live Supabase Administrator or Managing Editor session to sync assets into Supabase Storage.'
      );
      return;
    }

    batchPauseRef.current = false;
    batchCancelRef.current = false;
    setBatchPaused(false);
    setBatchRunning(true);
    setBatchProgress({ done: 0, total: targets.length });

    let cursor = 0;
    const processNext = async (): Promise<void> => {
      while (cursor < targets.length) {
        if (batchCancelRef.current) return;
        while (batchPauseRef.current) {
          if (batchCancelRef.current) return;
          await new Promise((r) => setTimeout(r, 300));
        }

        const item = targets[cursor];
        cursor += 1;
        await handleApproveAndSave(item.articleId, { uploadToSupabase: true });
        setBatchProgress((p) => ({ ...p, done: Math.min(p.total, p.done + 1) }));
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(MAX_CONCURRENT_UPLOADS, targets.length) }, () => processNext())
    );

    setBatchRunning(false);
    setBatchPaused(false);
    showToast(
      batchCancelRef.current ? 'info' : 'success',
      batchCancelRef.current
        ? 'Supabase Storage sync cancelled.'
        : `Completed Supabase Storage upload queue for ${targets.length} articles.`
    );
  };

  const handleApproveAllStaged = async () => {
    const stagedList = jobs.filter((j) => j.status === 'GENERATED');
    if (stagedList.length === 0) return;
    for (const item of stagedList) {
      await handleApproveAndSave(item.articleId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden input for quick single-row upload */}
      <input
        ref={rowFileInputRef}
        type="file"
        accept="image/webp,image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && uploadTargetId) {
            handleProcessSelectedFile(uploadTargetId, file);
          }
          setUploadTargetId(null);
        }}
      />

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00B894] uppercase tracking-wider">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Media Pipeline / Featured Images</span>
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-[#0D1F3C] mt-1">
            Article Featured Image Studio
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Audit 1:1 image uniqueness, optimize uploaded visuals to 1280×720 16:9 WebP, edit alt metadata, and sync assets to Supabase Storage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={loadInventory}
            disabled={isLoading || batchRunning}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F5F8FC] border border-[#CBD5E1] text-[#0D1F3C] font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Scan All Articles</span>
          </button>

          {!batchRunning ? (
            <button
              onClick={handleBatchSyncToSupabase}
              disabled={stats.total === stats.supabaseSynced}
              title={
                hasSupabaseSession
                  ? 'Upload local 1280×720 WebP assets into Supabase Storage'
                  : 'Requires active Supabase Admin/Editor session'
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <CloudUpload className="w-3.5 h-3.5 text-[#00B894]" />
              <span>Sync Local WebP to Storage ({stats.total - stats.supabaseSynced})</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2">
              <button
                onClick={() => {
                  const next = !batchPauseRef.current;
                  batchPauseRef.current = next;
                  setBatchPaused(next);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 border border-amber-300 text-amber-900 font-semibold text-xs rounded-lg cursor-pointer"
              >
                {batchPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{batchPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                onClick={() => {
                  batchCancelRef.current = true;
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs rounded-lg cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel ({batchProgress.done}/{batchProgress.total})</span>
              </button>
            </div>
          )}

          {stats.readyReview > 0 && (
            <button
              onClick={handleApproveAllStaged}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00B894] hover:bg-[#009b7c] text-[#0D1F3C] font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Approve Staged ({stats.readyReview})</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : toast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-sky-50 border-sky-200 text-sky-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-0.5 hover:opacity-70 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Single-Elevation Tabular KPI Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl grid grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0]">
        <div className="p-4">
          <span className="text-[11px] font-mono uppercase text-[#6B7280] block">Total Articles</span>
          <span className="font-heading text-2xl font-extrabold text-[#0D1F3C] tabular-nums mt-0.5 block">
            {stats.total}
          </span>
        </div>
        <div className="p-4">
          <span className="text-[11px] font-mono uppercase text-[#6B7280] block">Unique 16:9 Assets</span>
          <span className="font-heading text-2xl font-extrabold text-emerald-700 tabular-nums mt-0.5 block">
            {stats.completed}
          </span>
        </div>
        <div className="p-4">
          <span className="text-[11px] font-mono uppercase text-[#6B7280] block">Pending / Review</span>
          <span className="font-heading text-2xl font-extrabold text-amber-700 tabular-nums mt-0.5 block">
            {stats.needsAction}
          </span>
        </div>
        <div className="p-4">
          <span className="text-[11px] font-mono uppercase text-[#6B7280] block">Duplicate URLs</span>
          <span
            className={`font-heading text-2xl font-extrabold tabular-nums mt-0.5 block ${
              stats.duplicates > 0 ? 'text-rose-700' : 'text-[#0D1F3C]'
            }`}
          >
            {stats.duplicates}
          </span>
        </div>
        <div className="p-4 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-mono uppercase text-[#6B7280] block">Missing Alt Text</span>
          <span className="font-heading text-2xl font-extrabold text-[#0D1F3C] tabular-nums mt-0.5 block">
            {stats.missingAlt}
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'COMPLETED', 'GENERATED', 'PENDING', 'NEEDS_REVIEW', 'FAILED'] as const).map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 rounded-md font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#0D1F3C] text-white'
                    : 'bg-[#F5F8FC] text-[#303846] hover:bg-[#E2E8F0]'
                }`}
              >
                {st === 'GENERATED' ? 'STAGED_UPLOAD' : st}
              </button>
            )
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F5F8FC] border border-[#CBD5E1] rounded-lg text-xs text-[#303846] focus:outline-none"
          >
            <option value="all">All Category Folders</option>
            {(Object.keys(CATEGORY_FOLDER_LABELS) as CategoryImageFolder[]).map((folder) => (
              <option key={folder} value={folder}>
                {CATEGORY_FOLDER_LABELS[folder]} ({folder}/)
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, slug, path..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F5F8FC] border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none focus:ring-1 focus:ring-[#00B894]"
            />
            <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Inventory Data Grid */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#6B7280]">
              <tr>
                <th className="p-3.5 font-semibold w-36">16:9 Preview</th>
                <th className="p-3.5 font-semibold">Article & Alt Coverage</th>
                <th className="p-3.5 font-semibold">Storage Target Path</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#303846]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-3.5">
                      <div className="w-32 aspect-video rounded bg-slate-200 animate-pulse" />
                    </td>
                    <td className="p-3.5">
                      <div className="h-4 w-64 bg-slate-200 rounded animate-pulse mb-2" />
                      <div className="h-3 w-48 bg-slate-100 rounded animate-pulse" />
                    </td>
                    <td className="p-3.5">
                      <div className="h-3 w-44 bg-slate-100 rounded animate-pulse" />
                    </td>
                    <td className="p-3.5">
                      <div className="h-5 w-20 bg-slate-100 rounded animate-pulse" />
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="h-7 w-24 bg-slate-100 rounded animate-pulse ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-xs text-[#6B7280]">
                    No articles match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const badge = STATUS_BADGE_MAP[job.status];
                  const activeThumb = job.previewDataUrl || job.currentImageUrl;
                  return (
                    <tr key={job.articleId} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="p-3.5 align-top">
                        <button
                          onClick={() => openReviewModal(job)}
                          className="block w-32 rounded-md overflow-hidden border border-[#E2E8F0] hover:border-[#00B894] transition-colors cursor-pointer"
                          title="Inspect & Edit Image"
                        >
                          <ArticleFeaturedImage
                            src={activeThumb}
                            alt={job.altText}
                            title={job.title}
                            categoryName={CATEGORY_FOLDER_LABELS[job.categoryFolder as CategoryImageFolder]}
                            aspectClassName="aspect-video"
                          />
                        </button>
                      </td>

                      <td className="p-3.5 align-top max-w-md">
                        <div className="font-semibold text-[#0D1F3C] leading-snug line-clamp-2">
                          {job.title}
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-1 line-clamp-1">
                          <span className="font-mono text-[#163A5F]">ALT:</span>{' '}
                          {job.altText || 'Missing alt text'}
                        </div>
                        {job.errorMessage && (
                          <div className="mt-1.5 text-[11px] text-rose-700 font-medium">
                            {job.errorMessage}
                          </div>
                        )}
                      </td>

                      <td className="p-3.5 align-top">
                        <div className="font-mono text-[11px] text-[#163A5F] break-all">
                          {job.expectedStoragePath}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-mono">
                          <span className="text-[#00B894] inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            1280×720 WebP
                          </span>
                          {job.isSupabaseHosted && (
                            <span className="text-sky-700 font-semibold">SUPABASE_STORAGE</span>
                          )}
                          {job.isDuplicate && (
                            <span className="text-rose-700 font-semibold">DUPLICATE URL</span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 align-top whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td className="p-3.5 align-top text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openReviewModal(job)}
                            className="px-2.5 py-1.5 bg-[#F5F8FC] hover:bg-[#E2E8F0] text-[#0D1F3C] rounded-md font-semibold inline-flex items-center gap-1 cursor-pointer"
                            title="Preview & Edit Metadata"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>

                          <button
                            onClick={() => triggerRowUpload(job.articleId)}
                            disabled={job.status === 'GENERATING' || job.status === 'UPLOADING'}
                            className="px-2.5 py-1.5 bg-[#0D1F3C] hover:bg-[#163A5F] text-white rounded-md font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Replace with 16:9 WebP/PNG/JPEG File"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#00B894]" />
                            <span>Upload</span>
                          </button>

                          <button
                            onClick={() => handleCopyPrompt(job)}
                            className="p-1.5 bg-[#F5F8FC] hover:bg-[#E2E8F0] text-[#303846] rounded-md cursor-pointer"
                            title="Copy Tailored Editorial Prompt"
                          >
                            {copiedPromptId === job.articleId ? (
                              <Check className="w-3.5 h-3.5 text-emerald-700" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {job.status === 'GENERATED' && (
                            <button
                              onClick={() => handleApproveAndSave(job.articleId)}
                              className="px-2.5 py-1.5 bg-[#00B894] hover:bg-[#009b7c] text-[#0D1F3C] rounded-md font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          <Link
                            to={`/admin/articles/edit/${job.articleId}`}
                            className="p-1.5 text-[#6B7280] hover:text-[#0D1F3C]"
                            title="Open in Full Article Editor"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Image Review & Approval Modal */}
      {activeReviewJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-4xl w-full p-6 space-y-5 shadow-xl my-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="font-mono text-[11px] text-[#00B894] uppercase font-semibold">
                  Featured Image Quality Review · {activeReviewJob.expectedStoragePath}
                </span>
                <h2 className="font-heading text-lg font-bold text-[#0D1F3C] mt-0.5">
                  {activeReviewJob.title}
                </h2>
              </div>
              <button
                onClick={() => setReviewJobId(null)}
                className="p-1.5 text-[#6B7280] hover:text-[#0D1F3C] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-[#6B7280] block">
                  Current Live Asset ({activeReviewJob.currentImageUrl})
                </span>
                <div className="rounded-xl overflow-hidden border border-[#E2E8F0]">
                  <ArticleFeaturedImage
                    src={activeReviewJob.currentImageUrl}
                    alt={draftAlt || activeReviewJob.title}
                    title={activeReviewJob.title}
                    aspectClassName="aspect-video"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-[#00B894] block">
                  {activeReviewJob.previewDataUrl
                    ? 'Staged 1280×720 WebP Candidate Preview (16:9)'
                    : 'Active Asset Preview (16:9)'}
                </span>
                <div className="rounded-xl overflow-hidden border border-[#E2E8F0]">
                  <ArticleFeaturedImage
                    src={activeReviewJob.previewDataUrl || activeReviewJob.currentImageUrl}
                    alt={draftAlt || activeReviewJob.title}
                    title={activeReviewJob.title}
                    aspectClassName="aspect-video"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0D1F3C] mb-1">
                  Accessible Image Alt Text (SEO & Screen Readers)
                </label>
                <input
                  type="text"
                  value={draftAlt}
                  onChange={(e) => setDraftAlt(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none focus:ring-1 focus:ring-[#00B894]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#0D1F3C] mb-1">
                  Editorial Figure Caption
                </label>
                <input
                  type="text"
                  value={draftCaption}
                  onChange={(e) => setDraftCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none focus:ring-1 focus:ring-[#00B894]"
                />
              </div>
            </div>

            <div className="text-xs">
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-[#0D1F3C]">
                  Tailored Editorial Art-Direction Brief (Matched to Article Topic & Category)
                </label>
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(activeReviewJob, draftPrompt)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#163A5F] hover:text-[#0D1F3C] cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Brief</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={draftPrompt}
                onChange={(e) => setDraftPrompt(e.target.value)}
                className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg font-mono text-[11px] text-[#303846] focus:outline-none focus:ring-1 focus:ring-[#00B894]"
              />
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
              <Link
                to={`/articles/${activeReviewJob.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-[#163A5F] hover:underline font-medium"
              >
                <span>Open Public Article</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="flex flex-wrap items-center gap-2">
                <label className="px-4 py-2 bg-white hover:bg-[#F5F8FC] border border-[#CBD5E1] text-[#0D1F3C] font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#00B894]" />
                  <span>Select 16:9 Image File</span>
                  <input
                    type="file"
                    accept="image/webp,image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleProcessSelectedFile(activeReviewJob.articleId, file);
                      }
                    }}
                  />
                </label>

                <button
                  onClick={() =>
                    handleApproveAndSave(activeReviewJob.articleId, {
                      altText: draftAlt,
                      caption: draftCaption,
                      prompt: draftPrompt,
                    })
                  }
                  disabled={activeReviewJob.status === 'UPLOADING'}
                  className="px-4 py-2 bg-[#00B894] hover:bg-[#009b7c] text-[#0D1F3C] font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Save to Article</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
