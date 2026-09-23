import { getPosts } from '@/lib/data';
import { AllPostsFeed } from '@/components/all-posts-feed';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest Entertainment News, TV Serials & Bollywood Articles | Telly Filmy',
  description:
    'Browse all breaking entertainment news, TV serial spoilers, celebrity updates, and Bollywood gossips on Telly Filmy.',
  alternates: {
    canonical: 'https://www.tellyfilmy.com/posts',
  },
  openGraph: {
    title: 'Latest Entertainment News & Bollywood Articles | Telly Filmy',
    description:
      'Browse all breaking entertainment news, TV serial spoilers, celebrity updates, and Bollywood gossips on Telly Filmy.',
    url: 'https://www.tellyfilmy.com/posts',
    siteName: 'Telly Filmy',
    type: 'website',
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

export default async function AllPostsPage() {
  const allPosts = await getPosts();

  const breadcrumbs = [
    { name: 'Home', item: 'https://www.tellyfilmy.com' },
    { name: 'All Articles', item: 'https://www.tellyfilmy.com/posts' },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <AllPostsFeed initialPosts={allPosts} />
    </>
  );
}
