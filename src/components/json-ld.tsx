import type { Post } from '@/lib/types';

interface ArticleJsonLdProps {
  post: Post;
  url: string;
}

export function ArticleJsonLd({ post, url }: ArticleJsonLdProps) {
  const baseUrl = 'https://www.tellyfilmy.com';
  const postImage = post.imageUrl
    ? post.imageUrl.startsWith('http')
      ? post.imageUrl
      : `${baseUrl}${post.imageUrl}`
    : `${baseUrl}/logo.png`;

  const allImages = post.images && post.images.length > 0
    ? post.images.map((img) => (img.startsWith('http') ? img : `${baseUrl}${img}`))
    : [postImage];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || post.title,
    image: allImages,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Telly Filmy Team',
      url: 'https://www.tellyfilmy.com/about',
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Telly Filmy',
      url: 'https://www.tellyfilmy.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.tellyfilmy.com/logo.png',
        width: 800,
        height: 600,
      },
    },
    articleSection: post.category || 'Entertainment',
    keywords: post.tags ? post.tags.join(', ') : 'Entertainment, TV Serials, Bollywood, News',
    inLanguage: 'en-IN',
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
    '@type': 'NewsMediaOrganization',
    name: 'Telly Filmy',
    url: 'https://www.tellyfilmy.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.tellyfilmy.com/logo.png',
      width: 800,
      height: 600,
    },
    sameAs: [
      'https://facebook.com/tellyfilmy',
      'https://twitter.com/tellyfilmy',
      'https://instagram.com/tellyfilmy',
      'https://youtube.com/@tellyfilmy',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Telly Filmy',
    url: 'https://www.tellyfilmy.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.tellyfilmy.com/posts?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
