import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AUTHORS } from '../../data/mockData';
import { articleService } from '../../services/articleService';
import { Article } from '../../types';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { StructuredData } from '../../components/seo/StructuredData';
import { ArticleCard } from '../../components/articles/ArticleCard';
import { DisclaimerNotice } from '../../components/common/DisclaimerNotice';
import { BadgeCheck, BookOpen, ShieldCheck, ExternalLink, ArrowLeft, Users } from 'lucide-react';

export const AuthorProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [articles, setArticles] = useState<Article[]>([]);

  const author = slug ? AUTHORS.find((a) => a.slug === slug) : undefined;

  useEffect(() => {
    async function loadAuthorArticles() {
      const published = await articleService.getPublishedArticles();
      if (author) {
        setArticles(published.filter((a) => a.author_id === author.id));
      } else {
        setArticles(published);
      }
      window.scrollTo(0, 0);
    }
    loadAuthorArticles();
  }, [author]);

  // Directory view when visiting /authors/ without a specific slug
  if (!slug) {
    const breadcrumbs = [
      { label: 'Editorial Team', href: '/editorial-team/' },
      { label: 'Author Profiles' },
    ];

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <MetaTags
          title="Author Profiles & Financial Contributors"
          description="Explore profiles, credentials, and published guides from AI Finance Deals editors and analysts."
          canonicalPath="/authors/"
        />
        <StructuredData type="breadcrumbs" data={breadcrumbs} />
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-3 pb-6 border-b border-[#E2E8F0]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F4] text-[#00B894] rounded-full text-xs font-mono font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Author Directory</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
            Author Profiles & Editorial Accountability
          </h1>
          <p className="text-sm text-[#4B5563] max-w-2xl leading-relaxed">
            Every educational guide published on AI Finance Deals is attributed to a named contributor with transparent domain specialization and editorial oversight.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AUTHORS.map((a) => (
            <div key={a.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#0D1F3C] text-white flex items-center justify-center font-heading font-bold text-lg">
                  {a.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-heading font-bold text-base text-[#0D1F3C]">{a.name}</h2>
                    {a.verified && <BadgeCheck className="w-4 h-4 text-[#00B894] shrink-0" />}
                  </div>
                  <p className="text-xs font-semibold text-[#163A5F] mt-0.5">{a.role}</p>
                  <p className="text-[11px] font-mono text-[#00B894] mt-0.5">{a.credentials}</p>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">{a.bio}</p>
              </div>
              <Link
                to={`/authors/${a.slug}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-[#0D1F3C] hover:bg-[#163A5F] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                View Author Profile & Guides →
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <MetaTags
          title="Author Not Found"
          description="The requested contributor profile could not be found."
          canonicalPath={`/authors/${slug}`}
          robots="noindex, nofollow"
        />
        <h1 className="font-heading text-2xl font-bold text-[#0D1F3C]">Author Profile Not Found</h1>
        <p className="text-xs text-[#6B7280]">
          We could not locate a contributor matching this profile URL. Browse our full editorial directory below.
        </p>
        <Link
          to="/editorial-team/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D1F3C] text-white rounded-lg text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>View Editorial Team</span>
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Editorial Team', href: '/editorial-team/' },
    { label: author.name },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <MetaTags
        title={`${author.name} — Author Profile`}
        description={`${author.role} at AI Finance Deals. ${author.bio}`}
        canonicalPath={`/authors/${author.slug}`}
        type="profile"
      />
      <StructuredData type="person" data={author} />
      <StructuredData type="breadcrumbs" data={breadcrumbs} />

      <Breadcrumbs items={breadcrumbs} />

      <section className="bg-[#F5F8FC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#0D1F3C] text-white flex items-center justify-center font-heading font-extrabold text-2xl shrink-0">
              {author.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0D1F3C]">
                  {author.name}
                </h1>
                {author.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#E6F8F4] text-[#00B894] rounded-full text-[11px] font-mono font-semibold">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Editorial Profile
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[#163A5F] mt-1">{author.role}</p>
              <p className="text-xs font-mono text-[#00B894] mt-0.5">{author.credentials}</p>
            </div>
          </div>

          {author.linkedin_url && (
            <a
              href={author.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#CBD5E1] hover:border-[#0D1F3C] text-[#0D1F3C] text-xs font-semibold rounded-lg transition-colors self-start sm:self-center"
            >
              <span>External Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#6B7280]" />
            </a>
          )}
        </div>

        <p className="text-sm text-[#303846] leading-relaxed border-t border-[#E2E8F0] pt-5">
          {author.bio}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl space-y-1">
            <span className="font-bold text-[#0D1F3C] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00B894]" />
              <span>Editorial Standards & Independence</span>
            </span>
            <p className="text-[#6B7280] leading-relaxed">
              Contributions adhere strictly to our{' '}
              <Link to="/editorial-policy/" className="text-[#163A5F] hover:underline font-medium">
                Editorial Policy
              </Link>{' '}
              and{' '}
              <Link to="/fact-checking-policy/" className="text-[#163A5F] hover:underline font-medium">
                Fact-Checking Charter
              </Link>
              , with no commercial interference from advertisers.
            </p>
          </div>
          <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl space-y-1">
            <span className="font-bold text-[#0D1F3C] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#163A5F]" />
              <span>Published Guides Contributed</span>
            </span>
            <p className="text-[#6B7280] leading-relaxed">
              {articles.length} published educational {articles.length === 1 ? 'guide' : 'guides'} indexed below. Report any factual correction via our{' '}
              <Link to="/contact/" className="text-[#163A5F] hover:underline font-medium">
                Corrections Desk
              </Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-bold text-[#0D1F3C]">
          Published Articles by {author.name} ({articles.length})
        </h2>

        {articles.length === 0 ? (
          <div className="p-8 bg-white border border-[#E2E8F0] rounded-xl text-center text-xs text-[#6B7280]">
            No published articles are currently assigned to this author.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <ArticleCard key={art.id} article={art} variant="grid" />
            ))}
          </div>
        )}
      </section>

      <DisclaimerNotice />
    </div>
  );
};
