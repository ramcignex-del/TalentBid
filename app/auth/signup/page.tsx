'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signup } from '../actions'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'candidate' | 'employer'>(roleParam === 'employer' ? 'employer' : 'candidate')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (roleParam === 'employer' || roleParam === 'candidate') {
      setRole(roleParam)
    }
  }, [roleParam])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    const result = await signup({ email, password, role })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      // Redirect to profile setup after 2 seconds
      setTimeout(() => {
        router.push(`/profile/setup?role=${role}&userId=${result.userId}`)
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2" data-testid="signup-success-title">Account Created!</h2>
          <p className="text-gray-600">Redirecting you to complete your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-indigo-600">
            TalentBid
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900" data-testid="signup-title">Create Account</h2>
          <p className="mt-2 text-gray-600">Join TalentBid today</p>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                role === 'candidate'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              data-testid="signup-role-candidate"
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                role === 'employer'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              data-testid="signup-role-employer"
            >
              Employer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="you@example.com"
              data-testid="signup-email-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              data-testid="signup-password-input"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              data-testid="signup-confirm-password-input"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm" data-testid="signup-error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            data-testid="signup-submit-button"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold" data-testid="signup-login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
