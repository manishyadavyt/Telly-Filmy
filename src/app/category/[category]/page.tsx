// src/app/category/[category]/page.tsx
import { getPosts } from '@/lib/data';
import { findCategoryBySlug, CATEGORY_LIST } from '@/lib/categories';
import { CategoryFeed } from '@/components/category-feed';
import { BreadcrumbJsonLd } from '@/components/json-ld';
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

  const breadcrumbs = [
    { name: 'Home', item: 'https://www.tellyfilmy.com' },
    {
      name: cat.name,
      item: `https://www.tellyfilmy.com/category/${cat.slug}`,
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <CategoryFeed initialPosts={allPosts} category={cat} />
    </>
  );
}
