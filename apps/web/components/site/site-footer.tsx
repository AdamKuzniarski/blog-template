import Link from 'next/link';
import { Container } from '@/components/primitives/container';

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Schlichter Tech-Blog mit Focus auf Lesbarkeit, Struktur und ruhige Gestaltung.</p>

        <div className="flex items-center gap-4">
          <Link href="/blog" className="hover:text-text">
            Blog
          </Link>
          <Link href="/admin" className="hover:text-text">
            Admin
          </Link>
        </div>
      </Container>
    </footer>
  );
}
