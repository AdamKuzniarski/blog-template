import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href = '', children, ...props }) => {
      if (typeof href === 'string' && href.startsWith('/')) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        );
      }

      return (
        <a href={href} target="_blank" rel="noreferrer" {...props}>
          {children}
        </a>
      );
    },
    ...components,
  };
}
