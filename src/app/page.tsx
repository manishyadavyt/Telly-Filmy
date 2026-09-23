import { HomeFeed } from '@/components/home-feed';
import { getPosts } from '@/lib/data';
import { OrganizationJsonLd } from '@/components/json-ld';

export default async function Home() {
  const allPosts = await getPosts();

  return (
    <>
      <OrganizationJsonLd />
      <HomeFeed initialPosts={allPosts} />
    </>
  );
}
