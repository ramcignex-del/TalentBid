// app/auth/logout/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '../../../lib/supabase/client';

export default function LogoutPage() {
  const supabase = getBrowserSupabase();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      router.replace('/auth/login');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 640, margin: '3rem auto', padding: '1rem' }}>
      <h1>Signing out…</h1>
      {errorMsg && <p style={{ color: 'crimson' }}>{errorMsg}</p>}
    </div>
  );
}
