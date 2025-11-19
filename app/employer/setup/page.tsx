// app/employer/setup/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';

export default async function EmployerSetupPage() {
  const supabase = createServerComponentClient({ cookies });

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
