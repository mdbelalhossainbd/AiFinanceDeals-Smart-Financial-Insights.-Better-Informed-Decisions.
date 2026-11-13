import { Article, ArticleStatus } from '../types';
import { ARTICLES, AUTHORS, CATEGORIES } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../integrations/supabase/client';
import { getLocalArticleImagePath, LEGACY_SHARED_IMAGES } from '../utils/categoryFolder';

const STORAGE_KEY = 'aifinancedeals_articles_store';

function normalizeArticleMedia(article: Article): Article {
  const canonicalSeed = ARTICLES.find((seed) => seed.id === article.id || seed.slug === article.slug);
  const currentImg = (article.featured_image || '').trim();
  const isLegacyOrMissing = !currentImg || LEGACY_SHARED_IMAGES.has(currentImg);

  if (!isLegacyOrMissing && article.image_alt && article.image_metadata) {
    return article;
  }

  return {
    ...article,
    featured_image: isLegacyOrMissing
      ? canonicalSeed?.featured_image || getLocalArticleImagePath(article)
      : currentImg,
    image_alt: article.image_alt || canonicalSeed?.image_alt || `${article.title} editorial financial visual`,
    image_caption: article.image_caption || canonicalSeed?.image_caption || '',
    image_metadata: article.image_metadata || canonicalSeed?.image_metadata,
  };
}

function getLocalArticles(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const parsedIds = new Set(parsed.map((a: Article) => a.id));
        const missing = ARTICLES.filter((a) => !parsedIds.has(a.id));
        const combined = [...parsed, ...missing];
        const normalized = combined.map(normalizeArticleMedia);
        const changed =
          missing.length > 0 ||
          normalized.some((item, idx) => item.featured_image !== combined[idx]?.featured_image);
        if (changed) {
          saveLocalArticles(normalized);
        }
        return normalized;
      }
    }
  } catch (e) {
    console.warn('Could not read articles from localStorage', e);
  }
  return ARTICLES;
}

function saveLocalArticles(articles: Article[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (e) {
    console.warn('Could not save articles to localStorage', e);
  }
}

export const articleService = {
  async getPublishedArticles(): Promise<Article[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*, category:categories(*), author:authors(*)')
          .eq('status', 'published')
          .order('published_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return (data as Article[]).map(normalizeArticleMedia);
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local dataset', err);
      }
    }

    // Local repository
    const local = getLocalArticles();
    return local
      .filter((a) => a.status === 'published')
      .map((a) => ({
        ...a,
        category: CATEGORIES.find((c) => c.id === a.category_id),
        author: AUTHORS.find((au) => au.id === a.author_id),
      }))
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  },

  async getAllArticlesForAdmin(): Promise<Article[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*, category:categories(*), author:authors(*)')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return (data as Article[]).map(normalizeArticleMedia);
        }
      } catch (err) {
        console.warn('Supabase admin query failed', err);
      }
    }

    const local = getLocalArticles();
    return local.map((a) => ({
      ...a,
      category: CATEGORIES.find((c) => c.id === a.category_id),
      author: AUTHORS.find((au) => au.id === a.author_id),
    }));
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*, category:categories(*), author:authors(*)')
          .eq('slug', slug)
          .single();
        if (!error && data) {
          return normalizeArticleMedia(data as Article);
        }
      } catch (err) {
        console.warn('Supabase getArticleBySlug error', err);
      }
    }

    const local = getLocalArticles();
    const found = local.find((a) => a.slug === slug);
    if (!found) return null;
    return {
      ...found,
      category: CATEGORIES.find((c) => c.id === found.category_id),
      author: AUTHORS.find((au) => au.id === found.author_id),
    };
  },

  async saveArticle(article: Partial<Article>): Promise<Article> {
    const local = getLocalArticles();
    let updated: Article;

    if (article.id) {
      // Edit existing
      const index = local.findIndex((a) => a.id === article.id);
      if (index >= 0) {
        updated = {
          ...local[index],
          ...article,
          updated_at: new Date().toISOString(),
        } as Article;
        local[index] = updated;
      } else {
        throw new Error('Article not found');
      }
    } else {
      // Create new
      const fallbackSlug = article.slug || `article-${Date.now()}`;
      const fallbackCatId = article.category_id || 'cat-pf';
      updated = {
        id: `art-${Date.now()}`,
        title: article.title || 'Untitled Financial Guide',
        slug: fallbackSlug,
        excerpt: article.excerpt || '',
        content: article.content || '',
        featured_image:
          article.featured_image ||
          getLocalArticleImagePath({ slug: 'understanding-personal-finance-beginners-guide', category_id: fallbackCatId }),
        image_alt: article.image_alt || article.title || 'Financial editorial guide illustration',
        image_caption: article.image_caption || '',
        image_metadata: article.image_metadata,
        category_id: fallbackCatId,
        author_id: article.author_id || 'auth-1',
        seo_title: article.seo_title || article.title,
        meta_description: article.meta_description || article.excerpt,
        canonical_url: `https://aifinancedeals.com/articles/${fallbackSlug}`,
        sources: article.sources || [],
        read_time: article.read_time || '5 min read',
        status: (article.status as ArticleStatus) || 'draft',
        published_at: article.status === 'published' ? new Date().toISOString() : '',
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      local.unshift(updated);
    }

    saveLocalArticles(local);

    // If Supabase is connected, attempt sync
    if (isSupabaseConfigured && supabase) {
      try {
        const payload = { ...updated };
        delete (payload as Partial<Article>).category;
        delete (payload as Partial<Article>).author;
        await supabase.from('articles').upsert(payload);
      } catch (e) {
        console.warn('Supabase upsert failed', e);
      }
    }

    return updated;
  },

  async updateArticleImageOnly(
    articleId: string,
    payload: Pick<Article, 'featured_image' | 'image_alt' | 'image_caption' | 'image_metadata'>
  ): Promise<Article> {
    const local = getLocalArticles();
    const index = local.findIndex((a) => a.id === articleId);
    if (index < 0) {
      throw new Error('Article not found');
    }

    const updated: Article = {
      ...local[index],
      featured_image: payload.featured_image,
      image_alt: payload.image_alt ?? local[index].image_alt,
      image_caption: payload.image_caption ?? local[index].image_caption,
      image_metadata: payload.image_metadata ?? local[index].image_metadata,
      updated_at: new Date().toISOString(),
    };
    local[index] = updated;
    saveLocalArticles(local);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('articles')
          .update({
            featured_image: updated.featured_image,
            image_alt: updated.image_alt,
            image_caption: updated.image_caption,
            image_metadata: updated.image_metadata,
            updated_at: updated.updated_at,
          })
          .eq('id', articleId);
      } catch (e) {
        console.warn('Supabase updateArticleImageOnly skipped/failed', e);
      }
    }

    return updated;
  },

  async deleteArticle(id: string): Promise<boolean> {
    const local = getLocalArticles().filter((a) => a.id !== id);
    saveLocalArticles(local);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('articles').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete error', e);
      }
    }
    return true;
  },
};
