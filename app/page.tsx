import Link from 'next/link';

const links = [
  { href: '/blog', label: 'Blog' },
  { href: '/admin', label: 'Zur Admin-Bereich' },
];

export default function HomePage() {
  return (
    <main className={'mx-auto flex min-h-screen max-w-4xl flex-col gap-12 px-6 py-16 sm:px-8'}>
      <header className={'space-y-6 border-b border-border pb-10'}>
        <p className={'text-sm uppercase tracking-[0.18] text-muted'}>Schlicht, Lesbar, Ruhig</p>
        <h1 className={'max-w-3xl font-serif text-5xl leading-tight tracking-tight sm:text-6xl'}>
          Texte über Web, Software und das kleine Chaos dazwischen
        </h1>
        <p className={'max-w-2xl text-lg leading-8 text-muted'}>
          Ein reduzierter Blog mit focus auf Typografie
        </p>
      </header>
      // test commen2t
      <section className={'grid gap-4 sm:grid-cols-2'}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              'rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-link'
            }
          >
            <span className={'text-base font-medium'}>{link.label}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
