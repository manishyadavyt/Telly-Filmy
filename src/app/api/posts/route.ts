import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/data';

export const dynamic = 'force-static';

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts);
}
