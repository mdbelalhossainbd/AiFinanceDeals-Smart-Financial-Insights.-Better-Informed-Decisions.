import React from 'react';
import { CATEGORIES } from '../../data/mockData';
import { FolderTree, Plus } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1F3C]">
            Editorial Taxonomy & Categories
          </h1>
          <p className="text-xs text-[#6B7280]">
            Manage primary categories and subcategory taxonomy.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#6B7280]">
            <tr>
              <th className="p-4 font-semibold">Category Name</th>
              <th className="p-4 font-semibold">Slug URL</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[#303846]">
            {CATEGORIES.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="p-4 font-semibold text-[#0D1F3C]">
                  {cat.parent_id && <span className="text-[#9CA3AF] mr-2">↳</span>}
                  {cat.name}
                </td>
                <td className="p-4 font-mono text-[#163A5F] text-[11px]">
                  /{cat.slug}/
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    cat.parent_id ? 'bg-stone-100 text-[#6B7280]' : 'bg-[#E6F8F4] text-[#00B894] font-semibold'
                  }`}>
                    {cat.parent_id ? 'Subcategory' : 'Primary Vertical'}
                  </span>
                </td>
                <td className="p-4 text-[#6B7280] max-w-sm truncate">
                  {cat.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
