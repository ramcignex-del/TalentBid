'use client'

import { useState } from 'react'
import Modal, { ModalFooter } from './ui/Modal'
import Input from './ui/Input'
import Button from './ui/Button'

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
          companyName: 'Your Company',
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
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={`Place Bid for ${candidate.full_name}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6" data-testid="place-bid-modal">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-blue-900 mb-1">Candidate's Minimum Salary</div>
          <div className="text-2xl font-bold text-blue-600">${candidate.min_salary?.toLocaleString()}</div>
        </div>

        <Input
          label="Role Title"
          type="text"
          required
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
          placeholder="Senior Software Engineer"
          data-testid="role-title-input"
        />

        <Input
          label="Salary Offer (USD)"
          type="number"
          required
          value={salaryOffer}
          onChange={(e) => setSalaryOffer(e.target.value)}
          helperText={`Minimum: $${candidate.min_salary?.toLocaleString()}`}
          error={parseInt(salaryOffer) < candidate.min_salary ? `Must be at least $${candidate.min_salary.toLocaleString()}` : undefined}
          data-testid="salary-offer-input"
        />

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-slate-700">
              Role Description
            </label>
            <button
              type="button"
              onClick={generateRoleDescription}
              disabled={generatingDesc}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center"
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
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-base"
            data-testid="role-description-input"
          />
        </div>

        <Input
          label="Perks & Benefits"
          type="text"
          value={perks}
          onChange={(e) => setPerks(e.target.value)}
          placeholder="Health insurance, Remote work, Stock options"
          helperText="Comma-separated list"
          data-testid="perks-input"
        />

        {candidate.allow_paid_trial && (
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="include-trial"
                checked={includeTrial}
                onChange={(e) => setIncludeTrial(e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                data-testid="include-trial-checkbox"
              />
              <label htmlFor="include-trial" className="ml-2 text-sm font-semibold text-slate-700">
                Include Paid Trial Period
              </label>
            </div>
            {includeTrial && (
              <Input
                label="Trial Duration (days)"
                type="number"
                value={trialDays}
                onChange={(e) => setTrialDays(e.target.value)}
                helperText="7-90 days"
                data-testid="trial-days-input"
              />
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm" data-testid="modal-error">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-testid="modal-cancel-button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            data-testid="modal-submit-button"
          >
            {loading ? 'Placing Bid...' : 'Place Bid'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
