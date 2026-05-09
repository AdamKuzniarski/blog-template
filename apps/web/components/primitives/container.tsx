import type { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  size?: 'default' | 'narrow';
  className?: string;
};

const sizeClasses = {
  default: 'max-w-5xl',
  narrow: 'max-w-3xl',
};

export function Container({ children, size = 'default', className }: ContainerProps) {
  return (
    <div
      className={['mx-auto w-full px-6 sm:px-8', sizeClasses[size], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
