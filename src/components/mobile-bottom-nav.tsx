'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, Tv, Film } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide bottom nav inside admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const NAV_ITEMS = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'TV Serials', href: '/category/tv-serials', icon: Tv },
    { name: 'Bollywood', href: '/category/bollywood', icon: Film },
    { name: 'Trending', href: '/category/trending', icon: Flame },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-rose-100/90 shadow-2xl px-3 py-2 flex items-center justify-around">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname === item.href || pathname?.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all relative ${
              isActive ? 'text-[#e11d48] font-black scale-105' : 'text-slate-500 font-semibold hover:text-slate-900'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-[#e11d48] stroke-[2.5]' : 'text-slate-500'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.name}</span>
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#e11d48]"></span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
