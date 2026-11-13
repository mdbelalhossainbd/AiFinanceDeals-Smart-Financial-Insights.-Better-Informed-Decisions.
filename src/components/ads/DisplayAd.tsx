import React, { useEffect, useRef, useState } from 'react';
import {
  getAdSenseConfig,
  AdFormatType,
  DeviceVisibility,
  ADSENSE_UPDATE_EVENT,
  isManualPlacementAllowed,
  isAdSenseEnvAuthorized,
  shouldRenderAdContainer,
  AdSenseGlobalConfig,
} from '../../config/adsenseConfig';

interface DisplayAdProps {
  placementId?: string;
  slotId?: string;
  format?: AdFormatType;
  deviceVisibility?: DeviceVisibility;
  minHeight?: number;
  maxWidth?: number;
  className?: string;
  label?: string;
  customStyle?: React.CSSProperties;
  categorySlug?: string;
}

export const DisplayAd: React.FC<DisplayAdProps> = ({
  placementId,
  slotId,
  format = 'horizontal',
  deviceVisibility = 'all',
  minHeight,
  maxWidth,
  className = '',
  label,
  customStyle = {},
  categorySlug,
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const [config, setConfig] = useState<AdSenseGlobalConfig>(getAdSenseConfig());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AdSenseGlobalConfig>;
      setConfig(customEvent.detail || getAdSenseConfig());
    };
    window.addEventListener(ADSENSE_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(ADSENSE_UPDATE_EVENT, handleUpdate);
  }, []);

  const placementConfig = placementId ? config.placements[placementId] : null;
  const isAllowed =
    isManualPlacementAllowed(
      config,
      placementId,
      categorySlug,
      typeof window !== 'undefined' ? window.location.pathname : undefined
    ) && shouldRenderAdContainer(config);

  const isLiveAuthorized = isAdSenseEnvAuthorized(config);
  const activeSlotId = slotId || placementConfig?.slotId || '';
  const activeFormat = format || placementConfig?.format || 'horizontal';
  const activeVisibility = deviceVisibility || placementConfig?.deviceVisibility || 'all';
  const effectiveMinHeight = minHeight || placementConfig?.minHeight || (activeFormat === 'vertical' ? 600 : 90);
  const effectiveMaxWidth = maxWidth || placementConfig?.maxWidth;

  useEffect(() => {
    if (!isAllowed || !isLiveAuthorized || !activeSlotId) return;

    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.warn('AdSense push notice:', err);
    }
  }, [isAllowed, isLiveAuthorized, activeSlotId]);

  if (!isAllowed) {
    return null;
  }

  const getVisibilityClass = () => {
    switch (activeVisibility) {
      case 'desktop-only':
        return 'hidden lg:flex';
      case 'mobile-only':
        return 'flex lg:hidden';
      case 'desktop-tablet':
        return 'hidden sm:flex';
      default:
        return 'flex';
    }
  };

  return (
    <div
      className={`my-6 flex-col items-center justify-center w-full max-w-full overflow-hidden ${getVisibilityClass()} ${className}`}
      style={{
        maxWidth: effectiveMaxWidth ? `${effectiveMaxWidth}px` : undefined,
        margin: '1.5rem auto',
      }}
    >
      <span className="text-[10px] uppercase font-mono tracking-widest text-[#9CA3AF] mb-1.5 select-none text-center block">
        {label || 'Advertisement'}
      </span>

      <div
        className="w-full relative flex items-center justify-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg overflow-hidden transition-all"
        style={{
          minHeight: `${effectiveMinHeight}px`,
          ...customStyle,
        }}
      >
        {isLiveAuthorized ? (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{
              display: 'block',
              width: '100%',
              minHeight: `${effectiveMinHeight}px`,
              textAlign: 'center',
            }}
            data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID || config.publisherId || 'ca-pub-7571394117486446'}
            data-ad-slot={activeSlotId}
            data-ad-format={activeFormat === 'square' ? 'rectangle' : activeFormat === 'vertical' ? 'vertical' : 'auto'}
            data-full-width-responsive="true"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-3 select-none text-[#64748B]">
            <span className="text-[11px] font-mono font-semibold">Ad Placement Preview (Test Mode)</span>
            <span className="text-[10px] font-mono mt-0.5 opacity-80">
              {placementId || 'custom'} · {activeFormat} · Slot {activeSlotId || 'unassigned'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
