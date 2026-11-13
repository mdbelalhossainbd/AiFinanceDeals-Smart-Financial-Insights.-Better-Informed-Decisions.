import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#0D1F3C] text-white text-xs py-2 px-4 border-b border-[#163A5F]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00B894] shrink-0" />
          <span className="font-medium text-stone-200">
            Independent Editorial Standards · All Promotional Offers Fact-Checked with Primary Regulators & Issuers
          </span>
        </div>
        <Link
          to="/editorial-policy/"
          className="inline-flex items-center gap-1 text-[#00C2E0] hover:text-white font-medium transition-colors shrink-0"
        >
          <span>Our Editorial Charter</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
