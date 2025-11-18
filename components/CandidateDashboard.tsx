'use client'

import { useState, useEffect } from 'react'
import BidCard from './BidCard'
import BidDetailModal from './BidDetailModal'

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
        // Refresh bids
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
        // Refresh bids
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
  const rejectedBids = bids.filter(b => b.status === 'rejected')

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900" data-testid="candidate-dashboard-title">Your Bids</h1>
        <p className="mt-2 text-gray-600">Review and respond to employer offers</p>
      </div>

      {/* Pending Bids */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="pending-bids-section">Pending Bids ({pendingBids.length})</h2>
        {pendingBids.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500" data-testid="no-pending-bids">
            No pending bids yet. Keep your profile active to receive offers!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingBids.map((bid) => (
              <BidCard
                key={bid.id}
                bid={bid}
                onClick={() => openBidModal(bid)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Accepted Bids */}
      {acceptedBids.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="accepted-bids-section">Accepted Bids</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedBids.map((bid) => (
              <BidCard
                key={bid.id}
                bid={bid}
                onClick={() => openBidModal(bid)}
              />
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
