import React from 'react';
import { DisplayAd } from '../ads/DisplayAd';

interface AdPlaceholderProps {
  slotId?: string;
  placementId?: string;
  format?: 'leaderboard' | 'rectangle' | 'in-feed' | 'horizontal' | 'square' | 'vertical';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  slotId,
  placementId,
  format = 'rectangle',
  className = '',
}) => {
  const adFormat = format === 'leaderboard' ? 'horizontal' : format === 'in-feed' ? 'horizontal' : format === 'vertical' ? 'vertical' : 'square';
  const minHeight = format === 'leaderboard' ? 90 : format === 'in-feed' ? 120 : format === 'vertical' ? 600 : 250;
  const maxWidth = format === 'leaderboard' ? 970 : format === 'in-feed' ? undefined : format === 'vertical' ? 300 : 336;

  return (
    <DisplayAd
      placementId={placementId}
      slotId={slotId}
      format={adFormat}
      minHeight={minHeight}
      maxWidth={maxWidth}
      className={className}
    />
  );
};

