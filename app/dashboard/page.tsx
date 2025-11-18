import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signout } from '../auth/actions'
import CandidateDashboard from '@/components/CandidateDashboard'
import EmployerDashboard from '@/components/EmployerDashboard'

export default async function DashboardPage() {
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                       process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
                       !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref')

  if (!isConfigured) {
    return (
      <div className="min-h-screen">
        <nav className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">TB</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">TalentBid</span>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-yellow-900 mb-4">Supabase Configuration Required</h3>
            <p className="text-yellow-800 mb-4">Follow the setup guide in SUPABASE_SETUP.md</p>
          </div>
        </div>
      </div>
    )
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/auth/login')
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      redirect('/auth/login')
    }

    if (profile.role === 'candidate') {
      const { data: candidate } = await supabase
        .from('candidates')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!candidate) {
        redirect(`/profile/setup?role=candidate&userId=${user.id}`)
      }
    } else if (profile.role === 'employer') {
      const { data: employer } = await supabase
        .from('employers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!employer) {
        redirect(`/profile/setup?role=employer&userId=${user.id}`)
      }
    }

    return (
      <div className="min-h-screen">
        {/* Navbar */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">TB</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">TalentBid</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 hidden sm:block">{user.email}</span>
                <form action={signout}>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
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
        <main className="max-w-7xl mx-auto px-6 py-10">
          {profile.role === 'candidate' ? (
            <CandidateDashboard />
          ) : (
            <EmployerDashboard />
          )}
        </main>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-2xl">
          <h3 className="text-xl font-semibold text-red-900 mb-3">Dashboard Error</h3>
          <p className="text-red-700">Unable to load dashboard. Check your Supabase configuration.</p>
        </div>
      </div>
    )
  }
}
