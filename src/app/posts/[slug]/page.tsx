import { getPostBySlug, getPosts } from '@/lib/data';
import { getCategorySlug, findCategoryBySlug } from '@/lib/categories';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Tag, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShareButtons } from '@/components/share-buttons';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/json-ld';
import { AdSenseSlot } from '@/components/adsense-slot';
import { PostCard } from '@/components/post-card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found | Telly Filmy' };

  const baseUrl = 'https://www.tellyfilmy.com';
  const url = `${baseUrl}/posts/${post.slug}`;
  const images = post.images?.length ? post.images : [post.imageUrl];
  const title = post.metaTitle ? `${post.metaTitle} | Telly Filmy` : `${post.title} | Telly Filmy`;
  const description = post.metaDescription || post.excerpt;
  const keywords = [post.focusKeyword, post.category, ...(post.tags || [])].filter(Boolean) as string[];

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : ['entertainment', 'bollywood', 'tv serials', 'news'],
    alternates: { canonical: url },
    openGraph: {
      title: post.metaTitle || post.title,
      description,
      url,
      siteName: 'Telly Filmy',
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author?.name || 'Telly Filmy'],
      section: post.category || 'Entertainment',
      tags: post.tags || [],
      images: images.map((img: string) => ({
        url: img.startsWith('http') ? img : `${baseUrl}${img}`,
        width: 1200,
        height: 630,
        alt: post.title,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description,
      images: images.map((img: string) => (img.startsWith('http') ? img : `${baseUrl}${img}`)),
      creator: '@TellyFilmy',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getPosts();
  const trendingStories = allPosts
    .filter((p) => p.isTrending || p.isTopStory)
    .slice(0, 5);

  const url = `https://www.tellyfilmy.com/posts/${post.slug}`;
  const readingTime = Math.max(1, Math.ceil(post.content.split(' ').length / 200));
  const paragraphs = post.content.split('\n\n');
  const midPoint = Math.floor(paragraphs.length / 2);

  const categorySlug = getCategorySlug(post.category);
  const categoryInfo = findCategoryBySlug(categorySlug);

  const breadcrumbs = [
    { name: 'Home', item: 'https://www.tellyfilmy.com' },
    { name: categoryInfo.name, item: `https://www.tellyfilmy.com/category/${categorySlug}` },
    { name: post.title, item: url },
  ];

  return (
    <>
      <ArticleJsonLd post={post} url={url} />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <main className="container mx-auto max-w-7xl py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        
        {/* 2-COLUMN GRID (Matching Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: MAIN ARTICLE CONTENT */}
          <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-100 space-y-4">
            
            {/* 1. TOP BREADCRUMBS */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#e11d48] transition-colors">Home</Link>
              <span>/</span>
              <Link href={`/category/${categorySlug}`} className="hover:text-[#e11d48] transition-colors">
                {categoryInfo.name}
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-md">{post.title}</span>
            </nav>

            {/* 2. MAIN ARTICLE TITLE */}
            <h1 className="font-outfit text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-snug sm:leading-tight tracking-tight pt-2">
              {post.title}
            </h1>

            {/* 4. SUBHEADLINE / EXCERPT */}
            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
              {post.excerpt}
            </p>

            {/* 5. AUTHOR & PUBLISH META BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 pb-4 border-y border-slate-200/80">
              {/* Left Author & Date info */}
              <div className="space-y-1">
                <div className="text-xs text-slate-700">
                  By <span className="font-bold text-slate-900 hover:text-[#e11d48] transition-colors">{post.author?.name || 'Telly Filmy Team'}</span>
                </div>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {format(new Date(post.date), 'MMM d, yyyy | h:mm a')} IST
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {readingTime} min read
                  </span>
                </div>
              </div>

              {/* Right Social Share Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hidden sm:inline-block">Share:</span>
                <ShareButtons url={url} title={post.title} />
              </div>
            </div>

            {/* 6. MAIN FEATURED BANNER IMAGE */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xs bg-slate-100 my-4 border border-slate-100">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 7. ARTICLE BODY TEXT */}
            <div className="font-sans text-slate-800 text-[17px] sm:text-[19px] leading-[1.85] sm:leading-[1.9] space-y-6 font-normal pt-2">
              {paragraphs.map((para, i) => {
                const imageIndex = Math.floor(i / 2);
                return (
                  <div key={i}>
                    <p className="mb-6 text-slate-800 leading-[1.85] sm:leading-[1.9]">{para}</p>

                    {/* Mid Ad banner */}
                    {i === midPoint && post.enableAds !== false && (
                      <AdSenseSlot type="in-feed" className="my-6" />
                    )}

                    {/* Extra gallery images */}
                    {post.images?.[imageIndex] && i % 2 === 1 && (
                      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xs my-6 bg-slate-100 border border-slate-100">
                        <Image
                          src={post.images[imageIndex]}
                          alt={`${post.title} image ${imageIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* BOTTOM ARTICLE SHARE BAR */}
            <div className="my-6 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <h4 className="font-outfit text-sm font-bold text-slate-900">Enjoyed this story?</h4>
                <p className="text-xs text-slate-500 font-medium">Share it with your friends and family on social media</p>
              </div>
              <ShareButtons url={url} title={post.title} />
            </div>

            {/* OPTIONAL YOUTUBE EMBED */}
            {post.videoUrl && (
              <div className="my-8 relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-md border border-slate-200">
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

            {/* TAGS */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-200/80">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-[#e11d48]" />
                  <h3 className="font-outfit text-xs font-bold text-slate-900 uppercase tracking-wider">Related Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/posts?search=${encodeURIComponent(tag)}`}>
                      <span className="inline-block bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#e11d48] text-xs font-semibold px-3 py-1 rounded-full border border-slate-200 transition-colors">
                        #{tag}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT 4 COLUMNS: TRENDING STORIES SIDEBAR (Matching Screenshot) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-5">
              {/* Header */}
              <h3 className="font-outfit text-xl font-extrabold text-slate-900 border-b border-slate-200/80 pb-3">
                Trending Stories
              </h3>

              {/* List of Trending Stories */}
              <div className="flex flex-col space-y-4 divide-y divide-slate-100">
                {trendingStories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/posts/${story.slug}`}
                    className="group flex items-start space-x-3 pt-3 first:pt-0"
                  >
                    {/* Square Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                      <Image
                        src={story.imageUrl}
                        alt={story.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1 min-w-0">
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">
                        ENTERTAINMENT
                      </span>
                      <h4 className="font-outfit text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#e11d48] line-clamp-2 leading-snug transition-colors">
                        {story.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar AdSense Slot */}
            {post.enableAds !== false && <AdSenseSlot type="sidebar" />}

          </div>

        </div>

      </main>
    </>
  );
}
