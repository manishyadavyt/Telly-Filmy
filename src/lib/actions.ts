import type { Post } from './types';

const UPLOAD_SECRET = 'tellyfilmy_upload_2024';

type AddPostInput = Omit<Post, 'id' | 'author' | 'views'> & {
  author?: { name: string; avatarUrl: string };
  views?: number;
};

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
      images: Array.isArray(postData.images) ? postData.images : [],
      tags: Array.isArray(postData.tags) ? postData.tags : [],
      author: postData.author || { name: 'TellyFilmy', avatarUrl: '/logo.png' },
      date: postData.date || new Date().toISOString(),
      views: typeof postData.views === 'number' ? postData.views : 0,
      enableAds: postData.enableAds !== false,
    };

    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('tellyfilmy_posts');
        let posts: Post[] = local ? JSON.parse(local) : [];
        if (!Array.isArray(posts)) posts = [];
        // Remove existing post with same slug to avoid duplicate
        posts = posts.filter((p) => p && p.slug !== slug);
        posts.unshift(newPost);
        localStorage.setItem('tellyfilmy_posts', JSON.stringify(posts));
      } catch (e) {
        console.warn('LocalStorage save warning:', e);
      }

      // Persist to Hostinger server so ALL devices see the post immediately
      const res = await fetch('/save-posts.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Upload-Secret': UPLOAD_SECRET,
        },
        body: JSON.stringify({
          action: 'add',
          post: newPost,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server save failed (${res.status})`);
      }
    }

    return { success: true, slug: newPost.slug };
  } catch (error: any) {
    console.error('Failed to add post:', error);
    throw error;
  }
}

type UpdatePostInput = Partial<Omit<Post, 'id'>>;

export async function updatePost(
  slug: string,
  postData: UpdatePostInput
): Promise<{ success: boolean; newSlug?: string }> {
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

    const updatedData: Partial<Post> = {
      ...postData,
      slug: newSlug,
      id: newSlug,
      images: Array.isArray(postData.images) ? postData.images : undefined,
      tags: Array.isArray(postData.tags) ? postData.tags : undefined,
    };

    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('tellyfilmy_posts');
        let posts: Post[] = local ? JSON.parse(local) : [];
        if (!Array.isArray(posts)) posts = [];

        const existingIndex = posts.findIndex(
          (p) => p && (p.slug === slug || (newSlug && p.slug === newSlug))
        );

        if (existingIndex >= 0) {
          posts[existingIndex] = {
            ...posts[existingIndex],
            ...updatedData,
          } as Post;
        } else {
          posts.unshift({
            author: { name: 'TellyFilmy', avatarUrl: '/logo.png' },
            date: new Date().toISOString(),
            views: 0,
            ...updatedData,
          } as Post);
        }

        // If slug changed, remove old slug entry
        if (newSlug !== slug) {
          posts = posts.filter(
            (p, idx) => (existingIndex >= 0 && idx === existingIndex) || (p && p.slug !== slug)
          );
        }

        localStorage.setItem('tellyfilmy_posts', JSON.stringify(posts));
      } catch (e) {
        console.warn('LocalStorage update warning:', e);
      }

      // Persist to Hostinger server so ALL devices see the updated post
      const res = await fetch('/save-posts.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Upload-Secret': UPLOAD_SECRET,
        },
        body: JSON.stringify({
          action: 'update',
          slug,
          post: updatedData,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server update failed (${res.status})`);
      }
    }

    return { success: true, newSlug };
  } catch (error: any) {
    console.error('Failed to update post:', error);
    throw error;
  }
}

export async function deletePost(
  slug: string
): Promise<{ success: boolean }> {
  try {
    if (!slug) {
      throw new Error('Missing article slug for deletion');
    }

    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('tellyfilmy_posts');
        if (local) {
          let posts: Post[] = JSON.parse(local);
          if (Array.isArray(posts)) {
            posts = posts.filter((p) => p && p.slug !== slug);
            localStorage.setItem('tellyfilmy_posts', JSON.stringify(posts));
          }
        }
      } catch (e) {
        console.warn('LocalStorage delete warning:', e);
      }

      // Persist deletion to Hostinger server
      const res = await fetch('/save-posts.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Upload-Secret': UPLOAD_SECRET,
        },
        body: JSON.stringify({
          action: 'delete',
          slug,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server delete failed (${res.status})`);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete post:', error);
    throw error;
  }
}
