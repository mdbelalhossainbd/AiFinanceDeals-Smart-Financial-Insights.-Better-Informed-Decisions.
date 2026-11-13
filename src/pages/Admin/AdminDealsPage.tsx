import React, { useEffect, useState } from 'react';
import { dealService } from '../../services/dealService';
import { FinancialDeal } from '../../types';
import { Plus, Tag, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

export const AdminDealsPage: React.FC = () => {
  const [deals, setDeals] = useState<FinancialDeal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [apr, setApr] = useState('');
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [officialUrl, setOfficialUrl] = useState('');
  const [description, setDescription] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const loadDeals = async () => {
    const list = await dealService.getAllDealsForAdmin();
    setDeals(list);
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !provider) return;

    await dealService.saveDeal({
      title,
      provider,
      description,
      offer_details: { apr },
      valid_until: validUntil,
      official_url: officialUrl || 'https://aifinancedeals.com',
      verification_status: 'verified',
    });

    setNotification(`Deal for "${title}" successfully recorded & verified.`);
    setTimeout(() => setNotification(null), 3000);
    setIsModalOpen(false);
    setTitle('');
    setProvider('');
    setApr('');
    setDescription('');
    loadDeals();
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1F3C]">
            Verified Finance Deals & Offers
          </h1>
          <p className="text-xs text-[#6B7280]">
            Audit, date-stamp, and publish verified bank APYs, credit rewards, and insurance discounts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Verified Deal</span>
        </button>
      </div>

      {/* Deals Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#6B7280]">
              <tr>
                <th className="p-4 font-semibold">Offer & Issuer</th>
                <th className="p-4 font-semibold">Rate / Terms</th>
                <th className="p-4 font-semibold">Valid Until</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#303846]">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-[#0D1F3C]">{deal.title}</div>
                    <div className="text-[11px] text-[#6B7280]">{deal.provider}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-[#00B894]">
                    {deal.offer_details.apr || deal.offer_details.bonus || 'Standard Offer'}
                  </td>
                  <td className="p-4 text-[#6B7280] font-mono text-[11px]">
                    {deal.valid_until}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {deal.verification_status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <a
                      href={deal.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-[#163A5F] hover:text-[#00B894] inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Partner Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 space-y-4 my-auto border border-[#E2E8F0] shadow-xl text-xs">
            <h2 className="font-heading text-lg font-bold text-[#0D1F3C]">
              Add Verified Financial Deal
            </h2>

            <form onSubmit={handleCreateDeal} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Product Offer Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Marcus 4.40% High-Yield Savings Account"
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Financial Institution / Issuer *</label>
                <input
                  type="text"
                  required
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g. Goldman Sachs Bank USA, Member FDIC"
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Rate / APY / Bonus</label>
                  <input
                    type="text"
                    value={apr}
                    onChange={(e) => setApr(e.target.value)}
                    placeholder="e.g. 4.40% APY"
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Valid Until Date</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Official Application URL</label>
                <input
                  type="url"
                  value={officialUrl}
                  onChange={(e) => setOfficialUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Offer Terms Summary</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key terms, fee waivers, FDIC limits..."
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-[#303846] resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#6B7280] hover:text-[#0D1F3C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0D1F3C] text-white font-semibold rounded-lg hover:bg-[#163A5F]"
                >
                  Verify & Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
