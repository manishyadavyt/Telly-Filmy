
// src/app/posts/page.tsx
import { getPosts } from '@/lib/data';
import { PostCard } from '@/components/post-card';
import { List } from 'lucide-react';

export default async function AllPostsPage() {
  const allPosts = await getPosts();

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-8">
        <List className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          All Posts
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
