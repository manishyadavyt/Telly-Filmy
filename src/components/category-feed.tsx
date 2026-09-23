'use client';

import { PostCard } from '@/components/post-card';
import { AdSenseSlot } from '@/components/adsense-slot';
import { useLivePosts } from '@/lib/use-live-posts';
import type { Post } from '@/lib/types';
import type { CategoryInfo } from '@/lib/categories';
import Link from 'next/link';

interface CategoryFeedProps {
  initialPosts: Post[];
  category: CategoryInfo;
}

export function CategoryFeed({ initialPosts, category }: CategoryFeedProps) {
  const livePosts = useLivePosts(initialPosts);

  const posts = livePosts.filter((post) => {
    const postCat = (post.category || '').toLowerCase().trim();
    const postCatClean = postCat.replace(/\s+/g, '-');

    if (postCat === category.name.toLowerCase() || postCatClean === category.slug) return true;
    if (
      category.aliases?.some(
        (alias) =>
          postCat === alias ||
          postCatClean === alias ||
          postCat.includes(alias) ||
          alias.includes(postCat)
      )
    ) {
      return true;
    }
    if (
      (category.slug === 'trending' || category.slug === 'spoilers') &&
      (post.isTrending || post.isTopStory)
    ) {
      return true;
    }
    return false;
  });

  return (
    <main className="container mx-auto max-w-7xl py-5 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#e11d48] transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{category.name}</span>
      </nav>

      {/* Top AdSense Banner */}
      <AdSenseSlot type="leaderboard" />

      {/* Category Header */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-rose-100/90 shadow-xs relative overflow-hidden">
        <div className="flex items-start space-x-3.5">
          <span className="w-1.5 h-8 sm:h-9 bg-[#e11d48] rounded-xs shrink-0 mt-0.5"></span>
          <div>
            <h1 className="font-outfit text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-900">
              {category.name}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm font-normal mt-1">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Category Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {posts.map((post) => (
            <PostCard key={post.id || post.slug} post={post} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8 space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-[#e11d48] rounded-full flex items-center justify-center mx-auto text-2xl">
            📂
          </div>
          <h3 className="font-outfit text-lg font-bold text-slate-900">
            Latest articles in {category.name} coming soon
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Check out all latest articles and breaking entertainment news on our homepage.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#e11d48] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-rose-700 transition-colors shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      )}

      {/* Bottom AdSense Banner */}
      <AdSenseSlot type="in-feed" />
    </main>
  );
}
