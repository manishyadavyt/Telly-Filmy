// src/app/posts/[slug]/page.tsx
import { getPostBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Tag } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

// ✅ Generate SEO Metadata for each Post
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) return { title: 'Post Not Found | Telly Filmy' };

  const baseUrl = 'https://www.tellyfilmy.com';
  const url = `${baseUrl}/posts/${post.slug}`;

  return {
    title: `${post.title} | Telly Filmy`,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: 'Telly Filmy',
      type: 'article',
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
      creator: '@TellyFilmy',
    },
  };
}

// ✅ Main Post Page
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) notFound();

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  // ✅ Render content with inline image placeholders
  const renderContent = () => {
    const images = post.images ?? [];
    const paragraphs = post.content.split('\n\n');

    return paragraphs.map((para, i) => {
      const match = para.trim().match(/^\[image(\d+)(?::\s*(.+))?\]$/i);
      if (match) {
        const index = parseInt(match[1], 10) - 1;
        const caption = match[2] || '';
        const imageUrl = images[index];
        if (imageUrl) {
          return (
            <figure key={`image-${index}`} className="my-8">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={imageUrl}
                  alt={`${post.title} - image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
              {caption && (
                <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
        }
      }
      return (
        <p key={i} className="mb-6">
          {para}
        </p>
      );
    });
  };

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

      {/* Author + Meta Info */}
      <div className="my-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
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
          priority
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-foreground/90 leading-relaxed">
        {renderContent()}
      </div>

      {/* Optional Video */}
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
      {post.tags?.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
