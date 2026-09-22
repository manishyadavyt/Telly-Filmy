'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/types';
import { Flame, Calendar, ArrowRight } from 'lucide-react';

interface HeroSliderProps {
  topStories: Post[];
}

export function HeroSlider({ topStories }: HeroSliderProps) {
  if (!topStories || topStories.length === 0) return null;

  const mainPost = topStories[0];
  const sidePosts = topStories.slice(1, 6);

  return (
    <section className="w-full my-4 sm:my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        
        {/* LEFT HERO CARD (8 Cols) */}
        <div className="lg:col-span-8 flex">
          <Link 
            href={`/posts/${mainPost.slug}`}
            className="group relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-[#080c16] flex flex-col justify-end min-h-[280px] sm:min-h-[420px] transition-transform duration-300 border border-slate-900"
          >
            {/* Background Image */}
            <Image
              src={mainPost.imageUrl}
              alt={mainPost.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-[#080c16]/60 to-transparent"></div>

            {/* Overlaid Content */}
            <div className="relative z-10 p-4 sm:p-7 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="bg-[#e11d48] text-white font-extrabold text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                  {mainPost.category}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-rose-400" />
                  {new Date(mainPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <h2 className="font-outfit text-base sm:text-2xl md:text-3xl font-extrabold leading-snug sm:leading-tight text-white group-hover:text-rose-300 transition-colors line-clamp-3">
                {mainPost.title}
              </h2>

              {/* Slider Pagination Dots */}
              <div className="flex items-center justify-center space-x-1.5 pt-1 sm:pt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span className="w-4 h-1.5 rounded-full bg-[#e11d48]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              </div>
            </div>
          </Link>
        </div>

        {/* RIGHT 4 COLS: TRENDING BUZZ CARD */}
        <div className="lg:col-span-4 flex">
          <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs border border-rose-100/80 flex flex-col justify-between space-y-3 sm:space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-rose-100/60">
              <h3 className="font-outfit text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#e11d48] fill-[#e11d48]" /> TRENDING BUZZ
              </h3>
              <Link 
                href="/posts" 
                className="text-[10px] font-extrabold text-[#e11d48] hover:underline uppercase tracking-wider"
              >
                VIEW ALL &rarr;
              </Link>
            </div>

            {/* List of 5 Trending Stories */}
            <div className="flex flex-col space-y-2.5 sm:space-y-3.5 flex-1 justify-around">
              {sidePosts.map((post, idx) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="group flex gap-2.5 sm:gap-3 items-center"
                >
                  {/* Thumbnail / Number Badge */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 bg-slate-900 flex items-center justify-center shadow-xs">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : null}
                    <span className="absolute top-0.5 left-0.5 bg-[#e11d48] text-white text-[8px] font-black px-1 py-0.1 rounded-xs shadow-xs">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div className="flex flex-col space-y-0.5 flex-1 min-w-0">
                    <span className="text-[8px] sm:text-[9px] font-extrabold text-[#e11d48] uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h4 className="font-outfit text-xs font-bold text-slate-900 group-hover:text-[#e11d48] line-clamp-2 leading-snug transition-colors">
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
