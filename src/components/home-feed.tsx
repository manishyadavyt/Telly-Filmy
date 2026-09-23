'use client';

import { HeroSlider } from '@/components/hero-slider';
import { PostCard } from '@/components/post-card';
import { AdSenseSlot } from '@/components/adsense-slot';
import { useLivePosts } from '@/lib/use-live-posts';
import type { Post } from '@/lib/types';
import Link from 'next/link';
import { Film, Tv, Sparkles } from 'lucide-react';

interface HomeFeedProps {
  initialPosts: Post[];
}

export function HomeFeed({ initialPosts }: HomeFeedProps) {
  const sortedPosts = useLivePosts(initialPosts);

  const topStories = sortedPosts.filter((post) => post.isTopStory);
  const bollywoodPosts = sortedPosts.filter((post) => post.category?.toLowerCase().includes('bollywood'));
  const tvPosts = sortedPosts.filter((post) => post.category?.toLowerCase().includes('tv'));
  const latestPosts = sortedPosts.slice(0, 8);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-6">
      {/* 1. LEADERBOARD AD */}
      <AdSenseSlot type="leaderboard" />

      {/* 2. HERO SLIDER GRID */}
      <HeroSlider topStories={topStories.length > 0 ? topStories : sortedPosts.slice(0, 5)} />

      {/* 3. SECTION 1: BOLLYWOOD SECTION */}
      <section className="my-8 sm:my-10 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b-2 border-rose-100">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-6 bg-[#e11d48] rounded-xs"></span>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Film className="w-5 h-5 text-[#e11d48]" /> BOLLYWOOD
            </h2>
          </div>
          <Link
            href="/category/bollywood"
            className="text-xs font-extrabold text-[#e11d48] hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            VIEW ALL BOLLYWOOD &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(bollywoodPosts.length > 0 ? bollywoodPosts : sortedPosts).slice(0, 4).map((post) => (
            <PostCard key={post.id || post.slug} post={post} variant="grid" />
          ))}
        </div>
      </section>

      {/* IN-FEED AD BANNER */}
      <AdSenseSlot type="in-feed" />

      {/* 4. SECTION 2: TV SERIALS SECTION */}
      <section className="my-8 sm:my-10 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b-2 border-rose-100">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-6 bg-[#e11d48] rounded-xs"></span>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Tv className="w-5 h-5 text-[#e11d48]" /> TV SERIALS & UPDATES
            </h2>
          </div>
          <Link
            href="/category/tv-serials"
            className="text-xs font-extrabold text-[#e11d48] hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            VIEW ALL TV &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(tvPosts.length > 0 ? tvPosts : sortedPosts).slice(0, 4).map((post) => (
            <PostCard key={post.id || post.slug} post={post} variant="grid" />
          ))}
        </div>
      </section>

      {/* 5. SECTION 3: LATEST STORIES FEED */}
      <section className="my-10 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b-2 border-rose-100">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-6 bg-[#e11d48] rounded-xs"></span>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#e11d48]" /> LATEST ENTERTAINMENT
            </h2>
          </div>
          <Link
            href="/posts"
            className="text-xs font-extrabold text-[#e11d48] hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            VIEW ALL ARTICLES &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestPosts.map((post) => (
            <PostCard key={post.id || post.slug} post={post} variant="grid" />
          ))}
        </div>
      </section>
    </div>
  );
}
