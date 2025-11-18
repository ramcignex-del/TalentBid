'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface NavbarProps {
  children?: ReactNode
  transparent?: boolean
}

export default function Navbar({ children, transparent = false }: NavbarProps) {
  return (
    <nav className={`${transparent ? 'bg-transparent' : 'bg-white shadow-sm'} border-b border-slate-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">TB</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">TalentBid</span>
          </Link>
          
          {children}
        </div>
      </div>
    </nav>
  )
}
