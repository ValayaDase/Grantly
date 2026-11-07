import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const viewport: Viewport = {
  themeColor: '#5B4BDB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'GRANTLY — Unified Scholarship Discovery & Management Platform',
  description:
    'Explore scholarship records, review profile-based eligibility criteria, compare opportunities, and track application preparation in a browser-based demo.',
  keywords: [
    'scholarships',
    'Indian students',
    'NSP',
    'AICTE',
    'eligibility checker',
    'engineering scholarships',
    'fellowships',
    'education grant',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-[#F8F9FC] text-[#171B2D]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#5B4BDB] focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
