'use client'

interface BidCardProps {
  bid: any
  onClick: () => void
}

export default function BidCard({ bid, onClick }: BidCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6"
      data-testid={`bid-card-${bid.id}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{bid.employer?.company_name || 'Company'}</h3>
          <p className="text-sm text-gray-600">{bid.role_title}</p>
        </div>
        {bid.match_score && (
          <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
            {bid.match_score}% Match
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-indigo-600">
          ${bid.salary_offer?.toLocaleString()}
          <span className="text-sm text-gray-500 font-normal">/{bid.currency}</span>
        </div>
      </div>

      {bid.perks && bid.perks.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {bid.perks.slice(0, 3).map((perk: string, index: number) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {perk}
              </span>
            ))}
            {bid.perks.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{bid.perks.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {bid.include_trial && (
        <div className="mb-4 flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {bid.trial_duration_days}-day paid trial available
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          bid.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : bid.status === 'accepted'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
        </span>
        <span className="text-sm text-gray-500">
          {new Date(bid.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}
