import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CandidateDashboard from '@/components/CandidateDashboard'
import EmployerDashboard from '@/components/EmployerDashboard'
import DashboardLayout from '@/components/layouts/DashboardLayout'

export default async function DashboardPage() {
  // Check if Supabase is configured
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                       process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
                       !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref')

  if (!isConfigured) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-600 mt-1 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-yellow-900 mb-3">Supabase Configuration Required</h3>
                <p className="text-yellow-800 mb-4 leading-relaxed">
                  To use this dashboard, you need to configure Supabase:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-yellow-800">
                  <li>Follow the setup guide in <code className="bg-yellow-100 px-2 py-1 rounded font-mono text-sm">SUPABASE_SETUP.md</code></li>
                  <li>Create a Supabase project at <a href="https://database.new" target="_blank" className="underline font-semibold">database.new</a></li>
                  <li>Add your credentials to <code className="bg-yellow-100 px-2 py-1 rounded font-mono text-sm">.env.local</code></li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
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
      <DashboardLayout userEmail={user.email}>
        {profile.role === 'candidate' ? (
          <CandidateDashboard />
        ) : (
          <EmployerDashboard />
        )}
      </DashboardLayout>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-red-900 mb-3">Dashboard Error</h3>
            <p className="text-red-700">
              Unable to load dashboard. Please check your Supabase configuration and try again.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }
}
