import { getPosts } from '@/lib/data';
import { HeaderContent } from './header-content';

export async function Header() {
  const posts = await getPosts();

  return <HeaderContent posts={posts} />;
}
