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
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-3">

        {/* LEFT: Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Telly Filmy Logo"
            width={130}
            height={36}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>

        {/* RIGHT: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
        </nav>

        {/* RIGHT: Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-3/4 p-0">
              <SheetHeader className="border-b p-4">
                <SheetClose asChild>
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/logo.png"
                      alt="Telly Filmy Logo"
                      width={120}
                      height={34}
                      priority
                    />
                  </Link>
                </SheetClose>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 p-4">
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
