import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Button from '@/components/ui/Button'

export default async function Home() {
  try {
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref')

    if (isConfigured) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        redirect('/dashboard')
      }
    }
  } catch (error) {
    console.error('Home page auth check error:', error)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <Navbar>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="primary" size="sm">Sign Up</Button>
          </Link>
        </div>
      </Navbar>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Revolutionize Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Hiring Process
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              TalentBid is the innovative hiring marketplace where talent sets their minimum salary
              and employers compete with sealed bids. Fair, transparent, and efficient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup?role=candidate">
                <Button size="lg" className="shadow-lg">
                  I'm Looking for Opportunities
                </Button>
              </Link>
              <Link href="/auth/signup?role=employer">
                <Button variant="outline" size="lg" className="shadow-lg">
                  I'm Hiring Talent
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Why Choose TalentBid?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A smarter way to connect talent with opportunity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Sealed Bidding</h3>
            <p className="text-slate-600 leading-relaxed">
              Employers place private bids. You see all offers, they only see competitive indicators. Complete transparency for candidates.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">You Set the Price</h3>
            <p className="text-slate-600 leading-relaxed">
              List your minimum salary expectations. Only receive bids that meet your requirements. No more wasting time on lowball offers.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">AI-Powered Matching</h3>
            <p className="text-slate-600 leading-relaxed">
              Smart algorithms match candidates with roles based on skills, experience, and preferences. Find your perfect fit faster.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How TalentBid Works
            </h2>
            <p className="text-lg text-slate-600">
              Simple, transparent, and effective
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* For Candidates */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-blue-600 mb-8">For Candidates</h3>
              
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">1</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Create Your Profile</h4>
                  <p className="text-slate-600 leading-relaxed">Set your minimum salary and showcase your skills, experience, and achievements.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">2</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Receive Bids</h4>
                  <p className="text-slate-600 leading-relaxed">Employers compete for your talent with sealed bids. See all offers in one place.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">3</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Choose Your Offer</h4>
                  <p className="text-slate-600 leading-relaxed">Review all bids, compare offers, and accept the best opportunity for your career.</p>
                </div>
              </div>
            </div>

            {/* For Employers */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-blue-600 mb-8">For Employers</h3>
              
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">1</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Browse Talent</h4>
                  <p className="text-slate-600 leading-relaxed">Discover qualified candidates who are actively seeking new opportunities.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">2</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Place Your Bid</h4>
                  <p className="text-slate-600 leading-relaxed">Submit competitive offers with detailed role information, perks, and benefits.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">3</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Get Hired</h4>
                  <p className="text-slate-600 leading-relaxed">Receive notifications when candidates accept your offer and start the onboarding process.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl shadow-2xl p-12 lg:p-16 text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals finding better opportunities through TalentBid
          </p>
          <Link href="/auth/signup">
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-slate-50 shadow-xl">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">&copy; 2025 TalentBid. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
