import { getPosts } from '@/lib/data';
import EditArticleClient from './EditArticleClient';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default function EditPage() {
  return <EditArticleClient />;
}
