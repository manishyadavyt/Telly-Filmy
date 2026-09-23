'use client';

import { useState, useEffect } from 'react';
import type { Post } from './types';

/**
 * Merges static build-time posts with any dynamic/new posts from localStorage and /posts.json
 */
export function useLivePosts(initialPosts: Post[] = []) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    let isMounted = true;

    async function syncPosts() {
      let combined: Post[] = [...initialPosts];
      const seenSlugs = new Set(combined.map((p) => p.slug));

      // 1. Check localStorage first (instant for author/admin)
      try {
        const local = localStorage.getItem('tellyfilmy_posts');
        if (local) {
          const localPosts: Post[] = JSON.parse(local);
          if (Array.isArray(localPosts)) {
            for (const lp of localPosts) {
              if (lp && lp.slug) {
                if (seenSlugs.has(lp.slug)) {
                  // Replace with updated version
                  combined = combined.map((p) => (p.slug === lp.slug ? lp : p));
                } else {
                  combined.unshift(lp);
                  seenSlugs.add(lp.slug);
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn('Failed reading localStorage posts:', e);
      }

      // 2. Fetch server posts.json in background (for other visitors)
      try {
        const res = await fetch('/posts.json', { cache: 'no-store' });
        if (res.ok) {
          const serverPosts: Post[] = await res.json();
          if (Array.isArray(serverPosts)) {
            for (const sp of serverPosts) {
              if (sp && sp.slug) {
                if (seenSlugs.has(sp.slug)) {
                  combined = combined.map((p) => (p.slug === sp.slug ? { ...p, ...sp } : p));
                } else {
                  combined.unshift(sp);
                  seenSlugs.add(sp.slug);
                }
              }
            }
          }
        }
      } catch {
        // Fallback silently if offline or posts.json not directly reachable
      }

      // Sort newest first
      combined.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

      if (isMounted) {
        setPosts(combined);
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
