// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/data';
import { CATEGORY_LIST } from '@/lib/categories';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.tellyfilmy.com';
  const posts = await getPosts();

  // 1. Post URLs
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => {
    let lastModDate = new Date();
    if (post.date) {
      const parsed = new Date(post.date);
      if (!isNaN(parsed.getTime())) {
        lastModDate = parsed;
      }
    }

    return {
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: lastModDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    };
  });

  // 2. Category URLs with clean kebab-case slugs
  const categoryUrls: MetadataRoute.Sitemap = CATEGORY_LIST.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 3. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  return [...staticPages, ...categoryUrls, ...postUrls];
}
