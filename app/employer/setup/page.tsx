// app/employer/setup/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import React from 'react';

export default async function EmployerSetupPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/auth/login');
  }

  // For now just show a simple form placeholder. You can expand this later.
  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
      <h1>Employer setup</h1>
      <p>Employer onboarding form goes here.</p>
    </div>
  );
}
