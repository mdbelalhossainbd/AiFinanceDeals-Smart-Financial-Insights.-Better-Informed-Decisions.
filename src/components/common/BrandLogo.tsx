import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  className = '',
  showTagline = false,
}) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Financial geometric insignia */}
      <div className="w-9 h-9 rounded-lg bg-[#0D1F3C] flex items-center justify-center shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#163A5F] to-[#00B894] opacity-80" />
        <svg
          className="w-5 h-5 text-white relative z-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span className="font-heading font-extrabold text-base sm:text-xl tracking-tight text-[#0D1F3C]">
            AI FINANCE
          </span>
          <span className="font-heading font-semibold text-base sm:text-xl tracking-tight text-[#00B894]">
            DEALS
          </span>
        </div>
        {showTagline && (
          <span className="text-[9px] sm:text-[10px] uppercase font-sans tracking-wider text-[#6B7280] font-medium -mt-0.5 truncate max-w-[160px] sm:max-w-none">
            Smart Financial Insights
          </span>
        )}
      </div>
    </Link>
  );
};
