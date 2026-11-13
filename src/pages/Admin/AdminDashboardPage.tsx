import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { dealService } from '../../services/dealService';
import { Article, FinancialDeal } from '../../types';
import {
  FileText,
  Tag,
  Scale,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [deals, setDeals] = useState<FinancialDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [allArticles, allDeals] = await Promise.all([
        articleService.getAllArticlesForAdmin(),
        dealService.getAllDealsForAdmin(),
      ]);
      setArticles(allArticles);
      setDeals(allDeals);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const reviewCount = articles.filter((a) => a.status === 'editorial_review' || a.status === 'fact_check').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0D1F3C]">
            Editorial CMS Overview
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            System status, publishing review pipelines, and verified commercial offer telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Financial Guide</span>
          </Link>
          <Link
            to="/admin/deals"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#F5F8FC] border border-[#CBD5E1] text-[#303846] font-semibold text-xs rounded-lg transition-colors"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Add Deal</span>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Published Guides</span>
            <FileText className="w-4 h-4 text-[#00B894]" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-[#0D1F3C]">
            {publishedCount}
          </div>
          <span className="text-[11px] text-[#00B894] font-medium">Live on search engines</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Editorial & Fact Check</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-[#0D1F3C]">
            {reviewCount}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Pending expert audit</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Verified Finance Deals</span>
            <Tag className="w-4 h-4 text-[#163A5F]" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-[#0D1F3C]">
            {deals.length}
          </div>
          <span className="text-[11px] text-[#6B7280]">Audited promotional offers</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Editorial Drafts</span>
            <Users className="w-4 h-4 text-[#00C2E0]" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-[#0D1F3C]">
            {draftCount}
          </div>
          <span className="text-[11px] text-[#6B7280] font-medium">Staged before publication</span>
        </div>
      </div>

      {/* Publishing Workflow Stage Map (Phase 7 Requirement) */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="font-heading text-base font-bold text-[#0D1F3C]">
          Standard Editorial Publishing Workflow
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg">
            <span className="font-mono text-[10px] text-[#6B7280] block">STAGE 1</span>
            <span className="font-bold text-[#0D1F3C]">1. DRAFT</span>
            <p className="text-[11px] text-[#6B7280] mt-1">Author initial research & writing</p>
          </div>
          <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg">
            <span className="font-mono text-[10px] text-[#6B7280] block">STAGE 2</span>
            <span className="font-bold text-[#0D1F3C]">2. EDITORIAL REVIEW</span>
            <p className="text-[11px] text-[#6B7280] mt-1">Readability, structure, style</p>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="font-mono text-[10px] text-amber-700 block">STAGE 3</span>
            <span className="font-bold text-amber-900">3. FACT CHECK</span>
            <p className="text-[11px] text-amber-700 mt-1">Primary sources & rates verify</p>
          </div>
          <div className="p-3 bg-[#E6F8F4] border border-[#00B894]/40 rounded-lg">
            <span className="font-mono text-[10px] text-[#00B894] block">STAGE 4</span>
            <span className="font-bold text-[#0D1F3C]">4. APPROVED</span>
            <p className="text-[11px] text-[#059669] mt-1">Editor-in-Chief sign-off</p>
          </div>
          <div className="p-3 bg-[#0D1F3C] text-white rounded-lg">
            <span className="font-mono text-[10px] text-[#00C2E0] block">STAGE 5</span>
            <span className="font-bold text-white">5. PUBLISHED</span>
            <p className="text-[11px] text-stone-300 mt-1">Live indexing & syndication</p>
          </div>
        </div>
      </div>

      {/* Recent Articles Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-[#0D1F3C]">
            Recent Articles & Content Queue
          </h3>
          <Link
            to="/admin/articles"
            className="text-xs font-semibold text-[#163A5F] hover:text-[#00B894] flex items-center gap-1"
          >
            <span>Manage All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#6B7280]">
              <tr>
                <th className="p-3.5 font-semibold">Article Title</th>
                <th className="p-3.5 font-semibold">Category</th>
                <th className="p-3.5 font-semibold">Author</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Updated</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#303846]">
              {articles.slice(0, 5).map((article) => (
                <tr key={article.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3.5 font-semibold text-[#0D1F3C] max-w-xs truncate">
                    {article.title}
                  </td>
                  <td className="p-3.5 text-[#6B7280]">
                    {article.category?.name || 'General'}
                  </td>
                  <td className="p-3.5 text-[#6B7280]">
                    {article.author?.name}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                      article.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : article.status === 'fact_check'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {article.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#6B7280] font-mono text-[11px]">
                    {new Date(article.updated_at).toLocaleDateString()}
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      to={`/admin/articles/edit/${article.id}`}
                      className="px-2.5 py-1 text-xs font-semibold text-[#163A5F] hover:bg-[#F5F8FC] rounded"
                    >
                      Edit
                    </Link>
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
