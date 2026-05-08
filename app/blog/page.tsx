import { ButtonLink } from '@/components/primitives/button-link';
import { Card } from '@/components/primitives/card';
import { Container } from '@/components/container';
import { PageIntro } from '@/components/page-intro';
import { Section } from '@/components/primitives/section';

export default function BlogPage() {
  return (
    <Section>
      <Container size="narrow" className="flex flex-col gap-10">
        <PageIntro
          eyebrow="Öffentlich"
          title="Blog"
          description="Hier erscheinen veröffentlicte Texte. Erst ruhig und markdownbasiert, später bei Bedarf mehr Functionen."
          actions={<ButtonLink href="/">Startseite</ButtonLink>}
        />

        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm uppercase tracking-[0.16em] text-muted">Noch leer</p>
            <h2 className="font-serif text-2xl tracking-tight">
              Die ersten Artikel kommen als Nächstes.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted">
              Im nächsten Ausbauschritt hängen wir echte Beiträge aus Markdown oder MDX an. Dann
              bekommt diese Seite Liste, Metadaten und Detailsansichten.
            </p>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
