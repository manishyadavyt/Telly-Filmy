// src/app/category/[category]/page.tsx
import { getPosts } from '@/lib/data';
import { findCategoryBySlug, CATEGORY_LIST } from '@/lib/categories';
import { PostCard } from '@/components/post-card';
import { AdSenseSlot } from '@/components/adsense-slot';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return CATEGORY_LIST.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = findCategoryBySlug(category);
  const canonicalUrl = `https://www.tellyfilmy.com/category/${cat.slug}`;

  return {
    title: `${cat.name} News & Latest Entertainment Updates | Telly Filmy`,
    description: cat.description,
    keywords: [cat.name, 'news', 'entertainment', 'tv serials', 'bollywood', 'updates', 'trending'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${cat.name} – Telly Filmy`,
      description: cat.description,
      url: canonicalUrl,
      siteName: 'Telly Filmy',
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 800,
          height: 600,
          alt: `${cat.name} on Telly Filmy`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cat.name} – Telly Filmy`,
      description: cat.description,
      images: ['/logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = findCategoryBySlug(category);
  const allPosts = await getPosts();

  const posts = allPosts.filter((post) => {
    const postCat = (post.category || '').toLowerCase().trim();
    const postCatClean = postCat.replace(/\s+/g, '-');
    
    // Check direct match with category name, slug, or aliases
    if (postCat === cat.name.toLowerCase() || postCatClean === cat.slug) return true;
    if (cat.aliases.some((alias) => postCat === alias || postCatClean === alias || postCat.includes(alias) || alias.includes(postCat))) {
      return true;
    }
    // For trending category
    if ((cat.slug === 'trending' || cat.slug === 'spoilers') && (post.isTrending || post.isTopStory)) {
      return true;
    }
    return false;
  });

  const categoryTitle = cat.name;

  const breadcrumbs = [
    { name: 'Home', item: 'https://www.tellyfilmy.com' },
    {
      name: categoryTitle,
      item: `https://www.tellyfilmy.com/category/${cat.slug}`,
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <main className="container mx-auto max-w-7xl py-5 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#e11d48] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{categoryTitle}</span>
        </nav>

        {/* Top AdSense Banner */}
        <AdSenseSlot type="leaderboard" />

        {/* Clean, Modern Category Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-rose-100/90 shadow-xs relative overflow-hidden">
          <div className="flex items-start space-x-3.5">
            <span className="w-1.5 h-8 sm:h-9 bg-[#e11d48] rounded-xs shrink-0 mt-0.5"></span>
            <div>
              <h1 className="font-outfit text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-900">
                {categoryTitle}
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-normal mt-1">
                {cat.description}
              </p>
            </div>
          </div>
        </div>

        {/* Category Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8 space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-[#e11d48] rounded-full flex items-center justify-center mx-auto text-2xl">
              📂
            </div>
            <h3 className="font-outfit text-lg font-bold text-slate-900">
              Latest articles in {categoryTitle} coming soon
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Check out all latest articles and breaking entertainment news on our homepage.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#e11d48] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-rose-700 transition-colors shadow-sm"
            >
              Back to Home
            </Link>
          </div>
        )}

        {/* Bottom AdSense Banner */}
        <AdSenseSlot type="in-feed" />
      </main>
    </>
  );
}
