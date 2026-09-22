// src/app/sitemap.ts
import { getPosts, CATEGORIES } from "@/lib/data";  

export default async function sitemap() {
  const baseUrl = "https://www.tellyfilmy.com";
  const posts = await getPosts();

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const categoryUrls = CATEGORIES.map((category) => ({
    url: `${baseUrl}/category/${encodeURIComponent(category.toLowerCase())}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const staticPages = [
    { url: baseUrl, lastModified: new Date().toISOString(), changeFrequency: 'always' as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date().toISOString(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date().toISOString(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date().toISOString(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date().toISOString(), changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  return [
    ...staticPages,
    ...categoryUrls,
    ...postUrls,
  ];
}
