
import { HeroSlider } from '@/components/hero-slider';
import { MarqueeSection } from '@/components/marquee-section';
import { RecentPosts } from '@/components/recent-posts';
import { getPosts } from '@/lib/data';

export default async function Home() {
  const allPosts = await getPosts();
  const topStories = allPosts.filter((post) => post.isTopStory);
  const recentPosts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <MarqueeSection posts={recentPosts} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1">
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
