import './globals.css';

import type { Metadata } from 'next';
import { Alexandria } from 'next/font/google';

import Providers from '@/providers';

const font = Alexandria({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `Palate - Voice blogging, AI, fonts, and colors...or something`,
  description: 'Voice blogging with fonts and colors for each entry generated by AI, based on entry content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${font.className} font-bold`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
