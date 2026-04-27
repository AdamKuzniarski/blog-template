type PageIntroProps = {
  title: string;
  description?: string;
  eyebrow?: string;
};

export function PageIntro({ title, eyebrow, description }: PageIntroProps) {
  return (
    <header className="border-b border-border pb-8">
      {eyebrow ? (
        <p className={'mb-3 text-sm uppercase tracking-[0.18em] text-muted'}>{eyebrow}</p>
      ) : null}

      <h1 className={'font-serif text-4xl leading-tight tracking-tight sm:text-5xl'}>{title}</h1>
      {description ? (
        <p className={'mt-4 max-w-2xl text-base leading-7 text-muted'}>{description}</p>
      ) : null}
    </header>
  );
}
