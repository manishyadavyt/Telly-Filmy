
'use server';

import { revalidatePath } from 'next/cache';
import type { Post } from './types';
import { addPostToStore, getPosts } from './data';

type AddPostInput = Omit<
  Post,
  'id' | 'slug' | 'author' | 'date' | 'views'
>;

export async function addPost(
  postData: AddPostInput
): Promise<{ success: boolean; slug?: string }> {
  try {
    const newPost: Post = {
      ...postData,
      id: Math.random().toString(36).substring(2),
      slug: postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      author: { name: 'Admin', avatarUrl: 'https://i.pravatar.cc/150?u=admin' },
      date: new Date().toISOString(),
      views: 0,
    };
    
    await addPostToStore(newPost);
    
    // Revalidate the entire site to ensure new post appears everywhere
    revalidatePath('/', 'layout');

    return { success: true, slug: newPost.slug };
  } catch (error) {
    console.error('Failed to add post:', error);
    return { success: false };
  }
}
