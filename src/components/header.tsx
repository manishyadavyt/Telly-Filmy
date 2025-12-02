
import Link from 'next/link';
import { Menu, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { SearchBar } from '@/components/search-bar';
import { getPosts } from '@/lib/data';
import { Logo } from './logo';

export async function Header() {
  const posts = await getPosts();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between gap-4">
        {/* Mobile menu and logo */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
              {/* <Newspaper className="h-7 w-7 text-primary" /> */}
              <span className="sr-only">Telly Filmy</span>
            </Link>
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
                  {/* <SheetClose asChild>
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/admin/create">Create Post</Link>
                    </Button>
                  </SheetClose> */}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop logo and nav */}
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
            {/* <Button variant="ghost" asChild>
              <Link href="/admin/create">Create Post</Link>
            </Button> */}
          </nav>
        </div>

        <div className="flex items-center justify-end md:flex-1">
          <div className="w-full max-w-xs md:w-auto md:flex-none">
    
          </div>
        </div>
      </div>
    </header>
  );
}
