import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SEO Sleuth',
  description: 'An SEO analysis website',
  author: 'Hugo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <footer className="absolute bottom-0 left-0 w-full bg-background text-foreground p-2 text-center text-xs">
          © 2025 Hugo. All rights reserved. | Built with Next.js | Hosted on Vercel
        </footer>
      </body>
    </html>
  );
}
