export default function BlogPage() {
  return (
    <main className={'mx-auto min-h-screen max-w-3xl px-6 py-16 sm:px-8'}>
      <header className={'border-b border-border pb-8'}>
        <h1 className={'font-serif text-4xl leading-tight tracking-tight sm:text-5xl'}>Blog</h1>
        <p className={'mt-4 max-w-2xl text-base leading-7 text-muted'}>
          Hier erscheinen veröffenlichte Texte. Erst aus MDX, später aus der Datenbank.
        </p>
      </header>

      <section className={'mt-10 rounded-2xl border border-border bg-surface px-6 py-8'}>
        <p className={'text-base leading-7 text-muted'}>Noch keine veröffenlichten Beiterge</p>
      </section>
    </main>
  );
}
