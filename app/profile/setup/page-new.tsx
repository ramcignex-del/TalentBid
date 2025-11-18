'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

function ProfileSetupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') as 'candidate' | 'employer' | null

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Candidate fields
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [minSalary, setMinSalary] = useState('')
  const [skills, setSkills] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [education, setEducation] = useState('')
  const [bio, setBio] = useState('')

  // Employer fields
  const [companyName, setCompanyName] = useState('')
  const [website, setWebsite] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [industry, setIndustry] = useState('')
  const [description, setDescription] = useState('')

  const [email, setEmail] = useState('')

  useEffect(() => {
    async function getUserEmail() {
      const response = await fetch('/api/auth/user')
      if (response.ok) {
        const data = await response.json()
        setEmail(data.email || '')
      }
    }
    getUserEmail()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (role === 'candidate') {
        const response = await fetch('/api/candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName,
            email,
            phone,
            location,
            min_salary: parseInt(minSalary),
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            experience_years: parseInt(experienceYears) || 0,
            education,
            bio,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to create profile')
        }
      } else if (role === 'employer') {
        const response = await fetch('/api/employers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_name: companyName,
            email,
            phone,
            website,
            location,
            company_size: companySize,
            industry,
            description,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to create profile')
        }
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <p className="text-slate-600">Invalid role parameter</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Complete Your Profile</CardTitle>
            <CardDescription className="text-base">
              {role === 'candidate'
                ? 'Tell us about your skills and experience'
                : 'Tell us about your company'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {role === 'candidate' ? (
                <>
                  <Input
                    label="Full Name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    data-testid="candidate-fullname-input"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      data-testid="candidate-phone-input"
                    />

                    <Input
                      label="Location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                      data-testid="candidate-location-input"
                    />
                  </div>

                  <Input
                    label="Minimum Salary (USD)"
                    type="number"
                    required
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    placeholder="80000"
                    helperText="Your expected minimum annual salary"
                    data-testid="candidate-minsalary-input"
                  />

                  <Input
                    label="Skills"
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="JavaScript, React, Node.js"
                    helperText="Comma-separated list of your key skills"
                    data-testid="candidate-skills-input"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Years of Experience"
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      placeholder="5"
                      data-testid="candidate-experience-input"
                    />

                    <Input
                      label="Education"
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="Bachelor's in Computer Science"
                      data-testid="candidate-education-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      placeholder="Tell employers about yourself..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-base"
                      data-testid="candidate-bio-input"
                    />
                  </div>
                </>
              ) : (
                <>
                  <Input
                    label="Company Name"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    data-testid="employer-company-input"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      data-testid="employer-phone-input"
                    />

                    <Input
                      label="Website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                      data-testid="employer-website-input"
                    />
                  </div>

                  <Input
                    label="Location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    data-testid="employer-location-input"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Company Size
                      </label>
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-base"
                        data-testid="employer-size-select"
                      >
                        <option value="">Select...</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    </div>

                    <Input
                      label="Industry"
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="Technology, Healthcare, etc."
                      data-testid="employer-industry-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Company Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Tell candidates about your company..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-base"
                      data-testid="employer-description-input"
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm" data-testid="profile-setup-error">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                fullWidth
                size="lg"
                data-testid="profile-setup-submit"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProfileSetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <ProfileSetupContent />
    </Suspense>
  )
}
