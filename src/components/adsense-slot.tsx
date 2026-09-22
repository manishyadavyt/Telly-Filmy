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

  // If no AdSense ID is set, display a sleek placeholder in dev
  if (!adSensePublisherId) {
    const heightMap = {
      leaderboard: 'h-24 sm:h-28',
      sidebar: 'h-64 sm:h-72',
      'in-feed': 'h-32 sm:h-40',
      footer: 'h-20 sm:h-24',
    };

    const labelMap = {
      leaderboard: 'ADVERTISEMENT • LEADERBOARD (728x90)',
      sidebar: 'ADVERTISEMENT • SIDEBAR (300x250 / 300x600)',
      'in-feed': 'ADVERTISEMENT • IN-ARTICLE FEED',
      footer: 'ADVERTISEMENT • FOOTER BANNER',
    };

    return (
      <div className={`w-full my-6 flex flex-col items-center justify-center rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-slate-500 text-xs font-mono uppercase tracking-wider overflow-hidden group hover:border-orange-500/30 transition-colors ${heightMap[type]} ${className}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-orange-500/60 animate-pulse"></span>
          <span className="text-slate-400 font-semibold">{labelMap[type]}</span>
        </div>
        <span className="text-[10px] text-slate-600">Google AdSense Slot Ready</span>
      </div>
    );
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
