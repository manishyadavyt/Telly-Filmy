import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { Post } from "./types";

// ✅ Ensure this always points to the root
const POSTS_PATH = path.join(process.cwd(), "posts.json");

/**
 * ✅ Safe JSON reader
 * - Prevents build crash
 * - Prevents prerender error
 */
async function readPosts(): Promise<Post[]> {
  try {
    const data = await fs.readFile(POSTS_PATH, "utf-8");

    if (!data.trim()) return [];

    const parsed = JSON.parse(data);

    // ✅ Ensure array
    return Array.isArray(parsed) ? (parsed as Post[]) : [];
  } catch (error: any) {
    // ✅ posts.json not found → return empty (NO crash)
    if (error.code === "ENOENT") return [];

    console.error("❌ Error reading posts.json:", error);
    return [];
  }
}

/**
 * ✅ Safe JSON writer
 */
async function writePosts(posts: Post[]): Promise<void> {
  try {
    await fs.writeFile(
      POSTS_PATH,
      JSON.stringify(posts, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("❌ Error writing posts.json:", error);
  }
}

/**
 * ✅ Used by Home, Category, Footer, etc.
 * MUST NEVER throw during build
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await readPosts();

  return posts.sort(
    (a, b) =>
      new Date(b.date || 0).getTime() -
      new Date(a.date || 0).getTime()
  );
}

/**
 * ✅ Single post page
 */
export async function getPostBySlug(
  slug: string
): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

/**
 * ✅ Admin / API usage
 */

