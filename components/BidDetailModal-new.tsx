'use client'

import Modal, { ModalFooter } from './ui/Modal'
import Badge from './ui/Badge'
import Button from './ui/Button'

interface BidDetailModalProps {
  bid: any
  onClose: () => void
  onAccept: (bidId: string) => void
  onReject: (bidId: string) => void
}

export default function BidDetailModal({ bid, onClose, onAccept, onReject }: BidDetailModalProps) {
  return (
    <Modal isOpen={true} onClose={onClose} title={bid.employer?.company_name} size="lg">
      <div className="space-y-6" data-testid="bid-detail-modal">
        {/* Role Title */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{bid.role_title}</h3>
          {bid.employer?.location && (
            <p className="text-slate-600 flex items-center mt-2">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {bid.employer.location}
            </p>
          )}
        </div>

        {/* Salary */}
        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
          <div className="text-sm font-semibold text-blue-600 mb-2">Salary Offer</div>
          <div className="text-4xl font-bold text-blue-600">
            ${bid.salary_offer?.toLocaleString()}
            <span className="text-lg text-slate-600 font-normal ml-2">{bid.currency}/year</span>
          </div>
        </div>

        {/* Match Score */}
        {bid.match_score && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Match Score</span>
              <span className="text-lg font-bold text-blue-600">{bid.match_score}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${bid.match_score}%` }}
              />
            </div>
          </div>
        )}

        {/* Role Description */}
        {bid.role_description && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Role Description</h4>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{bid.role_description}</p>
          </div>
        )}

        {/* Perks */}
        {bid.perks && bid.perks.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Perks & Benefits</h4>
            <div className="flex flex-wrap gap-2">
              {bid.perks.map((perk: string, index: number) => (
                <Badge key={index} variant="primary" size="md">{perk}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Trial Period */}
        {bid.include_trial && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Paid Trial Period</h4>
                <p className="text-sm text-blue-700">
                  This employer offers a {bid.trial_duration_days}-day paid trial period to ensure a good fit for both parties.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Company Info */}
        {bid.employer && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">About the Company</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              {bid.employer.company_size && (
                <div className="flex items-center text-sm text-slate-700">
                  <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium">{bid.employer.company_size} employees</span>
                </div>
              )}
              {bid.employer.industry && (
                <div className="flex items-center text-sm text-slate-700">
                  <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{bid.employer.industry}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {bid.status === 'pending' && (
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => onReject(bid.id)}
              data-testid="modal-reject-button"
            >
              Reject
            </Button>
            <Button
              variant="primary"
              onClick={() => onAccept(bid.id)}
              data-testid="modal-accept-button"
            >
              Accept Offer
            </Button>
          </ModalFooter>
        )}

        {bid.status === 'accepted' && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-center text-green-700 font-semibold">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You accepted this offer
            </div>
          </div>
        )}

        {bid.status === 'rejected' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-center text-red-700 font-semibold">
              You rejected this offer
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
