import { getPosts } from '@/lib/data';
import { PostCard } from '@/components/post-card';
import { AdSenseSlot } from '@/components/adsense-slot';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import Link from 'next/link';
import { Sparkles, Search, Newspaper } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}): Promise<Metadata> {
  const { search } = await searchParams;
  if (search) {
    return {
      title: `Search results for "${search}" | Telly Filmy`,
      description: `Explore all latest news, updates, and articles for ${search} on Telly Filmy.`,
      alternates: {
        canonical: `https://www.tellyfilmy.com/posts?search=${encodeURIComponent(search)}`,
      },
    };
  }

  return {
    title: 'Latest Entertainment News, Serials & Bollywood Articles | Telly Filmy',
    description:
      'Browse all breaking entertainment news, TV serial spoilers, celebrity updates, and Bollywood gossips on Telly Filmy.',
    alternates: {
      canonical: 'https://www.tellyfilmy.com/posts',
    },
  };
}

export default async function AllPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const allPosts = await getPosts();

  const filteredPosts = search
    ? allPosts.filter((post) => {
        const q = search.toLowerCase();
        return (
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.category.toLowerCase().includes(q) ||
          post.tags?.some((t) => t.toLowerCase().includes(q))
        );
      })
    : allPosts;

  const breadcrumbs = [
    { name: 'Home', item: 'https://www.tellyfilmy.com' },
    { name: search ? `Search: ${search}` : 'All Articles', item: 'https://www.tellyfilmy.com/posts' },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      
      <main className="container mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumb nav */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-[#e11d48]">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{search ? `Search: "${search}"` : 'All Articles'}</span>
        </nav>

        {/* Top AdSense Slot */}
        <AdSenseSlot type="leaderboard" />

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {search ? <Search className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              {search ? 'Search Results' : 'Explore All Stories'}
            </div>
            <h1 className="font-outfit text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {search ? `Results for "${search}"` : 'Latest Entertainment News'}
            </h1>
            <p className="text-rose-100 text-xs sm:text-sm font-normal">
              Found {filteredPosts.length} article{filteredPosts.length === 1 ? '' : 's'}. Stay updated with real-time TV serial buzz and Bollywood gossips.
            </p>
          </div>
        </div>

        {/* Post Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} variant="grid" />
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
    </>
  );
}
