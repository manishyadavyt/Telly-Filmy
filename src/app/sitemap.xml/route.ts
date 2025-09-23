import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://www.tellyfilmy.com";

  const urls = [
    { loc: `${baseUrl}/`, lastmod: "2025-09-21" },
    { loc: `${baseUrl}/posts/starparivar-youtube-video-post`, lastmod: "2025-09-21" },
    { loc: `${baseUrl}/posts/paro-sang-dev-dangal-tv`, lastmod: "2025-09-22" }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (url) => `
      <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`
      )
      .join("")}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
