'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { getCategorySlug, findCategoryBySlug } from '@/lib/categories';
import { format } from 'date-fns';
import { Tag, Clock, Calendar, ArrowRight, Sparkles, Flame, Film } from 'lucide-react';
import { ShareButtons } from '@/components/share-buttons';
import { AdSenseSlot } from '@/components/adsense-slot';
import { fetchLivePostBySlug, useLivePosts } from '@/lib/use-live-posts';
import { PostCard } from '@/components/post-card';

interface LivePostViewProps {
  slug?: string;
  fallbackNotFound?: React.ReactNode;
}

export function LivePostView({ slug, fallbackNotFound }: LivePostViewProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const livePosts = useLivePosts([]);

  useEffect(() => {
    let activeSlug = slug;
    if (!activeSlug && typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const match = pathname.match(/\/posts\/([^/?#]+)/);
      if (match && match[1]) {
        activeSlug = decodeURIComponent(match[1])
          .replace(/\.html$/, '')
          .replace(/\/$/, '')
          .trim();
      }
    }

    if (!activeSlug) {
      setLoading(false);
      return;
    }

    fetchLivePostBySlug(activeSlug)
      .then((p) => {
        setPost(p);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-20 px-4 text-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return <>{fallbackNotFound}</>;
  }

  const categorySlug = getCategorySlug(post.category);
  const categoryInfo = findCategoryBySlug(categorySlug);
  const url = typeof window !== 'undefined' ? window.location.href : `https://www.tellyfilmy.com/posts/${post.slug}`;
  const readingTime = Math.max(1, Math.ceil((post.content || '').split(' ').length / 200));
  const paragraphs = (post.content || '').split('\n\n');
  const midPoint = Math.floor(paragraphs.length / 2);
  const inArticleImages = Array.isArray(post.images)
    ? post.images.filter((img) => img && img !== post.imageUrl && !(post.content || '').includes(img))
    : [];

  const otherPosts = livePosts.filter((p) => p && p.slug !== post.slug);
  const nextPost = otherPosts[0];
  const relatedPosts = otherPosts
    .filter((p) => (p.category || '').toLowerCase() === (post.category || '').toLowerCase())
    .slice(0, 4);
  const latestPosts = otherPosts.slice(0, 8);
  const trendingStories = otherPosts.filter((p) => p.isTrending || p.isTopStory).slice(0, 5);

  return (
    <main className="container mx-auto max-w-7xl py-4 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Article */}
        <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-100 space-y-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#e11d48] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href={`/category/${categorySlug}`} className="hover:text-[#e11d48] transition-colors">
              {categoryInfo.name}
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-md">{post.title}</span>
          </nav>

          {/* Title */}
          <h1 className="font-outfit text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-snug sm:leading-tight tracking-tight pt-2">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Author & Publish Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 pb-4 border-y border-slate-200/80">
            <div className="space-y-1">
              <div className="text-xs text-slate-700">
                By <span className="font-bold text-slate-900">{post.author?.name || 'Telly Filmy Team'}</span>
              </div>
              <div className="text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {post.date ? format(new Date(post.date), 'MMM d, yyyy | h:mm a') : 'Recently published'} IST
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {readingTime} min read
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <ShareButtons url={url} title={post.title} />
            </div>
          </div>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xs bg-slate-100 my-4 border border-slate-100">
              <Image src={post.imageUrl} alt={post.title} fill className="object-cover" priority unoptimized />
            </div>
          )}

          {/* Content with In-Between Images */}
          <div className="font-sans text-slate-800 text-[17px] sm:text-[19px] leading-[1.85] sm:leading-[1.9] space-y-6 font-normal pt-2">
            {paragraphs.map((para, i) => {
              const isHTML = /<[a-z][\s\S]*>/i.test(para);
              const inBetweenImage = inArticleImages[i];

              return (
                <div key={i}>
                  {isHTML ? (
                    <div
                      className="rich-article-content space-y-4"
                      dangerouslySetInnerHTML={{ __html: para }}
                    />
                  ) : (
                    <p className="mb-6 text-slate-800 leading-[1.85] sm:leading-[1.9]">{para}</p>
                  )}

                  {/* In-between article image */}
                  {inBetweenImage && (
                    <div className="my-6 relative w-full aspect-[16/9] sm:aspect-video rounded-2xl overflow-hidden shadow-xs bg-slate-100 border border-slate-200">
                      <Image
                        src={inBetweenImage}
                        alt={`${post.title} - Photo ${i + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )}

                  {i === midPoint && post.enableAds !== false && <AdSenseSlot type="in-feed" className="my-6" />}
                </div>
              );
            })}
          </div>

          {/* YouTube Video */}
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

          {/* Tags */}
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

          {/* UP NEXT STORY PREVIEW BANNER */}
          {nextPost && (
            <div className="mt-8 pt-6 border-t-2 border-rose-100">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#e11d48] uppercase tracking-wider mb-3">
                <ArrowRight className="w-4 h-4 animate-pulse" /> UP NEXT STORY
              </div>
              <Link
                href={`/posts/${nextPost.slug}`}
                className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-gradient-to-r from-rose-50/80 to-pink-50/50 hover:from-rose-100/80 hover:to-pink-100/60 border border-rose-200/80 transition-all duration-300 shadow-xs hover:shadow-md"
              >
                <div className="relative w-full sm:w-44 aspect-[16/9] sm:aspect-video rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <Image
                    src={nextPost.imageUrl || '/logo.png'}
                    alt={nextPost.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0 space-y-2">
                  <div>
                    <h3 className="font-outfit text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#e11d48] leading-snug line-clamp-2 transition-colors">
                      {nextPost.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#e11d48]">
                    <span>Read Next Story</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-200/80 pb-3">
              <span className="w-1.5 h-5 bg-[#e11d48] rounded-xs"></span>
              <h3 className="font-outfit text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#e11d48]" /> Trending Stories
              </h3>
            </div>

            <div className="flex flex-col space-y-4 divide-y divide-slate-100">
              {(trendingStories.length > 0 ? trendingStories : otherPosts.slice(0, 5)).map((story) => (
                <Link
                  key={story.id || story.slug}
                  href={`/posts/${story.slug}`}
                  className="group flex items-start space-x-3 pt-3 first:pt-0"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <Image
                      src={story.imageUrl || '/logo.png'}
                      alt={story.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      {story.category?.toUpperCase() || 'ENTERTAINMENT'}
                    </span>
                    <h4 className="font-outfit text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#e11d48] line-clamp-2 leading-snug transition-colors">
                      {story.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {post.enableAds !== false && <AdSenseSlot type="sidebar" />}
        </div>
      </div>

      {/* Related Stories */}
      {relatedPosts.length > 0 && (
        <section className="pt-6 border-t-2 border-rose-100 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b-2 border-rose-100">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-[#e11d48] rounded-xs"></span>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#e11d48]" /> MORE STORIES IN {post.category?.toUpperCase() || 'ENTERTAINMENT'}
              </h2>
            </div>
            <Link
              href={`/category/${categorySlug}`}
              className="text-xs font-extrabold text-[#e11d48] hover:underline uppercase tracking-wider flex items-center gap-1"
            >
              VIEW ALL &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedPosts.map((rPost) => (
              <PostCard key={rPost.id || rPost.slug} post={rPost} variant="grid" />
            ))}
          </div>
        </section>
      )}

      {/* Latest Entertainment Feed */}
      {latestPosts.length > 0 && (
        <section className="space-y-5 pb-6">
          <div className="flex items-center justify-between pb-2 border-b-2 border-rose-100">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-[#e11d48] rounded-xs"></span>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Film className="w-5 h-5 text-[#e11d48]" /> LATEST ENTERTAINMENT STORIES
              </h2>
            </div>
            <Link
              href="/posts"
              className="text-xs font-extrabold text-[#e11d48] hover:underline uppercase tracking-wider flex items-center gap-1"
            >
              EXPLORE ALL &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestPosts.map((lPost) => (
              <PostCard key={lPost.id || lPost.slug} post={lPost} variant="grid" />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
