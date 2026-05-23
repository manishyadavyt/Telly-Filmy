import { getPostBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,

    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: [
        {
          url: `https://YOURDOMAIN.com${post.imageUrl}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`https://YOURDOMAIN.com${post.imageUrl}`],
    },
  };
}

export default function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Main Image */}
      <div className="relative w-full aspect-[16/9] mb-6 overflow-hidden rounded-xl">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">
        {post.title}
      </h1>

      {/* Date */}
      <p className="text-gray-500 mb-6">
        {new Date(post.date).toLocaleDateString()}
      </p>

      {/* Content */}
      <div className="prose prose-lg max-w-none whitespace-pre-line">
        {post.content}
      </div>

      {/* Additional Images */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {post.images.map((img, index) => (
            <div
              key={index}
              className="relative w-full aspect-[16/9] overflow-hidden rounded-xl"
            >
              <Image
                src={img}
                alt={`${post.title} ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* YouTube Video */}
      {post.videoUrl && (
        <div className="mt-8">
          <iframe
            width="100%"
            height="500"
            src={post.videoUrl.replace('watch?v=', 'embed/')}
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
            className="rounded-xl"
          />
        </div>
      )}
    </article>
  );
}