export interface Post {
  images: never[];
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageHint: string;
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
  videoUrl?: string; // optional video URL for embedding videos
}
