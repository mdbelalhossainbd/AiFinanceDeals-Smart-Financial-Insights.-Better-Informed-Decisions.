import React from 'react';
import { Comparison } from '../../types';
import { Star, Check, X, ExternalLink } from 'lucide-react';

interface ComparisonTableProps {
  comparison: Comparison;
  className?: string;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  comparison,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm ${className}`}>
      <div className="p-6 bg-[#F5F8FC] border-b border-[#E2E8F0]">
        <h3 className="font-heading text-xl font-bold text-[#0D1F3C]">
          {comparison.title}
        </h3>
        <p className="mt-1 text-xs text-[#6B7280] leading-relaxed">
          {comparison.description}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#FAFAFA] text-[#0D1F3C] font-heading">
              <th className="p-4 font-bold min-w-[200px]">Product / Provider</th>
              <th className="p-4 font-bold min-w-[130px]">Editorial Rating</th>
              <th className="p-4 font-bold min-w-[180px]">Best For</th>
              <th className="p-4 font-bold min-w-[160px]">Fees & Terms</th>
              <th className="p-4 font-bold min-w-[200px]">Pros & Key Benefits</th>
              <th className="p-4 font-bold min-w-[140px] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[#303846]">
            {comparison.comparison_data.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="p-4 font-semibold text-[#0D1F3C]">
                  <div>{item.name}</div>
                  <div className="text-[11px] text-[#6B7280] font-normal">{item.provider}</div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-1 text-[#0D1F3C] font-bold font-mono">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{item.rating.toFixed(1)} / 5.0</span>
                  </div>
                </td>

                <td className="p-4 text-[#4B5563]">
                  {item.best_for}
                </td>

                <td className="p-4 font-medium text-[#163A5F]">
                  {item.fees}
                </td>

                <td className="p-4">
                  <ul className="space-y-1 text-[11px] list-none p-0 m-0">
                    {item.pros.slice(0, 2).map((pro, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1 text-[#059669]">
                        <Check className="w-3 h-3 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </td>

                <td className="p-4 text-right">
                  <a
                    href={item.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-semibold rounded text-xs transition-colors"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
