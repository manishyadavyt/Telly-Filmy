'use client';

import { useState, useEffect, useRef } from 'react';
import type { Post } from './types';

/**
 * Custom hook to provide live, synchronized posts across all devices.
 * Uses the server's /posts.json as the single source of truth,
 * sorted deterministically by date (newest first).
 *
 * FIX: Uses a ref for initialPosts so the effect only runs once on mount.
 * Previously [initialPosts] dependency caused a re-sync loop on every render.
 */
export function useLivePosts(initialPosts: Post[] = []) {
  const [posts, setPosts] = useState<Post[]>(() => {
    return sortPostsByDateDesc(initialPosts);
  });

  // Keep initial posts accessible inside the effect without re-triggering it
  const initialPostsRef = useRef(initialPosts);

  useEffect(() => {
    let isMounted = true;

    // Helper: detect broken base64/blob URLs that don't work across devices
    const isLocalOnlyUrl = (url?: string) =>
      typeof url === 'string' && (url.startsWith('data:') || url.startsWith('blob:'));

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
            // Strip out base64/blob image URLs (they only work on the device that uploaded)
            const cleaned = serverPosts.map((p) => {
              if (!p) return p;
              return {
                ...p,
                imageUrl: isLocalOnlyUrl(p.imageUrl) ? '/logo.png' : p.imageUrl,
                images: Array.isArray(p.images)
                  ? p.images.filter((img) => !isLocalOnlyUrl(img))
                  : [],
              };
            });

            // Deduplicate by slug
            const seen = new Set<string>();
            const unique: Post[] = [];
            for (const p of cleaned) {
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
      const fallback = initialPostsRef.current;
      if (isMounted && fallback.length > 0) {
        setPosts(sortPostsByDateDesc(fallback));
      }
    }

    syncPosts();

    // Re-sync on custom update events or window focus
    const handleUpdate = () => syncPosts();
    window.addEventListener('tellyfilmy_posts_updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    // Poll every 30 seconds so all devices stay live without refresh
    const pollInterval = setInterval(syncPosts, 30000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      window.removeEventListener('tellyfilmy_posts_updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - runs once. initialPosts handled via ref above.

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
 * Finds a post by slug from server posts.json
 */
export async function fetchLivePostBySlug(slug: string): Promise<Post | null> {
  if (!slug) return null;
  const cleanSlug = slug.trim().toLowerCase();

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
