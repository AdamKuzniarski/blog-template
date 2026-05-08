import type { ReactNode } from 'react';

type SectionProps = {
  children: ReactNode;
  className?: string;
};

export function Section({ children, className }: SectionProps) {
  return (
    <section className={['py-16 sm:py-20', className].filter(Boolean).join(' ')}>
      {children}
    </section>
  );
}
