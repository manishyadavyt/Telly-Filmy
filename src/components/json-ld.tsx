import type { Post } from '@/lib/types';

interface ArticleJsonLdProps {
  post: Post;
  url: string;
}

export function ArticleJsonLd({ post, url }: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: post.title,
    description: post.excerpt,
    image: post.images && post.images.length > 0 ? post.images : [post.imageUrl],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Telly Filmy Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Telly Filmy',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.tellyfilmy.com/logo.png',
      },
    },
    articleSection: post.category,
    keywords: post.tags ? post.tags.join(', ') : 'Entertainment, TV Serials, Bollywood',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; item: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Telly Filmy',
    url: 'https://www.tellyfilmy.com',
    logo: 'https://www.tellyfilmy.com/logo.png',
    sameAs: [
      'https://facebook.com/tellyfilmy',
      'https://twitter.com/tellyfilmy',
      'https://instagram.com/tellyfilmy',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
