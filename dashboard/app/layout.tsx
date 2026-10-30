import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { Suspense } from 'react';
import { TopLoader } from '@/components/top-loader';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: 'QA Test Automation and Monitoring',
  description: 'Playwright runs, test catalog, schedules and environments for the Musticker E2E suite.'
};

// Applies the saved theme before first paint so a light-mode viewer never sees a dark flash.
const themeScript = `try{var t=localStorage.getItem('qa-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        {/* useSearchParams needs a Suspense boundary. */}
        <Suspense fallback={null}>
          <TopLoader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
