import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif-4',
});

export const metadata: Metadata = {
  title: 'Blog Platform',
  description: 'Simple blogging platform built with Next.js and TypeScript',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${inter.variable} ${sourceSerif4.variable}`}>
      <body>{children}</body>
    </html>
  );
}
