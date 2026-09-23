'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { getCategorySlug, findCategoryBySlug } from '@/lib/categories';
import { format } from 'date-fns';
import { Tag, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { ShareButtons } from '@/components/share-buttons';
import { AdSenseSlot } from '@/components/adsense-slot';
import { fetchLivePostBySlug } from '@/lib/use-live-posts';

interface LivePostViewProps {
  slug?: string;
  fallbackNotFound?: React.ReactNode;
}

export function LivePostView({ slug, fallbackNotFound }: LivePostViewProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activeSlug = slug;
    if (!activeSlug && typeof window !== 'undefined') {
      const match = window.location.pathname.match(/\/posts\/([^/]+)/);
      if (match && match[1]) {
        activeSlug = decodeURIComponent(match[1]);
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

  return (
    <main className="container mx-auto max-w-7xl py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
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

          {/* Content */}
          <div className="font-sans text-slate-800 text-[17px] sm:text-[19px] leading-[1.85] sm:leading-[1.9] space-y-6 font-normal pt-2">
            {paragraphs.map((para, i) => (
              <div key={i}>
                <p className="mb-6 text-slate-800 leading-[1.85] sm:leading-[1.9]">{para}</p>
                {i === midPoint && post.enableAds !== false && <AdSenseSlot type="in-feed" className="my-6" />}
              </div>
            ))}
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
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-4">
            <h3 className="font-outfit text-lg font-extrabold text-slate-900 border-b border-slate-200/80 pb-3">
              Explore More Stories
            </h3>
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#e11d48] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
            </Link>
          </div>

          {post.enableAds !== false && <AdSenseSlot type="sidebar" />}
        </div>
      </div>
    </main>
  );
}
