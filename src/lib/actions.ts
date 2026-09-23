import type { Post } from './types';

const UPLOAD_SECRET = 'tellyfilmy_upload_2024';

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
        let posts: Post[] = local ? JSON.parse(local) : [];
        if (!Array.isArray(posts)) posts = [];
        // Remove existing post with same slug to avoid duplicate
        posts = posts.filter((p) => p && p.slug !== slug);
        posts.unshift(newPost);
        localStorage.setItem('tellyfilmy_posts', JSON.stringify(posts));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }

      // Persist to Hostinger server
      try {
        await fetch('/save-posts.php', {
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
      } catch (e) {
        console.warn('Server save-posts.php sync failed:', e);
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
          // If not in localStorage yet, add as updated post entry
          posts.unshift({
            author: { name: 'TellyFilmy', avatarUrl: '/logo.png' },
            date: new Date().toISOString(),
            views: 0,
            ...updatedData,
          } as Post);
        }

        // If slug changed, clean up any remaining old slug entry
        if (newSlug !== slug) {
          posts = posts.filter(
            (p, idx) => (existingIndex >= 0 && idx === existingIndex) || (p && p.slug !== slug)
          );
        }

        localStorage.setItem('tellyfilmy_posts', JSON.stringify(posts));
      } catch (e) {
        console.warn('LocalStorage update failed:', e);
      }

      // Persist to Hostinger server
      try {
        await fetch('/save-posts.php', {
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
      } catch (e) {
        console.warn('Server save-posts.php sync failed:', e);
      }
    }

    return { success: true, newSlug };
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
          if (Array.isArray(posts)) {
            posts = posts.filter((p) => p && p.slug !== slug);
            localStorage.setItem('tellyfilmy_posts', JSON.stringify(posts));
          }
        }
      } catch (e) {
        console.warn('LocalStorage delete failed:', e);
      }

      // Persist to Hostinger server
      try {
        await fetch('/save-posts.php', {
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
      } catch (e) {
        console.warn('Server save-posts.php sync failed:', e);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to delete post:', error);
    return { success: false };
  }
}
