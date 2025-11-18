'use client'

import { useState } from 'react'
import Card, { CardContent } from './ui/Card'
import CandidateList from './CandidateList'
import MyBidsList from './MyBidsList'

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState<'candidates' | 'bids'>('candidates')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2" data-testid="employer-dashboard-title">
          Employer Dashboard
        </h1>
        <p className="text-lg text-slate-600">Browse candidates and manage your bids</p>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <nav className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`flex-1 py-4 px-6 text-base font-semibold transition-colors ${
                activeTab === 'candidates'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              data-testid="tab-candidates"
            >
              Browse Candidates
            </button>
            <button
              onClick={() => setActiveTab('bids')}
              className={`flex-1 py-4 px-6 text-base font-semibold transition-colors ${
                activeTab === 'bids'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              data-testid="tab-my-bids"
            >
              My Bids
            </button>
          </nav>
        </CardContent>
      </Card>

      {/* Tab Content */}
      <div>
        {activeTab === 'candidates' ? <CandidateList /> : <MyBidsList />}
      </div>
    </div>
  )
}
