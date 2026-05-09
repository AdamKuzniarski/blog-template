import type { ComponentType } from 'react';
import HelloWorld, { metadata as helloWorldMetadata } from './hello-world.mdx';
import SlowSoftware, { metadata as slowSoftwareMetadata } from './slow-software.mdx';

export type Post = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  Component: ComponentType;
};

const posts: Post[] = [
  {
    slug: 'warum-dieser-blog-schlicht-startet',
    Component: HelloWorld,
    ...helloWorldMetadata,
  },
  {
    slug: 'gute-software-fuehlt-sich-oft-unspektakulaer-an',
    Component: SlowSoftware,
    ...slowSoftwareMetadata,
  },
].sort((a, b) => {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
});

export function getAllPosts() {
  return [...posts];
}

export function getPostsBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}
