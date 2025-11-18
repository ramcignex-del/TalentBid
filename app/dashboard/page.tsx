'use client';

import CandidateDashboard from '../../components/CandidateDashboard';
import EmployerDashboard from '../../components/EmployerDashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="text-sm text-slate-500">Manage bids and offers</div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <CandidateDashboard />
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <EmployerDashboard />
        </div>
      </div>
    </div>
  );
}
