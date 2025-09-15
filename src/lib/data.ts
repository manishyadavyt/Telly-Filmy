
import fs from 'fs/promises';
import path from 'path';
import type { Post } from './types';

// Path to the JSON file, now at the root of the project
const postsFilePath = path.join(process.cwd(), 'posts.json');

// Helper function to read posts from the file
async function readPosts(): Promise<Post[]> {
  try {
    const data = await fs.readFile(postsFilePath, 'utf-8');
    return JSON.parse(data) as Post[];
  } catch (error: any) {
    // If the file doesn't exist or is empty, return an empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading posts.json:', error);
    // In case of other errors (like parsing), return an empty array to prevent crashing
    return [];
  }
}

// Helper function to write posts to the file
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

// This function is called by server actions to update the data store.
export const addPostToStore = async (newPost: Post) => {
  const posts = await readPosts();
  // Add the new post to the beginning of the array.
  const updatedPosts = [newPost, ...posts];
  await writePosts(updatedPosts);
};
