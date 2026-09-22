'use client';

import { useEffect } from 'react';

interface AdSenseSlotProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
  type?: 'leaderboard' | 'sidebar' | 'in-feed' | 'footer';
}

export function AdSenseSlot({
  slot = '1234567890',
  format = 'auto',
  responsive = true,
  className = '',
  type = 'leaderboard',
}: AdSenseSlotProps) {
  const adSensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (adSensePublisherId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense script error:', err);
      }
    }
  }, [adSensePublisherId]);

  // If no AdSense ID is set, hide the slot completely
  if (!adSensePublisherId) {
    return null;
  }

  return (
    <div className={`w-full my-6 overflow-hidden text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adSensePublisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
