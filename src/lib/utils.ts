import { type ClassValue, clsx } from 'clsx';
import { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getAbsoluteUrl = (path: string) => {
  if (typeof window !== 'undefined') {
    return path;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}`;
  }

  return `https://localhost:${process.env.PORT ?? 3000}`;
};

export function constructMetadata({
  title = 'Dododocs - the SaaS for students',
  description = 'Dododocs is an open-source software to make chatting to your PDF files easy.',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    icons,
    metadataBase: new URL('https://dododocs.vercel.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
