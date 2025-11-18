'use client'

import { useState, useEffect } from 'react'
import PlaceBidModal from './PlaceBidModal'

interface Candidate {
  id: string
  full_name: string
  email: string
  location: string
  min_salary: number
  currency: string
  skills: string[]
  experience_years: number
  education: string
  bio: string
  profile_summary: string
  is_active: boolean
  allow_paid_trial: boolean
}

export default function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showBidModal, setShowBidModal] = useState(false)

  useEffect(() => {
    fetchCandidates()
  }, [])

  async function fetchCandidates() {
    try {
      const response = await fetch('/api/candidates')
      if (response.ok) {
        const data = await response.json()
        setCandidates(data)
      }
    } catch (error) {
      console.error('Failed to fetch candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  function openBidModal(candidate: Candidate) {
    setSelectedCandidate(candidate)
    setShowBidModal(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900" data-testid="candidate-list-title">
          Available Candidates ({candidates.length})
        </h2>
      </div>

      {candidates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500" data-testid="no-candidates">
          No candidates available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              data-testid={`candidate-card-${candidate.id}`}
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">{candidate.full_name}</h3>
                {candidate.location && (
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {candidate.location}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Minimum Salary</div>
                <div className="text-2xl font-bold text-indigo-600">
                  ${candidate.min_salary?.toLocaleString()}
                </div>
              </div>

              {candidate.skills && candidate.skills.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 5 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        +{candidate.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="text-sm text-gray-500">Experience</div>
                <div className="text-gray-900">{candidate.experience_years} years</div>
              </div>

              {candidate.profile_summary && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{candidate.profile_summary}</p>
                </div>
              )}

              {candidate.allow_paid_trial && (
                <div className="mb-4 flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Open to paid trial
                </div>
              )}

              <button
                onClick={() => openBidModal(candidate)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 font-semibold"
                data-testid={`place-bid-button-${candidate.id}`}
              >
                Place Bid
              </button>
            </div>
          ))}
        </div>
      )}

      {showBidModal && selectedCandidate && (
        <PlaceBidModal
          candidate={selectedCandidate}
          onClose={() => setShowBidModal(false)}
          onSuccess={() => {
            setShowBidModal(false)
            // Optionally refresh or show success message
          }}
        />
      )}
    </div>
  )
}
