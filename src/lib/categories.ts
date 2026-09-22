export interface CategoryMeta {
  name: string;
  slug: string;
  description: string;
  aliases: string[];
}

export const CATEGORY_LIST: CategoryMeta[] = [
  {
    name: 'Bollywood',
    slug: 'bollywood',
    description: 'Latest Bollywood news, movie reviews, box office updates, and celebrity interviews.',
    aliases: ['bollywood', 'movies', 'cinema'],
  },
  {
    name: 'TV Serials',
    slug: 'tv-serials',
    description: 'Daily TV serial updates, upcoming twists, cast interviews, and episode highlights.',
    aliases: ['tv-serials', 'television', 'tv', 'tv serials', 'tv shows', 'tv-shows', 'tv-serials-updates'],
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Trending entertainment stories, viral moments, exclusives, and news.',
    aliases: ['entertainment', 'celebrity news', 'celebrity-news', 'general'],
  },
  {
    name: 'Reality TV',
    slug: 'reality-tv',
    description: 'Reality TV show updates, voting trends, contestants buzz, and highlights.',
    aliases: ['reality-tv', 'reality tv', 'reality shows', 'reality-shows'],
  },
  {
    name: 'Bhojpuri',
    slug: 'bhojpuri',
    description: 'Bhojpuri cinema news, song releases, actor interviews, and regional industry buzz.',
    aliases: ['bhojpuri', 'bhojpuri-cinema'],
  },
  {
    name: 'Media & Marketing',
    slug: 'media-marketing',
    description: 'Media industry trends, advertising campaigns, brand ambassadorships, and broadcasting news.',
    aliases: ['media-marketing', 'media & marketing', 'media and marketing', 'marketing', 'media-&-marketing'],
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Entertainment business, brand sponsorships, industry acquisitions, and economics.',
    aliases: ['business', 'finance', 'industry'],
  },
  {
    name: 'OTT Releases',
    slug: 'ott',
    description: 'New releases on Netflix, Prime Video, Hotstar, Zee5, and streaming web series reviews.',
    aliases: ['ott', 'ott releases', 'ott-releases', 'web-series', 'web-stories'],
  },
  {
    name: 'Trending Stories',
    slug: 'trending',
    description: 'Hottest trending stories, viral buzz, breaking entertainment updates, and top exclusives.',
    aliases: ['trending', 'trending stories', 'spoilers', 'spoilers & trending', 'hot', 'viral'],
  },
];

export function getCategorySlug(categoryName: string): string {
  if (!categoryName) return 'entertainment';
  const clean = categoryName.trim().toLowerCase();
  const matched = CATEGORY_LIST.find(
    (c) =>
      c.name.toLowerCase() === clean ||
      c.slug === clean ||
      c.aliases.includes(clean) ||
      c.aliases.some((a) => clean.includes(a) || a.includes(clean))
  );
  if (matched) return matched.slug;
  return clean.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function findCategoryBySlug(slug: string): CategoryMeta {
  if (!slug) return CATEGORY_LIST[0];
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  const clean = decoded.replace(/\s+/g, '-');
  
  const matched = CATEGORY_LIST.find(
    (c) =>
      c.slug === clean ||
      c.aliases.includes(clean) ||
      c.aliases.includes(decoded) ||
      c.name.toLowerCase() === decoded
  );
  
  if (matched) return matched;

  // Pretty title format for unknown slug
  const name = clean
    .split('-')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ');

  return {
    name,
    slug: clean,
    description: `Read the latest ${name} news, TV updates, exclusive gossip, and entertainment stories on Telly Filmy.`,
    aliases: [clean, decoded],
  };
}
