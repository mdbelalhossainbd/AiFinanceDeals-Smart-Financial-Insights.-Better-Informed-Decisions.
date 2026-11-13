import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { ArrowRight, Wallet, Shield, Building2, CreditCard, Tag, Scale, Cpu } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  articleCount?: number;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  articleCount,
  className = '',
}) => {
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'personal-finance':
        return <Wallet className="w-5 h-5 text-[#00B894]" />;
      case 'insurance':
        return <Shield className="w-5 h-5 text-[#163A5F]" />;
      case 'banking':
        return <Building2 className="w-5 h-5 text-[#00C2E0]" />;
      case 'credit-loans':
        return <CreditCard className="w-5 h-5 text-[#0D1F3C]" />;
      case 'finance-deals':
        return <Tag className="w-5 h-5 text-[#00B894]" />;
      case 'comparisons':
        return <Scale className="w-5 h-5 text-[#163A5F]" />;
      case 'financial-technology':
        return <Cpu className="w-5 h-5 text-[#00C2E0]" />;
      default:
        return <Wallet className="w-5 h-5 text-[#0D1F3C]" />;
    }
  };

  return (
    <Link
      to={`/${category.slug}/`}
      className={`group bg-white border border-[#E2E8F0] hover:border-[#00B894] rounded-xl p-5 transition-all hover:shadow-md flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#F5F8FC] group-hover:bg-[#E6F8F4] transition-colors flex items-center justify-center">
            {getIcon(category.slug)}
          </div>
          {typeof articleCount === 'number' && (
            <span className="text-[11px] font-mono text-[#6B7280]">
              {articleCount} Guides
            </span>
          )}
        </div>

        <h3 className="font-heading text-base font-bold text-[#0D1F3C] group-hover:text-[#00B894] transition-colors leading-snug">
          {category.name}
        </h3>

        <p className="mt-1.5 text-xs text-[#6B7280] leading-relaxed line-clamp-2">
          {category.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F8FAFC] flex items-center justify-between text-xs font-semibold text-[#163A5F] group-hover:text-[#00B894] transition-colors">
        <span>Explore Category</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
