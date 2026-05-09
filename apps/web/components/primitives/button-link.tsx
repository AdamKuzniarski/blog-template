import Link from 'next/link';
import React from 'react';

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'subtle';
  className?: string;
};

const variantClasses = {
  primary: 'bg-text text-page hover:opacity-90',
  subtle: 'border border-border bg-surface text-text hover:border-link hover:text-link',
};

export function ButtonLink({ href, children, variant = 'subtle', className }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={[
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Link>
  );
}
