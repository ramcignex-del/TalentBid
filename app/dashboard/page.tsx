// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/auth/login');
  }

  const user = session.user;

  const { data: profile } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile) {
    redirect('/profile/setup');
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {profile.full_name ?? user.email}!</p>
      <div style={{ marginTop: 12 }}>
        <p><strong>Title:</strong> {profile.title}</p>
        <p><strong>Location:</strong> {profile.location}</p>
        <p><strong>Skills:</strong> {Array.isArray(profile.skills) ? profile.skills.join(', ') : ''}</p>
        <p><strong>Bio:</strong></p>
        <p>{profile.bio}</p>
      </div>
      <p style={{ marginTop: 12 }}>
        <a href="/profile/setup">Edit profile</a> · <a href="/auth/logout">Logout</a>
      </p>
    </div>
  );
}
