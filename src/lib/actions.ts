import type { Post } from './types';

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

    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('tellyfilmy_posts');
        const posts: Post[] = local ? JSON.parse(local) : [];
        posts.unshift(newPost);
        localStorage.setItem('tellyfilmy_posts', JSON.stringify(posts));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
    }

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
    let newSlug = postData.slug || slug;
    if (!postData.slug && postData.title) {
      newSlug = postData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('tellyfilmy_posts');
        if (local) {
          let posts: Post[] = JSON.parse(local);
          posts = posts.map((p) => (p.slug === slug ? { ...p, ...postData, slug: newSlug } : p));
          localStorage.setItem('tellyfilmy_posts', JSON.stringify(posts));
        }
      } catch (e) {
        console.warn('LocalStorage update failed:', e);
      }
    }

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
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('tellyfilmy_posts');
        if (local) {
          let posts: Post[] = JSON.parse(local);
          posts = posts.filter((p) => p.slug !== slug);
          localStorage.setItem('tellyfilmy_posts', JSON.stringify(posts));
        }
      } catch (e) {
        console.warn('LocalStorage delete failed:', e);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to delete post:', error);
    return { success: false };
  }
}
