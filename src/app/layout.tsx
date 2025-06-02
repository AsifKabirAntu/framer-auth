'use client';

import { AuthProvider } from '@/components/auth/AuthProvider';
import { Navigation } from '@/components/Navigation';
import './globals.css';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {mounted && (
          <AuthProvider>
            <Navigation />
            <main>{children}</main>
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
