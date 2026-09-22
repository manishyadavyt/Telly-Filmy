import { getPosts } from '@/lib/data';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = 'https://www.tellyfilmy.com';
  const posts = await getPosts();

  const sortedPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 50);

  const rssItems = sortedPosts
    .map((post) => {
      const postUrl = `${baseUrl}/posts/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const imageUrl = post.imageUrl
        ? post.imageUrl.startsWith('http')
          ? post.imageUrl
          : `${baseUrl}${post.imageUrl}`
        : `${baseUrl}/logo.png`;

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt || post.title)}</description>
      <category>${escapeXml(post.category || 'Entertainment')}</category>
      <author>editor@tellyfilmy.com (${escapeXml(post.author?.name || 'Telly Filmy Team')})</author>
      <enclosure url="${imageUrl}" type="image/jpeg" length="0" />
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Telly Filmy - Entertainment News, TV Serials &amp; Bollywood Updates</title>
    <link>${baseUrl}</link>
    <description>Latest TV serial updates, spoilers, Bollywood news, OTT releases, and trending entertainment stories.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Telly Filmy</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
