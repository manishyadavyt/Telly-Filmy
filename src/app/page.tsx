
import { HeroSlider } from '@/components/hero-slider';
import { MarqueeSection } from '@/components/marquee-section';
import { RecentPosts } from '@/components/recent-posts';
import { PostCard } from '@/components/post-card';
import { getPosts } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const allPosts = await getPosts();
  const topStories = allPosts.filter((post) => post.isTopStory);
  const recentPosts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <MarqueeSection posts={recentPosts} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        
        {/* MOBILE VIEW */}
        <div className="md:hidden flex flex-col gap-6">
          {/* Featured / Breaking Post */}
          {topStories.length > 0 && (
            <div className="flex flex-col gap-3">
              <Link href={`/posts/${topStories[0].slug}`} className="relative aspect-video w-full overflow-hidden rounded-xl shadow-sm">
                <Image
                  src={topStories[0].imageUrl}
                  alt={topStories[0].title}
                  fill
                  className="object-cover"
                  priority
                />
              </Link>
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      Breaking
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {new Date(topStories[0].date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                 </div>
                 <Link href={`/posts/${topStories[0].slug}`}>
                   <h2 className="text-lg font-bold leading-tight text-gray-900">
                     {topStories[0].title}
                   </h2>
                 </Link>
                 <p className="text-sm text-gray-600 line-clamp-2">
                    {topStories[0].excerpt}
                 </p>
              </div>
            </div>
          )}

          {/* List of Recent Posts */}
          <div className="flex flex-col gap-4">
             {recentPosts.slice(1, 10).map((post) => (
                <PostCard key={post.id} post={post} variant="horizontal" />
             ))}
          </div>
          
           <div className="text-center mt-4">
               <Link href="/posts" className="text-sm font-medium text-primary underline">
                  View More News
               </Link>
           </div>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:grid grid-cols-1">
          <div className="md:col-span-12">
            <HeroSlider topStories={topStories} />
            <div className="mt-12">
              <RecentPosts posts={allPosts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
