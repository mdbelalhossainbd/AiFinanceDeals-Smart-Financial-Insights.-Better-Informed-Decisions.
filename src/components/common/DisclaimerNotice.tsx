import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DisclaimerNoticeProps {
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
}

export const DisclaimerNotice: React.FC<DisclaimerNoticeProps> = ({
  variant = 'card',
  className = '',
}) => {
  if (variant === 'banner') {
    return (
      <div className={`bg-[#F5F8FC] border-y border-[#E2E8F0] py-2 px-4 text-xs text-[#6B7280] ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#163A5F] shrink-0" />
            <span>
              <strong>Editorial Disclosure:</strong> AI Finance Deals provides educational resources. We may receive affiliate compensation from financial partners.
            </span>
          </div>
          <Link to="/affiliate-disclosure/" className="text-[#163A5F] hover:underline font-medium shrink-0">
            Learn More
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#6B7280] space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-[#0D1F3C] font-semibold">
        <ShieldAlert className="w-4 h-4 text-[#163A5F]" />
        <span>Financial & Advisory Disclaimer</span>
      </div>
      <p className="leading-relaxed">
        The information provided on AI Finance Deals is published solely for educational, informational, and comparative purposes. It should not be considered personalized investment, tax, legal, or financial advice. Always consult with a licensed Certified Financial Planner (CFP®), CPA, or registered investment advisor before executing significant financial decisions.
      </p>
      <div className="pt-1 flex items-center gap-3 text-[11px] text-[#6B7280]">
        <Link to="/editorial-policy/" className="text-[#163A5F] hover:underline">Editorial Policy</Link>
        <span>·</span>
        <Link to="/affiliate-disclosure/" className="text-[#163A5F] hover:underline">Affiliate Disclosure</Link>
        <span>·</span>
        <Link to="/disclaimer/" className="text-[#163A5F] hover:underline">Full Legal Disclaimer</Link>
      </div>
    </div>
  );
};
