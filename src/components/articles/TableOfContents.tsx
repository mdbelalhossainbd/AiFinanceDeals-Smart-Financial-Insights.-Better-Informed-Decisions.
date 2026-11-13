import React from 'react';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items, className = '' }) => {
  if (items.length === 0) return null;

  return (
    <nav className={`bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl p-5 ${className}`}>
      <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#0D1F3C] mb-3">
        <List className="w-4 h-4 text-[#163A5F]" />
        <span>Table of Contents</span>
      </div>

      <ul className="space-y-1.5 text-xs text-[#4B5563] list-none p-0 m-0">
        {items.map((item, idx) => (
          <li key={idx} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
            <a
              href={`#${item.id}`}
              className="hover:text-[#0D1F3C] hover:underline transition-colors block py-0.5"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
