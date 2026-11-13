import React, { useEffect } from 'react';
import { BreadcrumbItem } from '../../types';
import { SITE_URL } from '../../config/siteConfig';

interface StructuredDataProps {
  type: 'organization' | 'article' | 'breadcrumbs' | 'person';
  data?: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  useEffect(() => {
    let schemaObj: Record<string, unknown> | null = null;

    if (type === 'organization') {
      schemaObj = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'NewsMediaOrganization',
            '@id': `${SITE_URL}/#organization`,
            name: 'AI Finance Deals',
            url: SITE_URL,
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/icons/logo.svg`,
            },
            description:
              'Smart Financial Insights. Better Informed Decisions. Independent educational personal finance guides, insurance comparisons, and verified banking analysis.',
            publishingPrinciples: `${SITE_URL}/editorial-policy/`,
            correctionsPolicy: `${SITE_URL}/corrections-policy/`,
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'Editorial & Corrections Desk',
              email: 'editorial@aifinancedeals.com',
              url: `${SITE_URL}/contact/`,
            },
          },
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: 'AI Finance Deals',
            publisher: { '@id': `${SITE_URL}/#organization` },
            potentialAction: {
              '@type': 'SearchAction',
              target: `${SITE_URL}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
        ],
      };
    } else if (type === 'article' && data) {
      const resolvedImg =
        typeof data.featured_image === 'string' && data.featured_image.startsWith('http')
          ? data.featured_image
          : `${SITE_URL}${data.featured_image || '/og-default.jpg'}`;
      schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.excerpt,
        image: resolvedImg,
        datePublished: data.published_at,
        dateModified: data.updated_at,
        author: {
          '@type': 'Person',
          name: data.author?.name || 'Editorial Team',
          jobTitle: data.author?.role || 'Financial Analyst',
          url: data.author?.slug
            ? `${SITE_URL}/authors/${data.author.slug}`
            : `${SITE_URL}/editorial-team/`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'AI Finance Deals',
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/icons/logo.svg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/articles/${data.slug}`,
        },
      };
    } else if (type === 'person' && data) {
      schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: data.name,
        jobTitle: data.role,
        description: data.bio,
        url: `${SITE_URL}/authors/${data.slug}`,
        worksFor: {
          '@type': 'Organization',
          name: 'AI Finance Deals',
          url: SITE_URL,
        },
        sameAs: [data.linkedin_url].filter(Boolean),
      };
    } else if (type === 'breadcrumbs' && Array.isArray(data)) {
      schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          ...data.map((item: BreadcrumbItem, index: number) => ({
            '@type': 'ListItem',
            position: index + 2,
            name: item.label,
            ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
          })),
        ],
      };
    }

    if (!schemaObj) return;

    const scriptId = `schema-jsonld-${type}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemaObj);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [type, data]);

  return null;
};
