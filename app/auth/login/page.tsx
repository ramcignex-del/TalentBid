// app/auth/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '../../../lib/supabase/client';

export default function LoginPage() {
  const supabase = getBrowserSupabase();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // Successful login -> redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '3rem auto', padding: '1rem' }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <button disabled={loading} style={{ padding: '0.6rem 1rem' }}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        {errorMsg && (
          <div role="alert" style={{ color: 'crimson' }}>
            {errorMsg}
          </div>
        )}
      </form>

      <p style={{ marginTop: 12 }}>
        No account? <a href="/auth/signup">Sign up</a>
      </p>
    </div>
  );
}
