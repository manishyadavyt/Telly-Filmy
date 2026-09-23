'use client';

import { PostCard } from '@/components/post-card';
import { AdSenseSlot } from '@/components/adsense-slot';
import { useLivePosts } from '@/lib/use-live-posts';
import type { Post } from '@/lib/types';
import Link from 'next/link';
import { Sparkles, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

interface AllPostsFeedProps {
  initialPosts: Post[];
}

export function AllPostsFeed({ initialPosts }: AllPostsFeedProps) {
  const livePosts = useLivePosts(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return livePosts;
    const q = searchTerm.toLowerCase().trim();
    return livePosts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [livePosts, searchTerm]);

  return (
    <main className="container mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumb nav */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-[#e11d48]">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">
          {searchTerm ? `Search: "${searchTerm}"` : 'All Articles'}
        </span>
      </nav>

      {/* Top AdSense Slot */}
      <AdSenseSlot type="leaderboard" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {searchTerm ? <Search className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            {searchTerm ? 'Search Results' : 'Explore All Stories'}
          </div>
          <h1 className="font-outfit text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {searchTerm ? `Results for "${searchTerm}"` : 'Latest Entertainment News'}
          </h1>
          <p className="text-rose-100 text-xs sm:text-sm font-normal">
            Found {filteredPosts.length} article{filteredPosts.length === 1 ? '' : 's'}. Stay updated with real-time TV serial updates and Bollywood gossips.
          </p>

          {/* Quick search input */}
          <div className="pt-2">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter stories by keyword..."
                className="w-full bg-white/95 text-slate-900 placeholder:text-slate-500 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Post Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {filteredPosts.map((post) => (
            <PostCard key={post.id || post.slug} post={post} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8 space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-[#e11d48] rounded-full flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="font-outfit text-lg font-bold text-slate-900">No articles matched your search</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Try searching with a different keyword or explore our trending entertainment topics.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="inline-flex items-center gap-2 bg-[#e11d48] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-rose-700 transition-colors shadow-sm"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Bottom AdSense Banner */}
      <AdSenseSlot type="in-feed" />
    </main>
  );
}
