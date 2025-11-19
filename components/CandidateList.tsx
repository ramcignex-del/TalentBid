'use client'

import { useState, useEffect } from 'react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900" data-testid="candidate-list-title">
          Available Candidates ({candidates.length})
        </h2>
      </div>

      {candidates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-slate-500" data-testid="no-candidates">No candidates available at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <Card key={candidate.id} data-testid={`candidate-card-${candidate.id}`}>
              <CardHeader>
                <CardTitle className="text-xl">{candidate.full_name}</CardTitle>
                {candidate.location && (
                  <CardDescription className="flex items-center mt-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {candidate.location}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Minimum Salary</div>
                  <div className="text-3xl font-bold text-blue-600">
                    ${candidate.min_salary?.toLocaleString()}
                    <span className="text-base text-slate-500 font-normal ml-2">/year</span>
                  </div>
                </div>

                {candidate.skills && candidate.skills.length > 0 && (
                  <div>
                    <div className="text-sm text-slate-600 mb-2">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 5).map((skill, index) => (
                        <Badge key={index} variant="secondary" size="sm">{skill}</Badge>
                      ))}
                      {candidate.skills.length > 5 && (
                        <Badge variant="secondary" size="sm">+{candidate.skills.length - 5}</Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-sm">
                    <span className="text-slate-600">Experience:</span>
                    <span className="font-semibold text-slate-900 ml-2">{candidate.experience_years} years</span>
                  </div>
                  {candidate.allow_paid_trial && (
                    <Badge variant="success" size="sm">Trial Available</Badge>
                  )}
                </div>

                {candidate.profile_summary && (
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{candidate.profile_summary}</p>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => openBidModal(candidate)}
                  fullWidth
                  data-testid={`place-bid-button-${candidate.id}`}
                >
                  Place Bid
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {showBidModal && selectedCandidate && (
        <PlaceBidModal
          candidate={selectedCandidate}
          onClose={() => setShowBidModal(false)}
          onSuccess={() => {
            setShowBidModal(false)
          }}
        />
      )}
    </div>
  )
}
