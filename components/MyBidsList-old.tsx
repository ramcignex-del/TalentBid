'use client'

import { useState, useEffect } from 'react'

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900" data-testid="my-bids-title">Your Bids ({bids.length})</h2>
      </div>

      {bids.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500" data-testid="no-bids">
          You haven't placed any bids yet. Browse candidates to get started!
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="bg-white rounded-lg shadow p-6"
              data-testid={`my-bid-${bid.id}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{bid.candidate?.full_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      bid.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : bid.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : bid.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{bid.role_title}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-500">Your Offer:</span>
                      <span className="ml-2 font-semibold text-indigo-600">${bid.salary_offer?.toLocaleString()}</span>
                    </div>
                    {bid.competitive_indicator && bid.status === 'pending' && (
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`ml-2 font-semibold ${
                          bid.competitive_indicator === 'highest'
                            ? 'text-green-600'
                            : bid.competitive_indicator === 'competitive'
                            ? 'text-blue-600'
                            : 'text-orange-600'
                        }`}>
                          {bid.competitive_indicator === 'highest' && '🏆 Highest Bid'}
                          {bid.competitive_indicator === 'competitive' && '✓ Competitive'}
                          {bid.competitive_indicator === 'not_competitive' && '⚠ Not Competitive'}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Revisions:</span>
                      <span className="ml-2 font-semibold">{bid.revision_count}/3</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(bid.created_at).toLocaleDateString()}
                  </div>
                  {bid.status === 'pending' && bid.revision_count < 3 && (
                    <button
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      data-testid={`revise-bid-${bid.id}`}
                    >
                      Revise Bid
                    </button>
                  )}
                </div>
              </div>

              {bid.competitive_indicator === 'not_competitive' && bid.status === 'pending' && (
                <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
                  <p className="font-medium">💡 Tip: Your bid is below the competitive range. Consider increasing your offer to improve your chances.</p>
                </div>
              )}

              {bid.status === 'accepted' && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                  <p className="font-medium">🎉 Congratulations! {bid.candidate?.full_name} accepted your offer. Contact them at {bid.candidate?.email}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
