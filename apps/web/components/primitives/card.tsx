import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={['rounded-2xl border border-border bg-surface px-6 py-6', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
