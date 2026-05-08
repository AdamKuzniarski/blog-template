import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif-4',
});

const themeScript = `
(function () {
  const storageKey = 'theme';
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(storageKey);

  const theme =
    savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system'
      ? savedTheme
      : 'system';

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);
})();
`;

export const metadata: Metadata = {
  title: 'Blog Platform',
  description: 'Simple blogging platform built with Next.js and TypeScript',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${inter.variable} ${sourceSerif4.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={'bg-page font-sans text-text antialiased'}>
        <SiteHeader />
        <div className="flex min-h-[calc(100vh-65px)] flex-col">
          <div className="flex-1">{children}</div>
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
