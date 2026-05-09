import Link from 'next/link';
import { Container } from '@/components/primitives/container';
import { ThemeToggle } from '@/components/site/theme-toggle';

const navItems = [
  { href: '/blog', label: 'Blog' },
  { href: '/admin', label: 'Admin' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-page/95 backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <ThemeToggle />
      </Container>
    </header>
  );
}
