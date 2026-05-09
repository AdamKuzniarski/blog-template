import { Card } from '@/components/primitives/card';
import { Container } from '../../components/container';
import { PageIntro } from '../../components/page-intro';
import { Section } from '@/components/primitives/section';

export default function AdminPage() {
  return (
    <Section>
      <Container size="narrow" className="flex flex-col gap-10">
        <PageIntro
          eyebrow="Intern"
          title="Admin"
          description="Dieser Bereich wird im nächsten Abschnitt an Auth und API angeschlossen. Vorher bleibt die Oberfläche bewust klein und klar."
        />

        <div className="grid gap-4">
          <Card>
            <h2 className="font-serif text-2xl tracking-tight">Geplante Funktionen</h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted">
              <li>Anmeldung und geschützte Routen</li>
              <li>Benutzerprofil und Rollen</li>
              <li>später Post-Verwaltung und Drafts</li>
            </ul>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
