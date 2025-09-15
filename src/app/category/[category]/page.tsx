
// src/app/category/[category]/page.tsx
import { getPosts } from '@/lib/data';
import { PostCard } from '@/components/post-card';
import { notFound } from 'next/navigation';
import { Tag } from 'lucide-react';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const allPosts = await getPosts();
  const decodedCategory = decodeURIComponent(params.category);
  const posts = allPosts.filter(
    (post) => post.category.toLowerCase() === decodedCategory.toLowerCase()
  );

  if (posts.length === 0) {
    notFound();
  }

  const categoryName = posts[0].category;

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-8">
        <Tag className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Posts in <span className="text-primary">{categoryName}</span>
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
