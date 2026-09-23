'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AdSenseSlot } from '@/components/adsense-slot';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube 
} from 'lucide-react';

const SOCIAL_LINKS = {
  twitter: 'https://x.com/telly_filmy?t=QBCSCWDKfFAkiipz0bH-eg&s=09',
  instagram: 'https://www.instagram.com/tellyfilmy?igsh=aGlyanNrY3k5Z2M5',
  facebook: 'https://www.facebook.com/profile.php?id=61551867691591&mibextid=ZbWKwL',
  youtube: 'https://www.youtube.com/@telly.filmy.',
};

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-rose-100 text-slate-700 pt-10 pb-8 mt-16">
      
      {/* FOOTER AD BANNER */}
      <div className="container mx-auto px-4 mb-8">
        <AdSenseSlot type="footer" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3-COLUMN MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pb-10 border-b border-slate-100">
          
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
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" aria-label="Follow us on X (Twitter)" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#e11d48] hover:border-[#e11d48] transition-all">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#e11d48] hover:border-[#e11d48] transition-all">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#e11d48] hover:border-[#e11d48] transition-all">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="Subscribe on YouTube" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#e11d48] hover:border-[#e11d48] transition-all">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link href="/" className="hover:text-[#e11d48] transition-colors">Home Dashboard</Link></li>
              <li><Link href="/posts" className="hover:text-[#e11d48] transition-colors">All Articles</Link></li>
              <li><Link href="/about" className="hover:text-[#e11d48] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#e11d48] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Popular Categories</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link href="/category/tv-serials" className="hover:text-[#e11d48] transition-colors">TV Serials &amp; Updates</Link></li>
              <li><Link href="/category/bollywood" className="hover:text-[#e11d48] transition-colors">Bollywood &amp; Cinema</Link></li>
              <li><Link href="/category/reality-tv" className="hover:text-[#e11d48] transition-colors">Reality TV Shows</Link></li>
              <li><Link href="/category/bhojpuri" className="hover:text-[#e11d48] transition-colors">Bhojpuri Entertainment</Link></li>
              <li><Link href="/category/trending" className="hover:text-[#e11d48] transition-colors">Trending Stories</Link></li>
              <li><Link href="/category/ott" className="hover:text-[#e11d48] transition-colors">OTT Releases</Link></li>
            </ul>
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
