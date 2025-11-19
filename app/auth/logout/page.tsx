// app/auth/logout/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getBrowserSupabase } from '../../../lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const supabase = getBrowserSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
        // redirect to login after successful sign out
        router.replace('/auth/login');
      } catch (err: any) {
        setErrorMsg(err?.message ?? 'Unknown error');
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 640, margin: '3rem auto', padding: '1rem' }}>
      <h1>Signing out…</h1>
      {loading && <p>Please wait — signing you out.</p>}
      {errorMsg && <p style={{ color: 'crimson' }}>{errorMsg}</p>}
    </div>
  );
}
