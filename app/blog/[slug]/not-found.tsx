import { Container } from '@/components/container';
import { Section } from '@/components/primitives/section';

export default function NotFound() {
  return (
    <Section>
      <Container size="narrow">
        <div className="rounded-2xl border border-border bg-surface px-6 py-8">
          <p className="text-sm uppercase tracking-[0.16em] text-muted">404</p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight">Artikel nicht gefunden</h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Der link ist veraltet oder Beitrag existiert nicht mehr.
          </p>
        </div>
      </Container>
    </Section>
  );
}
