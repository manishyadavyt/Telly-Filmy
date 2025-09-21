// src/app/posts/[slug]/page.tsx
import { getPostBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Tag } from 'lucide-react';
import Link from 'next/link';

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <article className="container max-w-4xl mx-auto py-8 md:py-12">

      {/* Header */}
      <div className="space-y-4 text-center">
        <Link href={`/category/${encodeURIComponent(post.category.toLowerCase())}`}>
          <Badge
            variant="secondary"
            className="w-fit cursor-pointer hover:bg-secondary/80 transition-colors"
          >
            {post.category}
          </Badge>
        </Link>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
          {post.title}
        </h1>
        <p className="text-lg text-muted-foreground">{post.excerpt}</p>
      </div>

      {/* Author + Meta */}
      <div className="my-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{post.author.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{readingTime} min read</span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg my-12">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          data-ai-hint={post.imageHint}
          priority
        />
      </div>

      {/* Content with paragraph spacing */}
      <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-foreground/90 leading-relaxed">
        {post.content.split('\n\n').map((para, i) => (
          <p key={i} className="mb-6">{para}</p>
        ))}
      </div>

      {/* YouTube Video */}
      {post.videoUrl && (
        <div className="my-12 relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={post.videoUrl}
            title={post.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
