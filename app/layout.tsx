import './globals.css';

import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';

import Providers from '@/providers';

const font = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `Palate - Voice blogging, AI, and colors...or something`,
  description:
    'Voice blogging with fonts and colors for each entry generated by AI, based on entry content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} font-bold`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
