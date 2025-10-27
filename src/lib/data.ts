import fs from 'fs/promises';
import path from 'path';

// ✅ Define Post type inline or import from types.ts (your choice)
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatarUrl: string;
  };
  imageUrl: string;
  images?: string[]; // ✅ Added support for multiple images
  content: string;
  videoUrl?: string;
  isTopStory?: boolean;
  isTrending?: boolean;
  views?: number;
}

// ✅ Path to your posts.json file
const postsFilePath = path.join(process.cwd(), 'posts.json');

// ✅ Helper: Read all posts
async function readPosts(): Promise<Post[]> {
  try {
    const data = await fs.readFile(postsFilePath, 'utf-8');
    return JSON.parse(data) as Post[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading posts.json:', error);
    return [];
  }
}

// ✅ Helper: Write updated posts
async function writePosts(posts: Post[]): Promise<void> {
  try {
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to posts.json:', error);
  }
}

// ✅ Get all posts (sorted by newest first)
export const getPosts = async (): Promise<Post[]> => {
  const posts = await readPosts();
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// ✅ Get post by slug
export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
};

// ✅ Add new post to store
export const addPostToStore = async (newPost: Post) => {
  const posts = await readPosts();
  const updatedPosts = [newPost, ...posts];
  await writePosts(updatedPosts);
};
