import React from 'react';
import { DisplayAd } from './DisplayAd';

interface AdSkyscraperProps {
  slotId?: string;
  placementId?: string;
  className?: string;
  isSticky?: boolean;
}

export const AdSkyscraper: React.FC<AdSkyscraperProps> = ({
  slotId,
  placementId = 'sidebarSkyscraper',
  className = '',
  isSticky = false,
}) => {
  return (
    <div className={`hidden lg:flex flex-col items-center justify-start w-full ${isSticky ? 'sticky top-24' : ''} ${className}`}>
      <DisplayAd
        placementId={placementId}
        slotId={slotId}
        format="vertical"
        deviceVisibility="desktop-only"
        minHeight={600}
        maxWidth={300}
        label="Advertisement"
        className="my-2"
      />
    </div>
  );
};
