import React, { useEffect, useRef, useState } from 'react';
import {
  getAdSenseConfig,
  ADSENSE_UPDATE_EVENT,
  isManualPlacementAllowed,
  isAdSenseEnvAuthorized,
  shouldRenderAdContainer,
  AdSenseGlobalConfig,
} from '../../config/adsenseConfig';

interface MultiplexAdProps {
  slotId?: string;
  placementId?: string;
  variant?: 'horizontal' | 'vertical';
  className?: string;
  categorySlug?: string;
}

export const MultiplexAd: React.FC<MultiplexAdProps> = ({
  slotId,
  placementId = 'multiplexFooter',
  variant = 'horizontal',
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
      console.warn('MultiplexAd push notice:', e);
    }
  }, [isAllowed, isLiveAuthorized, activeSlotId]);

  if (!isAllowed) return null;

  return (
    <div className={`my-8 p-5 sm:p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden ${className}`}>
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E8F0]">
        <span className="text-xs font-heading font-bold text-[#0D1F3C]">
          Sponsored Financial Resources
        </span>
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#9CA3AF] select-none">
          Advertisement
        </span>
      </div>

      <div className="relative min-h-[200px] w-full flex items-center justify-center">
        {isLiveAuthorized ? (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: variant === 'horizontal' ? '200px' : '450px' }}
            data-ad-format="autorelaxed"
            data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID || config.publisherId || 'ca-pub-7571394117486446'}
            data-ad-slot={activeSlotId}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4 text-[#64748B] select-none">
            <span className="text-xs font-mono font-semibold">Multiplex Ad Preview (Test Mode)</span>
            <span className="text-[10px] font-mono mt-1 opacity-80">Slot ID: {activeSlotId || 'unassigned'} (autorelaxed)</span>
          </div>
        )}
      </div>
    </div>
  );
};
