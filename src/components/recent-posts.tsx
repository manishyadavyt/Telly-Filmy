import { PostCard } from '@/components/post-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Post } from '@/lib/types';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RecentPostsProps {
  posts: Post[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  const trendingPosts = posts.filter((p) => p.isTrending);
  const recentPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const mostViewedPosts = [...posts].sort((a, b) => b.views - a.views);

  return (
    <Tabs defaultValue="recent" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
        <TabsTrigger value="recent">Recent</TabsTrigger>
        <TabsTrigger value="trending">Trending</TabsTrigger>
        <TabsTrigger value="most_viewed">Most Viewed</TabsTrigger>
      </TabsList>
      <TabsContent value="recent" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {recentPosts.slice(0, 6).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="trending" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {trendingPosts.slice(0, 6).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="most_viewed" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {mostViewedPosts.slice(0, 6).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>
      <div className="mt-10 text-center">
          <Button asChild variant="default" size="lg">
            <Link href="/posts">
              View All Posts <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
    </Tabs>
  );
}
