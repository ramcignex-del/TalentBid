import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CandidateDashboard from '@/components/CandidateDashboard'
import EmployerDashboard from '@/components/EmployerDashboard'
import { signout } from '../auth/actions'

export default async function DashboardPage() {
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
}
