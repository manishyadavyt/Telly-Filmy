'use client';

import { useState, useEffect, useRef } from 'react';
import type { Post } from './types';

const SESSION_CACHE_KEY = 'tellyfilmy_posts_v2';

/** Load from sessionStorage for instant render on refresh (no layout flash) */
function loadCached(): Post[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Save latest posts to sessionStorage so next refresh is instant */
function saveCache(posts: Post[]) {
  try {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(posts));
  } catch {}
}

function arePostsEqual(a: Post[], b: Post[]): boolean {
  if (a === b) return true;
  if (!a || !b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i]?.slug !== b[i]?.slug || a[i]?.title !== b[i]?.title || a[i]?.imageUrl !== b[i]?.imageUrl) {
      return false;
    }
  }
  return true;
}

/**
 * Custom hook to provide live, synchronized posts across all devices.
 * Uses the server's /posts.json as the single source of truth.
 *
 * KEY FIX: Uses sessionStorage cache and deep equality bailout so refresh is instant with no layout flash.
 */
export function useLivePosts(initialPosts: Post[] = []) {
  const [posts, setPosts] = useState<Post[]>(() => {
    // 1. Try sessionStorage first (instant, no flash)
    const cached = loadCached();
    if (cached.length > 0) return sortPostsByDateDesc(cached);
    // 2. Fall back to static build posts
    return sortPostsByDateDesc(initialPosts);
  });

  const initialPostsRef = useRef(initialPosts);

  useEffect(() => {
    let isMounted = true;

    async function syncPosts() {
      try {
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
              setPosts((prev) => {
                if (arePostsEqual(prev, sorted)) return prev;
                return sorted;
              });
              // Cache for next refresh — instant render, zero flash
              saveCache(sorted);
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
        setPosts((prev) => {
          const sorted = sortPostsByDateDesc(fallback);
          if (arePostsEqual(prev, sorted)) return prev;
          return sorted;
        });
      }
    }

    syncPosts();

    const handleUpdate = () => syncPosts();
    window.addEventListener('tellyfilmy_posts_updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    // Poll every 30s so all devices stay in sync
    const pollInterval = setInterval(syncPosts, 30000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      window.removeEventListener('tellyfilmy_posts_updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs once on mount

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
