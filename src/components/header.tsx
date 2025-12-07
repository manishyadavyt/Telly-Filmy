'use client';

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
import { getPosts } from '@/lib/data';
import { Logo } from './logo';

export async function Header() {
  const posts = await getPosts();

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/news" className="hover:text-blue-600">News</Link>
          <Link href="/tv" className="hover:text-blue-600">TV Shows</Link>
          <Link href="/videos" className="hover:text-blue-600">Videos</Link>
        </nav>

        {/* MOBILE MENU */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="text-lg">Menu</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-4 mt-4 text-lg">
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
  );
}
