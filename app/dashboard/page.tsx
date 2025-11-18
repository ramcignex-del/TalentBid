// app/dashboard/page.tsx
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';

// load the candidate/employer dashboard components (they exist under components/ui)
const CandidateDashboard = dynamic(() => import('../components/ui/CandidateDashboard').then(m => m.default), { ssr: false });
const EmployerDashboard = dynamic(() => import('../components/ui/EmployerDashboard').then(m => m.default), { ssr: false });

export default function DashboardPage() {
  // Simple heuristic: you can later replace with real auth-based role
  const roleFromCookie = typeof window === 'undefined' ? null : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="text-sm text-slate-500">Manage bids and offers</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* show both dashboards if they exist; components should handle empty states */}
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
