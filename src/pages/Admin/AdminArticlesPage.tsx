import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { Article, ArticleStatus } from '../../types';
import { PlusCircle, Search, Trash2, Edit3, ExternalLink, CheckCircle, Image as ImageIcon } from 'lucide-react';

export const AdminArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const loadArticles = async () => {
    const list = await articleService.getAllArticlesForAdmin();
    setArticles(list);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      await articleService.deleteArticle(id);
      setNotification(`Deleted "${title}" successfully.`);
      setTimeout(() => setNotification(null), 3000);
      loadArticles();
    }
  };

  const filtered = articles.filter((a) => {
    const matchStatus = selectedStatus === 'all' || a.status === selectedStatus;
    const matchSearch = search.trim() === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author?.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1F3C]">
            Article Management
          </h1>
          <p className="text-xs text-[#6B7280]">
            Review, author, edit, and publish verified personal finance guides.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/featured-images"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F5F8FC] border border-[#CBD5E1] text-[#0D1F3C] font-semibold text-xs rounded-lg transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-[#00B894]" />
            <span>AI Featured Images</span>
          </Link>
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {['all', 'published', 'fact_check', 'editorial_review', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-md font-medium uppercase font-mono text-[11px] transition-colors ${
                selectedStatus === status
                  ? 'bg-[#0D1F3C] text-white'
                  : 'bg-[#F5F8FC] text-[#303846] hover:bg-[#E2E8F0]'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, author..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#F5F8FC] border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none focus:ring-1 focus:ring-[#00B894]"
          />
          <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#6B7280]">
              <tr>
                <th className="p-4 font-semibold">Title & Category</th>
                <th className="p-4 font-semibold">Author</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Last Updated</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#303846]">
              {filtered.map((art) => (
                <tr key={art.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-4 max-w-sm">
                    <div className="font-semibold text-[#0D1F3C] line-clamp-1">{art.title}</div>
                    <div className="text-[11px] text-[#6B7280] mt-0.5 font-mono">
                      /{art.category?.slug || 'general'}/{art.slug}
                    </div>
                  </td>

                  <td className="p-4 text-[#6B7280]">
                    {art.author?.name}
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      art.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : art.status === 'fact_check'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {art.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="p-4 text-[#6B7280] font-mono text-[11px]">
                    {new Date(art.updated_at).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {art.status === 'published' && (
                        <Link
                          to={`/articles/${art.slug}`}
                          target="_blank"
                          className="p-1 text-[#6B7280] hover:text-[#0D1F3C]"
                          title="View Live Guide"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <Link
                        to={`/admin/articles/edit/${art.id}`}
                        className="p-1 text-[#163A5F] hover:text-[#00B894]"
                        title="Edit Article"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(art.id, art.title)}
                        className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
