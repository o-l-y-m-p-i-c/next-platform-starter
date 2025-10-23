import type { Metadata } from 'next';
import { Doto, Red_Hat_Mono } from 'next/font/google';
import '../src/assets/fonts/fonts.css';
import '../src/index.css';
import { Providers } from './providers';

const redHatMono = Red_Hat_Mono({
  subsets: ['latin'],
  variable: '--font-red-hat-mono',
  display: 'swap',
});

const doto = Doto({
  subsets: ['latin'],
  variable: '--font-doto',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TrenchSpy.ai - Spot the Most-Hyped Tokens Before Everyone Else',
  description:
    'Spot the Most-Hyped Tokens Before Everyone Else. AI-powered crypto analytics platform for tracking trending tokens, KOLs, and market sentiment',
  metadataBase: new URL('https://trenchspy.ai'),
  openGraph: {
    type: 'website',
    title: 'TrenchSpy.ai - Spot the Most-Hyped Tokens Before Everyone Else',
    description:
      'Spot the Most-Hyped Tokens Before Everyone Else. AI-powered crypto analytics platform for tracking trending tokens, KOLs, and market sentiment',
    images: [
      {
        url: 'https://trenchspy.ai/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Spot the Most-Hyped Tokens Before Everyone Else. AI-powered crypto analytics platform for tracking trending tokens, KOLs, and market sentiment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrenchSpy.ai - Spot the Most-Hyped Tokens Before Everyone Else',
    description:
      'Spot the Most-Hyped Tokens Before Everyone Else. AI-powered crypto analytics platform for tracking trending tokens, KOLs, and market sentiment',
    images: ['https://trenchspy.ai/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${redHatMono.variable} ${doto.variable}`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
