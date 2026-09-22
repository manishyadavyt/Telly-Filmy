'use client';

import Link from 'next/link';
import type { Post } from '@/lib/types';
import { Flame } from 'lucide-react';

interface MarqueeSectionProps {
  posts: Post[];
}

export function MarqueeSection({ posts }: MarqueeSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-rose-100 text-slate-800 py-2 px-4 overflow-hidden flex items-center shadow-xs">
      <div className="container mx-auto flex items-center gap-3">
        {/* BUZZ Label */}
        <div className="shrink-0 flex items-center gap-1 bg-[#e11d48] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-xs uppercase tracking-wider shadow-xs">
          <Flame className="w-3 h-3 text-white fill-white" />
          <span>BUZZ</span>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center space-x-8 animate-marquee whitespace-nowrap">
            {posts.slice(0, 8).map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="inline-flex items-center text-xs text-slate-700 hover:text-[#e11d48] font-semibold transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] mr-2 shrink-0"></span>
                <span>{post.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
