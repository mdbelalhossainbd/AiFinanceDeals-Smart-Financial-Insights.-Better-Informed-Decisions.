import React, { useEffect, useRef, useState } from 'react';
import {
  getAdSenseConfig,
  ADSENSE_UPDATE_EVENT,
  isManualPlacementAllowed,
  isAdSenseEnvAuthorized,
  shouldRenderAdContainer,
  AdSenseGlobalConfig,
} from '../../config/adsenseConfig';

interface InArticleAdProps {
  slotId?: string;
  placementId?: string;
  className?: string;
  categorySlug?: string;
}

export const InArticleAd: React.FC<InArticleAdProps> = ({
  slotId,
  placementId = 'inArticlePrimary',
  className = '',
  categorySlug,
}) => {
  const [config, setConfig] = useState<AdSenseGlobalConfig>(getAdSenseConfig());
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AdSenseGlobalConfig>;
      setConfig(customEvent.detail || getAdSenseConfig());
    };
    window.addEventListener(ADSENSE_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(ADSENSE_UPDATE_EVENT, handleUpdate);
  }, []);

  const placementConfig = config.placements[placementId];
  const isAllowed =
    isManualPlacementAllowed(
      config,
      placementId,
      categorySlug,
      typeof window !== 'undefined' ? window.location.pathname : undefined
    ) && shouldRenderAdContainer(config);

  const isLiveAuthorized = isAdSenseEnvAuthorized(config);
  const activeSlotId = slotId || placementConfig?.slotId || '';

  useEffect(() => {
    if (!isAllowed || !isLiveAuthorized || !activeSlotId) return;
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('InArticleAd push notice:', e);
    }
  }, [isAllowed, isLiveAuthorized, activeSlotId]);

  if (!isAllowed) return null;

  return (
    <div className={`my-8 py-4 border-y border-[#F1F5F9] w-full overflow-hidden ${className}`}>
      <div className="max-w-xl mx-auto flex flex-col items-center">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#9CA3AF] mb-2 select-none text-center">
          Advertisement
        </span>

        <div className="w-full relative min-h-[120px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden flex items-center justify-center">
          {isLiveAuthorized ? (
            <ins
              ref={adRef}
              className="adsbygoogle"
              style={{ display: 'block', textAlign: 'center', width: '100%', minHeight: '120px' }}
              data-ad-layout="in-article"
              data-ad-format="fluid"
              data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID || config.publisherId || 'ca-pub-7571394117486446'}
              data-ad-slot={activeSlotId}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center text-[#64748B] select-none">
              <span className="text-[11px] font-mono font-semibold">In-Article Ad Preview (Test Mode)</span>
              <span className="text-[10px] font-mono mt-0.5 opacity-80">Slot: {activeSlotId || 'unassigned'} (fluid)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
