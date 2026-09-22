export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  isTopStory: boolean;
  isTrending: boolean;
  imageUrl: string;
  imageHint: string;
  images: string[];
  tags: string[];
  author: {
    name: string;
    avatarUrl: string;
  };
  date: string;
  views: number;
  videoUrl?: string;

  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;

  // AdSense / Monetization
  enableAds?: boolean;
}