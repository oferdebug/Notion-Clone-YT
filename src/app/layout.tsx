/** @format */

import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/header';
import SideBar from '@/components/sideBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/Toaster';

export const metadata: Metadata = {
	title: 'Notion-Clone',
	description: 'A productivity app built with AI features',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <div className="flex min-h-screen">
              <SideBar />
              <div className="flex-1 p-4 bg-background overflow-y-auto scrollbar-hide">
                {children}
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}