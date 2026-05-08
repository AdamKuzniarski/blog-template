declare module '*.mdx' {
  import type { ComponentType } from 'react';

  export const metadata: {
    title: string;
    description: string;
    publishedAt: string;
    readingTime: string;
    tags: string[];
  };

  const MDXComponent: ComponentType;
  export default MDXComponent;
}
