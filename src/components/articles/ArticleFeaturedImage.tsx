import React, { useEffect, useRef, useState } from 'react';

interface ArticleFeaturedImageProps {
  src?: string;
  alt: string;
  title: string;
  categoryName?: string;
  priority?: boolean;
  aspectClassName?: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
}

export const ArticleFeaturedImage: React.FC<ArticleFeaturedImageProps> = ({
  src,
  alt,
  title,
  categoryName = 'Financial Guide',
  priority = false,
  aspectClassName = 'aspect-video',
  className = '',
  imgClassName = '',
  width = 1280,
  height = 720,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [src]);

  const safeAlt = (alt || title || 'AI Finance Deals financial guide illustration').trim();

  if (failed || !src) {
    return (
      <div
        className={`relative w-full ${aspectClassName} overflow-hidden bg-gradient-to-br from-[#0D1F3C] via-[#163A5F] to-[#0F2C4C] flex flex-col items-center justify-center p-6 text-center text-white ${className}`}
        role="img"
        aria-label={safeAlt}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 25%, #00B894 0%, transparent 45%), radial-gradient(circle at 80% 75%, #00C2E0 0%, transparent 45%)',
          }}
        />
        <div className="relative z-10 max-w-md space-y-2">
          <span className="inline-block px-2.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] font-mono uppercase tracking-wider text-[#00C2E0]">
            {categoryName}
          </span>
          <span className="block font-heading font-bold text-sm sm:text-base leading-snug text-white line-clamp-2">
            {title}
          </span>
          <span className="block text-[11px] font-mono text-[#00B894]">
            AI Finance Deals · Editorial Visual
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectClassName} overflow-hidden bg-slate-100 ${className}`}>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse"
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={safeAlt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
};
