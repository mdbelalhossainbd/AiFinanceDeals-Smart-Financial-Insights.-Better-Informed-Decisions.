import React from 'react';
import { DisplayAd } from './DisplayAd';

interface AdBannerProps {
  position?: 'header' | 'footer' | 'content';
  slotId?: string;
  placementId?: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  position = 'header',
  slotId,
  placementId,
  className = '',
}) => {
  const resolvedPlacementId = placementId || (position === 'header' ? 'headerBanner' : 'footerBanner');

  return (
    <div className={`w-full py-2 px-4 flex justify-center items-center ${className}`}>
      <DisplayAd
        placementId={resolvedPlacementId}
        slotId={slotId}
        format="horizontal"
        minHeight={90}
        maxWidth={970}
        label={`Advertisement · ${position.toUpperCase()}`}
        className="my-3"
      />
    </div>
  );
};
