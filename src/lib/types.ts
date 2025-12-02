export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;

  imageUrl: string;       // cover photo
  images?: string[];      // additional photos
  imageHint?: string;

  category: string;
  tags: string[];

  author: {
    name: string;
    avatarUrl: string;
  };

  date: string;
  isTopStory: boolean;
  isTrending: boolean;
  views: number;

  videoUrl?: string;
}
