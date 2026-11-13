import React from 'react';
import { Link } from 'react-router-dom';
import { Author } from '../../types';
import { BadgeCheck, Twitter, Linkedin, ArrowRight } from 'lucide-react';

interface AuthorBioProps {
  author?: Author;
  className?: string;
}

export const AuthorBio: React.FC<AuthorBioProps> = ({ author, className = '' }) => {
  if (!author) return null;

  return (
    <div className={`p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col sm:flex-row gap-5 items-start ${className}`}>
      <div className="w-14 h-14 rounded-full bg-[#163A5F] text-white flex items-center justify-center font-heading font-extrabold text-xl shrink-0 shadow-sm">
        {author.name ? author.name[0] : 'A'}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <Link to={`/authors/${author.slug}`} className="hover:underline">
                <h4 className="font-heading font-bold text-base text-[#0D1F3C]">
                  {author.name}
                </h4>
              </Link>
              {author.verified && (
                <span title="Verified Editorial Contributor">
                  <BadgeCheck className="w-4 h-4 text-[#00B894]" />
                </span>
              )}
            </div>
            <p className="text-xs text-[#00B894] font-medium font-mono">
              {author.role} · {author.credentials}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[#6B7280]">
            {author.twitter_handle && (
              <a
                href={`https://twitter.com/${author.twitter_handle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:text-[#0D1F3C] transition-colors"
                title="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {author.linkedin_url && (
              <a
                href={author.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:text-[#0D1F3C] transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <p className="text-xs text-[#4B5563] leading-relaxed">
          {author.bio}
        </p>

        <div className="pt-1">
          <Link
            to={`/authors/${author.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#163A5F] hover:text-[#00B894] transition-colors"
          >
            <span>View Full Author Profile & Articles</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
