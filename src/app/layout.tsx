import { PropsWithChildren } from 'react';
import type { Viewport } from 'next';
import { Inter } from 'next/font/google';

import { cn, constructMetadata } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';

import 'react-loading-skeleton/dist/skeleton.css';
import 'simplebar-react/dist/simplebar.min.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: "swap" });

export const metadata = constructMetadata();

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body
          className={cn(
            'min-h-screen antialiased grainy',
            inter.className
          )}
        >
            <Toaster />
            <Navbar />
            {children}
        </body>
      </Providers>
    </html>
  );
}
