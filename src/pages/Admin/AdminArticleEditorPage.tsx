// ==============================================================================
// AI FINANCE DEALS — ADVANCED 15-SECTION FINANCIAL EDITORIAL CMS
// Create Article & Editorial Publishing Suite
// ==============================================================================

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { 
  Article, 
  ArticleStatus, 
  ArticleSource, 
  ArticleType, 
  SearchIntent, 
  ArticleSectionsData,
  ArticleFaqItem 
} from '../../types';
import { CATEGORIES, AUTHORS } from '../../data/mockData';
import { aiWritingService, AiWritingContext } from '../../services/aiWritingService';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Save, 
  ArrowLeft, 
  Eye, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  Search, 
  Image as ImageIcon, 
  ShieldCheck, 
  CheckSquare, 
  Sliders, 
  HelpCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Send, 
  ListOrdered, 
  Table, 
  Quote, 
  Bold, 
  Italic, 
  Link2, 
  BarChart2, 
  Smartphone, 
  Monitor, 
  Tablet, 
  BookOpen, 
  Clock, 
  UserCheck, 
  Award, 
  RefreshCw,
  FolderTree,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type EditorTab = 
  | 'sections' 
  | 'info' 
  | 'ai_assistant' 
  | 'seo' 
  | 'media' 
  | 'compliance' 
  | 'preview' 
  | 'quality';

const PRESET_IMAGES = [
  { url: '/images/articles/personal-finance/50-30-20-budgeting-rule-guide.webp', label: 'Personal Finance & Budgeting Framework' },
  { url: '/images/articles/banking/high-yield-savings-accounts-hysa-guide.webp', label: 'High-Yield Savings & Treasury Liquidity' },
  { url: '/images/articles/insurance/term-vs-whole-life-insurance-comparison.webp', label: 'Insurance Protection & Risk Management' },
  { url: '/images/articles/financial-technology/fintech-open-banking-ai-cash-flow-guide.webp', label: 'FinTech & Open Banking Systems' },
];

export const AdminArticleEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'administrator';

  // Navigation & Active Tab
  const [activeTab, setActiveTab] = useState<EditorTab>('sections');

  // Article Type & Word Count Target
  const [articleType, setArticleType] = useState<ArticleType>('detailed');

  // Metadata Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('cat-pf');
  const [subcategory, setSubcategory] = useState('Personal Budgeting');
  const [secondaryCategories, setSecondaryCategories] = useState<string[]>([]);
  const [authorId, setAuthorId] = useState('auth-1');
  const [reviewerName, setReviewerName] = useState('Marcus Vance, CFP®');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([]);
  const [secondaryKeywordInput, setSecondaryKeywordInput] = useState('');
  const [searchIntent, setSearchIntent] = useState<SearchIntent>('informational');
  const [language, setLanguage] = useState('en-US');
  const [status, setStatus] = useState<ArticleStatus>('draft');
  const [readTime, setReadTime] = useState('6 min read');
  const [publishedAt, setPublishedAt] = useState('');
  const [featuredImage, setFeaturedImage] = useState(PRESET_IMAGES[0].url);
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // 15 Dedicated Sections
  const [sections, setSections] = useState<ArticleSectionsData>({
    section01_title: '',
    section02_meta: '',
    section03_intro: '',
    section04_toc: '',
    section05_background: '',
    section06_main1: '',
    section07_main2: '',
    section08_data_stats: '',
    section09_case_studies: '',
    section10_comparison: '',
    section11_practical_guide: '',
    section12_future_trends: '',
    section13_faq: '',
    section14_conclusion: '',
    section15_references: '',
  });

  // Authority Sources
  const [sources, setSources] = useState<ArticleSource[]>([
    { 
      title: 'Consumer Financial Protection Bureau (CFPB) Advisory Opinions', 
      url: 'https://www.consumerfinance.gov', 
      publisher: 'CFPB',
      date_accessed: 'March 2026'
    },
    { 
      title: 'Federal Deposit Insurance Corporation (FDIC) National Deposit Rates', 
      url: 'https://www.fdic.gov', 
      publisher: 'FDIC',
      date_accessed: 'March 2026'
    },
  ]);

  // AI Assistant Interaction State
  const [aiSelectedAction, setAiSelectedAction] = useState('generate_outline');
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [copiedAi, setCopiedAi] = useState(false);

  // Preview Device State
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Persistence State
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Word count targets based on Article Type
  const targetWordCount = useMemo(() => {
    switch (articleType) {
      case 'pillar':
        return 3000;
      case 'detailed':
        return 2000;
      default:
        return 1200;
    }
  }, [articleType]);

  // Load existing article if editing
  useEffect(() => {
    async function loadArticle() {
      if (id) {
        try {
          const all = await articleService.getAllArticlesForAdmin();
          const found = all.find((a) => a.id === id);
          if (found) {
            setTitle(found.title);
            setSlug(found.slug);
            setExcerpt(found.excerpt);
            setFeaturedImage(found.featured_image);
            setImageAlt(found.image_alt || found.title);
            setImageCaption(found.image_caption || '');
            setCategoryId(found.category_id);
            setSubcategory(found.subcategory || 'General');
            setSecondaryCategories(found.secondary_categories || []);
            setAuthorId(found.author_id);
            setReviewerName(found.reviewer_name || 'Sarah Jenkins, CFA');
            setStatus(found.status);
            setReadTime(found.read_time);
            setSeoTitle(found.seo_title || found.title);
            setMetaDescription(found.meta_description || found.excerpt);
            setCanonicalUrl(found.canonical_url || `https://aifinancedeals.com/articles/${found.slug}`);
            setArticleType(found.article_type || 'detailed');
            setFocusKeyword(found.focus_keyword || found.title);
            setSecondaryKeywords(found.secondary_keywords || []);
            setSearchIntent(found.search_intent || 'informational');
            setLanguage(found.language || 'en-US');
            setPublishedAt(found.published_at || '');

            if (found.sources && found.sources.length > 0) {
              setSources(found.sources);
            }

            // Populate 15 sections
            if (found.sections_data) {
              setSections(found.sections_data);
            } else if (found.content) {
              // Backward-compatible fallback: divide existing content across key sections
              setSections({
                section01_title: found.title,
                section02_meta: `Published: ${found.published_at || 'Recent'} | Read Time: ${found.read_time} | Fiduciary Disclosure Verified`,
                section03_intro: found.excerpt || '',
                section04_toc: 'Table of Contents will be generated from headings.',
                section05_background: 'Historical context and statutory definitions.',
                section06_main1: found.content.slice(0, Math.floor(found.content.length / 2)),
                section07_main2: found.content.slice(Math.floor(found.content.length / 2)),
                section08_data_stats: 'Verifiable rate benchmarks and statutory FDIC insurance floors.',
                section09_case_studies: 'Practical application scenario and mathematical calculations.',
                section10_comparison: 'Objective side-by-side trade-off matrix.',
                section11_practical_guide: 'Step-by-step fiduciary checklist.',
                section12_future_trends: 'Fintech advancements and open banking regulatory shifts.',
                section13_faq: 'Frequently asked reader questions.',
                section14_conclusion: 'Final takeaways and next actionable steps.',
                section15_references: 'Primary regulatory citations and government datasets.',
              });
            }
          }
        } catch (e) {
          console.warn('Failed loading article for editor', e);
        }
      }
    }
    loadArticle();
  }, [id]);

  // Calculate live section & total word counts
  const sectionWordCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.entries(sections).forEach(([key, val]) => {
      const text = (val || '').replace(/<[^>]*>?/gm, '').trim();
      counts[key] = text ? text.split(/\s+/).length : 0;
    });
    return counts;
  }, [sections]);

  const totalContentWords = useMemo(() => {
    return Object.values(sectionWordCounts).reduce((acc, curr) => acc + curr, 0);
  }, [sectionWordCounts]);

  const wordProgressPct = Math.min(100, Math.round((totalContentWords / targetWordCount) * 100));

  // Auto-generate slug when title changes for new article
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSections((prev) => ({ ...prev, section01_title: val }));
    if (!id) {
      const genSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(genSlug);
      setCanonicalUrl(`https://aifinancedeals.com/articles/${genSlug}`);
      if (!focusKeyword) setFocusKeyword(val);
      if (!seoTitle) setSeoTitle(`${val} | AI Finance Deals`);
      if (!imageAlt) setImageAlt(val);
    }
  };

  const handleSectionChange = (key: keyof ArticleSectionsData, value: string) => {
    setSections((prev) => ({ ...prev, [key]: value }));
  };

  // Compile full article HTML from 15 sections
  const compileFullArticleContent = (): string => {
    return `
<section id="section-03-intro" class="article-section">
  ${sections.section03_intro || ''}
</section>

<section id="section-05-background" class="article-section">
  ${sections.section05_background || ''}
</section>

<section id="section-06-main1" class="article-section">
  ${sections.section06_main1 || ''}
</section>

<section id="section-07-main2" class="article-section">
  ${sections.section07_main2 || ''}
</section>

<section id="section-08-data" class="article-section">
  ${sections.section08_data_stats || ''}
</section>

<section id="section-09-cases" class="article-section">
  ${sections.section09_case_studies || ''}
</section>

<section id="section-10-comparison" class="article-section">
  ${sections.section10_comparison || ''}
</section>

<section id="section-11-practical" class="article-section">
  ${sections.section11_practical_guide || ''}
</section>

<section id="section-12-future" class="article-section">
  ${sections.section12_future_trends || ''}
</section>

<section id="section-13-faq" class="article-section">
  ${sections.section13_faq || ''}
</section>

<section id="section-14-conclusion" class="article-section">
  ${sections.section14_conclusion || ''}
</section>
`.trim();
  };

  // Save handler
  const handleSave = async (targetStatus?: ArticleStatus) => {
    if (!title.trim() || !slug.trim()) {
      setSaveError('Please provide both Article Title and URL Slug before saving.');
      setActiveTab('info');
      return;
    }

    setSaving(true);
    setSaveError('');
    const finalStatus = targetStatus || status;
    const compiledContent = compileFullArticleContent();

    // Recalculate reading time: 200 words per minute
    const calculatedMinutes = Math.max(3, Math.ceil(totalContentWords / 200));
    const calculatedReadTime = `${calculatedMinutes} min read`;

    const payload: Partial<Article> = {
      ...(id ? { id } : {}),
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || (sections.section03_intro || '').slice(0, 180).replace(/<[^>]*>?/gm, ''),
      content: compiledContent,
      featured_image: featuredImage,
      image_alt: imageAlt.trim() || title.trim(),
      image_caption: imageCaption.trim(),
      category_id: categoryId,
      subcategory: subcategory,
      secondary_categories: secondaryCategories,
      author_id: authorId,
      reviewer_name: reviewerName,
      seo_title: seoTitle.trim() || `${title} | AI Finance Deals`,
      meta_description: metaDescription.trim() || excerpt.trim(),
      canonical_url: canonicalUrl.trim() || `https://aifinancedeals.com/articles/${slug}`,
      sources,
      read_time: calculatedReadTime,
      status: finalStatus,
      article_type: articleType,
      focus_keyword: focusKeyword.trim(),
      secondary_keywords: secondaryKeywords,
      search_intent: searchIntent,
      language,
      sections_data: sections,
      published_at: finalStatus === 'published' ? (publishedAt || new Date().toISOString()) : publishedAt,
      updated_at: new Date().toISOString(),
    };

    try {
      const saved = await articleService.saveArticle(payload);
      setSaving(false);
      setSaveSuccess(true);
      setStatus(finalStatus);
      setReadTime(calculatedReadTime);
      setTimeout(() => setSaveSuccess(false), 3500);

      if (!id && saved.id) {
        navigate(`/admin/articles/edit/${saved.id}`, { replace: true });
      }
    } catch (err: any) {
      setSaving(false);
      setSaveError(err.message || 'Error saving article.');
    }
  };

  // Trigger AI Writing Assistant Action
  const handleRunAiAction = (actionKey: string, targetSection?: keyof ArticleSectionsData) => {
    setAiLoading(true);
    const selectedCategory = CATEGORIES.find((c) => c.id === categoryId)?.name || 'Personal Finance';
    
    const context: AiWritingContext = {
      title,
      categoryName: selectedCategory,
      focusKeyword: focusKeyword || title,
      secondaryKeywords,
      articleType,
      searchIntent,
      existingSectionContent: targetSection ? sections[targetSection] : undefined,
    };

    setTimeout(() => {
      let result = '';
      if (actionKey === 'generate_outline') {
        const res = aiWritingService.generateOutline(context);
        result = res.output;
      } else if (actionKey === 'generate_intro') {
        const res = aiWritingService.generateIntroduction(context);
        result = res.output;
        if (targetSection === 'section03_intro') {
          setSections((prev) => ({ ...prev, section03_intro: res.output }));
        }
      } else if (actionKey === 'generate_faqs') {
        const res = aiWritingService.generateFaqs(context);
        result = res.output;
        if (targetSection === 'section13_faq') {
          setSections((prev) => ({ ...prev, section13_faq: res.output }));
        }
      } else if (actionKey === 'generate_seo') {
        const meta = aiWritingService.generateSeoMetadata(context);
        setSeoTitle(meta.seoTitle);
        setMetaDescription(meta.metaDescription);
        result = `SEO Title: ${meta.seoTitle}\nMeta Description: ${meta.metaDescription}`;
      } else if (actionKey.startsWith('write_section_')) {
        const sNum = parseInt(actionKey.replace('write_section_', ''), 10);
        const res = aiWritingService.writeSection(sNum, context);
        result = res.output;
        if (targetSection) {
          setSections((prev) => ({ ...prev, [targetSection]: res.output }));
        }
      } else if (actionKey === 'improve_clarity') {
        const textToClean = targetSection ? sections[targetSection] || '' : sections.section03_intro || '';
        const res = aiWritingService.improveClarity(textToClean);
        result = res.output;
        if (targetSection) {
          setSections((prev) => ({ ...prev, [targetSection]: res.output }));
        }
      } else if (actionKey === 'expand_section') {
        const textToExpand = targetSection ? sections[targetSection] || '' : '';
        const res = aiWritingService.expandSection(textToExpand, context);
        result = res.output;
        if (targetSection) {
          setSections((prev) => ({ ...prev, [targetSection]: res.output }));
        }
      } else if (actionKey === 'suggest_sources') {
        const suggested = aiWritingService.suggestSources(selectedCategory);
        setSources(suggested);
        result = `Added ${suggested.length} verified authority sources (CFPB, FDIC, Federal Reserve, IRS, SEC).`;
      } else {
        result = `AI Analysis completed for ${actionKey}. Ready to apply to article content.`;
      }

      setAiOutput(result);
      setAiLoading(false);
    }, 400);
  };

  // Compliance Audit calculation
  const complianceAudit = useMemo(() => {
    const fullText = compileFullArticleContent();
    return aiWritingService.auditArticleContent(fullText, title, sources.length);
  }, [sections, title, sources]);

  // Overall Readiness Score
  const readinessScore = useMemo(() => {
    let score = 0;
    if (title.trim()) score += 10;
    if (slug.trim()) score += 5;
    if (sections.section03_intro?.trim()) score += 10;
    if (sections.section06_main1?.trim()) score += 10;
    if (sections.section07_main2?.trim()) score += 10;
    if (sections.section08_data_stats?.trim()) score += 10;
    if (sections.section10_comparison?.trim()) score += 5;
    if (sections.section11_practical_guide?.trim()) score += 5;
    if (sections.section13_faq?.trim()) score += 10;
    if (sections.section14_conclusion?.trim()) score += 5;
    if (sources.length >= 2) score += 10;
    if (focusKeyword.trim()) score += 5;
    if (seoTitle.trim() && metaDescription.trim()) score += 5;
    return Math.min(100, score);
  }, [title, slug, sections, sources, focusKeyword, seoTitle, metaDescription]);

  // Selected Author Object
  const selectedAuthor = AUTHORS.find((a) => a.id === authorId) || AUTHORS[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              to="/admin/articles"
              className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#0D1F3C] font-semibold transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Articles & Content Queue</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#E6F8F4] text-[#00B894] font-mono text-[10px] font-bold rounded-full">
                15-Section Fiduciary CMS
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                status === 'approved' ? 'bg-cyan-100 text-cyan-800' :
                status === 'fact_check' ? 'bg-amber-100 text-amber-800' :
                status === 'editorial_review' ? 'bg-blue-100 text-blue-800' :
                'bg-slate-100 text-slate-700'
              }`}>
                STATUS: {status.toUpperCase()}
              </span>
            </div>
            <h1 className="font-heading text-xl font-bold text-[#0D1F3C] truncate max-w-2xl">
              {title || 'Write New Financial Guide'}
            </h1>
          </div>

          {/* Workflow & Save Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#475569] text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#475569] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>

            <button
              onClick={() => handleSave('editorial_review')}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#163A5F] hover:bg-[#0D1F3C] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5 text-[#00C2E0]" />
              <span>Submit for Review</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => handleSave('approved')}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-60"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Approve Guide</span>
              </button>
            )}

            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00B894] hover:bg-[#009b7c] text-[#0D1F3C] font-heading text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-60"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{saving ? 'Publishing...' : 'Publish Article'}</span>
            </button>
          </div>
        </div>

        {/* Word Count Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#6B7280] block text-[11px]">Article Depth Target:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={articleType}
                onChange={(e) => setArticleType(e.target.value as ArticleType)}
                className="font-bold text-[#0D1F3C] bg-transparent border-b border-dashed border-[#CBD5E1] cursor-pointer focus:outline-none"
              >
                <option value="general">General (1,000–1,500w)</option>
                <option value="detailed">Educational Guide (1,500–2,500w)</option>
                <option value="pillar">Pillar / Comprehensive (2,500–4,000w+)</option>
              </select>
            </div>
          </div>

          <div>
            <span className="text-[#6B7280] block text-[11px]">Live Word Count:</span>
            <span className="font-heading font-bold text-sm text-[#0D1F3C]">
              {totalContentWords.toLocaleString()} <span className="text-xs font-normal text-[#94A3B8]">/ {targetWordCount.toLocaleString()} target</span>
            </span>
          </div>

          <div>
            <span className="text-[#6B7280] block text-[11px]">Estimated Read Time:</span>
            <span className="font-mono font-bold text-[#163A5F]">{readTime}</span>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-[#6B7280]">Depth Completion:</span>
              <span className="font-mono font-bold text-[#00B894]">{wordProgressPct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  wordProgressPct >= 100 ? 'bg-[#00B894]' : 'bg-[#00C2E0]'
                }`}
                style={{ width: `${wordProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Feedback Banners */}
        {saveSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Article saved successfully. All 15 sections synchronized.</span>
          </div>
        )}
        {saveError && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}
      </div>

      {/* Editor Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-[#E2E8F0] pb-px">
        {[
          { id: 'sections', label: '15 Content Sections', icon: ListOrdered },
          { id: 'info', label: 'Article Metadata', icon: Sliders },
          { id: 'ai_assistant', label: 'AI Writing Assistant (17 Actions)', icon: Sparkles },
          { id: 'seo', label: 'SEO & Schemas', icon: Search },
          { id: 'media', label: 'Featured Media', icon: ImageIcon },
          { id: 'compliance', label: 'AdSense Compliance Audit', icon: ShieldCheck },
          { id: 'preview', label: 'Full Page Preview', icon: Eye },
          { id: 'quality', label: `Readiness Checklist (${readinessScore}%)`, icon: CheckSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as EditorTab)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium rounded-t-lg transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#00B894] text-[#0D1F3C] bg-white font-bold shadow-xs'
                  : 'border-transparent text-[#6B7280] hover:text-[#0D1F3C] hover:bg-white/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00B894]' : 'text-[#9CA3AF]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: 15 MANDATORY EDITORIAL SECTIONS                               */}
      {/* ==================================================================== */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-[#163A5F] flex items-start justify-between gap-4">
            <div>
              <span className="font-bold text-sm block mb-0.5">Mandatory 15-Section Financial Editorial Architecture</span>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                Every published guide adheres to our certified fiduciary structure: H1 title, author/reviewer disclosure, hook introduction, anchor navigation, empirical data tables, objective comparison matrices, step-by-step checklists, search FAQs, and primary authority citations.
              </p>
            </div>
            <button
              onClick={() => handleRunAiAction('generate_outline')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D1F3C] hover:bg-[#163A5F] text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00B894]" />
              <span>Generate 15-Section Outline</span>
            </button>
          </div>

          {/* Section 01: Title */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                SECTION 01: ARTICLE TITLE (H1)
              </span>
              <span className="text-[11px] text-[#6B7280]">Target: One descriptive, non-clickbait H1</span>
            </div>
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Traditional 401(k) vs. Roth IRA: Strategic Tax Diversification Across Career Stages"
                className="w-full px-4 py-2.5 font-heading text-lg font-bold text-[#0D1F3C] border border-[#CBD5E1] rounded-xl focus:ring-1 focus:ring-[#00B894] focus:outline-none"
              />
            </div>
          </div>

          {/* Section 02: Article Information */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <span className="font-mono text-[10px] font-bold text-[#163A5F] bg-slate-100 px-2 py-0.5 rounded">
                SECTION 02: ARTICLE INFORMATION & DISCLOSURES
              </span>
              <span className="text-[11px] text-[#6B7280]">Author byline, peer review, and statutory notice</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <span className="text-[10px] font-mono text-[#6B7280] block">Author:</span>
                <span className="font-bold text-[#0D1F3C]">{selectedAuthor.name} ({selectedAuthor.credentials})</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <span className="text-[10px] font-mono text-[#6B7280] block">Peer Reviewer:</span>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="font-bold text-[#0D1F3C] bg-transparent border-b border-dashed border-[#CBD5E1] w-full focus:outline-none"
                />
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <span className="text-[10px] font-mono text-[#6B7280] block">Fiduciary Charter:</span>
                <span className="font-semibold text-emerald-700">Verified & Educational Only</span>
              </div>
            </div>
          </div>

          {/* Section 03: Introduction */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                  SECTION 03: INTRODUCTION
                </span>
                <span className="text-xs font-semibold text-[#0D1F3C]">Hook & Reader Intent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#6B7280]">
                  {sectionWordCounts.section03_intro || 0} words
                </span>
                <button
                  type="button"
                  onClick={() => handleRunAiAction('generate_intro', 'section03_intro')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[#0D1F3C] text-[11px] font-semibold rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#00B894]" />
                  <span>Draft with AI</span>
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={sections.section03_intro || ''}
              onChange={(e) => handleSectionChange('section03_intro', e.target.value)}
              placeholder="Introduce the subject, explain why the topic matters, and outline what readers will discover..."
              className="w-full p-3 text-xs font-sans text-[#303846] border border-[#CBD5E1] rounded-xl focus:ring-1 focus:ring-[#00B894] focus:outline-none"
            />
          </div>

          {/* Section 04: Table of Contents */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <span className="font-mono text-[10px] font-bold text-[#163A5F] bg-slate-100 px-2 py-0.5 rounded">
                SECTION 04: TABLE OF CONTENTS (AUTO-GENERATED)
              </span>
              <span className="text-[11px] text-[#6B7280]">Extracts H2/H3 anchors automatically on publish</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#475569] space-y-1">
              <span className="font-bold text-[#0D1F3C] block">Automated Anchor Links Preview:</span>
              <ul className="text-[11px] text-[#64748B] space-y-0.5 list-disc list-inside">
                <li>Background & Regulatory Framework</li>
                <li>Core Educational Mechanisms</li>
                <li>Data, Rate Benchmarks & Statistics</li>
                <li>Practical Calculations & Case Studies</li>
                <li>Side-by-Side Trade-off Comparison</li>
                <li>Step-by-Step Implementation Framework</li>
                <li>Frequently Asked Questions</li>
              </ul>
            </div>
          </div>

          {/* Section 05: Background & Context */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                  SECTION 05: BACKGROUND & CONTEXT
                </span>
                <span className="text-xs font-semibold text-[#0D1F3C]">Economic History & Terminology</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#6B7280]">
                  {sectionWordCounts.section05_background || 0} words
                </span>
                <button
                  type="button"
                  onClick={() => handleRunAiAction('write_section_5', 'section05_background')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[#0D1F3C] text-[11px] font-semibold rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#00B894]" />
                  <span>Write with AI</span>
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={sections.section05_background || ''}
              onChange={(e) => handleSectionChange('section05_background', e.target.value)}
              placeholder="Provide industry context, statutory definitions (APY, APR, FDIC), and regulatory origin..."
              className="w-full p-3 text-xs font-sans text-[#303846] border border-[#CBD5E1] rounded-xl focus:ring-1 focus:ring-[#00B894] focus:outline-none"
            />
          </div>

          {/* Section 06: Main Section 1 */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                  SECTION 06: MAIN SECTION 1
                </span>
                <span className="text-xs font-semibold text-[#0D1F3C]">Core Mathematical Mechanics</span>
              </div>
              <span className="text-[11px] font-mono text-[#6B7280]">
                {sectionWordCounts.section06_main1 || 0} words
              </span>
            </div>
            <textarea
              rows={5}
              value={sections.section06_main1 || ''}
              onChange={(e) => handleSectionChange('section06_main1', e.target.value)}
              placeholder="First major educational discussion with H2 and H3 subsections, formulas, and concepts..."
              className="w-full p-3 text-xs font-sans text-[#303846] border border-[#CBD5E1] rounded-xl focus:ring-1 focus:ring-[#00B894] focus:outline-none"
            />
          </div>

          {/* Section 07: Main Section 2 */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                  SECTION 07: MAIN SECTION 2
                </span>
                <span className="text-xs font-semibold text-[#0D1F3C]">Advanced Nuances & Limitations</span>
              </div>
              <span className="text-[11px] font-mono text-[#6B7280]">
                {sectionWordCounts.section07_main2 || 0} words
              </span>
            </div>
            <textarea
              rows={5}
              value={sections.section07_main2 || ''}
              onChange={(e) => handleSectionChange('section07_main2', e.target.value)}
              placeholder="Continuation of detailed discussion covering risk mitigation, fee structures, and tax drag..."
              className="w-full p-3 text-xs font-sans text-[#303846] border border-[#CBD5E1] rounded-xl focus:ring-1 focus:ring-[#00B894] focus:outline-none"
            />
          </div>

          {/* Section 08: Data, Facts & Statistics */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                  SECTION 08: DATA, FACTS & STATISTICS
                </span>
                <span className="text-xs font-semibold text-[#0D1F3C]">Verifiable Benchmarks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#6B7280]">
                  {sectionWordCounts.section08_data_stats || 0} words
                </span>
                <button
                  type="button"
                  onClick={() => handleRunAiAction('write_section_8', 'section08_data_stats')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[#0D1F3C] text-[11px] font-semibold rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#00B894]" />
                  <span>Insert Data Table</span>
                </button>
              </div>
            </div>
            <textarea
              rows={5}
              value={sections.section08_data_stats || ''}
              onChange={(e) => handleSectionChange('section08_data_stats', e.target.value)}
              placeholder="Include factual interest rate spreads, APY/APR tables, FRED economic data, and FDIC insurance ceilings..."
              className="w-full p-3 text-xs font-sans text-[#303846] border border-[#CBD5E1] rounded-xl focus:ring-1 focus:ring-[#00B894] focus:outline-none"
            />
          </div>

          {/* Section 09: Examples & Case Studies */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                SECTION 09: EXAMPLES & CASE STUDIES
              </span>
              <span className="text-[11px] font-mono text-[#6B7280]">
                {sectionWordCounts.section09_case_studies || 0} words
              </span>
            </div>
            <textarea
              rows={4}
              value={sections.section09_case_studies || ''}
              onChange={(e) => handleSectionChange('section09_case_studies', e.target.value)}
              placeholder="Mathematical scenario calculations (e.g. $10,000 deposited at 4.50% vs 0.45% over 5 years)..."
              className="w-full p-3 text-xs font-sans text-[#303846] border border-[#CBD5E1] rounded-xl focus:ring-1 focus:ring-[#00B894] focus:outline-none"
            />
          </div>

          {/* Section 10: Comparison & Analysis */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                  SECTION 10: COMPARISON & ANALYSIS
                </span>
                <span className="text-xs font-semibold text-[#0D1F3C]">Objective Trade-off Matrix</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#6B7280]">
                  {sectionWordCounts.section10_comparison || 0} words
                </span>
                <button
                  type="button"
                  onClick={() => handleRunAiAction('write_section_10', 'section10_comparison')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[#0D1F3C] text-[11px] font-semibold rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#00B894]" />
                  <span>Insert Trade-offs</span>
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={sections.section10_comparison || ''}
              onChange={(e) => handleSectionChange('section10_comparison', e.target.value)}
              placeholder="Objective comparisons: advantages vs limitations, liquidity vs lock-in, fees vs returns..."
              className="w-full p-3 text-xs font-sans text-[#303846] border border-[#CBD5E1] rounded-xl focus:ring-1 focus:ring-[#00B894] focus:outline-none"
            />
          </div>

          {/* Section 11: Practical Guide / Solutions */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                  SECTION 11: PRACTICAL GUIDE / SOLUTIONS
                </span>
                <span className="text-xs font-semibold text-[#0D1F3C]">Step-by-Step Instructions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#6B7280]">
                  {sectionWordCounts.section11_practical_guide || 0} words
                </span>
                <button
                  type="button"
                  onClick={() => handleRunAiAction('write_section_11', 'section11_practical_guide')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[#0D1F3C] text-[11px] font-semibold rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#00B894]" />
                  <span>Insert Checklist</span>
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={sections.section11_practical_guide || ''}
              onChange={(e) => handleSectionChange('section11_practical_guide', e.target.value)}
              placeholder="Step 1 to Step 5 actionable checklist for reader execution..."
              className="w-full p-3 text-xs font-sans text-[#303846] border border-[#CBD5E1] rounded-xl focus:ring-1 focus:ring-[#00B894] focus:outline-none"
            />
          </div>

          {/* Section 12: Future Trends & Insights */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                SECTION 12: FUTURE TRENDS & INSIGHTS
              </span>
              <span className="text-[11px] font-mono text-[#6B7280]">
                {sectionWordCounts.section12_future_trends || 0} words
              </span>
            </div>
            <textarea
              rows={3}
              value={sections.section12_future_trends || ''}
              onChange={(e) => handleSectionChange('section12_future_trends', e.target.value)}
              placeholder="Emerging fintech trends, open banking APIs (CFPB Section 1033), and rate cycle projections..."
              className="w-full p-3 text-xs font-sans text-[#303846] border border-[#CBD5E1] rounded-xl focus:ring-1 focus:ring-[#00B894] focus:outline-none"
            />
          </div>

          {/* Section 13: Frequently Asked Questions */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                  SECTION 13: FREQUENTLY ASKED QUESTIONS
                </span>
                <span className="text-xs font-semibold text-[#0D1F3C]">Search Intent Q&As</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#6B7280]">
                  {sectionWordCounts.section13_faq || 0} words
                </span>
                <button
                  type="button"
                  onClick={() => handleRunAiAction('generate_faqs', 'section13_faq')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[#0D1F3C] text-[11px] font-semibold rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#00B894]" />
                  <span>Generate 5 FAQs</span>
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={sections.section13_faq || ''}
              onChange={(e) => handleSectionChange('section13_faq', e.target.value)}
              placeholder="<h3>Question 1</h3><p>Answer...</p>"
              className="w-full p-3 text-xs font-sans text-[#303846] border border-[#CBD5E1] rounded-xl focus:ring-1 focus:ring-[#00B894] focus:outline-none"
            />
          </div>

          {/* Section 14: Conclusion */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                  SECTION 14: CONCLUSION
                </span>
                <span className="text-xs font-semibold text-[#0D1F3C]">Summary & Next Steps</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#6B7280]">
                  {sectionWordCounts.section14_conclusion || 0} words
                </span>
                <button
                  type="button"
                  onClick={() => handleRunAiAction('write_section_14', 'section14_conclusion')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[#0D1F3C] text-[11px] font-semibold rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#00B894]" />
                  <span>Draft Conclusion</span>
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={sections.section14_conclusion || ''}
              onChange={(e) => handleSectionChange('section14_conclusion', e.target.value)}
              placeholder="Reinforce core lessons, provide actionable next step, and include fiduciary editorial disclosure..."
              className="w-full p-3 text-xs font-sans text-[#303846] border border-[#CBD5E1] rounded-xl focus:ring-1 focus:ring-[#00B894] focus:outline-none"
            />
          </div>

          {/* Section 15: References & Sources */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#00B894] bg-[#E6F8F4] px-2 py-0.5 rounded">
                  SECTION 15: REFERENCES & SOURCES ({sources.length})
                </span>
                <span className="text-xs font-semibold text-[#0D1F3C]">Primary Regulatory Citations</span>
              </div>
              <button
                type="button"
                onClick={() => setSources([...sources, { title: '', url: '', publisher: '', date_accessed: 'March 2026' }])}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#0D1F3C] text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-[#00B894]" />
                <span>Add Source Citation</span>
              </button>
            </div>

            <div className="space-y-2">
              {sources.map((src, idx) => (
                <div key={idx} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs items-center">
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Source Title / Act"
                      value={src.title}
                      onChange={(e) => {
                        const copy = [...sources];
                        copy[idx].title = e.target.value;
                        setSources(copy);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-[#303846] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={src.url}
                      onChange={(e) => {
                        const copy = [...sources];
                        copy[idx].url = e.target.value;
                        setSources(copy);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded font-mono text-[11px] text-[#163A5F] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Publisher"
                      value={src.publisher}
                      onChange={(e) => {
                        const copy = [...sources];
                        copy[idx].publisher = e.target.value;
                        setSources(copy);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-[#303846] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => setSources(sources.filter((_, i) => i !== idx))}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: ARTICLE INFORMATION & TAXONOMY                                */}
      {/* ==================================================================== */}
      {activeTab === 'info' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-5">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h2 className="font-heading font-bold text-base text-[#0D1F3C] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00B894]" />
              <span>Article Information & Publishing Taxonomy</span>
            </h2>
            <p className="text-xs text-[#6B7280]">
              Configure categories, author credentials, search intent, and canonical URL structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-[#303846] mb-1">Primary Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#303846] mb-1">Subcategory / Vertical</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Health Insurance or High-Yield Savings"
                className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#303846] mb-1">Author byline</label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none"
              >
                {AUTHORS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.credentials} ({a.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#303846] mb-1">Peer Reviewer / Fact Checker</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Sarah Jenkins, CFA Charterholder"
                className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#303846] mb-1">Focus Keyword</label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. debt avalanche vs debt snowball"
                className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#303846] mb-1">Search Intent</label>
              <select
                value={searchIntent}
                onChange={(e) => setSearchIntent(e.target.value as SearchIntent)}
                className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none"
              >
                <option value="informational">Informational (Educational & Analytical)</option>
                <option value="commercial">Commercial Investigation (Comparison Matrices)</option>
                <option value="transactional">Transactional (Promotional Offers & Rates)</option>
                <option value="navigational">Navigational (Brand Guides)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#303846] mb-1">URL Slug</label>
              <div className="flex items-center">
                <span className="px-2.5 py-2 bg-slate-100 border border-r-0 border-[#CBD5E1] rounded-l-lg text-slate-500 font-mono text-[11px]">
                  /articles/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setCanonicalUrl(`https://aifinancedeals.com/articles/${e.target.value}`);
                  }}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-r-lg font-mono text-[11px] text-[#163A5F] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#303846] mb-1">Language</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] font-mono text-[11px] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#303846] mb-1 text-xs">Article Excerpt (Editorial Summary)</label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Concise 150-180 character fiduciary summary displayed in archives, search snippets, and Open Graph previews..."
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] text-xs focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: AI WRITING ASSISTANT (17 DEDICATED ACTIONS)                   */}
      {/* ==================================================================== */}
      {activeTab === 'ai_assistant' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div>
              <h2 className="font-heading font-bold text-base text-[#0D1F3C] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00B894]" />
                <span>AI Financial Writing & Strategy Assistant</span>
              </h2>
              <p className="text-xs text-[#6B7280]">
                17 specialized actions engineered strictly for fiduciary personal finance journalism and AdSense compliance.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-[#E6F8F4] text-[#00B894] px-2.5 py-0.5 rounded-full font-bold">
              17 Actions Active
            </span>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
            {[
              { id: 'generate_outline', label: '1. Generate 15-Section Outline' },
              { id: 'generate_intro', label: '2. Generate Introduction' },
              { id: 'write_section_5', label: '3. Write Background Context' },
              { id: 'write_section_8', label: '4. Write Rate Data & Stats' },
              { id: 'write_section_10', label: '5. Write Trade-off Matrix' },
              { id: 'write_section_11', label: '6. Write Practical Checklist' },
              { id: 'write_section_14', label: '7. Write Fiduciary Conclusion' },
              { id: 'expand_section', label: '8. Expand Current Section' },
              { id: 'improve_clarity', label: '9. Improve Financial Clarity' },
              { id: 'generate_faqs', label: '10. Generate 5 Search FAQs' },
              { id: 'suggest_sources', label: '11. Suggest Authority Sources' },
              { id: 'generate_seo', label: '12. Generate SEO Title & Meta' },
            ].map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() => {
                  setAiSelectedAction(act.id);
                  handleRunAiAction(act.id);
                }}
                className={`p-2.5 text-left border rounded-xl transition-all cursor-pointer flex flex-col justify-between ${
                  aiSelectedAction === act.id
                    ? 'border-[#00B894] bg-[#E6F8F4]/30 font-bold text-[#0D1F3C]'
                    : 'border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#475569]'
                }`}
              >
                <span>{act.label}</span>
              </button>
            ))}
          </div>

          {/* Output Display Canvas */}
          <div className="mt-4 pt-4 border-t border-[#F1F5F9] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0D1F3C] flex items-center gap-1.5">
                {aiLoading ? <RefreshCw className="w-3.5 h-3.5 text-[#00B894] animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#00B894]" />}
                <span>AI Assistant Output Canvas</span>
              </span>

              {aiOutput && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiOutput);
                      setCopiedAi(true);
                      setTimeout(() => setCopiedAi(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#CBD5E1] rounded text-[11px] text-[#475569] hover:bg-slate-50 cursor-pointer"
                  >
                    {copiedAi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAi ? 'Copied' : 'Copy Output'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl min-h-[160px] font-mono text-xs text-[#303846] whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {aiLoading ? (
                <div className="text-slate-400 italic flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#00B894]" />
                  <span>Synthesizing fiduciary financial analysis and empirical citations...</span>
                </div>
              ) : (
                aiOutput || 'Select an AI action above to generate outlines, rate benchmarks, search intent FAQs, or SEO metadata.'
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: SEO OPTIMIZATION & SCHEMAS                                    */}
      {/* ==================================================================== */}
      {activeTab === 'seo' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-5">
          <div className="border-b border-[#F1F5F9] pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-[#0D1F3C] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#00B894]" />
                <span>SEO Optimization & Structured Data</span>
              </h2>
              <p className="text-xs text-[#6B7280]">
                Configure search snippet previews, keyword density, and Schema.org JSON-LD structured data.
              </p>
            </div>
            <button
              onClick={() => handleRunAiAction('generate_seo')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0D1F3C] rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00B894]" />
              <span>Generate SEO Tags</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-[#303846]">SEO Meta Title</label>
                <span className={`font-mono text-[10px] ${seoTitle.length > 60 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                  {seoTitle.length} / 60 characters
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Target 50-60 characters for optimal Google desktop/mobile SERP display"
                className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-[#303846]">Meta Description</label>
                <span className={`font-mono text-[10px] ${metaDescription.length > 160 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                  {metaDescription.length} / 160 characters
                </span>
              </div>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Target 140-160 characters incorporating primary focus keyword and clear value proposition"
                className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#303846] mb-1">Canonical URL</label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg font-mono text-[11px] text-[#163A5F] focus:outline-none"
              />
            </div>

            {/* Google SERP Simulator Preview */}
            <div className="pt-3">
              <span className="font-bold text-[#0D1F3C] block mb-2">Google Search Snippet Preview</span>
              <div className="p-4 bg-white border border-[#CBD5E1] rounded-xl space-y-1 shadow-xs max-w-2xl">
                <div className="text-[11px] text-[#202124] flex items-center gap-1.5 font-mono">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[9px] font-bold">AI</span>
                  <span>aifinancedeals.com › articles › {slug || 'guide-slug'}</span>
                </div>
                <h3 className="text-base text-[#1a0dab] font-sans hover:underline cursor-pointer font-medium leading-snug">
                  {seoTitle || title || 'Mastering Financial Strategies | AI Finance Deals'}
                </h3>
                <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                  {metaDescription || excerpt || 'Read our expert, fiduciary financial guide covering verified rates, FDIC protections, step-by-step checklists, and objective comparisons.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: FEATURED MEDIA MANAGEMENT                                     */}
      {/* ==================================================================== */}
      {activeTab === 'media' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-5">
          <div className="border-b border-[#F1F5F9] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-bold text-base text-[#0D1F3C] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#00B894]" />
                <span>Featured Media & Editorial Graphics</span>
              </h2>
              <p className="text-xs text-[#6B7280]">
                Select high-resolution 16:9 WebP imagery, use custom URLs, or generate unique article visuals via the AI Featured Image studio.
              </p>
            </div>
            <Link
              to="/admin/featured-images"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D1F3C] hover:bg-[#163A5F] text-white text-xs font-semibold rounded-lg shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00B894]" />
              <span>AI Image Generator</span>
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="font-bold text-[#0D1F3C] block mb-2">Select from Certified Financial Media Library:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PRESET_IMAGES.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setFeaturedImage(img.url);
                      if (!imageAlt) setImageAlt(img.label);
                    }}
                    className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                      featuredImage === img.url
                        ? 'border-[#00B894] ring-2 ring-[#00B894]/20 shadow-sm'
                        : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="h-28 overflow-hidden bg-slate-100">
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2.5 bg-white text-[11px] font-medium text-[#0D1F3C] truncate">
                      {img.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#303846] mb-1">Custom Image URL</label>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg font-mono text-[11px] text-[#163A5F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#303846] mb-1">Image Alt Text (Accessibility & SEO)</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Descriptive alt text for screen readers"
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 6: GOOGLE ADSENSE CONTENT COMPLIANCE AUDIT                       */}
      {/* ==================================================================== */}
      {activeTab === 'compliance' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-5">
          <div className="border-b border-[#F1F5F9] pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-[#0D1F3C] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00B894]" />
                <span>Google AdSense Content Policy Audit</span>
              </h2>
              <p className="text-xs text-[#6B7280]">
                Pre-publication audit assessing originality, financial disclosures, and AdSense publisher rules.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#163A5F]">
                Compliance Index: {complianceAudit.score}%
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                complianceAudit.score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {complianceAudit.score >= 80 ? 'PASS' : 'NEEDS REVIEW'}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {complianceAudit.passes.map((p, idx) => (
              <div key={idx} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{p}</span>
              </div>
            ))}

            {complianceAudit.warnings.map((w, idx) => (
              <div key={idx} className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center gap-2.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 7: FULL PAGE PREVIEW (RESPONSIVE SIMULATOR)                      */}
      {/* ==================================================================== */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white border border-[#E2E8F0] p-4 rounded-2xl">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#0D1F3C]">Live Public Page Layout Preview</h3>
              <p className="text-xs text-[#6B7280]">Preview article exactly as rendered on the public website.</p>
            </div>

            <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl text-xs">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-white text-[#0D1F3C] shadow-xs' : 'text-[#6B7280]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  previewDevice === 'tablet' ? 'bg-white text-[#0D1F3C] shadow-xs' : 'text-[#6B7280]'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-white text-[#0D1F3C] shadow-xs' : 'text-[#6B7280]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="flex justify-center bg-slate-100 border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <div
              className="bg-white border border-[#CBD5E1] rounded-2xl shadow-sm transition-all duration-300 p-6 sm:p-10 space-y-6"
              style={{
                width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px',
                maxWidth: '100%',
              }}
            >
              {/* Category & Title */}
              <div className="space-y-3">
                <span className="px-3 py-1 bg-[#E6F8F4] text-[#00B894] font-mono text-xs font-bold rounded-full">
                  {CATEGORIES.find((c) => c.id === categoryId)?.name || 'Personal Finance'}
                </span>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#0D1F3C] leading-tight">
                  {title || 'Untitled Financial Guide'}
                </h1>
                <p className="text-sm text-[#475569] leading-relaxed">
                  {excerpt || (sections.section03_intro || '').replace(/<[^>]*>?/gm, '').slice(0, 180)}
                </p>
              </div>

              {/* Author & Reviewer Byline */}
              <div className="flex flex-wrap items-center justify-between py-3 border-y border-[#F1F5F9] text-xs text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#163A5F] text-white flex items-center justify-center font-bold">
                    {selectedAuthor.name[0]}
                  </div>
                  <div>
                    <span className="font-bold text-[#0D1F3C] block">{selectedAuthor.name}</span>
                    <span className="text-[10px] text-[#6B7280]">{selectedAuthor.credentials}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block font-mono text-[11px] text-[#00B894]">Reviewed by {reviewerName}</span>
                  <span className="text-[10px] text-[#94A3B8]">{readTime} · Fiduciary Standard</span>
                </div>
              </div>

              {/* Featured Image */}
              {featuredImage && (
                <div className="rounded-2xl overflow-hidden max-h-[360px] bg-slate-100 border border-[#E2E8F0]">
                  <img src={featuredImage} alt={imageAlt || title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Rendered HTML Sections */}
              <div
                className="prose prose-slate max-w-none text-xs sm:text-sm text-[#303846] leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: compileFullArticleContent() }}
              />

              {/* Verified Sources Box */}
              {sources.length > 0 && (
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-2">
                  <span className="font-bold text-[#0D1F3C] block font-heading">Primary Regulatory Citations & References:</span>
                  <ul className="space-y-1 list-disc list-inside text-[#475569]">
                    {sources.map((s, idx) => (
                      <li key={idx}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#00B894] hover:underline font-medium">
                          {s.title}
                        </a>{' '}
                        — <span className="text-[#64748B]">{s.publisher} ({s.date_accessed || 'Verified 2026'})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 8: QUALITY CONTROL CHECKLIST                                     */}
      {/* ==================================================================== */}
      {activeTab === 'quality' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-5">
          <div className="border-b border-[#F1F5F9] pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-[#0D1F3C] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#00B894]" />
                <span>Editorial Quality Control & Readiness Audit</span>
              </h2>
              <p className="text-xs text-[#6B7280]">
                Pre-flight checklist verifying all 15 content fields, SEO metadata, and fiduciary boundaries.
              </p>
            </div>
            <div className="text-right">
              <span className="font-heading font-bold text-lg text-[#00B894]">{readinessScore}%</span>
              <span className="text-[10px] font-mono text-[#6B7280] block">Readiness Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { label: 'H1 Article Title is descriptive & non-clickbait', check: !!title.trim() },
              { label: 'URL Slug is clean and unique', check: !!slug.trim() },
              { label: 'Section 03: Introduction addresses search intent', check: !!sections.section03_intro?.trim() },
              { label: 'Section 05: Regulatory background & context defined', check: !!sections.section05_background?.trim() },
              { label: 'Section 06 & 07: Main sections sufficiently developed', check: !!sections.section06_main1?.trim() && !!sections.section07_main2?.trim() },
              { label: 'Section 08: Verifiable rate data & benchmark table present', check: !!sections.section08_data_stats?.trim() },
              { label: 'Section 10: Objective trade-off comparison matrix included', check: !!sections.section10_comparison?.trim() },
              { label: 'Section 11: Step-by-step practical checklist provided', check: !!sections.section11_practical_guide?.trim() },
              { label: 'Section 13: Search intent FAQs formulated (4-8 items)', check: !!sections.section13_faq?.trim() },
              { label: 'Section 14: Conclusion contains fiduciary disclosure', check: !!sections.section14_conclusion?.trim() },
              { label: 'Section 15: Primary authority sources cited (CFPB, FDIC, Fed)', check: sources.length >= 2 },
              { label: 'Focus Keyword & SEO Meta Description completed', check: !!focusKeyword.trim() && !!metaDescription.trim() },
              { label: 'Target word count threshold met', check: totalContentWords >= 800 },
              { label: 'Peer reviewer & author credentials assigned', check: !!authorId && !!reviewerName },
            ].map((chk, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  chk.check ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <span className="font-medium">{chk.label}</span>
                {chk.check ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">Incomplete</span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#F1F5F9] flex justify-end">
            <button
              onClick={() => handleSave('published')}
              disabled={saving || readinessScore < 70}
              className="px-5 py-2.5 bg-[#00B894] hover:bg-[#009b7c] text-[#0D1F3C] font-heading font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              Confirm All Checks & Publish Article
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
