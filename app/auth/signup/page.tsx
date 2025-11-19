// app/auth/signup/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '../../../lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'talent' | 'employer'>('talent');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = getBrowserSupabase();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // Email confirmation is off in your Supabase settings, so user becomes signed-in immediately.
      if (role === 'talent') router.push('/profile/setup');
      else router.push('/employer/setup');
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
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </label>

        <label>
          Password
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </label>

        <label>
          I am a:
          <select value={role} onChange={(e) => setRole(e.target.value as any)} style={{ width: '100%', padding: 8 }}>
            <option value="talent">Talent</option>
            <option value="employer">Employer</option>
          </select>
        </label>

        <button disabled={loading} style={{ padding: '0.6rem 1rem' }}>
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        {errorMsg && <div style={{ color: 'crimson' }}>{errorMsg}</div>}
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <a href="/auth/login">Log in</a>
      </p>
    </div>
  );
}
