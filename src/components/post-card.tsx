import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/posts/${post.slug}`} className="block">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              data-ai-hint={post.imageHint}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-6">
        <Link href={`/category/${encodeURIComponent(post.category.toLowerCase())}`} className='w-fit'>
          <Badge variant="secondary" className="w-fit cursor-pointer hover:bg-secondary/80 transition-colors">{post.category}</Badge>
        </Link>
        <h3 className="mt-4 text-xl font-bold leading-tight text-foreground">
          <Link href={`/posts/${post.slug}`} className="stretched-link">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-grow">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          variant="link"
          className="p-0 text-sm font-semibold text-primary as-child"
          asChild
        >
          <Link href={`/posts/${post.slug}`}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
