import { NextResponse } from 'next/server';
import { getPosts, getPostBySlug } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const post = await getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  }

  const posts = await getPosts();
  return NextResponse.json(posts);
}
