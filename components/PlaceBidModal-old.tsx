'use client'

import { useState } from 'react'

interface PlaceBidModalProps {
  candidate: any
  onClose: () => void
  onSuccess: () => void
}

export default function PlaceBidModal({ candidate, onClose, onSuccess }: PlaceBidModalProps) {
  const [salaryOffer, setSalaryOffer] = useState(candidate.min_salary?.toString() || '')
  const [roleTitle, setRoleTitle] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const [perks, setPerks] = useState('')
  const [includeTrial, setIncludeTrial] = useState(false)
  const [trialDays, setTrialDays] = useState('30')
  const [loading, setLoading] = useState(false)
  const [generatingDesc, setGeneratingDesc] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generateRoleDescription() {
    if (!roleTitle || !salaryOffer) {
      setError('Please enter role title and salary first')
      return
    }

    setGeneratingDesc(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate-role-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: roleTitle,
          salary: parseInt(salaryOffer),
          perks: perks.split(',').map(p => p.trim()).filter(Boolean),
          companyName: 'Your Company', // This should come from employer profile
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setRoleDescription(data.description)
      } else {
        setError('Failed to generate description')
      }
    } catch (err) {
      setError('Failed to generate description')
    } finally {
      setGeneratingDesc(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const salary = parseInt(salaryOffer)

    if (salary < candidate.min_salary) {
      setError(`Salary must be at least $${candidate.min_salary.toLocaleString()}`)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: candidate.id,
          salary_offer: salary,
          currency: 'USD',
          role_title: roleTitle,
          role_description: roleDescription,
          perks: perks.split(',').map(p => p.trim()).filter(Boolean),
          include_trial: includeTrial,
          trial_duration_days: includeTrial ? parseInt(trialDays) : undefined,
        }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to place bid')
      }
    } catch (err) {
      setError('Failed to place bid')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-testid="place-bid-modal">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900" data-testid="modal-title">Place Bid for {candidate.full_name}</h2>
              <p className="text-sm text-gray-600 mt-1">Minimum Salary: ${candidate.min_salary?.toLocaleString()}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              data-testid="modal-close-button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Title *
            </label>
            <input
              type="text"
              required
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="Senior Software Engineer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              data-testid="role-title-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Offer (USD) *
            </label>
            <input
              type="number"
              required
              value={salaryOffer}
              onChange={(e) => setSalaryOffer(e.target.value)}
              min={candidate.min_salary}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              data-testid="salary-offer-input"
            />
            {parseInt(salaryOffer) < candidate.min_salary && (
              <p className="text-sm text-red-600 mt-1">Must be at least ${candidate.min_salary.toLocaleString()}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Role Description
              </label>
              <button
                type="button"
                onClick={generateRoleDescription}
                disabled={generatingDesc}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                data-testid="generate-description-button"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {generatingDesc ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            <textarea
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              rows={6}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              data-testid="role-description-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Perks & Benefits (comma-separated)
            </label>
            <input
              type="text"
              value={perks}
              onChange={(e) => setPerks(e.target.value)}
              placeholder="Health insurance, Remote work, Stock options"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              data-testid="perks-input"
            />
          </div>

          {candidate.allow_paid_trial && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="include-trial"
                  checked={includeTrial}
                  onChange={(e) => setIncludeTrial(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  data-testid="include-trial-checkbox"
                />
                <label htmlFor="include-trial" className="ml-2 text-sm font-medium text-gray-700">
                  Include Paid Trial Period
                </label>
              </div>
              {includeTrial && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Trial Duration (days)</label>
                  <input
                    type="number"
                    value={trialDays}
                    onChange={(e) => setTrialDays(e.target.value)}
                    min="7"
                    max="90"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    data-testid="trial-days-input"
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm" data-testid="modal-error">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              data-testid="modal-cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-gray-400"
              data-testid="modal-submit-button"
            >
              {loading ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
