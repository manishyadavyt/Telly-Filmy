'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, Tv, Search, UserCheck } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { SearchBar } from '@/components/search-bar';

export function MobileBottomNav() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  // Hide bottom nav inside admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const NAV_ITEMS = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Trending', href: '/category/spoilers', icon: Flame },
    { name: 'Bollywood', href: '/category/bollywood', icon: Tv },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-rose-100/90 shadow-2xl px-2 py-1.5 flex items-center justify-around">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isActive ? 'text-[#e11d48] font-black scale-105' : 'text-slate-500 font-semibold hover:text-slate-900'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-[#e11d48] stroke-[2.5]' : 'text-slate-500'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{item.name}</span>
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#e11d48]"></span>
            )}
          </Link>
        );
      })}

      {/* Mobile Live Search Trigger Button */}
      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetTrigger asChild>
          <button className="flex flex-col items-center justify-center py-1 px-3 text-slate-500 hover:text-slate-900 font-semibold">
            <Search className="w-5 h-5 text-slate-500" />
            <span className="text-[10px] mt-0.5 tracking-tight">Search</span>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl bg-white border-t border-rose-100 p-6 max-h-[85vh]">
          <SheetTitle className="text-left font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#e11d48]"></span> Search Entertainment News
          </SheetTitle>
          <div className="space-y-4">
            <SearchBar />
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Popular Tags</span>
              <div className="flex flex-wrap gap-2">
                {['Anupamaa', 'Bigg Boss 18', 'Stree 2', 'Katrina Kaif', 'Salman Khan', 'Pushpa 2'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/posts?search=${encodeURIComponent(tag)}`}
                    onClick={() => setSearchOpen(false)}
                    className="text-xs font-semibold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#e11d48] px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Admin Link */}
      <Link
        href="/admin"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          pathname?.startsWith('/admin') ? 'text-[#e11d48] font-black' : 'text-slate-500 font-semibold hover:text-slate-900'
        }`}
      >
        <UserCheck className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight">Admin</span>
      </Link>
    </div>
  );
}
