import Link from 'next/link';
import { Sparkle } from 'lucide-react';
import type { Post } from '@/lib/types';

interface MarqueeSectionProps {
  posts: Post[];
}

export function MarqueeSection({ posts }: MarqueeSectionProps) {
  const marqueePosts = [...posts, ...posts];

  return (
    <div
      className="relative flex overflow-x-hidden border-b py-3"
      style={{ background: 'linear-gradient(90deg, #ff6a00, #ee0979)' }}
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {marqueePosts.map((post, index) => (
          <Link
            key={`${post.id}-${index}`}
            href={`/posts/${post.slug}`}
            className="flex items-center mx-4 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <Sparkle className="mr-2 h-4 w-4 text-primary-foreground/50 flex-shrink-0" />
            <span>{post.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
