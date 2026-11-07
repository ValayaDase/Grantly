import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'GRANTLY — Unified Scholarship Discovery & Management Platform',
  description:
    'Discover scholarships that match your ambitions. Smart eligibility checker, deadline intelligence, application tracker, and secure document vault for Indian students.',
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
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[#F8F9FC] text-[#171B2D]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
