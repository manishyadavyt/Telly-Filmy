// src/app/posts/[slug]/page.tsx
import { getPostBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Tag, Facebook, Twitter, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShareButtons } from '@/components/share-buttons';

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
    <article className="container max-w-4xl mx-auto py-6 md:py-10 px-4">
      {/* Header Section (Left Aligned) */}
      <div className="space-y-4 mb-6">
        {/* Category Badge */}
        <Link href={`/category/${encodeURIComponent(post.category.toLowerCase())}`}>
          <Badge
            variant="destructive" // Red badge like screenshot
            className="w-fit cursor-pointer hover:bg-destructive/90 transition-colors uppercase text-[10px] tracking-wider px-2 py-0.5"
          >
            {post.category}
          </Badge>
        </Link>
        
        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold leading-tight text-foreground">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>

        {/* Date */}
        <div className="text-xs text-muted-foreground font-medium">
          Published: {format(new Date(post.date), 'EEEE, MMMM d, yyyy')}
        </div>

        {/* Author & Share Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-b border-gray-100 py-4 my-6">
           {/* Author */}
           <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                 <span className="text-sm font-semibold text-primary">{post.author.name}</span>
                 <span className="text-[10px] text-muted-foreground">View Profile</span>
              </div>
           </div>

           {/* Share Icons */}
           <ShareButtons url={`https://www.tellyfilmy.com/posts/${post.slug}`} title={post.title} />
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm mb-8 bg-gray-100">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
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
        <div className="mt-12 pt-6 border-t">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
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
