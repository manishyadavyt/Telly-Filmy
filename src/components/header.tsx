'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SearchBar } from '@/components/search-bar';
import { 
  Menu, 
  Search,
  Flame,
  Globe
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const NAV_CATEGORIES = [
  { name: 'HOME', href: '/' },
  { name: 'BOLLYWOOD', href: '/category/bollywood' },
  { name: 'TV SERIALS', href: '/category/tv-serials' },
  { name: 'REALITY TV', href: '/category/reality-tv' },
  { name: 'ENTERTAINMENT', href: '/category/entertainment' },
  { name: 'BHOJPURI', href: '/category/bhojpuri' },
  { name: 'OTT', href: '/category/ott' },
  { name: '🔥 TRENDING', href: '/category/trending', isTrending: true },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-rose-100/80 shadow-xs text-slate-800">
      
      {/* MAIN TOP HEADER BAR */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Original Logo */}
        <Link href="/" className="flex items-center space-x-2 shrink-0 group">
          <Image
            src="/logo.png"
            alt="Telly Filmy"
            width={160}
            height={44}
            priority
            className="h-8 sm:h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Desktop Live Search Bar */}
        <div className="hidden lg:block flex-1 max-w-sm mx-6">
          <SearchBar />
        </div>

        {/* Right Top Actions (Search Pill) */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Quick Search Button */}
          <button 
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-slate-200 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search</span>
          </button>
        </div>

        {/* Mobile Actions Menu */}
        <div className="flex items-center space-x-2 sm:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="text-slate-700 hover:text-[#e11d48]"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-700 hover:text-[#e11d48]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-rose-100 text-slate-900 w-80 p-6">
              <SheetTitle className="text-left font-extrabold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#e11d48]"></span> Menu
              </SheetTitle>
              <div className="mb-6">
                <SearchBar />
              </div>
              <nav className="flex flex-col space-y-2">
                {NAV_CATEGORIES.map((cat) => {
                  const isActive = pathname === cat.href;
                  return (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className={`px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors ${
                        isActive 
                          ? 'bg-rose-50 text-[#e11d48] border-l-4 border-[#e11d48]' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>

      {/* Expandable Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="lg:hidden px-4 pb-3 border-t border-rose-100 pt-3 bg-rose-50/40">
          <SearchBar />
        </div>
      )}

      {/* CATEGORY NAVIGATION TABS */}
      <div className="border-t border-rose-100/60 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-6 overflow-x-auto py-2.5 scrollbar-none">
          {NAV_CATEGORIES.map((cat) => {
            const isActive = pathname === cat.href;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wider whitespace-nowrap transition-colors relative py-1 ${
                  isActive 
                    ? 'text-[#e11d48] border-b-2 border-[#e11d48]' 
                    : cat.isTrending
                      ? 'text-[#e11d48] hover:text-[#be123c]'
                      : 'text-slate-700 hover:text-[#e11d48]'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

    </header>
  );
}
