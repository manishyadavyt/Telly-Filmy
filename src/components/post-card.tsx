'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/types';
import { Calendar, ImageOff } from 'lucide-react';

interface PostCardProps {
  post: Post;
  variant?: 'grid' | 'horizontal' | 'compact';
}

/** Returns true if URL is base64/blob — only works on the device that created it */
function isLocalUrl(url?: string): boolean {
  return typeof url === 'string' && (url.startsWith('data:') || url.startsWith('blob:'));
}

/** Smart image component: shows placeholder if image is missing, local-only, or errored */
function CardImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [errored, setErrored] = useState(false);
  const invalid = !src || isLocalUrl(src) || errored;

  if (invalid) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-rose-50">
        <ImageOff className="w-6 h-6 text-rose-300" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      onError={() => setErrored(true)}
      className={className}
    />
  );
}

export function PostCard({ post, variant = 'grid' }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="group flex gap-3 p-3 rounded-2xl bg-white hover:bg-rose-50/40 border border-rose-100/80 shadow-xs hover:shadow-md transition-all duration-200"
      >
        <div className="relative w-28 h-24 sm:w-44 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100">
          <CardImage
            src={post.imageUrl}
            alt={post.title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col justify-between flex-1 min-w-0 space-y-1">
          <div className="space-y-1">
            <span className="inline-block bg-[#e11d48] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-xs uppercase tracking-wider">
              {post.category}
            </span>
            <h3 className="font-outfit text-xs sm:text-base font-bold text-slate-900 group-hover:text-[#e11d48] leading-snug transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="hidden sm:block text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 font-medium">
            <span>By {post.author?.name || 'Telly Filmy'}</span>
            <span>&bull;</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
    );
  }

  // DEFAULT MOBILE RESPONSIVE CARD
  return (
    <article className="group flex flex-row sm:flex-col rounded-2xl bg-white hover:bg-rose-50/20 border border-rose-100/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden p-2.5 sm:p-0">
      {/* Thumbnail */}
      <Link
        href={`/posts/${post.slug}`}
        className="relative w-28 h-24 sm:w-full sm:aspect-video rounded-xl sm:rounded-none overflow-hidden bg-slate-100 shrink-0"
      >
        <CardImage
          src={post.imageUrl}
          alt={post.title}
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="hidden sm:block absolute top-3 left-3">
          <span className="bg-[#e11d48] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-xs uppercase tracking-wider shadow-xs">
            {post.category}
          </span>
        </div>
      </Link>

      {/* Details */}
      <div className="p-2 sm:p-5 flex flex-col justify-between flex-1 min-w-0 space-y-1.5 sm:space-y-3">
        <div className="space-y-1 sm:space-y-2">
          <div className="flex sm:hidden items-center justify-between">
            <span className="bg-[#e11d48] text-white text-[8px] font-extrabold px-1.5 rounded-xs uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-[9px] text-slate-400 font-medium">{formattedDate}</span>
          </div>
          <div className="hidden sm:flex items-center text-[11px] text-slate-400 space-x-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-rose-400" /> {formattedDate}
            </span>
            <span>&bull;</span>
            <span>3 min read</span>
          </div>
          <Link href={`/posts/${post.slug}`}>
            <h3 className="font-outfit text-xs sm:text-base font-extrabold text-slate-900 group-hover:text-[#e11d48] leading-snug transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>
          <p className="hidden sm:block text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        <div className="pt-1.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[9px] sm:text-[11px]">
            By <span className="text-slate-800 font-bold">{post.author?.name || 'Telly Filmy'}</span>
          </span>
          <Link
            href={`/posts/${post.slug}`}
            className="text-[#e11d48] hover:text-[#be123c] font-extrabold text-[10px] sm:text-[11px] flex items-center gap-0.5"
          >
            Read &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
