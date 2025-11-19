// app/profile/setup/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ProfileForm from '../../../components/ProfileForm';

export default async function ProfileSetupPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/auth/login');
  }

  const user = session.user;

  // Fetch profile
  const { data: profile } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
      <h1>Profile Setup</h1>
      <ProfileForm initialProfile={profile} />
    </div>
  );
}
