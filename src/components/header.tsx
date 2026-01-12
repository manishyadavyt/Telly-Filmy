'use client';

import Link from "next/link";
import Image from "next/image";
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

export default function Header() {
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
              <SheetHeader className="border-b p-4 text-left">
                <SheetClose asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="Telly Filmy Logo"
                      width={140}
                      height={40}
                      priority
                    />
                  </Link>
                </SheetClose>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>

              <div className="p-4">
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
        <div className="hidden md:flex flex-1 items-center">
          <Link href="/" className="mr-4 flex items-center">
            <Image
              src="/logo.png"
              alt="Telly Filmy Logo"
              width={150}
              height={42}
              priority
            />
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

        <div className="flex md:flex-1 justify-end"></div>
      </div>
    </header>
  );
}
