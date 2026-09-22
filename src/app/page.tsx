import { HeroSlider } from '@/components/hero-slider';
import { PostCard } from '@/components/post-card';
import { getPosts } from '@/lib/data';
import { AdSenseSlot } from '@/components/adsense-slot';
import { OrganizationJsonLd } from '@/components/json-ld';
import Link from 'next/link';
import { Flame, Film, Tv, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function Home() {
  const allPosts = await getPosts();
  
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const topStories = sortedPosts.filter((post) => post.isTopStory);
  const trendingPosts = sortedPosts.filter((post) => post.isTrending);
  const bollywoodPosts = sortedPosts.filter((post) => post.category.toLowerCase().includes('bollywood'));
  const tvPosts = sortedPosts.filter((post) => post.category.toLowerCase().includes('tv'));
  const latestPosts = sortedPosts.slice(0, 8);

  return (
    <>
      <OrganizationJsonLd />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* 2. LEADERBOARD AD */}
        <AdSenseSlot type="leaderboard" />

        {/* 3. HERO SLIDER GRID */}
        <HeroSlider topStories={topStories.length > 0 ? topStories : sortedPosts.slice(0, 5)} />

        {/* 4. SECTION 1: BOLLYWOOD SECTION (Matching Screenshot) */}
        <section className="my-10 space-y-5">
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
              <PostCard key={post.id} post={post} variant="grid" />
            ))}
          </div>
        </section>

        {/* IN-FEED AD BANNER */}
        <AdSenseSlot type="in-feed" />

        {/* 5. SECTION 2: TV SERIALS SECTION */}
        <section className="my-10 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b-2 border-rose-100">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-[#e11d48] rounded-xs"></span>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Tv className="w-5 h-5 text-[#e11d48]" /> TV SERIALS & SPOILERS
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
              <PostCard key={post.id} post={post} variant="grid" />
            ))}
          </div>
        </section>

        {/* 6. SECTION 3: LATEST STORIES FEED */}
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
              <PostCard key={post.id} post={post} variant="grid" />
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
