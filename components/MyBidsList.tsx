'use client'

import { useState, useEffect } from 'react'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card'
import Badge from './ui/Badge'

interface Bid {
  id: string
  candidate: any
  salary_offer: number
  currency: string
  role_title: string
  status: string
  competitive_indicator?: 'highest' | 'competitive' | 'not_competitive'
  revision_count: number
  created_at: string
}

export default function MyBidsList() {
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBids()
  }, [])

  async function fetchBids() {
    try {
      const response = await fetch('/api/bids')
      if (response.ok) {
        const data = await response.json()
        setBids(data)
      }
    } catch (error) {
      console.error('Failed to fetch bids:', error)
    } finally {
      setLoading(false)
    }
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
      <div>
        <h2 className="text-2xl font-bold text-slate-900" data-testid="my-bids-title">
          Your Bids ({bids.length})
        </h2>
      </div>

      {bids.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500" data-testid="no-bids">
              You haven't placed any bids yet. Browse candidates to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <Card key={bid.id} data-testid={`my-bid-${bid.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{bid.candidate?.full_name}</CardTitle>
                      <Badge 
                        variant={
                          bid.status === 'pending' ? 'warning' :
                          bid.status === 'accepted' ? 'success' :
                          bid.status === 'rejected' ? 'danger' : 'secondary'
                        }
                        size="sm"
                      >
                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>{bid.role_title}</CardDescription>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    {new Date(bid.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Your Offer</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${bid.salary_offer?.toLocaleString()}
                    </div>
                  </div>

                  {bid.competitive_indicator && bid.status === 'pending' && (
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Status</div>
                      <Badge
                        variant={
                          bid.competitive_indicator === 'highest' ? 'success' :
                          bid.competitive_indicator === 'competitive' ? 'info' : 'warning'
                        }
                      >
                        {bid.competitive_indicator === 'highest' && '🏆 Highest Bid'}
                        {bid.competitive_indicator === 'competitive' && '✓ Competitive'}
                        {bid.competitive_indicator === 'not_competitive' && '⚠ Not Competitive'}
                      </Badge>
                    </div>
                  )}

                  <div>
                    <div className="text-sm text-slate-600 mb-1">Revisions</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {bid.revision_count}/3
                    </div>
                  </div>
                </div>

                {bid.competitive_indicator === 'not_competitive' && bid.status === 'pending' && (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                    <p className="text-sm text-orange-800 flex items-start">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>
                        <strong>Tip:</strong> Your bid is below the competitive range. Consider increasing your offer to improve your chances.
                      </span>
                    </p>
                  </div>
                )}

                {bid.status === 'accepted' && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-800 flex items-start">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>
                        <strong>🎉 Congratulations!</strong> {bid.candidate?.full_name} accepted your offer. Contact them at <strong>{bid.candidate?.email}</strong>
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
