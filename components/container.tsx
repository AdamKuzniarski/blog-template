import type { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={['mx-auto w-full max-w-4xl px-6 sm:px-8', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
