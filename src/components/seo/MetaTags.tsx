import React, { useEffect } from 'react';
import { SITE_URL } from '../../config/siteConfig';

interface MetaTagsProps {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  robots?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  canonicalPath = '/',
  type = 'website',
  image = `${SITE_URL}/og-default.jpg`,
  publishedTime,
  modifiedTime,
  authorName,
  robots = 'index, follow',
}) => {
  useEffect(() => {
    const fullTitle = title.includes('AI Finance Deals') ? title : `${title} | AI Finance Deals`;
    document.title = fullTitle;

    const resolvedImage = image.startsWith('http')
      ? image
      : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const normalizedPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    const canonicalUrl = `${SITE_URL}${normalizedPath}`;

    setMeta('description', description);
    setMeta('robots', robots);
    setMeta('og:site_name', 'AI Finance Deals', true);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', resolvedImage, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', resolvedImage);

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    if (publishedTime) {
      setMeta('article:published_time', publishedTime, true);
    }
    if (modifiedTime) {
      setMeta('article:modified_time', modifiedTime, true);
    }
    if (authorName) {
      setMeta('article:author', authorName, true);
    }
  }, [title, description, canonicalPath, type, image, publishedTime, modifiedTime, authorName, robots]);

  return null;
};
