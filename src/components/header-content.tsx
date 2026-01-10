'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Logo } from './logo';
import { SearchBar } from './search-bar';
import type { Post } from '@/lib/types';

interface HeaderContentProps {
  posts: Post[];
}

export function HeaderContent({ posts }: HeaderContentProps) {
  return (
    <div className="z-50 w-full border-b bg-white shadow-sm">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">

        {/* LOGO */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        {/* CENTER SEARCH BAR */}
        <div className="flex flex-1 max-w-md mx-4 md:mx-6">
          <SearchBar posts={posts} />
        </div>

        {/* RIGHT SIDE: NAV & MOBILE */}
        <div className="flex-shrink-0 flex items-center gap-4">

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/news" className="hover:text-primary transition-colors">News</Link>
            <Link href="/tv" className="hover:text-primary transition-colors">TV Shows</Link>
            <Link href="/videos" className="hover:text-primary transition-colors">Videos</Link>
          </nav>

          {/* MOBILE MENU */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-lg">Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-8 text-lg font-medium">
                <SheetClose asChild>
                  <Link href="/">Home</Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/news">News</Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/tv">TV Shows</Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/videos">Videos</Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </header>
    </div>
  );
}
