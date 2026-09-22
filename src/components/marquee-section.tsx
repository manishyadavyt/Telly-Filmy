'use client';

import Link from 'next/link';
import type { Post } from '@/lib/types';
import { Flame } from 'lucide-react';

interface MarqueeSectionProps {
  posts: Post[];
}

export function MarqueeSection({ posts }: MarqueeSectionProps) {
  if (!posts || posts.length === 0) return null;

  const tickerPosts = posts.slice(0, 10);
  // Duplicate list to achieve infinite smooth marquee loop
  const duplicatedPosts = [...tickerPosts, ...tickerPosts];

  return (
    <div className="w-full bg-white border-b border-rose-100 text-slate-800 py-1.5 sm:py-2.5 px-2.5 sm:px-4 overflow-hidden flex items-center shadow-xs">
      <div className="container mx-auto flex items-center gap-2 sm:gap-3">
        {/* TOP STORIES Label */}
        <div className="shrink-0 flex items-center gap-1 bg-[#e11d48] text-white text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xs uppercase tracking-wider shadow-xs select-none">
          <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-white animate-pulse" />
          <span>TOP STORIES</span>
        </div>

        {/* Sliding Ticker Content */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee items-center space-x-6 sm:space-x-8 whitespace-nowrap will-change-transform">
            {duplicatedPosts.map((post, idx) => (
              <Link
                key={`${post.id}-${idx}`}
                href={`/posts/${post.slug}`}
                className="inline-flex items-center text-[11px] sm:text-xs text-slate-700 hover:text-[#e11d48] font-semibold transition-colors group mr-6 sm:mr-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] mr-1.5 sm:mr-2 shrink-0 group-hover:scale-125 transition-transform"></span>
                <span className="truncate max-w-[200px] sm:max-w-md">{post.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
