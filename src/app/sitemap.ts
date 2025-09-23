// src/app/sitemap.ts
import { getPosts } from "@/lib/data";  

export default async function sitemap() {
  const baseUrl = "https://www.tellyfilmy.com"; // replace with your domain
  const posts = await getPosts();

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.date,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
    },
    ...postUrls,
  ];
}
