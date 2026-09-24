'use client';

import { useState, useEffect } from 'react';
import type { Post } from './types';

/**
 * Custom hook to provide live, synchronized posts across all devices.
 * Uses the server's /posts.json as the single source of truth,
 * sorted deterministically by date (newest first).
 */
export function useLivePosts(initialPosts: Post[] = []) {
  const [posts, setPosts] = useState<Post[]>(() => {
    return sortPostsByDateDesc(initialPosts);
  });

  useEffect(() => {
    let isMounted = true;

    async function syncPosts() {
      try {
        // Fetch server /posts.json with timestamp cache buster
        const res = await fetch(`/posts.json?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
        });

        if (res.ok) {
          const serverPosts: Post[] = await res.json();
          if (Array.isArray(serverPosts) && serverPosts.length > 0) {
            // Deduplicate by slug
            const seen = new Set<string>();
            const unique: Post[] = [];
            for (const p of serverPosts) {
              if (p && p.slug && !seen.has(p.slug)) {
                seen.add(p.slug);
                unique.push(p);
              }
            }

            const sorted = sortPostsByDateDesc(unique);
            if (isMounted) {
              setPosts(sorted);
            }
            return;
          }
        }
      } catch (e) {
        console.warn('Live posts sync warning:', e);
      }

      // Fallback: sort initial static posts
      if (isMounted && initialPosts.length > 0) {
        setPosts(sortPostsByDateDesc(initialPosts));
      }
    }

    syncPosts();

    // Re-sync on custom update events or window focus
    const handleUpdate = () => syncPosts();
    window.addEventListener('tellyfilmy_posts_updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('tellyfilmy_posts_updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [initialPosts]);

  return posts;
}

/**
 * Sorts posts by date in descending order (newest first).
 */
export function sortPostsByDateDesc(items: Post[]): Post[] {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const timeA = a && a.date ? new Date(a.date).getTime() : 0;
    const timeB = b && b.date ? new Date(b.date).getTime() : 0;
    return timeB - timeA;
  });
}

/**
 * Finds a post by slug from server posts.json (works identically on mobile, desktop, and all browsers)
 */
export async function fetchLivePostBySlug(slug: string): Promise<Post | null> {
  if (!slug) return null;
  const cleanSlug = slug.trim().toLowerCase();

  // Fetch server /posts.json with cache buster
  try {
    const res = await fetch(`/posts.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    if (res.ok) {
      const posts: Post[] = await res.json();
      if (Array.isArray(posts)) {
        const found = posts.find(
          (p) => p && p.slug && p.slug.trim().toLowerCase() === cleanSlug
        );
        if (found) return found;
      }
    }
  } catch (e) {
    console.warn('Error fetching live post by slug:', e);
  }

  return null;
}
