import { getPostBySlug, getPosts } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/json-ld';
import { getCategorySlug, findCategoryBySlug } from '@/lib/categories';
import { SinglePostContent } from '@/components/single-post-content';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found | Telly Filmy' };

  const baseUrl = 'https://www.tellyfilmy.com';
  const url = `${baseUrl}/posts/${post.slug}`;
  const images = post.images?.length ? post.images : [post.imageUrl];
  const title = post.metaTitle ? `${post.metaTitle} | Telly Filmy` : `${post.title} | Telly Filmy`;
  const description = post.metaDescription || post.excerpt;
  const keywords = [post.focusKeyword, post.category, ...(post.tags || [])].filter(Boolean) as string[];

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : ['entertainment', 'bollywood', 'tv serials', 'news'],
    alternates: { canonical: url },
    openGraph: {
      title: post.metaTitle || post.title,
      description,
      url,
      siteName: 'Telly Filmy',
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author?.name || 'Telly Filmy'],
      section: post.category || 'Entertainment',
      tags: post.tags || [],
      images: images.map((img: string) => ({
        url: img.startsWith('http') ? img : `${baseUrl}${img}`,
        width: 1200,
        height: 630,
        alt: post.title,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description,
      images: images.map((img: string) => (img.startsWith('http') ? img : `${baseUrl}${img}`)),
      creator: '@TellyFilmy',
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getPosts();
  const trendingStories = allPosts
    .filter((p) => p.isTrending || p.isTopStory)
    .slice(0, 5);

  const categorySlug = getCategorySlug(post.category);
  const categoryInfo = findCategoryBySlug(categorySlug);

  const breadcrumbs = [
    { name: 'Home', item: 'https://www.tellyfilmy.com' },
    { name: categoryInfo.name, item: `https://www.tellyfilmy.com/category/${categorySlug}` },
    { name: post.title, item: `https://www.tellyfilmy.com/posts/${post.slug}` },
  ];

  return (
    <>
      <ArticleJsonLd post={post} url={`https://www.tellyfilmy.com/posts/${post.slug}`} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <SinglePostContent initialPost={post} initialPosts={allPosts} trendingStories={trendingStories} />
    </>
  );
}
