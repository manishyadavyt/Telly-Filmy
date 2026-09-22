'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AdSenseSlot } from '@/components/adsense-slot';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Send 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-rose-100 text-slate-700 pt-10 pb-8 mt-16">
      
      {/* FOOTER AD BANNER */}
      <div className="container mx-auto px-4 mb-8">
        <AdSenseSlot type="footer" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-COLUMN MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-slate-100">
          
          {/* Col 1: About Telly Filmy */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Telly Filmy"
                width={160}
                height={44}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Your premier destination for instant TV serial updates, Bollywood news, web stories, celebrity gossip, and exclusive entertainment coverage.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#e11d48] hover:border-[#e11d48] transition-all">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#e11d48] hover:border-[#e11d48] transition-all">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#e11d48] hover:border-[#e11d48] transition-all">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#e11d48] hover:border-[#e11d48] transition-all">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/" className="hover:text-[#e11d48] transition-colors">Home Dashboard</Link></li>
              <li><Link href="/posts" className="hover:text-[#e11d48] transition-colors">All Articles</Link></li>
              <li><Link href="/about" className="hover:text-[#e11d48] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#e11d48] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/category/tv-serials" className="hover:text-[#e11d48] transition-colors">TV Serials &amp; Spoilers</Link></li>
              <li><Link href="/category/bollywood" className="hover:text-[#e11d48] transition-colors">Bollywood &amp; Movies</Link></li>
              <li><Link href="/category/reality-tv" className="hover:text-[#e11d48] transition-colors">Reality TV Shows</Link></li>
              <li><Link href="/category/bhojpuri" className="hover:text-[#e11d48] transition-colors">Bhojpuri Cinema</Link></li>
              <li><Link href="/category/spoilers" className="hover:text-[#e11d48] transition-colors">Trending Stories</Link></li>
              <li><Link href="/category/ott" className="hover:text-[#e11d48] transition-colors">OTT Releases</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-slate-600 font-medium">
              Get breaking entertainment updates straight to your inbox daily.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-slate-50 border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 pr-10 focus:border-[#e11d48]"
                />
                <Button size="icon" className="absolute right-1 top-1 h-7 w-7 bg-[#e11d48] hover:bg-[#be123c] text-white">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </form>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} <span className="text-slate-900 font-bold">Telly Filmy</span>. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-xs font-medium">
            <Link href="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-slate-900 transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
