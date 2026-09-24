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

interface SinglePostContentProps {
  initialPost: Post;
  initialPosts?: Post[];
  trendingStories?: Post[];
}

export function SinglePostContent({
  initialPost,
  initialPosts = [],
  trendingStories = [],
}: SinglePostContentProps) {
  const [post, setPost] = useState<Post>(initialPost);
  const livePosts = useLivePosts(initialPosts);

  useEffect(() => {
    fetchLivePostBySlug(initialPost.slug).then((livePost) => {
      if (livePost) {
        setPost((prev) => ({
          ...prev,
          ...livePost,
        }));
      }
    });
  }, [initialPost.slug]);

  const url = typeof window !== 'undefined' ? window.location.href : `https://www.tellyfilmy.com/posts/${post.slug}`;
  const readingTime = Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200));

  // Split content into clean blocks for paragraph and mid-ad placement
  const contentBlocks = (post.content || '')
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);
  const midPoint = Math.floor(contentBlocks.length / 2);

  const categorySlug = getCategorySlug(post.category);
  const categoryInfo = findCategoryBySlug(categorySlug);

  // Filter out the current active post for discovery
  const otherPosts = livePosts.filter((p) => p && p.slug !== post.slug);
  const nextPost = otherPosts[0];

  // Related category posts
  const categoryPosts = otherPosts.filter((p) => {
    if (!p) return false;
    const catMatch = (p.category || '').toLowerCase() === (post.category || '').toLowerCase();
    const tagMatch = p.tags?.some((t) => post.tags?.includes(t));
    return catMatch || tagMatch;
  });
  const relatedPosts = (categoryPosts.length >= 4 ? categoryPosts : otherPosts).slice(0, 4);

  // Latest discovery feed
  const latestPosts = otherPosts.slice(0, 8);

  // Live sidebar trending
  const liveTrending = (
    trendingStories.length > 0 ? trendingStories : livePosts.filter((p) => p.isTrending || p.isTopStory)
  ).filter((p) => p.slug !== post.slug).slice(0, 5);

  // Extra article images to interweave naturally between paragraphs (if not already embedded in the content HTML)
  const inArticleImages = Array.isArray(post.images)
    ? post.images.filter((img) => img && img !== post.imageUrl && !(post.content || '').includes(img))
    : [];

  return (
    <main className="container mx-auto max-w-7xl py-4 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* 2-COLUMN GRID: MAIN POST + SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT 8 COLUMNS: MAIN ARTICLE CONTENT */}
        <div className="lg:col-span-8 bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xs border border-slate-100 space-y-5">
          {/* 1. TOP BREADCRUMBS */}
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

          {/* 2. MAIN ARTICLE TITLE */}
          <h1 className="font-outfit text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-snug sm:leading-tight tracking-tight pt-1">
            {post.title}
          </h1>

          {/* 3. SUBHEADLINE / EXCERPT */}
          {post.excerpt && (
            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed border-l-4 border-[#e11d48] pl-3 sm:pl-4 py-0.5 bg-rose-50/40 rounded-r-xl">
              {post.excerpt}
            </p>
          )}

          {/* 4. AUTHOR & PUBLISH META BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 pb-3 border-y border-slate-200/80">
            <div className="space-y-1">
              <div className="text-xs text-slate-700">
                By{' '}
                <span className="font-bold text-slate-900 hover:text-[#e11d48] transition-colors">
                  {post.author?.name || 'Telly Filmy Team'}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {post.date ? format(new Date(post.date), 'MMM d, yyyy | h:mm a') : 'Recently Published'} IST
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {readingTime} min read
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hidden sm:inline-block">
                Share:
              </span>
              <ShareButtons url={url} title={post.title} />
            </div>
          </div>

          {/* 5. MAIN FEATURED BANNER IMAGE */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xs bg-slate-100 my-4 border border-slate-100">
            <Image
              src={post.imageUrl || '/logo.png'}
              alt={post.title}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>

          {/* 6. ARTICLE BODY TEXT & RICH CONTENT WITH IN-BETWEEN IMAGES */}
          <div className="font-sans text-slate-800 text-[17px] sm:text-[19px] leading-[1.85] sm:leading-[1.9] space-y-6 font-normal pt-2">
            {contentBlocks.map((block, i) => {
              const isHTML = /<[a-z][\s\S]*>/i.test(block);
              const inBetweenImage = inArticleImages[i];

              return (
                <div key={i}>
                  {isHTML ? (
                    <div
                      className="rich-article-content space-y-4"
                      dangerouslySetInnerHTML={{ __html: block }}
                    />
                  ) : (
                    <p className="mb-6 text-slate-800 leading-[1.85] sm:leading-[1.9]">{block}</p>
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

                  {/* In-feed ad at article midPoint */}
                  {i === midPoint && post.enableAds !== false && <AdSenseSlot type="in-feed" className="my-6" />}
                </div>
              );
            })}
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

          {/* BOTTOM ARTICLE SHARE BAR */}
          <div className="my-6 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <h4 className="font-outfit text-sm font-bold text-slate-900">Enjoyed this story?</h4>
              <p className="text-xs text-slate-500 font-medium">Share it with your friends and family on social media</p>
            </div>
            <ShareButtons url={url} title={post.title} />
          </div>

          {/* 8. UP NEXT STORY PREVIEW BANNER */}
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
                  <div className="absolute top-2 left-2">
                    <span className="bg-[#e11d48] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                      {nextPost.category || 'Trending'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0 space-y-2">
                  <div>
                    <h3 className="font-outfit text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#e11d48] leading-snug line-clamp-2 transition-colors">
                      {nextPost.title}
                    </h3>
                    {nextPost.excerpt && (
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 hidden sm:block">
                        {nextPost.excerpt}
                      </p>
                    )}
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

        {/* RIGHT 4 COLUMNS: TRENDING STORIES SIDEBAR */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-200/80 pb-3">
              <span className="w-1.5 h-5 bg-[#e11d48] rounded-xs"></span>
              <h3 className="font-outfit text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#e11d48]" /> Trending Stories
              </h3>
            </div>

            <div className="flex flex-col space-y-4 divide-y divide-slate-100">
              {liveTrending.map((story) => (
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

      {/* 8. MORE STORIES IN CATEGORY */}
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
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.id || relatedPost.slug} post={relatedPost} variant="grid" />
            ))}
          </div>
        </section>
      )}

      {/* 9. IN-FEED AD BANNER */}
      {post.enableAds !== false && <AdSenseSlot type="in-feed" />}

      {/* 10. LATEST ENTERTAINMENT HEADLINES */}
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
              EXPLORE ALL ARTICLES &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestPosts.map((latestPost) => (
              <PostCard key={latestPost.id || latestPost.slug} post={latestPost} variant="grid" />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
