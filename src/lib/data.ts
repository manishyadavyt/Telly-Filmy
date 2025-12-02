import fs from 'fs/promises';
import path from 'path';
import type { Post } from './types'; // ✅ Use the SAME Post interface everywhere

const postsFilePath = path.join(process.cwd(), 'posts.json');

async function readPosts(): Promise<Post[]> {
  try {
    const data = await fs.readFile(postsFilePath, 'utf-8');
    return JSON.parse(data) as Post[];
  } catch (error: any) {
    if (error.code === 'ENOENT') return [];
    console.error('Error reading posts.json:', error);
    return [];
  }
}

async function writePosts(posts: Post[]): Promise<void> {
  try {
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to posts.json:', error);
  }
}

export const getPosts = async (): Promise<Post[]> => {
  const posts = await readPosts();
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
};

export const addPostToStore = async (newPost: Post) => {
  const posts = await readPosts();
  await writePosts([newPost, ...posts]);
};
