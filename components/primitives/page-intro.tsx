import { act, ReactNode } from 'react';

type PageIntroProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
};

export function PageIntro({ title, description, eyebrow, actions }: PageIntroProps) {
  return (
    <header className={'border-b border-border pb-8'}>
      <div className={'flex flex-col gap-6 sm:flex-row sm: items-end sm:justify-between'}>
        <h1 className={'font-serif text-4xl leading-tight tracking-tight sm:text-5xl'}>{title}</h1>
        {description ? (
          <p className={'mt-4 text-base leading-7 text-muted'}>{description}</p>
        ) : null}
        <div className={'max-w-2xl'}>
          {eyebrow ? (
            <p className={'mb-3 text-m uppercase tracking-[0.18em text-muted'}>{eyebrow}</p>
          ) : null}
        </div>

        {actions ? <div className={'shrink-0'}>{actions}</div> : null}
      </div>
    </header>
  );
}
