import type { ReactNode } from 'react';

type ProseProps = {
  children: ReactNode;
  className?: string;
};

export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={[
        'font-serif text-[1.0625rem] leading-8 text-text',
        '[&_a]:text-link',
        '[&_a]:underline',
        '[&_a]:underline-offset-4',
        '[&_blockquote]:border-l-2',
        '[&_blockquote]:border-border',
        '[&_blockquote]:pl-4',
        '[&_blockquote]:text-muted',
        '[&_h2]:mt-10',
        '[&_h2]:font-sans',
        '[&_h2]:text-2xl',
        '[&_h2]:font-semibold',
        '[&_h2]:tracking-tight',
        '[&_h3]:mt-8',
        '[&_h3]:font-sans',
        '[&_h3]:text-xl',
        '[&_h3]:font-semibold',
        '[&_p]:my-5',
        '[&_ul]:my-5',
        '[&_ul]:pl-6',
        '[&_li]:my-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
