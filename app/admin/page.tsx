import { Container } from '../../components/container';
import { PageIntro } from '../../components/page-intro';

export default function AdminPage() {
  return (
    <main className="min-h-screen py-16 sm:py-20">
      <Container className="max-w-3xl">
        <PageIntro
          title="Admin"
          description="Interner Bereich für Anmeldung, Verwaltung und spätere Pflege von Inhalten."
        />

        <section className="mt-10 rounded-2xl border border-border bg-surface px-6 py-8">
          <p className="text-base leading-7 text-muted">
            Der Zugriffsschutz kommt im nächsten Schritt über die API.
          </p>
        </section>
      </Container>
    </main>
  );
}
