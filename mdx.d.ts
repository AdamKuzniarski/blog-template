declare module '*.mdx' {
  import type { ComponentType } from 'react';

  export const metedata: {
    title: string;
    description: string;
    publishedAt: string;
    readingTime: string;
    tags: string[];
  };

  const MDXComponent: ComponentType;
  export default MDXComponent;
}
