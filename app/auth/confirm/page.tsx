// app/auth/confirm/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '../../../lib/supabase/client';

export default function ConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const supabase = getBrowserSupabase();
      // If session exists, route based on role; otherwise send to login
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/auth/login');
        return;
      }

      const role = session.user.user_metadata?.role;
      if (role === 'employer') router.push('/employer/setup');
      else router.push('/profile/setup');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p>Confirming…</p>;
}
