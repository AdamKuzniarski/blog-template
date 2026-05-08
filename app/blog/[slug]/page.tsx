import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/container';
import { Prose } from '@/components/primitives/prose';
import { Section } from '@/components/primitives/section';
import { getAllPosts, getPostsBySlug } from '@/content/posts';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostsBySlug(slug);

  if (!post) {
    return {
      title: 'Artikel nicht gefunden | Codenotes',
    };
  }
  return {
    title: `${post.title}|Codenotes`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostsBySlug(slug);

  if (!post) {
    notFound();
  }

  const PostComponent = post.Component;

  return (
    <Section>
      <Container size="narrow">
        <article>
          <header className="border-b border-border pb-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <time dateTime={post.publishedAt}>
                {dateFormatter.format(new Date(post.publishedAt))}
              </time>
              <span>•</span>
              <span>{post.readingTime}</span>
            </div>

            <h1 className="mt-4 font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
              {post.title}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{post.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border-border border bg-surface-strong px-3 py-1 text-sm text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="mt-10">
            <Prose>
              <PostComponent />
            </Prose>
          </div>
        </article>
      </Container>
    </Section>
  );
}
