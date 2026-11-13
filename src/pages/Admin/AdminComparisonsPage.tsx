import React, { useEffect, useState } from 'react';
import { dealService } from '../../services/dealService';
import { Comparison } from '../../types';
import { Scale, Star, ExternalLink } from 'lucide-react';

export const AdminComparisonsPage: React.FC = () => {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);

  useEffect(() => {
    async function loadComp() {
      const data = await dealService.getComparisons();
      setComparisons(data);
    }
    loadComp();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1F3C]">
            Product Comparisons & Rating Matrices
          </h1>
          <p className="text-xs text-[#6B7280]">
            Manage side-by-side matrices, editorial star ratings, and feature breakdowns.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {comparisons.map((comp) => (
          <div key={comp.id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-[#0D1F3C]">
                  {comp.title}
                </h3>
                <span className="font-mono text-xs text-[#6B7280]">slug: /comparisons/{comp.slug}</span>
              </div>
              <span className="text-xs font-mono text-[#00B894] font-semibold">
                {comp.comparison_data.length} Products Scored
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {comp.comparison_data.map((item, idx) => (
                <div key={idx} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs space-y-1">
                  <div className="font-bold text-[#0D1F3C] flex items-center justify-between">
                    <span>{item.name}</span>
                    <span className="flex items-center gap-0.5 text-amber-600 font-mono">
                      <Star className="w-3 h-3 fill-current" />
                      {item.rating}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7280]">{item.best_for}</div>
                  <div className="text-[11px] font-semibold text-[#163A5F]">{item.fees}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
