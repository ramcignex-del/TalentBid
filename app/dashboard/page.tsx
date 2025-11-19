// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  // Get SSR session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    redirect('/auth/login');
  }

  const user = session.user;

  // Load candidate profile
  const { data: profile } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile) {
    // Redirect user to complete profile
    redirect('/profile/setup');
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {profile.full_name}!</p>

      <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #eee' }}>
        <h3>Your profile</h3>
        <p><strong>Title:</strong> {profile.title}</p>
        <p><strong>Location:</strong> {profile.location}</p>

        <p>
          <strong>Skills:</strong> {Array.isArray(profile.skills) ? profile.skills.join(', ') : ''}
        </p>

        <p><strong>Bio:</strong></p>
        <p>{profile.bio}</p>
      </div>

      <p style={{ marginTop: 20 }}>
        <a href="/profile/setup">Edit profile</a>
      </p>

      <p style={{ marginTop: 10 }}>
        <a href="/auth/logout">Logout</a>
      </p>
    </div>
  );
}
