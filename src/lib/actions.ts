'use server';

import { revalidatePath } from 'next/cache';
import type { Post } from './types';
import { addPostToStore, updatePostInStore, deletePostFromStore } from './data';

type AddPostInput = Omit<Post, 'id' | 'author' | 'views'>;

export async function addPost(
  postData: AddPostInput
): Promise<{ success: boolean; slug?: string }> {
  try {
    const slug =
      postData.slug ||
      postData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const newPost: Post = {
      ...postData,
      id: slug,
      slug,
      author: { name: 'TellyFilmy', avatarUrl: '/logo.png' },
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

type UpdatePostInput = Partial<Omit<Post, 'id' | 'author' | 'views'>>;

export async function updatePost(
  slug: string,
  postData: UpdatePostInput
): Promise<{ success: boolean }> {
  try {
    // If title changed, generate new slug unless slug explicitly provided
    let newSlug = postData.slug || slug;
    if (!postData.slug && postData.title) {
      newSlug = postData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const updatedData = {
      ...postData,
      slug: newSlug,
      id: newSlug,
    };

    const result = await updatePostInStore(slug, updatedData);

    if (!result) {
      return { success: false };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to update post:', error);
    return { success: false };
  }
}

export async function deletePost(
  slug: string
): Promise<{ success: boolean }> {
  try {
    const result = await deletePostFromStore(slug);

    if (!result) {
      return { success: false };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete post:', error);
    return { success: false };
  }
}
