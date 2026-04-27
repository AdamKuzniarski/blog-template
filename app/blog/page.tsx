import { Container } from '@/components/container';
import { PageIntro } from '@/components/page-intro';
export default function BlogPage() {
  return (
    <main className="min-h-screen py-16 sm:py-20">
      <Container className="max-w-3xl">
        <PageIntro
          title="Blog"
          description="Hier erscheinen veröffentlichte Texte. Erst aus MDX, später auf Wunsch aus der Datenbank."
        />

        <section className="mt-10 rounded-2xl border border-border bg-surface px-6 py-8">
          <p className="text-base leading-7 text-muted">Noch keine veröffentlichten Beiträge.</p>
        </section>
      </Container>
    </main>
  );
}
