'use client'

interface BidDetailModalProps {
  bid: any
  onClose: () => void
  onAccept: (bidId: string) => void
  onReject: (bidId: string) => void
}

export default function BidDetailModal({ bid, onClose, onAccept, onReject }: BidDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-testid="bid-detail-modal">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900" data-testid="modal-company-name">{bid.employer?.company_name}</h2>
              <p className="text-lg text-gray-600 mt-1">{bid.role_title}</p>
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Salary */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Salary Offer</h3>
            <div className="text-4xl font-bold text-indigo-600">
              ${bid.salary_offer?.toLocaleString()}
              <span className="text-lg text-gray-500 font-normal ml-2">{bid.currency}/year</span>
            </div>
          </div>

          {/* Match Score */}
          {bid.match_score && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Match Score</h3>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-indigo-600 h-4 rounded-full transition-all"
                    style={{ width: `${bid.match_score}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-lg font-semibold text-indigo-600">{bid.match_score}%</span>
              </div>
            </div>
          )}

          {/* Role Description */}
          {bid.role_description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Role Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{bid.role_description}</p>
            </div>
          )}

          {/* Perks */}
          {bid.perks && bid.perks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Perks & Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {bid.perks.map((perk: string, index: number) => (
                  <span
                    key={index}
                    className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    {perk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trial Period */}
          {bid.include_trial && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-900">Paid Trial Period</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    This employer offers a {bid.trial_duration_days}-day paid trial period to ensure a good fit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Company Info */}
          {bid.employer && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">About the Company</h3>
              <div className="space-y-2 text-sm text-gray-700">
                {bid.employer.location && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {bid.employer.location}
                  </div>
                )}
                {bid.employer.company_size && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {bid.employer.company_size} employees
                  </div>
                )}
                {bid.employer.industry && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {bid.employer.industry}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {bid.status === 'pending' && (
          <div className="p-6 border-t border-gray-200 flex gap-4">
            <button
              onClick={() => onReject(bid.id)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              data-testid="modal-reject-button"
            >
              Reject
            </button>
            <button
              onClick={() => onAccept(bid.id)}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
              data-testid="modal-accept-button"
            >
              Accept Offer
            </button>
          </div>
        )}

        {bid.status === 'accepted' && (
          <div className="p-6 border-t border-gray-200 bg-green-50">
            <div className="flex items-center justify-center text-green-700 font-semibold">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You accepted this offer
            </div>
          </div>
        )}

        {bid.status === 'rejected' && (
          <div className="p-6 border-t border-gray-200 bg-red-50">
            <div className="flex items-center justify-center text-red-700 font-semibold">
              You rejected this offer
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
