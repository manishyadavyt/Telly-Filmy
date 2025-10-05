import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-200">
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
