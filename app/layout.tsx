// app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'TalentBid',
  description: 'Private sealed-bid hiring marketplace',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="bg-white/90 backdrop-blur sticky top-0 z-40 border-b">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold">
                    TB
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-lg font-semibold">TalentBid</div>
                    <div className="text-xs text-slate-500">Private talent bidding</div>
                  </div>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/profile/setup" className="text-sm px-3 py-2 rounded-md hover:bg-slate-100">Profile</Link>
                <Link href="/dashboard" className="text-sm px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Dashboard</Link>
              </div>
            </nav>
          </div>
        </header>

        <main className="py-10">
          <div className="max-w-7xl mx-auto px-6">
            {children}
          </div>
        </main>

        <footer className="mt-12 border-t">
          <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-slate-500 flex justify-between">
            <div>© {new Date().getFullYear()} TalentBid</div>
            <div>Built for India — trial-friendly hiring</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
