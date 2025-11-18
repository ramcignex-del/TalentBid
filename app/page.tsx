import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-indigo-600">TalentBid</h1>
            </div>
            <div className="flex gap-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                data-testid="nav-login-link"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                data-testid="nav-signup-link"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl" data-testid="hero-title">
            Revolutionize Your
            <span className="text-indigo-600"> Hiring Process</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto" data-testid="hero-subtitle">
            TalentBid is the innovative hiring marketplace where talent sets their minimum salary
            and employers compete with sealed bids. Fair, transparent, and efficient.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/auth/signup?role=candidate"
              className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 shadow-lg"
              data-testid="hero-candidate-cta"
            >
              I'm Looking for Opportunities
            </Link>
            <Link
              href="/auth/signup?role=employer"
              className="px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:bg-gray-50 border-2 border-indigo-600 shadow-lg"
              data-testid="hero-employer-cta"
            >
              I'm Hiring Talent
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg" data-testid="feature-sealed-bids">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sealed Bidding</h3>
            <p className="text-gray-600">
              Employers place private bids. You see all offers, they only see competitive indicators.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg" data-testid="feature-salary-control">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">You Set the Price</h3>
            <p className="text-gray-600">
              List your minimum salary. Only receive bids that meet your expectations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg" data-testid="feature-ai-matching">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Matching</h3>
            <p className="text-gray-600">
              Smart algorithms match candidates with roles based on skills, experience, and preferences.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16" data-testid="how-it-works-title">
            How TalentBid Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* For Candidates */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-600">For Candidates</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Create Your Profile</h4>
                    <p className="text-gray-600">Set your minimum salary and showcase your skills</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Receive Bids</h4>
                    <p className="text-gray-600">Employers compete for your talent with sealed bids</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Choose Your Offer</h4>
                    <p className="text-gray-600">Review all bids and accept the best opportunity</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Employers */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-600">For Employers</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Browse Talent</h4>
                    <p className="text-gray-600">Discover qualified candidates actively seeking opportunities</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Place Your Bid</h4>
                    <p className="text-gray-600">Submit competitive offers with role details and perks</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Get Hired</h4>
                    <p className="text-gray-600">Receive notifications when candidates accept your offer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 bg-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4" data-testid="cta-title">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of professionals finding better opportunities</p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:bg-gray-100 shadow-lg"
            data-testid="cta-signup-button"
          >
            Create Your Free Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 TalentBid. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
