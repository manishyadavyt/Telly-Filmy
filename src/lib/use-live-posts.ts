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
        // 1. Fetch server /posts.json with timestamp cache buster
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
            let combined = [...serverPosts];

            // Merge any local un-synced creator draft from localStorage if present
            try {
              const local = localStorage.getItem('tellyfilmy_posts');
              if (local) {
                const localPosts: Post[] = JSON.parse(local);
                if (Array.isArray(localPosts)) {
                  for (const lp of localPosts) {
                    if (lp && lp.slug) {
                      const idx = combined.findIndex((p) => p && p.slug === lp.slug);
                      if (idx >= 0) {
                        combined[idx] = { ...combined[idx], ...lp };
                      } else {
                        combined.unshift(lp);
                      }
                    }
                  }
                }
              }
            } catch {}

            // Deduplicate by slug
            const seen = new Set<string>();
            const unique: Post[] = [];
            for (const p of combined) {
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

    return () => {
      isMounted = false;
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
 * Finds a post by slug from server posts.json or localStorage (works identically on mobile and desktop)
 */
export async function fetchLivePostBySlug(slug: string): Promise<Post | null> {
  if (!slug) return null;
  const cleanSlug = slug.trim().toLowerCase();

  // 1. Fetch server /posts.json with cache buster
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
  } catch {}

  // 2. Check localStorage (creator browser fallback)
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem('tellyfilmy_posts');
      if (local) {
        const posts: Post[] = JSON.parse(local);
        if (Array.isArray(posts)) {
          const found = posts.find(
            (p) => p && p.slug && p.slug.trim().toLowerCase() === cleanSlug
          );
          if (found) return found;
        }
      }
    } catch {}
  }

  return null;
}
