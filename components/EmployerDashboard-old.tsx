'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CandidateList from './CandidateList'
import MyBidsList from './MyBidsList'

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState<'candidates' | 'bids'>('candidates')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900" data-testid="employer-dashboard-title">Employer Dashboard</h1>
        <p className="mt-2 text-gray-600">Browse candidates and manage your bids</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'candidates'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            data-testid="tab-candidates"
          >
            Browse Candidates
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bids'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            data-testid="tab-my-bids"
          >
            My Bids
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'candidates' ? <CandidateList /> : <MyBidsList />}
      </div>
    </div>
  )
}
