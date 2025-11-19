// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CandidateDashboard from '@/components/CandidateDashboard';
import EmployerDashboard from '@/components/EmployerDashboard';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/auth/login');
  }

  const user = session.user;
  const userRole = user.user_metadata?.role;

  // Check for candidate profile
  const { data: candidateProfile } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  // Check for employer profile
  const { data: employerProfile } = await supabase
    .from('employers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  // If no profile exists, redirect to setup
  if (!candidateProfile && !employerProfile) {
    if (userRole === 'employer') {
      redirect('/employer/setup');
    } else {
      redirect('/profile/setup');
    }
  }

  // Render appropriate dashboard
  if (candidateProfile) {
    return <CandidateDashboard />;
  }

  if (employerProfile) {
    return <EmployerDashboard />;
  }

  // Fallback
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Welcome to TalentBid</h1>
        <p className="text-slate-600 mb-6">Please complete your profile to get started.</p>
        <div className="space-x-4">
          <a
            href="/profile/setup"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            Complete Profile
          </a>
        </div>
      </div>
    </div>
  );
}
