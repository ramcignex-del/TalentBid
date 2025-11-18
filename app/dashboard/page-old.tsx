import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CandidateDashboard from '@/components/CandidateDashboard'
import EmployerDashboard from '@/components/EmployerDashboard'
import { signout } from '../auth/actions'

export default async function DashboardPage() {
  // Check if Supabase is configured
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                       process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
                       !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref')

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">TalentBid</h1>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Supabase Configuration Required</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>To use this dashboard, you need to configure Supabase:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Follow the setup guide in <code className="bg-yellow-100 px-2 py-1 rounded">SUPABASE_SETUP.md</code></li>
                    <li>Create a Supabase project at <a href="https://database.new" target="_blank" className="underline">database.new</a></li>
                    <li>Add your credentials to <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code></li>
                    <li>Restart the development server</li>
                  </ol>
                </div>
              </div>
            </div>
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

    // Get user profile to determine role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      redirect('/auth/login')
    }

    // Check if user has completed their profile
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
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">TalentBid</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-700">{user.email}</span>
                <form action={signout}>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    data-testid="signout-button"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {profile.role === 'candidate' ? (
            <CandidateDashboard />
          ) : (
            <EmployerDashboard />
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <h3 className="text-red-800 font-semibold mb-2">Dashboard Error</h3>
          <p className="text-red-700 text-sm">
            Unable to load dashboard. Please check your Supabase configuration and try again.
          </p>
        </div>
      </div>
    )
  }
}
