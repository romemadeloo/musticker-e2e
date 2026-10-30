import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Musticker QA Dashboard',
  description: 'Playwright runs, test catalog, schedules and environments for the Musticker E2E suite.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
