import Link from 'next/link';
import { Home, Sparkles, Film, Tv, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="container mx-auto max-w-4xl py-16 sm:py-24 px-4 text-center space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 bg-rose-50 text-[#e11d48] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <span>Error 404</span>
        </div>
        <h1 className="font-outfit text-6xl sm:text-8xl font-black text-slate-900 tracking-tight">
          4<span className="text-[#e11d48]">0</span>4
        </h1>
        <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-800">
          Page Not Found
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
          The entertainment story or page you are looking for might have been moved, updated, or does not exist.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#e11d48] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full hover:bg-rose-700 transition-colors shadow-md"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold px-6 py-3 rounded-full hover:bg-slate-200 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-[#e11d48]" /> Browse All Articles
        </Link>
      </div>

      <div className="pt-8 border-t border-rose-100 max-w-xl mx-auto">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-4">
          Popular Categories
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/category/bollywood"
            className="inline-flex items-center gap-1.5 bg-white border border-rose-100 hover:border-[#e11d48] text-slate-700 hover:text-[#e11d48] text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs"
          >
            <Film className="w-3.5 h-3.5 text-[#e11d48]" /> Bollywood
          </Link>
          <Link
            href="/category/tv-serials"
            className="inline-flex items-center gap-1.5 bg-white border border-rose-100 hover:border-[#e11d48] text-slate-700 hover:text-[#e11d48] text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs"
          >
            <Tv className="w-3.5 h-3.5 text-[#e11d48]" /> TV Serials
          </Link>
          <Link
            href="/category/spoilers"
            className="inline-flex items-center gap-1.5 bg-white border border-rose-100 hover:border-[#e11d48] text-slate-700 hover:text-[#e11d48] text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs"
          >
            🔥 Trending Spoilers
          </Link>
          <Link
            href="/category/reality-tv"
            className="inline-flex items-center gap-1.5 bg-white border border-rose-100 hover:border-[#e11d48] text-slate-700 hover:text-[#e11d48] text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs"
          >
            Reality TV
          </Link>
        </div>
      </div>
    </main>
  );
}
