'use client';

import Link from 'next/link';
import type { Post } from '@/lib/types';

interface MarqueeSectionProps {
  posts: Post[];
}

export function MarqueeSection({ posts }: MarqueeSectionProps) {
  if (!posts || posts.length === 0) return null;

  const tickerPosts = posts.slice(0, 10);
  // Duplicate list to achieve infinite smooth marquee loop
  const duplicatedPosts = [...tickerPosts, ...tickerPosts];

  return (
    <div className="w-full bg-white border-b border-rose-100 text-slate-800 py-2 sm:py-3 overflow-hidden flex items-center shadow-xs">
      {/* Full-width ticker — no container padding */}
      <div className="w-full overflow-hidden">
        <div className="animate-marquee items-center space-x-8 sm:space-x-12 whitespace-nowrap">
          {duplicatedPosts.map((post, idx) => (
            <Link
              key={`${post.id}-${idx}`}
              href={`/posts/${post.slug}`}
              className="inline-flex items-center text-[12px] sm:text-[13px] text-slate-700 hover:text-[#e11d48] font-semibold transition-colors group mr-8 sm:mr-12"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] mr-2 shrink-0 group-hover:scale-125 transition-transform"></span>
              <span>{post.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
