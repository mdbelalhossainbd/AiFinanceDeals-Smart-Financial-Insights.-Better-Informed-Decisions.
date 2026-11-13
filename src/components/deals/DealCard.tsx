import React from 'react';
import { FinancialDeal } from '../../types';
import { ShieldCheck, ExternalLink, Calendar, CheckCircle } from 'lucide-react';

interface DealCardProps {
  deal: FinancialDeal;
  className?: string;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, className = '' }) => {
  return (
    <div className={`bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl p-5 sm:p-6 transition-all hover:shadow-md flex flex-col justify-between ${className}`}>
      <div>
        {/* Verification and Validity Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#00B894] bg-[#E6F8F4] px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Offer</span>
          </span>

          <span className="flex items-center gap-1 text-[11px] font-mono text-[#6B7280]">
            <Calendar className="w-3 h-3 text-[#9CA3AF]" />
            <span>Valid through {new Date(deal.valid_until).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </span>
        </div>

        <h3 className="font-heading text-lg font-bold text-[#0D1F3C] leading-snug">
          {deal.title}
        </h3>

        <div className="text-xs text-[#6B7280] font-medium mt-0.5">
          Issuer: <span className="text-[#163A5F]">{deal.provider}</span>
        </div>

        <p className="mt-2.5 text-xs text-[#4B5563] leading-relaxed line-clamp-2">
          {deal.description}
        </p>

        {/* Offer Details Grid */}
        <div className="mt-4 p-3.5 bg-[#F5F8FC] rounded-lg grid grid-cols-2 gap-2 text-xs">
          {deal.offer_details.apr && (
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#6B7280]">Yield / Rate</span>
              <span className="font-heading font-extrabold text-sm text-[#00B894]">{deal.offer_details.apr}</span>
            </div>
          )}
          {deal.offer_details.bonus && (
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#6B7280]">Welcome Bonus</span>
              <span className="font-heading font-extrabold text-sm text-[#0D1F3C]">{deal.offer_details.bonus}</span>
            </div>
          )}
          {deal.offer_details.annual_fee && (
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#6B7280]">Annual Fee</span>
              <span className="font-semibold text-xs text-[#303846]">{deal.offer_details.annual_fee}</span>
            </div>
          )}
          {deal.offer_details.highlight && (
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#6B7280]">Key Feature</span>
              <span className="font-semibold text-xs text-[#303846] truncate block">{deal.offer_details.highlight}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action and Terms Strip */}
      <div className="mt-5 pt-3.5 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <a
          href={deal.terms_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-[#6B7280] hover:text-[#0D1F3C] hover:underline"
        >
          View Terms & Disclosures
        </a>

        <a
          href={deal.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-semibold rounded-lg text-xs transition-colors"
        >
          <span>Official Partner Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
