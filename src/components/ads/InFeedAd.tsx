import React, { useEffect, useRef, useState } from 'react';
import {
  getAdSenseConfig,
  ADSENSE_UPDATE_EVENT,
  isManualPlacementAllowed,
  isAdSenseEnvAuthorized,
  shouldRenderAdContainer,
  AdSenseGlobalConfig,
} from '../../config/adsenseConfig';

interface InFeedAdProps {
  slotId?: string;
  placementId?: string;
  className?: string;
  categorySlug?: string;
}

export const InFeedAd: React.FC<InFeedAdProps> = ({
  slotId,
  placementId = 'inFeedNative',
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
  const layoutKey = placementConfig?.layoutKey || '-fb+5w+4e-db+86';

  useEffect(() => {
    if (!isAllowed || !isLiveAuthorized || !activeSlotId) return;
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('InFeedAd push notice:', e);
    }
  }, [isAllowed, isLiveAuthorized, activeSlotId]);

  if (!isAllowed) return null;

  return (
    <div
      className={`group bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between min-h-[300px] relative ${className}`}
    >
      <div className="p-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between text-xs">
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF] px-2 py-0.5 rounded bg-white border border-[#E2E8F0]">
          Advertisement
        </span>
        <span className="text-[11px] text-[#6B7280] font-medium">
          Sponsored Placement
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-center items-center relative overflow-hidden">
        {isLiveAuthorized ? (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '220px' }}
            data-ad-format="fluid"
            data-ad-layout-key={layoutKey}
            data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID || config.publisherId || 'ca-pub-7571394117486446'}
            data-ad-slot={activeSlotId}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-[#64748B] select-none">
            <span className="text-xs font-heading font-semibold">
              In-Feed Ad Preview (Test Mode)
            </span>
            <span className="text-[10px] font-mono mt-1 opacity-80">
              Slot ID: {activeSlotId || 'unassigned'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
