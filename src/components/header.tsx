'use client';

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { SearchBar } from "@/components/search-bar";
import { Logo } from "./logo";

// Define Post type
export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;
  image?: string;
};

export default function Header({ posts }: { posts: Post[] }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between gap-4">
        
        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-3/4 p-0">
              <SheetHeader className="p-4 text-left border-b">
                <SheetClose asChild>
                  <Link href="/">
                    <Logo />
                  </Link>
                </SheetClose>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>

              <div className="p-4 pt-4">
                <nav className="flex flex-col gap-1">
                  <SheetClose asChild>
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/">Home</Link>
                    </Button>
                  </SheetClose>

                  <SheetClose asChild>
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/about">About</Link>
                    </Button>
                  </SheetClose>

                  <SheetClose asChild>
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/contact">Contact</Link>
                    </Button>
                  </SheetClose>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Logo + Navigation */}
        <div className="hidden flex-1 items-center justify-start md:flex">
          <Link href="/" className="mr-4">
            <Logo />
          </Link>

          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/about">About</Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-end md:flex-1">
          <div className="w-full max-w-xs md:w-auto md:flex-none">
          </div>
        </div>

      </div>
    </header>
  );
}
