import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'horizontal';
  className?: string; // Add className prop for flexibility
}

export function PostCard({ post, variant = 'default', className }: PostCardProps) {
  if (variant === 'horizontal') {
    return (
      <Card className={cn("flex flex-row overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all active:scale-[0.98]", className)}>
        {/* Thumbnail (Left) */}
        <Link href={`/posts/${post.slug}`} className="relative h-28 w-32 flex-shrink-0 sm:w-40">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint={post.imageHint}
            sizes="(max-width: 768px) 33vw, 20vw"
          />
        </Link>

        {/* Content (Right) */}
        <CardContent className="flex flex-1 flex-col justify-center p-3">
           <Link
              href={`/category/${encodeURIComponent(post.category.toLowerCase())}`}
              className="mb-1 w-fit"
           >
              {/* Optional: Show category or breaking badge if needed. For list, usually minimal. */}
              {post.isTopStory && (
                  <Badge variant="destructive" className="h-5 px-1.5 text-[9px] uppercase tracking-wider">
                      Breaking
                  </Badge>
              )}
           </Link>

          <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground sm:text-base">
            <Link href={`/posts/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          
           <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>{post.category}</span>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}</span>
           </div>
        </CardContent>
      </Card>
    );
  }

  // Default Vertical Card
  return (
    <Card className={cn("group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-200", className)}>
      {/* Thumbnail */}
      <Link href={`/posts/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint={post.imageHint}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </Link>

      {/* Content */}
      <CardContent className="flex flex-col p-4">
        <Link
          href={`/category/${encodeURIComponent(post.category.toLowerCase())}`}
          className="w-fit"
        >
          <Badge
            variant="secondary"
            className="text-[11px] font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
          >
            {post.category}
          </Badge>
        </Link>

        <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground line-clamp-2">
          <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>

        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button
          variant="link"
          className="p-0 text-sm font-medium text-primary"
          asChild
        >
          <Link href={`/posts/${post.slug}`}>
            Read More <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
