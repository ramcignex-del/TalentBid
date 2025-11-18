'use client'

import { useState, useEffect } from 'react'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'
import BidDetailModal from './BidDetailModal-new'

interface Bid {
  id: string
  employer: any
  candidate: any
  salary_offer: number
  currency: string
  role_title: string
  role_description: string
  perks: string[]
  include_trial: boolean
  trial_duration_days?: number
  status: string
  match_score: number
  created_at: string
}

export default function CandidateDashboard() {
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const [showModal, setShowModal] = useState(false)

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

  async function handleAcceptBid(bidId: string) {
    try {
      const response = await fetch(`/api/bids/${bidId}/accept`, {
        method: 'POST',
      })

      if (response.ok) {
        await fetchBids()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Failed to accept bid:', error)
    }
  }

  async function handleRejectBid(bidId: string) {
    try {
      const response = await fetch(`/api/bids/${bidId}/reject`, {
        method: 'POST',
      })

      if (response.ok) {
        await fetchBids()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Failed to reject bid:', error)
    }
  }

  function openBidModal(bid: Bid) {
    setSelectedBid(bid)
    setShowModal(true)
  }

  const pendingBids = bids.filter(b => b.status === 'pending')
  const acceptedBids = bids.filter(b => b.status === 'accepted')

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2" data-testid="candidate-dashboard-title">Your Bids</h1>
        <p className="text-lg text-slate-600">Review and respond to employer offers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{pendingBids.length}</div>
              <div className="text-sm text-slate-600 font-medium">Pending Bids</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{acceptedBids.length}</div>
              <div className="text-sm text-slate-600 font-medium">Accepted Offers</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">{bids.length}</div>
              <div className="text-sm text-slate-600 font-medium">Total Bids</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Bids */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6" data-testid="pending-bids-section">
          Pending Bids ({pendingBids.length})
        </h2>
        {pendingBids.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-slate-500" data-testid="no-pending-bids">No pending bids yet. Keep your profile active to receive offers!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingBids.map((bid) => (
              <Card key={bid.id} hover onClick={() => openBidModal(bid)} data-testid={`bid-card-${bid.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{bid.employer?.company_name || 'Company'}</CardTitle>
                    {bid.match_score && (
                      <Badge variant="primary" size="sm">{bid.match_score}% Match</Badge>
                    )}
                  </div>
                  <CardDescription>{bid.role_title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      ${bid.salary_offer?.toLocaleString()}
                      <span className="text-base text-slate-500 font-normal ml-2">/year</span>
                    </div>
                  </div>

                  {bid.perks && bid.perks.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {bid.perks.slice(0, 3).map((perk, index) => (
                        <Badge key={index} variant="secondary" size="sm">{perk}</Badge>
                      ))}
                      {bid.perks.length > 3 && (
                        <Badge variant="secondary" size="sm">+{bid.perks.length - 3} more</Badge>
                      )}
                    </div>
                  )}

                  {bid.include_trial && (
                    <div className="flex items-center text-sm text-blue-600 font-medium">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {bid.trial_duration_days}-day paid trial
                    </div>
                  )}

                  <div className="text-sm text-slate-500 pt-2 border-t border-slate-100">
                    {new Date(bid.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Accepted Bids */}
      {acceptedBids.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6" data-testid="accepted-bids-section">
            Accepted Offers
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {acceptedBids.map((bid) => (
              <Card key={bid.id} onClick={() => openBidModal(bid)} hover>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{bid.employer?.company_name}</CardTitle>
                    <Badge variant="success" size="sm">Accepted</Badge>
                  </div>
                  <CardDescription>{bid.role_title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">
                    ${bid.salary_offer?.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bid Detail Modal */}
      {showModal && selectedBid && (
        <BidDetailModal
          bid={selectedBid}
          onClose={() => setShowModal(false)}
          onAccept={handleAcceptBid}
          onReject={handleRejectBid}
        />
      )}
    </div>
  )
}
