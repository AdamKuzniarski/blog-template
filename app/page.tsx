import Link from 'next/link';
import { ButtonLink } from '@/components/primitives/button-link';
import { Card } from '@/components/primitives/card';
import { Container } from '@/components/container';
import { Section } from '@/components/primitives/section';
import { getAllPosts } from '@/content/posts';

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 2);

  return (
    <>
      <Section className="pb-10 sm:pb-12">
        <Container className="flex flex-col gap-10 ">
          <header className="max-w-4xl border-b border-border pb-10">
            <p className="mb-4 text-sm uppercase tracking-[0.18em] text-muted ">
              Schlicht. Lesbar. Ruhig
            </p>
            <h1 className="max-w-3xl font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
              Texte über Web, Software und das kleine Chaos dazwischen.
            </h1>
            <p className="mt-6 flex flex-wrap gap-3 ">
              Ein ruhiger Blog mit Focus auf Typographie, gute Struktur und langfristig warbaren
              Code.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/blog" variant="primary">
                Zum Blog
              </ButtonLink>
              <ButtonLink href="/admin">Zum Admin</ButtonLink>
            </div>
          </header>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container className="flex flex-col gap-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-muted">Neu im Blog</p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight">Aktuelle Beiträge</h2>
            </div>

            <ButtonLink href="/blog">Alle Artikel</ButtonLink>
          </div>

          <div>
            {latestPosts.map((post) => (
              <Card key={post.slug} className="transition-colors hover:border-link">
                <article className="flex h-full flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                    <time dateTime={post.publishedAt}>
                      {dateFormatter.format(new Date(post.publishedAt))}
                    </time>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-2xl tracking-tight">
                      <Link href={`/blog/${post.slug}`} className="hover:text-link">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-base leading-7 text-muted">{post.description}</p>
                  </div>
                </article>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
