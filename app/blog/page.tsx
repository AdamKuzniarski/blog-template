import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/primitives/card';
import { Container } from '@/components/container';
import { PageIntro } from '@/components/page-intro';
import { Section } from '@/components/primitives/section';
import { getAllPosts } from '@/content/posts';

export const metadata: Metadata = {
  title: 'Blog | Codenotes',
  description: 'Artikel über Web, Software und sauberen Aufbau.',
};

const dateFormater = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Section>
      <Container size="narrow" className="flex flex-col gap-10">
        <PageIntro
          eyebrow="Öffentlich"
          title="Blog"
          description="Artikel über Webentwicklung, ruhigee Architektur und nachhalitge Entscheidungen im Code."
        />
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.slug} className="transition-colors hover:border-link">
              <article className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                  <time dateTime={post.publishedAt}>
                    {dateFormater.format(new Date(post.publishedAt))}
                  </time>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>

                <div>
                  <h2 className="font-serif text-3xl tracking-tight">
                    <Link href={`/blog/${post.slug}`} className="hover:text-link">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-base leading-7 text-muted">{post.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-surface-strong px-3 py-1 text-sm text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
