'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/types';
import { Flame, Calendar, ChevronLeft, ChevronRight, Sparkles, ImageOff } from 'lucide-react';

interface HeroSliderProps {
  topStories: Post[];
}

/** Check if an image URL is a temporary browser-local URL */
function isLocalUrl(url?: string): boolean {
  return typeof url === 'string' && (url.startsWith('data:') || url.startsWith('blob:'));
}

/** Hero image with error fallback and smooth crossfade */
function HeroSlideImage({ src, alt, visible }: { src?: string; alt: string; visible: boolean }) {
  const [hasError, setHasError] = useState(false);
  const isInvalid = !src || isLocalUrl(src) || hasError;

  // Reset error when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (isInvalid) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#31102f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 opacity-30">
          <Sparkles className="w-16 h-16 text-rose-400" />
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      onError={() => setHasError(true)}
      className={`object-cover group-hover:scale-105 transition-all duration-500 ease-out ${
        visible ? 'opacity-90' : 'opacity-0'
      }`}
      priority
    />
  );
}

/** Trending sidebar thumbnail with clean error fallback (no logo replacement) */
function TrendingThumbnail({ src, alt, index }: { src?: string; alt: string; index: number }) {
  const [hasError, setHasError] = useState(false);
  const isInvalid = !src || isLocalUrl(src) || hasError;

  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-900 flex items-center justify-center shadow-sm">
      {!isInvalid ? (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          onError={() => setHasError(true)}
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
          <ImageOff className="w-5 h-5 text-rose-400/50" />
        </div>
      )}
      <span className="absolute top-0.5 left-0.5 bg-[#e11d48] text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs z-10">
        #{index + 1}
      </span>
    </div>
  );
}

export function HeroSlider({ topStories }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imgVisible, setImgVisible] = useState(true);

  const sliderPosts = (topStories || []).slice(0, 5);
  const safeIndex = sliderPosts.length > 0
    ? Math.min(currentIndex, sliderPosts.length - 1)
    : 0;

  // Auto-advance hero slider every 4.5 seconds
  useEffect(() => {
    if (sliderPosts.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderPosts.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [sliderPosts.length, isPaused]);

  // Clamp index when list shrinks
  useEffect(() => {
    if (sliderPosts.length > 0 && currentIndex >= sliderPosts.length) {
      setCurrentIndex(0);
    }
  }, [sliderPosts.length, currentIndex]);

  // Crossfade between slides: brief fade-out then fade-in
  useEffect(() => {
    setImgVisible(false);
    const t = setTimeout(() => setImgVisible(true), 120);
    return () => clearTimeout(t);
  }, [safeIndex]);

  // Render nothing if empty (after hooks)
  if (!topStories || topStories.length === 0) return null;

  const currentPost = sliderPosts[safeIndex];
  const sidePosts = topStories.slice(1, 6);

  if (!currentPost) return null;

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + sliderPosts.length) % sliderPosts.length);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % sliderPosts.length);
  };

  return (
    <section className="w-full my-4 sm:my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        
        {/* LEFT HERO SLIDER (8 Cols) */}
        <div 
          className="lg:col-span-8 flex relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Link 
            href={`/posts/${currentPost.slug}`}
            className="group relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-[#080c16] flex flex-col justify-end min-h-[300px] sm:min-h-[520px] transition-transform duration-300 border border-slate-900"
          >
            {/* Background Image with error fallback */}
            <HeroSlideImage
              key={currentPost.slug}
              src={currentPost.imageUrl}
              alt={currentPost.title}
              visible={imgVisible}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-[#080c16]/70 to-transparent"></div>

            {/* Overlaid Content */}
            <div className="relative z-10 p-3.5 sm:p-7 space-y-1.5 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="bg-[#e11d48] text-white font-black text-[8px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                  {currentPost.category}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-300 font-medium flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400" />
                  {new Date(currentPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <h2 className="font-outfit text-sm sm:text-2xl md:text-3xl font-extrabold leading-snug sm:leading-tight text-white group-hover:text-rose-300 transition-colors line-clamp-2 sm:line-clamp-3">
                {currentPost.title}
              </h2>

              {/* Slider Pagination Dots & Navigation Controls */}
              <div className="flex items-center justify-between pt-1 sm:pt-2">
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  {sliderPosts.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Go to slide ${idx + 1}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`h-1 sm:h-1.5 rounded-full transition-all ${
                        idx === currentIndex 
                          ? 'w-4 sm:w-6 bg-[#e11d48]' 
                          : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>

                {/* Left / Right Arrow Buttons */}
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  <button
                    type="button"
                    aria-label="Previous Story"
                    onClick={prevSlide}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/50 hover:bg-[#e11d48] text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/20"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next Story"
                    onClick={nextSlide}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/50 hover:bg-[#e11d48] text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/20"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

            </div>
          </Link>
        </div>

        {/* RIGHT 4 COLS: TRENDING STORIES CARD */}
        <div className="lg:col-span-4 flex">
          <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs border border-rose-100/80 flex flex-col justify-between space-y-3 sm:space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-100/60">
              <h3 className="font-outfit text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#e11d48] fill-[#e11d48]" /> TRENDING STORIES
              </h3>
              <Link 
                href="/posts" 
                className="text-[10px] sm:text-xs font-extrabold text-[#e11d48] hover:underline uppercase tracking-wider"
              >
                VIEW ALL &rarr;
              </Link>
            </div>

            {/* List of Trending Stories */}
            <div className="flex flex-col space-y-3 sm:space-y-4 flex-1 justify-around">
              {sidePosts.map((post, idx) => (
                <Link
                  key={post.id || post.slug}
                  href={`/posts/${post.slug}`}
                  className="group flex gap-3 sm:gap-3.5 items-center"
                >
                  {/* Thumbnail / Number Badge */}
                  <TrendingThumbnail
                    src={post.imageUrl}
                    alt={post.title}
                    index={idx}
                  />

                  {/* Title & Category */}
                  <div className="flex flex-col space-y-1 flex-1 min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-[#e11d48] uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h4 className="font-outfit text-[12px] sm:text-[13px] font-bold text-slate-900 group-hover:text-[#e11d48] line-clamp-2 leading-snug transition-colors">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
