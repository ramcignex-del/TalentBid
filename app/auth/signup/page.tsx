// app/auth/signup/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '../../../lib/supabase/client';

export default function SignupPage() {
  const supabase = getBrowserSupabase();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // You can set an email redirect URL here if using magic links or email confirmations.
          // redirectTo: 'https://your-domain.com/welcome'
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // After signup, redirect candidate to profile setup
      // If your project requires email confirmation before accessing profile, you may want to show a "check email" screen instead.
      router.push('/profile/setup');
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '3rem auto', padding: '1rem' }}>
      <h1>Create account</h1>

      <form onSubmit={handleSignup} style={{ display: 'grid', gap: 12 }}>
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <button disabled={loading} style={{ padding: '0.6rem 1rem' }}>
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        {errorMsg && (
          <div role="alert" style={{ color: 'crimson' }}>
            {errorMsg}
          </div>
        )}
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <a href="/auth/login">Log in</a>
      </p>
    </div>
  );
}
