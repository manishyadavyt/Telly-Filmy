'use client';

import { useRef, useEffect } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { Post } from '@/lib/types';
import { Card } from './ui/card';

interface HeroSliderProps {
  topStories: Post[];
}

export function HeroSlider({ topStories }: HeroSliderProps) {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true }));

  return (
    <Card className="overflow-hidden rounded-xl shadow-lg">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {topStories.map((post) => (
            <CarouselItem key={post.id}>
              <Link href={`/posts/${post.slug}`}>
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    data-ai-hint={post.imageHint}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                    <div className="max-w-3xl">
                      <span className="inline-block rounded-full bg-primary/80 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
                        {post.category}
                      </span>
                      <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl leading-tight">
                        {post.title}
                      </h2>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex" />
      </Carousel>
    </Card>
  );
}
