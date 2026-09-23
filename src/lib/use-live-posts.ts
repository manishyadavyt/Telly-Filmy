'use client';

import { useState, useEffect } from 'react';
import type { Post } from './types';

export function useLivePosts(initialPosts: Post[] = []) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    let isMounted = true;

    async function syncPosts() {
      const dynamicNewPosts: Post[] = [];
      const seenSlugs = new Set<string>();

      // 1. Check localStorage first (instant for creator/admin)
      try {
        const local = localStorage.getItem('tellyfilmy_posts');
        if (local) {
          const localPosts: Post[] = JSON.parse(local);
          if (Array.isArray(localPosts)) {
            for (const lp of localPosts) {
              if (lp && lp.slug && !seenSlugs.has(lp.slug)) {
                dynamicNewPosts.push(lp);
                seenSlugs.add(lp.slug);
              }
            }
          }
        }
      } catch (e) {
        console.warn('Failed reading localStorage posts:', e);
      }

      // 2. Fetch server /posts.json (for all visitors)
      try {
        const res = await fetch('/posts.json', { cache: 'no-store' });
        if (res.ok) {
          const serverPosts: Post[] = await res.json();
          if (Array.isArray(serverPosts)) {
            for (const sp of serverPosts) {
              if (sp && sp.slug && !seenSlugs.has(sp.slug)) {
                dynamicNewPosts.push(sp);
                seenSlugs.add(sp.slug);
              }
            }
          }
        }
      } catch {
        // Silent fallback
      }

      // 3. Add initial static posts that haven't been added yet
      const basePosts: Post[] = [];
      for (const ip of initialPosts) {
        if (ip && ip.slug) {
          if (!seenSlugs.has(ip.slug)) {
            basePosts.push(ip);
            seenSlugs.add(ip.slug);
          }
        }
      }

      // Put newly added dynamic posts at the FRONT, followed by base posts
      const finalCombined = [...dynamicNewPosts, ...basePosts];

      if (isMounted) {
        setPosts(finalCombined);
      }
    }

    syncPosts();

    return () => {
      isMounted = false;
    };
  }, [initialPosts]);

  return posts;
}

/**
 * Finds a post by slug from initial, localStorage, or server posts.json
 */
export async function fetchLivePostBySlug(slug: string): Promise<Post | null> {
  // 1. Check localStorage
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem('tellyfilmy_posts');
      if (local) {
        const posts: Post[] = JSON.parse(local);
        const found = posts.find((p) => p.slug === slug);
        if (found) return found;
      }
    } catch {}
  }

  // 2. Check /posts.json
  try {
    const res = await fetch('/posts.json', { cache: 'no-store' });
    if (res.ok) {
      const posts: Post[] = await res.json();
      const found = posts.find((p) => p.slug === slug);
      if (found) return found;
    }
  } catch {}

  return null;
}
