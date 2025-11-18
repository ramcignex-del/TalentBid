'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { signout } from '@/app/auth/actions'

interface DashboardLayoutProps {
  children: ReactNode
  userEmail?: string
}

export default function DashboardLayout({ children, userEmail }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">TB</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">TalentBid</span>
            </Link>
            
            <div className="flex items-center gap-4">
              {userEmail && (
                <span className="text-sm text-slate-600 hidden sm:block">{userEmail}</span>
              )}
              <form action={signout}>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  data-testid="signout-button"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  )
}
