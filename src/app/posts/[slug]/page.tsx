// src/app/posts/[slug]/page.tsx

import { getPostBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShareButtons } from '@/components/share-buttons';


// ✅ Generate SEO Metadata (Supports Multiple Images)
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) return { title: 'Post Not Found | Telly Filmy' };

  const baseUrl = 'https://www.tellyfilmy.com';
  const url = `${baseUrl}/posts/${post.slug}`;

  const images = post.images?.length
    ? post.images
    : [post.imageUrl];

  return {
    title: `${post.title} | Telly Filmy`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: 'Telly Filmy',
      type: 'article',
      images: images.map((img: string) => ({
        url: img,
        width: 1200,
        height: 630,
        alt: post.title,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images,
      creator: '@TellyFilmy',
    },
  };
}


// ✅ Main Post Page
export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const readingTime = Math.ceil(post.content.split(' ').length / 200);
  const paragraphs = post.content.split('\n\n');
  const midIndex = Math.floor(paragraphs.length / 2);

  return (
    <article className="container max-w-4xl mx-auto py-6 md:py-10 px-4">

      {/* Category */}
      <Link href={`/category/${encodeURIComponent(post.category.toLowerCase())}`}>
        <Badge
          variant="destructive"
          className="w-fit cursor-pointer hover:bg-destructive/90 transition-colors uppercase text-[10px] tracking-wider px-2 py-0.5"
        >
          {post.category}
        </Badge>
      </Link>

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold leading-tight mt-4">
        {post.title}
      </h1>

      {/* Excerpt */}
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed mt-3">
        {post.excerpt}
      </p>

      {/* Date + Reading Time */}
      <div className="text-xs text-muted-foreground font-medium mt-2">
        Published: {format(new Date(post.date), 'EEEE, MMMM d, yyyy')} • {readingTime} min read
      </div>

      {/* Author + Share */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-b border-gray-100 py-4 my-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
            <AvatarFallback>
              {post.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-primary">
              {post.author.name}
            </span>
            <span className="text-[10px] text-muted-foreground">
              View Profile
            </span>
          </div>
        </div>

        <ShareButtons
          url={`https://www.tellyfilmy.com/posts/${post.slug}`}
          title={post.title}
        />
      </div>

      {/* ✅ Featured Image (Main Image) */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm mb-8 bg-gray-100">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* ✅ Article Content With Mid Image */}
      <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
        {paragraphs.map((para: string, i: number) => (
          <div key={i}>
            <p className="mb-6">{para}</p>

            {/* Insert second image in middle */}
            {i === midIndex - 1 && post.images?.[0] && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md my-8 bg-gray-100">
                <Image
                  src={post.images[0]}
                  alt={`${post.title} - Additional Image`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        ))}
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
        <div className="mt-12 pt-6 border-t">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="px-3 py-1 font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
